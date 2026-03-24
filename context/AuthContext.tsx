"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userRole: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                // Set auth cookie so middleware can protect /dashboard and /admin
                const token = await firebaseUser.getIdToken();
                document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Strict`;
                const snap = await getDoc(doc(db, "users", firebaseUser.uid));
                if (snap.exists()) setUserRole(snap.data().role ?? "user");
            } else {
                // Clear cookie on logout
                document.cookie = "auth-token=; path=/; max-age=0";
                setUserRole(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        await updateLastLogin(auth.currentUser!.uid);
        router.push("/dashboard");
    };

    const signUp = async (email: string, password: string, name: string, phone: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, "users", cred.user.uid), {
            uid: cred.user.uid,
            name,
            email,
            phone,
            provider: "email",
            role: "user",
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        });
        router.push("/dashboard");
    };

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const u = result.user;
        const snap = await getDoc(doc(db, "users", u.uid));
        if (!snap.exists()) {
            await setDoc(doc(db, "users", u.uid), {
                uid: u.uid,
                name: u.displayName ?? "",
                email: u.email ?? "",
                phone: u.phoneNumber ?? "",
                provider: "google",
                role: "user",
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            });
        } else {
            await updateLastLogin(u.uid);
        }
        router.push("/dashboard");
    };

    const logout = async () => {
        await signOut(auth);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, userRole, signIn, signUp, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

async function updateLastLogin(uid: string) {
    await setDoc(doc(db, "users", uid), { lastLogin: serverTimestamp() }, { merge: true });
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
