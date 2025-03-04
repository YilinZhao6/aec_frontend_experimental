import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, Globe, Check } from 'lucide-react';

const InitialSearchCollapseMenu = ({ 
  showAdditionalInputs, 
  setShowAdditionalInputs,
  selectedBooks,
  setSelectedBooks,
  enableWebSearch,
  setEnableWebSearch,
  additionalComments,
  setAdditionalComments
}) => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [bookError, setBookError] = useState('');

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
    setIsInitialized(true);
  }, []);

  const toggleBook = (bookId) => {
    setSelectedBooks(prev => 
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Centered More Options */}
      <div
        onClick={() => setShowAdditionalInputs(!showAdditionalInputs)}
        className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300 font-quicksand"
        style={{ backgroundColor: 'transparent' }}
      >
        <span>More Options</span>
        <div className="flex items-center gap-1">
          <ArrowUpCircle
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 text-[#3A3A3A] dark:text-[#3A3A3A] ${
              showAdditionalInputs ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </div>
      </div>

      {showAdditionalInputs && (
        <div className="space-y-4 sm:space-y-6 mt-4">
          {/* Comments Input */}
          <div className="cyber-card p-4">
            <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-terminal-silver mb-2 font-quicksand">
              Do you have any further comments on this topic?
            </label>
            <div className="text-box">
              <textarea
                className="bg-transparent border-none outline-none w-full h-24 resize-none font-quicksand"
                placeholder="Tell us what you already know, or want to know about this topic..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
              />
            </div>
          </div>

          {/* Reference Books Selection */}
          <div className="cyber-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-terminal-silver font-quicksand">Select Reference Books</h3>
              <div className="flex items-center gap-2">
                <Globe
                  className={`w-5 h-5 ${
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
                  <span className="ms-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-terminal-silver whitespace-nowrap font-quicksand">
                    Web Search
                  </span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              {loadingBooks ? (
                <div className="text-center py-4 text-gray-600 dark:text-gray-400 font-quicksand">Loading books...</div>
              ) : bookError ? (
                <div className="text-center py-4 text-red-600 dark:text-red-400 font-quicksand">{bookError}</div>
              ) : availableBooks.length === 0 ? (
                <div className="text-center py-4 text-gray-600 dark:text-gray-400 font-quicksand">No books available</div>
              ) : (
                availableBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => toggleBook(book.id)}
                    className={`text-box cursor-pointer ${
                      selectedBooks.includes(book.id)
                        ? 'border-[#3A3A3A]'
                        : ''
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium font-quicksand">{book.title}</h4>
                      <p className="text-sm opacity-70 font-quicksand">{book.author}</p>
                    </div>
                    {selectedBooks.includes(book.id) && (
                      <Check className="icon w-6 h-6" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitialSearchCollapseMenu;