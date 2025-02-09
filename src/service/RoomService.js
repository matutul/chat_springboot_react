import axios from "axios";
import { AppConfig } from "../config/AppConfig";

const BASE_BACKEND_API=AppConfig.backendBaseApi;

const getRoomWithRoomId = (roomId) => {
    const url = `${BASE_BACKEND_API}/api/v1/rooms/${roomId}`
    return axios.get(url);
}

const createRoomWithRoomId = (roomId) => {
    return axios.post(BASE_BACKEND_API+"/api/v1/rooms", roomId, {
        headers: {
            'Content-Type':'text/plain'
        }
    });
    // .catch(res => console.log(res.data));
}

const RoomService = {
    getRoomWithRoomId,
    createRoomWithRoomId
}

export default RoomService;