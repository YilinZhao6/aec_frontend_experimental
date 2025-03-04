import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';

/**
 * ConceptsPanel component
 * Displays explanations for selected concepts
 */
const ConceptsPanel = ({ concept }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!concept) return;

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

  if (!concept) {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-quicksand">
            Select a concept to show explanation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white font-quicksand">{concept}</h3>
        <div className="w-16 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"></div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-gray-500 animate-spin mr-2" />
          <span className="text-gray-600 dark:text-gray-300 font-quicksand">Loading explanation...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 font-quicksand">
          {error}
        </div>
      ) : (
        <div className="max-w-none font-quicksand">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConceptsPanel;