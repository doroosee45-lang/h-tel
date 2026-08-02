import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { tokens } from '../../theme.js';

// ---------------------------------------------------------------------------
// Champ de recherche réutilisable — filtrage temps réel par module.
// value/onChange contrôlés depuis la page parente.
// Accessible : role searchbox, aria-label… et responsive mobile (pleine largeur).
// ---------------------------------------------------------------------------
export default function SearchField({
  value,
  onChange,
  placeholder = 'Rechercher…',
  ariaLabel = placeholder,
  fullWidth = false,
  size = 'small',
  autoFocus = false,
  sx = {}
}) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      role="searchbox"
      inputProps={{ 'aria-label': ariaLabel, 'aria-controls': value ? undefined : undefined }}
      size={size}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      sx={{
        bgcolor: '#fff',
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          border: `1px solid ${tokens.color.line}`,
          '& fieldset': { border: 'none' }
        },
        '& .MuiInputBase-input': {
          minWidth: 0 // Évite le débordement du placeholder sur mobile
        },
        ...sx
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" edge="end" onClick={() => onChange('')} aria-label="Effacer la recherche">
              <CloseRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  );
}

