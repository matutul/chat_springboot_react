import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { UserContext } from '../routes/Router';
import { Navigate, useNavigate } from 'react-router';
import { FiArrowDown, FiArrowUp, FiChevronDown, FiFile, FiLink2, FiMessageCircle, FiMoon, FiSend, FiSun } from 'react-icons/fi';
import useTheme from '../hooks/useTheme';
import SockJS from 'sockjs-client';
import { AppConfig } from '../config/AppConfig';
import { Stomp } from '@stomp/stompjs';
import toast, { Toaster } from 'react-hot-toast';
import RoomService from '../service/RoomService';

const ChatHomePage = () => {
  const { user, saveUserAlongStorageHandler } = useContext(UserContext);
  const [showMenus, setShowMenus] = useState(false);
  const [theme, setTheme] = useTheme();
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recentMessages, setRecentMessages] = useState([]);
  const chatBoxRef = useRef(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalMessages, setTotalMessages] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    if (Math.ceil(totalMessages / size) > page) {
      loadMessagesFromDatabase(user.roomId, page, size);
    }
    if (page == 0) {
      setMessages([]);
    }
    scrollToBottom(page);
  }, [page])

  // fetch messages from database
  const loadMessagesFromDatabase = (roomId, page, size) => {
    if (user.roomId) {
      RoomService.getMessagesFromDatabase(roomId, page, size)
        .then(res => {
          setTotalMessages(res.data.totalMessages);
          setMessages([...res.data.paginatedMessages, ...messages]);
        })
        .catch((error) => toast.error("Something went wrong"))
    }
  }

  // initialize stompClient-------------------------------------------Websocket----------------------------------------------------Websocket-------------------------------------------------------------Websocket--------------------------------------
  useEffect(() => {
    const connectWebSocket = (roomId) => {
      setMessages([]);
      const sock = new SockJS(`${AppConfig.backendBaseApi}/chat`);
      const client = Stomp.over(sock);

      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected");

        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setRecentMessages((prev) => [...prev, newMessage]);
        })
      })
    }
    if (user.roomId) {
      connectWebSocket(user.roomId);
    }
    loadMessagesFromDatabase(user.roomId, page, size);
  }, [user.roomId])



  // send message handling
  const sendMessage = async () => {

    if (newMessage) {

      const message = {
        sender: user.name,
        content: newMessage,
        roomId: user.roomId,
      };
      const res = await stompClient.send(`/app/sendMessage/${user.roomId}`,
        {},
        JSON.stringify(message)
      )
    }
    setNewMessage("");
    scrollToBottom(0)
  }

  useEffect(() => {
    scrollToBottom(page);
  }, [messages])

  useEffect(() => {
    if (recentMessages.length && recentMessages[recentMessages.length - 1].sender === user.name) {
      scrollToBottom(0);
    }
  }, [recentMessages])


  const scrollToBottom = (page = 0) => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight / (page + 1),
        behaviors: 'smooth',
      })
    }
  }

  return (
    <div className='w-full h-screen bg-gray-200 text-gray-950 dark:bg-gray-900 dark:text-gray-200 flex flex-col gap-2 justify-center items-center p-2 md:p-0'>
      <div className="w-full h-full fixed z-0 bg-[url(/topography.svg)] opacity-10 dark:opacity-50"></div>
      <div className="w-full md:w-md z-10 lg:w-lg h-full md:h-[calc(100vh-60px)] rounded-lg bg-gray-300 dark:bg-gray-800 shadow darK:border flex flex-col space-between overflow-hidden relative">
        <Toaster position="bottom-left" />
        {/* header section */}
        <div className="h-16 bg-gray-400 dark:bg-gray-950 p-4 px-6 flex items-center justify-between">
          <p className='flex items-center gap-2 text-xl text-gray-50'><FiMessageCircle className='text-3xl cursor-default font-extrabold' /> Chat Room ({user.roomId}, {totalMessages}) page: {page}, {messages.length}</p>
          <div className="relative w-fit flex items-center gap-2">
            <div className="w-8 aspect-square rounded-full flex md:hidden justify-center items-center" onClick={() => { theme == 'dark' ? setTheme("light") : setTheme("dark") }}>{theme == "dark" ? <FiSun className='text-xl' /> : <FiMoon className='text-xl' />}</div>
            {user && <p className='text-xl flex items-center gap-2 cursor-pointer text-gray-50' onClick={() => setShowMenus(!showMenus)}>{user.name}<FiChevronDown className={`${showMenus ? "rotate-180" : ""} transition-all duration-300`} /></p>}
            <ul className={`bg-gray-200 dark:bg-gray-900 rounded overflow-hidden shadow-lg z-10 ${showMenus ? "absolute right-0 top-full" : "hidden"}`}>
              <p className='cursor-pointer py-2 px-4 hover:bg-gray-300 hover:dark:bg-gray-800 transition-all duration-300'>Settings</p>
              <p className='cursor-pointer py-2 px-4 hover:bg-gray-300 hover:dark:bg-gray-800 transition-all duration-300' onClick={() => {
                localStorage.removeItem("chatUser");
                saveUserAlongStorageHandler({ name: "", roomId: "" });
                navigate("/login");
              }}>Logout</p>
            </ul>
          </div>
        </div>
        {/* Chat messages section */}
        {(recentMessages.length!=0 && recentMessages[recentMessages.length - 1].sender !== user.name) && <button className='absolute bottom-16 left-1 z-20 w-4 h-fit rounded-full bg-gray-950 overflow-hidden p-2 flex flex-col justify-center items-center cursor-pointer' onClick={() => {scrollToBottom(0);}}><span>{recentMessages.length}</span><FiArrowDown /></button>}
        <div ref={chatBoxRef} className="relative w-full h-full bg-gray-100 dark:bg-gray-700 p-2 flex flex-col  gap-2 overflow-y-auto [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-400
          [&::-webkit-scrollbar-thumb]:rounded-full
          dark:[&::-webkit-scrollbar-track]:bg-gray-700
          dark:[&::-webkit-scrollbar-thumb]:bg-emerald-700">
          {Math.ceil(totalMessages / size) > (page + 1) && <button className='w-8 aspect-square rounded-full absolute top-2 left-[50%] -translate-x-[50%] bg-gray-500 animate-pulse flex justify-center items-center text-xl' onClick={Math.ceil(totalMessages / size) > (page + 1) ? () => setPage((prev) => prev + 1) : () => { toast.error("No more!") }}><FiArrowUp /></button>}
          {messages.length ? messages.map((msg, index) => (
            <div className={`w-full flex items-end gap-1.5 ${user.name == msg.sender ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 aspect-square rounded-full flex justify-center items-center uppercase text-white ${user.name == msg.sender ? "bg-emerald-700" : "bg-slate-600"}`}>{msg.sender.charAt(0)}</div>
              <div className={`max-w-[70%] w-fit h-fit p-1 px-2 pt-0 rounded-lg flex flex-col  ${user.name == msg.sender ? "items-end rounded-br-none bg-gray-300 dark:bg-gray-800" : "rounded-bl-none bg-gray-300 dark:bg-gray-700 shadow-md border border-gray-600"}`}>
                <p className='text-xs leading-4'>{msg.sender}</p>
                <p className={`text-sm ${user.name == msg.sender ? "text-right" : "text-left"}`}>{msg.content}</p>
              </div>
            </div>
          )) : <div className='w-full h-full flex justify-center items-center'><p>No messages</p></div>}
          {recentMessages.map((msg, index) => (
            <div className={`w-full flex items-end gap-1.5 ${user.name == msg.sender ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 aspect-square rounded-full flex justify-center items-center uppercase text-white ${user.name == msg.sender ? "bg-emerald-700" : "bg-slate-600"}`}>{msg.sender.charAt(0)}</div>
              <div className={`max-w-[70%] w-fit h-fit p-1 px-2 pt-0 rounded-lg flex flex-col  ${user.name == msg.sender ? "items-end rounded-br-none bg-gray-300 dark:bg-gray-800" : "rounded-bl-none bg-gray-300 dark:bg-gray-700 shadow-md border border-gray-600"}`}>
                <p className='text-xs leading-4'>{msg.sender}</p>
                <p className={`text-sm ${user.name == msg.sender ? "text-right" : "text-left"}`}>{msg.content}</p>
              </div>
            </div>))}
        </div>
        {/* input and send messages section */}
        <div className="h-16 bg-gray-400 dark:bg-gray-950 p-2.5 flex items-center justify-between gap-2">
          {/* <div className="w-full h-full"> */}
          <input type="text" className='w-100 h-full rounded-full bg-gray-50 dark:bg-gray-900 focus:bg-gray-800 focus:shadow text-gray-950 dark:text-gray-50 focus:outline-0 px-4' value={newMessage} placeholder='Type your message here..' onChange={(e) => setNewMessage(e.target.value)} />
          {/* </div> */}
          <div className="h-10 aspect-square bg-gray-900 rounded-full flex justify-center items-center hover:bg-gray-800 hover:scale-105 transition-all duration-200 cursor-pointer">
            <FiFile className='text-xl text-gray-50' />
          </div>
          <div className="h-10 aspect-square bg-emerald-800 rounded-full flex justify-center items-center hover:bg-green-700 hover:scale-105 transition-all duration-200 cursor-pointer">
            <FiSend className='text-xl text-gray-50' onClick={sendMessage} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHomePage