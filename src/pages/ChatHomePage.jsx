import React, { useContext } from 'react'
import { UserContext } from '../routes/Router';
import { Navigate, useNavigate } from 'react-router';

const ChatHomePage = () => {
  const { user, saveUserAlongStorageHandler } = useContext(UserContext);
  // const {name, roomId} = JSON.parse(user);
  const navigate = useNavigate();
  // console.log(user);
  return (
    <div className='w-full h-screen bg-gray-200 text-gray-950 dark:bg-gray-900 dark:text-gray-200 flex flex-col gap-2 justify-center items-center'>
      <p>Here is the chat room</p>
      {user && <p>{user.name}</p>}
      <button className='cursor-pointer' onClick={() => {
        localStorage.removeItem("chatUser");
        saveUserAlongStorageHandler({name:"", roomId:""});
        navigate("/login");
      }}>Logout</button>
    </div>
  )
}

export default ChatHomePage