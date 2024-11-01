export default interface Step {
    id: number;
    title: string;
    description: string;
    status: 'Não iniciada' | 'Em andamento' | 'Finalizada';
}