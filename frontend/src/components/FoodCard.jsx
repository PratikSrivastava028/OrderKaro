import { useState } from "react";
import {
  FaDrumstickBite,
  FaLeaf,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/userSlice";
// import { addToCart } from "../redux/userSlice";

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  // console.log("cartItems: ", cartItems);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-400 text-xs" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400 text-xs" />
        ),
      );
    }
    return stars;
  };

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 0 ? q - 1 : 0));

  const isInCart = cartItems?.some((i) => i.id === data._id);

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(
        addToCart({
          id: data._id,
          name: data.name,
          price: data.price,
          image: data.image,
          shop: data.shop,
          quantity,
          foodType: data.foodType,
        }),
      );
    }
  };

  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 flex flex-col group">
      {/* Image */}
      <div className="relative w-full h-44 overflow-hidden bg-stone-100">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Veg / non-veg badge */}
        <div className="absolute top-3 left-3 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-500 text-xs" />
          ) : (
            <FaDrumstickBite className="text-red-500 text-xs" />
          )}
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {data.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name + rating */}
        <div>
          <h2 className="text-sm font-bold text-stone-900 truncate mb-1">
            {data.name}
          </h2>
          {data.shopName && (
            <p className="text-[10px] font-medium text-stone-400 truncate mb-1">
              🏪 {data.shopName}
            </p>
          )}
          <div className="flex items-center gap-1">
            {renderStars(data.rating?.average || 0)}
            <span className="text-[10px] text-stone-400 ml-0.5">
              ({data.rating?.count || 0})
            </span>
          </div>
        </div>

        {/* Price + cart controls */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-bold text-stone-900">
            ₹{data.price}
          </span>

          {/* Qty + add button */}
          <div className="flex items-center bg-stone-100 rounded-full overflow-hidden">
            <button
              className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-orange-500 transition-colors cursor-pointer"
              onClick={handleDecrease}
            >
              <FaMinus size={10} />
            </button>
            <span className="text-xs font-semibold text-stone-700 min-w-4 text-center">
              {quantity}
            </span>
            <button
              className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-orange-500 transition-colors cursor-pointer"
              onClick={handleIncrease}
            >
              <FaPlus size={10} />
            </button>
            <button
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                isInCart
                  ? "bg-stone-700 text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
              onClick={handleAddToCart}
            >
              <FaShoppingCart size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
