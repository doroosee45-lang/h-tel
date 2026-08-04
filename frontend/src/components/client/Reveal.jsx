import { Box } from '@mui/material';
import useInView from '../../hooks/useInView.js';

/**
 * Reveal — wrapper d'animation au défilement.
 * Fade + translation légère quand l'élément entre dans le viewport.
 * Props :
 *  - direction : 'up' | 'down' | 'left' | 'right' | 'none'
 *  - delay      : délai en ms (pour effet cascade)
 *  - duration   : durée de la transition en ms
 */
export default function Reveal({ children, direction = 'up', delay = 0, duration = 450, sx }) {
  const { ref, inView } = useInView();

  const offsets = {
    up: 'translateY(16px)',
    down: 'translateY(-16px)',
    left: 'translateX(20px)',
    right: 'translateX(-20px)',
    none: 'translateY(0)'
  };

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0,0)' : offsets[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
        willChange: 'opacity, transform',
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

