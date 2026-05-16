import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Compass, CalendarBlank } from '@phosphor-icons/react';
import logoIPBSpace from '../../../assets/icons/logo.png';

export default function PublicLayout({ children }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Top Navbar (Desktop) */}
      <nav className="sticky top-0 z-50 hidden md:flex items-center justify-between px-8 py-5 bg-primary-container border-b border-primary/20 shadow-lg">
        <div className="flex-shrink-0 flex items-center gap-4">
          <div className="bg-white p-0.5 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <img src={logoIPBSpace} alt="IPB Space" className="h-11 md:h-12 drop-shadow-md" />
          </div>
          <span className="text-xl md:text-4xl font-black text-white tracking-tighter italic">IPB Space</span>
        </div>
        
        <div className="flex gap-2 bg-blue-900/20 p-1.5 rounded-full border border-white/5">
          <Link 
            to="/" 
            className={`px-6 py-2 rounded-full text-base font-bold transition-all ${
              path === '/' 
                ? 'bg-white text-primary-container shadow-lg scale-105' 
                : 'text-blue-100/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Beranda
          </Link>
          <Link 
            to="/eksplorasi" 
            className={`px-6 py-2 rounded-full text-base font-bold transition-all ${
              path.startsWith('/eksplorasi') 
                ? 'bg-white text-primary-container shadow-lg scale-105' 
                : 'text-blue-100/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Eksplorasi
          </Link>
          <Link 
            to="/kalender" 
            className={`px-6 py-2 rounded-full text-base font-bold transition-all ${
              path.startsWith('/kalender') 
                ? 'bg-white text-primary-container shadow-lg scale-105' 
                : 'text-blue-100/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Kalender Publik
          </Link>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/register" className="px-4 py-2 text-white font-semibold hover:text-secondary-container transition-colors text-base">
            Daftar
          </Link>
          <Link to="/login" className="px-7 py-2.5 bg-accent text-white rounded-btn font-bold hover:scale-105 transition-all shadow-lg text-base">
            Masuk
          </Link>
        </div>
      </nav>

      {/* Top Navbar (Mobile) */}
      <nav className="sticky top-0 z-50 flex md:hidden items-center justify-between px-4 py-2 bg-primary-container border-b border-primary shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <img src={logoIPBSpace} alt="IPB Space" className="h-7" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight italic">IPB Space</span>
        </div>
        <Link to="/login" className="bg-accent text-white px-4 py-1.5 rounded-btn text-sm font-bold shadow-lg">
          Masuk
        </Link>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0 flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navbar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 backdrop-blur-xl border-t border-blue-200 flex md:hidden pb-safe shadow-[0_-4px_20px_rgba(2,39,93,0.1)]">
        <Link 
          to="/"
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all ${path === '/' ? 'text-primary-container scale-110' : 'text-blue-900/40'}`}
        >
          <House size={24} weight={path === '/' ? 'fill' : 'regular'} />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Beranda</span>
          {path === '/' && <div className="w-1 h-1 bg-primary-container rounded-full mt-0.5"></div>}
        </Link>
        
        <Link 
          to="/eksplorasi"
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all ${path.startsWith('/eksplorasi') ? 'text-primary-container scale-110' : 'text-blue-900/40'}`}
        >
          <Compass size={24} weight={path.startsWith('/eksplorasi') ? 'fill' : 'regular'} />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Eksplorasi</span>
          {path.startsWith('/eksplorasi') && <div className="w-1 h-1 bg-primary-container rounded-full mt-0.5"></div>}
        </Link>
        
        <Link 
          to="/kalender"
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all ${path.startsWith('/kalender') ? 'text-primary-container scale-110' : 'text-blue-900/40'}`}
        >
          <CalendarBlank size={24} weight={path.startsWith('/kalender') ? 'fill' : 'regular'} />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-wider text-center leading-tight">Kalender</span>
          {path.startsWith('/kalender') && <div className="w-1 h-1 bg-primary-container rounded-full mt-0.5"></div>}
        </Link>
      </nav>
    </div>
  );
}
