import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { api, getSessionId } from "@/lib/api";
import { MessageCircleHeart, X, Send, Sparkles } from "lucide-react";

export default function FloatingChat() {
  const { pathname } = useLocation();
  const sessionId = getSessionId();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, open]);

  // Hide floating widget on /chat page and landing
  if (pathname === "/chat" || pathname === "/") return null;

  const send = async () => {
    const msg = input.trim();
    if (!msg || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setSending(true);
    try {
      const r = await api.post("/chat", { session_id: sessionId, message: msg });
      setMessages((m) => [...m, { role: "assistant", content: r.data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Let's try that again in a moment." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5] text-white shadow-lift flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open chat"
        data-testid="floating-chat-toggle"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircleHeart className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white border border-gray-100 shadow-lift overflow-hidden"
            data-testid="floating-chat-panel"
          >
            <div className="p-4 bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5] text-white">
              <div className="font-heading font-semibold">Your AI coach</div>
              <div className="text-xs text-white/85">Always on. Always on your side.</div>
            </div>
            <div ref={scrollRef} className="h-72 overflow-y-auto scroll-soft p-4 space-y-2 bg-[#F9FAFB]">
              {messages.length === 0 && (
                <div className="text-sm text-gray-500 text-center mt-10">
                  Ask me anything — "How do I explain my break?"
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] text-sm rounded-2xl px-3 py-2 ${m.role === "user" ? "bg-[#1A1A24] text-white" : "bg-white border border-gray-100 text-gray-800"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="text-xs text-gray-500 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#7C6CF6] animate-pulse" /> Thinking<span className="thinking-dots" />
                </div>
              )}
            </div>
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), send())}
                placeholder="Type…"
                className="flex-1 rounded-full px-4 py-2 text-sm bg-[#F9FAFB] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C6CF6]"
                data-testid="floating-chat-input"
              />
              <button
                onClick={send}
                disabled={sending}
                className="w-9 h-9 rounded-full bg-[#7C6CF6] hover:bg-[#5A4BD4] text-white flex items-center justify-center"
                data-testid="floating-chat-send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
