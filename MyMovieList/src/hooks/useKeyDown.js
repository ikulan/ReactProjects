import { useEffect } from 'react';

export function useKeyDown(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener('keydown', callback);

    // clean up
    return function () {
      document.removeEventListener('keydown', callback);
    };
  }, [key, action]);
}
