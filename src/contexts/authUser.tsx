'use client';

import { createContext, useContext, useState } from 'react';

interface Props {
    children: React.ReactNode;
}

interface User {
    uid: string;
    email: string | null;
}


interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within an UserProvider');
    }
    return context;
};
