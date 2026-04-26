function CategoryCard({ name, image, onClick, active }) {
  return (
    <div
      onClick={onClick}
      className={`w-[110px] sm:w-[130px] shrink-0 rounded-2xl overflow-hidden relative cursor-pointer group transition-all duration-300 ${
        active
          ? "shadow-xl shadow-orange-200 scale-105"
          : "shadow-sm hover:shadow-lg hover:shadow-orange-100 hover:scale-[1.03]"
      }`}
    >
      {/* Image */}
      <div className="w-full h-[110px] sm:h-[130px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          active
            ? "bg-gradient-to-t from-orange-500/80 via-orange-400/20 to-transparent"
            : "bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-orange-500/70 group-hover:via-orange-400/15"
        }`}
      />

      {/* Active ring */}
      {active && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-orange-500 ring-offset-1" />
      )}

      {/* Label */}
      <div className="absolute bottom-0 left-0 w-full px-2 py-2.5">
        <p
          className={`text-center text-[10px] font-bold uppercase tracking-[0.12em] truncate transition-colors duration-200 ${
            active ? "text-white" : "text-white group-hover:text-white"
          }`}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

export default CategoryCard;
