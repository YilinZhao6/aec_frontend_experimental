import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import { Toolbar, HIGHLIGHT_COLORS } from './MarkdownToolbar';
import { useContextMenu } from './MarkdownContextMenu';
import html2pdf from 'html2pdf.js';
import { getMarkdownStyles } from './MarkdownViewer_css';
import DiagramRenderer from '../DiagramRenderer';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentSectionsPanel } from './index.js';
import { RightSidePanel } from './Sidebar';

// Content width percentage - can be adjusted as needed
const CONTENT_WIDTH_PERCENTAGE = 100; // Default 90% width
// Horizontal margin percentage - can be adjusted as needed
const HORIZONTAL_MARGIN_PERCENTAGE = 0; // Margin on left and right sides

// Left margin for the entire layout - can be adjusted as needed
const LEFT_PAGE_MARGIN = 2; // Percentage of page width for left margin

// Column layout percentages - can be adjusted to shift panels
const LEFT_COLUMN_WIDTH = 16; // Increased from 22%
const CENTER_COLUMN_WIDTH = 60; // Decreased from 56%
const RIGHT_COLUMN_WIDTH = 22; // Unchanged at 22%

/**
 * Base component for markdown viewing functionality
 * Handles common markdown rendering, toolbar actions, and UI elements
 */
