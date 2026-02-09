export default function ColourSelector() {
    return (
      <div>
        <h3 className="text-sm mb-2 tracking-wide opacity-80">
          Color
        </h3>
  
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="color"
              className="accent-white"
            />
            Black
          </label>
  
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="color"
              className="accent-white"
              defaultChecked
            />
            White
          </label>
        </div>
      </div>
    );
}  