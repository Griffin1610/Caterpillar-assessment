import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { User } from "../types";

function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    if (user) return <Navigate to={user.isAdmin === 1 ? "/admin" : "/home"} />;

    function redirect(user: User) {
        login(user);
        navigate(user.isAdmin === 1 ? "/admin" : "/home");
    }

    async function handleLogin(e: { preventDefault: () => void }) {
        e.preventDefault();
        setError("");
        const res = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error);
            return;
        }
        redirect(await res.json());
    }

    async function handleRegister(e: { preventDefault: () => void }) {
        e.preventDefault();
        setError("");
        const res = await fetch("http://localhost:4000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, phoneNumber }),
        });
        if (!res.ok) {
            const data = await res.json();
            setError(data.error);
            return;
        }
        redirect(await res.json());
    }

    if (isRegistering) {
        return (
            <div className="login-page">
                <h1>Create Account</h1>
                <form className="form" onSubmit={handleRegister}>
                    <input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
                    <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Create Account</button>
                </form>
                <br />
                <button className="outline" onClick={() => { setIsRegistering(false); setError(""); }}>Back to Login</button>
            </div>
        );
    }

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form className="form" onSubmit={handleLogin}>
                <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
            <br />
            <button className="outline" onClick={() => { setIsRegistering(true); setError(""); }}>Create an Account</button>
        </div>
    );
}

export default Login;
