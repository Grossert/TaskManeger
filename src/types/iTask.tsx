import iStep from "@/types/iStep"

export default interface Task {
    id: number;
    title: string;
    steps: iStep[];
    status?: 'Não finalizada' | 'Finalizada';
}