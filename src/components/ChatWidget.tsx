"use client";
import { useState, useEffect } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { from: "bot", text: "안녕하세요! Flex Center CS입니다! 😊 국내택배, 국제특송, FULFILLMENT 무엇이든 물어보세요!", time: "10:00" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { from: "user", text: input, time: new Date().toLocaleTimeString().slice(0,5) };
    setMessages([...messages, newMsg]);
    setInput("");
    // 목업 답변
    setTimeout(()=> {
      setMessages(prev=>[...prev, { from: "bot", text: "네! 확인해볼게요! 담당자가 곧 답변드릴게요! (목업 - 실제로는 Supabase Realtime으로 관리자한테 알림!)", time: new Date().toLocaleTimeString().slice(0,5) }]);
    }, 1000);
  };

  return (
    <>
      {/* 풍선 버튼 - 오른쪽 아래 고정! 따라다님! */}
      <button
        onClick={()=>setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-[20px] shadow-lg hover:scale-110 transition-transform z-50"
        title="CS 채팅 - 언제든지 클릭!"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* 채팅창 - 풍선 누르면 열림! */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] h-[480px] bg-white border border-black/10 rounded-[16px] shadow-2xl flex flex-col z-50">
          <div className="bg-black text-white p-4 rounded-t-[16px] flex items-center justify-between">
            <div>
              <p className="font-bold text-[14px]">Flex Center CS</p>
              <p className="text-[11px] opacity-60">국내택배, 국제특송, FULFILLMENT 실시간 상담!</p>
            </div>
            <button onClick={()=>setOpen(false)} className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">✕</button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((m,i)=><div key={i} className={`flex ${m.from==="user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-[16px] px-3 py-2 ${m.from==="user" ? "bg-black text-white" : "bg-[#fafaf8] border border-black/5"}`}>
                <p className="text-[12px]">{m.text}</p>
                <p className="text-[9px] opacity-50 mt-1">{m.time}</p>
              </div>
            </div>)}
          </div>

          <div className="border-t p-3 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter" && sendMessage()} placeholder="메시지 입력... 국내택배, 국제특송, FULFILLMENT 문의!" className="flex-1 border rounded-full px-4 py-2 text-[12px]" />
            <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded-full text-[12px] font-bold">전송</button>
          </div>

          <div className="p-2 text-center text-[9px] opacity-40 border-t">
            Supabase Realtime으로 관리자한테 실시간 알림! /admin/cs 페이지에서 답변!
          </div>
        </div>
      )}
    </>
  );
}
