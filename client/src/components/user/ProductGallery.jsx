import { useState } from "react";

export default function ProductGallery({ data }) {

    const productDoc= data?.data?.productDoc;
    
    const sampleImages = [...productDoc.productImages];

    const [active, setActive] = useState(0);

  return (

    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex md:flex-col gap-3">
        {sampleImages.map((img, index) => (
          <img
            key={index}
            src={img}
            onClick={() => setActive(index)}
            className={`w-20 h-20 object-cover rounded cursor-pointer border ${
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
    </div>
  );
};
