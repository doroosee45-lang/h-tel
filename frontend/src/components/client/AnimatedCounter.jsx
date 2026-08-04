import { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import useInView from '../../hooks/useInView.js';

/**
 * AnimatedCounter — compteur animé qui se déclenche quand l'élément
 * entre dans le viewport (easing easeOutExpo, performant).
 */
export default function AnimatedCounter({ value, duration = 1800, decimals = 0, prefix = '', suffix = '', sx }) {
  const { ref, inView } = useInView({ threshold: 0.4 });
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!inView) return undefined;

    let raf;
    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const formatted = display.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <Typography
      ref={ref}
      sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 700, ...sx }}
    >
      {prefix}
      {formatted}
      {suffix}
    </Typography>
  );
}

