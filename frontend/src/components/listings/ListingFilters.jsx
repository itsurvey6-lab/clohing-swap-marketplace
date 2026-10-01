function ListingFilters({
  filters,
  setFilters,
  onClear
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">

      <div className="flex flex-wrap items-end gap-4">

        {/* CATEGORY */}
        <div className="flex-1 min-w-[150px]">

          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Category
          </label>

          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="">All categories</option>
            <option value="Dress">Dresses</option>
            <option value="Shirt">Shirts</option>
            <option value="Jacket">Jackets</option>
            <option value="Pants">Pants</option>
            <option value="Skirt">Skirts</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

        </div>


        {/* SIZE */}
        <div className="flex-1 min-w-[120px]">

          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Size
          </label>

          <select
            name="size"
            value={filters.size}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="">All sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

        </div>


        {/* CONDITION */}
        <div className="flex-1 min-w-[150px]">

          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Condition
          </label>

          <select
            name="condition"
            value={filters.condition}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="">Any condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>

        </div>


        {/* SORT */}
        <div className="flex-1 min-w-[170px]">

          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Sort
          </label>

          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-green-600"
          >
            <option value="">Newest</option>
            <option value="low">Value: Low to High</option>
            <option value="high">Value: High to Low</option>
          </select>

        </div>


        {/* CLEAR */}
        <button
          onClick={onClear}
          className="px-5 py-3 rounded-xl border border-stone-200 text-gray-600 hover:bg-stone-50 transition"
        >
          Clear
        </button>

      </div>

    </div>
  );
}

export default ListingFilters;