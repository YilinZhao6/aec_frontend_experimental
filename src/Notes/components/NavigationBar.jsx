import React from 'react';
import { ChevronLeft, ChevronRight, Home, RefreshCw, Search } from 'lucide-react';

const NavigationBar = ({ 
  currentPath, 
  onNavigateBack, 
  onNavigateForward,
  onPathChange 
}) => {
  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-white border-b border-gray-300">
      <div className="flex items-center space-x-1">
        <button 
          onClick={onNavigateBack}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={currentPath.length === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={onNavigateForward}
          className="p-1 hover:bg-gray-100 rounded"
          disabled={true} // Enable when forward history is implemented
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onPathChange([])}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Home className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Path Bar */}
      <div className="flex-1 flex items-center bg-[#F0F0F0] px-3 py-1 rounded">
        {currentPath.length === 0 ? (
          <span className="text-sm font-quicksand">Notes</span>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-quicksand">Notes</span>
            {currentPath.map((folder, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-quicksand">{folder}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="w-48 px-8 py-1 bg-[#F0F0F0] rounded text-sm font-quicksand focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

export default NavigationBar;