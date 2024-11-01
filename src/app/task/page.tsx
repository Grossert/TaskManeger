'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Step {
    id: number;
    title: string;
    description: string;
    status: 'Não iniciada' | 'Em andamento' | 'Finalizada';
}

interface Task {
    id: number;
    title: string;
    steps: Step[];
    status: 'Não finalizada' | 'Finalizada';
}

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [stepTitle, setStepTitle] = useState('');
    const [stepDescription, setStepDescription] = useState('');
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
    const [expandedStepIds, setExpandedStepIds] = useState<{ [taskId: number]: number | null }>({});

    const addTask = () => {
        const newTask: Task = {
            id: Date.now(),
            title: taskTitle,
            steps: [],
            status: 'Não finalizada',
        };
        setTasks([...tasks, newTask]);
        setTaskTitle('');
    };

    const addStepToTask = (taskId: number) => {
        const newStep: Step = {
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

    const deleteTask = (taskId: number) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const deleteStep = (taskId: number, stepId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, steps: task.steps.filter(step => step.id !== stepId) }
                : task
        ));
    };

    const editTaskTitle = (taskId: number, newTitle: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, title: newTitle } : task
        ));
    };

    const editStep = (taskId: number, stepId: number, newTitle: string, newDescription: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? {
                    ...task,
                    steps: task.steps.map(step =>
                        step.id === stepId ? { ...step, title: newTitle, description: newDescription } : step
                    ),
                }
                : task
        ));
    };

    const updateStepStatus = (taskId: number, stepId: number, newStatus: Step['status']) => {
        const updatedTasks = tasks.map((task) => { 
            if (task.id === taskId) {
                const updatedSteps = task.steps.map(step =>
                    step.id === stepId ? { ...step, status: newStatus } : step
                );
                const allStepsFinalized = updatedSteps.every(step => step.status === 'Finalizada');
                return {
                    ...task,
                    steps: updatedSteps,
                    status: allStepsFinalized ? 'Finalizada' : 'Não finalizada',
                };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const toggleAccordion = (taskId: number) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const toggleStepAccordion = (taskId: number, stepId: number) => {
        setExpandedStepIds(prev => ({
            ...prev,
            [taskId]: prev[taskId] === stepId ? null : stepId,
        }));
    };

    const calculateProgress = (steps: Step[]) => {
        const totalSteps = steps.length;
        const completedSteps = steps.filter(step => step.status === 'Finalizada').length;
        return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0; // Calcula o percentual
    };

    // Função para salvar a tarefa no banco de dados
    const saveTask = async (task: Task) => {
        try {
            const response = await fetch('http://localhost:3000/api/tasks', { // Altere a URL conforme sua API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar a tarefa');
            }

            // Você pode adicionar lógica para lidar com a resposta se necessário
            console.log('Tarefa salva com sucesso');
        } catch (error) {
            console.error('Erro ao salvar a tarefa:', error);
        }
    };

    return (
        <div className='flex justify-center p-4 '>
            <div className="p-8 border shadow w-1/4 flex flex-col justify-center rounded">
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
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleAccordion(task.id)}>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => editTaskTitle(task.id, e.target.value)}
                                    className="text-lg font-semibold border-b border-transparent focus:border-gray-400 mr-2" />
                            </div>
                            <div>
                                <span className={`mr-2 ${task.status === 'Finalizada' ? 'text-green-500' : 'text-gray-500'}`}>
                                    {task.status}
                                </span>
                                <FontAwesomeIcon icon={expandedTaskId === task.id ? faChevronDown : faChevronRight} className="mr-2" />
                            </div>
                        </div>

                        {expandedTaskId === task.id && (
                            <div className="p-3 mt-4">
                                <div className='border-b pb-4'>

                                    <div className="flex items-center justify-between">
                                        <button
                                            onClick={() => addStepToTask(task.id)}
                                            className="p-2 bg-green-500 text-white rounded mt-2">
                                            Add Step
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
                                    <div key={step.id} className="flex flex-col mt-4 border p-2 rounded">
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleStepAccordion(task.id, step.id)}>
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => editStep(task.id, step.id, e.target.value, step.description)}
                                                placeholder="Step title"
                                                className="border-b border-transparent focus:border-gray-400 mr-2" />
                                            <FontAwesomeIcon icon={expandedStepIds[task.id] === step.id ? faChevronDown : faChevronRight} className="mr-2" />
                                        </div>

                                        {expandedStepIds[task.id] === step.id && (
                                            <div className="mt-2">
                                                <textarea
                                                    value={step.description}
                                                    onChange={(e) => editStep(task.id, step.id, step.title, e.target.value)}
                                                    placeholder="Step description"
                                                    className="p-2 border border-gray-300 rounded w-full mt-2" />
                                                <div className="flex items-center justify-between">
                                                    <select
                                                        value={step.status}
                                                        onChange={(e) => updateStepStatus(task.id, step.id, e.target.value as Step['status'])}
                                                        className="p-2 border border-gray-300 rounded w-full mt-2">
                                                        <option value="Não iniciada">Não iniciada</option>
                                                        <option value="Em andamento">Em andamento</option>
                                                        <option value="Finalizada">Finalizada</option>
                                                    </select>
                                                    <button onClick={() => deleteStep(task.id, step.id)} className="text-gray-500 ml-2">
                                                        <FontAwesomeIcon icon={faTrash} className="h-5 w-5 inline" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={() => saveTask(task)} // Chama a função saveTask passando a tarefa atual
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
