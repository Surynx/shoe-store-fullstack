import { Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage"

export const OfferModal = ({ isOpen, onClose, item, addOffer, removeOffer, data }) => {

  const { reset,register,handleSubmit,formState: { errors }} = useForm();

  const offers = data?.data?.offerDocs || [];

  if (!isOpen){
     return null
  }

  const handleClose= ()=> {

    reset();
    onClose();
  }

  const handleAddOffer= (data)=> {

    reset();
    addOffer(data);
  }

  return (
    <div className="fixed inset-0 flex items-center bg-black/50 justify-center z-50">
      <div className="bg-white max-w-2xl rounded-sm p-6 relative text-sm">

        <button className="absolute top-4 right-4 text-gray-600 cursor-pointer" onClick={handleClose}>
          ✕
        </button>

        <h2 className="text-lg font-sans mb-4 flex items-center gap-2">
          <Tag size={20} /> Offer - 
          <span className="text-blue-600 text-md font-sans">{item?.name}</span>
        </h2>

        <h3 className="text-md font-semibold mb-2">Current Offers</h3>

        <div className="space-y-3">
          {offers.length === 0 && (
            <p className="text-gray-400 italic text-sm">No offers available.</p>
          )}

          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-gray-100 px-4 py-3 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold capitalize">{offer.title}</p>
                <p className="text-sm text-gray-700">
                  {offer.value}
                  {offer.type === "percentage" ? "% off" : " flat"} • Valid until:{" "}
                  <span className="font-semibold">
                    {offer.end_date?.substring(0, 10)}
                  </span>
                </p>
              </div>

              <button
                onClick={() => removeOffer(offer._id)}
                className="text-red-600 text-lg hover:text-red-800 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Add New Offer</h3>

        <form className="space-y-4" onSubmit={handleSubmit(handleAddOffer)}>

          <div>
            <label className="font-medium">Offer Name</label>
            <input
              type="text"
              className="w-full border h-9 px-3"
              placeholder="e.g., Diwali Sale"
              {...register("title", {
                required: "Offer title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" }
              })}
            />
            <ErrorMessage elem={errors.title} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Discount Type</label>
              <select
                className="w-full border h-8 px-3"
                {...register("type", { required: "Select discount type" })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount</option>
              </select>
              <ErrorMessage elem={errors.type} />
            </div>

            <div>
              <label className="font-medium">Value</label>
              <input
                type="number"
                className="w-full border h-8 px-3"
                placeholder="20"
                {...register("value", {
                  required: "Discount value is required",
                  min: { value: 1, message: "Value must be greater than zero" }
                })}
              />
              <ErrorMessage elem={errors.value} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Start Date</label>
              <input
                type="date"
                className="w-full border h-8 px-2"
                {...register("start_date", {
                  required: "Start date is required"
                })}
              />
              <ErrorMessage elem={errors.start_date} />
            </div>

            <div>
              <label className="font-medium">End Date</label>
              <input
                type="date"
                className="w-full border h-8 px-2"
                {...register("end_date", {
                  required: "End date is required"
                })}
              />
              <ErrorMessage elem={errors.end_date} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="w-full h-9 border border-gray-700 text-black flex items-center justify-center gap-2 font-sans cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full h-9 bg-green-700 text-white flex items-center justify-center gap-2 font-sans cursor-pointer"
            >
              Add Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
