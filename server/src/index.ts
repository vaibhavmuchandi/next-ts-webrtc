import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import { roomHandler } from "./room"

const app = express();
app.use(cors)
const PORT: number = 3003

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("User connected")
    roomHandler(socket)
    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})