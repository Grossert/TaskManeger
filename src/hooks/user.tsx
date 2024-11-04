import { auth, firestore } from '../lib/firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const createUser = async (name: string, email: string, senha: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        await setDoc(doc(firestore, 'Users', user.uid), { name, email, senha });
        return user;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        throw error;
    }
};
