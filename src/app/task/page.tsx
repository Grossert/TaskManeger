'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
// Types
import iStep from "@/types/iStep"
import iTask from "@/types/iTask"
import TaskAccordion from '@/components/TaskAccordion';
import StepAccordion from '@/components/StepAccordion';
// Hooks
import { createTask, deleteTask, getTaskByUserId, updateTask } from '@/hooks/task';
import { createStep, getStepByTaskId, updateStep } from '@/hooks/step';
// Context
import { useUser } from '@/contexts/authUser';

export default function TaskPage() {
    const [tasks, setTasks] = useState<iTask[]>([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

    const { user } = useUser();

    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                try {
                    const userTasks = await getTaskByUserId(user.uid);
                    const tasksWithSteps = await Promise.all(
                        userTasks.map(async (task: iTask) => {
                            const steps = await getStepByTaskId(task.id || "");
                            const formattedSteps = steps.map((step: iStep) => ({
                                id: step.id,
                                title: step.title,
                                description: step.description,
                                status: step.status,
                            }));
                            return {
                                id: task.id,
                                title: task.title || 'Título da Tarefa',
                                status: task.status || 'Não finalizada',
                                steps: formattedSteps,
                            };
                        })
                    );
                    setTasks(tasksWithSteps);
                } catch (error) {
                    console.error("Erro ao carregar tarefas e etapas do usuário:", error);
                }
            }
        };
        fetchTasks();
    }, [user]);

    const handleAddTask = async () => {
        const newTask: iTask = {
            title: taskTitle,
            steps: [],
            status: 'Não finalizada',
            userId: user?.uid
        };
        try {
            const taskID = await createTask(newTask);
            newTask.id = taskID;
            setTasks(prevTasks => [...prevTasks, newTask]);
            setTaskTitle('');
        } catch (err) {
            console.error("Erro ao salvar a tarefa:", err);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            console.error("Erro ao deletar a tarefa:", err);
        }
    };

    const handleAddStep = async (taskID: string) => {
        const newStep: iStep = {
            title: "",
            description: "",
            status: 'Não iniciada',
            taskId: taskID,
        };
        try {
            const stepID = await createStep(taskID, newStep);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskID
                        ? { ...task, steps: [...task.steps, { ...newStep, id: stepID }] }
                        : task
                )
            );
        } catch (error) {
            console.error("Erro ao adicionar a etapa:", error);
        }
    };

    const calculateProgress = (steps: iStep[]) => {
        const totalSteps = steps.length;
        const completedSteps = steps.filter(step => step.status === 'Finalizada').length;
        return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    };

    const save = async (task: iTask) => {
        if (!task.id) {
            console.error("A tarefa não tem um ID válido.");
            return;
        }
        try {
            const updatedTask: iTask = {
                ...task,
                title: task.title.trim(),
                status: task.status
            };
            await updateTask(task.id, updatedTask);

            const updatedSteps = task.steps.map((step) => {
                const updatedStep: iStep = {
                    ...step,
                    title: step.title.trim(),
                    description: step.description.trim(),
                    status: step.status
                };
                updateStep(step.id || "", updatedStep);
                return updatedStep;
            });
            setTasks((prevTasks) =>
                prevTasks.map((prevTask) =>
                    prevTask.id === task.id
                        ? { ...prevTask, title: updatedTask.title, status: updatedTask.status, steps: updatedSteps }
                        : prevTask
                )
            );
            console.log("Tarefa e etapas salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar a tarefa e etapas:", error);
        }
    };

    return (
        <div className='flex justify-center p-4'>
            <div className="p-8 border shadow w-full max-w-4xl flex flex-col justify-center rounded">
                <h1 className="text-2xl font-bold mb-6 text-center">Task Manager</h1>
                <div className="mb-6 flex flex-col sm:flex-row justify-center items-center">
                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Titulo da tarefa"
                        className="p-2 border border-gray-300 rounded mb-4 sm:mb-0 sm:mr-2 w-full sm:w-auto" />
                    <button onClick={handleAddTask} className="p-2 bg-blue-500 text-white rounded w-full sm:w-auto">
                        Add Tarefa
                    </button>
                </div>

                {tasks.map((task) => (
                    <div key={task.id} className="mb-4 border border-gray-200 p-3 rounded">
                        <TaskAccordion
                            key={task.id}
                            task={task}
                            expandedTaskId={expandedTaskId}
                            setTasks={setTasks}
                            tasks={tasks}
                            setExpandedTaskId={setExpandedTaskId} />
                        {expandedTaskId === task.id && (
                            <div className="p-3 mt-4">
                                <div className='border-b pb-4'>
                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => handleAddStep(task.id || "")}
                                            className="p-2 bg-green-500 text-white rounded mt-2">
                                            Add Etapa
                                        </button>
                                        <button onClick={() => handleDeleteTask(task.id || "")} className="text-gray-500 ml-2">
                                            <FontAwesomeIcon icon={faTrash} className="h-5 w-5 inline" />
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <div className="bg-gray-300 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${calculateProgress(task.steps)}%` }} />
                                        </div>
                                        <div className="text-xs text-right">{`${calculateProgress(task.steps).toFixed(0)}% Concluída`}</div>
                                    </div>
                                </div>

                                {task.steps.map((step) => (
                                    <StepAccordion
                                        key={step.id}
                                        task={task}
                                        step={step}
                                        setTasks={setTasks}
                                        tasks={tasks} />
                                ))}
                                <button
                                    onClick={() => save(task)}
                                    className="mt-4 p-2 bg-blue-500 text-white rounded w-full sm:w-auto">
                                    Salvar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
