import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const handleRedirect = useCallback(() => {
    navigate("/jobs");
  }, [navigate]);

  return (
    <div className='bg-slate-50 p-6 w-full min-h-screen flex flex-col items-center justify-center gap-2'>
      <p className='text-center text-lg text-slate-900 tracking-widest'>Welcome to TalentFlow</p>
      <button onClick={handleRedirect} type='button' className="text-pink-700 px-4 py-2 rounded-md bg-pink-100 font-semibold hover:bg-pink-200 duration-300 ease-in-out">Navigate to Jobs</button>
    </div>
  );
}
