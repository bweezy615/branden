import { useCallback, useEffect, useState } from "react";

// Loads data for a screen, with pull-to-refresh and optional polling.
export function useData<T>(load: () => Promise<T>, options: { pollSeconds?: number } = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setData(await load());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, [load]);

  useEffect(() => {
    fetchData();
    if (!options.pollSeconds) return;
    const timer = setInterval(fetchData, options.pollSeconds * 1000);
    return () => clearInterval(timer);
  }, [fetchData, options.pollSeconds]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return { data, error, refreshing, refresh };
}
