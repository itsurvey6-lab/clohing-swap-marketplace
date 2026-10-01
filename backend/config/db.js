import mongoose from "mongoose"
import dotenv from "dotenv";

// async used for await inside the function 

dotenv.config();

const connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

}

export default connectDB;