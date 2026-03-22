import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import ApiKeyModal from './components/ApiKeyModal';
import AboutModal from './components/AboutModal';
import LoginPage from './components/LoginPage';
import { Message, Sender, Subject } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { Menu, Trash2, FileText, Presentation, Key, Info } from 'lucide-react';
import { SUBJECT_ICONS, SAMPLE_QUESTIONS, SUBJECT_QUESTIONS } from './constants';
import { exportToDocx, exportToPptx } from './services/ExportService';

const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [currentSubject, setCurrentSubject] = useState<Subject>(Subject.General);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for API key on mount
  useEffect(() => {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
      setHasApiKey(true);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: generateId(),
          text: `Xin chào! Tôi là **STEM Education Expert AI**. \n\nTôi ở đây để hỗ trợ bạn về: \n- 🧮 **Toán Học** \n- ⚛️ **Vật Lý** \n- 🧪 **Hóa Học** \n- 💻 **Tin Học** \n\nBạn cần giúp đỡ gì về bài giảng, kiến thức chuyên môn hay công cụ giáo dục hôm nay?`,
          sender: Sender.Bot,
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string, image?: File) => {
    const newUserMsg: Message = {
      id: generateId(),
      text,
      sender: Sender.User,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMsg]);

    const loadingMsgId = generateId();
    const loadingMsg: Message = {
      id: loadingMsgId,
      text: '',
      sender: Sender.Bot,
      timestamp: Date.now(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      let imagePart = undefined;
      if (image) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
          };
        });
        reader.readAsDataURL(image);
        const base64Data = await base64Promise;
        imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: image.type
          }
        };
      }

      const contextPrefix = currentSubject !== Subject.General ? `[Môn ${currentSubject}] ` : '';
      const finalPrompt = contextPrefix + text;

      const responseText = await sendMessageToGemini(messages, finalPrompt, imagePart);

      setMessages((prev) =>
        prev.map(msg =>
          msg.id === loadingMsgId
            ? { ...msg, text: responseText, isLoading: false }
            : msg
        )
      );

    } catch (error) {
      setMessages((prev) =>
        prev.map(msg =>
          msg.id === loadingMsgId
            ? { ...msg, text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.", isLoading: false }
            : msg
        )
      );
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện?")) {
      setMessages([
        {
          id: generateId(),
          text: `Cuộc trò chuyện đã được làm mới. Hãy chọn một chủ đề hoặc đặt câu hỏi mới!`,
          sender: Sender.Bot,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const handleExportDocx = async () => {
    setIsExporting(true);
    await exportToDocx(messages, currentSubject);
    setIsExporting(false);
  };

  const handleExportPptx = async () => {
    setIsExporting(true);
    await exportToPptx(messages, currentSubject);
    setIsExporting(false);
  };

  const handleApiKeySave = (key: string) => {
    setHasApiKey(true);
    setShowApiKeyModal(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={(status) => setIsLoggedIn(status)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleApiKeySave}
        isMandatory={!hasApiKey}
      />
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      <Sidebar
        currentSubject={currentSubject}
        onSelectSubject={setCurrentSubject}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Bar */}
        <header className="h-16 glass-panel border-b-0 border-white/10 flex items-center justify-between px-4 z-10 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-indigo-200 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="font-bold text-lg text-white flex items-center gap-2 drop-shadow-md">
                <span className="text-2xl filter drop-shadow">{SUBJECT_ICONS[currentSubject]}</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100">{currentSubject}</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                AI Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* API Key Settings Button */}
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-button text-xs font-medium text-red-300 hover:text-white hover:bg-red-500/20 border border-red-500/30"
              title="Cấu hình API Key"
            >
              <Key size={16} />
              <span className="hidden md:inline">API Key</span>
            </button>

            <button
              onClick={handleExportDocx}
              disabled={isExporting}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-button text-xs font-medium text-white hover:text-indigo-100 disabled:opacity-50"
              title="Xuất Giáo Án (Word)"
            >
              <FileText size={16} />
              <span>Word</span>
            </button>
            <button
              onClick={handleExportPptx}
              disabled={isExporting}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-button text-xs font-medium text-white hover:text-indigo-100 disabled:opacity-50"
              title="Xuất Bài Giảng (PPT)"
            >
              <Presentation size={16} />
              <span>PPT</span>
            </button>

            <div className="h-6 w-[1px] bg-white/20 mx-1 hidden md:block"></div>

            {/* About / Author Info Button */}
            <button
              onClick={() => setShowAboutModal(true)}
              className="p-2 text-teal-300 hover:text-teal-200 hover:bg-teal-500/10 rounded-lg transition-colors"
              title="Thông tin Tác giả"
            >
              <Info size={20} />
            </button>

            <button
              onClick={handleClearChat}
              className="p-2 text-indigo-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
              title="Xóa trò chuyện"
            >
              <Trash2 size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        >
          <div className="max-w-4xl mx-auto space-y-4 pb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>

          {/* Suggestions if chat is empty-ish */}
          {messages.length === 1 && (
            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
              {(SUBJECT_QUESTIONS[currentSubject] || SAMPLE_QUESTIONS).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-left p-5 glass-panel rounded-xl hover:bg-white/10 transition-all duration-300 text-sm text-indigo-100 hover:text-white group border-indigo-500/20"
                >
                  <span className="font-semibold text-indigo-300 group-hover:text-indigo-200 block mb-1">{SUBJECT_ICONS[currentSubject]} Gợi ý {idx + 1}</span>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <InputArea
          onSendMessage={handleSendMessage}
          disabled={messages.length > 0 && messages[messages.length - 1].isLoading}
        />
      </main>
    </div>
  );
}

export default App;
