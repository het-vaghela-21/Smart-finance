import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

// Use a cached connection across hot-reloads in development
let cached = (global as unknown as { __mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).__mongoose;

if (!cached) {
    cached = (global as unknown as { __mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).__mongoose = { conn: null, promise: null };
}

export async function connectMongo() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
