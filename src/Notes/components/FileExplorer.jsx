import React from 'react';
import { Folder, FileText } from 'lucide-react';

const FileExplorer = ({ 
  currentPath, 
  viewMode,
  onSelectNote,
  onPathChange,
  folders,
  notes
}) => {
  const getCurrentFolderContent = () => {
    if (currentPath.length === 0) {
      return { folders, notes };
    }
    const currentFolder = folders.find(f => f.name === currentPath[0]);
    return { 
      folders: [], 
      notes: notes.filter(note => note.folderId === currentFolder?.id)
    };
  };

  const content = getCurrentFolderContent();

  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {content.folders.map(folder => (
        <div
          key={folder.id}
          onClick={() => onPathChange([...currentPath, folder.name])}
          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
        >
          <Folder className="w-16 h-16 text-yellow-500" />
          <span className="mt-2 text-sm text-center font-quicksand">{folder.name}</span>
        </div>
      ))}
      {content.notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
        >
          <div 
            className="w-16 h-16 rounded flex items-center justify-center"
            style={{ backgroundColor: note.color }}
          >
            <FileText className="w-8 h-8 text-gray-700" />
          </div>
          <span className="mt-2 text-sm text-center font-quicksand">{note.title}</span>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="p-4">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm font-quicksand text-gray-600">
            <th className="pb-2">Name</th>
            <th className="pb-2">Date modified</th>
            <th className="pb-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {content.folders.map(folder => (
            <tr
              key={folder.id}
              onClick={() => onPathChange([...currentPath, folder.name])}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="py-2">
                <div className="flex items-center">
                  <Folder className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-quicksand">{folder.name}</span>
                </div>
              </td>
              <td className="py-2 text-sm font-quicksand">-</td>
              <td className="py-2 text-sm font-quicksand">File folder</td>
            </tr>
          ))}
          {content.notes.map(note => (
            <tr
              key={note.id}
              onClick={() => onSelectNote(note)}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="py-2">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-quicksand">{note.title}</span>
                </div>
              </td>
              <td className="py-2 text-sm font-quicksand">
                {new Date(note.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 text-sm font-quicksand">Note</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return viewMode === 'grid' ? <GridView /> : <ListView />;
};

export default FileExplorer;