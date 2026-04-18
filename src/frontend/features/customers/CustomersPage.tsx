import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useDemoPortalData } from '../../hooks/useDemoPortalData';

function roMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatAddress(address: { line1: string; line2?: string; city: string; state: string; postalCode: string }) {
  return [address.line1, address.line2, `${address.city}, ${address.state} ${address.postalCode}`].filter(Boolean).join(', ');
}

export function CustomersPage() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const portal = useDemoPortalData();
  const [quickSearch, setQuickSearch] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [addressFilter, setAddressFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const customers = portal.data?.sampleCustomers ?? [];
  const ros = portal.data?.sampleRos ?? [];

  const filteredCustomers = useMemo(() => {
    const query = quickSearch.trim().toLowerCase();
    const addressQuery = addressFilter.trim().toLowerCase();
    const phoneQuery = phoneFilter.trim().toLowerCase();
    const vehicleQuery = vehicleFilter.trim().toLowerCase();

    return customers.filter((customer) => {
      const quickMatch = !query || [customer.customerName, customer.customerId].join(' ').toLowerCase().includes(query);
      const addressMatch = !addressQuery || formatAddress(customer.address).toLowerCase().includes(addressQuery);
      const phoneMatch = !phoneQuery || customer.phone.toLowerCase().includes(phoneQuery);
      const vehicleSummary = customer.vehicles.map((vehicle) => [vehicle.year, vehicle.make, vehicle.model, vehicle.vin, vehicle.licensePlate].join(' ')).join(' ');
      const vehicleMatch = !vehicleQuery || vehicleSummary.toLowerCase().includes(vehicleQuery);
      return quickMatch && addressMatch && phoneMatch && vehicleMatch;
    });
  }, [addressFilter, customers, phoneFilter, quickSearch, vehicleFilter]);

  const selectedCustomer = selectedCustomerId ? customers.find((customer) => customer.customerId === selectedCustomerId) : undefined;
  const selectedCustomerRos = selectedCustomer
    ? ros.filter((ro) => ro.customerName.toLowerCase() === selectedCustomer.customerName.toLowerCase())
    : [];
  const selectedOpenRos = selectedCustomerRos.filter((ro) => ro.status === 'open');
  const selectedPastRos = selectedCustomerRos.filter((ro) => ro.status === 'closed');

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,253,249,0.98) 0%, rgba(248,243,237,0.96) 100%)',
          border: '1px solid rgba(18, 32, 51, 0.08)'
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary' }}>
          Customer record browser
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          Customers
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 880 }}>
          Quick search uses only customer name and customer ID. Use advanced filters for address, phone, or vehicle details.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Quick search"
              placeholder="Customer name or ID"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              fullWidth
            />
            <Button variant="text" onClick={() => setAdvancedOpen((current) => !current)} sx={{ width: 'fit-content', px: 0 }}>
              {advancedOpen ? 'Hide advanced filters' : 'Show advanced filters'}
            </Button>
            {advancedOpen ? (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField label="Address" placeholder="Street, city, or ZIP" value={addressFilter} onChange={(e) => setAddressFilter(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Phone" placeholder="Phone number" value={phoneFilter} onChange={(e) => setPhoneFilter(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField label="Vehicle / VIN / Plate" placeholder="Vehicle, VIN, or plate" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} fullWidth />
                </Grid>
              </Grid>
            ) : null}
            <Typography color="text.secondary">
              {filteredCustomers.length} customer{filteredCustomers.length === 1 ? '' : 's'} found
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {filteredCustomers.map((customer) => {
          const customerRos = ros.filter((ro) => ro.customerName.toLowerCase() === customer.customerName.toLowerCase());
          const openCount = customerRos.filter((ro) => ro.status === 'open').length;
          const pastCount = customerRos.filter((ro) => ro.status === 'closed').length;

          return (
            <Grid item xs={12} md={6} lg={4} key={customer.customerId}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea onClick={() => setSelectedCustomerId(customer.customerId)} sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                        <Box>
                          <Typography variant="h6">{customer.customerName}</Typography>
                          <Typography color="text.secondary">ID {customer.customerId}</Typography>
                        </Box>
                        <Chip label={customer.tokenOnFile ? 'Token on file' : 'No token'} color={customer.tokenOnFile ? 'success' : 'default'} variant="outlined" />
                      </Stack>
                      <Divider />
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label={`${openCount} open RO${openCount === 1 ? '' : 's'}`} size="small" variant="outlined" color="primary" />
                        <Chip label={`${pastCount} past RO${pastCount === 1 ? '' : 's'}`} size="small" variant="outlined" />
                        <Chip label={`${customer.vehicles.length} vehicle${customer.vehicles.length === 1 ? '' : 's'}`} size="small" variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Tap to view customer details, vehicles, token summary, and open RO list.
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={Boolean(selectedCustomer)} onClose={() => setSelectedCustomerId(null)} fullScreen={fullScreen} fullWidth maxWidth="md">
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          {selectedCustomer ? (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="h5">{selectedCustomer.customerName}</Typography>
                <Typography color="text.secondary">Customer ID: {selectedCustomer.customerId}</Typography>
              </Box>

              <Divider />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={selectedCustomer.tokenOnFile ? 'Token on file' : 'No token on file'} color={selectedCustomer.tokenOnFile ? 'success' : 'default'} />
                <Chip label={`${selectedCustomer.vehicles.length} vehicle${selectedCustomer.vehicles.length === 1 ? '' : 's'}`} variant="outlined" />
                <Chip label={`${selectedOpenRos.length} open RO${selectedOpenRos.length === 1 ? '' : 's'}`} variant="outlined" />
                <Chip label={`${selectedPastRos.length} past RO${selectedPastRos.length === 1 ? '' : 's'}`} variant="outlined" />
              </Stack>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Contact and address
                    </Typography>
                    <Typography fontWeight={700}>{formatAddress(selectedCustomer.address)}</Typography>
                    <Typography color="text.secondary">Phone: {selectedCustomer.phone}</Typography>
                    <Typography color="text.secondary">Preferred method: {selectedCustomer.preferredMethod}</Typography>
                    <Typography color="text.secondary">Default MID: {selectedCustomer.defaultRoutingMid}</Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Token summary
                    </Typography>
                    {selectedCustomer.tokens.length ? (
                      selectedCustomer.tokens.map((token) => (
                        <Box key={token.tokenId} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(18,32,51,0.08)' }}>
                          <Typography fontWeight={700}>
                            {token.brand} **** {token.last4}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {token.isDefault ? 'Default token' : 'Secondary token'}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No token metadata stored for this customer.
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vehicles owned
                    </Typography>
                    {selectedCustomer.vehicles.map((vehicle) => (
                      <Box key={vehicle.vehicleId} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(18,32,51,0.08)' }}>
                        <Typography fontWeight={700}>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          VIN: {vehicle.vin}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Plate: {vehicle.licensePlate} {vehicle.isPrimary ? '(primary)' : ''}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Open ROs
                    </Typography>
                    {selectedOpenRos.length ? (
                      selectedOpenRos.map((ro) => (
                        <Card key={ro.roNumber} variant="outlined" sx={{ borderColor: 'rgba(18,32,51,0.08)' }}>
                          <CardActionArea component={Link} to={`/payments/new?ro=${ro.roNumber}&customer=${encodeURIComponent(selectedCustomer.customerName)}`}>
                            <CardContent>
                              <Stack spacing={0.5}>
                                <Typography fontWeight={800}>{ro.roNumber}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Balance due {roMoney(ro.remainingBalance)} of {roMoney(ro.totalAmountDue)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Click this RO to begin payment
                                </Typography>
                              </Stack>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))
                    ) : (
                      <Alert severity="info">No open ROs for this customer.</Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Past RO / service history
                    </Typography>
                    {selectedPastRos.length ? (
                      selectedPastRos.map((ro) => (
                        <Box key={ro.roNumber} sx={{ p: 1.5, borderRadius: 2, border: '1px solid rgba(18,32,51,0.08)' }}>
                          <Typography fontWeight={700}>{ro.roNumber}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Closed RO {roMoney(ro.totalAmountDue)} on this account
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No past RO history in the demo dataset.
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
