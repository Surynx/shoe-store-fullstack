import { ArrowBigRight } from 'lucide-react'
import React from 'react'

function Pagination({ page,setPage,totalPages }) {
  return (
    <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page == 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-2  bg-gray-50 text-gray-500 rounded-sm border disabled:opacity-50 font-bold text-xs cursor-pointer"
        >
          <span>&lt;</span> 
        </button>

        <span className="my-auto px-2 py-1 font-bold text-xs text-gray-800">
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page == totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-2  bg-gray-50 text-gray-500 rounded-sm border disabled:opacity-50 font-bold text-xs cursor-pointer"
        >
          <span>&gt;</span> 
        </button>
      </div>
  )
}

export default Pagination