export default interface Step {
    id?: string;
    title: string;
    description: string;
    status: 'Não iniciada' | 'Em andamento' | 'Finalizada';
}