import { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  
  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!user) return null;
  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`}
          alt={user.name}
          className="h-8 w-8 rounded-full"
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn">
          <div className="p-3 border-b border-slate-200">
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          
          <div className="py-1">
            <button
              className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </button>
            
            <button
              className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
          
          <div className="py-1 border-t border-slate-200">
            <button
              onClick={signOut}
              className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
