import { useCallback, useEffect, useRef, useState } from 'react';
import api, { errorMessage } from '../api/client';

// Charge une ressource GET; pollMs > 0 => rafraîchissement périodique silencieux
// (suivi des statuts commandes/réservations sans push).
export default function useFetch(url, { params, pollMs = 0 } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const paramsKey = JSON.stringify(params || {});
  const alive = useRef(true);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setError(null);
      try {
        const res = await api.get(url, { params: JSON.parse(paramsKey) });
        if (alive.current) setData(res.data.data);
      } catch (e) {
        if (alive.current && !silent) setError(errorMessage(e));
      } finally {
        if (alive.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [url, paramsKey]
  );

  useEffect(() => {
    alive.current = true;
    setLoading(true);
    load();
    let timer;
    if (pollMs > 0) timer = setInterval(() => load(true), pollMs);
    return () => {
      alive.current = false;
      if (timer) clearInterval(timer);
    };
  }, [load, pollMs]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    return load();
  }, [load]);

  return { data, loading, refreshing, error, reload: load, refresh };
}
