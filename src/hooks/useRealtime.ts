import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const isPlaceholder =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE';

export function useRealtimeUsers() {
  const [userCount, setUserCount] = useState<number>(0);

  useEffect(() => {
    if (isPlaceholder) {
      // Show a demo count when Supabase is not configured
      setUserCount(42);
      return;
    }

    const fetchCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (!error && count !== null) {
          setUserCount(count);
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchCount();

    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        () => {
          setUserCount((prev) => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'profiles' },
        () => {
          setUserCount((prev) => Math.max(0, prev - 1));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return userCount;
}
