import { useState, useEffect } from 'react';

/**
 * @returns {number}
 */
export default function () {
  const { scrollY, scrollX } = window;
  const [scroll, setScroll] = useState({ scrollY, scrollX });

  useEffect(() => {
    window.addEventListener('scroll', setHeight);
    return () => window.removeEventListener('scroll', setHeight);
  }, []);

  const setHeight = () =>
    setScroll({
      scrollY: window.scrollY,
      scrollX: window.scrollX,
    });

  return scroll;
}
