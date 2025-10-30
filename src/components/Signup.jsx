import { useCallback, useContext, useState } from "react"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { Context } from "../libs/context";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const { setUser } = useContext(Context);
    const navigate = useNavigate();

    const handleRedirect = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const validateUsername = useCallback((e) => {
        const value = e.target.value;
        if (value === "") setError(prev => ({ ...prev, username: "Username field must not be empty" }));
        else if (value.length < 3 || value.length > 100) setError(prev => ({ ...prev, username: "Username field must be between 3 to 100 characters" }));
        else setError(prev => ({ ...prev, username: null }));
    }, []);

    const validateEmail = useCallback((e) => {
        const value = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === "") setError(prev => ({ ...prev, email: "Email field must not be empty" }));
        else if (!emailRegex.test(value)) setError(prev => ({ ...prev, email: "Email field is not valid" }));
        else setError(prev => ({ ...prev, email: null }));
    }, []);

    const validatePassword = useCallback((e) => {
        const value = e.target.value;
        if (value === "") setError(prev => ({ ...prev, password: "Password field must not be empty" }));
        else if (value.length < 3 || value.length > 100) setError(prev => ({ ...prev, password: "Password field must be between 3 to 100 characters" }));
        else setError(prev => ({ ...prev, password: null }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const body = { username, email, password, stage: "Applied" };
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error(`Failed to register. Status: ${res.status}`);
            const data = await res.json();
            if (data.user) {
                toast("User created successfully");
                localStorage.setItem("auth", JSON.stringify({ authorized: true, data }));
                setUser(prev => !prev);
                handleRedirect();
            }
        } catch (e) {
            toast(e.message);
        }
    }, [username, email, password, handleRedirect, setUser]);

    return (
        <div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={validateUsername}
                        onFocus={() => setError(prev => ({ ...prev, username: null }))}
                        className={`w-full p-3 text-slate-900 bg-slate-50 border ${error.username ? "border-red-400" : "border-gray-600"} rounded-lg focus:outline-none`}
                        placeholder="Username"
                        required
                    />
                    {error.username && <small className="text-red-400 text-center">{error.username}</small>}
                </div>
                <div className="flex flex-col gap-1">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        onFocus={() => setError(prev => ({ ...prev, email: null }))}
                        className={`w-full p-3 text-slate-900 bg-slate-50 border ${error.email ? "border-red-400" : "border-gray-600"} rounded-lg focus:outline-none`}
                        placeholder="Email"
                        required
                    />
                    {error.email && <small className="text-red-400 text-center">{error.email}</small>}
                </div>
                <div className="flex flex-col gap-1">
                    <input
                        type="password"
                        value={password}
                        onBlur={validatePassword}
                        onFocus={() => setError(prev => ({ ...prev, password: null }))}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-3 text-slate-900 bg-slate-50 border ${error.password ? "border-red-400" : "border-gray-600"} rounded-lg focus:outline-none`}
                        placeholder="Password"
                        required
                    />
                    {error.password && <small className="text-red-400 text-center">{error.password}</small>}
                </div>
                <button
                    type="submit"
                    disabled={error.username || error.password || error.email}
                    className="mt-2 w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-700"
                >
                    Register
                </button>
            </form>
        </div>
    );
}
