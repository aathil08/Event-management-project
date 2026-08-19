import { useState, useEffect, useCallback } from 'react';
import { fetchEvents } from '../api/services';

const useEvents = (params = {}) => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [total, setTotal]     = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchEvents(params);
      setEvents(res.data.events);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  return { events, setEvents, loading, error, total, reload: load };
};

export default useEvents;
