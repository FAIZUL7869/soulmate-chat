import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await API.post("/auth/register", {
                name,
                email,
                password,
            });

            alert("Registration Successful!");
            navigate("/");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="bg-white shadow-xl rounded-3xl w-[400px] p-8">
                <h1 className="text-4xl font-bold text-center text-blue-700">
                    SoulMate Chat
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Create your account 💙
                </p>

                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border rounded-xl p-3 mb-4 outline-none focus:border-blue-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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
                    onClick={handleRegister}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-xl font-semibold"
                >
                    Register
                </button>

                <p className="text-center mt-6 text-gray-500">
                    Already have an account?
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="w-full mt-3 border border-blue-600 text-blue-600 rounded-xl p-3 hover:bg-blue-50 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}