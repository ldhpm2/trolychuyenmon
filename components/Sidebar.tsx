import React, { useState } from 'react';
import { Subject } from '../types';
import { SUBJECT_ICONS } from '../constants';
import { Calculator, Atom, FlaskConical, Terminal, GraduationCap, Menu, X, User, School, MapPin } from 'lucide-react';
import { AUTHOR_INFO } from '../authorInfo';

interface SidebarProps {
  currentSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSubject, onSelectSubject, isOpen, onClose }) => {
  const [showAuthor, setShowAuthor] = useState(false);

  const subjects = [
    { id: Subject.General, icon: GraduationCap, label: 'Tổng Quan' },
    { id: Subject.Math, icon: Calculator, label: 'Toán Học' },
    { id: Subject.Physics, icon: Atom, label: 'Vật Lý' },
    { id: Subject.Chemistry, icon: FlaskConical, label: 'Hóa Học' },
    { id: Subject.CS, icon: Terminal, label: 'Tin Học' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static z-30 w-72 glass-panel text-white transition-transform duration-300 ease-in-out flex flex-col shadow-2xl`}>

        {/* Header */}
        <div className="p-6 border-b border-indigo-500/30 flex justify-between items-center backdrop-blur-md bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">STEM Expert</h1>
              <p className="text-xs text-indigo-200 font-medium tracking-wider">PREMIUM AI ASSISTANT</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-indigo-200 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-3">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            const isActive = currentSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  onSelectSubject(sub.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 border ${isActive
                  ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-lg border-indigo-400/50 backdrop-blur-sm'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white border-transparent'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-indigo-300'} />
                <span className="font-medium">{sub.label}</span>
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-indigo-500/30 my-4"></div>

          {/* Author Section */}
          <button
            onClick={() => setShowAuthor(!showAuthor)}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 border text-teal-200 hover:bg-teal-500/20 hover:text-white border-teal-500/30"
          >
            <User size={20} className="text-teal-300" />
            <span className="font-medium">Tác Giả</span>
          </button>

          {/* Author Details (Collapsible) */}
          {showAuthor && (
            <div className="ml-2 p-4 bg-white/5 rounded-xl border border-teal-500/20 space-y-3 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center">
                  <User size={14} className="text-teal-300" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Giáo viên</p>
                  <p className="text-sm font-semibold text-white">{AUTHOR_INFO.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <School size={14} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Đơn vị</p>
                  <p className="text-sm font-semibold text-white">{AUTHOR_INFO.school}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-purple-300" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Địa chỉ</p>
                  <p className="text-xs font-medium text-white leading-relaxed">{AUTHOR_INFO.address}</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer info */}
        <div className="p-6 border-t border-indigo-500/30 text-xs text-indigo-300/80 text-center bg-black/20">
          <p className="font-semibold tracking-wide">POWERED BY GEMINI PRO</p>
          <p className="mt-1">© 2024 STEM EdTech</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

