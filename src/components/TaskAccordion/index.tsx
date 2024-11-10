import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Types
import iTask from "@/types/iTask";

interface Props {
    task: iTask;
    expandedTaskId: string | null;
    setTasks: React.Dispatch<React.SetStateAction<iTask[]>>;
    tasks: iTask[];
    setExpandedTaskId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function TaskAccordion({ task, expandedTaskId, setTasks, tasks, setExpandedTaskId }: Props) {

    const toggleAccordion = (taskId: string) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const editTaskTitle = (taskId: string, newTitle: string) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, title: newTitle } : task
        ));
    };

    return (
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleAccordion((task.id || ""))}>
            <div className="flex items-center">
                <input
                    type="text"
                    value={task.title}
                    onChange={(e) => editTaskTitle((task.id || ""), e.target.value)} // Corrigindo a tipagem aqui
                    className="text-lg font-semibold border-b border-transparent focus:border-gray-400 mr-2" />
            </div>
            <div>
                <span className={`mr-2 ${task.status === 'Finalizada' ? 'text-green-500' : 'text-gray-500'}`}>
                    {task.status}
                </span>
                <FontAwesomeIcon icon={expandedTaskId === task.id ? faChevronDown : faChevronRight} className="mr-2" />
            </div>
        </div>
    );
}
