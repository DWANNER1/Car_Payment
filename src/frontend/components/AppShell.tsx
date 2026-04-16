import { PropsWithChildren } from 'react';
import { AppBar, Box, Button, Drawer, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 220;
const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Customers', path: '/customers' },
  { label: 'Admin', path: '/admin' }
];

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Car Payment Portal</Typography>
          <Button color="inherit" component={Link} to="/payments/new">New Payment</Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.path} component={Link} to={item.path} selected={location.pathname === item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
