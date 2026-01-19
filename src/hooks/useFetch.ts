import { useEffect, useState } from "react";
import { typedFetch } from "../api/typedFetch";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      const result = await typedFetch(url);

      if (isMounted) {
        if (result.ok) {
          setData(result.data as T);
        } else {
          setError(result.message);
        }
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, error, loading };
}
