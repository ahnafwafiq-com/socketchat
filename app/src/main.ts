import "./style.css";
import "normalize.css";
import io from "socket.io-client";
import {
    username_form,
    username_input,
    send_message,
    messages,
    text_input,
    status,
    Message,
    usernameDialog,
    getInitialMessages,
    unError,
    unSubmit,
} from "./dom";

getInitialMessages();

document.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "/") {
        if (text_input) {
            text_input.focus();
        }
    }
});

// Socket IO Connection
const socket = io("http://localhost:8080");
socket.on("connect", () => {
    if (status) {
        status.innerText = `Connected as user ${socket.id}`;
    }
});

socket.on("disconnect", () => {
    if (status) {
        status.innerText = `Disconnected`;
    }
});

if (!localStorage.getItem("username")) {
    usernameDialog?.showModal();
}
if (username_input) {
    const username = localStorage.getItem("username");
    if (username) {
        username_input.value = username;
    }
}

username_form?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    const newUsername = username_input?.value;
    if (newUsername) {
        localStorage.setItem("username", newUsername);
    }
    usernameDialog?.close();
});

// Validating provided username
username_input?.addEventListener("change", () => {
    if (unError && unSubmit && username_input) {
        if (!username_input?.value) {
            unError.innerText = "Provide a username";
        } else if (username_input.value.length < 3) {
            unError.innerText = "Username must be longer than 3 characters";
            unSubmit.disabled = true;
        } else if (username_input.value.length >= 3) {
            unError.innerText = "";
            unSubmit.disabled = false;
        } else if (username_input.value.includes(" ")) {
            unError.innerText = "Username cannot contain spaces";
            unSubmit.disabled = true;
        }
    }
});

send_message?.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    if (text_input?.value && localStorage.getItem("username")) {
        socket.emit(
            "message",
            text_input?.value,
            localStorage.getItem("username")
        );
    }
    if (text_input) {
        text_input.value = "";
    }
});

socket.on("message", (message, username) => {
    const newMessage = new Message(message, username);
    messages?.appendChild(newMessage.render());
});
