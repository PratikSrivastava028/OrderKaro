import ItemModel from "../models/Item.model.js";
import ShopModel from "../models/Shop.model.js";
import ErrorResponse from "../utils/ApiError.util.js";
import {
  deleteFromCloudinary,
  getDataURLFromFile,
  getPublicIdFromURL,
  uploadToCloudinary,
} from "../utils/cloudinary.util.js";

export const addItem = async (req, res, next) => {
  try {
    let { name, foodType, price, category, shopId } = req.body;

    let userId = req.user._id;
    let image;

    let shop = await ShopModel.findOne({ owner: userId });
    if (!shop)
      return next(new ErrorResponse(`Shop with ID ${shopId} not found`, 404));

    if (req.file) {
      let dataURL = getDataURLFromFile(req.file);
      image = await uploadToCloudinary(dataURL, next);
    }

    const newItem = await ItemModel.create({
      name,
      foodType,
      price,
      category,
      image: image || "example.jpg",
      shop: shopId,
      addedBy: userId,
    });

    shop.items.push(newItem._id);
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { createdAt: -1 } },
    });

    res.status(201).json({
      success: true,
      message: "Item added successfully",
      shop,
    });
  } catch (error) {
    next(error);
  }
};

export const editItem = async (req, res, next) => {
  try {
    const { name, foodType, price, category } = req.body;
    const itemId = req.params.itemId;
    let image;

    // 1. Fetch item and check existence
    const oldItem = await ItemModel.findById(itemId);
    if (!oldItem) {
      return next(new ErrorResponse(`Item with ID ${itemId} not found`, 404));
    }

    // 2. Authorization check: Ensure item belongs to the authenticated user's shop
    const shop = await ShopModel.findOne({ owner: req.user._id });
    if (!shop || oldItem.shop.toString() !== shop._id.toString()) {
      return next(
        new ErrorResponse("Unauthorized: You do not own this item", 403),
      );
    }

    // 3. Handle image update if a new file is uploaded
    if (req.file) {
      const dataURL = getDataURLFromFile(req.file);
      image = await uploadToCloudinary(dataURL, next);
      
      // Delete old image from Cloudinary if it exists
      if (oldItem.image && oldItem.image.includes("cloudinary")) {
        const publicId = getPublicIdFromURL(oldItem.image);
        await deleteFromCloudinary(publicId, next);
      }
    }

    // 4. Update the item
    const updateData = {
      name,
      foodType,
      price,
      category,
    };
    if (image) updateData.image = image;

    const updatedItem = await ItemModel.findByIdAndUpdate(
      itemId,
      updateData,
      { new: true, runValidators: true },
    );

    // 5. Fetch updated shop data with populated items
    const updatedShop = await ShopModel.findOne({ owner: req.user._id }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemsByShop = async (req, res, next) => {
  try {
    let shopId = req.params.shopId;

    const items = await ItemModel.find({ shop: shopId });
    res.status(200).json({
      success: true,
      message: "Items retrieved successfully",
      items,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    let itemId = req.params.itemId;

    const item = await ItemModel.findById(itemId);
    if (!item) {
      return next(new ErrorResponse(`Item with ID ${itemId} not found`, 404));
    }

    res.status(200).json({
      success: true,
      message: "Item retrieved successfully",
      item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return next(new ErrorResponse(`Item with ID ${itemId} not found`, 404));
    }
    const image = item.image;
    if (image.includes("cloudinary")) {
      const publicId = getPublicIdFromURL(image);
      await deleteFromCloudinary(publicId, next);
    }

    await ItemModel.findByIdAndDelete(itemId);

    const shop = await ShopModel.findOneAndUpdate(
      { owner: req.user._id },
      { $pull: { items: itemId } },
      { new: true },
    ).populate({
      path: "items",
      options: { sort: { createdAt: -1 } },
    });

    if (!shop.items || shop.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No items available in this shop.",
        shop: {
          ...shop.toObject(),
          items: [],
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      shop,
    });
  } catch (error) {
    next(error);
  }
};

export const getItemsByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const cityPattern = new RegExp(`^${city}$`, "i");
    const shops = await ShopModel.find({ city: cityPattern }).populate({
      path: "items",
    });

    if (shops.length === 0) {
      return next(new ErrorResponse(`No shops found in city ${city}`, 404));
    }

    const shopIds = shops.map((shop) => shop._id);
    const items = await ItemModel.find({ shop: { $in: shopIds } });

    if (items.length === 0) {
      return next(new ErrorResponse(`No items found in city ${city}`, 404));
    }

    res.status(200).json({
      success: true,
      message: "Items retrieved successfully",
      items,
    });
  } catch (error) {
    next(error);
  }
};
