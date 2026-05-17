import React, { useState, useEffect } from 'react';
import { CalendarCheck, Door, ClockCounterClockwise, Badge } from '@phosphor-icons/react';
import { bookingService } from '../../bookings/services/bookingService';
import { facilityService } from '../../facilities/services/facilityService';
import { useValidationLookup } from '../../facilities/hooks/useValidationLookup';

export default function FacilityAdminOverview() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeFacilities, setActiveFacilities] = useState(0);
  const [totalFacilitiesCount, setTotalFacilitiesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Invoke lookup for potential shared states / dictionaries
  const { isLookupLoading } = useValidationLookup();

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
          icon={Badge} 
          colorClass="bg-purple-50 text-purple-600" 
        />
      </div>

      {/* Pure CSS Bar Chart */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
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
    </div>
  );
}
