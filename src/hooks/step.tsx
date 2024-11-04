import { title } from 'process';
import { firestore } from '../lib/firebaseconfig';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export const createStep = async (taskId: string, stepName: string, description: string, status: string) => {
    try {
        const stepRef = await addDoc(collection(firestore, 'Steps'), {
            title: stepName,
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

export const updateStep = async (stepId: string, updatedData: { title?: string; description?: string; status?: string }) => {
    try {
        const stepRef = doc(firestore, 'Steps', stepId);
        await updateDoc(stepRef, updatedData);
        console.log("Etapa atualizada com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar a etapa:", error);
        throw error;
    }
};

export const getStepByTaskId = async (taskId: string) => {
    try {
        const stepsRef = collection(firestore, 'Steps');
        const q = query(stepsRef, where('taskId', '==', taskId));
        const querySnapshot = await getDocs(q);

        const steps = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return steps;
    } catch (error) {
        console.error("Erro ao buscar etapas:", error);
        throw error;
    }
};