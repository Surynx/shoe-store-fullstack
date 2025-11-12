import React from 'react'

function SearchBox({ search,setSearch }) {
  return (
    <div className="mb-6 flex gap-2">
        <input
          onChange={(e)=>setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 bg-white text-sm rounded-md focus:outline-none"
        />
        <button onClick={()=>setSearch("")} className='cursor-pointer px-2 py-1 border rounded-md  border-gray-300 text-sm font-bold text-red-400 bg-white hover:bg-gray-100'>Clear</button>
      </div>
  )
}

export default SearchBox