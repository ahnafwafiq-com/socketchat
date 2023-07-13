// Initializing the Express app
import express from "express";
import { createServer } from "http";
const app = express();
const api = express.Router();
app.use("/api", api);
app.use(express.json());
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

// Initializing Prisma Client
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

io.on("connection", (socket) => {
    console.log(`User ${socket.id} Connected`);
    socket.on("message", async (message, username) => {
        io.emit("message", message, username);
        await db.message.create({
            data: {
                message: message,
                sentBy: username,
            },
        });
    });
});

app.get("/", (req, res) => {
    res.status(200).send(
        'This is the API route. Visit <a href="http://localhost:5173">http://localhost:5173</a> to join the group chat.'
    );
});

api.route("/messages/get").get(async (req, res) => {
    const response: {
        error: boolean;
        errorMessage: any;
        messages: any[];
    } = {
        error: false,
        errorMessage: "",
        messages: [],
    };
    let limit;
    if (typeof req.query.limit === "string") {
        limit = parseInt(req.query.limit);
    } else {
        limit = 50;
    }

    try {
        const messages = await db.message.findMany({
            take: limit,
            orderBy: {
                id: "asc",
            },
        });
        response.messages = messages;
    } catch (e: any) {
        response.error = true;
        response.errorMessage = e;
        res.status(418).send(response);
        return;
    }

    res.status(200).send(response);
    return;
});
