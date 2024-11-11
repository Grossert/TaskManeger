'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Bem-vindo ao Task Manager!</h1>

      <section className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mb-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Já tem uma conta?</h2>
        <p className="text-center mb-4">Se você já possui uma conta, clique abaixo para fazer login.</p>
        <button
          onClick={handleLoginRedirect}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300">
          Ir para Login
        </button>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Ainda não tem uma conta?</h2>
        <p className="text-center mb-4">Se você deseja criar uma nova conta, clique abaixo para se registrar.</p>
        <button
          onClick={handleRegisterRedirect}
          className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300">
          Ir para Cadastro
        </button>
      </section>
    </div>
  );
}
