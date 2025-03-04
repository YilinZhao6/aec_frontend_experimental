import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const ConceptExplanationPopup = ({ concept, position, onClose, isMobile = false }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, generate a placeholder explanation based on the concept
        const placeholderExplanations = {
          'randomness': 'In the context of differential privacy, randomness refers to the deliberate introduction of statistical noise or perturbation to data or query results. This randomization is a fundamental technique used to protect individual privacy while still allowing useful aggregate information to be extracted. The carefully calibrated random noise ensures that the presence or absence of any single individual in the dataset cannot be reliably determined from the output.',
          'carefully calibrated noise': 'In differential privacy, "carefully calibrated noise" refers to the precise amount of random perturbation added to query results or data. This noise is mathematically determined based on the sensitivity of the query (how much a single record can affect the result) and the desired privacy guarantee level (epsilon). The calibration ensures that privacy is protected while maintaining maximum possible utility of the data for analysis purposes.'
        };
        
        // Check if we have a predefined explanation, otherwise generate a generic one
        const explanation = placeholderExplanations[concept.toLowerCase()] || 
          `${concept} is a key concept in this context. It refers to a specific technique or principle that plays an important role in the overall system or framework being discussed. Understanding this concept is essential for grasping the broader implications of the subject matter.`;
        
        setExplanation(explanation);
      } catch (err) {
        console.error('Error fetching concept explanation:', err);
        setError('Failed to load explanation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [concept]);

  // Adjust position for mobile
  const popupStyle = isMobile 
    ? {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '400px',
        zIndex: 1000
      }
    : {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
        maxWidth: 'calc(100vw - 40px)',
        zIndex: 1000
      };

  return (
    <div 
      className="concept-popup bg-white dark:bg-cyber-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
      style={popupStyle}
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-cyber-gray rounded-t-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white">{concept}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 max-h-[300px] overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin mr-2" />
            <span className="text-gray-600 dark:text-gray-300">Loading explanation...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400">{error}</div>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300 font-quicksand leading-relaxed">
            {explanation}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConceptExplanationPopup;