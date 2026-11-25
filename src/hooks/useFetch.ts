import { useCallback, useEffect, useState } from "react";
import { isAbortError } from "../api/client";
import type { Status } from "../types";

export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        setData(result);
        setStatus("success");
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      });

    return () => controller.abort();
  }, [fetcher, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, setData, status, error, retry };
}