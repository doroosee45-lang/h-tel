// ---------------------------------------------------------------------------
// Utilitaires de recherche — Smart Hotel 360°
// Recherche normalisée : insensible à la casse et aux accents (é -> e), multi-
// champs, multi-tokens (ex: "Deluxe 2" matche "Chambre Deluxe étage 2"),
// dates (JJ/MM/AAAA, AAAA-MM-JJ), téléphones (chiffres seuls) et montants.
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

/** Normalise un téléphone : ne garde que les chiffres (+243 81 000 0001 → 243810000001). */
export function normalizePhone(value) {
  const raw = stringifyField(value);
  const digits = raw.replace(/\D/g, '');
  // Variations usuelles : +243811234567 / 0811234567 / 243811234567
  return [digits, digits.replace(/^00243/, '243'), digits.startsWith('0') ? digits.slice(1) : digits]
    .filter(Boolean)
    .join(' ');
}

/** Normalise une date dans plusieurs formats et fusiables (YYYY-MM-DD, JJ/MM/AAAA, timestamp ISO…). */
export function normalizeDate(value) {
  const raw = stringifyField(value);
  const norm = normalize(raw);
  if (!norm) return '';

  let d = null;
  // ISO auto (JS native parsing)
  if (/^\d{4}-\d{2}-\d{2}/.test(norm)) {
    d = new Date(norm.slice(0, 10) + 'T00:00:00');
    if (!Number.isNaN(d.getTime())) {
      return [
        d.toLocaleDateString('fr-FR'),                       // 01/08/2026
        d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), // 01/08
        norm.slice(0, 10)                                    // 2026-08-01
      ].join(' ');
    }
  }
  // JJ/MM/AAAA
  const frMatch = norm.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (frMatch) {
    const [, day, month, year] = frMatch;
    d = new Date(`${year}-${month}-${day}T00:00:00`);
    if (!Number.isNaN(d.getTime())) {
      const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      return [norm, `0${day}`.slice(-2) + '/0' + `0${month}`.slice(-2), iso].join(' ');
    }
  }
  // String simple (ex: "2026-08-03") → fallback normalize
  return norm;
}

/**
 * Construit le « haystack » (paille) normalisé d'un enregistrement pour les
 * champs listés. Applique la normalisation spéciale aux dates et téléphones.
 */
export function buildSearchable(record, fields) {
  const parts = [];
  for (const f of fields) {
    if (record == null) continue;
    const v = record[f];
    // Détection automatique du type de champ par son nom
    if (/date|arrivee|depart|periode|du|au|genere|_at$/i.test(f)) {
      parts.push(normalizeDate(v));
    } else if (/tel|phone|mobile|contact/i.test(f)) {
      parts.push(normalizePhone(v));
    } else {
      parts.push(normalize(stringifyField(v)));
    }
  }
  return parts.join(' ');
}

/**
 * Filtre une liste de documents : chaque token de `query` doit être présent
 * dans au moins un des champs listés (concaténés, normalisés).
 * Retourne la liste complète si la requête est vide.
 */
export function multiSearch(records, query, fields) {
  if (!Array.isArray(records)) return [];
  const q = normalize(query);
  if (!q) return records;
  if (records.length === 0) return [];
  const tokens = q.split(' ').filter(Boolean);
  // Si la requête ressemble à un numéro de téléphone, on ajoute la version digits purs.
  const phoneTokens = /^\d{6,}$/.test(q.replace(/\D/g, '')) ? [normalizePhone(q)] : [];
  return records.filter((record) => {
    const haystack = buildSearchable(record, fields);
    return tokens.every((token) => haystack.includes(token))
      && phoneTokens.every((pt) => haystack.includes(pt));
  });
}

/**
 * Filtre générique pour les modules : prend une liste de documents, une query
 * et une liste de champs (ou une fonction de mapping). Compatible avec toutes
 * les pages (sans risque d'erreur si la liste vient du contexte).
 */
