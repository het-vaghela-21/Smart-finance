import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ILoginEvent {
    timestamp: Date;
    ip: string;
    city: string;
    country: string;
    device: string;
}

export interface IUser extends Document {
    uid: string;          // Firebase UID
    name: string;
    email: string;
    phone: string;
    provider: "email" | "google";
    role: "user" | "admin";
    encryptedPassword: string;  // AES-256 encrypted — empty for Google users
    loginHistory: ILoginEvent[];
    createdAt: Date;
    updatedAt: Date;
}

const LoginEventSchema = new Schema<ILoginEvent>({
    timestamp: { type: Date, default: Date.now },
    ip: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    device: { type: String, default: "" },
});

const UserSchema = new Schema<IUser>(
    {
        uid: { type: String, required: true, unique: true },
        name: { type: String, default: "" },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String, default: "" },
        provider: { type: String, enum: ["email", "google"], default: "email" },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        encryptedPassword: { type: String, default: "" },
        loginHistory: { type: [LoginEventSchema], default: [] },
    },
    { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
