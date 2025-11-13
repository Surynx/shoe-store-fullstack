import mongoose from "mongoose";


export const connectDb= async()=> {
    try {

        await mongoose.connect(process.env.AtlasUrl);
        console.log("Cluster connected successfully...✅")

    } catch(error){
        
        console.log("Cluster connection issue..❌",error);
    }
    
}