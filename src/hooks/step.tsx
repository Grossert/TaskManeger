import { firestore } from '../lib/firebaseconfig';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
//Types
import iStep from "@/types/iStep"

export const createStep = async (taskId: string, newStep: iStep) => {
    try {
        const stepRef = await addDoc(collection(firestore, 'Steps'), newStep);
        console.log("Etapa criada com sucesso:", stepRef.id);
        return stepRef.id;
    } catch (error) {
        console.error("Erro ao criar etapa:", error);
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

export const updateStep = async (stepId: string, updatedData: iStep) => {
    try {
        const stepRef = doc(firestore, 'Steps', stepId);
        const stepData = Object.fromEntries(
            Object.entries(updatedData).map(([key, value]) => [key, value])
        );
        await updateDoc(stepRef, stepData);
        console.log("Etapa atualizada com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar a etapa:", error);
        throw error;
    }
};

export const deleteStep = async (stepId: string) => {
    try {
        const stepRef = doc(firestore, 'Steps', stepId);
        await deleteDoc(stepRef);
        console.log("Etapa deletada com sucesso");
    } catch (error) {
        console.error("Erro ao deletar a etapa:", error);
        throw error;
    }
};