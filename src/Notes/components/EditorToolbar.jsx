import React from 'react';
import { 
  Bold, 
  Italic, 
  Highlighter, 
  TextQuote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  FileText,
  Save,
  Type
} from 'lucide-react';

const ToolbarButton = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100 text-blue-600' : ''}`}
    title={label}
  >
    <Icon className="w-4 h-4" />
  </button>
);

const EditorToolbar = ({ onAction }) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center gap-1 p-1">
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={Save} label="Save (Ctrl+S)" onClick={() => onAction('save')} />
          <ToolbarButton icon={Download} label="Export" onClick={() => onAction('export')} />
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <select 
            className="px-2 py-1 border border-gray-200 rounded text-sm font-quicksand"
            onChange={(e) => onAction('fontFamily', e.target.value)}
          >
            <option value="Quicksand">Quicksand</option>
            <option value="Space Mono">Space Mono</option>
            <option value="JetBrains Mono">JetBrains Mono</option>
          </select>
          <select 
            className="px-2 py-1 border border-gray-200 rounded text-sm font-quicksand"
            onChange={(e) => onAction('fontSize', e.target.value)}
          >
            {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={Bold} label="Bold (Ctrl+B)" onClick={() => onAction('bold')} />
          <ToolbarButton icon={Italic} label="Italic (Ctrl+I)" onClick={() => onAction('italic')} />
          <ToolbarButton icon={Highlighter} label="Highlight" onClick={() => onAction('highlight')} />
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <ToolbarButton icon={AlignLeft} label="Align Left" onClick={() => onAction('alignLeft')} />
          <ToolbarButton icon={AlignCenter} label="Align Center" onClick={() => onAction('alignCenter')} />
          <ToolbarButton icon={AlignRight} label="Align Right" onClick={() => onAction('alignRight')} />
        </div>

        <div className="flex items-center gap-1 px-2">
          <ToolbarButton icon={List} label="Bullet List" onClick={() => onAction('bulletList')} />
          <ToolbarButton icon={ListOrdered} label="Numbered List" onClick={() => onAction('numberedList')} />
          <ToolbarButton icon={TextQuote} label="Quote" onClick={() => onAction('quote')} />
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;