import React, { useContext, useEffect, useReducer, useState } from 'react'
import { FiAlertTriangle } from 'react-icons/fi';
import { UserContext } from '../routes/Router';
import RoomService from '../service/RoomService';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState({ id: 0, message: "" });
  const { user, saveUserAlongStorageHandler } = useContext(UserContext);
  const navigate = useNavigate();

  const [joinRoomLoader, setJoinRoomLoader] = useState(false);
  const [createRoomLoader, setCreateRoomLoader] = useState(false);

  useEffect(() => {
    if (user.name && user.roomId) {
      navigate("/");
    }
  }, [])

  const initialFormData = {
    name: "",
    roomId: ""
  }
  const reducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_NAME":
        return { ...state, name: action.payload };
        break;
      case "UPDATE_ROOMID":
        return { ...state, roomId: action.payload };
        break;
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialFormData);


  const joinHandler = (e) => {
    e.preventDefault();
    setJoinRoomLoader(true);
    if (state.name && state.roomId) {
      try {
        RoomService.getRoomWithRoomId(state.roomId).then(res => {
          if (res.status == 200) {
            saveUserAlongStorageHandler({ name: state.name, roomId: state.roomId });
            navigate("/");
            setJoinRoomLoader(false);
          }
        }).catch(() => {
          toast.error("Something went wrong. Please try again!");
          setJoinRoomLoader(false);
        });
      } catch (error) {
        // if (res.status != 200) {
        //   toast.error(res.response?.data || "Something went wrong!");
        // }
        console.log(error);
      }
    } else {
      setErrorMessage({ id: 3, message: "Please enter your credentials." })
      if (state.name) {
        setErrorMessage({ id: 2, message: "Room ID is required!" });
      } else if (state.roomId) {
        setErrorMessage({ id: 1, message: "Name is required!" });
      }
    }
  }

  const createRoomHandler = (e) => {
    e.preventDefault();
    setCreateRoomLoader(true);
    if (state.name && state.roomId) {
      RoomService.createRoomWithRoomId(state.roomId).then(res => {
        if (res.status == 201) {
          toast.success("Room created successfully");
          saveUserAlongStorageHandler({ name: state.name, roomId: state.roomId });
          navigate("/");
          setCreateRoomLoader(false);
        }
      })
        .catch(() => {
          toast.error("Something went wrong. Please try again!");
          setCreateRoomLoader(false);
        });
    }
    else {
      setErrorMessage({ id: 3, message: "Please enter your credentials." })
      if (state.name) {
        setErrorMessage({ id: 2, message: "Room ID is required!" });
      } else if (state.roomId) {
        setErrorMessage({ id: 1, message: "Name is required!" });
      }
    }
  }
  // console.log(user)
  return (
    <div className='w-full h-screen bg-gray-200 text-gray-950 dark:bg-gray-900 dark:text-gray-200 flex flex-col gap-2 justify-center items-center'>
      <div className="max-w-[1000px] h-fit rounded-2xl overflow-hidden bg-gray-300 dark:bg-gray-950 shadow-lg">
        <h1 className='p-4 pb-0 text-center text-2xl font-bold'>Join / Create Room</h1>
        {/* <p>{user.name}</p> */}
        <form action="" className=''>
          <div className="p-8 flex flex-col gap-4">
            <div className="w-full flex justify-between gap-3 items-center relative">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name='name'
                className='bg-gray-200 dark:bg-gray-900 rounded-2xl p-1 px-3 outline-none'
                required
                onChange={(e) => dispatch({ type: "UPDATE_NAME", payload: e.target.value })}
              />
              {errorMessage?.id == 1 && <span className='text-xs text-amber-500 absolute top-full right-0'>{errorMessage.message}</span>}
            </div>
            <div className="w-full flex justify-between gap-3 items-center">
              <label htmlFor="password">Password</label>
              <input type="password" name='password' className='bg-gray-200 dark:bg-gray-900 rounded-2xl p-1 px-3 outline-none' disabled />
            </div>
            <div className="w-full flex justify-between gap-3 items-center relative">
              <label htmlFor="room">Room</label>
              <input
                type="text"
                name='room'
                className='bg-gray-200 dark:bg-gray-900 rounded-2xl p-1 px-3 outline-none'
                required
                onChange={(e) => dispatch({ type: "UPDATE_ROOMID", payload: e.target.value })}
              />
              {errorMessage?.id == 2 && <span className='text-xs text-amber-500 absolute top-full right-0'>{errorMessage.message}</span>}
            </div>
            {errorMessage?.id == 3 && <span className='text-xs text-amber-500'>{errorMessage.message}</span>}
          </div>
          <div className="w-full flex justify-between gap-3 items-center p-4 bg-gray-300 dark:bg-gray-800">
            <button className='p-2 px-8 bg-green-700 hover:bg-green-800 text-gray-200 font-bold rounded-lg' onClick={(e) => joinHandler(e)}>{joinRoomLoader ? <span>Joining<span className='animate-ping'>...</span></span> : "Join"}</button>
            <button className='p-2 px-8 bg-teal-800 hover:bg-teal-900 text-gray-200 font-bold rounded-lg' onClick={(e) => createRoomHandler(e)}>{createRoomLoader? <span>Creating room<span className='animate-ping'>...</span></span> : "Create room"}</button>
          </div>
        </form>
      </div>
      {/* {
        errorMessage &&
        <p className='text-yellow-500 flex gap-2 items-center'><FiAlertTriangle />{errorMessage}</p>
      } */}
      <Toaster className="top-center" />
    </div>
  )
}

export default Login