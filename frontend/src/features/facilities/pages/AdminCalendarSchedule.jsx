import React, { useState, useEffect } from 'react';
import { CaretLeft, CaretRight, CalendarBlank } from '@phosphor-icons/react';
import { bookingService } from '../../bookings/services/bookingService';
import { useValidationLookup } from '../hooks/useValidationLookup';
import { toast } from 'react-hot-toast';

export default function AdminCalendarSchedule() {
  // --- Phase 1: State Engine ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventsMap, setEventsMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { facilityMap } = useValidationLookup();

  useEffect(() => {
    let isMounted = true;
    
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await bookingService.getAllBookings();
        if (isMounted) {
          const all = res.data?.items || res.items || res.data || [];
          
          // Group by date YYYY-MM-DD
          const grouped = {};
          all.forEach(b => {
            if (!b.start_time && !b.date_of_booking) return;
            const dateObj = new Date(b.start_time || b.date_of_booking);
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;
            
            if (!grouped[dateStr]) grouped[dateStr] = [];
            grouped[dateStr].push(b);
          });
          
          setEventsMap(grouped);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          toast.error("Gagal memuat jadwal peminjaman.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchBookings();
    return () => { isMounted = false; };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayNamesShort = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // --- Phase 1: Navigation Logic ---
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  // --- Phase 1: Grid Matrix Calculation ---
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous Month Faded Dates
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  // Current Month Dates
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      dayNum: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }

  // Next Month Faded Dates to pad matrix
  const totalSlots = calendarDays.length > 35 ? 42 : 35;
  const nextMonthDays = totalSlots - calendarDays.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    calendarDays.push({
      dayNum: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  return (
    <div className="flex-grow p-4 md:p-8 bg-[#F4F7FB] min-h-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-primary mb-1">Kalender Jadwal</h1>
        <p className="text-slate-500 text-sm font-medium">Pantau pemanfaatan fasilitas dan ketersediaan ruangan harian.</p>
      </div>

      {/* Calendar Engine Header */}
      <div className="bg-white p-4 md:p-6 rounded-t-2xl border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGoToToday}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-colors border border-slate-200 shadow-sm active:scale-95"
          >
            <CalendarBlank size={18} weight="bold" />
            Bulan Ini
          </button>
        </div>

        {/* Dynamic Header Text */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrevMonth}
            className="p-2.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-600 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-90"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          
          <h2 className="text-xl font-black text-slate-800 tracking-wide w-56 text-center uppercase">
            {monthNames[month]} {year}
          </h2>

          <button 
            onClick={handleNextMonth}
            className="p-2.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-600 rounded-xl transition-all border border-slate-200 shadow-sm active:scale-90"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
        
        {/* Placeholder for future tools */}
        <div className="hidden md:block w-[120px]"></div>
      </div>

      {/* Calendar Grid Matrix */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {dayNamesShort.map((day, idx) => (
            <div key={idx} className="py-3.5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div className={`grid grid-cols-7 ${calendarDays.length === 42 ? 'grid-rows-6' : 'grid-rows-5'} border-l border-slate-100`}>
          {calendarDays.map((cell, idx) => {
            const today = new Date();
            const isToday = cell.date.getDate() === today.getDate() && 
                            cell.date.getMonth() === today.getMonth() && 
                            cell.date.getFullYear() === today.getFullYear();
                            
            const cellDateStr = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, '0')}-${String(cell.date.getDate()).padStart(2, '0')}`;
                            
            return (
              <div 
                key={idx} 
                className={`min-h-[120px] md:min-h-[150px] p-2 md:p-3 border-r border-b border-slate-100 transition-colors ${!cell.isCurrentMonth ? 'bg-slate-50/40 text-slate-400' : 'bg-white text-slate-700 hover:bg-slate-50/50'}`}
              >
                <div className="flex justify-end items-start mb-1">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-black ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-110' : cell.isCurrentMonth ? 'text-slate-700' : 'text-slate-300'}`}>
                    {cell.dayNum}
                  </span>
                </div>
                
                {/* Phase 2: Event Pills Injection Zone */}
                <div className="mt-1 space-y-1.5 overflow-hidden">
                  {eventsMap[cellDateStr]?.map((ev, i) => {
                    const status = (ev.status || '').toLowerCase();
                    const purpose = (ev.purpose || '').toLowerCase();
                    const isMaintenance = status === 'maintenance' || purpose.includes('maintenance');
                    const isPending = status === 'pending';
                    const isApproved = status === 'approved' || status === 'checked_in';
                    
                    let pillClasses = 'bg-slate-100 text-slate-600'; // fallback
                    if (isMaintenance) {
                      pillClasses = 'bg-[#e3e2e7] text-[#475569]';
                    } else if (isPending) {
                      pillClasses = 'bg-[#ffdbcd] text-[#4e2617]';
                    } else if (isApproved) {
                      pillClasses = 'bg-[#02275d] text-white';
                    }

                    // Format Time for Tooltip
                    const evDate = new Date(ev.start_time || ev.date_of_booking || ev.created_at || new Date());
                    const timeStr = evDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    const tooltipText = `${timeStr} - ${facilityMap[ev.facility_id] || 'Ruangan'}\nAgenda: ${ev.purpose}\nStatus: ${status.toUpperCase()}`;

                    return (
                      <div 
                        key={i} 
                        className={`text-[10px] font-bold px-2 py-1 rounded truncate shadow-sm transition-all cursor-pointer hover:brightness-95 ${pillClasses}`}
                        title={tooltipText}
                      >
                        {timeStr} | {facilityMap[ev.facility_id] || 'Ruangan'}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 3: The Legend Container */}
      <div className="mt-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 text-xs font-bold text-slate-600">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded shadow-sm bg-[#02275d] border border-slate-200"></span>
          <span className="uppercase tracking-wider">Approved / Checked In</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded shadow-sm bg-[#ffdbcd] border border-[#f0c5b3]"></span>
          <span className="uppercase tracking-wider">Pending Validasi</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded shadow-sm bg-[#e3e2e7] border border-slate-300"></span>
          <span className="uppercase tracking-wider">Maintenance / Internal</span>
        </div>
      </div>
    </div>
  );
}
