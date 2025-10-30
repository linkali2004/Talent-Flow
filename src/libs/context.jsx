import React, { createContext, useState } from "react";
import { CheckCircle, Type, Hash, AlignLeft } from "lucide-react";

export const Context = createContext(null);

export default function ContextProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [jobId, setjobId] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    const [user, setUser] = useState(false);
    const [statusChanged, setStatusChanged] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [auth, setAuth] = useState(null);

    const types = [
        { type: "single_choice", label: "Single Choice", icon: CheckCircle },
        { type: "short_text", label: "Short Text", icon: Type },
        { type: "long_text", label: "Long Text", icon: AlignLeft },
        { type: "numeric_range", label: "Numeric (Range)", icon: Hash },
    ];

    return (
        <Context.Provider
            value={{
                types,
                auth,
                setAuth,
                isOpen,
                setIsOpen,
                isEdit,
                setIsEdit,
                jobId,
                setjobId,
                candidateId,
                setCandidateId,
                user,
                setUser,
                statusChanged,
                setStatusChanged,
                admin,
                setAdmin,
            }}
        >
            {children}
        </Context.Provider>
    );
}