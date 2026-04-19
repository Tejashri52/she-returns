import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api, getSessionId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircleHeart, Send, Sparkles, Trash2 } from "lucide-react";

const SUGGESTIONS = [
  "How do I explain my 3-year career break?",
  "I'm nervous about going back. Any advice?",
  "What should I put in my resume summary?",
  "How do I negotiate salary after a break?",
];

export default function Chat() {
  const sessionId = getSessionId();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const loadHistory = async () => {
    try {
      const r = await api.get(`/chat/history/${sessionId}`);
      setMessages(r.data || []);
    } catch {}
  };

  const clearChat = async () => {
    try {
      await api.delete(`/chat/history/${sessionId}`);
      setMessages([]);
      toast.success("Fresh start — chat cleared");
    } catch {
      toast.error("Could not clear chat");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg, timestamp: new Date().toISOString() }]);
    setSending(true);
    try {
      const r = await api.post("/chat", { session_id: sessionId, message: msg });
      setMessages((m) => [...m, { role: "assistant", content: r.data.reply, timestamp: new Date().toISOString() }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Hmm, I had trouble thinking for a moment. Could you try again?", timestamp: new Date().toISOString() },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12" data-testid="chat-page">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6CF6]">AI Career Coach</div>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-3 text-[#1A1A24]">
        Talk it out. <span className="text-[#7C6CF6]">I'm listening.</span>
      </h1>
      <p className="text-gray-600 mt-3 max-w-2xl">
        Nervous, curious, stuck, or just need a pep talk? I'm your always-on career coach — warm, honest, and in your corner.
      </p>

      <div className="mt-8 rounded-3xl bg-white border border-gray-100 shadow-soft overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white/70">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-[#4FD1C5] animate-pulse" />
            {messages.length > 0 ? `${messages.length} message${messages.length === 1 ? "" : "s"}` : "Online & ready"}
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="rounded-full text-gray-500 hover:text-[#B44B2E] hover:bg-[#FFE3DB]"
              data-testid="chat-clear-btn"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear chat
            </Button>
          )}
        </div>
        <div
          ref={scrollRef}
          className="h-[500px] overflow-y-auto scroll-soft p-6 grain"
          data-testid="chat-messages"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5] flex items-center justify-center">
                <MessageCircleHeart className="w-6 h-6 text-white" />
              </div>
              <div className="font-heading font-semibold text-xl">Say hi — I'm here for you</div>
              <div className="grid sm:grid-cols-2 gap-2 mt-3 max-w-md">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="text-left text-sm rounded-2xl px-4 py-3 bg-[#F9FAFB] hover:bg-[#F3F0FF] border border-gray-100 transition"
                    data-testid={`chat-suggestion-${i}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} mb-3`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#1A1A24] text-white rounded-br-md"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-soft"
                  }`}
                  data-testid={`chat-msg-${m.role}`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-500 shadow-soft inline-flex items-center gap-2" data-testid="chat-typing">
                <Sparkles className="w-3.5 h-3.5 text-[#7C6CF6] animate-pulse" /> Thinking<span className="thinking-dots" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-4 flex items-center gap-2 bg-white">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), send())}
            placeholder="Type your message…"
            className="rounded-full bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#7C6CF6] px-5"
            data-testid="chat-input"
          />
          <Button
            onClick={() => send()}
            disabled={sending}
            className="rounded-full bg-[#7C6CF6] hover:bg-[#5A4BD4] text-white px-5"
            data-testid="chat-send-btn"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
