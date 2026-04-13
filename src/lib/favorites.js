import { useCallback, useState } from 'react';

const FavStore = {
  KEY: 'p4_favs',
  get: () => {
    try {
      const value = localStorage.getItem(FavStore.KEY);
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  },
  set: (ids) => {
    try {
      localStorage.setItem(FavStore.KEY, JSON.stringify(ids));
    } catch {
      // No-op en environnement restreint.
    }
  },
};

export function useFavorites() {
  const [favs, setFavs] = useState(() => FavStore.get());
  const [favOnly, setFavOnly] = useState(false);

  const toggle = useCallback((id) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      FavStore.set(next);
      return next;
    });
  }, []);

  const isFav = useCallback((id) => favs.includes(id), [favs]);

  return {
    favs,
    isFav,
    toggle,
    favOnly,
    setFavOnly,
    count: favs.length,
  };
}
