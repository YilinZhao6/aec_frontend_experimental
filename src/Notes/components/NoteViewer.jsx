import React, { useState, useEffect } from 'react';
import { Save, Trash2, X, Edit2, Check } from 'lucide-react';

const NoteViewer = ({ note, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedTitle, setEditedTitle] = useState(note.title);

  useEffect(() => {
    setEditedContent(note.content);
    setEditedTitle(note.title);
  }, [note]);

  const handleSave = () => {
    onUpdate({
      ...note,
      title: editedTitle,
      content: editedContent,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Note Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded font-quicksand bg-white"
            />
          ) : (
            <h2 className="text-lg font-medium font-quicksand">{note.title}</h2>
          )}
          <p className="text-sm text-gray-500 font-quicksand">
            {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded"
                title="Save"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 p-6 overflow-auto">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full p-4 border border-gray-200 rounded-lg font-quicksand resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Start writing..."
          />
        ) : (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap font-quicksand">
              {note.content || 'No content yet. Click edit to start writing.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteViewer;