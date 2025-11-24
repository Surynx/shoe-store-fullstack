
import { useEffect, useState } from 'react'
import CategoryList from '../../components/user/CategoryList'
import Filter from '../../components/user/Filter'
import ShopProducts from '../../components/user/ShopProducts'
import { getShopProductList } from '../../Services/user.api';
import { useQuery } from '@tanstack/react-query';
import SearchBox from '../../components/user/SearchBox';



function Shop() {

  const [ filterValue,setFilterValue ] = useState({});

  const [ filterCategory,setFilterCategory ]= useState([]);

  let [text,setText] = useState("");

  useEffect(()=>{
    setFilterValue({...filterValue,category:filterCategory,search:text});
  },[filterCategory,text]);

  const { data, isLoading } = useQuery({
    queryKey: ["shopProducts",filterValue,filterCategory],
    queryFn: ()=>getShopProductList(filterValue),
    keepPreviousData:true  
  });

  return (
     <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-serif text-center">Shop the Essentials</h2>
      <p className="text-center text-sm font-mono mt-2">
        Discover curated styles crafted to elevate your everyday look.
      </p>
      <SearchBox text={text} setText={setText}/>
      <CategoryList filterCategory={filterCategory} setFilterCategory={setFilterCategory} setFilterValue={setFilterValue} filterValue={filterValue}/>
      <div className="mt-10 flex gap-10">
        
        <Filter setFilterValue={setFilterValue}/>

        <div className="flex-1">
          <ShopProducts data={data} isLoading={isLoading}/>
        </div>
      </div>
    </div>
  )
}

export default Shop