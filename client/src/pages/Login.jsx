import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            alert("Login Successful!");

            navigate("/home");
        } catch (error) {
            console.log("Login Error:", error.response?.data);
            console.log("Full Error:", error);

            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-3xl w-[400px] p-8">
                <h1 className="text-4xl font-bold text-center text-blue-700">
                    SoulMate Chat
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Welcome Back 👋
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded-xl p-3 mb-4 outline-none focus:border-blue-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded-xl p-3 mb-6 outline-none focus:border-blue-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-xl font-semibold"
                >
                    Login
                </button>

                <p className="text-center mt-6 text-gray-500">
                    Don't have an account?
                </p>

                <button
                    onClick={() => navigate("/register")}
                    className="w-full mt-3 border border-blue-600 text-blue-600 rounded-xl p-3 hover:bg-blue-50 transition"
                >
                    Register
                </button>
            </div>
        </div>
    );
}