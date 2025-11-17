import ProductTable from '../../components/admin/ProductTable'
import { FaPlus } from 'react-icons/fa'
import SearchBox from '../../components/admin/SearchBox'
import Pagination from '../../components/admin/Pagination'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAllProduct } from '../../Services/admin.api'

function ProductManagment() { 

    const nav= useNavigate();

    const [ search,setSearch ] = useState("");
    const [ page,setPage ] = useState(1);
    
    const { data,isLoading } = useQuery({
        queryKey:["productInfo",search,page],
        queryFn:()=>getAllProduct(search,page)
    });

    const docs = data?.data?.docs;
    const total_doc = data?.data?.total_doc || 0;
    const limit = data?.data?.limit || 1;

    const totalPages=Math.ceil(total_doc/limit);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">  
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Product Managment</h1>
                <h6 className='text-xs font-bold mt-3 text-orange-600 animate-pulse'>Total Products:</h6>
                </div>
                <button
                    onClick={()=>nav("/admin/product/add")}
                    className="cursor-pointer flex items-center bg-green-800 text-white px-3 py-2 rounded-md hover:bg-green-900 transition text-xs font-bold"
                >
                    <FaPlus />  Add Product
                </button>
            </div>

            <SearchBox search={search} setSearch={setSearch}/>

            <ProductTable docs={docs} isLoading={isLoading}/>

            <Pagination page={page} setPage={setPage} totalPages={totalPages}/>
        </div>
  )
}

export default ProductManagment