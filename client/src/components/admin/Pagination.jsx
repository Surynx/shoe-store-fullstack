import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="flex items-center justify-center mt-10 gap-1">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
        className="flex items-center justify-center px-2 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-3 h-3 mr-0.5" />
      </button>

      <div className="flex items-center gap-1 mx-1">
        
        {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((pageNum) => {
      
          const showPage =
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= page - 1 && pageNum <= page + 1);

        
          const showEllipsisBefore = pageNum === page - 2 && page > 3;
          const showEllipsisAfter = pageNum === page + 2 && page < totalPages - 2;

          if (showEllipsisBefore || showEllipsisAfter) {
            return (
              <span
                key={pageNum}
                className="px-2 py-1.5 text-xs font-medium text-gray-500"
              >
                ...
              </span>
            );
          }

          if (!showPage) return null;

          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`min-w-[32px] px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                page === pageNum
                  ? 'bg-gray-700 text-white hover:bg-gray-800'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="flex items-center justify-center px-2 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
      >
        {/* Next */}
        <ChevronRight className="w-3 h-3 ml-0.5" />
      </button>
    </div>
  );
}