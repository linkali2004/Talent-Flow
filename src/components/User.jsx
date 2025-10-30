import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { NotepadTextDashed } from "lucide-react";
import NotesModal from "./NotesModal";

const stages = [
  { name: "Applied", color: "bg-yellow-500" },
  { name: "OA", color: "bg-yellow-800" },
  { name: "Interview", color: "bg-indigo-500" },
  { name: "Offer", color: "bg-purple-600" },
  { name: "Hired", color: "bg-purple-800" },
  { name: "Rejected", color: "bg-red-600" },
];

const timeline = [
  { stage: "Applied", detail: "Scheduled final interview with CTO." },
  { stage: "OA", detail: "Scheduled final interview with CTO." },
  { stage: "Interview", detail: "Technical interview completed" },
  { stage: "Offer", detail: "Recruiter reviewed application and moved forward." },
  { stage: "Hired", detail: "Recruiter reviewed application and moved forward." },
  { stage: "Rejected", detail: "Application submitted online." },
];

export default function User() {
  const { id } = useParams();
  const [candidateData, setCandidateData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setIsOpen] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [shouldRefetchNotes, setShouldRefetchNotes] = useState(false);
  const [doneAssessments, setDoneAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/candidates/${id}`);
        const data = await res.json();
        setCandidateData(data.user || data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/response/${id}`);
        const data = await res.json();
        setDoneAssessments(data.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/note/${id}`);
        const data = await res.json();
        setAllNotes(Array.isArray(data) ? data : []);
      } catch {
        setAllNotes([]);
      }
    })();
  }, [id, shouldRefetchNotes]);

  const handleClick = useCallback((e, url) => {
    e.preventDefault();
    navigate(url);
  }, [navigate]);

  const onDragEnd = async (result) => {
    if (!result.destination || !candidateData) return;
    const newStage = result.destination.droppableId;
    const originalStage = candidateData.stage;
    if (newStage === originalStage) return;
    setCandidateData((prev) => ({ ...prev, stage: newStage }));
    setIsUpdating(true);
    try {
      await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
    } catch {
      setCandidateData((prev) => ({ ...prev, stage: originalStage }));
    } finally {
      setIsUpdating(false);
    }
  };

  if (!candidateData)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-gray-400">
        <p>Loading candidate details...</p>
      </div>
    );

  const currentStageColor =
    stages.find((s) => s.name === candidateData.stage)?.color || "bg-gray-500";

  return (
    <>
      <div className="flex flex-col min-h-screen w-full p-8 bg-slate-50">
        <div className="mb-8 p-6 bg-slate-200 rounded-xl shadow-lg">
          <p className="text-4xl font-bold text-slate-900 text-center">{candidateData.username}</p>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Hiring History</h2>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-700"></div>
                <div className="space-y-6">
                  {timeline.map((ele, index) => {
                    const active = candidateData.stage === ele.stage;
                    const markerColor = active ? stages.find((e) => e.name === candidateData.stage).color : "bg-gray-600";
                    return (
                      <div key={index} className="relative group">
                        <div className={`absolute -left-4 top-1 w-4 h-4 rounded-full ${markerColor}`}></div>
                        <div className="bg-slate-100 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className={`font-semibold ${active ? "text-slate-900" : "text-slate-600"}`}>{ele.stage}</p>
                            {active && <span className={`text-xs px-2 py-0.5 rounded-full ${currentStageColor} text-white`}>Active</span>}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{ele.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <NotepadTextDashed className="w-6 h-6 text-gray-400" />
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Notes</h2>
                    <p className="text-xs text-slate-700">History & comments for this candidate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-700">{allNotes.length} notes</span>
                  <button onClick={() => setIsOpen(true)} className="text-pink-700 px-3 py-1 shadow-md rounded-md bg-pink-100 text-sm hover:bg-pink-200 duration-300 ease-in-out">
                    Add Note
                  </button>
                </div>
              </div>
              <div className="mt-4 max-h-72 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {allNotes.length > 0 ? (
                  allNotes.map((n, idx) => (
                    <div key={n.id ?? idx} className="flex gap-3 bg-slate-100 p-3 rounded-lg items-center shadow-lg">
                      <div className="flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-xs text-gray-300">{idx + 1}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 break-words">{n.note}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-6">
                    <p className="font-medium">No notes yet</p>
                    <p className="text-sm mt-1">Click “Add Note” to create one.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl shadow-lg w-full py-6">
          <p className="text-4xl font-bold text-slate-900 text-center mb-6">Move Through Stages</p>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto w-full pb-4 items-center justify-center flex-wrap">
              {stages.map((stage) => {
                const isCurrentStage = candidateData.stage === stage.name;
                const currentStageStyle = stages.find((s) => s.name === candidateData.stage)?.color;
                return (
                  <Droppable droppableId={stage.name} key={stage.name}>
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className={`bg-slate-300 rounded-xl p-4 min-w-[280px] flex-shrink-0 h-full border-t-4 border-slate-900 ${isCurrentStage ? currentStageColor.replace("bg", "border") : "border-transparent"} ${snapshot.isDraggingOver ? "bg-white" : ""}`}>
                        <h3 className="text-lg font-bold mb-3 text-slate-800 border-b border-slate-100 pb-2">
                          {stage.name}
                          {isCurrentStage && <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${currentStageStyle} text-white`}>Active</span>}
                        </h3>
                        {isCurrentStage && (
                          <Draggable draggableId={String(candidateData.id)} index={0} isDragDisabled={isUpdating}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`p-3 rounded-lg shadow-lg mb-2 transition cursor-grab ${snapshot.isDragging ? "bg-slate-200 shadow-xl" : "bg-slate-50"}`}>
                                <p className="font-semibold text-slate-900">{candidateData.username}</p>
                                <p className="text-xs text-slate-700">{candidateData.email}</p>
                              </div>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </DragDropContext>
        </div>
        <div className="p-6 bg-slate-100 rounded-xl shadow-xl mt-4 w-full">
          <p className="text-4xl font-bold text-slate-900 text-center my-6">Past Assessments</p>
          {doneAssessments.length == 0 ? (
            <p className="text-md text-slate-700 text-center my-6">Candidate has yet to attempt assessments</p>
          ) : (
            doneAssessments.map((ele, index) => (
              <div key={index} className="flex flex-row items-center justify-between p-4 mb-2 bg-slate-700 border border-gray-800 rounded-xl shadow-lg mt w-full">
                <p>Assessment - {index + 1}</p>
                <button type="button" className="text-gray-700 px-4 py-2 rounded-md bg-green-100 font-semibold hover:bg-green-200 duration-300 ease-in-out" onClick={(e) => handleClick(e, `/test/${ele}`)}>
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <NotesModal open={open} setIsOpen={(val) => { if (!val) setShouldRefetchNotes((prev) => !prev); setIsOpen(val); }} />
    </>
  );
}
