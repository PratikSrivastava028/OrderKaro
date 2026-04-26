import ShopModel from "../models/Shop.model.js";
import ErrorResponse from "../utils/ApiError.util.js";
import {
  deleteFromCloudinary,
  getDataURLFromFile,
  getPublicIdFromURL,
  uploadToCloudinary,
} from "../utils/cloudinary.util.js";

export const createShop = async (req, res, next) => {
  try {
    let userId = req.user._id;
    const { name, city, address, state } = req.body;
    let image;
    if (req.file) {
      let dataURL = getDataURLFromFile(req.file);
      image = await uploadToCloudinary(dataURL, next);
    }
    const newShop = await ShopModel.create({
      name,
      city,
      address,
      state,
      image: image || "example.jpg",
      owner: userId,
    });

    res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop: newShop,
    });
  } catch (error) {
    next(error);
  }
};

export const editShop = async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const userId = req.user._id;
    const { name, city, address, state } = req.body;

    const shop = await ShopModel.findOne({ _id: shopId, owner: userId });
    if (!shop) {
      return next(
        new ErrorResponse(
          "Shop not found or you are not the owner of this shop",
          404,
        ),
      );
    }

    const updateData = { name, city, address, state };

    if (req.file) {
      const dataURL = getDataURLFromFile(req.file);
      const newImage = await uploadToCloudinary(dataURL, next);

      if (shop.image?.includes("cloudinary")) {
        const publicId = getPublicIdFromURL(shop.image);

        await deleteFromCloudinary(publicId, next);
      }

      updateData.image = newImage;
    }

    const updatedShop = await ShopModel.findByIdAndUpdate(shopId, updateData, {
      new: true,
    }).populate({
      path: "owner",
    });

    res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    next(error);
  }
};

export const getShop = async (req, res, next) => {
  let userId = req.user._id;
  try {
    const { shopId } = req.params;
    const shop = await ShopModel.findOne({
      owner: userId,
    })
      .populate({
        path: "owner",
      })
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });
    if (!shop) {
      return next(new ErrorResponse("Shop not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Shop retrieved successfully",
      shop,
    });
  } catch (error) {
    next(error);
  }
};

export const getShopByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    console.log("city: ", city);
    const cityPattern = new RegExp(`^${city}$`, "i");
    const shops = await ShopModel.find({ city: cityPattern })
      .populate({
        path: "owner",
      })
      .populate({
        path: "items",
        options: { sort: { createdAt: -1 } },
      });

    if (shops.length === 0) {
      return next(new ErrorResponse(`No shops found in city ${city}`, 404));
    }

    res.status(200).json({
      success: true,
      message: "Shops retrieved successfully",
      shops,
    });
  } catch (error) {
    next(error);
  }
};
