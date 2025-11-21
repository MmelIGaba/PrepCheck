import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Sound notification function
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Gentle, friendly notification sound
    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log("Audio notification not supported");
  }
};

function ChatAssistant({ analysisContext, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm PrepPal, your career readiness assistant. Ask me anything about your CV analysis results! 🤖💼",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const previousMessageCountRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    // Play sound when PrepPal sends a new message
    if (messages.length > previousMessageCountRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        playNotificationSound();
      }
    }

    previousMessageCountRef.current = messages.length;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await axios.post(`${API_URL}/api/chat`, {
        message: input,
        conversationHistory,
        context: { analysis: analysisContext },
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle PrepPal chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-title">
                <div className="preppal-avatar">
                  <motion.span
                    className="robot-emoji"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    🤖
                  </motion.span>
                </div>
                <div>
                  <h4>PrepPal</h4>
                  <span className="preppal-subtitle">
                    Your Career Assistant
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="chat-close"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`chat-message ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.role === "assistant" && (
                    <motion.div
                      className="message-avatar"
                      animate={{
                        scale:
                          loading && index === messages.length - 1
                            ? [1, 1.1, 1]
                            : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: loading ? Infinity : 0,
                      }}
                    >
                      🤖
                    </motion.div>
                  )}
                  <div className="message-content">{msg.content}</div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  className="chat-message assistant typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="message-avatar">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      🤖
                    </motion.span>
                  </div>
                  <div className="message-content typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask PrepPal about your results..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button
                className="chat-send"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatAssistant;
