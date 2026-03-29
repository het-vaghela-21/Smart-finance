import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/models/User";
import { encrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
    try {
        const { uid, name, email, phone, provider, role, password } = await req.json();

        if (!uid || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectMongo();

        const encryptedPassword = provider === "email" ? encrypt(password || "") : "";

        // Upsert — update if exists, insert if not. Search by EMAIL so we catch legacy or seeded accounts.
        await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                $setOnInsert: { createdAt: new Date() },
                $set: {
                    uid,
                    name: name || "",
                    phone: phone || "",
                    provider: provider || "email",
                    role: role || "user",
                    encryptedPassword,
                },
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        const e = err as Error;
        console.error("[users/sync]", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