export function filterRecords(records, query, fields) {
  if (!Array.isArray(records)) return [];
  if (!query || !query.trim()) return records;
  return multiSearch(records, query, fields);
}

/**
 * Recherche multi-critères avec score de pertinence.
 * Retourne les enregistrements triés : correspondance en début de champ
 * (titre) prioritaire, puis correspondance partielle.
 *
 * @param {Array} records - liste des enregistrements
 * @param {string} query - requête libre
 * @param {string|string[]} primaryField - champ(s) principal(aux) (titre)
 * @param {string[]} [fields] - autres champs à inclure dans la recherche
 * @returns {Array} enregistrements filtrés + triés, avec score
 */
export function multiSearchRanked(records, query, primaryField, fields = []) {
  const q = normalize(query);
  if (!q || !Array.isArray(records)) return records || [];
  if (records.length === 0) return [];

  const tokens = q.split(' ').filter(Boolean);
  const allFields = Array.isArray(primaryField)
    ? [...primaryField, ...fields]
    : [primaryField, ...fields];

  const scored = records
    .map((record) => {
      const haystack = buildSearchable(record, allFields);
      if (!tokens.every((token) => haystack.includes(token))) return null;

      // Score : priorité au champ principal, puis position du match.
      let score = 0;
      const title = normalize(stringifyField(Array.isArray(primaryField) ? primaryField.map((f) => record[f]).join(' ') : record[primaryField]));
      if (tokens.every((token) => title.includes(token))) {
        score += 10;
        const first = title.indexOf(tokens[0]);
        if (first === 0) score += 5;
      }
      // Plus la correspondance est longue, meilleur score.
      const matchedLen = tokens.reduce((s, t) => s + (haystack.includes(t) ? t.length : 0), 0);
      score += matchedLen;
      return { record, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.record);
}

/**
 * Découpe un texte en segments (match / non match) pour le surlignage.
 * Gère correctement l'écart d'index causé par les caractères accentués.
 * Amélioré : surligne TOUS les tokens, pas seulement la première occurrence.
 */
export function highlightSegments(text, query) {
  const raw = String(text ?? '');
  const q = normalize(query);
  if (!q) return [{ match: false, text: raw }];
  const tokens = q.split(' ').filter(Boolean);
  if (tokens.length === 0) return [{ match: false, text: raw }];

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

  // Marque les plages [start,end) normalisées qui correspondent à chaque token
  const ranges = [];
  tokens.forEach((token) => {
    let fromIndex = 0;
    while (true) {
      const idx = norm.indexOf(token, fromIndex);
      if (idx === -1) break;
      ranges.push([idx, idx + token.length]);
      fromIndex = idx + token.length;
    }
  });
  if (ranges.length === 0) return [{ match: false, text: raw }];

  // Fusionne les plages qui se chevauchent / sont adjacentes
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    if (ranges[i][0] <= last[1]) {
      last[1] = Math.max(last[1], ranges[i][1]);
    } else {
      merged.push(ranges[i]);
    }
  }

  // Convertit les plages normalisées en indices bruts
  const segments = [];
  let cursor = 0;
  merged.forEach(([ns, ne]) => {
    const rs = map[ns];
    const lastNormIdx = Math.min(ne - 1, map.length - 1);
    const re = map[lastNormIdx] + (raw.slice(map[lastNormIdx]).match(/^\S/) ? 1 : 0);
    if (rs < cursor || re > raw.length || re <= rs) return;
    if (rs > cursor) segments.push({ match: false, text: raw.slice(cursor, rs) });
    segments.push({ match: true, text: raw.slice(rs, re) });
    cursor = re;
  });
  if (cursor < raw.length) segments.push({ match: false, text: raw.slice(cursor) });
  return segments.length ? segments : [{ match: false, text: raw }];
}

/** Format monétaire/numérique concis pour les vignettes de résultats. */
export function formatValue(value) {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value);
  }
  return stringifyField(value);
}

