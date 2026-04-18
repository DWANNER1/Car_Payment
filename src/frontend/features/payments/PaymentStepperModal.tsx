import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReceiptPreviewCard } from './ReceiptPreviewCard';
import type { PaymentMethod, ReceiptPreview } from '../../../shared/payment';
import { useDemoPortalData } from '../../hooks/useDemoPortalData';
import { useReceiptConfig } from '../../hooks/useReceiptConfig';
import { useSurchargeConfig } from '../../hooks/useSurchargeConfig';

const fallbackReceiptConfig = {
  print: {
    businessName: 'Northline Automotive Group',
    receiptTitle: 'Customer Copy',
    tagline: 'Printed receipt for cashier and customer records',
    addressLine1: '1048 East Commerce Blvd',
    addressLine2: 'Austin, TX 78758',
    contactLine: '512-555-0144 | receipts@northlineauto.com',
    footerNote: 'Keep this receipt for warranty and accounting questions.'
  },
  email: {
    businessName: 'Northline Automotive Group',
    receiptTitle: 'Email Receipt',
    tagline: 'Summary sent to the customer inbox',
    addressLine1: 'Service desk: support@northlineauto.com',
    addressLine2: 'Customer service hours: Mon-Fri 7:00 AM - 6:00 PM',
    contactLine: 'Reply to this email for payment questions',
    footerNote: 'Digital copy includes masked card data and transaction reference.'
  },
  text: {
    businessName: 'Northline Automotive Group',
    receiptTitle: 'Text Receipt',
    tagline: 'Short form receipt for mobile delivery',
    addressLine1: 'Reply HELP for support',
    addressLine2: 'Reply STOP to opt out',
    contactLine: 'Payments and receipts via SMS',
    footerNote: 'Message contains only the essential transaction summary.'
  }
} as const;

const steps = ['Confirm RO', 'Select Method', 'Review Charge', 'Receipt'];

const fallbackRos = [
  {
    roNumber: 'RO-10001',
    customerName: 'Avery Johnson',
    vin: '1C4RJEBG1RC123001',
    status: 'open' as const,
    totalAmountDue: 184,
    remainingBalance: 184,
    defaultRoutingMid: 'MID-SERVICE-DEMO',
    lineItems: [
      { lineId: 'L-10001-1', description: 'Brake pads and rotors', departmentId: 'parts', departmentName: 'Parts', amount: 98, category: 'parts' as const },
      { lineId: 'L-10001-2', description: 'Brake inspection and labor', departmentId: 'service', departmentName: 'Service', amount: 86, category: 'service' as const }
    ]
  },
  {
    roNumber: 'RO-10002',
    customerName: 'Maria Chen',
    vin: '1FA6P8CF2P5102002',
    status: 'open' as const,
    totalAmountDue: 129.5,
    remainingBalance: 72.5,
    defaultRoutingMid: 'MID-PARTS-DEMO',
    lineItems: [
      { lineId: 'L-10002-1', description: 'Oil change package', departmentId: 'service', departmentName: 'Service', amount: 72.5, category: 'service' as const },
      { lineId: 'L-10002-2', description: 'Cabin air filter', departmentId: 'parts', departmentName: 'Parts', amount: 57, category: 'parts' as const }
    ]
  }
];

function paymentMethodLabel(method: PaymentMethod) {
  switch (method) {
    case 'cash':
      return 'Cash';
    case 'debit':
      return 'Debit';
    case 'credit':
      return 'Credit';
    case 'stored_token':
      return 'Stored Token / Recurring';
    default:
      return method;
  }
}

