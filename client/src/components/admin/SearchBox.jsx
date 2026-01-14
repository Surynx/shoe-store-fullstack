function SearchBox({ search,setSearch }) {  

  return (
    <div className="mb-6 flex gap-2">
        <input
          onChange={(e)=>setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border-2 bg-white text-sm rounded-md focus:outline-none"
        />
        <button onClick={()=>setSearch("")} className='cursor-pointer px-2 py-2 border rounded-md  border-gray-300 text-sm font-thin text-white bg-gray-800 hover:bg-gray-900'>Clear</button>
      </div>
  )
}

export default SearchBox