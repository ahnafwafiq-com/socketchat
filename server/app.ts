// Initializing the Express app
import express from "express";
import { createServer } from "http";
const app = express();
const server = createServer(app);
const port = 8080;

server.listen(port, () => {
    console.log(`App started on http://localhost:${port}`);
});

// Initializing Socket.io server
import { Server } from "socket.io";

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

io.on("connection", (socket) => {
    console.log(`User ${socket.id} Connected`);
    socket.on("message", (message) => {
        io.emit("message", message)
    });
});

app.get("/", (req, res) => {
    res.status(200).send("Sup");
});
