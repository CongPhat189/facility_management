import React, { useState } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react";

function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: "user", text: input };
        setMessages([...messages, userMsg]);

        try {
            const res = await axios.post("http://localhost:8080/api/chatbot", {
                message: input,
            });
            const botMsg = { sender: "bot", text: res.data };
            setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
            console.error("Lỗi gọi chatbot:", err);
        }

        setInput("");
    };

    return (
        <div>
            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 transition-all"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Chatbox */}
            {open && (
                <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-t-2xl">
                        <h4 className="font-bold">🤖 Chatbot hỗ trợ</h4>
                        <p className="text-xs text-blue-100">Hỏi tôi bất cứ điều gì!</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "300px" }}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg max-w-[75%] ${msg.sender === "user"
                                        ? "bg-blue-500 text-white ml-auto"
                                        : "bg-slate-100 text-slate-800"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex border-t border-slate-200">
                        <input
                            className="flex-1 px-3 py-2 text-sm outline-none"
                            placeholder="Nhập câu hỏi..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
