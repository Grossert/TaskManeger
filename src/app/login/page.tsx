'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        // Lógica de autenticação pode ser adicionada aqui
        console.log('Email:', email, 'Password:', password);
        router.push('/task');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

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
                    onClick={handleLogin}
                    className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Log In
                </button>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Não tem uma conta? <a href="/register" className="text-blue-500 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
}
