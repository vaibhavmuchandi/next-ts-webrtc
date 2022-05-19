"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomHandler = void 0;
var uuid_1 = require("uuid");
var rooms = {};
var roomHandler = function (socket) {
    var createRoom = function () {
        var roomId = (0, uuid_1.v4)();
        rooms[roomId] = {};
        socket.emit("room-created", { roomId: roomId });
        console.log("Room has been created!");
    };
    var joinRoom = function (_a) {
        var peerId = _a.peerId, roomId = _a.roomId, userName = _a.userName;
        if (!rooms[roomId])
            rooms[roomId] = {};
        console.log("User has joined the room!");
        rooms[roomId][peerId] = { peerId: peerId, userName: userName };
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId: peerId, userName: userName });
        socket.emit("get-users", {
            roomId: roomId,
            participants: rooms[roomId]
        });
        socket.on("disconnect", function () {
            console.log("User has left the room", peerId);
            leaveRoom({ peerId: peerId, roomId: roomId });
        });
    };
    var leaveRoom = function (_a) {
        var peerId = _a.peerId, roomId = _a.roomId;
        socket.to(roomId).emit("user-disconnected", peerId);
    };
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
};
exports.roomHandler = roomHandler;
