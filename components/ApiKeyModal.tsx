import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, Save } from 'lucide-react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
    isMandatory?: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, isMandatory = false }) => {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) setApiKey(savedKey);
    }, [isOpen]);

    const handleSave = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('gemini_api_key', apiKey.trim());
        onSave(apiKey.trim());
        if (!isMandatory) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-500/30 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-center relative">
                    <div className="mx-auto w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 text-white shadow-inner">
                        <Key size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Cấu hình API Key</h2>
                    <p className="text-indigo-100 text-xs mt-1">Kết nối với Google Gemini AI</p>

                    {!isMandatory && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    )}
                </div>

                {/* content */}
                <div className="p-6 space-y-4">
                    {!isMandatory && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg flex gap-2 items-start">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <p>API Key được lưu an toàn trên trình duyệt của bạn (LocalStorage).</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Google AI Studio Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Nhập API Key bắt đầu bằng AIza..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>

                    <div className="text-center">
                        <a
                            href="https://aistudio.google.com/api-keys"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline font-medium"
                        >
                            Lấy API Key miễn phí tại đây (AI Studio)
                        </a>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!apiKey.trim()}
                        className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all ${!apiKey.trim()
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 hover:shadow-indigo-500/30 transform hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        <Save size={18} />
                        Lưu Cấu Hình
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
