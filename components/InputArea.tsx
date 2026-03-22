import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string, image?: File) => void;
  disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!text.trim() && !selectedImage) || disabled) return;
    onSendMessage(text, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            e.preventDefault(); // Prevent pasting the image filename/metadata as text if distinct
            setSelectedImage(blob);
            return; // Only take the first image found
          }
        }
      }
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative group">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg border border-gray-300"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
            <span className="text-sm text-gray-500 truncate max-w-[200px]">{selectedImage.name}</span>
          </div>
        )}

        <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Thêm hình ảnh"
            disabled={disabled}
          >
            <ImageIcon size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder="Nhập câu hỏi cho chuyên gia STEM... (Có thể dán ảnh Ctrl+V)"
            className="flex-1 max-h-[120px] bg-transparent border-none outline-none resize-none py-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 text-base"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={(!text.trim() && !selectedImage) || disabled}
            className={`p-2 rounded-full transition-all ${(!text.trim() && !selectedImage) || disabled
              ? 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transform hover:scale-105 active:scale-95'
              }`}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2">
          AI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng.
        </p>
      </div>
    </div>
  );
};

export default InputArea;
