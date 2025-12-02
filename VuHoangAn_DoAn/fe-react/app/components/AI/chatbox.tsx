"use client";

import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

const AI_API_URL = "http://localhost:3000/api/chat/ask";

type ChatBoxProps = {
  documentId?: string;
};

type AIProvider = "ollama" | "openai" | "gemini";

export default function ChatBox({ documentId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [provider, setProvider] = useState<AIProvider>("ollama");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Storage key for this document's chat history
  const storageKey = `chat-history-${documentId}`;

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (!documentId) return;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }, [documentId, storageKey]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (!documentId || messages.length === 0) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (err) {
      console.error("Failed to save chat history:", err);
    }
  }, [messages, documentId, storageKey]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isSending || !documentId) return;

    const userInput = input;
    const userMsg: Message = { 
      id: `user-${Date.now()}`,
      sender: "user", 
      text: userInput 
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      // Gọi API AI với provider chỉ định
      const url = new URL(AI_API_URL);
      url.searchParams.append("provider", provider);

      const res = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          documentId,
          question: userInput 
        }),
      });

      let answer = "Tôi chưa được cấu hình API 😄";

      if (res.ok) {
        const data = await res.json();
        answer = data.answer || data.reply || answer;
      } else {
        const errData = await res.json().catch(() => ({}));
        answer = errData?.error || `Lỗi ${res.status}: ${res.statusText}`;
      }

      const botMsg: Message = { 
        id: `bot-${Date.now()}`,
        sender: "bot", 
        text: answer 
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "bot",
        text: "Lỗi kết nối server!",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-xl border flex flex-col">
      <div className="p-3 font-semibold bg-blue-600 text-white rounded-t-xl flex justify-between items-center">
        <span>Hỗ trợ học tập</span>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              if (documentId) localStorage.removeItem(storageKey);
            }}
            title="Clear chat history"
            className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded"
          >
            ✕
          </button>
        )}
      </div>

      {!documentId && (
        <div className="p-3 text-sm text-gray-600 border-b bg-yellow-50">
          ⚠️ Đang tải tài liệu...
        </div>
      )}

      {/* Provider Selector */}
      {documentId && (
        <div className="px-3 py-2 border-b flex gap-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            disabled={isSending}
            className="flex-1 px-2 py-1 text-xs border rounded bg-white"
          >
            <option value="ollama">🤖 Ollama (Local)</option>
            <option value="openai">🔴 OpenAI (GPT)</option>
            <option value="gemini">🔵 Gemini</option>
          </select>
        </div>
      )}

      {/* Messages */}
      <div className="p-3 h-64 overflow-y-auto space-y-2" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-lg text-sm ${
              m.sender === "user"
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : "bg-gray-100 mr-auto max-w-[80%]"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 border-t">
        <Input
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi..."
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && !isSending && sendMessage()
          }
          disabled={isSending}
        />
        <Button onClick={sendMessage} size="icon" disabled={isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
