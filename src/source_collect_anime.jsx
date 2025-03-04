import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './LeftSidebar';

const funFacts = [
  "Light takes 8 minutes and 20 seconds to travel from the Sun to Earth.",
  "Your brain generates about 20 watts of power—enough to power a dim light bulb!",
  "A teaspoon of a neutron star weighs about 6 billion tons.",
  "Water can boil and freeze at the same time under special conditions.",
  "Octopuses have three hearts and blue blood.",
  "Time moves slower in stronger gravitational fields—a concept known as time dilation.",
  "The human body contains around 37.2 trillion cells.",
  "A day on Venus is longer than a year on Venus."
];

// Loading dots component
const LoadingDots = () => (
  <div className="flex justify-center space-x-2">
    {[...Array(5)].map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          index === 0 ? 'bg-neon-green dark:bg-neon-green' : 'bg-gray-200 dark:bg-cyber-gray'
        }`}
      />
    ))}
  </div>
);

const SearchLoadingScreen = () => {
  const [currentFact, setCurrentFact] = useState(funFacts[0]);
  const [dots, setDots] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 3000);

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => {
      clearInterval(factInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-terminal-white dark:bg-cyber-black transition-colors duration-300">
      {/* Add SidebarTrigger */}
      <SidebarTrigger 
        onHomeClick={() => navigate('/')}
        onProfileClick={() => navigate('/profile')}
        onArchivesClick={() => navigate('/archive')}
        onUploadClick={() => navigate('/upload')}
      />
      
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-3xl space-y-16">
          {/* Search Box */}
          <div className="relative">
            <div className="terminal-input terminal-prompt w-full h-16 pl-14 pr-16 text-xl flex items-center text-gray-900 dark:text-terminal-white">
              <Search className="absolute left-4 w-6 h-6 text-gray-400 dark:text-gray-500" />
              <span className="terminal-cursor font-space-mono">Collecting Sources{dots}</span>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gray-900 dark:bg-neon-green dark:text-cyber-black text-white rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </div>
          </div>

          {/* Loading Dots */}
          <LoadingDots />

          {/* Fun Fact Box */}
          <div className="cyber-card p-8">
            <div className="mb-4">
              <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm font-medium font-space-mono">Research Insight</span>
            </div>
            <p className="text-gray-600 dark:text-terminal-silver text-lg font-light leading-relaxed transition-all duration-500 ease-in-out font-sora">
              {currentFact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingScreen;