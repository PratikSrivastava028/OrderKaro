import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "snacks",
        "main-course",
        "desserts",
        "pizza",
        "burgers",
        "sandwiches",
        "south-indian",
        "north-indian",
        "chinese",
        "fast-food",
        "others",
      ],
      required: true,
      lowercase: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
      lowercase: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  { timestamps: true },
);

const ItemModel = mongoose.model("Item", itemSchema);

export default ItemModel;
