import Autolinker from "autolinker";

// Getting the DOM elements using querySelectors

// Creating a simple function to reduce the code
const selectDiv = (query: string) => {
    return document.querySelector<HTMLDivElement>(query);
};

const selectDialog = (query: string) => {
    return document.querySelector<HTMLDialogElement>(query);
};

const selectForm = (query: string) => {
    return document.querySelector<HTMLFormElement>(query);
};

const selectInput = (query: string) => {
    return document.querySelector<HTMLInputElement>(query);
};

export const text_input = selectInput("#text-input");
export const unError = selectDiv(".unError");
export const send_message = selectForm("#message_form");
export const messages = selectDiv("[data-messages]");
export const status = selectDiv(".status");
export const username_input = selectInput("#username");
export const username_form = selectForm("[data-unForm]");
export const optionsDialog = selectDialog("[data-optionsDialog]");
export const usernameDialog = selectDialog("[data-unDialog]");
export const unSubmit =
    usernameDialog?.querySelector<HTMLButtonElement>('[type="submit"]');

interface Message_t {
    message: string;
    username: string;
    sentByCurrentUser: boolean;
    render: () => HTMLDivElement;
}

export class Message implements Message_t {
    message: string;
    username: string;
    sentByCurrentUser: boolean;
    constructor(message: string, username: string) {
        this.message = message;
        this.username = username;
        if (localStorage.getItem("username") === username) {
            this.sentByCurrentUser = true;
        } else {
            this.sentByCurrentUser = false;
        }
    }

    render() {
        //Creating the main message div
        const mainDiv = document.createElement("div");
        mainDiv.classList.add("message");
        if (this.sentByCurrentUser) {
            mainDiv.classList.add("sentByCurrentUser");
        }

        // Creating message div
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = Autolinker.link(this.message);
        messageDiv.classList.add("messageText");

        //Creating username div
        const usernameDiv = document.createElement("div");
        usernameDiv.append(this.username);
        usernameDiv.classList.add("messageUsername");

        // Adding divs to main div
        mainDiv.appendChild(usernameDiv);
        mainDiv.appendChild(messageDiv);
        return mainDiv;
    }
}

export const getInitialMessages = async () => {
    if (messages) {
        messages.innerHTML = "";
    }
    const response = await fetch(
        "https://api.socketio.ahnafwafiq.com/api/messages/get"
    );
    const data = await response.json();
    if (!data.error) {
        for (let message of data.messages) {
            const msg = new Message(message.message, message.sentBy);
            messages?.appendChild(msg.render());
        }
    }
    scrollDown();
};

export const scrollDown = () => {
    document
        .querySelector<HTMLDivElement>(".scroll")
        ?.scrollIntoView({ behavior: "smooth" });
};

export const validateUesrname = (username: string) => {
    const pattern = /^[a-z0-9._-]+$/;

    const response: {
        error: boolean;
        message: string;
    } = {
        error: false,
        message: "",
    };

    if (!username) {
        response.message = "Provide a username";
        response.error = true;
    } else if (username.length < 3) {
        response.message = "Username must be longer than 3 characters";
        response.error = true;
    } else if (username.includes(" ")) {
        response.message = "Username must not contain spaces";
        response.error = true;
    } else if (!pattern.test(username)) {
        response.message =
            "Username can only contain characters a-z, numbers 0-9 and characters ., - and _";
        response.error = true;
    } else {
        response.message = "";
        response.error = false;
    }
    return response;
};
