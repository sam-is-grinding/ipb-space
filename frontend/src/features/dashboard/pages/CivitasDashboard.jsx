import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarBlank, MapPin, Clock } from '@phosphor-icons/react';
import { useAuth } from '../../../context/AuthContext';
import { bookingService } from '../../bookings/services/bookingService';
import StatusBadge from '../../../shared/components/ui/Badge/StatusBadge';
import { toast } from 'react-hot-toast';
import { formatDate, formatTime } from '../../../shared/utils/format';

export default function CivitasDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getMyBookings();
        const allBookings = response?.data?.items || [];
        
        if (isMounted) {
          setBookings(Array.isArray(allBookings) ? allBookings.slice(0, 3) : []);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch bookings:', error);
          toast.error('Gagal memuat riwayat peminjaman.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-surface-bright py-10 px-4 md:px-8 min-h-screen flex-1">
      <div className="max-w-5xl mx-auto">
      {/* Greeting Section */}
      <section className="mb-8 animate-slide-up">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Halo, {user?.fullname || 'Civitas'}!
        </h1>
        <p className="text-on-surface-variant">
          Selamat datang di IPB Space. Ada yang bisa kami bantu hari ini?
        </p>
      </section>

      {/* Quick Action Card */}
      <section 
        className="bg-gradient-to-r from-primary-container to-secondary-container text-white rounded-card p-6 md:p-8 shadow-ambient flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10 animate-slide-up" 
        style={{ animationDelay: '0.1s' }}
      >
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold">Butuh ruangan untuk kegiatan?</h2>
          <p className="text-white/80 max-w-md text-sm md:text-base leading-relaxed">
            Eksplorasi berbagai fasilitas yang tersedia di lingkungan IPB University dan ajukan peminjaman sekarang juga.
          </p>
        </div>
        <button
          onClick={() => navigate('/facilities/explore')}
          className="bg-accent text-white px-8 py-3 rounded-btn font-semibold hover:brightness-110 transition-all shadow-md active:scale-95 whitespace-nowrap"
        >
          Ajukan Peminjaman
        </button>
      </section>

      {/* Recent Bookings Section */}
      <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <header className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-primary">Status Peminjaman Terkini</h2>
          {bookings.length > 0 && (
            <button
              onClick={() => navigate('/civitas/history')}
              className="text-sm font-semibold text-secondary hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              Lihat Semua
            </button>
          )}
        </header>

        {loading ? (
          <BookingSkeletons />
        ) : bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const BookingCard = ({ booking }) => (
  <article
    className="bg-white rounded-card shadow-ambient p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-accent hover:shadow-lg transition-all cursor-default group"
  >
    <div className="flex-1">
      <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-primary transition-colors">
        {booking.facility?.name || 'Fasilitas IPB'}
      </h3>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <CalendarBlank size={16} />
          <span>{formatDate(booking.start_time)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={16} />
          <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
        </div>
        {booking.facility?.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={16} />
            <span className="truncate max-w-[150px]">{booking.facility.location}</span>
          </div>
        )}
      </div>
    </div>
    <div className="flex justify-end items-center mt-2 md:mt-0">
      <StatusBadge status={booking.status} />
    </div>
  </article>
);

const BookingSkeletons = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-card p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 animate-pulse">
        <div className="h-16 w-16 bg-gray-200 rounded-lg shrink-0"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded-full md:self-center"></div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-card p-10 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
    <div className="w-16 h-16 bg-surface-dim rounded-full flex items-center justify-center mb-4">
      <CalendarBlank size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">Belum ada peminjaman aktif</h3>
    <p className="text-sm text-gray-500 max-w-sm">
      Anda belum memiliki riwayat peminjaman fasilitas. Silakan lakukan peminjaman terlebih dahulu.
    </p>
  </div>
);
