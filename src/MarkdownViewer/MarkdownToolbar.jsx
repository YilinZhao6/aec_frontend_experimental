import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  BookmarkPlus,
  Highlighter,
  Share2,
  Palette
} from 'lucide-react';

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', class: 'bg-yellow-200', color: '#fef08a' },
  { name: 'Green', class: 'bg-green-200', color: '#bbf7d0' },
  { name: 'Blue', class: 'bg-blue-200', color: '#bfdbfe' },
  { name: 'White', class: 'bg-white', color: '#ffffff' },
  { name: 'Gray', class: 'bg-gray-200', color: '#e5e7eb' },
  { name: 'Orange', class: 'bg-orange-200', color: '#fed7aa' },
];

export const ToolbarButton = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-500 dark:text-gray-400
               hover:text-gray-900 dark:hover:text-terminal-white hover:bg-terminal-light dark:hover:bg-cyber-gray transition-all duration-300 ${
                 active ? 'text-gray-900 dark:text-terminal-white bg-terminal-light dark:bg-cyber-gray' : ''
               }`}
    title={label}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs font-quicksand">{label}</span>
  </button>
);

export const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-500 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-terminal-white hover:bg-terminal-light dark:hover:bg-cyber-gray transition-all duration-300"
        title="Select highlight color"
      >
        <div className="relative">
          <Palette className="w-5 h-5" />
          <div 
            className="w-1.5 h-1.5 rounded-full absolute -bottom-0.5 -right-0.5"
            style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.class === selectedColor)?.color }}
          />
        </div>
        <span className="text-xs font-quicksand">Color</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-off-white dark:bg-cyber-dark rounded-lg shadow-lg border border-slate-300 dark:border-slate-600 flex flex-col space-y-1 z-50">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                onColorChange(color.class);
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-terminal-light dark:hover:bg-cyber-gray min-w-[100px]"
            >
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color.color }}
              />
              <span className="text-sm text-gray-700 dark:text-terminal-silver font-quicksand">{color.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Toolbar = ({ 
  zoom,
  onZoomIn,
  onZoomOut,
  isHighlightMode,
  onHighlightToggle,
  highlightColor,
  onColorChange,
  onPrint,
  onSavePDF
}) => {
  return (
    <div className="bg-off-white dark:bg-cyber-dark border-b border-slate-300 dark:border-slate-600 h-11 transition-colors duration-300 w-full">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Tools Group */}
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
          <div className="px-2 text-sm text-gray-600 dark:text-gray-300 font-quicksand">{zoom}%</div>
          <ToolbarButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
        </div>

        {/* Center Tools Group */}
        <div className="flex items-center space-x-1">
          <ToolbarButton 
            icon={Highlighter} 
            label="Highlight" 
            onClick={onHighlightToggle}
            active={isHighlightMode}
          />
          <ColorPicker 
            selectedColor={highlightColor}
            onColorChange={onColorChange}
          />
        </div>

        {/* Right Tools Group */}
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={BookmarkPlus} label="Save" onClick={() => {}} />
          <ToolbarButton icon={Share2} label="Share" onClick={() => {}} />
          <ToolbarButton icon={Printer} label="Print" onClick={onPrint} />
          <ToolbarButton icon={Download} label="PDF" onClick={onSavePDF} />
        </div>
      </div>
    </div>
  );
};