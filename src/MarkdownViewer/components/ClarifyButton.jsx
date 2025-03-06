import React from 'react';
import { MessageCircle } from 'lucide-react';

const ClarifyButton = ({ sectionTitle, onClarifyClick }) => {
  return (
    <button
      onClick={() => onClarifyClick(sectionTitle)}
      className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-cyber-gray hover:bg-gray-200 dark:hover:bg-cyber-gray-light rounded-md transition-colors duration-200"
    >
      <MessageCircle className="w-4 h-4 mr-1" />
      Clarify
    </button>
  );
};

export default ClarifyButton;