export function PaymentStepperModal({
  open,
  onClose,
  initialRoNumber,
  initialCustomerName
}: {
  open: boolean;
  onClose: () => void;
  initialRoNumber?: string;
  initialCustomerName?: string;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const portalData = useDemoPortalData();
  const receiptConfig = useReceiptConfig();
  const surchargeConfig = useSurchargeConfig();
  const sampleRos = portalData.data?.sampleRos ?? fallbackRos;
  const sampleCustomers = portalData.data?.sampleCustomers ?? [];
  const surchargeRules = surchargeConfig.data ?? { enabled: true, percentage: 3, label: 'Service Fee', dmsCode: 'NON_TAX_MISC_FEE', refundSurcharge: false };

  const [activeStep, setActiveStep] = useState(0);
  const [selectedRoNumber, setSelectedRoNumber] = useState(initialRoNumber ?? sampleRos[0]?.roNumber ?? 'RO-10001');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [departmentId, setDepartmentId] = useState(sampleRos[0]?.lineItems[0]?.departmentId ?? 'service');
  const [routingMid, setRoutingMid] = useState(sampleRos[0]?.defaultRoutingMid ?? 'MID-SERVICE-DEMO');
  const [paymentAmount, setPaymentAmount] = useState(sampleRos[0]?.remainingBalance ?? 120);
  const [saveToken, setSaveToken] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState('');
  const gatewayTransactionId = 'demo-payment-1';

  const customerFilteredRos = initialCustomerName
    ? sampleRos.filter((ro) => ro.customerName.toLowerCase() === initialCustomerName.toLowerCase())
    : sampleRos;
  const selectedRo = customerFilteredRos.find((ro) => ro.roNumber === selectedRoNumber) ?? customerFilteredRos[0] ?? sampleRos[0];
  const selectedCustomer = initialCustomerName
    ? sampleCustomers.find((customer) => customer.customerName.toLowerCase() === initialCustomerName.toLowerCase())
    : sampleCustomers.find((customer) => customer.customerName.toLowerCase() === selectedRo?.customerName.toLowerCase());
  const selectedCustomerTokens = selectedCustomer?.tokens ?? [];
  const storedToken =
    selectedCustomerTokens.find((token) => token.tokenId === selectedTokenId) ?? selectedCustomerTokens.find((token) => token.isDefault);

  useEffect(() => {
    if (open && initialRoNumber && initialRoNumber !== selectedRoNumber && sampleRos.some((ro) => ro.roNumber === initialRoNumber)) {
      setSelectedRoNumber(initialRoNumber);
    }
  }, [initialRoNumber, open, sampleRos, selectedRoNumber]);

  useEffect(() => {
    if (!selectedRo) return;
    setDepartmentId(selectedRo.lineItems[0]?.departmentId ?? 'service');
    setRoutingMid(selectedRo.defaultRoutingMid);
    setPaymentAmount(selectedRo.remainingBalance > 0 ? selectedRo.remainingBalance : selectedRo.totalAmountDue);
  }, [selectedRo?.defaultRoutingMid, selectedRo?.remainingBalance, selectedRo?.totalAmountDue, selectedRo?.roNumber]);

  useEffect(() => {
    if (selectedCustomerTokens.length && !selectedTokenId) {
      setSelectedTokenId(selectedCustomerTokens.find((token) => token.isDefault)?.tokenId ?? selectedCustomerTokens[0].tokenId);
    }
  }, [selectedCustomerTokens, selectedTokenId]);

  useEffect(() => {
    if (open && initialCustomerName && customerFilteredRos.length && !customerFilteredRos.some((ro) => ro.roNumber === selectedRoNumber)) {
      setSelectedRoNumber(customerFilteredRos[0].roNumber);
    }
  }, [customerFilteredRos, initialCustomerName, open, selectedRoNumber]);

  useEffect(() => {
    if (!open) {
      setActiveStep(0);
    }
  }, [open]);

  const amountBase = Math.max(0, Number(paymentAmount) || 0);
  const surchargeApplies = method === 'credit' || method === 'stored_token';
  const amountSurcharge = useMemo(
    () => (surchargeRules.enabled && surchargeApplies ? Number(((amountBase * surchargeRules.percentage) / 100).toFixed(2)) : 0),
    [amountBase, surchargeApplies, surchargeRules.enabled, surchargeRules.percentage]
  );
  const amountTotal = Number((amountBase + amountSurcharge).toFixed(2));
  const amountRemaining = Math.max(0, Number(((selectedRo?.remainingBalance ?? amountBase) - amountBase).toFixed(2)));
  const hasParts = Boolean(selectedRo?.lineItems.some((item) => item.category === 'parts'));
  const hasService = Boolean(selectedRo?.lineItems.some((item) => item.category === 'service'));
  const mixedRo = hasParts && hasService;

  const receipt: ReceiptPreview = {
    roNumber: selectedRo?.roNumber ?? 'RO-10001',
    customerName: selectedRo?.customerName ?? 'Demo Customer',
    routingMid,
    departmentId,
    amountBase,
    amountPaidNow: amountBase,
    amountRemaining,
    amountSurcharge,
    amountTotal,
    flow: method,
    reference: gatewayTransactionId,
    paymentMethodLabel:
      method === 'stored_token'
        ? storedToken
          ? `Stored Token - ${storedToken.brand} **** ${storedToken.last4}`
          : 'Stored Token'
        : paymentMethodLabel(method),
    surchargeLabel: surchargeRules.label || 'Service Fee',
    lineItems: [
      { label: 'Base amount', amount: amountBase, tone: 'default' },
      { label: surchargeRules.label || 'Service Fee', amount: amountSurcharge, tone: surchargeRules.enabled ? 'accent' : 'muted' },
      { label: 'Total paid now', amount: amountTotal, tone: 'accent' },
      { label: 'Remaining balance', amount: amountRemaining, tone: 'muted' }
    ]
  };

  return (
    <Dialog open={open} fullScreen={fullScreen} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack spacing={1}>
          <Typography variant="overline" sx={{ letterSpacing: 2, color: 'text.secondary' }}>
            Guided payment flow
          </Typography>
          <Typography variant="h5">New Payment</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 2, overflowY: 'auto' }}>
        <Stack spacing={3}>
          <Stepper activeStep={activeStep} orientation={fullScreen ? 'vertical' : 'horizontal'}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && selectedRo && (
            <Stack spacing={2}>
              <Alert severity="success">
                Sample mixed RO loaded with line items, MID routing, partial payment support, and compliance notes.
              </Alert>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={selectedRo.roNumber} color="primary" />
                      <Chip label={selectedRo.status.toUpperCase()} variant="outlined" />
                      <Chip label={selectedRo.defaultRoutingMid} color="secondary" variant="outlined" />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="h6">{selectedRo.customerName}</Typography>
                      <Typography color="text.secondary">{selectedRo.vin}</Typography>
                    </Stack>
                    <TextField select label="Sample RO" value={selectedRoNumber} onChange={(e) => setSelectedRoNumber(e.target.value)}>
                      {customerFilteredRos.map((ro) => (
                        <MenuItem key={ro.roNumber} value={ro.roNumber}>
                          {ro.roNumber} - {ro.customerName}
                        </MenuItem>
                      ))}
                    </TextField>
                    {initialCustomerName ? <Alert severity="info">Filtered to customer: {initialCustomerName}</Alert> : null}
                    <Divider />
                    <Stack spacing={1}>
                      {selectedRo.lineItems.map((item) => (
                        <Stack key={item.lineId} direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography fontWeight={650}>{item.description}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.departmentName} - {item.lineId}
                            </Typography>
                          </Box>
                          <Typography fontWeight={700}>${item.amount.toFixed(2)}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Alert severity="info">Mixed RO default routing is service MID unless the cashier overrides it before charge.</Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={2}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Payment configuration</Typography>
                    <TextField select label="Payment Method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="debit">Debit</MenuItem>
                      <MenuItem value="credit">Credit</MenuItem>
                      <MenuItem value="stored_token">Stored Token / Recurring</MenuItem>
                    </TextField>
                    {method === 'credit' ? (
                      <Alert severity="info">Credit can optionally create a token for future recurring use. No raw card data is stored.</Alert>
                    ) : null}
                    {method === 'stored_token' ? (
                      selectedCustomerTokens.length ? (
                        <TextField select label="Stored Token" value={selectedTokenId} onChange={(e) => setSelectedTokenId(e.target.value)}>
                          {selectedCustomerTokens.map((token) => (
                            <MenuItem key={token.tokenId} value={token.tokenId}>
                              {token.brand} **** {token.last4} {token.isDefault ? '(default)' : ''}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Alert severity="warning">No token is on file for this customer in demo data.</Alert>
                      )
                    ) : null}
                    {method === 'credit' ? (
                      <FormControlLabel
                        control={<Switch checked={saveToken} onChange={(_, checked) => setSaveToken(checked)} />}
                        label="Create a token for future use"
                      />
                    ) : null}
                    <TextField
                      label="Payment Amount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      helperText="Supports partial payments."
                    />
                    <TextField select label="Department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                      <MenuItem value="sales">Sales</MenuItem>
                      <MenuItem value="parts">Parts</MenuItem>
                      <MenuItem value="service">Service</MenuItem>
                      <MenuItem value="body_shop">Body Shop</MenuItem>
                    </TextField>
                    {mixedRo && (
                      <TextField
                        label="Routing MID"
                        value={routingMid}
                        onChange={(e) => setRoutingMid(e.target.value)}
                        helperText="Default is Primary Service MID. Cashier may override before Charge."
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {activeStep === 2 && (
            <Stack spacing={2}>
              <Alert severity="info">
                Charge will route to {routingMid}. Department scope: {departmentId}. Surcharge is displayed separately and posted as NON_TAX_MISC_FEE.
              </Alert>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Total Paid Now
                    </Typography>
                    <Typography variant="h5">${amountTotal.toFixed(2)}</Typography>
                    <Typography color="text.secondary">
                      Includes ${amountSurcharge.toFixed(2)} {surchargeRules.label || 'Service Fee'} on the current payment amount when allowed by method and admin settings.
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Remaining
                    </Typography>
                    <Typography variant="h5">${amountRemaining.toFixed(2)}</Typography>
                    <Typography color="text.secondary">Partial payment stays open until fully settled.</Typography>
                  </CardContent>
                </Card>
              </Stack>
              <Alert severity={surchargeRules.enabled ? 'info' : 'warning'}>
                {surchargeRules.enabled
                  ? `${surchargeRules.label || 'Service Fee'} is admin-controlled and calculated on the amount being paid now for credit or stored token payments.`
                  : `${surchargeRules.label || 'Service Fee'} is disabled in admin, so no surcharge is added.`}
              </Alert>
              {method === 'credit' && saveToken ? <Alert severity="success">A token will be created in demo mode after successful payment.</Alert> : null}
              {method === 'stored_token' && storedToken ? (
                <Alert severity="info">
                  Using stored token {storedToken.brand} **** {storedToken.last4}
                  {storedToken.isDefault ? ' (default)' : ''} without re-entering card details.
                </Alert>
              ) : null}
            </Stack>
          )}

          {activeStep === 3 && <ReceiptPreviewCard receipt={receipt} template={receiptConfig.data ?? fallbackReceiptConfig} />}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          borderTop: '1px solid rgba(18, 32, 51, 0.08)',
          backgroundColor: 'background.paper',
          position: fullScreen ? 'sticky' : 'static',
          bottom: 0,
          gap: 1,
          flexWrap: 'wrap'
        }}
      >
        <Button color="inherit" variant="text" onClick={onClose} fullWidth={fullScreen} sx={{ minWidth: { xs: '100%', sm: 110 } }}>
          Cancel
        </Button>
        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />
        <Button disabled={activeStep === 0} onClick={() => setActiveStep((step) => step - 1)} fullWidth={fullScreen} sx={{ minWidth: { xs: 'calc(50% - 4px)', sm: 90 } }}>
          Back
        </Button>
        {activeStep < 3 ? (
          <Button variant="contained" onClick={() => setActiveStep((step) => Math.min(step + 1, 3))} fullWidth={fullScreen} sx={{ minWidth: { xs: 'calc(50% - 4px)', sm: 120 } }}>
            {activeStep === 2 ? 'Preview Receipt' : 'Next'}
          </Button>
        ) : (
          <Button
            variant="contained"
            fullWidth={fullScreen}
            sx={{ minWidth: { xs: '100%', sm: 110 } }}
            onClick={() => {
              setActiveStep(0);
              onClose();
            }}
          >
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
