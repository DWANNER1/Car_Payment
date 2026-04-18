import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#17324f',
      light: '#3d5770',
      dark: '#0d1f33',
      contrastText: '#f7f3ec'
    },
    secondary: {
      main: '#8a5a34',
      light: '#ad7b50',
      dark: '#5d3b20',
      contrastText: '#fffaf4'
    },
    info: {
      main: '#0f766e'
    },
    success: {
      main: '#1f7a57'
    },
    warning: {
      main: '#b86a18'
    },
    background: {
      default: '#f4efe8',
      paper: '#fffdf9'
    },
    text: {
      primary: '#122033',
      secondary: '#5b6572'
    },
    divider: 'rgba(18, 32, 51, 0.12)'
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.04em'
    },
    h2: {
      fontWeight: 750,
      letterSpacing: '-0.035em'
    },
    h3: {
      fontWeight: 720,
      letterSpacing: '-0.03em'
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em'
    },
    h5: {
      fontWeight: 650
    },
    h6: {
      fontWeight: 650
    },
    button: {
      textTransform: 'none',
      fontWeight: 650
    }
  },
  shape: {
    borderRadius: 18
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            radial-gradient(circle at top left, rgba(23, 50, 79, 0.12), transparent 32%),
            radial-gradient(circle at top right, rgba(138, 90, 52, 0.1), transparent 28%),
            linear-gradient(180deg, #f7f2eb 0%, #efe7dc 100%)
          `,
          backgroundAttachment: 'fixed'
        },
        '#root': {
          minHeight: '100vh'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#fffdf9', 0.72),
          color: '#122033',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(18, 32, 51, 0.08)'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 999
        },
        contained: {
          boxShadow: '0 14px 28px rgba(23, 50, 79, 0.16)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(18, 32, 51, 0.08)',
          boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background:
            'linear-gradient(180deg, rgba(255,253,249,0.96) 0%, rgba(247,242,235,0.94) 100%)',
          borderRight: '1px solid rgba(18, 32, 51, 0.08)'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small'
      }
    }
  }
});

export const appTheme = responsiveFontSizes(baseTheme);
