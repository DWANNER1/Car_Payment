import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material';
import { useRoLookup } from '../../hooks/useRoLookup';
import {
  useCreateTerminalSale,
  useCreateTokenSale,
  useFinalizePayment
} from '../../hooks/usePaymentMutations';

const steps = ['Confirm RO', 'Select Method', 'Terminal or Token', 'Finalize'];

export function PaymentStepperModal({ open }: { open: boolean }) {
  const [activeStep, setActiveStep] = useState(0);
  const [roQuery, setRoQuery] = useState('10001');
  const [method, setMethod] = useState<'terminal' | 'token' | 'credit'>('terminal');
  const [tpn, setTpn] = useState('TPN-001');
  const [token, setToken] = useState('tok_demo_123');
  const [gatewayTransactionId, setGatewayTransactionId] = useState('');
  const [finalized, setFinalized] = useState(false);

  const roLookup = useRoLookup(roQuery);
  const repairOrder = roLookup.data?.[0];

  const terminalSale = useCreateTerminalSale();
  const tokenSale = useCreateTokenSale();
  const finalizePayment = useFinalizePayment();

  const amountTotal = useMemo(() => {
    const base = repairOrder?.totalAmountDue ?? 0;
    return method === 'credit' ? Number((base * 1.03).toFixed(2)) : base;
  }, [repairOrder, method]);

  const canContinue = useMemo(() => {
    if (activeStep === 0) return Boolean(repairOrder && repairOrder.status === 'open');
    if (activeStep === 1) return Boolean(method);
    if (activeStep === 2) {
      return method === 'terminal' || method === 'credit'
        ? tpn.trim().length >= 3
        : token.trim().length >= 6;
    }
    return true;
  }, [activeStep, method, repairOrder, token, tpn]);

  const errorMessage = terminalSale.error?.message || tokenSale.error?.message || finalizePayment.error?.message;

  const handlePrimary = async () => {
    if (activeStep < 2) {
      setActiveStep((step) => Math.min(step + 1, steps.length - 1));
      return;
    }

    if (activeStep === 2 && repairOrder) {
      if (method === 'terminal' || method === 'credit') {
        const result = await terminalSale.mutateAsync({
          roNumber: repairOrder.ro_number,
          tpn,
          amount: amountTotal
        });
        setGatewayTransactionId(result.transactionId);
      } else {
        const result = await tokenSale.mutateAsync({
          roNumber: repairOrder.ro_number,
          cardToken: token,
          amount: amountTotal,
          description: `RO ${repairOrder.ro_number}`
        });
        setGatewayTransactionId(result.transactionId);
      }

      setActiveStep(3);
      return;
    }

    if (activeStep === 3 && repairOrder) {
      await finalizePayment.mutateAsync({
        roNumber: repairOrder.ro_number,
        authCode: 'AUTH-STUB',
        finalAmount: amountTotal,
        gatewayTransactionId: gatewayTransactionId || 'pending-gateway-id'
      });
      setFinalized(true);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle>Payment Stepper</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {finalized && <Alert severity="success">Payment finalized and ready for DMS write-back tracking.</Alert>}

          {activeStep === 0 && (
            <Stack spacing={2}>
              <TextField
                label="Repair Order Number"
                value={roQuery}
                onChange={(e) => setRoQuery(e.target.value)}
              />
              {repairOrder && (
                <Alert severity={repairOrder.status === 'open' ? 'success' : 'warning'}>
                  RO {repairOrder.ro_number} • {repairOrder.customer_name} • Base amount ${repairOrder.totalAmountDue}
                </Alert>
              )}
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={2}>
              <TextField select label="Payment Mode" value={method} onChange={(e) => setMethod(e.target.value as 'terminal' | 'token' | 'credit')}>
                <MenuItem value="terminal">Terminal</MenuItem>
                <MenuItem value="token">Stored Token</MenuItem>
                <MenuItem value="credit">Credit with Surcharge Preview</MenuItem>
              </TextField>
              <Alert severity="info">Projected total: ${amountTotal.toFixed(2)}</Alert>
            </Stack>
          )}

          {activeStep === 2 && (
            <Stack spacing={2}>
              {method === 'terminal' || method === 'credit' ? (
                <TextField label="Terminal TPN" value={tpn} onChange={(e) => setTpn(e.target.value)} helperText="Enter a valid terminal identifier." />
              ) : (
                <TextField label="Stored Card Token" value={token} onChange={(e) => setToken(e.target.value)} helperText="Token must be at least 6 characters." />
              )}
            </Stack>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="subtitle1">Receipt Preview</Typography>
              <Typography color="text.secondary">
                RO: {repairOrder?.ro_number ?? '--'} | Amount: ${amountTotal.toFixed(2)} | Flow: {method}
              </Typography>
              <Typography color="text.secondary">
                Gateway transaction: {gatewayTransactionId || 'Pending'}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={activeStep === 0 || terminalSale.isPending || tokenSale.isPending || finalizePayment.isPending} onClick={() => setActiveStep((step) => step - 1)}>
          Back
        </Button>
        <Button variant="contained" disabled={!canContinue || terminalSale.isPending || tokenSale.isPending || finalizePayment.isPending || finalized} onClick={handlePrimary}>
          {activeStep === steps.length - 1 ? (finalized ? 'Completed' : 'Finalize') : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
