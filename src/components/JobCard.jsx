import React, { useCallback, useContext } from 'react';
import { MapPin, Pencil, Building2, Archive, ArchiveX } from 'lucide-react';
import { Context } from '../libs/context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function JobCard({ location, jobtitle, description, company, id, status }) {
  const { setIsOpen, setIsEdit, setjobId, setStatusChanged, admin } = useContext(Context);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/assessment/${id}`);
  };

  const statusHandler = useCallback(async () => {
    let change = status === 'active' ? 'archived' : 'active';
    let data = { location, jobTitle: jobtitle, description, company, status: change };
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      toast('Failed to update status');
    } else {
      toast('Status updated successfully');
      setStatusChanged((prev) => !prev);
      await res.json();
    }
  }, [status, location, jobtitle, description, company, id, setStatusChanged]);

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-sm hover:shadow-sky-700 transition duration-300 ease-in-out">
      <div className="px-2 py-3">
        <div className="flex justify-between items-start space-x-1">
          <div className="flex-grow font-bold text-md text-slate-900">{jobtitle}</div>
          {admin && (
            <>
              <button className="flex-shrink-0 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition duration-200">
                <Pencil className="w-5 h-5" onClick={() => { setIsOpen(true); setIsEdit(true); setjobId(id); }} />
              </button>
              <button onClick={statusHandler} className="flex-shrink-0 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition duration-200">
                {status === 'active' ? <Archive className="w-5 h-5" /> : <ArchiveX className="w-5 h-5" />}
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <p className="text-gray-500 text-sm">{location}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Building2 className="w-5 h-5 text-blue-600" />
          <p className="text-gray-500 text-sm">{company}</p>
        </div>
      </div>
      <div className="h-px w-full bg-gray-200 my-6"></div>
      <div className="p-2">
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      </div>
      <div className="flex">
        <button onClick={handleClick} className="mt-6 w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300">
          More Details
        </button>
      </div>
    </div>
  );
}
