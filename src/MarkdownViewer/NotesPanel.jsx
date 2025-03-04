import React from 'react';
import { Bookmark } from 'lucide-react';

/**
 * Notes Panel component
 * Displays a panel for note-taking functionality
 */
const NotesPanel = () => {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      <div className="text-center py-8">
        <Bookmark className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 font-quicksand">
          Your notes will appear here
        </p>
      </div>
    </div>
  );
};

export default NotesPanel;