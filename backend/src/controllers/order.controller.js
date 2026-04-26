import OrderModel from "../models/order.model.js";
import ShopModel from "../models/Shop.model.js";
import ErrorResponse from "../utils/ApiError.util.js";

export const placeOrder = async (req, res, next) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await ShopModel.findById(shopId).populate("owner");

        if (!shop) {
          return next(
            new ErrorResponse(`Shop with id ${shopId} not found`, 404),
          );
        }

        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0,
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItems: items.map((item) => {
            console.log("item: ", item);
            return {
              item: item.id,
              price: item.price,
              quantity: item.quantity,
              name: item.name,
            };
          }),
        };
      }),
    );

    const newOrder = await OrderModel.create({
      user: req.user._id,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price",
    );
    await newOrder.populate("shopOrders.shop", "name");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// let groupItemsByShop = {
//   dominoesId: [itemId1, itemId2, item2],
//   pizzaHutId: [itemId3],
// };

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let orders = [];

    if (req.user.role === "user") {
      orders = await OrderModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");
    }

    if (req.user.role === "owner") {
      orders = await OrderModel.find({ "shopOrders.owner": userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user", "name email")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      // keep only this owner's shopOrders
      orders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        createdAt: order.createdAt,
        shopOrders: order.shopOrders.filter(
          (o) => o.owner.toString() === userId.toString(),
        ),
        deliveryAddress: order.deliveryAddress,
      }));
    }

    if (!orders || orders.length === 0) {
      return next(new ErrorResponse("No orders found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return next(new ErrorResponse("Order Not Found", 404));
    }

    const shopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId.toString(),
    );

    if (!shopOrder) {
      return next(new ErrorResponse("Shop Order Not Found", 404));
    }

    shopOrder.status = status;

    if (status === "delivered") {
      shopOrder.deliveredAt = new Date();
    }

    await order.save();

    //  populate from parent, NOT from subdocument
    await order.populate("shopOrders.shopOrderItems.item", "name image price");

    return res.status(200).json({
      success: true,
      message: "Status updated",
      shopOrder,
    });
  } catch (error) {
    next(error);
  }
};
