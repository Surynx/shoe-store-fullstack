import Category from "../models/category.model.js";

const addcategory= async(req,res)=> {

    try{
    const { name,description,status } = req.body;
    let doc = await Category.findOne({name:{$regex:name,$options:"i"}});

    if(!doc) {
        await Category.create({
        name,
        description,
        status
    });
       
        return res.status(200).send({success:true,message:"New Category Added!"});
    }

    return res.status(409).send({success:false,message:"Category already exists!"});
    }catch(error) {
        console.log("Error in adding category");
    }

    
}

const fetchCategory= async (req,res)=>{

    try {
        const{search,page}= req.query

        const query= search ? {name:{ $regex:search,$options:"i" }} : {};
        const limit=5;
        const skip= (Number(page)-1)*limit;

        const total_doc= await Category.countDocuments(query);
        const docs= await Category.find(query).sort({createdAt:-1}).skip(skip).limit(limit);

        return res.status(200).send({docs,total_doc,limit});

    } catch (error) {
        console.log("Error in fetching category");
    }
}

const editCategory= async(req,res) =>{
    let {id,data}= req.body;
    try{

        let doc= await Category.findOne({name:{$regex:data.name,$options:"i"},_id:{$ne:id}});

        if(doc) {
            return res.status(409).send({success:false,message:"Category already exists!"});
        }

        await Category.updateOne({_id:id},{
            name:data.name,
            description:data.description,
            status:data.status
        });

        return res.status(200).send({success:true,message:"Category Updated"});

    }catch(error) {
        console.log("Error in editCategory",error);
    }
}

export { addcategory,fetchCategory,editCategory }