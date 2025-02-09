import React, { useContext, useState } from 'react'
import { UserContext } from '../routes/Router';
import { Navigate, useNavigate } from 'react-router';
import { FiChevronDown, FiFile, FiLink2, FiMessageCircle, FiMoon, FiSend, FiSun } from 'react-icons/fi';
import useTheme from '../hooks/useTheme';

const ChatHomePage = () => {
  const { user, saveUserAlongStorageHandler } = useContext(UserContext);
  const [showMenus, setShowMenus] = useState(false);
  const [theme, setTheme] = useTheme();
  // const {name, roomId} = JSON.parse(user);
  const navigate = useNavigate();
  // console.log(user);

  const messages = [
    {
      content: "Hello buddy!",
      sender: "Ashraf",
    },
    {
      content: "Hello buddy! Hello buddy! Hello buddy! Hello buddy! Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!",
      sender: "test",
    },
    {
      content: "Hello buddy!",
      sender: "Ashraf",
    },
    {
      content: "Hello buddy! Hello buddy! Hello buddy! Hello buddy! Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!",
      sender: "Ashraf",
    },
    {
      content: "Hello buddy!",
      sender: "test",
    },
    {
      content: "Hello buddy!",
      sender: "Ashraf",
    },
    {
      content: "Hello buddy! Hello buddy! Hello buddy! Hello buddy! Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!",
      sender: "test",
    },
    {
      content: "Hello buddy!",
      sender: "Ashraf",
    },
    {
      content: "Hello buddy! Hello buddy! Hello buddy! Hello buddy! Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!Hello buddy!",
      sender: "Ashraf",
    },
    {
      content: "Hello buddy!",
      sender: "test",
    },
  ]
  return (
    <div className='w-full h-screen bg-gray-200 text-gray-950 dark:bg-gray-900 dark:text-gray-200 flex flex-col gap-2 justify-center items-center p-2 md:p-0'>
      {/* <p>Here is the chat room</p>
      {user && <p>{user.name}</p>}
      <button className='cursor-pointer' onClick={() => {
        localStorage.removeItem("chatUser");
        saveUserAlongStorageHandler({name:"", roomId:""});
        navigate("/login");
      }}>Logout</button> */}
      <div className="w-full md:w-md lg:w-lg h-full md:h-[calc(100vh-60px)] rounded-lg bg-gray-300 dark:bg-gray-800 shadow darK:border flex flex-col space-between overflow-hidden">
        {/* header section */}
        <div className="h-16 bg-gray-400 dark:bg-gray-950 p-4 px-6 flex items-center justify-between">
          <p className='flex items-center gap-2 text-xl'><FiMessageCircle className='text-3xl cursor-default' /> Chat Room</p>
          <div className="relative w-fit flex items-center gap-2">
            <div className="w-8 aspect-square rounded-full flex md:hidden justify-center items-center" onClick={() => { theme == 'dark' ? setTheme("light") : setTheme("dark") }}>{theme == "dark" ? <FiSun className='text-xl' /> : <FiMoon className='text-xl' />}</div>
            {user && <p className='text-xl flex items-center gap-2 cursor-pointer' onClick={() => setShowMenus(!showMenus)}>{user.name}<FiChevronDown className={`${showMenus ? "rotate-180" : ""} transition-all duration-300`} /></p>}
            <ul className={`bg-gray-200 dark:bg-gray-900 rounded overflow-hidden shadow-lg ${showMenus ? "absolute right-0 top-full" : "hidden"}`}>
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
        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 p-2 flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-400
  [&::-webkit-scrollbar-thumb]:rounded-full
  dark:[&::-webkit-scrollbar-track]:bg-gray-700
  dark:[&::-webkit-scrollbar-thumb]:bg-emerald-700">
          {messages.map((msg, index) => (
            <div className={`w-full flex items-end gap-1.5 ${user.name == msg.sender ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 aspect-square rounded-full flex justify-center items-center uppercase text-white ${user.name == msg.sender ? "bg-emerald-700" : "bg-sky-600"}`}>{msg.sender.charAt(0)}</div>
              <div className={`max-w-[70%] w-fit h-fit p-1 px-2 pt-0 rounded-lg flex flex-col  ${user.name == msg.sender ? "items-end rounded-br-none bg-emerald-300 dark:bg-emerald-800" : "rounded-bl-none bg-gray-300 dark:bg-gray-800"}`}>
                <p className='text-xs leading-4'>{msg.sender}</p>
                <p className={`text-sm ${user.name == msg.sender ? "text-right" : "text-left"}`}>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        {/* input and send messages section */}
        <div className="min-h-16 bg-gray-400 dark:bg-gray-950 p-2.5 flex items-center justify-between gap-2">
          {/* <div className="w-full h-full"> */}
          <input type="text" className='w-100 h-full rounded-full bg-gray-50 dark:bg-gray-700 focus:shadow text-gray-950 dark:text-gray-50 focus:outline-0 px-4' />
          {/* </div> */}
          <div className="h-10 aspect-square bg-gray-900 rounded-full flex justify-center items-center hover:bg-gray-800 hover:scale-105 transition-all duration-200 cursor-pointer">
            <FiFile className='text-xl text-gray-50' />
          </div>
          <div className="h-10 aspect-square bg-emerald-800 rounded-full flex justify-center items-center hover:bg-green-700 hover:scale-105 transition-all duration-200 cursor-pointer">
            <FiSend className='text-xl text-gray-50' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHomePage