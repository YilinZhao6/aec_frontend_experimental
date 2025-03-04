import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  Gauge, 
  Book, 
  Search, 
  Check, 
  Globe,
  Loader2
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';

const SearchDashboard = ({ 
  mode, 
  setMode, 
  familiarity, 
  setFamiliarity, 
  autoFamiliarity, 
  setAutoFamiliarity,
  selectedBooks,
  setSelectedBooks,
  enableWebSearch,
  setEnableWebSearch,
  additionalComments,
  setAdditionalComments
}) => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchBooks = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      setLoadingBooks(true);
      setBookError('');

      try {
        const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_vectorized_book_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        const result = await response.json();

        if (response.ok && result.success && result.data.books) {
          const formattedBooks = result.data.books.map(book => ({
            id: book.book_id,
            title: book.book_id,
            author: book.author || 'Unknown Author'
          }));
          setAvailableBooks(formattedBooks);
        } else {
          setBookError(result.message || 'Failed to fetch books');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBookError('Failed to connect to the server');
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, []);

  const toggleBook = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const filteredBooks = availableBooks.filter(book => 
    book.title.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  return (
    <div className="pilot-dashboard w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Mode and Familiarity */}
        <div className="space-y-6">
          {/* Mode Selection */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-terminal-silver mb-2 font-quicksand">Mode</div>
            <div className="flex bg-[#E0E0E0] dark:bg-[#2A2A30] rounded-lg p-1 shadow-inner">
              <button
                onClick={() => setMode('normal')}
                className={`flex-1 py-2 px-4 rounded-md font-quicksand text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${mode === 'normal' 
                    ? 'bg-white dark:bg-cyber-gray text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <User className="w-4 h-4" />
                <span>Normal</span>
              </button>
              <button
                onClick={() => setMode('pro')}
                className={`flex-1 py-2 px-4 rounded-md font-quicksand text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${mode === 'pro' 
                    ? 'bg-white dark:bg-cyber-gray text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Pro</span>
              </button>
            </div>
          </div>

          {/* Familiarity Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700 dark:text-terminal-silver font-quicksand">Concept Familiarity</div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoFamiliarity}
                  onChange={() => setAutoFamiliarity(!autoFamiliarity)}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${autoFamiliarity ? 'bg-neon-blue dark:bg-neon-teal' : 'bg-gray-300 dark:bg-gray-600'} relative`}>
                  <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 left-0.5 transition-transform duration-200 ${autoFamiliarity ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <span className="ml-2 text-xs font-quicksand">Auto</span>
              </label>
            </div>
            <div className={`${autoFamiliarity ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex bg-[#E0E0E0] dark:bg-[#2A2A30] rounded-lg p-1 shadow-inner">
                {['Low', 'Medium', 'High'].map((level, index) => (
                  <button
                    key={level}
                    onClick={() => setFamiliarity(index + 1)}
                    className={`flex-1 py-2 px-2 rounded-md font-quicksand text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1
                      ${familiarity === index + 1
                        ? 'bg-white dark:bg-cyber-gray text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    <Gauge className="w-3 h-3" />
                    <span>{level}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-terminal-silver mb-2 font-quicksand">Additional Comments</div>
            <div className="text-box">
              <textarea
                className="bg-transparent border-none outline-none w-full h-20 resize-none font-quicksand"
                placeholder="Tell us what you already know, or want to know about this topic..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Reference Books */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700 dark:text-terminal-silver font-quicksand">Reference Books</div>
            <div className="flex items-center gap-2">
              <Globe
                className={`w-4 h-4 ${
                  enableWebSearch ? 'text-[#3A3A3A] dark:text-[#3A3A3A]' : 'text-gray-400 dark:text-gray-600'
                }`}
              />
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enableWebSearch}
                  onChange={(e) => setEnableWebSearch(e.target.checked)}
                />
                <div className="w-9 h-5 bg-gray-200 dark:bg-cyber-gray peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 dark:peer-focus:ring-cyber-gray-light rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neon-cyan dark:peer-checked:bg-neon-green"></div>
                <span className="ms-2 text-xs font-medium text-gray-700 dark:text-terminal-silver whitespace-nowrap font-quicksand">
                  Web Search
                </span>
              </label>
            </div>
          </div>

          {/* Book Search */}
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-[#E0E0E0] dark:bg-[#2A2A30] border-none rounded-lg py-2 pl-9 pr-3 text-sm font-quicksand focus:ring-1 focus:ring-neon-blue dark:focus:ring-neon-teal"
                placeholder="Search books..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          {/* Book List */}
          <div className="bg-[#E0E0E0] dark:bg-[#2A2A30] rounded-lg p-2 shadow-inner h-[220px] overflow-y-auto">
            {loadingBooks ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin mr-2" />
                <span className="text-gray-600 dark:text-gray-400 font-quicksand">Loading books...</span>
              </div>
            ) : bookError ? (
              <div className="text-center py-4 text-red-600 dark:text-red-400 font-quicksand">{bookError}</div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-4 text-gray-600 dark:text-gray-400 font-quicksand">
                {availableBooks.length === 0 ? "No books available" : "No matching books found"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => toggleBook(book.id)}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                      selectedBooks.includes(book.id)
                        ? 'bg-white dark:bg-cyber-gray'
                        : 'hover:bg-white/50 dark:hover:bg-cyber-gray/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Book className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <h4 className="font-medium text-sm truncate font-quicksand">{book.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-quicksand">{book.author}</p>
                      </div>
                    </div>
                    {selectedBooks.includes(book.id) && (
                      <Check className="w-4 h-4 text-neon-blue dark:text-neon-teal flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDashboard;