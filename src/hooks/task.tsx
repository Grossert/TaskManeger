import { firestore } from '../lib/firebaseconfig';
import { collection, addDoc, query, where, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
//Types
import iTask from "@/types/iTask"

export const createTask = async (newTask: any) => {
    try {
        const taskRef = await addDoc(collection(firestore, 'Tasks'), newTask);
        return taskRef.id;
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        throw error;
    }
};

export const getTaskByUserId = async (userId: string) => {
    try {
        const tasksQuery = query(
            collection(firestore, 'Tasks'),
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(tasksQuery);
        const tasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return tasks;
    } catch (error) {
        console.error("Erro ao obter tarefas:", error);
        throw error;
    }
};

export const updateTask = async (taskId: string, updatedData: iTask) => {
    try {
        const taskRef = doc(firestore, 'Tasks', taskId);
        const taskData = Object.fromEntries(
            Object.entries(updatedData).map(([key, value]) => [key, value])
        );
        await updateDoc(taskRef, taskData);
        console.log("Tarefa atualizada com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar a tarefa:", error);
        throw error;
    }
};

export const deleteTask = async (taskId: string) => {
    try {
        const taskRef = doc(firestore, 'Tasks', taskId);
        await deleteDoc(taskRef);
        console.log("Tarefa excluída com sucesso");
    } catch (error) {
        console.error("Erro ao excluir a tarefa:", error);
        throw error;
    }
};


