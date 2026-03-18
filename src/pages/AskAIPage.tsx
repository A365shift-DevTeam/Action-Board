import { useState, useEffect, useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import chatData from "@/src/data/chat.json";
import { GoogleGenAI } from "@google/genai";
import { ThemeToggle } from "@/src/components/ThemeToggle";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chatData.history as Message[]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: text,
        config: {
          systemInstruction: "You are MD Assistant, an AI for Lucas TVS manufacturing dashboard. Answer questions about plant performance, metrics like ALR, MLR, Scrap, etc. Keep answers concise, professional, and formatted in markdown."
        }
      });
      setMessages((prev) => [...prev, { role: "ai", content: response.text || "Sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [...prev, { role: "ai", content: "Error connecting to AI. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full pb-16">
      {/* Header */}
      <header className="px-4 py-3 border-b border-[var(--color-border-subtle)] glass sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">MD Assistant</h1>
            <p className="text-[10px] font-semibold text-emerald-600">Online</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-500/15"
                  : "bg-slate-100 border border-[var(--color-border-subtle)] text-brand-600"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-600 text-white rounded-tr-md shadow-sm shadow-brand-600/15"
                  : "bg-white text-slate-700 rounded-tl-md border border-[var(--color-border-subtle)] shadow-sm"
              }`}>
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>
                    {line.includes('**') ? (
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>') }} />
                    ) : (
                      line
                    )}
                    {j < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="shrink-0 w-8 h-8 rounded-xl bg-slate-100 border border-[var(--color-border-subtle)] text-brand-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white rounded-tl-md border border-[var(--color-border-subtle)] shadow-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 glass border-t border-[var(--color-border-subtle)] shadow-[0_-1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {chatData.suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[var(--color-border-subtle)] text-slate-500 text-xs font-medium whitespace-nowrap hover:text-slate-700 hover:border-[var(--color-border-emphasis)] transition-all duration-200 shadow-sm"
            >
              {sug}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2 items-center"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about plant performance..."
            className="flex-1 rounded-xl h-12 px-4 text-sm shadow-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isTyping}
            className="rounded-xl w-12 h-12 bg-brand-600 hover:bg-brand-700 shrink-0 shadow-md shadow-brand-600/15 text-white disabled:opacity-30"
          >
            <Send className="w-4.5 h-4.5 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
