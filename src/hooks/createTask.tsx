import { firestore } from '../lib/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

export const createTask = async (userId: string, taskName: string) => {
    try {
        const taskRef = await addDoc(collection(firestore, 'Tasks'), {
            name: taskName,
            userId: userId
        });
        return taskRef.id;
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        throw error;
    }
};
