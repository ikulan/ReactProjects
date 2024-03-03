import { useEffect, useState, useRef } from 'react';
import { useKeyDown } from '../hooks/useKeyDown';
import { useMovieDetail } from '../hooks/useMovieDetail';
import StarRating from './StarRating';
import Loader from './Loader';

export default function MovieDetail({
  selectedId,
  watched,
  onCloseMovie,
  onAddWatched,
}) {
  const { movieInfo, isLoading } = useMovieDetail(selectedId);
  const [userRating, setUserRating] = useState('');
  const countRef = useRef(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // destructure the movie object, assign some object elements to variables
  const {
    imdbID,
    imdbRating,
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieInfo;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  // escape key event
  useKeyDown('Escape', onCloseMovie);

  // records how many times the user rate on this movie
  useEffect(() => {
    if (userRating) {
      countRef.current += 1;
    }
  }, [userRating]);

  // change page title
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = 'My Movie List';
    };
  }, [title]);

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr; {/* left arrow */}
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {isWatched ? (
                <p>
                  You rated this movie {watchedRating} <span>⭐️</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
