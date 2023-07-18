import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

// Initializing the Express app
import express from "express";
import { createServer } from "http";
const app = express();
const api = express.Router();

// Setting up Middleware

app.use(
    cors({
        origin: ["https://socketio.ahnafwafiq.com", "http://localhost:5173"],
    })
);
app.use("/api", api);
app.use(express.json());
const server = createServer(app);
let port: number;
if (process.env.PORT) {
    port = parseInt(process.env.PORT);
} else {
    port = 443;
}

server.listen(port, () => {
    console.log(`App started on http://localhost:${port}`);
});

// Initializing Socket.io server
import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://socketio.ahnafwafiq.com"],
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

app.get("/", (_, res) => {
    res.redirect("https://socketio.ahnafwafiq.com/");
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
        limit = 100;
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
