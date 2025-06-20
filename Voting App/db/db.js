import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(
      `\nMongoDB connected! DB HOST: ${connectInstance.connection.host}`
    );
    process.exit(1);
  }
};
