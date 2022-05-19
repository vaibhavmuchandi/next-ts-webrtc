import { Socket } from "socket.io";
import { v4 as uuidV4} from "uuid";
import { IUser } from "./interface/IUser"
import { IRoomParams } from "./interface/IRoomParams";
import { IJoinRoomParams } from "./interface/IJoinRoomParams";

const rooms: Record<string, Record<string, IUser>> = {};


export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId: string = uuidV4();
        rooms[roomId] = {};
        socket.emit("room-created", {roomId})
        console.log("Room has been created!")
    }

    const joinRoom = ({peerId, roomId, userName}: IJoinRoomParams) => {
        if(!rooms[roomId]) rooms[roomId] = {};
        console.log("User has joined the room!")
        rooms[roomId][peerId] = {peerId, userName}
        socket.join(roomId)
        socket.to(roomId).emit("user-joined", {peerId, userName})
        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId]
        })
        socket.on("disconnect", () => {
            console.log("User has left the room", peerId);
            leaveRoom({peerId, roomId});
        })
    } 

    const leaveRoom = ({peerId, roomId}: IRoomParams) => {
        socket.to(roomId).emit("user-disconnected", peerId)
    }

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom)
}