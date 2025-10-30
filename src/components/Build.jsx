import React, { useCallback, useContext, useState } from "react"
import { Plus, Trash2, CheckCircle } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Context } from "../libs/context"
import QuestionBlock from "./QuestionBlock"

export default function Build() {
    const { id } = useParams()
    const [title, setTitle] = useState("New Job Assessment")
    const [sections, setSections] = useState([])
    const [nextQuestionId, setNextQuestionId] = useState(101)
    const [nextSectionId, setNextSectionId] = useState(1)
    const [time, setTime] = useState({ hours: 0, minutes: 0 })
    const { types } = useContext(Context)
    const navigate = useNavigate()

    const handleClick = useCallback((href) => {navigate(href)},[navigate])

    const updateSectionName = useCallback((sectionId, newName) => {
        setSections((prev) =>
            prev.map((ele) => (ele.id === sectionId ? { ...ele, name: newName } : ele))
        )
    }, [])

    const addQuestion = useCallback(
        (sectionId) => {
            setSections((prev) =>
                prev.map((ele) =>
                    ele.id === sectionId
                        ? {
                            ...ele,
                            questions: [
                                ...ele.questions,
                                {
                                    id: nextQuestionId,
                                    type: "short_text",
                                    text: "",
                                    options: ["", "", "", ""],
                                    numerical: 0.0,
                                },
                            ],
                        }
                        : ele
                )
            )
            setNextQuestionId((prev) => prev + 1)
        },
        [nextQuestionId]
    )

    const removeQuestion = useCallback((questionId) => {
        setSections((prev) =>
            prev.map((section) => ({
                ...section,
                questions: section.questions.filter((q) => q.id !== questionId),
            }))
        )
    }, [])

    const updateQuestionType = useCallback((questionId, newType) => {
        setSections((prev) =>
            prev.map((section) => ({
                ...section,
                questions: section.questions.map((q) =>
                    q.id === questionId ? { ...q, type: newType } : q
                ),
            }))
        )
    }, [])

    const updateQuestionText = useCallback((questionId, sectionId, text) => {
        setSections((prev) =>
            prev.map((ele) =>
                ele.id === sectionId
                    ? {
                        ...ele,
                        questions: ele.questions.map((q) =>
                            q.id === questionId ? { ...q, text } : q
                        ),
                    }
                    : ele
            )
        )
    }, [])

    const updateQuestionOptions = useCallback((questionId, sectionId, index, value) => {
        setSections((prev) =>
            prev.map((ele) =>
                ele.id === sectionId
                    ? {
                        ...ele,
                        questions: ele.questions.map((q) =>
                            q.id === questionId
                                ? {
                                    ...q,
                                    options: q.options.map((opt, i) => (i === index ? value : opt)),
                                }
                                : q
                        ),
                    }
                    : ele
            )
        )
    }, [])

    const updateNumericalValue = useCallback((questionId, sectionId, value) => {
        setSections((prev) =>
            prev.map((ele) =>
                ele.id === sectionId
                    ? {
                        ...ele,
                        questions: ele.questions.map((q) =>
                            q.id === questionId ? { ...q, numerical: value } : q
                        ),
                    }
                    : ele
            )
        )
    }, [])

    const removeSection = useCallback((sectionId) => {
        setSections((prev) => prev.filter((section) => section.id !== sectionId))
    }, [])

    const addSection = useCallback(() => {
        setSections((prev) => [
            ...prev,
            { id: nextSectionId, name: `Section ${nextSectionId}`, questions: [] },
        ])
        setNextSectionId((prev) => prev + 1)
    }, [nextSectionId])

    const handlePublish = useCallback(async () => {
        const data = { defination: sections, time: time }
        const res = await fetch(`/api/assessment/${id}`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        })
        const temp = await res.json()
        if (res.ok) {
            toast("Assessment Created Successfully")
            handleClick(`/assessment/${id}`)
        } else {
            toast("Problem creating Assessment")
        }
    }, [sections, time, id, handleClick])

    return (
        <div className="flex flex-col min-h-screen w-full p-8 bg-slate-50 rounded-lg text-gray-200">
            <div className="flex flex-col sm:flex-row w-full min-h-screen bg-slate-200 rounded-lg">
                <div className="w-full sm:w-1/4 min-h-screen bg-gray-900 border-r border-gray-800 p-6 flex flex-col rounded-lg">
                    <h2 className="text-3xl font-bold text-sky-400 mb-6">Assessment Builder</h2>

                    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-6">
                        <p className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
                            Settings
                        </p>
                        <label className="block mb-2 text-sm text-gray-400">Assessment Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200"
                        />

                        <div className="flex flex-col gap-1 mt-4">
                            <p className="block my-2 text-sm text-gray-400">Set Time Limit</p>
                            <div className="flex flex-row gap-2 items-center justify-center">
                                <div className="flex flex-col items-center w-1/2">
                                    <label className="text-sm font-semibold mb-1 text-slate-300">Hours</label>
                                    <input
                                        id="hours"
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={time.hours}
                                        onChange={(e) =>
                                            setTime((prev) => ({
                                                ...prev,
                                                ["hours"]: parseInt(e.target.value) || 0,
                                            }))
                                        }
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 text-center"
                                    />
                                </div>
                                <span className="text-lg text-slate-400 mb-6">:</span>
                                <div className="flex flex-col items-center w-1/2">
                                    <label className="text-sm font-semibold mb-1 text-slate-300">Minutes</label>
                                    <input
                                        id="minutes"
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={time.minutes}
                                        onChange={(e) =>
                                            setTime((prev) => ({
                                                ...prev,
                                                ["minutes"]: parseInt(e.target.value) || 0,
                                            }))
                                        }
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 text-center"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePublish}
                        className="mt-auto px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md disabled:bg-gray-700"
                        disabled={(time.hours === 0 && time.minutes === 0) || sections.length === 0}
                    >
                        <CheckCircle className="w-5 h-5 inline mr-2" />
                        Save
                    </button>
                </div>

                <div className="w-full sm:w-3/4 p-8 overflow-y-auto">
                    <h1 className="text-4xl font-extrabold mb-8 text-slate-900">{title}</h1>

                    <div className="space-y-8">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className="bg-slate-200 p-6 rounded-xl shadow-2xl border border-gray-700"
                            >
                                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                                    <input
                                        type="text"
                                        defaultValue={section.name}
                                        onBlur={(e) => updateSectionName(section.id, e.target.value)}
                                        className="text-2xl font-bold bg-transparent focus:outline-none w-full text-slate-900"
                                    />
                                    <button
                                        onClick={() => removeSection(section.id)}
                                        className="text-red-500 hover:text-red-400 ml-4 p-1 rounded transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {section.questions.map((q, index) => (
                                    <QuestionBlock
                                        key={q.id}
                                        secId={section.id}
                                        question={q}
                                        index={index}
                                        onTypeChange={updateQuestionType}
                                        onDeleteHandle={removeQuestion}
                                        updateQuestionText={updateQuestionText}
                                        updateQuestionOptions={updateQuestionOptions}
                                        updateNumericalValue={updateNumericalValue}
                                        types={types}
                                    />
                                ))}

                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={() => addQuestion(section.id)}
                                        className="flex items-center px-4 py-2 bg-sky-400 text-slate-900 font-semibold rounded-lg hover:bg-sky-500 transition shadow-md"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Question
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={addSection}
                            className="flex items-center px-6 py-3 border border-dashed border-slate-900 text-slate-900 rounded-lg hover:bg-gray-800 hover:text-slate-100 transition"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
