'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
// Hooks
import { login } from '@/hooks/auth';
// Context
import { useUser } from '@/contexts/authUser';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setUser } = useUser();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login(email, password);

            if (res) {
                const usr = {
                    uid: res.user.uid,
                    email: res.user.email
                };
                setUser(usr);
                router.push('/task');
            }
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            setError("Erro ao autenticar. Verifique suas credenciais.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email" />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password" />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                        Log In
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Não tem uma conta? <a href="/register" className="text-blue-500 hover:underline">Cadastre-se</a>
                </p>
            </div>
        </div>
    );
}
