import { Filter } from "lucide-react";
import categoryQuery from "../../utils/user/categoryQuery";
import Loading from "./Loading";

function CategoryList({
  filterCategory,
  setFilterCategory,
  setFilterValue,
  filterValue
}) {
  const { data, isLoading } = categoryQuery();

  const categories = data?.data?.data || [];
  const active_categories = categories.filter(c => c.status);

  const handleClick = (category) => {
    if (filterCategory.includes(category.name)) {
      setFilterCategory(
        filterCategory.filter(name => name !== category.name)
      );
    } else {
      setFilterCategory([...filterCategory, category.name]);
    }
  };

  /* 🔥 FIX: always MERGE sort */
  const handleSort = (value) => {
    setFilterValue(prev => ({
      ...prev,
      sort: value
    }));
  };

  if (isLoading) return <Loading />;

  return (
    <div className="relative">
      <div className="w-full h-10 flex gap-3 items-center justify-center text-sm mt-8">
        {active_categories.map(category => (
          <button
            key={category._id}
            onClick={() => handleClick(category)}
            className={`border-2 px-4 py-2 rounded-3xl font-mono cursor-pointer 
              ${
                filterCategory.includes(category.name)
                  ? "bg-black text-white border-black"
                  : "text-gray-800"
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="absolute right-0 mt-8 border rounded-lg px-1 text-xs font-semibold py-1 flex">
        <Filter size={15} />
        <select
          className="outline-none"
          onChange={(e) => handleSort(e.target.value)}
          value={filterValue.sort || ""}
        >
          <option value="">Sort By</option>
          <option value="priceLtoH">Price Low to High</option>
          <option value="priceHtoL">Price High to Low</option>
          <option value="atoz">aA to zZ</option>
          <option value="ztoa">zZ to aA</option>
        </select>
      </div>
    </div>
  );
}

export default CategoryList;
