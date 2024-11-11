import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// Contexts
import { useUser } from '@/contexts/authUser';
// Hooks
import { logout } from '@/hooks/auth';

export default function Nav() {
    const { user, setUser } = useUser();
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleLogout = async () => {
        await logout();
        setUser(null);
        router.push('/login');
    };

    const toggleNavbar = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setIsExpanded(true); // Keep navbar expanded on large screens
            } else {
                setIsExpanded(false); // Collapse navbar on smaller screens
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-gray-800 p-4 w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-white font-bold text-2xl">
                    TASK MANAGER
                </h1>

                {/* Navbar links em telas grandes */}
                <nav className="hidden md:flex justify-center space-x-8">
                    <ul className="flex space-x-8 justify-center">
                        <li>
                            <Link href="/" className="text-white font-bold hover:text-gray-300">
                                Início
                            </Link>
                        </li>
                        {user && (
                            <>
                                <li>
                                    <Link href="/task" className="text-white font-bold hover:text-gray-300">
                                        Tarefas
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block text-white font-bold hover:text-gray-300">
                                        Sair
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <button
                    onClick={toggleNavbar}
                    className="text-white md:hidden focus:outline-none">
                    {isExpanded ? '×' : '≡'}
                </button>
            </div>

            <nav className={`md:hidden ${isExpanded ? 'block' : 'hidden'} mt-4`}>
                <ul className="space-y-4 flex flex-col items-end justify-center">
                    <li>
                        <Link href="/" className="block text-white font-bold hover:text-gray-300 text-center border px-2 rounded w-32">
                            {isExpanded ? "Início" : "🏠"}
                        </Link>
                    </li>
                    {user && (
                        <>
                            <li>
                                <Link href="/task" className="block text-white font-bold hover:text-gray-300 text-center border px-2 rounded w-32">
                                    {isExpanded ? "Tarefas" : "📋"}
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="block text-white font-bold hover:text-gray-300 text-center border px-2 rounded w-32">
                                    {isExpanded ? "Sair" : "🚪"}
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

        </div>
    );
}
