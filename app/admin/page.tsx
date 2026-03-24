"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shield, Users, LogOut, Loader2, Crown, User } from "lucide-react";

interface UserRecord {
    uid: string;
    name: string;
    email: string;
    phone: string;
    provider: string;
    role: string;
    createdAt: any;
    lastLogin: any;
}

export default function AdminPage() {
    const { user, userRole, logout, loading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [fetching, setFetching] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (!loading) {
            if (!user) { router.push("/auth/login"); return; }
            if (userRole !== "admin") { router.push("/dashboard"); return; }
            fetchUsers();
        }
    }, [user, userRole, loading]);

    const fetchUsers = async () => {
        setFetching(true);
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserRecord)));
        } finally {
            setFetching(false);
        }
    };

    const toggleRole = async (uid: string, currentRole: string) => {
        setUpdating(uid);
        const newRole = currentRole === "admin" ? "user" : "admin";
        await updateDoc(doc(db, "users", uid), { role: newRole });
        setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
        setUpdating(null);
    };

    const fmtDate = (ts: any) => {
        if (!ts) return "—";
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    if (loading || fetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black/90 text-white p-6 lg:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
                        <p className="text-zinc-500 text-sm">FinAI User Management</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-sm transition-all"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Users", value: users.length, icon: Users },
                    { label: "Admins", value: users.filter((u) => u.role === "admin").length, icon: Crown },
                    { label: "Google Users", value: users.filter((u) => u.provider === "google").length, icon: User },
                    { label: "Email Users", value: users.filter((u) => u.provider === "email").length, icon: User },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <stat.icon className="w-5 h-5 text-orange-500 mb-3" />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-zinc-500 text-xs mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <h2 className="font-semibold text-white text-sm">All Registered Users</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5">
                                {["Name", "Email", "Phone", "Provider", "Joined", "Last Login", "Role", "Action"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.uid} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{u.name || "—"}</td>
                                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{u.email}</td>
                                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{u.phone || "—"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.provider === "google" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-white/5 text-zinc-400 border border-white/10"}`}>
                                            {u.provider}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{fmtDate(u.lastLogin)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-white/5 text-zinc-500 border border-white/10"}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.uid !== user?.uid && (
                                            <button
                                                onClick={() => toggleRole(u.uid, u.role)}
                                                disabled={updating === u.uid}
                                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/30 border border-white/10 text-zinc-400 text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                {updating === u.uid ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                                {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                                            </button>
                                        )}
                                        {u.uid === user?.uid && <span className="text-xs text-zinc-600 italic">You</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-12 text-zinc-600">No users registered yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
