import { firestore } from '../lib/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';

export const createStep = async (taskId: string, stepName: string, description: string, status: string) => {
    try {
        const stepRef = await addDoc(collection(firestore, 'Steps'), {
            name: stepName,
            description: description,
            status: status,
            taskId: taskId
        });
        return stepRef.id;
    } catch (error) {
        console.error("Erro ao criar etapa:", error);
        throw error;
    }
};
