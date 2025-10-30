import Login from "./Login";
import Signup from "./Signup";
import { useCallback, useState } from "react";

export default function Registration() {
    const [change, setChange] = useState(false);
    const onClickHandler = useCallback((e) => {
        e.preventDefault();
        setChange(prev => !prev);
    }, []);
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-slate-50">
            <div className="bg-slate-100 p-8 rounded-xl shadow-2xl max-w-md w-full">
                <p className="text-4xl font-bold text-slate-700 text-center mb-6">{!change ? "Login" : "Register"}</p>
                {change ? <Signup /> : <Login />}
                <p className="text-center text-sm text-slate-900 mt-4">
                    {change ? "Already have an account ?" : "Don't have an account ?"}{" "}
                    <a className="text-sky-400 cursor-pointer" onClick={onClickHandler}>
                        {change ? "Login here" : "Create an account"}
                    </a>
                </p>
            </div>
        </div>
    );
}
