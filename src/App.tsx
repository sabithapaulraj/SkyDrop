import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { Header } from './components/Header';
import { UploadContainer } from './components/UploadContainer';
import { AuthProvider } from './context/AuthContext';

export function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <UploadContainer />
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
