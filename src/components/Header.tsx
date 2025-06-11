import { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { SignInModal } from './SignInModal';
import { UserMenu } from './UserMenu';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudUpload className="text-blue-600 h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <span className="text-blue-600">Sky</span>
            <span className="text-slate-800">Drop</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-slate-600 hover:text-blue-600 transition-colors">
            Documentation
          </button>
          
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <button 
              onClick={() => setIsSignInModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </header>
  );
}
