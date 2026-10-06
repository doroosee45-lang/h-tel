import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(loader, deps = [], { immediate = true, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const nextData = await loader();
      setData(nextData);
      return nextData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      reload().catch(() => {});
    }
  }, [immediate, reload]);

  return { data, setData, loading, error, reload };
}
