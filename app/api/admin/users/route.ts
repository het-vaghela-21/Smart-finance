import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";

export async function GET(req: NextRequest) {
    // Verify admin secret header
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectMongo();

        const users = await User.find({}).sort({ createdAt: -1 }).lean();

        // Fetch transaction counts per user
        const txCounts = await Transaction.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 }, total: { $sum: "$amount" } } }
        ]);
        const txMap: Record<string, { count: number; total: number }> = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        txCounts.forEach((t: any) => { txMap[t._id] = { count: t.count, total: t.total }; });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = users.map((u: any) => ({
            ...u,
            _id: u._id.toString(),
            transactions: txMap[u.uid] || { count: 0, total: 0 },
        }));

        return NextResponse.json({ users: result });
    } catch (err) {
        const e = err as Error;
        console.error("[admin/users]", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
