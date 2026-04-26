import { useRef, useState } from "react";
import { FaUtensils } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ITEM_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { setShopData } from "../redux/slices/ownerSlice";

// ── Matches mongoose enum exactly ────────────────────────────────
// enum: ["snacks","main-course","desserts","pizza","burgers",
//        "sandwiches","south-indian","north-indian","chinese","fast-food","others"]
const FOOD_CATEGORIES = [
  { label: "Snacks", value: "snacks" },
  { label: "Main Course", value: "main-course" },
  { label: "Desserts", value: "desserts" },
  { label: "Pizza", value: "pizza" },
  { label: "Burgers", value: "burgers" },
  { label: "Sandwiches", value: "sandwiches" },
  { label: "South Indian", value: "south-indian" },
  { label: "North Indian", value: "north-indian" },
  { label: "Chinese", value: "chinese" },
  { label: "Fast Food", value: "fast-food" },
  { label: "Others", value: "others" },
];

// ── Matches mongoose enum exactly ────────────────────────────────
// enum: ["veg", "non-veg"]
const FOOD_TYPES = [
  { val: "veg", label: "🥦 Veg" },
  { val: "non-veg", label: "🍗 Non-Veg" },
];

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shopData } = useSelector((state) => state.owner);

  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [category, setCategory] = useState(""); // sends e.g. "main-course"
  const [foodType, setFoodType] = useState("veg"); // sends "veg" | "non-veg"

  const handleImage = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category); // e.g. "main-course"
      formData.append("foodType", foodType); // "veg" | "non-veg"
      formData.append("price", price);
      formData.append("shopId", shopData._id);
      if (uploadedImage) formData.append("image", uploadedImage);
      const result = await axiosInstance.post(ITEM_ROUTES.ADD_ITEM, formData);
      dispatch(setShopData(result.data.shop));
      navigate("/");
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 flex flex-col items-center px-4 py-10">
      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          className="flex items-center gap-1.5 text-stone-400 hover:text-orange-500 transition-colors cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <IoIosArrowRoundBack
            size={20}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-xs font-medium uppercase tracking-widest">
            Back
          </span>
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-sm p-7 sm:p-9">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-400 mb-1">
            Menu Management
          </p>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Add food item
          </h1>
          <p className="mt-1.5 text-sm text-stone-400">
            Fill in the details to add a new item to your menu.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-2">
              Item Name
            </label>
            <input
              type="text"
              placeholder="e.g. Paneer Butter Masala"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-2">
              Food Image
            </label>
            <div
              onClick={() => fileRef.current.click()}
              className="w-full h-36 rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 hover:border-orange-300 hover:bg-orange-50/30 transition-all duration-200 cursor-pointer overflow-hidden flex items-center justify-center relative"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-300">
                  <FaUtensils size={20} />
                  <span className="text-xs font-medium">
                    Click to upload image
                  </span>
                </div>
              )}
              {previewImage && (
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold uppercase tracking-widest">
                    Change
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                min={0}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-2">
                Category
              </label>
              <select
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-200 cursor-pointer"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="" disabled>
                  Select…
                </option>
                {FOOD_CATEGORIES.map(({ label, value }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Food type toggle */}
          <div>
            <label className="block text-[10px] font-semibold text-stone-400 uppercase tracking-[0.15em] mb-3">
              Food Type
            </label>
            <div className="flex bg-stone-100 rounded-xl p-1 gap-1">
              {FOOD_TYPES.map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFoodType(val)}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    foodType === val
                      ? "bg-white text-orange-500 shadow-sm shadow-stone-200"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-orange-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-sm mt-2"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
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
                Adding item…
              </span>
            ) : (
              "Add Item →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
