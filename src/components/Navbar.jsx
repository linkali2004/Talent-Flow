import React, { useCallback, useContext, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; 

import { mirageServer } from "../../mirage/server"; 
import { Context } from "../libs/context";


export default function Navbar() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  
  const { user, admin, setAdmin, auth, setAuth } = useContext(Context);
  
  const currentPath = location.pathname;

  useEffect(() => {
    const res = localStorage.getItem("auth");
    if (res) setAuth(JSON.parse(res));
    if (res) setAdmin(JSON.parse(res).data.isAdmin);
  }, [user, setAuth, setAdmin]); 

  const handleRedirect = useCallback(() => {
    navigate("/registration"); 
  }, [navigate]); 

  return (
    <div className="flex flex-row justify-between items-center w-full h-20 px-8 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex flex-row gap-2 items-center">
        <img 
          src="/Logo.png" 
          alt="Logo" 
          width={50} 
          height={50} 
          className="rounded-[100%]" 
        />
        <Link 
          to="/" 
          className="text-2xl text-slate-900 tracking-widest hover:text-blue-600 transition-colors font-bold"
        >
          TalentFlow
        </Link>
      </div>

      
      <div className="flex flex-row items-center gap-6">
        
        <Link 
          to="/" 
          className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${currentPath === "/home" ? `text-blue-600 font-semibold` : ""}`}
        >
          Home
        </Link>
        
        <Link 
          to="/jobs" 
          className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${currentPath === "/jobs" ? `text-blue-600 font-semibold` : ""}`}
        >
          Jobs
        </Link>
        
        {admin && auth != null && (
          <Link
            to="/candidates"
            className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${currentPath === "/candidates" ? `text-blue-600 font-semibold` : ""}`}
          >
            Candidates
          </Link>
        )}

        {auth == null ? (
          <Link
            to="/registration"
            className={`text-gray-600 hover:text-blue-600 font-medium transition-colors ${currentPath === "/registration" ? `text-blue-600 font-semibold` : ""}`}
          >
            Login
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("auth");
              handleRedirect();
            }}
            className="ml-2 px-5 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-200 duration-300 ease-in-out"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}