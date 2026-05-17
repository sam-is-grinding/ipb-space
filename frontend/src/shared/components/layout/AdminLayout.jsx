import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { SignOut, Shield } from '@phosphor-icons/react';
import logoIPBSpace from '../../../assets/icons/logo.png';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-primary-container border-b border-primary/20 shadow-lg text-white">
        <div className="flex items-center gap-4">
          <Link to="/" className="bg-white p-0.5 rounded-xl border border-white/20 overflow-hidden hover:scale-105 transition-all">
            <img src={logoIPBSpace} alt="IPB Space" className="h-9 drop-shadow-md" />
          </Link>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight italic leading-none">IPB Space</span>
            <span className="text-[10px] text-accent font-bold tracking-widest uppercase mt-0.5 flex items-center gap-0.5">
              <Shield size={10} weight="fill" /> Admin Panel
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-bold text-white leading-none">{user?.fullname || 'Admin'}</p>
            <p className="text-[10px] text-blue-200 uppercase font-semibold tracking-wider mt-0.5">
              {user?.role === 'admin' ? 'Super Admin' : 'Facility Admin'}
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-accent text-white rounded-btn font-bold hover:scale-105 transition-all shadow-md text-xs flex items-center gap-1.5"
          >
            <SignOut size={14} weight="bold" />
            Keluar
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
