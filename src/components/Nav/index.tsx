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
    const [isExpanded, setIsExpanded] = useState(true);

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
            if (window.innerWidth < 640) {
                setIsExpanded(false);
            } else {
                setIsExpanded(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`bg-gray-800 p-4 h-full min-h-screen ${isExpanded ? "w-60" : "w-20"} absolute transition-all duration-300 flex flex-col items-center`}>
            <button
                onClick={toggleNavbar}
                className="text-white mb-4 focus:outline-none">
                {isExpanded ? '←' : '→'}
            </button>
            <nav className="flex flex-col items-center space-y-4 w-full">
                <h1 className={`text-white font-bold text-2xl mb-6 ${!isExpanded && "hidden"}`}>
                    TASK MANAGER
                </h1>

                <ul className="w-full flex flex-col items-center space-y-4">
                    <li className="w-full hover:bg-gray-700 rounded">
                        <Link href="/" className="block text-white font-bold hover:text-gray-300 text-center py-2">
                            {isExpanded ? "Início" : "🏠"}
                        </Link>
                    </li>
                    {user && (
                        <li className="w-full hover:bg-gray-700 rounded">
                            <Link href="/task" className="block text-white font-bold hover:text-gray-300 text-center py-2">
                                {isExpanded ? "Tarefas" : "📋"}
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="mt-auto w-full flex flex-col items-center space-y-4">
                    {user ? (
                        <div className="flex flex-col items-center w-full space-y-2">
                            {isExpanded && (
                                <div className='pt'>
                                    <p className="text-white text-center">Usuario:</p>
                                    <p className="text-white text-center">{user.email}</p>
                                </div>
                            )}
                            <button onClick={handleLogout} className="text-white hover:text-gray-300 text-center pt-5">
                                {isExpanded ? "Sair" : "🚪"}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full space-y-2">
                            <Link href="/login" className="block text-white hover:text-gray-300 font-bold text-center py-2 w-full">
                                {isExpanded ? "Login" : "🔑"}
                            </Link>
                            <Link href="/register" className="block text-white hover:text-gray-300 font-bold text-center py-2 w-full">
                                {isExpanded ? "Cadastro" : "📝"}
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
