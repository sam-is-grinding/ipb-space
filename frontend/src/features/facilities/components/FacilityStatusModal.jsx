import React, { useState, useEffect } from 'react';
import { X, Info, FloppyDisk } from '@phosphor-icons/react';

export default function FacilityStatusModal({ isOpen, onClose, facility, onSave }) {
  const [status, setStatus] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && facility) {
      setStatus(facility.condition || 'Good');
      setConditionNotes('');
      setIsSubmitting(false);
    }
  }, [isOpen, facility]);

  if (!isOpen || !facility) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(facility.id, status, conditionNotes);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#02275D]/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-slate-800">Ubah Status Ruangan</h2>
            <p className="text-xs font-bold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded mt-1 w-max">
              {facility.name}
            </p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-amber-50 rounded-lg border border-amber-100 p-4 flex gap-3 items-start">
            <Info size={20} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-amber-800 leading-relaxed">
              Mengubah status menjadi <strong className="font-bold">Maintenance</strong> akan mengunci seluruh jadwal peminjaman baru untuk fasilitas ini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kondisi Fasilitas</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-accent focus:border-accent p-3 outline-none transition-all cursor-pointer"
              >
                <option value="Good">Tersedia (Good)</option>
                <option value="In Use">Sedang Digunakan (In Use)</option>
                <option value="Maintenance">Dalam Perawatan (Maintenance)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Catatan Kondisi <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="Tuliskan catatan detail jika ruangan mengalami kerusakan..."
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all resize-none h-24 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-container disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[170px]"
              >
                {isSubmitting ? (
                  'Menyimpan...'
                ) : (
                  <>
                    <FloppyDisk size={18} weight="bold" /> Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
