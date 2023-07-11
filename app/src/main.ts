import "./style.css";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const text_input = document.querySelector<HTMLInputElement>("#text-input");
const send_button = document.querySelector<HTMLButtonElement>("button");
const messages = document.querySelector<HTMLUListElement>("ul");
const status = document.querySelector<HTMLDivElement>(".status");

socket.on("connect", () => {
    if (status) {
        status.innerText = `Connected as user ${socket.id}`;
    }
});

send_button?.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    socket.emit("message", text_input?.value);
    if (text_input) {
        text_input.value = "";
    }
});

socket.on("message", (message) => {
    const newMessage = document.createElement("li");
    newMessage.innerText = message;
    messages?.appendChild(newMessage);
});
