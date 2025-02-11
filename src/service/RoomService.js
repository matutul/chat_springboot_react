import axios from "axios";
import { AppConfig } from "../config/AppConfig";

const BASE_BACKEND_API=AppConfig.backendBaseApi;

const getRoomWithRoomId = async (roomId) => {
    const url = `${BASE_BACKEND_API}/api/v1/rooms/${1}`
    return await axios.get(url);
}

const createRoomWithRoomId = async (roomId) => {
    return await axios.post(BASE_BACKEND_API+"/api/v1/rooms", roomId, {
        headers: {
            'Content-Type':'text/plain'
        }
    });
    // .catch(res => console.log(res.data));
}

const getMessagesFromDatabase = async (roomId, page=0, size=20) => {
    return await axios.get(`${BASE_BACKEND_API}/api/v1/rooms/${roomId}/messages?page=${page}&size=${size}`);
}

const RoomService = {
    getRoomWithRoomId,
    createRoomWithRoomId,
    getMessagesFromDatabase
}

export default RoomService;