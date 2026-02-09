export default function SizeSelector() {
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  
    return (
      <div>
        <h3 className="text-sm mb-3 tracking-wide opacity-80">
          Size
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              className="
                border border-white/70
                py-2
                text-sm
                tracking-wide
                hover:bg-white hover:text-black
                transition
              "
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
}
  