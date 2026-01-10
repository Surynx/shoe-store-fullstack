import brandQuery from "../../utils/user/brandQuery";
import Loading from "./Loading";

function BrandShowcase() {

  const { data, isLoading } = brandQuery();

  const brandList = data?.data?.data || [];

  const active_brands = brandList.filter((brand) => brand.status == true);

  if(isLoading) {
    return <Loading/>
  }

  return (
    <section className="bg-gray-100 w-full py-15 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-sans font-semibold text-gray-900">
            Featured Brands
          </h2>
          <p className="mt-2 text-xs font-sans text-gray-500">
            Shop from the world's leading brands
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-center items-center">
          {active_brands.map((brand) => (
            <div
              key={brand.id}
              className="mx-auto flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <div className="w-24 h-24 bg-white rounded-full shadow-sm p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain rounded-full"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-700 group-hover:text-black transition-all">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandShowcase;
