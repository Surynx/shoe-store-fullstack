import { useEffect, useState } from "react";
import { useForm,useWatch } from "react-hook-form";
import brandQuery from "../../utils/user/brandQuery";
import { Scale, Scale3DIcon } from "lucide-react";

export default function FilterSidebar({setFilterValue}) {


  const { register,control } = useForm({defaultValues: {
      gender: [],
      brand: [],
      type: [],
      price: 0,
      size: "",
    },
  });

  //fetching brand.
  const { data, isLoading } = brandQuery();
  const brandList = data?.data?.data || [];
  const active_brands= brandList.filter((brand)=>brand.status == true);

  const filterObject = useWatch({control});

  useEffect(()=> {
    setFilterValue(filterObject);
    setPriceRange(10000-(filterObject.price));
  },[filterObject]);

  const [priceRange,setPriceRange] = useState(0);

  return (
    <div className="w-60 h-220 bg-white border rounded-xl p-5 space-y-6 text-gray-900 sticky top-5">
      <div>
        <h3 className="text-sm font-semibold mb-3">Gender</h3>
        <div className="space-y-3">
          {["Male", "Female", "Unisex"].map((g) => (
            <label key={g} className="flex items-center gap-3 cursor-pointer">
              <input
                value={g}
                type="checkbox"
                className="custom-checkbox"
                {...register("gender")}
              />
              <span className="text-sm">{g}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Brand</h3>
        <div className="space-y-3">
          {active_brands.map((b) => (
            <label key={b._id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                value={b.name}
                className="custom-checkbox"
                {...register("brand")}
              />
              <span className="text-sm">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Price</h3>

        <input
          type="range"
          min={0}
          max={10000}
          className="w-full accent-black cursor-pointer"
          {...register("price")}
        />

        <div className="flex justify-between text-xs text-gray-700 mt-1">
          <span className="font-semibold">Price Range : <span className="text-red-700">₹{priceRange}</span></span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Types</h3>
        <div className="space-y-3">
          {["Sneakers", "Loafers", "Sports", "Lifestyle", "Running"].map(
            (c) => (
              <label key={c} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={c}
                  className="custom-checkbox"
                  {...register("type")}
                />
                <span className="text-sm">{c}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Size</h3>
        <select {...register("size")} className="px-2 py-1.5 rounded-2xl w-full bg-gray-600 text-white text-sm outline-none">
          <option value="">Select Size</option>
          {["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 10"].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        
      </div>
    </div>
  );
}
