import React, { useState, useEffect } from 'react';
import { CalendarCheck, Door, ClockCounterClockwise, IdentificationBadge } from '@phosphor-icons/react';
import { bookingService } from '../../bookings/services/bookingService';
import { facilityService } from '../../facilities/services/facilityService';
import { useValidationLookup } from '../../facilities/hooks/useValidationLookup';

export default function FacilityAdminOverview() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeFacilities, setActiveFacilities] = useState(0);
  const [totalFacilitiesCount, setTotalFacilitiesCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isLookupLoading, facilityMap, userMap } = useValidationLookup();

  useEffect(() => {
    let isMounted = true;
    
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [bookingsRes, facilitiesRes] = await Promise.all([
          bookingService.getAllBookings(),
          facilityService.getAllFacilities()
        ]);

        if (isMounted) {
          const bookings = bookingsRes?.data?.items || bookingsRes?.items || bookingsRes?.data || [];
          const facilities = facilitiesRes?.data?.items || facilitiesRes?.items || facilitiesRes?.data || [];

          setTotalBookings(bookings.length);
          setPendingCount(bookings.filter(b => b.status && b.status.toLowerCase() === 'pending').length);
          
          setTotalFacilitiesCount(facilities.length);
          setActiveFacilities(facilities.filter(f => !f.condition || f.condition.toLowerCase() === 'good' || f.condition.toLowerCase() === 'tersedia').length);

          setRecentBookings(bookings.slice(0, 3));
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  // Mock weekly data mapped exactly for pure Tailwind CSS bar chart rendering
  const weeklyData = [
    { day: 'Sen', value: 45, height: 'h-[45%]' },
    { day: 'Sel', value: 65, height: 'h-[65%]' },
    { day: 'Rab', value: 85, height: 'h-[85%]' },
    { day: 'Kam', value: 55, height: 'h-[55%]' },
    { day: 'Jum', value: 95, height: 'h-[95%]' },
    { day: 'Sab', value: 30, height: 'h-[30%]' },
    { day: 'Min', value: 15, height: 'h-[15%]' },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon size={28} weight="duotone" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {isLoading || isLookupLoading ? '-' : value}
          </h3>
          {subtitle && <span className="text-xs font-semibold text-slate-400">{subtitle}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-grow p-4 md:p-8 bg-[#F4F7FB] pt-[64px] md:pt-8 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-primary mb-1 tracking-tight">Dashboard Utama</h1>
        <p className="text-slate-500 text-sm font-medium">Ringkasan aktivitas peminjaman dan ketersediaan fasilitas IPB Space.</p>
      </div>

      {/* 4 Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Peminjaman" 
          value={totalBookings} 
          subtitle="transaksi"
          icon={CalendarCheck} 
          colorClass="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Ruangan Aktif" 
          value={`${activeFacilities}/${totalFacilitiesCount}`} 
          subtitle="tersedia"
          icon={Door} 
          colorClass="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          title="Menunggu Validasi" 
          value={pendingCount} 
          subtitle="permohonan"
          icon={ClockCounterClockwise} 
          colorClass="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          title="Total Facility Admin" 
          value={8} 
          subtitle="operator aktif"
          icon={IdentificationBadge} 
          colorClass="bg-purple-50 text-purple-600" 
        />
      </div>

      {/* Middle Row: Chart & Top Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pure CSS Bar Chart */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Statistik Peminjaman Mingguan</h3>
              <p className="text-sm font-medium text-slate-500 mt-0.5">Intensitas reservasi dalam 7 hari terakhir.</p>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 md:gap-6 pt-4 border-b border-slate-100 pb-2 relative">
            {/* Y-Axis Grid Lines Placeholder */}
            <div className="absolute left-0 w-full h-full flex flex-col justify-between pointer-events-none pb-8 opacity-40">
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
              <div className="border-t border-dashed border-slate-200 w-full"></div>
            </div>

            {weeklyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-3 w-full group z-10 h-full justify-end">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg -translate-y-2 pointer-events-none shadow-md">
                  {data.value} Trx
                </div>
                
                {/* Tailored Bar Component */}
                <div className={`w-full max-w-[40px] md:max-w-[60px] ${data.height} bg-accent/20 hover:bg-accent rounded-t-xl transition-all cursor-pointer border-b-4 border-accent relative overflow-hidden group-hover:shadow-md`}>
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-accent/40 to-transparent h-1/2"></div>
                </div>
                
                {/* Day Label */}
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rooms Ranking */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Ruangan Teratas</h3>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Paling sering dipinjam bulan ini.</p>
          </div>
          <div className="mt-8 space-y-6">
            {[
              { name: 'Auditorium FMIPA', count: 142, icon: '🏆', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'Ruang Seminar A', count: 98, icon: '🥈', color: 'bg-slate-100 text-slate-500' },
              { name: 'Lab Komputer 1', count: 76, icon: '🥉', color: 'bg-orange-100 text-orange-600' },
              { name: 'Ruang Diskusi R1', count: 45, icon: '4', color: 'bg-slate-50 text-slate-400 font-black' },
            ].map((room, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm ${room.color}`}>
                  {room.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-700">{room.name}</h4>
                  <p className="text-xs font-semibold text-slate-400">{room.count} kali dipinjam</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Mini Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Aktivitas Terbaru</h3>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Transaksi peminjaman yang baru saja masuk.</p>
          </div>
          <button className="text-sm font-bold text-accent hover:text-accent/80 transition-colors px-4 py-2 bg-accent/10 rounded-lg">
            Lihat Semua
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Pemohon</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Agenda & Ruangan</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider">Waktu Mulai</th>
                <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading || isLookupLoading ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-400 text-sm font-medium animate-pulse">Memuat data aktivitas...</td></tr>
              ) : recentBookings.length === 0 ? (
                <tr><td colSpan="4" className="py-8 text-center text-slate-400 text-sm font-medium">Belum ada aktivitas.</td></tr>
              ) : (
                recentBookings.map((b, idx) => {
                  const status = (b.status || '').toLowerCase();
                  let statusBadge = '';
                  let statusLabel = b.status;
                  if (status === 'approved' || status === 'checked_in') {
                    statusBadge = 'bg-green-100 text-green-800 font-semibold rounded-full px-2.5 py-1 text-xs w-full text-center inline-block';
                    statusLabel = 'Berhasil';
                  } else if (status === 'rejected' || status === 'cancelled') {
                    statusBadge = 'bg-red-100 text-red-800 font-semibold rounded-full px-2.5 py-1 text-xs w-full text-center inline-block';
                    statusLabel = 'Gagal';
                  } else {
                    statusBadge = 'bg-yellow-100 text-yellow-800 font-semibold rounded-full px-2.5 py-1 text-xs w-full text-center inline-block';
                    statusLabel = 'Pending';
                  }

                  const userName = userMap[b.user_id] || `Pemohon #${b.user_id}`;
                  const roomName = facilityMap[b.facility_id] || 'Ruangan';
                  const startDate = b.start_time || b.date_of_booking;
                  const formattedDate = startDate ? new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-700 text-sm">{userName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-700 text-sm">{b.purpose || 'Tanpa Agenda'}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-1">{roomName}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-600 text-sm">{formattedDate}</td>
                      <td className="py-4 px-6 w-32">
                        <span className={statusBadge}>{statusLabel}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
