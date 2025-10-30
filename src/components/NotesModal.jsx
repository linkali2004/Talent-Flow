import React, { useCallback, useContext, useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import { toast } from "react-toastify";
import { Context } from "../libs/context";

export default function NotesModal({ open, setIsOpen }) {
  const [note, setNote] = useState("");
  const { candidateId } = useContext(Context);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!note.trim()) return;
      setIsSubmitting(true);

      try {
        const res = await fetch("/api/addnote", {
          method: "POST",
          body: JSON.stringify({ note: note.trim(), by: candidateId }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.success) {
          toast.success("Note Created Successfully");
          setNote("");
          setIsOpen(false);
        } else {
          toast.error("Failed to create note");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
    [note, candidateId, setIsOpen]
  );

  useEffect(() => {
    if (!open) {
      setNote("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 mx-4 transform transition-all duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          <CircleX />
        </button>

        <p className="text-slate-900 text-center text-2xl font-bold border-b border-gray-300 pb-3">
          Add Note for Candidate {candidateId}
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 mt-4 mb-6"
        >
          <textarea
            placeholder="Write a note about this candidate..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="p-3 border border-gray-300 rounded-lg text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-500"
            required
          />
          <button
            disabled={isSubmitting}
            className={`p-2 rounded-lg font-semibold text-white shadow-md transition ${
              isSubmitting
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
            type="submit"
          >
            {isSubmitting ? "Adding..." : "Add Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
