import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/slices/userSlice";

function CartItemCard({ data }) {
  const dispatch = useDispatch();

  const handleRemove = () => dispatch(removeFromCart(data.id));

  const handleIncrease = (id, currentQuantity) =>
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));

  const handleDecrease = (id, currentQuantity) => {
    if (currentQuantity <= 1) {
      // qty would hit 0 — remove from cart entirely
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  const isVeg = data.foodType === "veg";

  return (
    <div className="w-full flex items-stretch rounded-2xl overflow-hidden bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 group relative">
      {/* Left accent bar */}
      <div
        className={`w-1 shrink-0 ${isVeg ? "bg-green-400" : "bg-red-400"}`}
      />

      {/* Image */}
      <div className="w-20 sm:w-28 shrink-0 overflow-hidden bg-stone-100">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between px-3 py-3 sm:px-4 min-w-0">
        {/* Top */}
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                isVeg ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
              }`}
            >
              {isVeg ? "VEG" : "NON-VEG"}
            </span>
          </div>
          <h3 className="text-sm font-bold text-stone-900 leading-tight line-clamp-1 capitalize">
            {data.name}
          </h3>
          <p className="text-[10px] text-stone-400 mt-0.5 truncate">
            {data.shopName}
          </p>
        </div>

        {/* Bottom — qty + price */}
        <div className="flex items-center justify-between mt-2 gap-2">
          {/* Qty */}
          <div className="flex items-center rounded-xl overflow-hidden border border-stone-200">
            <button
              onClick={() => handleDecrease(data.id, data.quantity)}
              className={`w-7 h-7 flex items-center justify-center transition-colors cursor-pointer ${
                data.quantity === 1
                  ? "text-red-400 hover:bg-red-50 hover:text-red-500" // signals removal
                  : "text-stone-400 hover:bg-orange-50 hover:text-orange-500"
              }`}
              aria-label={
                data.quantity === 1 ? "Remove item" : "Decrease quantity"
              }
            >
              {data.quantity === 1 ? (
                <RiDeleteBin6Line size={10} />
              ) : (
                <FaMinus size={8} />
              )}
            </button>
            <span className="text-xs font-bold text-stone-800 px-2 border-x border-stone-200 h-7 flex items-center min-w-[28px] justify-center">
              {data.quantity}
            </span>
            <button
              onClick={() => handleIncrease(data.id, data.quantity)}
              className="w-7 h-7 flex items-center justify-center text-stone-400 hover:bg-orange-50 hover:text-orange-500 transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <FaPlus size={8} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            {data.quantity > 1 && (
              <p className="text-[11px] text-stone-400 leading-none mb-0.5">
                ₹{data.price} × {data.quantity}
              </p>
            )}
            <span className="text-sm font-black text-stone-900">
              ₹{data.price * data.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* Remove — top right */}
      <button
        onClick={handleRemove}
        className="shrink-0 self-start m-2 w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all duration-200 cursor-pointer"
        aria-label="Remove item"
      >
        <RiDeleteBin6Line size={13} />
      </button>
    </div>
  );
}

export default CartItemCard;
