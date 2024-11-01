import { useEffect, useState } from "react";
import { auth } from "../lib/firebaseconfig";
import { onAuthStateChanged  } from "firebase/auth";

interface User{
    uid: string;
    email: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? {uid:user.uid, email: user.email || ''} : null)
            setLoading(false)
        });
        return () => onsubscribe();
    }, []);
    return {user, loading};
}