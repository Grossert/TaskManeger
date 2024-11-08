import iStep from "@/types/iStep"

export default interface Task {
    id?: string;
    title: string;
    steps: iStep[];
    status?: 'Não finalizada' | 'Finalizada';
}