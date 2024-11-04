import { title } from 'process';
import { firestore } from '../lib/firebaseconfig';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export const createTask = async (userId: string, taskName: string) => {
    try {
        const taskRef = await addDoc(collection(firestore, 'Tasks'), {
            title: taskName,
            userId: userId
        });
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

export const updateTask = async (taskId: string, updatedData: { title?: string; status?: string }) => {
    try {
        const taskRef = doc(firestore, 'Tasks', taskId);
        await updateDoc(taskRef, updatedData);
        console.log("Tarefa atualizada com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar a tarefa:", error);
        throw error;
    }
};
