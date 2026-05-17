import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { facilityService } from '../services/facilityService';
import { userService } from '../../users/services/userService';

/**
 * Hook untuk mengambil data Master (Facilities & Users) secara konkuren 
 * dan memetakannya menjadi Dictionary { id: name } untuk Data Binding.
 */
export function useValidationLookup() {
  const [facilityMap, setFacilityMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [isLookupLoading, setIsLookupLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchLookups = async () => {
      try {
        setIsLookupLoading(true);
        // Ambil data secara bersamaan untuk mempercepat load time
        const [facilitiesRes, usersRes] = await Promise.all([
          facilityService.getAllFacilities(),
          userService.getAllUsers()
        ]);

        if (isMounted) {
          // Buat dictionary map untuk fasilitas
          const fMap = {};
          const facilities = facilitiesRes?.data?.items || facilitiesRes?.data || [];
          if (Array.isArray(facilities)) {
            facilities.forEach(f => {
              fMap[f.id] = f.name;
            });
          }

          // Buat dictionary map untuk pengguna
          const uMap = {};
          const users = usersRes?.data?.items || usersRes?.data || [];
          if (Array.isArray(users)) {
            users.forEach(u => {
              uMap[u.id] = u.fullname || u.name; 
            });
          }

          setFacilityMap(fMap);
          setUserMap(uMap);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch lookup data:', error);
          toast.error('Gagal memuat data referensi pemohon dan fasilitas.');
        }
      } finally {
        if (isMounted) {
          setIsLookupLoading(false);
        }
      }
    };

    fetchLookups();

    return () => {
      isMounted = false;
    };
  }, []);

  return { facilityMap, userMap, isLookupLoading };
}
