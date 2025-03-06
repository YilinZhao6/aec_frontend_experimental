import React, { useState } from 'react';
import { MessageSquare, FileText, Bookmark, X, Send } from 'lucide-react';
import MarkdownAskFollowUp from './MarkdownAskFollowUp';
import NotesPanel from './NotesPanel';

/**
 * RightSidePanel component
 * Provides a tabbed interface for the right side panel in the markdown viewer
 */
const RightSidePanel = () => {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'notes'
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  const handleSaveNote = () => {
    if (note.trim()) {
      setSavedNotes([
        ...savedNotes,
        {
          id: Date.now(),
          content: note,
          timestamp: new Date().toISOString()
        }
      ]);
      setNote('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveNote();
    }
  };

  return (
    <div className="bg-[#F0F0F0] dark:bg-cyber-dark border border-[#CCCCCC] dark:border-[#2A2A30] rounded-lg overflow-hidden w-full h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[#CCCCCC] dark:border-[#2A2A30]">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-3 font-quicksand text-sm ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-cyber-gray border-b-2 border-neon-blue dark:border-neon-teal text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25252D]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Questions</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-3 font-quicksand text-sm ${
            activeTab === 'notes'
              ? 'bg-white dark:bg-cyber-gray border-b-2 border-neon-blue dark:border-neon-teal text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25252D]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'questions' ? (
          <div className="h-full">
            <MarkdownAskFollowUp isOpen={true} />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Notes Input */}
            <div className="p-3 border-b border-[#CCCCCC] dark:border-[#2A2A30]">
              <div className="text-box flex-1 mb-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a note..."
                  className="bg-transparent border-none outline-none w-full resize-none h-20 font-quicksand"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-quicksand">
                  Press Ctrl+Enter to save
                </span>
                <button
                  onClick={handleSaveNote}
                  disabled={!note.trim()}
                  className="px-3 py-1.5 bg-gray-800 dark:bg-neon-green text-white dark:text-cyber-black rounded-lg hover:bg-gray-700 dark:hover:bg-neon-cyan disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm font-quicksand"
                >
                  Save Note
                </button>
              </div>
            </div>

            {/* Saved Notes */}
            <div className="flex-1 overflow-y-auto p-3">
              {savedNotes.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-quicksand">
                    Your notes will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className="bg-white dark:bg-cyber-gray p-3 rounded-lg border border-[#CCCCCC] dark:border-[#2A2A30]"
                    >
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-quicksand whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-quicksand">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                        <button 
                          onClick={() => setSavedNotes(savedNotes.filter(n => n.id !== note.id))}
                          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidePanel;