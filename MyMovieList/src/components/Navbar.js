import { useRef } from 'react';
import { useKeyDown } from '../hooks/useKeyDown';

export function Navbar({ children }) {
  return (
    <>
      <nav className='nav-bar'>
        <Logo>My Movie List</Logo>
        {children}
      </nav>
    </>
  );
}

function Logo({ children }) {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>{children}</h1>
    </div>
  );
}

export function Search({ query, setQuery }) {
  const inputElem = useRef(null);

  // when clicking enter anywhere in the app, focus on the input field
  useKeyDown('Enter', () => {
    // do nothing if already focused on the field
    if (document.activeElement === inputElem.current) return;
    inputElem.current.focus();
    setQuery('');
  });

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElem}
    />
  );
}

export function NumResults({ numMovies }) {
  return (
    <p className='num-results'>
      Found <strong>{numMovies}</strong> results
    </p>
  );
}
