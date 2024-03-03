import { useEffect, useState } from 'react';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export function useMovieDetail(selectedId) {
  const [movieInfo, setMovieInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function getMovieDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${selectedId}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setMovieInfo(data);
      } catch (err) {
        console.error(err.message);
        if (err.name !== 'AbortError') {
          throw new Error(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!selectedId) {
      setMovieInfo({});
      return;
    }

    getMovieDetails();

    return function () {
      controller.abort();
    };
  }, [selectedId]);

  return { movieInfo, isLoading };
}
