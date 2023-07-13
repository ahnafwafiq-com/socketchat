import "./style.css";
import io from "socket.io-client";

const socket = io("http://localhost:8080");
let username: string | null | undefined;
if (localStorage.getItem("username")) {
    username = localStorage.getItem("username");
}

const text_input = document.querySelector<HTMLInputElement>("#text-input");
const send_message = document.querySelector<HTMLFormElement>("#message_form");
const messages = document.querySelector<HTMLUListElement>("ul");
const status = document.querySelector<HTMLDivElement>(".status");
const username_input = document.querySelector<HTMLInputElement>("#username");
const username_form = document.querySelector<HTMLFormElement>("#username_form");

username_form?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    const newUsername = username_input?.value;
    if (username) {
        localStorage.setItem("username", username);
        username = newUsername;
    }
});

socket.on("connect", () => {
    if (status) {
        status.innerText = `Connected as user ${socket.id}`;
    }
});

send_message?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    socket.emit("message", text_input?.value, username);
    if (text_input) {
        text_input.value = "";
    }
});

socket.on("message", (message, username) => {
    const newMessage = document.createElement("li");
    newMessage.innerText = message;
    messages?.appendChild(newMessage);
});
