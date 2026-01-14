import mongoose from "mongoose";


export const connectDb= async()=> {
    try {

        await mongoose.connect(process.env.ATLAS_URL);
        console.log("Cluster connected successfully...✅")

    } catch(error){
        
        console.log("Cluster connection issue..❌",error);
    }
    
}