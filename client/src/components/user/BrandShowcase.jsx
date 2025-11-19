import brandQuery from "../../utils/user/brandQuery";

function BrandShowcase() {

  const { data, isLoading } = brandQuery();

  const brandList = data?.data?.data || [];
  
  const active_brands= brandList.filter((brand)=>brand.status == true);

  return (
    <section className="bg-gray-100 py-15 sm:py-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-black mb-2 text-center">
            Featured Brands
          </h2>
          <p className="text-center text-sm font-sans mb-10">
            Shop from the world's leading brands
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-6 sm:gap-8">
          {active_brands.map((brand) => (
            <div key={brand.id} className="group cursor-pointer">
              <div className="bg-gray-700 rounded-b-full p-1 flex items-center justify-center aspect-square">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full rounded-b-full object-contain group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <p className="text-center mt-3 text-sm font-bold text-gray-700 group-hover:text-black transition-colors">
                {brand.name}
              </p>
            </div>
          ))}
        </div>

        {brandList.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands available</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default BrandShowcase;
