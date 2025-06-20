import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI=process.env.MONGODB_URI;
        if(!mongoURI){
            throw new Error('Mongo URI is missing in environment variable');
        }
        const connectionInstance= await mongoose.connect(mongoURI)
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`\nMongoDB connected! DB HOST: ${connectInstance.connection.host}`);
        process.exit(1);
    }
}

export default connectDB;