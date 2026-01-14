import { useState } from "react";
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

export default function ProductGallery({ data }) {

    const productDoc= data?.data?.productDoc;
    
    const sampleImages = [...productDoc.productImages];

    const [active, setActive] = useState(0);

  return (
    <>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-3">
        {sampleImages.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => setActive(index)}
            className={`w-30 h-20 object-cover rounded cursor-pointer border ${
              active === index ? "border-black" : "border-gray-300"
            }`}
          />
        ))}
      </div>
        
      <div className="flex-1">
        <img
          src={sampleImages[active]}
          className="w-full h-100 object-cover"
        />
      </div>
      <Zoom>
        <img
        src={sampleImages[active]}
        alt="product"
        className="w-full h-auto object-cover"
        />
      </Zoom>
    </div>
    </>
  );
};
