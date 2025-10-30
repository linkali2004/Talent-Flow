import { User, Mail } from 'lucide-react'
import { useCallback, useContext } from 'react'
import { Context } from '../libs/context'
import { useNavigate } from 'react-router-dom'
import { mirageServer } from '../../mirage/server'

export default function CandidateCard({ id, username, email, stage }) {
  const { setCandidateId } = useContext(Context)
  const navigate = useNavigate()

  const handleClick = (e, id) => {
    e.preventDefault()
    setCandidateId(id)
    navigate(`/candidates/${id}`)
  }

  const getStageColor = useCallback((stage) => {
    switch (stage) {
      case 'Hired': return 'bg-purple-400 text-purple-900'
      case 'Interview': return 'bg-indigo-400 text-indigo-900'
      case 'OA': return 'bg-yellow-400 text-yellow-900'
      case 'Applied': return 'bg-yellow-500 text-yellow-900'
      case 'Offer': return 'bg-purple-400 text-purple-900'
      case 'Rejected': return 'bg-red-400 text-red-900'
      default: return 'bg-gray-100 text-gray-700'
    }
  }, [])

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-xs hover:shadow-sky-700 transition duration-300 ease-in-out">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xl font-bold text-black mr-3"><User /></span>
        <p className="flex-grow font-bold text-xl text-slate-900 break-words line-clamp-2">{username}</p>
      </div>
      <div className="flex items-center justify-center items-start mb-3">
        <span className="text-sm font-bold text-slate-500 mr-3"><Mail /></span>
        <p className="flex-grow text-sm text-slate-500">{email}</p>
      </div>
      <div className={`px-4 py-1 rounded-full text-xs font-bold self-end ${getStageColor(stage)}`}>{stage}</div>
      <div className="h-px w-full bg-gray-200 my-6"></div>
      <button onClick={(e) => handleClick(e, id)} className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">View Profile</button>
    </div>
  )
}
