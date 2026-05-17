import React, { useState, useEffect } from 'react';
import { X, CalendarBlank, Clock, Users, FilePdf, Eye, WarningCircle, FileDashed, Info } from '@phosphor-icons/react';
import { formatDate, formatTime } from '../../../shared/utils/format';

export default function ValidationActionModal({ 
  isOpen, 
  onClose, 
  booking, 
  onSubmit, 
  onViewPDF, 
  userMap = {}, 
  facilityMap = {} 
}) {
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form setiap kali modal dibuka untuk booking baru
  useEffect(() => {
    if (isOpen) {
      setShowRejectPrompt(false);
      setRejectionReason('');
      setIsSubmitting(false);
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(booking.id, 'approved', '');
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(booking.id, 'rejected', rejectionReason);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const userName = userMap[booking.user_id] || `User ID: ${booking.user_id}`;
  const facilityName = facilityMap[booking.facility_id] || `Fasilitas ID: ${booking.facility_id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-slide-up relative my-auto">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Info size={20} weight="bold" />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Tinjauan Peminjaman</h2>
          </div>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Konten Utama - Grid Layout */}
        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri: Informasi Peminjam & Reservasi (1/3) */}
            <div className="space-y-8 lg:pr-6 lg:border-r border-slate-100">
              
              {/* Informasi Peminjam */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">Informasi Peminjam</h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="font-bold text-slate-800 text-base">{userName}</p>
                  <p className="text-sm text-slate-500 mt-0.5">Civitas Akademika IPB</p>
                </div>
              </div>

              {/* Detail Reservasi */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">Detail Reservasi</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Ruangan / Fasilitas</p>
                    <p className="font-bold text-primary text-sm bg-primary/5 inline-block px-2.5 py-1 rounded-md">{facilityName}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Tujuan Penggunaan</p>
                    <p className="font-medium text-slate-700 text-sm">{booking.purpose}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-start gap-2">
                      <CalendarBlank size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tanggal</p>
                        <p className="font-semibold text-slate-700 text-sm mt-0.5">{formatDate(booking.date_of_booking)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Waktu</p>
                        <p className="font-semibold text-slate-700 text-sm mt-0.5">{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Users size={18} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Peserta</p>
                        <p className="font-semibold text-slate-700 text-sm mt-0.5">{booking.number_of_attendees} Orang</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kebutuhan Tambahan (Jika ada) */}
              {booking.extra_items && booking.extra_items.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">Kebutuhan Tambahan</h3>
                  <ul className="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    {booking.extra_items.map((ei, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex justify-between items-center border-b border-slate-200/50 last:border-0 pb-2 last:pb-0">
                        <span className="font-medium">{ei.item?.name || `Item #${ei.item_id}`}</span>
                        <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-xs">{ei.quantity} Unit</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Kolom Kanan: Dokumen Viewer & Actions (2/3) */}
            <div className="lg:col-span-2 flex flex-col min-h-[400px]">
              <h3 className="text-xs font-bold text-slate-400 mb-3 tracking-wider uppercase">Dokumen Pendukung</h3>
              
              <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-center relative group">
                {booking.document_url ? (
                  <>
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-sm border border-red-100">
                      <FilePdf size={40} weight="fill" />
                    </div>
                    <p className="text-slate-800 font-bold mb-2">Dokumen_Peminjaman_{booking.id}.pdf</p>
                    <p className="text-sm text-slate-500 mb-6">Klik tombol di bawah untuk meninjau secara penuh.</p>
                    <button 
                      onClick={() => onViewPDF && onViewPDF(booking.id)}
                      className="px-5 py-2.5 bg-white border border-slate-200 shadow-sm rounded-btn text-sm font-bold text-primary hover:bg-slate-50 hover:border-primary/30 transition-all flex items-center gap-2 z-10"
                    >
                      <Eye size={18} weight="bold" /> Buka Dokumen PDF
                    </button>
                  </>
                ) : (
                  <>
                    <FileDashed size={48} className="text-slate-300 mb-4" weight="light" />
                    <p className="text-slate-500 font-medium">Pemohon tidak melampirkan dokumen pendukung.</p>
                  </>
                )}
              </div>
              
              {/* Bottom Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => setShowRejectPrompt(true)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-bold text-danger bg-red-50 hover:bg-red-100 rounded-btn transition-colors"
                >
                  Tolak Permohonan
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-container rounded-btn shadow-md shadow-primary/20 transition-all active:scale-95"
                >
                  {isSubmitting ? 'Memproses...' : 'Setujui Permohonan'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Rejection Flow Overlay (Fallback Prompt) */}
        {showRejectPrompt && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-slide-up">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <WarningCircle size={24} className="text-danger" weight="fill" />
                  Tolak Permohonan?
                </h3>
                <button 
                  onClick={() => setShowRejectPrompt(false)} 
                  disabled={isSubmitting}
                  className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-full"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>
              
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Anda akan menolak permohonan peminjaman ini secara permanen. Mohon berikan <strong>alasan penolakan</strong> untuk dikirimkan kepada peminjam.
              </p>
              
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-danger focus:border-danger outline-none transition-all resize-none h-32 text-sm mb-6"
                placeholder="Tuliskan alasan penolakan secara spesifik..."
                required
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectPrompt(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-btn transition-colors"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectionReason.trim()}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-danger hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-btn shadow-md transition-all active:scale-95 flex items-center justify-center min-w-[140px]"
                >
                  {isSubmitting ? 'Memproses...' : 'Konfirmasi Tolak'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
