import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi có thể giúp gì cho bạn?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Thêm tin nhắn của người dùng
    setMessages([...messages, { id: Date.now(), text: inputValue, isBot: false }]);
    setInputValue('');
    
    // Giả lập phản hồi đơn giản (không có AI)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Đây chỉ là demo giao diện. Chưa có AI được tích hợp.", 
        isBot: true 
      }]);
    }, 1000);
  };

  // Hiệu ứng cho khung chat
  const chatVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transformOrigin: "bottom right" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 20, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      }
    }
  };

  // Hiệu ứng cho tin nhắn
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Icon Chatbot với hiệu ứng nâng cao */}
      <motion.div
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" 
        }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          rotate: isOpen ? 45 : 0,
          transition: { type: "spring", stiffness: 260, damping: 20 }
        }}
      >
        {isOpen ? <FaTimes size={24} /> : <FaComments size={24} />}
      </motion.div>

      {/* Khung Chat với hiệu ứng mượt mà */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-20 right-0 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
            style={{ backdropFilter: "blur(10px)" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 flex justify-between items-center">
              <motion.h3 
                className="font-medium"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Football Assistant
              </motion.h3>
              <motion.button 
                onClick={toggleChat}
                className="text-white hover:text-gray-200 focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes />
              </motion.button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div 
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`mb-3 ${msg.isBot ? 'flex justify-start' : 'flex justify-end'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.isBot 
                        ? 'bg-white text-gray-800 shadow-sm border border-gray-100' 
                        : 'bg-blue-500 text-white shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
            
            {/* Input */}
            <motion.form 
              onSubmit={handleSendMessage} 
              className="border-t p-3 flex items-center bg-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
              />
              <motion.button 
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-full ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputValue.trim()}
              >
                <FaPaperPlane />
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotIcon;