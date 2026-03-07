import "./Chat.css";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // this is used to highlight the code  

//react-markdown -> proper formatting display
//rehype-highlight-> syntax highlighting of code 

function Chat() {
    const { newChat, prevChats = [], reply } = useContext(MyContext);
    const chatsRef = useRef(null);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        //LatestReply separate => typing effect create 
        if (!prevChats?.length) return; //if no prev chats return
        if (!reply) return; // ← reply can be null when loading old thread

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);

    useEffect(() => {
        // Auto-scroll to bottom on new messages
        chatsRef.current?.scrollTo({
            top: chatsRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [prevChats, latestReply]); // Re-scroll when reply updates or typing

    return (
        <>
            {newChat && prevChats.length === 0 && (
                <h1 className="newChatHeading">Start a New Chat!</h1>
            )}

            <div className="chats" ref={chatsRef}>
                {/* Show all messages except the last GPT reply (animated separately) */}
                {prevChats?.slice(0, reply ? -1 : undefined).map((chat, idx) => (
                    <div key={idx} className="message-wrapper">
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"}>
                            {chat.role === "user" ? (
                                <p className="userMessage">{chat.content}</p>
                            ) : (
                                <div className="gptMessage">
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {chat.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Typing effect - only renders ONCE for the latest reply */}
                {prevChats.length > 0 && latestReply !== null && (
                    <div className="message-wrapper" key="typing">
                        <div className="gptDiv">
                            <div className="gptMessage">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {latestReply}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}
            
            {/* <div className="message-wrapper">
                <div className="userDiv">
                    <p className="userMessage">User Message</p>
                </div>
                <div className="gptDiv">
                    <p className="gptMessage">GPT generated message</p>
                </div>
            </div> */}
            {/* Add more messages here dynamically from context */}
            </div>
        </>
    );
}

export default Chat;