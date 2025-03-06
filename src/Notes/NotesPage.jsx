import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '../LeftSidebar';
import FileExplorer from './components/FileExplorer';
import TopBar from './components/TopBar';
import NavigationBar from './components/NavigationBar';

const NotesPage = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newNoteName, setNewNoteName] = useState('');
  const [notes, setNotes] = useState([
    { 
      id: '1', 
      title: 'Meeting Notes', 
      folderId: '2', 
      content: 'Meeting agenda...',
      color: '#FFE4B5',
      createdAt: new Date().toISOString()
    },
    { 
      id: '2', 
      title: 'Shopping List', 
      folderId: '1', 
      content: 'Shopping items...',
      color: '#E6E6FA',
      createdAt: new Date().toISOString()
    }
  ]);
  const [folders, setFolders] = useState([
    { id: '1', name: 'Personal', color: '#FFB4B4' },
    { id: '2', name: 'Work', color: '#B4D4FF' },
    { id: '3', name: 'Study', color: '#B4FFB4' }
  ]);
  
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  const handleNavigateForward = () => {
    // Implement forward navigation if needed
  };

  const handlePathChange = (newPath) => {
    setCurrentPath(newPath);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      };
      setFolders(prev => [...prev, newFolder]);
      setShowNewFolderModal(false);
      setNewFolderName('');
    }
  };

  const handleCreateNote = () => {
    if (newNoteName.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: newNoteName.trim(),
        content: '',
        folderId: currentPath.length > 0 ? folders.find(f => f.name === currentPath[0])?.id : null,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        createdAt: new Date().toISOString()
      };
      setNotes(prev => [...prev, newNote]);
      setShowNewNoteModal(false);
      setNewNoteName('');
      navigate(`/notes/${newNote.id}`);
    }
  };

  const handleSelectNote = (note) => {
    navigate(`/notes/${note.id}`);
  };

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
          <TopBar 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            onNewFolder={() => setShowNewFolderModal(true)}
            onNewNote={() => setShowNewNoteModal(true)}
          />

          <NavigationBar 
            currentPath={currentPath}
            onNavigateBack={handleNavigateBack}
            onNavigateForward={handleNavigateForward}
            onPathChange={handlePathChange}
          />

          <div className="h-[calc(100%-7rem)] overflow-hidden">
            <FileExplorer 
              currentPath={currentPath}
              viewMode={viewMode}
              onSelectNote={handleSelectNote}
              onPathChange={handlePathChange}
              folders={folders}
              notes={notes}
            />
          </div>
        </div>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-4 font-quicksand">New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 font-quicksand"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-quicksand"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-quicksand"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-4 font-quicksand">New Note</h3>
            <input
              type="text"
              value={newNoteName}
              onChange={(e) => setNewNoteName(e.target.value)}
              placeholder="Note title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 font-quicksand"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-quicksand"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-quicksand"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;