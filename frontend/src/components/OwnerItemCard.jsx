import { useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ITEM_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { setShopData } from "../redux/slices/ownerSlice";

function OwnerItemCard({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      let result = await axiosInstance.delete(
        ITEM_ROUTES.DELETE_ITEM(data._id),
      );
      toast.success(result.data.message);
      dispatch(setShopData(result.data.shop));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full flex items-stretch bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 group">
      {/* Image */}
      <div className="w-24 sm:w-32 shrink-0 overflow-hidden bg-stone-100 relative">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className={`absolute top-2 left-2 w-4 h-4 rounded-full border-2 border-white shadow-sm ${data.foodType === "veg" ? "bg-green-500" : "bg-red-500"}`}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 px-4 py-3.5 sm:px-5 min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-orange-400">
              {data.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-200" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
              {data.foodType}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h2 className="text-sm sm:text-base font-bold text-stone-900 leading-snug truncate">
              {data.name}
            </h2>
            <span className="shrink-0 text-sm font-bold text-orange-500">
              ₹{data.price}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400 hover:text-orange-500 hover:bg-orange-50 px-3 py-1.5 rounded-full border border-stone-200 hover:border-orange-200 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => navigate(`/edit-item/${data._id}`)}
            disabled={deleting}
          >
            <FaPen size={10} />
            Edit
          </button>

          <button
            className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
              deleting
                ? "text-red-300 bg-red-50 border-red-100 cursor-not-allowed"
                : "text-stone-400 hover:text-red-500 hover:bg-red-50 border-stone-200 hover:border-red-200"
            }`}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <svg
                  className="animate-spin w-3 h-3 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <FaTrashAlt size={10} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OwnerItemCard;
