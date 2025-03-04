import React, { useState, useRef, useEffect } from 'react';
import { 
  Search,
  LogIn, 
  Zap,
  BookOpen, 
  Brain, 
  Atom,
  Lightbulb,
  Loader2
} from 'lucide-react';
import PilotDashboard from './components/PilotDashboard';
import { useTheme, ThemeToggle } from './ThemeProvider';

const ProcessingIndicator = () => (
  <div className="absolute -bottom-6 left-0 right-0 flex justify-center opacity-70">
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-quicksand">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="animate-pulse">Connecting to knowledge base</span>
    </div>
  </div>
);

const InitialSearchMain = ({ onSearch, onLoginClick }) => {
  const [query, setQuery] = useState('');
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [additionalComments, setAdditionalComments] = useState('');
  const [mode, setMode] = useState('normal'); // 'normal' or 'pro'
  const [familiarity, setFamiliarity] = useState(2); // 1=Low, 2=Medium, 3=High
  const [autoFamiliarity, setAutoFamiliarity] = useState(true);
  const searchBoxRef = useRef(null);
  const { isDarkMode } = useTheme();

  // Handle hover for dashboard
  useEffect(() => {
    const searchBox = searchBoxRef.current;
    
    if (!searchBox) return;
    
    let hoverTimeout;
    
    const handleMouseEnter = () => {
      clearTimeout(hoverTimeout);
      setShowDashboard(true);
    };
    
    const handleMouseLeave = () => {
      hoverTimeout = setTimeout(() => {
        setShowDashboard(false);
      }, 300);
    };
    
    searchBox.addEventListener('mouseenter', handleMouseEnter);
    searchBox.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      searchBox.removeEventListener('mouseenter', handleMouseEnter);
      searchBox.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(hoverTimeout);
    };
  }, []);

  const handleSearch = () => {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      setShowAuthAlert(true);
      setTimeout(() => setShowAuthAlert(false), 3000);
      return;
    }

    if (query.trim() !== '') {
      const bookIdsString = selectedBooks.join('///');
      const comments = additionalComments.trim() || undefined;
      
      // Include mode and familiarity in search parameters
      const searchParams = {
        query,
        bookIdsString,
        enableWebSearch,
        comments,
        mode,
        familiarity: autoFamiliarity ? 'auto' : familiarity
      };
      
      onSearch(query, bookIdsString, enableWebSearch, comments);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setIsTyping(true);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => setIsTyping(false), 1000);
  };

  const SuggestionCard = ({ icon: Icon, text, onClick }) => (
    <button 
      onClick={onClick}
      className="text-box group w-full text-left"
    >
      <Icon className="icon w-6 h-6 sm:w-7 sm:h-7" />
      <span className="text-sm sm:text-base font-medium font-quicksand">
        {text}
      </span>
    </button>
  );

  return (
    <div className="relative min-h-screen bg-terminal-white dark:bg-cyber-black transition-colors duration-300">
      {/* Top Header with Controls */}
      <div className="fixed top-0 right-0 left-0 h-16 flex items-center justify-end px-6 z-10 sm:pr-6 sm:pl-20">
        {/* Right side controls */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          {/* Login Button */}
          <button
            onClick={onLoginClick}
            className="cyber-button hidden sm:flex bg-gray-900 dark:bg-neon-teal text-white dark:text-cyber-black hover:bg-gray-800 dark:hover:bg-neon-blue"
          >
            <LogIn className="w-5 h-5 mr-2 inline-block text-white dark:text-cyber-black" />
            <span className="text-white dark:text-cyber-black">Sign In</span>
          </button>
        </div>
      </div>

      {showAuthAlert && (
        <div className="fixed top-20 sm:top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-quicksand">
            Please sign in to continue
          </div>
        </div>
      )}

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-16">
        <div className="w-full max-w-3xl space-y-8 sm:space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 sm:space-y-6 animate-text-fade-in">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-terminal-light dark:bg-cyber-gray text-gray-600 dark:text-terminal-silver text-xs sm:text-sm font-quicksand">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#3A3A3A]" />
              AI-Powered Knowledge Engine
            </div>
            <h1 className="text-3xl sm:text-[34px] font-medium text-gray-900 dark:text-terminal-white font-quicksand tracking-wide">
              Ask anything.
              <span className="block text-gray-500 dark:text-gray-400 mt-2 tracking-wide">Get comprehensive answers.</span>
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative animate-slide-up">
            <div className="relative" ref={searchBoxRef}>
              <div className="text-box w-full h-12 sm:h-16 pl-12 sm:pl-14 pr-14 sm:pr-16">
                <Search className="icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  className="bg-transparent border-none outline-none w-full text-base sm:text-lg font-quicksand"
                  placeholder="Ask anything..."
                  value={query}
                  onChange={handleQueryChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-gray-900 dark:bg-neon-green dark:text-cyber-black text-white rounded-lg
                           hover:bg-gray-800 dark:hover:bg-neon-cyan transition-colors duration-300"
                >
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
            {isTyping && <ProcessingIndicator />}
          </div>

          {/* Pilot Dashboard */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showDashboard ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <PilotDashboard
              mode={mode}
              setMode={setMode}
              familiarity={familiarity}
              setFamiliarity={setFamiliarity}
              autoFamiliarity={autoFamiliarity}
              setAutoFamiliarity={setAutoFamiliarity}
              selectedBooks={selectedBooks}
              setSelectedBooks={setSelectedBooks}
              enableWebSearch={enableWebSearch}
              setEnableWebSearch={setEnableWebSearch}
              additionalComments={additionalComments}
              setAdditionalComments={setAdditionalComments}
            />
          </div>

          {/* Suggestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <SuggestionCard
              icon={Atom}
              text="Tell me about Quantum Entanglement"
              onClick={() => {
                setQuery("Tell me about Quantum Entanglement");
                setShowDashboard(true);
              }}
            />
            <SuggestionCard
              icon={Brain}
              text="What are Moore Diagrams"
              onClick={() => {
                setQuery("What are Moore Diagrams");
                setShowDashboard(true);
              }}
            />
            <SuggestionCard
              icon={Lightbulb}
              text="I want to learn more about Orbital Motion"
              onClick={() => {
                setQuery("I want to learn more about Orbital Motion");
                setShowDashboard(true);
              }}
            />
            <SuggestionCard
              icon={BookOpen}
              text="Explain Neural Networks"
              onClick={() => {
                setQuery("Explain Neural Networks");
                setShowDashboard(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSearchMain;