import { firestore } from '../lib/firebaseconfig';
import { collection, addDoc, query, where, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
//Types
import iTask from "@/types/iTask"

export const createTask = async (newTask: iTask) => {
    try {
        const taskRef = await addDoc(collection(firestore, 'Tasks'), newTask);
        return taskRef.id;
    } catch (error) {
        console.error("Erro ao criar tarefa:", error);
        throw error;
    }
};

export const getTaskByUserId = async (userId: string): Promise<iTask[]> => {
    try {
        const tasksQuery = query(
            collection(firestore, 'Tasks'),
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(tasksQuery);

        // Mapear os documentos para o tipo iTask
        const tasks: iTask[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || 'Título da Tarefa',
                status: data.status || 'Não finalizada',
                userId: data.userId || userId,
                steps: data.steps || [],
            };
        });

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


