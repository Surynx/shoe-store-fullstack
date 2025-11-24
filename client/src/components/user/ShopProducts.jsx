import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';
import Loading from './Loading';

function ShopProducts({ data, isLoading }) {

  const nav= useNavigate();
  const productsList = data?.data?.docs || [];

  const active_products= productsList.filter((product)=> product.status == true);
   
  const {pathname} = useLocation();

  if (isLoading) {
   return <Loading/>
  }

  return (
    <div>
        <Breadcrumb location={pathname}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-15 p-6">
          {active_products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={()=>nav(`/shop/product/${product._id}`)}
            >

              <div className="relative bg-gray-100 mb-3 overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={product.productImages[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* <button
                  className="absolute top-3 right-3 p-2 bg-white rounded-full hover:opacity-80 transition-opacity"
                >
                  <Heart size={18}/>
                </button> */}
              </div>

              <div className="flex flex-col px-1">
                
                <div className="text-black font-bold text-sm mb-1 line-clamp-2">
                  {product.name}
                </div>

                <div className="text-gray-500 text-sm font-sans mb-1">
                  {product.gender}'s Shoes
                </div>
                
                <div className="text-black flex items-center gap-1 text-sm font-md">
                {product?.total_stock != 0 ? `MRP :  ₹${product?.variant_array[0]?.sales_price}.00` : <span className="text-red-600 font-sans">Out of Stock</span>} 
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default ShopProducts