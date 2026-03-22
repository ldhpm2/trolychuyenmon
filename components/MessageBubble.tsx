import React from 'react';
import { Message, Sender } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-600' : 'bg-teal-600'
          } text-white shadow-md`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Bubble */}
        <div
          className={`flex flex-col p-5 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-300 ${isUser
              ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-indigo-400/30 rounded-tr-sm msg-user'
              : 'bg-slate-800/80 text-gray-100 border-slate-600/50 rounded-tl-sm msg-bot glass-panel'
            }`}
        >
          {message.isLoading ? (
            <div className="flex space-x-2 h-6 items-center px-2">
              <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          ) : (
            <div className={`prose prose-invert max-w-none ${isUser ? 'text-white' : 'text-gray-100'}`}>
              {isUser ? (
                <div className="whitespace-pre-wrap font-medium">{message.text}</div>
              ) : (
                <MarkdownRenderer content={message.text} />
              )}
            </div>
          )}

          <span className={`text-[10px] mt-3 block opacity-60 font-medium tracking-wide ${isUser ? 'text-indigo-200' : 'text-gray-400'} text-right`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
