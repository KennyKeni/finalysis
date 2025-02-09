// lib/mongoose.js
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
    throw new Error('Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
};

let isConnected = false; 

async function connectToDatabase() {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return mongoose.connection;
    }

    try {
        const db = await mongoose.connect(uri, options);
        isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB with Mongoose");
        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}

export { connectToDatabase };
