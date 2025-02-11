import React, { createContext, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import AuthenticationGuard from '../components/AuthenticationGuard'
import Login from '../pages/Login'
import { FiAirplay, FiMoon, FiSun } from "react-icons/fi"
import useTheme from '../hooks/useTheme'
import ChatHomePage from '../pages/ChatHomePage'

export const UserContext = createContext();

const Router = () => {
  const [theme, setTheme] = useTheme();
  const [user, setUser] = useState({ name: "", roomId: "" });
  useEffect(() => {
    if (localStorage.getItem("chatUser")) {
      setUser(JSON.parse(localStorage.getItem("chatUser")));
    }
  }, [])

  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("chatUser", user)
  //   }
  // }, [user])

  const saveUserAlongStorageHandler = (newUserData) => {
    setUser(newUserData);
    if (newUserData) {
      localStorage.setItem("chatUser", JSON.stringify(newUserData))
    } else {
      localStorage.removeItem("chatUser");
    }
  }

  return (
    <UserContext.Provider value={{ user, saveUserAlongStorageHandler }}>
      <div className="hidden md:block fixed bottom-6 right-6 z-10">
        <div className="flex rounded-full shadow-2xl bg-white dark:bg-gray-700 overflow-hidden transition-all duration-200">
          <FiSun className={`p-1 pl-2 w-8 h-6 cursor-pointer text-gray-900 dark:text-gray-200 font-bold hover:bg-gray-300 dark:hover:bg-gray-950 transition-all duration-200 ${theme == "light" ? 'bg-gray-300' : ""}`} onClick={() => setTheme("light")} />
          <FiMoon className={`p-1 w-8 h-6 cursor-pointer text-gray-900 dark:text-gray-200 font-bold hover:bg-gray-300 dark:hover:bg-gray-950 transition-all duration-200 ${theme == "dark" ? 'dark:bg-gray-950' : ""}`} onClick={() => setTheme("dark")} />
          <FiAirplay className={`p-1 pr-2 w-8 h-6 cursor-pointer text-gray-900 dark:text-gray-200 font-bold hover:bg-gray-300 dark:hover:bg-gray-950 transition-all duration-200 ${theme == "system" ? 'bg-gray-300 dark:bg-gray-950' : ""}`} onClick={() => setTheme("system")} />
        </div>
      </div>
      <Routes>
        <Route path='/' element={<AuthenticationGuard><ChatHomePage /></AuthenticationGuard>} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<h1 >Page not found</h1>} />
      </Routes>
    </UserContext.Provider>
  )
}

export default Router