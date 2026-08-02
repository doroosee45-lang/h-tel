import { useEffect, useState } from 'react';

/**
 * Hook de recherche différée (debounce).
 * Retourne une valeur « différée » qui n'est mise à jour qu'après un délai
 * d'inactivité — idéal pour les recherches temps réel sur de grosses listes.
 *
 * @param {string} value - valeur instantanée (contenu du champ)
 * @param {number} delay - délai en ms (défaut : 300)
 * @returns {string} valeur différée (utiliser pour le filtrage)
 *
 * Exemple :
 *   const [q, setQ] = useState('');
 *   const debouncedQ = useDebouncedSearch(q);
 *   const rows = filterRecords(data, debouncedQ, fields);
 */
export default function useDebouncedSearch(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

