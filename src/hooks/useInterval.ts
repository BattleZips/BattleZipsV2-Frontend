import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Hook to run a function repeatedly over a specific time interval
 * 
 * @param {() => void} callback - function to run each interval iteration
 * @param {number | null} delay - interval window
 */
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
