import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyContextProvider({ children }) {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState("");
    const [currThreadId, setCurrThreadId] = useState(null);
    const [prevChats, setPrevChats] = useState([]);
    const [allThreads, setAllThreads] = useState([]);
    const [newChat, setNewChat] = useState(true);

    return (
        <MyContext.Provider value={{
            prompt, setPrompt,
            reply, setReply,
            currThreadId, setCurrThreadId,
            prevChats, setPrevChats,
            allThreads, setAllThreads,
            newChat, setNewChat
        }}>
            {children}
        </MyContext.Provider>
    );
}