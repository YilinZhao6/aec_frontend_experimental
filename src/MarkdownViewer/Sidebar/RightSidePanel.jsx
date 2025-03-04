import React, { useState, useEffect } from 'react';
import { MessageSquare, FileText, BookOpen } from 'lucide-react';
import QuestionsPanel from './QuestionsPanel';
import NotesPanel from './NotesPanel';
import ConceptsPanel from './ConceptsPanel';

/**
 * RightSidePanel component
 * Provides a tabbed interface for the right side panel in the markdown viewer
 */
const RightSidePanel = ({ selectedConcept }) => {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions', 'notes', or 'concepts'
  
  // Automatically switch to concepts tab when a concept is selected
  useEffect(() => {
    if (selectedConcept) {
      setActiveTab('concepts');
    }
  }, [selectedConcept]);

  return (
    <div className="bg-[#F0F0F0] dark:bg-cyber-dark border border-[#CCCCCC] dark:border-[#2A2A30] rounded-lg overflow-hidden w-full h-[calc(100vh-140px)] flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[#CCCCCC] dark:border-[#2A2A30]">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 px-4 py-3 font-quicksand text-sm ${
            activeTab === 'questions'
              ? 'bg-white dark:bg-cyber-gray border-b-2 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25252D]'
          }`}
        >
          Questions
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-4 py-3 font-quicksand text-sm ${
            activeTab === 'notes'
              ? 'bg-white dark:bg-cyber-gray border-b-2 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25252D]'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('concepts')}
          className={`flex-1 px-4 py-3 font-quicksand text-sm ${
            activeTab === 'concepts'
              ? 'bg-white dark:bg-cyber-gray border-b-2 border-gray-400 dark:border-gray-500 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#25252D]'
          }`}
        >
          Concepts
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'questions' ? (
          <QuestionsPanel />
        ) : activeTab === 'notes' ? (
          <NotesPanel />
        ) : (
          <ConceptsPanel concept={selectedConcept} />
        )}
      </div>
    </div>
  );
};

export default RightSidePanel;