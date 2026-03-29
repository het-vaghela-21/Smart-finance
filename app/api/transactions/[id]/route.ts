import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";

const verifyAuth = (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;
    return authHeader.split(" ")[1];
};

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const uid = verifyAuth(req);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = params;
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await connectMongo();

        // Ensure the transaction belongs to the user
        const tx = await Transaction.findOneAndDelete({ _id: id, userId: uid });

        if (!tx) {
            return NextResponse.json({ error: "Transaction not found or not owned by user" }, { status: 404 });
        }

        return NextResponse.json({ success: true, id: id });
    } catch (e) {
        const err = e as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
