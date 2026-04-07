import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, ChevronRight, ShoppingBag, Truck, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../redux/cartSlice";
import { toggleWishlist } from "../redux/wishlistSlice";
import { toggleAuthModal } from "../redux/authSlice";
import { chatbotKnowledge, fallbackResponse } from "../utils/chatbotKnowledge";
import toast from "react-hot-toast";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Namaste! 🙏 I'm your Jhumkeshwari Assistant. How can I help you sparkle today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);

  const quickActions = [
    { label: "Track Order", icon: <Truck size={14} />, action: "track" },
    { label: "View Best Sellers", icon: <ShoppingBag size={14} />, action: "shop" },
    { label: "My Wishlist", icon: <Heart size={14} />, action: "wishlist" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: "user", text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = fallbackResponse;

      const match = chatbotKnowledge.find(item => 
        item.keywords.some(kw => lowerText.includes(kw))
      );

      if (match) {
        response = match.response;
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: "bot", 
        text: response, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickAction = (action) => {
    if (action === "track") {
       handleSend("I want to track my order");
    } else if (action === "shop") {
       handleSend("Show me best sellers");
    } else if (action === "wishlist") {
       dispatch(toggleWishlist());
       setIsOpen(false);
    }
  };

  const toggleChat = () => {
    if (!isLoggedIn) {
      toast.error("Please login to chat with Genie");
      dispatch(toggleAuthModal());
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-black p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#a87449] rounded-full flex items-center justify-center text-white shadow-lg">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="text-white text-sm font-bold tracking-widest uppercase">Jhumka Genie</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Always Sparkling</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#faf9f6]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${msg.type === "user" ? "bg-black text-white" : "bg-[#a87449] text-white"}`}>
                    {msg.type === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.type === "user" ? "bg-black text-white rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none border border-gray-100"}`}>
                    {msg.text}
                    <div className={`text-[8px] mt-2 opacity-50 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-[#faf9f6]/80 backdrop-blur-sm flex gap-2 overflow-x-auto no-scrollbar border-y border-gray-100">
            {quickActions.map((qa, i) => (
              <button 
                key={i}
                onClick={() => handleQuickAction(qa.action)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap hover:border-black transition-all shadow-sm"
              >
                {qa.icon} {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-50 flex items-center gap-3">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder="Ask me anything..."
              className="flex-1 bg-[#f5f3ef] rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#a87449]"
            />
            <button 
              onClick={() => handleSend(inputText)}
              className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={toggleChat}
        className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#a87449] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? <X size={28} className="relative z-10" /> : <MessageSquare size={28} className="relative z-10" />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full border-2 border-white animate-bounce"></span>
        )}
      </button>
    </div>
  );
}
