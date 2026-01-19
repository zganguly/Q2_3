import { useEffect, useRef, useState, useCallback } from 'react';


export function useAbortable(asyncFn, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aborted, setAborted] = useState(false);
  const controllerRef = useRef(null);

  function execute() {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    var controller = new window.AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    setAborted(false);
    asyncFn(controller.signal)
      .then(function(result) {
        if (!controller.signal.aborted) {
          setData(result);
          setLoading(false);
        } else {
          setAborted(true);
          setLoading(false);
        }
      })
      .catch(function(err) {
        if (err && err.name === 'AbortError' || controller.signal.aborted) {
          setAborted(true);
          setLoading(false);
          console.log('Previous Request Cancelled By UseAbortable');
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
  }

  useEffect(function() {
    execute();
    return function() {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, deps || []);

  function cancel() {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setAborted(true);
      setLoading(false);
      console.log('Cancelled By UseAbortable');
    }
  }

  return { data: data, loading: loading, error: error, aborted: aborted, cancel: cancel, retry: execute };
}


export function useAbortableSearch(searchFn, debounceMs) {
  if (debounceMs === undefined) debounceMs = 500;
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aborted, setAborted] = useState(false);
  const controllerRef = useRef(null);
  const timeoutRef = useRef(null);

  function performSearch(searchQuery) {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!searchQuery || !searchQuery.trim()) {
      setResults(null);
      setLoading(false);
      setError(null);
      setAborted(false);
      return;
    }
    var controller = new window.AbortController();
    controllerRef.current = controller;
    timeoutRef.current = setTimeout(function() {
      setLoading(true);
      setError(null);
      setAborted(false);

      searchFn(searchQuery, controller.signal)
        .then(function(result) {
          if (!controller.signal.aborted) {
            setResults(result);
            setLoading(false);
          } else {
            setAborted(true);
            setLoading(false);
          }
        })
        .catch(function(err) {
          if ((err && err.name === 'AbortError') || controller.signal.aborted) {
            setAborted(true);
            setLoading(false);
          } else {
            if (err instanceof Error) {
              setError(err);
            } else {
              setError(new Error(String(err)));
            }
            setLoading(false);
          }
        });
    }, debounceMs);
  }

  function handleQueryChange(newQuery) {
    setQueryState(newQuery);
    performSearch(newQuery);
  }

  function cancel() {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setAborted(true);
      setLoading(false);
      alert('Cancelled manually');
      console.log('Cancelled manually');
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  useEffect(function() {
    return function() {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { query: query, setQuery: handleQueryChange, results: results, loading: loading, error: error, aborted: aborted, cancel: cancel };  
}