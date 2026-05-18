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
        
        // Use allSettled so one failing endpoint doesn't crash the other
        const [facilitiesResult, usersResult] = await Promise.allSettled([
          facilityService.getAllFacilities(),
          userService.getAllUsers()
        ]);

        if (isMounted) {
          // Process facilities — graceful degradation if failed
          if (facilitiesResult.status === 'fulfilled') {
            const fMap = {};
            const facilities = facilitiesResult.value?.data?.items 
              || facilitiesResult.value?.data 
              || [];
            if (Array.isArray(facilities)) {
              facilities.forEach(f => { fMap[f.id] = f.name; });
            }
            setFacilityMap(fMap);
          } else {
            console.error('Failed to fetch facilities:', facilitiesResult.reason);
            toast.error('Gagal memuat data fasilitas.');
          }

          // Process users — graceful degradation if failed
          if (usersResult.status === 'fulfilled') {
            const uMap = {};
            const users = usersResult.value?.data?.items 
              || usersResult.value?.data 
              || [];
            if (Array.isArray(users)) {
              users.forEach(u => {
                uMap[u.id] = u.fullname || u.name;
              });
            }
            setUserMap(uMap);
          } else {
            console.error('Failed to fetch users:', usersResult.reason);
            // Non-fatal: user names will show as ID fallbacks
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch lookup data:', error);
          toast.error('Gagal memuat data referensi.');
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
