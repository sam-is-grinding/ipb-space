import React, { useState } from 'react';
import { House, Compass, CalendarBlank } from '@phosphor-icons/react';
import logoIPBSpace from '../../../assets/icons/logo.png';

export default function PublicLayout({ children }) {
  const [activeTab, setActiveTab] = useState('beranda');

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Top Navbar (Desktop) */}
      <nav className="sticky top-0 z-50 hidden md:flex items-center justify-between px-8 py-5 bg-primary-container border-b border-primary/20 shadow-lg">
        <div className="flex-shrink-0 flex items-center gap-4">
          <div className="bg-white p-0.5 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <img src={logoIPBSpace} alt="IPB Space" className="h-12 md:h-14 drop-shadow-md" />
          </div>
          <span className="text-2xl md:text-4xl font-black text-white tracking-tighter italic">IPB Space</span>
        </div>
        
        <div className="flex gap-12">
          <a href="#beranda" className="text-white hover:text-secondary-container text-xl font-bold transition-all hover:scale-105">Beranda</a>
          <a href="#eksplorasi" className="text-blue-100/70 hover:text-white text-xl font-bold transition-all hover:scale-105">Eksplorasi</a>
          <a href="#kalender" className="text-blue-100/70 hover:text-white text-xl font-bold transition-all hover:scale-105">Kalender Publik</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 text-white font-semibold hover:text-secondary-container transition-colors">
            Daftar
          </button>
          <button className="px-6 py-2.5 bg-accent text-white rounded-btn font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            Masuk
          </button>
        </div>
      </nav>

      {/* Top Navbar (Mobile) */}
      <nav className="sticky top-0 z-50 flex md:hidden items-center justify-between px-4 py-3 bg-primary-container border-b border-primary shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <img src={logoIPBSpace} alt="IPB Space" className="h-7" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight italic">IPB Space</span>
        </div>
        <button className="bg-accent text-white px-4 py-1.5 rounded-btn text-sm font-bold shadow-lg">
          Masuk
        </button>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-0 flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navbar (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container/95 backdrop-blur-xl border-t border-blue-200 flex md:hidden pb-safe shadow-[0_-4px_20px_rgba(2,39,93,0.1)]">
        <button 
          onClick={() => setActiveTab('beranda')}
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${activeTab === 'beranda' ? 'text-primary-container' : 'text-blue-900/40'}`}
        >
          <House size={24} weight={activeTab === 'beranda' ? 'fill' : 'regular'} />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Beranda</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('eksplorasi')}
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${activeTab === 'eksplorasi' ? 'text-primary-container' : 'text-blue-900/40'}`}
        >
          <Compass size={24} weight={activeTab === 'eksplorasi' ? 'fill' : 'regular'} />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">Eksplorasi</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('kalender')}
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${activeTab === 'kalender' ? 'text-primary-container' : 'text-blue-900/40'}`}
        >
          <CalendarBlank size={24} weight={activeTab === 'kalender' ? 'fill' : 'regular'} />
          <span className="text-[10px] mt-1 font-bold uppercase tracking-wider text-center leading-tight">Kalender</span>
        </button>
      </nav>
    </div>
  );
}
