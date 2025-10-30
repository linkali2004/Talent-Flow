import { useParams, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { ThreeDots } from "react-loader-spinner"
import { MapPin } from 'lucide-react'
import { Context } from "../libs/context"

export default function JobPage() {
  const { id } = useParams()
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [assessmentData, setAssessmentData] = useState(null)
  const { admin } = useContext(Context)
  const navigate = useNavigate()

  const handleClick = (e, url) => {
    e.preventDefault()
    navigate(url)
  }

  useEffect(() => {
    async function fetchJob() {
      setLoading(true)
      const res = await fetch(`/api/jobs/${id}`)
      const temp = await fetch(`/api/assessment/${id}`)
      const tempdata = await temp.json()
      const data = await res.json()
      setJobData(data.job)
      setLoading(false)
      if (temp.status !== 201) setAssessmentData(tempdata)
    }
    fetchJob()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <ThreeDots color="skyblue" height={80} width={80} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-8 bg-slate-50">
      <div className="p-6 bg-slate-200 rounded-xl shadow-lg ">

        <div className="flex flex-col gap-12 items-center w-full min-h-screen bg-slate-50 p-8">
          {jobData ? (
            <div className="flex flex-col gap-1 justify-center items-center">
              <h1 className="text-4xl font-bold text-center mb-2 text-slate-900">
                {jobData.jobTitle}
              </h1>
              <p className="text-slate-500 text-center max-w-2xl">{jobData.description}</p>
              <div className="flex gap-1 mt-4">
                <MapPin className="text-slate-500" />
                <p className="text-slate-500 text-center text-sm">{jobData.location}</p>
              </div>
              {admin && (
                <button
                  onClick={(e) => handleClick(e, `/build/${id}`)}
                  type="button"
                  className="mt-2 text-pink-700 px-4 py-2 rounded-md bg-pink-100 font-semibold hover:bg-pink-200 duration-300 ease-in-out"
                >
                  Create Assessment
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-400 mt-8">No job data found.</p>
          )}

          <div className="p-6 bg-slate-200 rounded-xl shadow-lg w-full">
            <p className="text-slate-500 text-lg font-semibold">All Assessments</p>
            {assessmentData?.length === 0 ? (
              <p className="text-gray-500 text-md">No Assessment Found</p>
            ) : (
              <div className="mt-4">
                {assessmentData?.map((ele, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-between p-4 mb-2 bg-slate-300 rounded-xl shadow-lg w-full"
                  >
                    <p>Assessment - {index + 1}</p>
                    <button
                      type="button"
                      className="text-gray-700 px-4 py-2 rounded-md bg-green-100 font-semibold hover:bg-green-200 duration-300 ease-in-out"
                      onClick={(e) => handleClick(e, `/test/${ele.id}`)}
                    >
                      Attempt
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
