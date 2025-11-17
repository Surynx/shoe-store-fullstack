import Variant from "../models/variant.model.js";

const addVariant= async(req,res)=>{

    try{
    const {id} = req.params;
    const { discount,original_price,sales_price,size,stock }  = req.body;

    const doc= await Variant.findOne({product_id:id,size});

    if(doc) {
        return res.status(409).send({message:"Size Already Exist!"});
    }

    await Variant.create({
        product_id:id,
        size,
        stock,
        original_price,
        sales_price,
        discount
    });

    return res.status(200).send({message:"Variant Added!"});

} catch(error) {
    console.log("Error in Add variant",error);
}
}

const fetchVariant= async(req,res)=>{
    try{
    const {id}= req.params;

    const variantDocs= await Variant.find({product_id:id});

    return res.status(200).send({variantDocs});

    }catch(error) {

        console.log("Error in fetchvarient");
    }
}

const removeVariant= async(req,res)=> {

    try{
        const {id} = req.params;
        let doc= await Variant.deleteOne({_id:id});

        if(doc) {
            return res.status(200).send({message:"Varient Removed!"});
        }


    }catch(error) {
        console.log("Error in removeVarient",error);
    }
}

const updateVariant= async(req,res)=> {

    try{

        const {id} = req.params;
        const { discount,original_price,sales_price,size,stock }= req.body;

        await Variant.updateOne({product_id:id,size:size},{
            stock,
            original_price,
            sales_price,
            discount
        });

        return res.status(200).send({message:"Varient Updated"});

    }catch(error) {
        console.log(error);
    }
}

export { addVariant,fetchVariant,removeVariant,updateVariant }