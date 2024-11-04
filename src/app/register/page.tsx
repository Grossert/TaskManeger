'use client';

import React, { useState } from 'react';
import { createUser } from '@/hooks/user';
import { useRouter } from "next/navigation";
//Context
import { useUser } from '@/contexts/authUser';

export default function Register() {
    const router = useRouter();
    const { setUser } = useUser();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await createUser(formData.name, formData.email, formData.password);
            const user = {
                uid: res.uid,
                email: res.email
            }
            setUser(user);
            console.log("Usuario registrado com sucesso")
            router.push('/task')
        } catch (err) {
            console.log("Erro ao registrar usuario: " + err);
            router.push('/register');
        }
        console.log(formData);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Cadastre-se</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700">Nome</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite seu nome"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite seu email"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700">Senha</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Registrar
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Já tem uma conta? <a href="/login" className="text-blue-500 hover:underline">Entrar</a>
                </p>
            </div>
        </div>
    );
};