// import { createTheme } from '@mui/material/styles';

// // ---------------------------------------------------------------------------
// // SMART HOTEL 360° — Design tokens
// // Palette inspired by the "Park Hotel" guest-app reference (deep navy + warm
// // gold on cream) crossed with the clean, high-contrast POS reference for the
// // operational screens (Restaurant / Bar / Stock).
// // ---------------------------------------------------------------------------

// export const tokens = {
//   color: {
//     navy: '#0B2545',       // primary — chrome, sidebar, headers
//     navyDeep: '#071A33',   // sidebar background
//     navySoft: '#16406E',   // hover / secondary surfaces
//     gold: '#C9A24B',       // accent — CTAs, active states, key numbers
//     goldSoft: '#E8D9B5',   // tinted backgrounds for gold accent
//     cream: '#F6F3EC',      // app background
//     surface: '#FFFFFF',    // cards
//     ink: '#1C2430',        // primary text
//     inkMuted: '#67707E',   // secondary text
//     line: '#E7E1D2',       // borders / dividers
//     success: '#2E7D5B',
//     successSoft: '#E1EEE6',
//     warning: '#C1440E',    // stock alerts / burnt orange (deliberately not terracotta #D97757)
//     warningSoft: '#F6E3D8',
//     danger: '#B3261E',
//     dangerSoft: '#F5DEDC',
//     info: '#2B6CB0',
//     infoSoft: '#DCE8F5'
//   },
//   radius: { sm: 8, md: 12, lg: 18, xl: 26 },
//   font: {
//     display: '"Fraunces", "Georgia", serif',
//     body: '"Inter", "Helvetica Neue", sans-serif',
//     mono: '"IBM Plex Mono", monospace'
//   }
// };

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: tokens.color.navy, light: tokens.color.navySoft, dark: tokens.color.navyDeep, contrastText: '#fff' },
//     secondary: { main: tokens.color.gold, contrastText: tokens.color.navyDeep },
//     success: { main: tokens.color.success },
//     warning: { main: tokens.color.warning },
//     error: { main: tokens.color.danger },
//     info: { main: tokens.color.info },
//     background: { default: tokens.color.cream, paper: tokens.color.surface },
//     text: { primary: tokens.color.ink, secondary: tokens.color.inkMuted },
//     divider: tokens.color.line
//   },
//   shape: { borderRadius: tokens.radius.md },
//   typography: {
//     fontFamily: tokens.font.body,
//     h1: { fontFamily: tokens.font.display, fontWeight: 600, letterSpacing: '-0.01em' },
//     h2: { fontFamily: tokens.font.display, fontWeight: 600, letterSpacing: '-0.01em' },
//     h3: { fontFamily: tokens.font.display, fontWeight: 600 },
//     h4: { fontFamily: tokens.font.display, fontWeight: 600 },
//     h5: { fontFamily: tokens.font.display, fontWeight: 600 },
//     h6: { fontFamily: tokens.font.display, fontWeight: 600 },
//     button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
//     overline: { fontFamily: tokens.font.mono, letterSpacing: '0.12em' }
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         body: { backgroundColor: tokens.color.cream }
//       }
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: { backgroundImage: 'none' }
//       }
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: { borderRadius: tokens.radius.sm, paddingInline: 16 },
//         containedSecondary: { color: tokens.color.navyDeep }
//       }
//     },
//     MuiChip: {
//       styleOverrides: { root: { fontWeight: 600 } }
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: tokens.radius.lg,
//           border: `1px solid ${tokens.color.line}`,
//           boxShadow: '0 1px 2px rgba(11,37,69,0.04)'
//         }
//       }
//     }
//   }
// });


// export default theme;
import { createTheme, alpha } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// SMART HOTEL 360° — Design tokens
// Palette inspirée du guest-app "Park Hotel" (navy profond + or chaud sur
// crème), croisée avec la lisibilité haute-contraste des écrans opérationnels
// (Restaurant / Bar / Stock).
// ---------------------------------------------------------------------------

