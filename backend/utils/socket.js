import http from "http";
import { Server } from "socket.io";
import { app } from "../app.js";

const server = http.createServer(app);

//initialize the socket server
const io = new Server(server, {
    cors:{
        origin: process.env.FRONTEND_URL || "*",
        credentials: true
    }
})

//store the online users
const userSocketMap = new Map(); // { userId: socketId }

//get receiver socket id
const getReceiverSocketId = (userId) => {
    return userSocketMap.get(userId);
}

io.on("connection", (socket) => {
    // when a user connects to the server
    console.log("A user connected : ", socket.id);

    // Retrieve userId from the connection query
    const userId = socket.handshake.query.userId;
    if(userId)
    {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Notify all clients about the updated online users list
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    // when a user disconnects from the server
    socket.on("disconnect", () => {
        console.log("A user disconnected : ", socket.id);
        try {
            if (userId) {
                userSocketMap.delete(userId);
        }
        } finally {
            // Ensure that we emit the updated online users list
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
        }
    })
})

export {io, server, app, getReceiverSocketId};
