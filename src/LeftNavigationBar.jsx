import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  Library, 
  GraduationCap,
  Info,
  User,
  LogIn,
  LogOut,
  Home,
  Upload,
  X,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, ThemeToggle } from './ThemeProvider';

const InfoDialog = ({ onClose, buttonRect }) => {
  if (!buttonRect) return null;

  // Calculate position relative to the button, but offset upward
  const dialogStyle = {
    position: 'fixed',
    left: `${buttonRect.right + 8}px`,
    top: `${buttonRect.top - 180}px`, // Moved up by adjusting this value
  };

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[9999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="cyber-card w-64 p-4"
        style={dialogStyle}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-terminal-white mb-1">Join Our Community</h3>
            <a 
              href="https://discord.com/invite/tJZJBTPJ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#3A3A3A] hover:underline"
            >
              Join Discord
            </a>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-terminal-white mb-1">Contact Us/Open Positions</h3>
            <a 
              href="mailto:contact@hyperknow.io"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-terminal-white"
            >
              contact@hyperknow.io
            </a>
          </div>
          <div className="pt-2 border-t border-gray-100 dark:border-cyber-gray">
            <ThemeToggle className="w-full flex items-center justify-between p-2 rounded-md hover:bg-terminal-light dark:hover:bg-cyber-gray" />
          </div>
          <div className="pt-2 border-t border-gray-100 dark:border-cyber-gray">
            <span className="text-xs text-gray-500 dark:text-gray-400">Version: Public Beta 1.1</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Custom styled icon components
const StyledIcon = ({ icon: Icon, active, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-0 ${active ? 'bg-neon-blue dark:bg-neon-teal' : 'bg-transparent'} opacity-10 rounded-md`}></div>
      <Icon className={`w-5 h-5 ${active ? 'text-neon-blue dark:text-neon-teal' : 'text-[#3A3A3A]'} relative z-10`} />
      {active && (
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-neon-blue dark:bg-neon-teal rounded-r-md"></div>
      )}
    </div>
  );
};

const LeftNavigationBar = ({ onHomeClick, onProfileClick, onArchivesClick, onUploadClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    imageUrl: ''
  });
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoButtonRect, setInfoButtonRect] = useState(null);
  const infoButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const updateUserProfile = () => {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      setIsLoggedIn(true);
      const username = userEmail.split('@')[0];
      const firstLetter = username.charAt(0).toUpperCase();
      
      // Create different SVG for light/dark mode
      const svgBgColor = isDarkMode ? "#1A1A1F" : "#F0F0F0";
      const svgTextColor = "#3A3A3A";
      
      setUserProfile({
        name: username,
        imageUrl: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="141" height="141" xmlns="http://www.w3.org/2000/svg">
            <rect width="141" height="141" fill="${svgBgColor}"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                  font-family="Arial" font-size="70" fill="${svgTextColor}">${firstLetter}</text>
          </svg>
        `)}`
      });
    }
  };

  useEffect(() => {
    updateUserProfile();
    window.addEventListener('user-login', updateUserProfile);
    return () => window.removeEventListener('user-login', updateUserProfile);
  }, [isDarkMode]);

  const handleInfoClick = () => {
    if (infoButtonRef.current) {
      setInfoButtonRect(infoButtonRef.current.getBoundingClientRect());
    }
    setShowInfoDialog(!showInfoDialog);
  };

  const handleLogin = () => {
    updateUserProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setUserProfile({
      name: '',
      imageUrl: ''
    });
    onHomeClick();
  };

  // Fixed isActive function to correctly check the current path
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/profile' && location.pathname === '/profile') return true;
    if (path === '/archive' && location.pathname.includes('/archive')) return true;
    if (path === '/upload' && location.pathname === '/upload') return true;
    return false;
  };

  const NavButton = ({ icon, label, onClick, path }) => {
    const active = isActive(path);
    return (
      <button 
        onClick={onClick}
        className={`flex items-center py-2 px-4 w-full rounded-md transition-all duration-300 text-[#121212] dark:text-white hover:bg-[#E0E0E0] dark:hover:bg-[#2A2A30] hover:text-[#3A3A3A] ${
          active ? 'bg-[#E0E0E0] dark:bg-[#2A2A30]' : ''
        }`}
      >
        <StyledIcon icon={icon} active={active} className="mr-3" />
        <span className={`text-sm font-quicksand ${active ? 'font-medium' : ''}`}>{label}</span>
      </button>
    );
  };

  return (
    <nav className="w-56 h-screen bg-[#F0F0F0] dark:bg-cyber-dark border-r border-[#CCCCCC] dark:border-[#2A2A30] flex flex-col flex-shrink-0 transition-colors duration-300">

      
      {/* User Profile */}
      <div className="px-4 py-4 flex-shrink-0 border-b border-[#CCCCCC] dark:border-[#2A2A30]">
        {isLoggedIn ? (
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/user_info')}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#3A3A3A] transition-colors shadow-md">
              <img
                src={userProfile.imageUrl}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 text-left">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {userProfile.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Account</p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center w-full"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple dark:from-neon-teal dark:to-neon-blue flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Sign In</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Get started</p>
            </div>
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="mb-1 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Main
        </div>
        <NavButton icon={Home} label="Home" onClick={onHomeClick} path="/" />
        <NavButton icon={GraduationCap} label="Profile" onClick={onProfileClick} path="/profile" />
        <NavButton icon={Library} label="Archives" onClick={onArchivesClick} path="/archive" />
        <NavButton icon={Upload} label="Upload" onClick={onUploadClick} path="/upload" />
        
        <div className="my-1 border-t border-[#CCCCCC] dark:border-[#2A2A30]"></div>
        
        <div className="mb-1 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Support
        </div>
        <button 
          ref={infoButtonRef}
          onClick={handleInfoClick}
          className="flex items-center py-2 px-4 w-full rounded-md text-[#3A3A3A] hover:bg-[#E0E0E0] dark:hover:bg-[#2A2A30] transition-all duration-300"
        >
          <StyledIcon icon={HelpCircle} active={false} className="mr-3" />
          <span className="text-sm font-quicksand">Help & Info</span>
        </button>
        <button 
          onClick={() => navigate('/user_info')}
          className="flex items-center py-2 px-4 w-full rounded-md text-[#3A3A3A] hover:bg-[#E0E0E0] dark:hover:bg-[#2A2A30] transition-all duration-300"
        >
          <StyledIcon icon={Settings} active={false} className="mr-3" />
          <span className="text-sm font-quicksand">Settings</span>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-[#CCCCCC] dark:border-[#2A2A30]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ThemeToggle className="mr-2" />
            <span className="text-xs text-gray-500 dark:text-gray-400">v1.1</span>
          </div>
          
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="flex items-center p-2 rounded-md text-[#3A3A3A] hover:bg-[#E0E0E0] dark:hover:bg-[#2A2A30] transition-all duration-300"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {showInfoDialog && (
        <InfoDialog 
          onClose={() => setShowInfoDialog(false)} 
          buttonRect={infoButtonRect}
        />
      )}
    </nav>
  );
};

export default LeftNavigationBar;