import { Sparkles, Tag } from "lucide-react";

export default function OfferBanner({ bestOffer }) {
  return (
    <div className="mt-13 p-3 rounded-md border border-green-600 bg-gradient-to-br from-green-50 via-white to-emerald-50 ml-23 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-40"></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-green-600 p-1 rounded">
              <Tag size={14} className="text-white" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-gray-900">
              {bestOffer.title}
            </h2>
          </div>

          <p className="text-gray-700 text-xs leading-5 mb-2">
            Exclusive offer available for a limited time. Grab yours before it
            runs out.
          </p>

          <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
            <Sparkles size={12} />
            <span>Only a few left in stock!</span>
          </div>
        </div>

        <div className="ml-3 flex flex-col items-end gap-1">
          <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {bestOffer.type === "percentage"
              ? `${bestOffer.value}% OFF`
              : `₹${bestOffer.value} FLAT OFF`}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            Hurry up!
          </span>
        </div>
      </div>
    </div>
  );
}
