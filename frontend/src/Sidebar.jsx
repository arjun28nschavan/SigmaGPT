import "./Sidebar.css";
import logo from "./assets/blacklogo.png";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setPrevChats, setNewChat } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            console.log(filteredData);
            //threadId, title
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    // ← Load messages of clicked thread
    const handleThreadClick = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`);
            const messages = await response.json();

            // Map "assistant" role to "gpt" to match your frontend
            const mapped = messages.map(m => ({
                role: m.role === "assistant" ? "gpt" : m.role,
                content: m.content
            }));

            setCurrThreadId(threadId);   // ← Switch to this thread
            setPrevChats(mapped);        // ← Load its messages
            setNewChat(false);           // ← Hide "Start a New Chat!"
        } catch (err) {
            console.log(err);
        }
    };

    // ← Reset everything for a new chat
    const handleNewChat = () => {
        setCurrThreadId(null);
        setPrevChats([]);
        setNewChat(true);
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]); // ← Re-fetch whenever thread changes

    // ← Delete a thread
    const handleDeleteThread = async (e, threadId) => {
        e.stopPropagation(); // ← Prevent triggering handleThreadClick

        try {
            await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE"
            });

            // If deleted thread was active, reset to new chat
            if (threadId === currThreadId) {
                setCurrThreadId(null);
                setPrevChats([]);
                setNewChat(true);
            }

            // Remove from list without refetching
            setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            {/* new chat button */}
            {/* new chat button - only pen icon opens new chat */}
            <div className="button">
                <img src={logo} alt="gpt logo" className="logo" />
                <span onClick={handleNewChat}><i className="fa-regular fa-pen-to-square"></i></span>
            </div>

            {/* history */}
            <ul className="history">
                {
                    //list all threads
                    allThreads?.map((thread, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleThreadClick(thread.threadId)}
                            className={thread.threadId === currThreadId ? "active" : ""}
                        >
                            <span className="threadTitle">{thread.title}</span>
                            <span className="deleteBtn" onClick={(e) => handleDeleteThread(e, thread.threadId)}>
                                <i className="fa-solid fa-trash"></i>
                            </span>
                        </li>
                    ))
                }
            </ul>

            {/* sign */}
            <div className="sign">
                <p>By Arjun Chavan &hearts;</p>
            </div>

        </section>
    )
}

export default Sidebar;