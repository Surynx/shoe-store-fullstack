import { Search, X } from 'lucide-react'
import React, { useState } from 'react'

function SearchBox({text,setText}) {

  return (
    <div className='flex items-center w-full justify-center m-5'>
      <div className='border-2 w-100 flex px-2 py-1  text-gray-500 rounded-2xl'>
        <Search size={19} className='mt-0.5'/>
        <input className='px-2 text-gray-500 w-full outline-none' value={text } placeholder='Search For Products...' onChange={(e)=>setText(e.target.value)}></input>
        {text != "" ? <X size={20} className='mt-0.5 cursor-pointer' onClick={()=>setText("")}/> : null}
      </div>
    </div>
  )
}

export default SearchBox