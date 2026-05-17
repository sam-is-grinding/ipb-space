import React from 'react';
import { X, CheckCircle, XCircle, ClockCounterClockwise, MapPin } from '@phosphor-icons/react';
import { useValidationLookup } from '../hooks/useValidationLookup';

export default function BookingHistoryDetailModal({ isOpen, onClose, booking }) {
  // Inherit the global lookup for this component to parse user and facility IDs
  const { facilityMap, userMap } = useValidationLookup();

  if (!isOpen || !booking) return null;

  const status = (booking.status || '').toLowerCase();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02275D]/45 backdrop-blur-[4px] animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Detail Riwayat Reservasi</h2>
            <p className="text-xs font-bold text-primary bg-primary/10 inline-block px-2.5 py-0.5 rounded-md mt-1.5 w-max">
              Ref ID: #BKG-{booking.id}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors active:scale-95"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 max-h-[70vh] overflow-y-auto">
          
          {/* Dynamic Status Banner */}
          {status === 'rejected' && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-4 flex gap-3.5 items-start shadow-sm">
              <XCircle size={24} weight="fill" className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-800 mb-1">Permohonan Ditolak</h4>
                <p className="text-sm font-medium text-red-700 leading-relaxed">
                  Alasan: Jadwal bentrok dengan agenda utama universitas. Pemohon telah diinformasikan melalui sistem.
                </p>
              </div>
            </div>
          )}

          {status === 'approved' && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4 flex gap-3.5 items-start shadow-sm">
              <CheckCircle size={24} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-800 mb-1">Permohonan Disetujui</h4>
                <p className="text-sm font-medium text-emerald-700 leading-relaxed">
                  Dokumen digital izin penggunaan ruangan telah diterbitkan dan dapat diakses oleh pemohon.
                </p>
              </div>
            </div>
          )}

          {/* Grid Information Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Pemohon */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Informasi Pemohon</h3>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Nama Lengkap</p>
                <p className="text-sm font-bold text-slate-800">{userMap[booking.user_id] || `Memuat...`}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Identitas ID</p>
                <p className="text-sm font-bold text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded w-max">{booking.user_id}</p>
              </div>
            </div>

            {/* Right Column: Reservasi */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Detail Reservasi</h3>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Fasilitas Ruangan</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary" weight="fill" />
                  {facilityMap[booking.facility_id] || `Memuat...`}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Tanggal Pelaksanaan</p>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <ClockCounterClockwise size={16} className="text-accent" weight="fill" />
                  {new Date(booking.start_time || booking.created_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Agenda Utama</p>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                  {booking.purpose || '-'}
                </p>
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer Actions */}
        <div className="bg-white border-t border-slate-100 p-5 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all active:scale-95 text-sm"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
}
