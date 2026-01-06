import { useQuery } from "@tanstack/react-query";
import ProductDetail from "../../components/user/ProductDetail";
import ProductGallery from "../../components/user/ProductGallery";
import { getProductData } from "../../Services/user.api";
import { useLocation, useParams } from "react-router-dom";
import RelatedProducts from "../../components/user/RelatedProducts";
import Breadcrumb from "../../components/user/Breadcrumb";
import Loading from "../../components/user/Loading";
import ProductReview from "../../components/user/ProductReview";
import OfferBanner from "../../components/user/OfferBanner";
import { useState } from "react";
import { useEffect } from "react";
import { findBestOffer } from "../../math/offer.math.js";

export default function Product() {

  const { pathname } = useLocation();

  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["productData", id, pathname],
    queryFn: () => getProductData(id),
  });

  const productDoc = data?.data?.productDoc;

  const variant_array = data?.data?.variant_array || [];

  const [activeVariant, setActiveVariant] = useState(null);

  useEffect(() => {

    if (variant_array.length > 0) {
      setActiveVariant(variant_array[0]);
    }

  }, [variant_array]);

  const [bestOffer,setBestOffer]= useState(null);

  useEffect(()=> {

    if(activeVariant) {

      const offers= data?.data?.offers;
      setBestOffer(findBestOffer(offers,activeVariant?.sales_price));
    }

  },[activeVariant]);
  

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-white text-black px-30">
      <Breadcrumb location={pathname} product={productDoc} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-2 gap-10">
        <div>
          <ProductGallery data={data} />
          {bestOffer && <OfferBanner bestOffer={bestOffer} />}
        </div>
        <ProductDetail
          data={data}
          activeVariant={activeVariant}
          setActiveVariant={setActiveVariant}
          bestOffer= {bestOffer}
        />
      </div>
      <ProductReview />
      <RelatedProducts data={data} />
    </div>
  );
}
