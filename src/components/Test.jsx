import React, { useCallback, useEffect, useState, useContext } from "react";
import AnswerBlock from "./AnswerBlock";
import { Context } from "../libs/context";
import { CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

export default function Test() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [timer, setTimer] = useState(0);
  const [running, setIsRunning] = useState(false);
  const [responses, setResponses] = useState(null);
  const [finished, setFinished] = useState(false);
  const [compId, setCompId] = useState(null);
  const { types } = useContext(Context);
  const navigate = useNavigate();

  const handleRedirect = useCallback(() => {
    navigate("/jobs");
  }, [navigate]);

  useEffect(() => {
    (async function () {
      const res = await fetch(`/api/singleAssessment/${id}`);
      const data = await res.json();
      const temp = JSON.parse(data.assessment.body);
      setCompId(data.assessment.compId);
      setAssessment(temp);
      setResponses(() =>
        temp.map((ele) => ({
          id: ele.id,
          questions: ele.questions.map((x) => ({
            ...x,
            answer: "",
          })),
        }))
      );
      setTimer(
        data.assessment.time.hours * 60 * 60 +
          data.assessment.time.minutes * 60
      );
    })();
  }, [id]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimer(0);
          setIsRunning(false);
          handleEndTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const startTest = () => {
    if (!running && timer > 0) setIsRunning(true);
  };

  const handleEndTest = useCallback(async () => {
    setTimer(0);
    setIsRunning(false);
    const userId = JSON.parse(localStorage.getItem("auth")).data.id;
    const data = { compId: compId, by: userId, defination: responses };
    const res = await fetch(`/api/response/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const temp = await res.json();
    if (res.ok) {
      toast("Test Submitted Successfully");
      setResponses([]);
      setAssessment([]);
      setFinished(true);
    } else {
      toast("Problem Submitting Test");
    }
  }, [compId, responses, id]);

  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor((timer % 3600) / 60);
  const seconds = timer % 60;

  if (finished) {
    return (
      <div className="w-full min-h-screen flex flex-col gap-2 items-center justify-center">
        <p className="text-semibold text-lg text-gray-400">
          You have Submitted this Test
        </p>
        <button
          onClick={handleRedirect}
          type="button"
          className="text-pink-700 px-4 py-2 rounded-md bg-pink-100 font-semibold hover:bg-pink-200 duration-300 ease-in-out"
        >
          Navigate to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-slate-50 text-gray-200 p-4">
      <div className="w-full lg:w-1/4 min-h-fit lg:min-h-screen bg-slate-200 p-6 flex flex-col rounded-md mb-6 lg:mb-0">
        <p className="text-3xl text-center font-bold text-slate-900 mb-6">
          Assessment {id}
        </p>
        <div className="text-6xl font-mono mb-6 text-center text-slate-900">
          {String(hours).padStart(2, "0")}:
          {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </div>
        {running ? (
          <button
            onClick={handleEndTest}
            className="px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-md"
          >
            <CheckCircle className="w-5 h-5 inline mr-2" />
            End Test
          </button>
        ) : (
          <button
            onClick={startTest}
            className="px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
          >
            <CheckCircle className="w-5 h-5 inline mr-2" />
            Start Test
          </button>
        )}
      </div>

      <div className="w-full lg:w-3/4 p-4 lg:p-8 overflow-y-auto">
        <div className="space-y-8">
          {running &&
            assessment?.map((section) => (
              <div
                key={section.id}
                className="bg-slate-200 p-6 rounded-xl shadow-2xl"
              >
                <p className="text-bold text-slate-900 text-lg mb-3">
                  {section.name}
                </p>
                {section.questions.map((ele, index) => (
                  <AnswerBlock
                    key={index}
                    question={ele}
                    index={index}
                    setResponses={setResponses}
                    secId={section.id}
                    types={types}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
