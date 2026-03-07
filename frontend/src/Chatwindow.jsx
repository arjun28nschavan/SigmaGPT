import "./Chatwindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { v1 as uuidv1 } from "uuid";

function Chatwindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); //set default flase

    const getReply = async () => {
        if (!prompt.trim()) return;  // Prevent empty sends

        setLoading(true);
        const userMessage = prompt;  // Capture before clearing

        // Generate new threadId if none exists
        let threadId = currThreadId;
        if (!threadId) {
            threadId = uuidv1();
            setCurrThreadId(threadId); // ← This triggers Sidebar to re-fetch!
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: threadId,  // ← use local variable
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            console.log(response);

            const res = await response.json();
            console.log(res);


            // ✅ Correctly append BOTH messages
            setPrevChats(prev => [...(prev || []),
            { role: 'user', content: userMessage },
            { role: 'gpt', content: res.reply }
            ]);
            setReply(res.reply);
            setPrompt("");  // Clear AFTER adding to state
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    // //Append new chats to prevchats
    // useEffect(() => {
    //     if (prompt && reply) {
    //         setPrevChats(prevChats => {
    //             [...prevChats, {
    //                 role: "user",
    //                 content: prompt
    //             }, {
    //                 role: "assistant",
    //                 content: reply
    //             }]
    //         })
    //     }

    //     setPrompt("");//re-initialzed with empty string
    // }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <div className="chatWindow">
                <div className="navbar">
                    <span>SigmaGPT<i className="fa-solid fa-angle-down"></i></span>
                    <div className="userIconDIv" onClick={handleProfileClick}>
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                </div>

                {
                    isOpen && 
                    <div className="dropDown">
                        <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
                        <div className="dropDownItem"><i class="fa-solid fa-gear"></i> Settings</div>
                        <div className="dropDownItem"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log Out</div>
                    </div>
                }

                <div className="chat">
                    <Chat />
                </div>

                {loading && (  // ← Only render when loading
                    <div className="loaderDiv">
                        <ScaleLoader color="#fff" loading={loading} />
                    </div>
                )}

                <div className="chatInput">
                    <div className="inputBox">
                        <input type="text" placeholder="ask anything"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                        ></input>
                        <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    <p className="info">
                        SigmaGPT can make mistakes. Check important info. See Cookie Preferences
                    </p>
                </div>
            </div>
        </>
    )
}

export default Chatwindow;