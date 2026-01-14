import STATUS from "../../constants/status.constant.js";
import Address from "../../models/address.model.js";
import User from "../../models/user.model.js";

const addNewAddress= async (req,res) => {
    
    try{

    const {  name,type,line1,line2,city,state,pin_code,phone,isDefault }= req.body;

    const email=req.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(STATUS.ERROR.NOT_FOUND).json({ success:false,message: "User not found" });
    }

    const newAddress = await Address.create({
      user_id: user._id,
      name,
      type,
      line1,
      line2,
      city,
      state,
      pin_code,
      phone
    });

    if(isDefault) {

      await Address.updateMany({user_id:user._id},{isDefault:false});

      newAddress.isDefault = true;
      await newAddress.save();
    }

    return res.status(STATUS.SUCCESS.CREATED).json({ success:true,message:"Address Added Successfully" });

  } catch (error) {

    console.log("Add address error:", error);
  }

}

const fetchAddress= async(req,res)=> {

    try{
    const email= req.email;

    const user= await User.findOne({email});

    if (!user) {
      return res.status(STATUS.ERROR.NOT_FOUND).json({ success:false,message: "User not found" });
    }

    const docs= await Address.find({user_id:user._id}).sort({isDefault:-1,createdAt:-1});

    if(docs) {

        return res.status(STATUS.SUCCESS.OK).send({docs});
    }
    }catch(error) {

        console.log("error in fetch address",error);
    }

}

const removeAddress= async(req,res)=> {

    try{
    const {id}= req.params;

    const address = await Address.findOne({ _id: id });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    await Address.deleteOne({ _id: id });

    return res.status(STATUS.SUCCESS.OK).json({ success:true });

    }catch(error) {
        console.log("error in removeaddress");
    }   

}

const editAddress= async (req,res) => {
   
    try{

    const email= req.email;

    const user= await User.findOne({email});

    const {id}= req.params;

    const {  name,type,line1,line2,city,state,pin_code,phone,isDefault }= req.body;

    if(isDefault) {

      await Address.updateMany({user_id:user._id},{isDefault:false});

    }

    const updated = await Address.findOneAndUpdate({ _id: id },{
        name,
        type,
        line1,
        line2,
        city,
        state,
        pin_code,
        phone,
        isDefault
      });

    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }

    return res.status(200).json({ success:true,message: "Address updated successfully" });

  } catch (error) {
    console.log("Edit address error:", error);

  }
}

export { addNewAddress,fetchAddress,removeAddress,editAddress }