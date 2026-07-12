import axios from "axios";

const API = axios.create({
    baseURL: "https://soulmate-chat-server.onrender.com/api",
});

export default API;