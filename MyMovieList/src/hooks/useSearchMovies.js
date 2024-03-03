import { useEffect, useState } from 'react';

const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;

export function useSearchMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    callback?.();

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError('');

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error('Something went wrong with fetching moveis.');

        const data = await res.json();
        if (data.Response === 'False') throw new Error('Movie not found.');

        setMovies(data.Search);

        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]); // run whenever query is changed

  return { movies, isLoading, error };
}
