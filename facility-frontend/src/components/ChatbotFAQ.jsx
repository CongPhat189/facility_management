import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import faqData from "../data/faqData";

function ChatbotFAQ() {
    const [open, setOpen] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");

    return (
        <div>

            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 transition-all"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>


            {open && (
                <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-t-2xl">
                        <h4 className="font-bold">🤖 Trợ lý OU</h4>
                        <p className="text-xs text-blue-100">Chọn câu hỏi để xem hướng dẫn</p>
                    </div>


                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "250px" }}>
                        {faqData.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedAnswer(item.answer)}
                                className="w-full text-left p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200"
                            >
                                {item.question}
                            </button>
                        ))}
                    </div>


                    {selectedAnswer && (
                        <div className="px-4 py-3 border-t border-slate-200 text-sm text-slate-700 bg-slate-50">
                            <b>💡 Trả lời:</b> {selectedAnswer}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ChatbotFAQ;
