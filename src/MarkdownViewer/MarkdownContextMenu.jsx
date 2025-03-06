import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ContextMenu = ({ position, onClose, selectedText, onSubmitFollowUp }) => {
  const [showInput, setShowInput] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [menuPosition, setMenuPosition] = useState(position);

  useEffect(() => {
    const menu = document.getElementById('context-menu');
    if (!menu) return;

    const rect = menu.getBoundingClientRect();
    const newPosition = { ...position };

    if (rect.right > window.innerWidth) {
      newPosition.x = window.innerWidth - rect.width - 10;
    }
    if (rect.bottom > window.innerHeight) {
      newPosition.y = window.innerHeight - rect.height - 10;
    }

    setMenuPosition(newPosition);
  }, [position]);

  const handleSubmit = async () => {
    if (!followUpText.trim()) return;
    onSubmitFollowUp({
      selectedText,
      followUpQuestion: followUpText.trim()
    });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!showInput) {
    return (
      <div
        id="context-menu"
        className="fixed bg-off-white dark:bg-cyber-dark border border-slate-300 dark:border-slate-600 shadow-md z-50"
        style={{
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`,
          minWidth: '200px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          <button
            onClick={() => setShowInput(true)}
            className="w-full text-left px-4 py-1.5 text-sm hover:bg-terminal-light dark:hover:bg-cyber-gray flex items-center gap-2 text-gray-700 dark:text-terminal-silver font-quicksand"
          >
            <MessageCircle className="h-4 w-4" />
            Ask Follow-Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="context-menu"
      className="fixed bg-off-white dark:bg-cyber-dark rounded-lg shadow-lg border border-slate-300 dark:border-slate-600 z-50 w-[360px]
                font-quicksand animate-in fade-in duration-200"
      style={{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <div className="text-box w-full">
            <input
              type="text"
              placeholder="Ask a follow-up question..."
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-transparent border-none outline-none w-full font-quicksand"
            />
          </div>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 font-quicksand">
            ↵
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInput(false)}
            className="p-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-terminal-silver
                     hover:bg-terminal-light dark:hover:bg-cyber-gray rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!followUpText.trim()}
            className="p-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-terminal-silver
                     hover:bg-terminal-light dark:hover:bg-cyber-gray rounded transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      setContextMenu({
        position: { x: event.pageX, y: event.pageY },
        selectedText
      });
    } else {
      setContextMenu(null);
    }
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleSubmitFollowUp = useCallback(async ({ selectedText, followUpQuestion }) => {
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/submit_feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          concept: selectedText,
          question: followUpQuestion,
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      if (data.status === 'success' && data.data) {
        // Dispatch custom event with the concept data
        const event = new CustomEvent('feedbackSuccess', {
          detail: {
            concept: selectedText,
            explanation: data.data.explanation
          }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (contextMenu && !e.target.closest('#context-menu')) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu, closeContextMenu]);

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    ContextMenuComponent: contextMenu ? (
      <ContextMenu
        position={contextMenu.position}
        selectedText={contextMenu.selectedText}
        onClose={closeContextMenu}
        onSubmitFollowUp={handleSubmitFollowUp}
      />
    ) : null
  };
};

export default ContextMenu;