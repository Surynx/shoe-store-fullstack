import STATUS from "../../constants/status.constant.js";
import Offer from "../../models/offer.model.js";

const addNewOfferForCategory= async (req,res) => {

    try{
    
    const data= req.body;
    const {id}= req.params;

    const { title,type,value }= req.body;

    const start_date= new Date(data.start_date);
    const end_date= new Date(data.end_date);

    if( start_date >= end_date ){
        res.status(STATUS.ERROR.BAD_REQUEST).send({message:"Give a valid End Date!"});
    }

    await Offer.create({
        apply_for:"category",
        category_id:id,
        title,
        type,
        value,
        start_date,
        end_date,
        createdAt:Date.now()
    });

    res.status(STATUS.SUCCESS.CREATED).send({success:true});

    }catch(err) {

        console.log("Error in Add new category offer");
    }
}

const getAllOfferOfCategory= async (req,res) => {

    try{
    const {id}= req.params;

    const offerDocs= await Offer.find({category_id:id});
  
    return res.status(STATUS.SUCCESS.OK).send({offerDocs});

    }catch(err) {
        console.log("Error in get all offer for category!");
    }

}

const removeOffer= async(req,res) => {

    const {id}= req.params;

    await Offer.deleteOne({_id:id});

    return res.status(STATUS.SUCCESS.OK).send({success:true});

}

const addNewOfferForProduct= async (req,res) => {
    
    try{
    
    const data= req.body;
    const {id}= req.params;

    const { title,type,value }= req.body;

    const start_date= new Date(data.start_date);
    const end_date= new Date(data.end_date);

    if( start_date >= end_date ){
        res.status(STATUS.ERROR.BAD_REQUEST).send({message:"Give a valid End Date!"});
    }

    await Offer.create({
        apply_for:"product",
        product_id:id,
        title,
        type,
        value,
        start_date,
        end_date,
        createdAt:Date.now()
    });

    res.status(STATUS.SUCCESS.CREATED).send({success:true});

    }catch(err) {

        console.log("Error in Add new Product offer");
    }
}

const getAllOfferOfProduct= async (req,res) => {

    try{
    const {id}= req.params;

    const offerDocs= await Offer.find({product_id:id});
  
    return res.status(STATUS.SUCCESS.OK).send({offerDocs});

    }catch(err) {
        console.log("Error in get all offer for product!");
    }

}

export { addNewOfferForCategory,getAllOfferOfCategory,removeOffer,addNewOfferForProduct,getAllOfferOfProduct }