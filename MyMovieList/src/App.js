import { useState } from 'react';
import { useSearchMovies } from './hooks/useSearchMovies';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navbar, Search, NumResults } from './components/Navbar';
import SearchList from './components/SearchList';
import WatchedList from './components/WatchedList';
import MovieDetail from './components/MovieDetails';
import Loader from './components/Loader';
import ErrorMsg from './components/ErrorMsg';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // custom hooks
  const { movies, isLoading, error } = useSearchMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorage('watched', []);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults numMovies={movies.length} />
      </Navbar>

      <main className='main'>
        <div className='box'>
          {isLoading && !error && <Loader />}
          {!isLoading && !error && (
            <SearchList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMsg message={error} />}
        </div>
        <div className='box'>
          {selectedId ? (
            <MovieDetail
              selectedId={selectedId}
              watched={watched}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <WatchedList watched={watched} onDelete={handleDeleteWatched} />
          )}
        </div>
      </main>
    </>
  );
}
