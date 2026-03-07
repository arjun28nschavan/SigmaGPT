import './App.css';
import Sidebar from './Sidebar';
import Chatwindow from './Chatwindow';
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(null); //unique id will be generated
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads 
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const provideValues = {//passing values
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
  };

  
  return (
    <div className='app' >
      <MyContext.Provider value={provideValues}>
        <Sidebar></Sidebar>
        <Chatwindow></Chatwindow>
      </MyContext.Provider>

    </div>
  )
}

export default App
