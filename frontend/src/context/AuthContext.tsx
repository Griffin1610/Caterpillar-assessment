import { createContext, useContext, useState } from "react";
import type { User } from "../types";

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = sessionStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    function login(user: User) {
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    }

    function logout() {
        sessionStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
