import { useCallback, useEffect, useReducer, useState } from 'react';

import { errorMessage, isAbort } from '../utils/api-error';

interface State<T> {
  items: T[];
  loading: boolean;
  error: string;
}

type Action<T> =
  | { type: 'loaded'; items: T[] }
  | { type: 'failed'; error: string }
  | { type: 'removed'; id: string };

// Reducer para tener juntos items, loading y error
function reducer<T extends { _id: string }>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loaded':
      return { items: action.items, loading: false, error: '' };
    case 'failed':
      return { ...state, loading: false, error: action.error };
    case 'removed':
      return { ...state, items: state.items.filter((item) => item._id !== action.id) };
  }
}

// Hook sencillo para pedir listas a la API en React Native.
// Añadimos refreshing y onRefresh para soportar el gesto de arrastrar hacia abajo (pull-to-refresh).
export function useApiList<T extends { _id: string }>(fetcher: (signal: AbortSignal) => Promise<T[]>) {
  const [state, dispatch] = useReducer(reducer<T>, { items: [], loading: true, error: '' });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (isPullToRefresh = false) => {
      const controller = new AbortController();
      if (isPullToRefresh) {
        setRefreshing(true);
      }
      try {
        const items = await fetcher(controller.signal);
        dispatch({ type: 'loaded', items });
      } catch (err) {
        if (!isAbort(err)) {
          dispatch({ type: 'failed', error: errorMessage(err) });
        }
      } finally {
        if (isPullToRefresh) {
          setRefreshing(false);
        }
      }
    },
    [fetcher],
  );

  useEffect(() => {
    load();
  }, [load]);

  // Si borramos un elemento en la API (que devuelve 204), lo quitamos directamente de la lista local
  const removeItem = useCallback((id: string) => dispatch({ type: 'removed', id }), []);
  const reload = useCallback(() => load(false), [load]);
  const onRefresh = useCallback(() => load(true), [load]);

  return { ...state, removeItem, reload, onRefresh, refreshing };
}
