import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext.jsx';
import aiApi from '../../api/aiApi';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Dạ chào bạn, mình là trợ lý AI của ShopModern. Mình có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasStickyCartBar = location.pathname === '/cart' && cartItems && cartItems.length > 0;
  const hasMobileProfileNav = isMobile && location.pathname === '/profile';
  const shouldShiftUp = hasStickyCartBar || hasMobileProfileNav;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiApi.chat(userMessage, 'guest');
      // Theo cấu trúc API: response.data.result.reply và response.data.result.suggestions
      const result = response.result || (response.data && response.data.result);
      if (result) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: result.reply,
            suggestions: result.suggestions
          }
        ]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Có lỗi xảy ra khi kết nối với máy chủ AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={`font-sans transition-all duration-300 ${
      isFullScreen 
        ? 'fixed inset-0 z-[99999]' 
        : `fixed right-6 z-[9999] ${shouldShiftUp ? 'bottom-24' : 'bottom-6'}`
    }`}>
      {/* Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce"
        >
          <span className="material-symbols-outlined text-3xl">smart_toy</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white border-gray-100 transition-all duration-300 flex flex-col ${
          isFullScreen
            ? 'w-screen h-screen rounded-none border-none'
            : 'w-[calc(100vw-32px)] sm:w-[420px] rounded-2xl shadow-2xl overflow-hidden h-[70vh] sm:h-[600px] border'
        }`}>
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md z-10 relative">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span>
              <div>
                <h3 className="font-bold text-lg m-0 leading-none">ShopModern AI</h3>
                <span className="text-xs text-white/80">Sẵn sàng hỗ trợ</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-white/10"
                title={isFullScreen ? "Thu nhỏ" : "Toàn màn hình"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isFullScreen ? "fullscreen_exit" : "fullscreen"}
                </span>
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsFullScreen(false); }}
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center p-1 rounded-full hover:bg-white/10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 ${msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                  {/* Handle Markdown-like bold text **text** to bold */}
                  <p className="m-0 text-sm whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />

                  {/* Suggestions Display */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.suggestions.map((product) => (
                        <div
                          key={product.id}
                          className="bg-gray-50 rounded-xl p-2 flex gap-3 border border-gray-100 cursor-pointer hover:border-primary transition-colors"
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          <img
                            src={product.imageUrl?.[0] || product.image || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1 overflow-hidden">
                            <h4 className="font-bold text-gray-900 text-xs truncate m-0 mb-1">{product.name}</h4>
                            <p className="text-primary font-bold text-xs m-0">
                              {product.price.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none p-3 flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-orange-600 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
