// ---------------------------------------------------------------------------
// Utilitaires de recherche — Smart Hotel 360°
// Recherche normalisée : insensible à la casse et aux accents (é -> e), multi-
// champs, multi-tokens (ex: "Deluxe 2" matche "Chambre Deluxe étage 2").
// ---------------------------------------------------------------------------

/** Normalise une chaîne : minuscules, sans accents, espaces réduits. */
export function normalize(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Convertit n'importe quelle valeur en chaîne recherchable. */
export function stringifyField(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (Array.isArray(value)) return value.map(stringifyField).join(' ');
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }
  return String(value);
}

/**
 * Filtre une liste de documents : chaque token de `query` doit être présent
 * dans au moins un des champs listés (concaténés, normalisés).
 * Retourne la liste complète si la requête est vide.
 */
export function multiSearch(records, query, fields) {
  const q = normalize(query);
  if (!q || !Array.isArray(records)) return records || [];
  if (records.length === 0) return [];
  const tokens = q.split(' ').filter(Boolean);
  return records.filter((record) => {
    const haystack = fields
      .map((f) => normalize(stringifyField(record[f])))
      .join(' ');
    return tokens.every((token) => haystack.includes(token));
  });
}

/**
 * Construit une chaîne normalisée à partir d'un objet + liste de champs
 * (utilisée pour construire un index global rapide).
 */
export function buildSearchable(record, fields) {
  return fields.map((f) => normalize(stringifyField(record[f]))).join(' ');
}

/**
 * Découpe un texte en segments (match / non match) pour le surlignage.
 * Gère correctement l'écart d'index causé par les caractères accentués.
 */
export function highlightSegments(text, query) {
  const raw = String(text ?? '');
  const q = normalize(query);
  if (!q) return [{ match: false, text: raw }];

  // Construit la chaîne normalisée + l'index de correspondance raw -> norm
  const map = []; // position de chaque caractère normalisé dans le texte brut
  let norm = '';
  let rawIndex = 0;
  for (const ch of raw) {
    const n = normalize(ch);
    if (n) {
      map.push(rawIndex);
      norm += n;
    }
    rawIndex += ch.length;
  }

  const start = norm.indexOf(q);
  if (start === -1) return [{ match: false, text: raw }];
  const end = start + q.length;
  const rawStart = map[start];
  const lastNormIdx = Math.min(end - 1, map.length - 1);
  const lastRawIdx = map[lastNormIdx];
  const rawEnd = lastRawIdx + raw.slice(lastRawIdx).slice(0, raw[lastRawIdx] ? 1 : 0).length;

  if (rawStart < 0 || rawEnd <= rawStart || rawEnd > raw.length) {
    return [{ match: false, text: raw }];
  }

  return [
    { match: false, text: raw.slice(0, rawStart) },
    { match: true, text: raw.slice(rawStart, rawEnd) },
    { match: false, text: raw.slice(rawEnd) }
  ];
}

/** Format monétaire/numérique concis pour les vignettes de résultats. */
export function formatValue(value) {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value);
  }
  return stringifyField(value);
}