const MarkdownViewerBase = ({ 
  markdownContent,
  isComplete,
  userId,
  conversationId,
  isArchiveView,
  onBackClick,
  isLoading = false
}) => {
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].class);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { contextMenu, handleContextMenu, ContextMenuComponent } = useContextMenu();
  const navigate = useNavigate();
  
  const wordCount = markdownContent ? markdownContent.trim().split(/\s+/).length : 0;
  const charCount = markdownContent ? markdownContent.length : 0;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  // Process citations, highlights, and concepts in markdown content
  const processedContent = React.useMemo(() => {
    if (!markdownContent) return '';
    
    let content = markdownContent;
    
    // Replace citation tags with direct HTML
    content = content.replace(/<CITE:\s*([^,]+),\s*([^>]+)>/g, (match, source, url) => {
      // Generate a unique ID for each citation
      const id = 'citation-' + Math.random().toString(36).substring(2, 12);
      
      return `<a id="${id}" href="${url.trim()}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-2 py-1 bg-off-white hover:bg-gray-200 text-gray-700 text-xs rounded-md border border-[#CCCCCC] transition-colors ml-1 font-quicksand">
  <span>${source.trim()}</span>
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
</a>`;
    });
    
    // Replace highlight tags with bold and yellow background
    content = content.replace(/<highlight>(.*?)<\/highlight>/g, 
      '<span class="font-bold bg-yellow-200 px-1 rounded">$1</span>');
    
    // Replace concept tags with interactive buttons
    content = content.replace(/<concept>(.*?)<\/concept>/g, (match, conceptText) => {
      const conceptId = 'concept-' + Math.random().toString(36).substring(2, 12);
      return `<button id="${conceptId}" class="concept-button font-medium text-blue-600 underline underline-offset-2 cursor-pointer" data-concept="${conceptText}">${conceptText}</button>`;
    });
    
    return content;
  }, [markdownContent]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [markdownContent]);

  // Add event listeners for concept buttons
  useEffect(() => {
    const handleConceptClick = (e) => {
      const conceptButton = e.target.closest('.concept-button');
      if (conceptButton) {
        const concept = conceptButton.getAttribute('data-concept');
        setSelectedConcept(concept);
      }
    };

    document.addEventListener('click', handleConceptClick);
    return () => document.removeEventListener('click', handleConceptClick);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSaveAsPDF = async () => {
    if (contentRef.current) {
      const element = contentRef.current;
      const images = element.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
      );
  
      await Promise.all(imagePromises);
  
      const options = {
        margin: 0.5,
        filename: 'preview.pdf',
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: true,
          windowWidth: 1080
        },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      };
      
      html2pdf().set(options).from(element).save();
    }
  };

  useEffect(() => {
    const handleSelection = () => {
      if (!isHighlightMode) return;
      
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (!selectedText) return;

      let container = selection.getRangeAt(0).commonAncestorContainer;
      while (container && container !== contentRef.current) {
        container = container.parentNode;
      }
      if (!container) return;

      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = highlightColor;
      
      try {
        range.surroundContents(span);
      } catch (e) {
        console.warn('Could not highlight complex selection');
      }
      
      selection.removeAllRanges();
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && isHighlightMode) {
        handleSelection();
      }
    };

    const handleMouseUp = () => {
      if (isHighlightMode) {
        setTimeout(handleSelection, 10);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isHighlightMode, highlightColor]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = getMarkdownStyles();
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Loading state component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="w-16 h-16 mb-8">
        <Loader2 className="w-full h-full text-gray-400 dark:text-gray-600 animate-spin" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 font-quicksand">Generating your content</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md font-quicksand">
        We're preparing a comprehensive explanation. This may take a moment as we gather and organize the information.
      </p>
    </div>
  );

  return (
    <div className="flex-1 flex h-full bg-[#F0F0F0] dark:bg-cyber-black transition-colors duration-300 relative">
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-[#F0F0F0] dark:bg-cyber-dark border-b border-[#CCCCCC] dark:border-[#2A2A30] z-30">
        {/* Top Bar */}
        <div className="h-14 border-b border-[#CCCCCC] dark:border-[#2A2A30] flex items-center justify-between px-4">
          <button
            onClick={onBackClick}
            className="p-2 hover:bg-terminal-light dark:hover:bg-cyber-gray rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSectionMenuOpen(!isSectionMenuOpen)}
              className="px-3 py-1.5 bg-slate-300 dark:bg-slate-600 text-gray-700 dark:text-terminal-white text-sm rounded-lg font-quicksand"
            >
              OUTLINE
            </button>
          </div>
        </div>

        {/* Section Menu Dropdown */}
        {isSectionMenuOpen && (
          <div className="border-b border-[#CCCCCC] dark:border-[#2A2A30] bg-[#F0F0F0] dark:bg-cyber-dark mx-4">
            <div className="max-h-[50vh] overflow-y-auto">
              <DocumentSectionsPanel 
                userId={userId} 
                conversationId={conversationId}
                isArchiveView={isArchiveView}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout with 3-column grid */}
      <div 
        className="hidden sm:grid w-full" 
        style={{ 
          gridTemplateColumns: `${LEFT_COLUMN_WIDTH}% ${CENTER_COLUMN_WIDTH}% ${RIGHT_COLUMN_WIDTH}%`,
          paddingLeft: `${LEFT_PAGE_MARGIN}%` // Apply left margin to the entire layout
        }}
      >
        {/* Left Panel - Document Sections */}
        <div className="p-4 pt-14">
          <DocumentSectionsPanel 
            userId={userId}
            conversationId={conversationId}
            isArchiveView={isArchiveView}
          />
        </div>

        {/* Center Content */}
        <div className="relative">
          {/* Desktop Toolbar - Full Width */}
          <div className="fixed top-0 left-0 right-0 z-20">
            <Toolbar 
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              isHighlightMode={isHighlightMode}
              onHighlightToggle={() => setIsHighlightMode(!isHighlightMode)}
              highlightColor={highlightColor}
              onColorChange={setHighlightColor}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPrint={handlePrint}
              onSavePDF={handleSaveAsPDF}
            />
          </div>

          {ContextMenuComponent}
          
          {/* Main Content */}
          <div 
            ref={scrollContainerRef}
            className="overflow-auto pt-14 pb-10 h-screen"
            style={{ 
              paddingLeft: `${HORIZONTAL_MARGIN_PERCENTAGE}%`, 
              paddingRight: `${HORIZONTAL_MARGIN_PERCENTAGE}%` 
            }}
            onContextMenu={handleContextMenu}
          >
            <div 
              ref={contentRef}
              className={`mx-auto p-4 sm:p-8 bg-[#F0F0F0] dark:bg-cyber-dark border border-[#CCCCCC] dark:border-[#2A2A30] rounded-lg prose markdown-content transform origin-top transition-transform duration-200 ${
                isDarkMode ? 'dark:bg-cyber-dark dark:prose-invert' : ''
              }`}
              style={{ 
                transform: `scale(${zoom / 100})`,
                width: `${CONTENT_WIDTH_PERCENTAGE}%`,
                maxWidth: '980px'
              }}
            >
              {isLoading ? (
                <LoadingState />
              ) : (
                <>
                  <ReactMarkdown
                    children={processedContent}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[
                      rehypeHighlight,
                      [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
                      rehypeRaw
                    ]}
                    className="font-quicksand generated-content"
                  />

                  {!isComplete && !isArchiveView && (
                    <div className="mt-8 space-y-4">
                      <div className="h-4 sm:h-6 bg-slate-300 dark:bg-slate-600 rounded-md overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 animate-sweep" />
                      </div>
                      <div className="h-4 sm:h-6 bg-slate-300 dark:bg-slate-600 rounded-md overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 animate-sweep" />
                      </div>
                      <div className="h-4 sm:h-6 bg-slate-300 dark:bg-slate-600 rounded-md overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 animate-sweep" />
                      </div>
                    </div>
                  )}

                  {/* Render diagram only when content is complete */}
                  {isComplete && userId && conversationId && (
                    <DiagramRenderer 
                      userId={userId}
                      conversationId={conversationId}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Tabbed Interface */}
        <div className="p-4 pt-14">
          <RightSidePanel selectedConcept={selectedConcept} />
        </div>
      </div>

      {/* Mobile Content View */}
      <div 
        className="sm:hidden flex-1 overflow-auto pb-10 pt-14"
        style={{ 
          paddingLeft: `${HORIZONTAL_MARGIN_PERCENTAGE + LEFT_PAGE_MARGIN}%`, // Add both margins for mobile
          paddingRight: `${HORIZONTAL_MARGIN_PERCENTAGE}%` 
        }}
      >
        <div 
          ref={contentRef}
          className={`mx-auto p-4 bg-[#F0F0F0] dark:bg-cyber-dark border border-[#CCCCCC] dark:border-[#2A2A30] rounded-lg prose markdown-content transform origin-top transition-transform duration-200 ${
            isDarkMode ? 'dark:bg-cyber-dark dark:prose-invert' : ''
          }`}
          style={{ 
            transform: `scale(${zoom / 100})`,
            width: `${CONTENT_WIDTH_PERCENTAGE}%`,
            maxWidth: '980px'
          }}
          onContextMenu={handleContextMenu}
        >
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <ReactMarkdown
                children={processedContent}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                  rehypeHighlight,
                  [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
                  rehypeRaw
                ]}
                className="font-quicksand generated-content"
              />

              {!isComplete && !isArchiveView && (
                <div className="mt-8 space-y-4">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded-md overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 animate-sweep" />
                  </div>
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded-md overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 animate-sweep" />
                  </div>
                </div>
              )}

              {isComplete && userId && conversationId && (
                <DiagramRenderer 
                  userId={userId}
                  conversationId={conversationId}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F0F0F0] dark:bg-cyber-dark border-t border-[#CCCCCC] dark:border-[#2A2A30] px-2 sm:px-4 py-2 text-gray-600 dark:text-gray-300 z-20 markdown-bottom-bar font-quicksand">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
            <div>Reading time: {readingTimeMinutes} min</div>
            <div>Words: {wordCount.toLocaleString()}</div>
            <div>Characters: {charCount.toLocaleString()}</div>
          </div>
          <div className="text-xs sm:text-sm">Zoom: {zoom}%</div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewerBase;