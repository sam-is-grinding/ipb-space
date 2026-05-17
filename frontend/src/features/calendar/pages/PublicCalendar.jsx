import React, { useState } from 'react';
import { usePublicCalendar } from '../hooks/usePublicCalendar';
import { CaretLeft, CaretRight, CalendarBlank, PlusCircle } from '@phosphor-icons/react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PublicCalendar() {
  const { bookings, facilities, loading, error } = usePublicCalendar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleBookingAction = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/civitas/beranda');
    }
  };

  const getBookingsForDate = (date) => {
    return bookings.filter(b => {
      const bookingDate = new Date(b.start_time);
      return bookingDate.getDate() === date && bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
    });
  };

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <>
      <div className="bg-surface py-12 px-4 md:px-8 min-h-screen">
        <div className="max-w-7xl mx-auto mt-4 md:mt-10">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-primary font-black text-4xl drop-shadow-sm flex items-center justify-center md:justify-start">
              {/* <CalendarBlank size={40} className="mr-3 text-accent" weight="fill" /> */}
              Kalender Publik
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Lihat jadwal penggunaan fasilitas kampus untuk merencanakan kegiatan Anda.</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-ambient p-6 md:p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-surface-lowest p-4 rounded-card shadow-sm border border-gray-100 gap-4">
              <h2 className="text-2xl font-black text-primary-container tracking-wide">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex gap-2 border-r border-gray-200 pr-4 mr-2">
                  <button onClick={prevMonth} className="p-2 border border-gray-200 rounded-btn hover:bg-gray-50 text-primary-container transition-colors shadow-sm">
                    <CaretLeft size={20} weight="bold" />
                  </button>
                  <button onClick={nextMonth} className="p-2 border border-gray-200 rounded-btn hover:bg-gray-50 text-primary-container transition-colors shadow-sm">
                    <CaretRight size={20} weight="bold" />
                  </button>
                </div>
                <button 
                  onClick={handleBookingAction}
                  className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-btn font-bold hover:scale-105 transition-all shadow-lg text-sm"
                >
                  <PlusCircle size={20} weight="bold" />
                  Pesan Ruangan
                </button>
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse h-[500px] bg-gray-100 rounded-card"></div>
            ) : error ? (
              <div className="text-center py-20 text-danger bg-error-container rounded-card border border-danger/20">
                <p className="font-bold">{error}</p>
              </div>
            ) : (
              <>
                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-[1.5rem] overflow-hidden shadow-inner">
                  {dayNames.map(day => (
                    <div key={day} className="bg-primary-container p-3 text-center font-bold text-white text-sm tracking-widest uppercase">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-surface-lowest min-h-[140px] p-2"></div>
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const date = i + 1;
                    const isToday = new Date().getDate() === date && new Date().getMonth() === new Date().getMonth() && new Date().getFullYear() === new Date().getFullYear();
                    const dayBookings = getBookingsForDate(date);

                    return (
                      <div key={date} className={`bg-white min-h-[140px] p-3 border-t border-gray-100 transition-colors hover:bg-surface-bright ${isToday ? 'bg-blue-50/50' : ''}`}>
                        <div className={`text-sm font-bold mb-3 w-8 h-8 flex items-center justify-center rounded-full shadow-sm ${isToday ? 'bg-accent text-white shadow-lg' : 'bg-surface-lowest text-gray-700 border border-gray-200'}`}>
                          {date}
                        </div>
                        <div className="space-y-1.5">
                          {dayBookings.slice(0, 3).map(b => {
                            const facility = facilities.find(f => f.id === b.facility_id);
                            return (
                              <div key={b.id} className="text-xs bg-primary-container/5 border border-primary-container/10 text-primary-container px-2 py-1.5 rounded font-semibold truncate hover:bg-primary-container/10 transition-colors cursor-default" title={`${b.purpose} - ${facility?.name}`}>
                                {new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {facility?.name || 'Ruangan'}
                              </div>
                            );
                          })}
                          {dayBookings.length > 3 && (
                            <div className="text-xs text-accent font-bold pl-1 hover:underline cursor-pointer">+{dayBookings.length - 3} kegiatan lain</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  {/* Horizontal Date Picker */}
                  <div className="flex overflow-x-auto gap-3 pb-6 mb-6 no-scrollbar scroll-smooth">
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const date = i + 1;
                      const isToday = new Date().getDate() === date && new Date().getMonth() === month && new Date().getFullYear() === year;
                      const isSelected = selectedDate === date;
                      const dayName = dayNames[(firstDayOfMonth + i) % 7];
                      const hasBookings = getBookingsForDate(date).length > 0;

                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-accent text-white shadow-lg scale-105' 
                              : 'bg-surface-bright text-gray-500 border border-gray-100'
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-black mb-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                            {dayName}
                          </span>
                          <span className="text-xl font-black">{date}</span>
                          {hasBookings && !isSelected && (
                            <div className="w-1 h-1 bg-accent rounded-full mt-1"></div>
                          )}
                          {isToday && !isSelected && (
                            <div className="text-[8px] font-bold mt-1 text-accent uppercase">Hari ini</div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Bookings for Selected Date */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black text-primary-container text-lg">
                        Jadwal {selectedDate} {monthNames[month]}
                      </h3>
                      <span className="text-xs bg-blue-100 text-primary-container px-3 py-1 rounded-full font-bold">
                        {getBookingsForDate(selectedDate).length} Kegiatan
                      </span>
                    </div>

                    {getBookingsForDate(selectedDate).length > 0 ? (
                      <div className="space-y-3">
                        {getBookingsForDate(selectedDate).map(b => {
                          const facility = facilities.find(f => f.id === b.facility_id);
                          return (
                            <div key={b.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
                              <div className="flex items-start gap-4">
                                <div className="bg-accent/10 text-accent p-3 rounded-xl">
                                  <CalendarBlank size={24} weight="fill" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-black text-accent uppercase tracking-wider">
                                      {new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(b.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  </div>
                                  <h4 className="font-black text-primary-container text-lg leading-tight mb-1">
                                    {facility?.name || 'Fasilitas'}
                                  </h4>
                                  <p className="text-sm text-gray-600 font-medium">{b.purpose}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-surface-bright rounded-[2rem] border-2 border-dashed border-gray-200">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                          <CalendarBlank size={32} />
                        </div>
                        <p className="text-gray-500 font-bold">Tidak ada jadwal kegiatan</p>
                        <p className="text-sm text-gray-400">Silakan pilih tanggal lain atau pesan sekarang.</p>
                        <button 
                          onClick={handleBookingAction}
                          className="mt-6 text-accent font-black text-sm hover:underline"
                        >
                          Pesan Ruangan Ini
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
