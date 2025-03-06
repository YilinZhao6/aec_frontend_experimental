import React, { useState } from 'react';
import { X } from 'lucide-react';

const ClarifyPanel = ({ selectedSection, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // This will be implemented later
    console.log('Clarification request for:', selectedSection, 'Message:', message);
    setMessage('');
  };

  if (!selectedSection) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
        <p className="font-quicksand">Select a section to request clarification</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Request Clarification
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Section: {selectedSection}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What would you like to have clarified about this section?"
            className="w-full h-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-cyber-gray border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-neon-teal resize-none font-quicksand"
          />
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-neon-teal rounded-md hover:bg-blue-700 dark:hover:bg-neon-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-neon-teal"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClarifyPanel;