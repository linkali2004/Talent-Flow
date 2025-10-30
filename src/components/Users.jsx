import React, { useCallback, useContext, useEffect, useState } from 'react'
import DropDownFilter from './DropDownFilter'
import { Search } from 'lucide-react'
import { ThreeDots } from 'react-loader-spinner'
import { Context } from '../libs/context'
import CandidateCard from './CandidateCard'

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const { isOpen } = useContext(Context)
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [originalData, setOriginalData] = useState([])
  const [allStages, setAllStages] = useState([])
  const [cleared, setCleared] = useState(false)
  const [filteredCandidate, setFilteredCandidate] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function getJobs() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/candidates')
        if (!res.ok) throw new Error('Failed to fetch candidates')
        const result = await res.json()
        const sta = Array.from(new Set(result.map((ele) => ele.stage))).map((ele) => ({ label: ele, value: ele }))
        setAllStages(sta)
        setCandidates(result)
        setOriginalData(result)
        setFilteredCandidate(result)
      } catch {}
      setIsLoading(false)
    }
    getJobs()
  }, [isOpen])

  useEffect(() => {
    if (!originalData || originalData.length === 0) {
      setCandidates([])
      return
    }
    let filtered = [...originalData]
    if (stageFilter !== '') filtered = filtered.filter((ele) => ele.stage === stageFilter)
    if (searchTerm && searchTerm.trim() !== '') {
      const q = searchTerm.trim().toLowerCase()
      filtered = filtered.filter((ele) => ele.username.toLowerCase().includes(q))
    }
    setFilteredCandidate(filtered)
  }, [stageFilter, originalData, searchTerm])

  useEffect(() => {
    const start = (page - 1) * 5
    const end = start + 5
    setCandidates(filteredCandidate.slice(start, end))
  }, [page, filteredCandidate])

  const handleClearFilters = useCallback(() => {
    setSearchTerm('')
    setStageFilter('')
    setCleared(true)
  }, [])

  return (
    <div className="p-4 flex flex-col min-h-screen w-full items-center gap-8 bg-slate-50">
      <p className="text-4xl font-bold text-slate-900">All Candidates</p>
      <form className="flex w-full max-w-lg mx-auto p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Search Candidates"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 text-slate-900 bg-transparent border-none focus:outline-none placeholder-gray-500"
        />
        <Search className="m-auto text-gray-400" />
      </form>
      <div className="flex flex-row gap-4">
        <DropDownFilter
          name="Filter by Stage"
          options={allStages}
          onFilterChange={setStageFilter}
          cleared={cleared}
        />
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-pink-700 px-4 rounded-md bg-pink-100 font-semibold hover:bg-pink-200 duration-300 ease-in-out"
        >
          Clear Filter
        </button>
      </div>
      <div className="h-px w-full max-w-5xl bg-gray-200 my-4"></div>
      <div className="flex flex-row gap-3 flex-wrap justify-center">
        {candidates.length === 0 ? (
          isLoading ? (
            <ThreeDots color="#3B82F6" height="80" width="80" visible={true} />
          ) : (
            <p className="text-gray-700 text-xl">No Candidates are available</p>
          )
        ) : (
          candidates.map((element) => (
            <CandidateCard
              key={element.id}
              id={element.id}
              username={element.username}
              email={element.email}
              stage={element.stage}
            />
          ))
        )}
      </div>
      {Math.ceil(filteredCandidate.length / 5) > 1 && (
        <div className="flex flex-row gap-1">
          {Array.from({ length: Math.ceil(filteredCandidate.length / 5) }).map((_, idx) => (
            <button
              onClick={() => setPage(idx + 1)}
              key={idx}
              type="button"
              className={`px-4 py-2 rounded-lg font-semibold transition text-slate-900 ${
                page === idx + 1
                  ? 'bg-pink-400 text-white shadow-md'
                  : 'bg-slate-200 hover:bg-slate-400'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
