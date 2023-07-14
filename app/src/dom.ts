import Autolinker from "autolinker";

// Getting the DOM elements using querySelectors

export const text_input =
    document.querySelector<HTMLInputElement>("#text-input");
export const unError = document.querySelector<HTMLDivElement>(".unError");
export const send_message =
    document.querySelector<HTMLFormElement>("#message_form");
export const messages =
    document.querySelector<HTMLDivElement>("[data-messages]");
export const status = document.querySelector<HTMLDivElement>(".status");
export const username_input =
    document.querySelector<HTMLInputElement>("#username");
export const username_form =
    document.querySelector<HTMLFormElement>("[data-unForm]");
export const optionsDialog = document.querySelector<HTMLDialogElement>(
    "[data-optionsDialog]"
);

export const usernameDialog =
    document.querySelector<HTMLDialogElement>("[data-unDialog]");
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
    const response = await fetch("http://localhost:8080/api/messages/get");
    console.log(response);
    const data = await response.json();
    console.log(data);
    if (!data.error) {
        for (let message of data.messages) {
            const msg = new Message(message.message, message.sentBy);
            messages?.appendChild(msg.render());
        }
    }
};
