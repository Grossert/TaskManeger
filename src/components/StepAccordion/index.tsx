import { useState } from 'react';
import { faTrash, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Types
import iTask from "@/types/iTask";
import iStep from "@/types/iStep";

interface Props {
    task: iTask;
    step: iStep;
    setTasks: React.Dispatch<React.SetStateAction<iTask[]>>;
    tasks: iTask[];
}

export default function StepAccordion({ task, step, setTasks, tasks }: Props) {
    const [expandedStepIds, setExpandedStepIds] = useState<{ [taskId: number]: number | null }>({});

    const deleteStep = (taskId: number, stepId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, steps: task.steps.filter(step => step.id !== stepId) }
                : task
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

    const updateStepStatus = (taskId: number, stepId: number, newStatus: iStep['status']) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const updatedSteps = task.steps.map(step =>
                    step.id === stepId ? { ...step, status: newStatus } : step
                );
                const allStepsFinalized = updatedSteps.every(step => step.status === 'Finalizada');
                return {
                    ...task,
                    steps: updatedSteps,
                    status: allStepsFinalized ? 'Finalizada' as const : 'Não finalizada' as const,
                };
            }
            return task;
        });
        setTasks(updatedTasks);
    };

    const toggleStepAccordion = (taskId: number, stepId: number) => {
        setExpandedStepIds(prev => ({
            ...prev,
            [taskId]: prev[taskId] === stepId ? null : stepId,
        }));
    };
    const isExpanded = expandedStepIds[task.id] === step.id;

    return (
        <div className="flex flex-col mt-4 border p-2 rounded">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleStepAccordion(task.id, step.id)}>
                <input
                    type="text"
                    value={step.title}
                    onChange={(e) => editStep(task.id, step.id, e.target.value, step.description)}
                    placeholder="Título da etapa"
                    className="border-b border-transparent focus:border-gray-400 mr-2" />
                <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} className="mr-2" />
            </div>

            {isExpanded && (
                <div className="mt-2">
                    <textarea
                        value={step.description}
                        onChange={(e) => editStep(task.id, step.id, step.title, e.target.value)}
                        placeholder="Descrição da etapa"
                        className="p-2 border border-gray-300 rounded w-full mt-2"
                    />
                    <div className="flex items-center justify-between">
                        <select
                            value={step.status}
                            onChange={(e) => updateStepStatus(task.id, step.id, e.target.value as iStep['status'])}
                            className="p-2 border border-gray-300 rounded w-full mt-2"
                        >
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
    );
}
