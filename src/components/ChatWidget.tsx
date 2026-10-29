"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qkpnvfmsmvcemdblaahl.supabase.co",
  "sb_publishable_bhaLFQf6wmB6wMx1NNkSAg_Ypyy48rF"
);

type Msg = { id: string; from: "seller" | "admin"; text: string; time: string; email?: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "1", from: "admin", text: "안녕하세요! FLEX CENTER입니다. 무엇을 도와드릴까요?", time: "10:00" },
  ]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Msg = {
      id: Date.now().toString(),
      from: email === "phankyu@gmail.com" ? "admin" : "seller",
      text: input,
      time: new Date().toLocaleTimeString().slice(0,5),
      email: email || "guest",
    };
    setMsgs([...msgs, newMsg]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex items-center justify-center font-black text-[20px] hover:scale-105 transition z-[9999]"
      >
        {open ? "✕" : "💬"}
      </button>
      {open && (
        <div className="fixed bottom-[90px] right-6 w-[340px] h-[420px] bg-white border border-black/10 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] flex flex-col z-[9999] overflow-hidden">
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold text-[13px]">FLEX CENTER 실시간 문의</p>
              <p className="text-[10px] opacity-60">{email || "게스트"} · 평균 5분 내 답변</p>
            </div>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafaf8]">
            {msgs.map(m => (
              <div key={m.id} className={`flex ${m.from === "seller" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-[16px] px-3 py-2 ${m.from === "seller" ? "bg-black text-white rounded-br-[4px]" : "bg-white border border-black/5 rounded-bl-[4px]"}`}>
                  <p className="text-[12px]">{m.text}</p>
                  <p className="text-[9px] opacity-50 mt-1">{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-black/5 p-3 flex gap-2 bg-white">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="메시지를 입력하세요..." className="flex-1 bg-[#fafaf8] border border-black/5 rounded-full px-4 py-2 text-[12px] outline-none" />
            <button onClick={send} className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold">전송</button>
          </div>
        </div>
      )}
    </>
  );
}
