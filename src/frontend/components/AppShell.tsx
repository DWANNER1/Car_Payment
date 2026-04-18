import { PropsWithChildren } from 'react';
import { alpha } from '@mui/material/styles';
import { AppBar, Box, Button, Chip, Divider, Drawer, List, ListItemButton, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useBrandingConfig } from '../hooks/useBrandingConfig';

const drawerWidth = 240;
const navItems = [
  { label: 'Transactions', path: '/transactions' },
  { label: 'Payments', path: '/payments/new' },
  { label: 'Customers', path: '/customers' },
  { label: 'Admin', path: '/admin' },
  { label: 'Dashboard', path: '/' }
];

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const branding = useBrandingConfig();
  const logoDataUrl = branding.data?.logoDataUrl;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(23,50,79,0.15), transparent 28%), radial-gradient(circle at top right, rgba(138,90,52,0.12), transparent 22%), linear-gradient(180deg, rgba(247,242,235,1) 0%, rgba(239,231,220,1) 100%)'
      }}
    >
      <AppBar position="sticky" elevation={0}>
        <Toolbar
          sx={{
            minHeight: { xs: 68, md: 76 },
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
            {logoDataUrl ? (
              <Box component="img" src={logoDataUrl} alt="Dealership logo" sx={{ width: 48, height: 48, objectFit: 'contain' }} />
            ) : (
              <Box sx={{ width: 48, height: 48, borderRadius: 3, background: 'linear-gradient(135deg, #17324f 0%, #0f766e 100%)' }} />
            )}
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary', lineHeight: 1 }}>
                Automotive Finance Desk
              </Typography>
              <Typography variant="h6" sx={{ lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {branding.data?.dealershipName ?? 'Car Payment Portal'}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Chip
              label="Demo"
              size="small"
              sx={{
                borderRadius: 999,
                backgroundColor: alpha('#0f766e', 0.12),
                color: '#0f766e',
                fontWeight: 700
              }}
            />
            <Button variant="contained" component={Link} to="/payments/new" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              Run Payment
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              background: 'transparent'
            }
          }}
        >
          <Toolbar />
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                borderRadius: 4,
                p: 2,
                mb: 2,
                color: 'primary.contrastText',
                background: 'linear-gradient(135deg, rgba(23,50,79,0.98), rgba(15,118,110,0.92))',
                boxShadow: '0 20px 40px rgba(15,23,42,0.16)'
              }}
            >
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Dealership Ops
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: alpha('#fffdf9', 0.9) }}>
                Demo mode, surcharge, receipt, and sync recovery in one place.
              </Typography>
            </Box>
            <Divider sx={{ mb: 2, opacity: 0.6 }} />
            <List sx={{ display: 'grid', gap: 0.75, p: 0 }}>
              {navItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 3,
                    minHeight: 48,
                    px: 1.5,
                    border: '1px solid transparent',
                    '&.Mui-selected': {
                      backgroundColor: alpha('#17324f', 0.08),
                      borderColor: alpha('#17324f', 0.12)
                    }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 700 : 600
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            px: { xs: 1.5, sm: 2.5, md: 4 },
            pb: { xs: 10, md: 4 }
          }}
        >
          <Box sx={{ maxWidth: 1440, mx: 'auto', mt: 2 }}>{children}</Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: 'grid', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 0,
          backgroundColor: 'rgba(255,253,249,0.98)',
          borderTop: '1px solid rgba(18, 32, 51, 0.12)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 -12px 30px rgba(15,23,42,0.12)',
          zIndex: 1200
        }}
      >
        {navItems.map((item) => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            variant={isActive(item.path) ? 'contained' : 'text'}
            sx={{
              borderRadius: 0,
              minHeight: 44,
              fontSize: 10,
              fontWeight: 700,
              px: 0.25,
              py: 0.5,
              lineHeight: 1.1,
              whiteSpace: 'nowrap'
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
