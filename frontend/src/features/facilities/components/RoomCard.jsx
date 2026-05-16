import React from 'react';
import { Users, Info } from '@phosphor-icons/react';

export default function RoomCard({ id, name, capacity, status, imageUrl }) {
  return (
    <div className="bg-white rounded-card shadow-ambient overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
      <div 
        className="h-48 w-full bg-gray-200 bg-cover bg-center flex-shrink-0" 
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
      ></div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-primary mb-2">{name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-auto">
          <Users size={18} className="mr-2" />
          <span>{capacity} Orang</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className={`text-xs font-bold px-2 py-1 rounded w-max ${status === 'Tersedia' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
          </span>
          <button 
            onClick={() => console.log('View detail ID:', id)}
            className="text-accent text-sm font-semibold hover:text-secondary-container flex items-center transition-colors"
          >
            <Info size={16} className="mr-1" weight="bold" /> Lihat Detail
          </button>
        </div>
      </div>
    </div>
  );
}
