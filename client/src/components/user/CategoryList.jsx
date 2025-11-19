import categoryQuery from "../../utils/user/categoryQuery";

function CategoryList({ filterCategory,setFilterCategory }) {

    const { data, isLoading } = categoryQuery();

    const categories= data?.data?.data || [];

    const handleClick= (category)=> {

      if(filterCategory.includes(category.name)) {

        const updatedCategory= filterCategory.filter((name)=> name != category.name);
        setFilterCategory(updatedCategory);

      }else {
        setFilterCategory([...filterCategory,category.name])
      }
    }
    

  return (
     <div className='w-full h-10 flex gap-3 items-center justify-center text-sm mt-8'>
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={()=>handleClick(category)}
          className={`border-2 px-4 py-2 rounded-3xl font-mono cursor-pointer 
             ${filterCategory.includes(category.name) ? "bg-black text-white border-black" : "text-gray-800"}
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryList