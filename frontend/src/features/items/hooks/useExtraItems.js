import { useState, useEffect } from 'react';
import { itemService } from '../services/itemService';

export const useExtraItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchExtraItems = async () => {
      try {
        setIsLoading(true);
        const response = await itemService.getAllExtraItems();
        // Handle response shape { success: true, data: { extra_items: [...] } }
        const data = response?.data?.extra_items || response?.data?.items || response?.data || response || [];
        if (isMounted) {
          setItems(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Gagal memuat daftar item tambahan');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchExtraItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, isLoading, error };
};
