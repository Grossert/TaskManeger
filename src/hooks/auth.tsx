import { auth } from "../lib/firebaseconfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const login = async (email: string, password: string) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login realizado com sucesso")
        return (res)
    } catch (err) {
        console.log("Erro ao autenticar: " + err);
    }

}

export const logout = async () => {
    try {
        await signOut(auth);
        console.log("Logout realizado com sucesso");
    } catch (err) {
        console.log("Erro ao realizar logout: " + err);
    }
};