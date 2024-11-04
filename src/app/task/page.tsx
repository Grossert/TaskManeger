'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
//Types
import iStep from "@/types/iStep"
import iTask from "@/types/iTask"
import TaskAccordion from '@/components/TaskAccordion';
import StepAccordion from '@/components/StepAccordion';
//Hooks
import { createTask, getTaskByUserId } from '@/hooks/task';
import { createStep, getStepByTaskId } from '@/hooks/step';
//Context
import { useUser } from '@/contexts/authUser';


export default function TaskPage() {
    const [tasks, setTasks] = useState<iTask[]>([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [stepTitle, setStepTitle] = useState('');
    const [stepDescription, setStepDescription] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                try {
                    const userTasks = await getTaskByUserId(user.uid);
                    const tasksWithSteps = await Promise.all(
                        userTasks.map(async (task: any) => {
                            const steps = await getStepByTaskId(task.id);

                            const formattedSteps = steps.map((step: any) => ({
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

                    setTasks(tasksWithSteps as iTask[]);
                } catch (error) {
                    console.error("Erro ao carregar tarefas e etapas do usuário:", error);
                }
            }
        };

        fetchTasks();
    }, [user]);


    const addTask = () => {
        const newTask: iTask = {
            id: Date.now(),
            title: taskTitle,
            steps: [],
            status: 'Não finalizada',
        };
        setTasks([...tasks, newTask]);
        setTaskTitle('');
    };

    const deleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const addStepToTask = (taskId: number) => {
        const newStep: iStep = {
            id: Date.now(),
            title: stepTitle,
            description: stepDescription,
            status: 'Não iniciada',
        };
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, steps: [...task.steps, newStep] } : task
        ));
        setStepTitle('');
        setStepDescription('');
    };

    const calculateProgress = (steps: iStep[]) => {
        const totalSteps = steps.length;
        const completedSteps = steps.filter(step => step.status === 'Finalizada').length;
        return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    };

    const save = async (task: iTask) => {
        try {
            const createdTask = await createTask((user?.uid || ""), task.title);
            for (const step of task.steps) {
                await createStep(createdTask, step.title, step.description, step.status);
            }
            router.push('/task');
        } catch (err) {
            console.error("Erro ao salvar a tarefa e etapas:", err);
            router.push('/register');
        }
    };


    return (
        <div className='flex justify-center p-4 '>
            <div className="p-8 border shadow w-1/3 flex flex-col justify-center rounded">
                <h1 className="text-2xl font-bold mb-6 flex justify-center">Task Manager</h1>
                <div className="mb-6 flex justify-center" >
                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Titulo da tarefa"
                        className="p-2 border border-gray-300 rounded mr-2" />
                    <button onClick={addTask} className="p-1 bg-blue-500 text-white rounded">
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
                                            onClick={() => addStepToTask(task.id)}
                                            className="p-2 bg-green-500 text-white rounded mt-2">
                                            Add Etapa
                                        </button>
                                        <button onClick={() => deleteTask(task.id)} className="text-gray-500 ml-2">
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
                                    className="mt-4 p-2 bg-blue-500 text-white rounded">
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
