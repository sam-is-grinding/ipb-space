import React, { useState } from 'react';
import RoomCard from '../components/RoomCard';
import Input from '../../../shared/components/ui/Input/Input';
import { useFacilities } from '../hooks/useFacilities';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { isFacilityAvailable } from '../../../shared/constants/facility';

export default function FacilityCatalog() {
  const { facilities, loading, error } = useFacilities();
  const [searchTerm, setSearchTerm] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredFacilities = facilities.filter(f => {
    const matchesName = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity = minCapacity ? f.capacity >= parseInt(minCapacity, 10) : true;
    const isAvailable = isFacilityAvailable(f);
    const matchesStatus = statusFilter === 'all' ? true : (statusFilter === 'available' ? isAvailable : !isAvailable);
    return matchesName && matchesCapacity && matchesStatus;
  });

  return (
    <>
      <div className="bg-surface py-8 px-4 md:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto mt-2 md:mt-4">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-primary font-black text-3xl md:text-4xl drop-shadow-sm">Eksplorasi Fasilitas</h1>
            <p className="text-gray-500 mt-1 text-base md:text-lg">Temukan ruangan terbaik untuk kebutuhan kegiatan Anda.</p>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-[1.5rem] shadow-ambient mb-8 flex flex-col md:flex-row gap-4 items-center border border-gray-100">
            <div className="flex-[2] w-full relative">
              <input 
                type="text"
                placeholder="Cari nama gedung atau ruangan..." 
                className="w-full rounded-btn border border-gray-200 pl-5 pr-12 py-2.5 focus:outline-none focus:border-accent text-on-surface bg-surface-lowest shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MagnifyingGlass size={20} weight="bold" />
              </div>
            </div>
            <div className="flex-1 w-full">
              <input 
                type="number"
                placeholder="Min Kapasitas"
                className="w-full rounded-btn border border-gray-200 px-4 py-2.5 focus:outline-none focus:border-accent text-on-surface bg-surface-lowest shadow-inner"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
              />
            </div>
            <div className="flex-1 w-full">
              <select 
                className="w-full rounded-btn border border-gray-200 px-4 py-2.5 focus:outline-none focus:border-accent text-on-surface bg-surface-lowest shadow-inner"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="maintenance">Perbaikan</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-gray-200 h-80 rounded-[1.5rem]"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-danger bg-error-container rounded-card border border-danger/20">
              <p className="font-bold">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFacilities.length > 0 ? (
                filteredFacilities.map((room) => (
                  <RoomCard 
                    key={room.id}
                    id={room.id}
                    name={room.name}
                    location={room.location}
                    capacity={room.capacity}
                    status={isFacilityAvailable(room) ? "Tersedia" : "Dalam Perbaikan"}
                    imageUrl={room.image_url}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-24 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                  <p className="text-gray-400 font-bold text-xl mb-2">Fasilitas Tidak Ditemukan</p>
                  <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian atau turunkan kapasitas minimum.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
