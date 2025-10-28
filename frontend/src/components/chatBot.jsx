import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { X, Send, MessageCircle, Mic } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "🌿 Namaste! I'm Haryali AI — your assistant for sustainable parali management. How may I guide you today?\n\nनमस्ते! मैं हरियाली एआई हूँ — आपकी सहायक। स्टबल मैनेजमेंट में आपकी क्या मदद कर सकता हूँ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("en");
  const [voices, setVoices] = useState([]);

  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return console.warn("Speech recognition not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang =
      lang === "hi" ? "hi-IN" : lang === "hinglish" ? "en-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      recognition.stop();
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [lang]);

  const startListening = () => {
    if (!recognitionRef.current)
      return alert("Speech recognition not supported in this browser.");
    setListening(true);
    recognitionRef.current.start();
  };

  const getVoiceForLang = (langCode) => {
    if (!voices.length) return null;
    if (langCode === "hi")
      return (
        voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi")
        ) || null
      );
    return (
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("en") &&
          v.name.toLowerCase().includes("india")
      ) || voices.find((v) => v.lang.toLowerCase().startsWith("en")) || null
    );
  };

  const speakText = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceForLang(lang) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || (lang === "hi" ? "hi-IN" : "en-IN");
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, lang }),
      });
      const data = await res.json();
      const botReply = data.reply || "No reply from Haryali Assistant.";

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        speakText(botReply);
      }, 700);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to connect to Haryali Assistant." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 shadow-lg flex items-center justify-center text-white z-50 hover:shadow-2xl"
          >
            <MessageCircle size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-0 right-0 h-[80vh] w-[380px] bg-gradient-to-br from-green-950/80 via-emerald-900/70 to-green-950/80 backdrop-blur-2xl border border-green-600/20 rounded-l-3xl shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white p-5 flex items-center justify-between shadow-md">
              <h3 className="font-semibold text-lg tracking-wide">Haryali AI 🌿</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-green-800/50 p-1 rounded-lg transition"
                aria-label="Close ChatBot"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-green-500/40">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "ml-auto bg-green-700/50 border border-green-400/30 text-white shadow-sm"
                      : "bg-white/10 border border-green-300/20 text-green-100 shadow-sm"
                  }`}
                >
                  {msg.sender === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-1 text-green-200 text-sm px-4 py-2 bg-white/10 border border-green-400/30 rounded-2xl w-fit">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="p-3 border-t border-green-400/20 bg-green-950/70 flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={startListening}
                className={`p-3 rounded-full transition-all ${
                  listening
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                aria-label="Start voice input"
              >
                <Mic size={18} />
              </motion.button>

              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-green-800/40 text-white text-sm rounded-lg px-2 py-1 border border-green-400/30 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>

              <input
                type="text"
                className="flex-1 px-3 py-2 bg-white/10 text-white rounded-lg border border-green-400/20 focus:outline-none focus:ring-1 focus:ring-green-400 placeholder-green-200/60"
                placeholder="Type or speak..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className="p-3 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full text-white hover:shadow-lg"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.4);
          border-radius: 10px;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: rgba(74, 222, 128, 0.8);
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </>
  );
}