export const tokens = {
  color: {
    navy: '#0B2545',       // primary — chrome, sidebar, headers
    navyDeep: '#071A33',   // fond sidebar
    navySoft: '#16406E',   // hover / surfaces secondaires
    gold: '#C9A24B',       // accent — CTA, états actifs, chiffres clés
    goldSoft: '#F1E7CC',   // fond teinté pour l'accent gold
    cream: '#F6F3EC',      // fond app
    surface: '#FFFFFF',    // cartes
    ink: '#1C2430',        // texte principal
    inkMuted: '#67707E',   // texte secondaire
    line: '#E7E1D2',       // bordures / séparateurs
    success: '#2E7D5B',
    successSoft: '#E1EEE6',
    warning: '#C1440E',
    warningSoft: '#F6E3D8',
    danger: '#B3261E',
    dangerSoft: '#F5DEDC',
    info: '#2B6CB0',
    infoSoft: '#DCE8F5'
  },
  radius: { sm: 8, md: 12, lg: 18, xl: 26 },
  shadow: {
    sm: '0 1px 2px rgba(11,37,69,0.04)',
    md: '0 4px 12px rgba(11,37,69,0.08)',
    lg: '0 12px 32px rgba(11,37,69,0.12)'
  },
  font: {
    display: '"Fraunces", "Georgia", serif',
    body: '"Inter", "Helvetica Neue", sans-serif',
    mono: '"IBM Plex Mono", monospace'
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: tokens.color.navy,
      light: tokens.color.navySoft,
      dark: tokens.color.navyDeep,
      contrastText: '#fff'
    },
    secondary: {
      main: tokens.color.gold,
      light: tokens.color.goldSoft,
      dark: '#A5822F',
      contrastText: tokens.color.navyDeep
    },
    success: { main: tokens.color.success, light: tokens.color.successSoft },
    warning: { main: tokens.color.warning, light: tokens.color.warningSoft },
    error: { main: tokens.color.danger, light: tokens.color.dangerSoft },
    info: { main: tokens.color.info, light: tokens.color.infoSoft },
    background: { default: tokens.color.cream, paper: tokens.color.surface },
    text: { primary: tokens.color.ink, secondary: tokens.color.inkMuted },
    divider: tokens.color.line
  },
  shape: { borderRadius: tokens.radius.md },
  typography: {
    fontFamily: tokens.font.body,
    h1: { fontFamily: tokens.font.display, fontWeight: 600, letterSpacing: '-0.01em' },
    h2: { fontFamily: tokens.font.display, fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontFamily: tokens.font.display, fontWeight: 600 },
    h4: { fontFamily: tokens.font.display, fontWeight: 600 },
    h5: { fontFamily: tokens.font.display, fontWeight: 600 },
    h6: { fontFamily: tokens.font.display, fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
    overline: { fontFamily: tokens.font.mono, letterSpacing: '0.12em' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.color.cream }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.color.surface,
          color: tokens.color.ink,
          boxShadow: tokens.shadow.sm,
          borderBottom: `1px solid ${tokens.color.line}`
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: tokens.color.navyDeep,
          color: alpha('#fff', 0.86),
          borderRight: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          paddingInline: 16,
          boxShadow: 'none',
          // Zone tactile minimale (44px) sur mobile
          '@media (max-width: 600px)': { minHeight: 44 }
        },
        containedPrimary: {
          boxShadow: tokens.shadow.sm,
          '&:hover': { boxShadow: tokens.shadow.md }
        },
        containedSecondary: {
          color: tokens.color.navyDeep,
          boxShadow: tokens.shadow.sm,
          '&:hover': { boxShadow: tokens.shadow.md }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': { minHeight: 44, minWidth: 44 }
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': { minHeight: 44 }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': { minHeight: 44 }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: tokens.radius.sm }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.lg,
          border: `1px solid ${tokens.color.line}`,
          boxShadow: tokens.shadow.sm
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: tokens.color.line },
        head: {
          fontWeight: 700,
          color: tokens.color.inkMuted,
          backgroundColor: tokens.color.cream
        }
      }
    },
    MuiTextField: {
      defaultProps: { size: 'small' }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: tokens.radius.sm }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.color.navyDeep,
          fontSize: '0.75rem',
          borderRadius: tokens.radius.sm
        }
      }
    }
  }
});

export default theme;