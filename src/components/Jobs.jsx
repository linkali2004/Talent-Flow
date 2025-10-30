import React, { useContext, useEffect, useState } from 'react';
import DropDownFilter from "../components/DropDownFilter";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import { ThreeDots } from 'react-loader-spinner';
import { Context } from '../libs/context';
import { Search } from 'lucide-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const { isOpen, setIsOpen, statusChanged, admin, auth } = useContext(Context);
  const [jobsData, setJobsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [cleared, setCleared] = useState(false);
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getJobs() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const result = await res.json();
        let loc = Array.from(new Set(result.map((ele) => ele.location))).map((location) => ({ label: location, value: location }));
        let comp = Array.from(new Set(result.map((ele) => ele.company))).map((company) => ({ label: company, value: company }));
        setAllLocations(loc);
        setAllCompanies(comp);
        setOriginalData(result);
      } catch (e) {}
      setIsLoading(false);
    }
    getJobs();
  }, [isOpen, statusChanged]);

  useEffect(() => {
    let filtered = [...originalData];
    filtered = filtered.filter((ele) => ele.status === status);
    if (locationFilter !== '') filtered = filtered.filter((ele) => ele.location === locationFilter);
    if (companyFilter !== '') filtered = filtered.filter((ele) => ele.company === companyFilter);
    if (searchTerm && searchTerm.trim() !== "") {
      const q = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((ele) => (ele.jobTitle || "").toLowerCase().includes(q));
    }
    setFilteredJobs(filtered);
    setPage(1);
  }, [originalData, locationFilter, companyFilter, searchTerm, status]);

  useEffect(() => {
    const start = (page - 1) * 5;
    const end = start + 5;
    setJobsData(filteredJobs.slice(start, end));
  }, [page, filteredJobs]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setCompanyFilter('');
    setCleared((prev) => !prev);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || destination.index === source.index) return;
    const data = Array.from(jobsData);
    const [movedItem] = data.splice(source.index, 1);
    data.splice(destination.index, 0, movedItem);
    setJobsData(data);
  };

  if (auth) {
    return (
      <>
        <div className="p-4 flex flex-col min-h-screen w-full items-center gap-8 bg-slate-50">
          <p className="text-4xl font-bold text-slate-900">Latest Jobs</p>
          <form className="flex w-full max-w-lg mx-auto p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <input
              type="text"
              placeholder="Search job titles"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow p-2 text-slate-900 bg-transparent border-none focus:outline-none placeholder-gray-500"
            />
            <Search className='m-auto text-gray-400' />
          </form>
          <div className="flex flex-row gap-4">
            <DropDownFilter name="Filter by Location" options={allLocations} onFilterChange={setLocationFilter} cleared={cleared} />
            <DropDownFilter name="Filter by Company" options={allCompanies} onFilterChange={setCompanyFilter} cleared={cleared} />
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-blue-700 px-4 rounded-md bg-blue-100 font-semibold hover:bg-blue-200 duration-300 ease-in-out"
            >
              Clear Filter
            </button>
          </div>
          {admin && (
            <button
              type="button"
              className="text-blue-700 px-4 py-2 rounded-md bg-blue-100 font-semibold hover:bg-blue-200 duration-300 ease-in-out"
              onClick={() => setIsOpen(true)}
            >
              Create Job
            </button>
          )}
          <div className="h-px w-full max-w-5xl bg-gray-200 my-4"></div>
          <div className='mx-auto flex flex-row'>
            {admin && (
              <>
                <button
                  onClick={() => setStatus("active")}
                  type='button'
                  className={`text-blue-700 px-4 py-2 rounded-md ${status === "active" ? "bg-blue-200" : "bg-slate-50"} shadow-md font-semibold transition-bg duration-300 ease-in-out`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatus("archived")}
                  type='button'
                  className={`text-blue-700 px-4 py-2 rounded-md ${status === "archived" ? "bg-blue-200" : "bg-slate-50"} shadow-md font-semibold transition-bg duration-300 ease-in-out`}
                >
                  Archived
                </button>
              </>
            )}
          </div>
          <div className="flex flex-row gap-3 flex-wrap justify-center">
            {isLoading ? (
              <ThreeDots color="#3B82F6" height="80" width="80" visible={true} />
            ) : jobsData?.length === 0 ? (
              <p className='text-white text-xl'>No jobs are available</p>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="jobs-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-row gap-2 flex-wrap justify-center">
                      {jobsData.map((element, index) => (
                        <Draggable key={String(element.id)} draggableId={String(element.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition ${snapshot.isDragging ? "opacity-80 scale-105" : ""}`}
                            >
                              <JobCard
                                location={element.location}
                                jobtitle={element.jobTitle}
                                description={element.description}
                                company={element.company}
                                id={element.id}
                                status={element.status}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
          {Math.ceil(filteredJobs.length / 5) > 1 && (
            <div className='flex flex-row gap-1'>
              {Array.from({ length: Math.ceil(filteredJobs.length / 5) }).map((_, idx) => (
                <button
                  onClick={() => setPage(idx + 1)}
                  key={idx}
                  type='button'
                  className={`px-4 py-2 rounded-lg font-semibold transition text-slate-900 ${page === idx + 1 ? 'bg-blue-400 text-white shadow-md' : 'bg-slate-200 hover:bg-slate-400'}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
        <JobModal />
      </>
    );
  } else {
    return (
      <div className="p-4 flex flex-col min-h-screen w-full items-center gap-8 bg-slate-50">
        <p className='text-slate-600 text-md m-auto'>You must log in before seeing jobs</p>
      </div>
    );
  }
}
