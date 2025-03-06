import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '../LeftSidebar';
import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import EditorToolbar from './components/EditorToolbar';

const NoteEditorPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // In a real app, fetch note from API/storage
    const mockNote = {
      id: noteId,
      title: 'Sample Note',
      content: 'Sample content...',
      createdAt: new Date().toISOString()
    };
    setNote(mockNote);
    setEditedContent(mockNote.content);
    setEditedTitle(mockNote.title);
  }, [noteId]);

  const handleToolbarAction = (action, value) => {
    // Placeholder for formatting actions
    console.log('Toolbar action:', action, value);
    
    switch (action) {
      case 'export':
        // Placeholder for export functionality
        const blob = new Blob([editedContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${editedTitle || 'note'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      // Add more formatting actions here
      default:
        break;
    }
  };

  if (!note) return null;

  return (
    <div className="relative min-h-screen bg-white">
      <SidebarTrigger 
        onHomeClick={() => navigate('/')}
        onProfileClick={() => navigate('/profile')}
        onArchivesClick={() => navigate('/archive')}
        onUploadClick={() => navigate('/upload')}
      />
      
      <div className={`transition-all duration-300 ease-in-out ${
        isFullscreen 
          ? 'fixed inset-0 z-50' 
          : 'max-w-4xl mx-auto pt-4 px-4'
      }`}>
        <div className={`bg-[#F0F0F0] rounded-lg shadow-lg overflow-hidden ${
          isFullscreen ? 'h-screen' : 'h-[calc(100vh-2rem)]'
        }`}>
          {/* Window Controls */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-quicksand">Note Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-300 rounded">
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 hover:bg-gray-300 rounded"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button 
                onClick={() => navigate('/notes')}
                className="p-1 hover:bg-gray-300 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Note Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <div className="flex-1">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-2 py-1 text-lg font-medium border border-transparent hover:border-gray-300 focus:border-gray-300 rounded font-quicksand bg-transparent focus:outline-none focus:ring-0"
                placeholder="Untitled Note"
              />
              <p className="text-sm text-gray-500 font-quicksand mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Editor Toolbar */}
          <EditorToolbar onAction={handleToolbarAction} />

          {/* Note Content */}
          <div className="flex-1 p-6 overflow-auto bg-white h-[calc(100%-12rem)]">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full p-4 border border-gray-200 rounded-lg font-quicksand resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Start writing..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditorPage;