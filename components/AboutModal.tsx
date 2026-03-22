import React from 'react';
import { User, School, MapPin, Info, X } from 'lucide-react';
import { AUTHOR_INFO } from '../authorInfo';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-500/30 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-center relative">
                    <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 text-white shadow-inner">
                        <User size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Thông Tin Tác Giả</h2>
                    <p className="text-cyan-100 text-xs mt-1">{AUTHOR_INFO.appName} v{AUTHOR_INFO.version}</p>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-xl">
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{AUTHOR_INFO.role}</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{AUTHOR_INFO.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            <School size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Đơn vị công tác</p>
                            <p className="font-semibold text-gray-800 dark:text-white">{AUTHOR_INFO.school}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Địa chỉ</p>
                            <p className="font-semibold text-gray-800 dark:text-white text-sm">{AUTHOR_INFO.address}</p>
                        </div>
                    </div>

                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-400">© {AUTHOR_INFO.year} {AUTHOR_INFO.appName}</p>
                        <p className="text-xs text-gray-400 mt-1">Powered by Google Gemini AI</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
