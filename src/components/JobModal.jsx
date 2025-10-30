import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Context } from '../libs/context';
import { ThreeDots } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { CircleX } from 'lucide-react';

export default function JobModal() {
  const { isEdit, setIsEdit, isOpen, setIsOpen, jobId } = useContext(Context);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ title: null, description: null, location: null, company: null });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error(`Failed to fetch job ${jobId}. Status: ${res.status}`);
        const data = await res.json();
        const real = data.job || data;
        setTitle(real.jobTitle || '');
        setDescription(real.description || '');
        setLocation(real.location || '');
        setCompany(real.company || '');
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEdit && jobId != null) fetchData();
  }, [isEdit, jobId]);

  const handleCreateJob = useCallback(async (e) => {
    e.preventDefault();
    const job = { jobTitle: title, description, location, company, status: "active" };
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job)
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      await res.json();
      toast("Job Created Successfully");
    } catch (error) {
      console.error("Error creating job:", error);
    }
    setTitle('');
    setDescription('');
    setLocation('');
    setCompany('');
    setIsOpen(false);
    setIsEdit(false);
  }, [title, description, location, company]);

  const handleEditJob = useCallback(async (e) => {
    e.preventDefault();
    const job = { jobTitle: title, description, location, company };
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job)
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      await res.json();
    } catch (error) {
      console.error("Error editing job:", error);
    }
    setIsOpen(false);
    setIsEdit(false);
  }, [title, description, location, company, jobId]);

  const handleSubmit = !isEdit ? handleCreateJob : handleEditJob;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 mx-4 transform transition-all duration-300 scale-100 relative" onClick={(e) => e.stopPropagation()}>
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg z-50">
            <ThreeDots color="#3B82F6" height="80" width="80" visible={true} />
          </div>
        )}
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700">{!isEdit ? "Create Jobs" : "Edit Job"}</h3>
          <button onClick={() => { setIsOpen(false); setIsEdit(false); }} className="text-gray-400 hover:text-gray-600 transition" disabled={isLoading}>
            <CircleX />
          </button>
        </div>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4" disabled={isLoading}>
            <div className='flex flex-col gap-1'>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={(e) => { e.target.value === "" ? setError((prev) => ({ ...prev, title: "Title should not be empty" })) : "" }}
                onFocus={() => { setError((prev) => ({ ...prev, title: null })) }}
                className={`p-3 text-sm border ${error.title != null ? "border-red-400" : "border-gray-300"} rounded-lg text-gray-700 bg-white focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out`}
                required
                disabled={isLoading}
              />
              {error.title && <small className='text-red-400 text-xs'>{error.title}</small>}
            </div>
            <div className='flex flex-col gap-1'>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={(e) => { e.target.value === "" ? setError((prev) => ({ ...prev, description: "Description should not be empty" })) : "" }}
                onFocus={() => { setError((prev) => ({ ...prev, description: null })) }}
                rows="4"
                className={`p-3 text-sm border ${error.description != null ? "border-red-400" : "border-gray-300"} rounded-lg text-gray-700 bg-white focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out`}
                required
                disabled={isLoading}
              />
              {error.description && <small className='text-red-400 text-xs'>{error.description}</small>}
            </div>
            <div className='flex flex-col gap-1'>
              <input
                type="text"
                placeholder="Location"
                onChange={(e) => setLocation(e.target.value)}
                onBlur={(e) => { e.target.value === "" ? setError((prev) => ({ ...prev, location: "Location should not be empty" })) : "" }}
                onFocus={() => { setError((prev) => ({ ...prev, location: null })) }}
                value={location}
                className={`p-3 text-sm border ${error.location != null ? "border-red-400" : "border-gray-300"} rounded-lg text-gray-700 bg-white focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out`}
                required
                disabled={isLoading}
              />
              {error.location && <small className='text-red-400 text-xs'>{error.location}</small>}
            </div>
            <div className='flex flex-col gap-1'>
              <input
                type="text"
                placeholder="Company"
                onChange={(e) => setCompany(e.target.value)}
                onBlur={(e) => { e.target.value === "" ? setError((prev) => ({ ...prev, company: "Company should not be empty" })) : "" }}
                onFocus={() => { setError((prev) => ({ ...prev, company: null })) }}
                value={company}
                className={`p-3 text-sm border ${error.company != null ? "border-red-400" : "border-gray-300"} rounded-lg text-gray-700 bg-white focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out`}
                required
                disabled={isLoading}
              />
              {error.company && <small className='text-red-400 text-xs'>{error.company}</small>}
            </div>
            <button
              type="submit"
              className="mt-2 w-full py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-700"
              disabled={isLoading || error.title != null || error.description != null || error.location != null || error.company != null}
            >
              {isEdit ? "Save Changes" : "Create Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
