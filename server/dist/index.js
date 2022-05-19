"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var cors_1 = __importDefault(require("cors"));
var room_1 = require("./room");
var app = (0, express_1.default)();
app.use(cors_1.default);
var PORT = 3003;
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", function (socket) {
    console.log("User connected");
    (0, room_1.roomHandler)(socket);
    socket.on("disconnect", function () {
        console.log("User disconnected");
    });
});
server.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
