import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2, Check } from 'lucide-react';

const SectionProgressMenu = ({ userId, conversationId, isArchiveView, isInPanel = false }) => {
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [outline, setOutline] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    let timeoutId;
    const fetchProgress = async () => {
      if (!userId || !conversationId) {
        console.log('Missing userId or conversationId');
        return;
      }

      try {
        const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_section_progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            conversation_id: conversationId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch progress');
        }

        const data = await response.json();
        
        if (data.outline) {
          setOutline(data.outline);
          if (!sections.length && data.outline.sections) {
            const initialSections = data.outline.sections.map(section => ({
              section_id: section.section_id,
              title: section.title,
              learning_goals: section.learning_goals,
              status: 'waiting'
            }));
            setSections(initialSections);
          }
        }

        if (data.sections && Array.isArray(data.sections)) {
          setSections(prevSections => {
            if (!prevSections.length) return data.sections;
            
            return prevSections.map(prevSection => {
              const updatedSection = data.sections.find(s => s.section_id === prevSection.section_id);
              return updatedSection || prevSection;
            });
          });
        }

        setError(null);

        if (!data.is_complete && !isArchiveView) {
          timeoutId = setTimeout(fetchProgress, 3000);
        }
      } catch (error) {
        console.error('Error fetching section progress:', error);
        setError(error.message);
        if (!isArchiveView) {
          timeoutId = setTimeout(fetchProgress, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isArchiveView || sections.length === 0) {
      setLoading(true);
      fetchProgress();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userId, conversationId, isArchiveView]);

  if (!userId || !conversationId) {
    return null;
  }

  if (loading && !outline) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 text-gray-400 dark:text-gray-500 animate-spin" />
          <span className="text-gray-600 dark:text-gray-300 font-quicksand">Loading outline...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 font-quicksand">
        Failed to load sections: {error}
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 font-quicksand">No sections available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {sections.map((section) => (
        <div key={section.section_id} className="mb-2 border border-[#CCCCCC] dark:border-[#2A2A30] rounded-lg overflow-hidden">
          <div 
            className="flex items-center p-3 bg-white dark:bg-cyber-gray cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A2A35]"
            onClick={() => toggleSection(section.section_id)}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 w-8">
              {section.status === 'waiting' && (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1 rounded">T</span>
                </div>
              )}
              {section.status === 'text_complete' && (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="ml-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-1 rounded">I</span>
                </div>
              )}
              {section.status === 'complete' && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </div>

            {/* Title and Expand Icon */}
            <span className="flex-1 text-sm text-gray-700 dark:text-terminal-silver ml-2 font-quicksand">{section.title}</span>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${
                expandedSections.has(section.section_id) ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Learning Goals */}
          {expandedSections.has(section.section_id) && section.learning_goals && section.learning_goals.length > 0 && (
            <div className="bg-gray-50 dark:bg-[#1E1E24] p-3 text-sm border-t border-[#CCCCCC] dark:border-[#2A2A30]">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 font-quicksand">Learning Goals:</div>
              <ul className="list-disc pl-4 space-y-1">
                {section.learning_goals.map((goal, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300 text-xs font-quicksand">{goal}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionProgressMenu;