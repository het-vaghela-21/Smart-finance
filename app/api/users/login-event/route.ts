import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const { uid, ip, device } = await req.json();

        if (!uid) {
            return NextResponse.json({ error: "Missing uid" }, { status: 400 });
        }

        await connectMongo();

        // Resolve location from IP using free ip-api.com
        let city = "Unknown";
        let country = "Unknown";
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,status`);
            const geoData = await geoRes.json();
            if (geoData.status === "success") {
                city = geoData.city || "Unknown";
                country = geoData.country || "Unknown";
            }
        } catch {
            // geo lookup failed — keep defaults
        }

        const loginEvent = {
            timestamp: new Date(),
            ip: ip || "Unknown",
            city,
            country,
            device: device || "Unknown",
        };

        await User.findOneAndUpdate(
            { uid },
            {
                $push: {
                    loginHistory: {
                        $each: [loginEvent],
                        $slice: -50, // keep last 50 logins
                    },
                },
            }
        );

        return NextResponse.json({ success: true, location: { city, country } });
    } catch (err) {
        const e = err as Error;
        console.error("[users/login-event]", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
