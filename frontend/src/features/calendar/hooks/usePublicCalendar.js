import { useState, useEffect } from 'react';
import publicApiClient from '../../../shared/services/api/publicApiClient';

export const usePublicCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const facRes = await publicApiClient.get('/facilities/');
        
        if (facRes.success) {
          const facilityList = facRes.data.items || [];
          setFacilities(facilityList);

          const bookingPromises = facilityList.map(f => 
            publicApiClient.get(`/bookings/facility/${f.id}`).catch(() => ({ success: false }))
          );

          const bookingResults = await Promise.all(bookingPromises);
          
          let allBookings = [];
          bookingResults.forEach(res => {
            if (res.success && res.data && res.data.items) {
              allBookings = [...allBookings, ...res.data.items];
            }
          });

          const activeBookings = allBookings.filter(
            (b) => ['Approved', 'Ongoing', 'approved', 'ongoing'].includes(b.status)
          );
          
          setBookings(activeBookings);
        } else {
          setError('Gagal memuat data fasilitas.');
        }
      } catch (err) {
        console.error('Calendar Fetch Error:', err);
        setError('Terjadi kesalahan saat memuat kalender publik.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { bookings, facilities, loading, error };
};
