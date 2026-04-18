import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useBrandingConfig, useSetBrandingConfig } from '../../hooks/useBrandingConfig';
import { useDemoMode, useSetDemoMode } from '../../hooks/useDemoMode';
import { useMidMapping, useSetMidMapping } from '../../hooks/useMidMapping';
import { TerminalHeartbeat, useTerminalHeartbeats } from '../../hooks/useTerminalHeartbeats';
import { useDemoPortalData } from '../../hooks/useDemoPortalData';
import { useReceiptConfig, useSetReceiptConfig } from '../../hooks/useReceiptConfig';
import { useSurchargeConfig, useSetSurchargeConfig } from '../../hooks/useSurchargeConfig';
import { prototypeSeed, type PrototypeSurchargeRules } from '../../../shared/prototype';
import type { BrandingConfig, ReceiptHeaderConfig, ReceiptTemplateConfig, ReceiptVariant } from '../../../shared/payment';

const defaultReceiptConfig: ReceiptTemplateConfig = {
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
};

const defaultBrandingConfig: BrandingConfig = {
  dealershipName: 'Northline Automotive Group',
  logoDataUrl: null,
  logoFileName: null
};

function ReceiptTemplateEditor({
  variant,
  value,
  onChange
}: {
  variant: ReceiptVariant;
  value: ReceiptHeaderConfig;
  onChange: (next: ReceiptHeaderConfig) => void;
}) {
  return (
    <Stack spacing={2}>
      <Alert severity="info">
        {variant === 'print'
          ? 'Printed receipt layout: use this for the paper receipt and customer copy.'
          : variant === 'email'
            ? 'Email layout: shorter header, support email, and digital-copy wording.'
            : 'Text layout: keep the copy compact for SMS delivery.'}
      </Alert>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Business Name" value={value.businessName} onChange={(e) => onChange({ ...value, businessName: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Receipt Title" value={value.receiptTitle} onChange={(e) => onChange({ ...value, receiptTitle: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Tagline" value={value.tagline} onChange={(e) => onChange({ ...value, tagline: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Address Line 1" value={value.addressLine1} onChange={(e) => onChange({ ...value, addressLine1: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Address Line 2" value={value.addressLine2} onChange={(e) => onChange({ ...value, addressLine2: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Contact Line" value={value.contactLine} onChange={(e) => onChange({ ...value, contactLine: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Footer Note" value={value.footerNote} onChange={(e) => onChange({ ...value, footerNote: e.target.value })} />
        </Grid>
      </Grid>
    </Stack>
  );
}

function SectionCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography color="text.secondary">{subtitle}</Typography>
          </Box>
          <Divider />
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function AdminPage() {
  const demoMode = useDemoMode();
  const setDemoMode = useSetDemoMode();
  const midMapping = useMidMapping();
  const setMidMapping = useSetMidMapping();
  const surchargeQuery = useSurchargeConfig();
  const setSurchargeConfig = useSetSurchargeConfig();
  const heartbeats = useTerminalHeartbeats();
  const portal = useDemoPortalData();
  const brandingQuery = useBrandingConfig();
  const setBrandingConfig = useSetBrandingConfig();
  const receiptConfigQuery = useReceiptConfig();
  const setReceiptConfig = useSetReceiptConfig();
  const [receiptVariant, setReceiptVariant] = useState<ReceiptVariant>('print');
  const [receiptConfig, setReceiptConfigState] = useState<ReceiptTemplateConfig>(defaultReceiptConfig);
  const [brandingConfig, setBrandingConfigState] = useState<BrandingConfig>(defaultBrandingConfig);
  const [surchargeConfig, setSurchargeConfigState] = useState<PrototypeSurchargeRules>(prototypeSeed.surchargeRules);

  useEffect(() => {
    if (receiptConfigQuery.data) setReceiptConfigState(receiptConfigQuery.data);
  }, [receiptConfigQuery.data]);

  useEffect(() => {
    if (brandingQuery.data) setBrandingConfigState(brandingQuery.data);
  }, [brandingQuery.data]);

  useEffect(() => {
    if (surchargeQuery.data) setSurchargeConfigState(surchargeQuery.data);
  }, [surchargeQuery.data]);

  const currentReceiptTemplate = useMemo(() => receiptConfig[receiptVariant], [receiptConfig, receiptVariant]);

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBrandingConfigState((current) => ({
        ...current,
        logoDataUrl: typeof reader.result === 'string' ? reader.result : null,
        logoFileName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          color: 'primary.contrastText',
          background: 'linear-gradient(135deg, rgba(23,50,79,0.98) 0%, rgba(138,90,52,0.94) 100%)'
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.78 }}>
          Control center
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          Admin
        </Typography>
        <Typography sx={{ mt: 1, maxWidth: 920, color: 'rgba(255,255,255,0.88)' }}>
          Demo mode, MID routing, receipt format, branding, terminal health, and portal notes are visible as sections on this page.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <SectionCard title="Demo Mode" subtitle="Keep demo mode available when live credentials are missing.">
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch checked={Boolean(demoMode.data?.enabled)} onChange={(_, checked) => setDemoMode.mutate(checked)} />}
                label={demoMode.data?.enabled ? 'Demo mode enabled' : 'Demo mode disabled'}
              />
              <Alert severity="info">Demo mode keeps the portal usable without live credentials.</Alert>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="Force post" />
                <Chip label="Partial payments" />
                <Chip label="Partial refunds" />
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <SectionCard title="MID Routing" subtitle="Mixed RO default routing and manual override.">
            <Stack spacing={2}>
              <TextField label="Parts MID" value={midMapping.data?.parts ?? ''} onChange={(e) => setMidMapping.mutate({ parts: e.target.value })} />
              <TextField label="Service MID" value={midMapping.data?.service ?? ''} onChange={(e) => setMidMapping.mutate({ service: e.target.value })} />
              <TextField label="Sales MID" value={midMapping.data?.sales ?? ''} onChange={(e) => setMidMapping.mutate({ sales: e.target.value })} />
              <TextField label="Body Shop MID" value={midMapping.data?.body_shop ?? ''} onChange={(e) => setMidMapping.mutate({ body_shop: e.target.value })} />
              <Alert severity="info">
                Mixed RO default routing still uses Primary Service MID when Parts and Service both appear, and the cashier can override it before charge.
              </Alert>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <SectionCard title="Surcharge" subtitle="Control the service fee rules from admin.">
            <Stack spacing={2}>
              <Alert severity="info">
                The surcharge is calculated on the amount being paid now, appears as a separate receipt line, and posts to DMS as a non-taxable miscellaneous fee.
              </Alert>
              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(surchargeConfig.enabled)}
                      onChange={(_, checked) => setSurchargeConfigState((current) => ({ ...current, enabled: checked }))}
                    />
                  }
                  label={surchargeConfig.enabled ? 'Surcharge enabled' : 'Surcharge disabled'}
                />
                <Chip label={surchargeConfig.dmsCode || 'NON_TAX_MISC_FEE'} variant="outlined" />
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Surcharge Percent"
                    type="number"
                    value={surchargeConfig.percentage}
                    onChange={(e) => setSurchargeConfigState((current) => ({ ...current, percentage: Number(e.target.value) }))}
                    inputProps={{ min: 0, step: 0.25 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Display Label"
                    value={surchargeConfig.label}
                    onChange={(e) => setSurchargeConfigState((current) => ({ ...current, label: e.target.value }))}
                    helperText='Defaults to "Service Fee"'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(surchargeConfig.refundSurcharge)}
                        onChange={(_, checked) => setSurchargeConfigState((current) => ({ ...current, refundSurcharge: checked }))}
                      />
                    }
                    label="Refund surcharge on partial refund"
                  />
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                <Button variant="outlined" onClick={() => setSurchargeConfigState(surchargeQuery.data ?? prototypeSeed.surchargeRules)}>
                  Reset
                </Button>
                <Button variant="contained" onClick={() => setSurchargeConfig.mutate(surchargeConfig)} disabled={setSurchargeConfig.isPending}>
                  Save Surcharge
                </Button>
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12}>
          <SectionCard title="Receipt Format" subtitle="Configure print, email, and text receipt headers separately.">
            <Stack spacing={2}>
              <Tabs
                value={receiptVariant}
                onChange={(_, nextValue) => setReceiptVariant(nextValue as ReceiptVariant)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  minHeight: 36,
                  '& .MuiTab-root': {
                    minHeight: 36,
                    minWidth: 88,
                    px: 1.25,
                    fontSize: 12
                  }
                }}
              >
                <Tab value="print" label="Print" />
                <Tab value="email" label="Email" />
                <Tab value="text" label="Text" />
              </Tabs>
              <ReceiptTemplateEditor
                variant={receiptVariant}
                value={currentReceiptTemplate}
                onChange={(next) => setReceiptConfigState((current) => ({ ...current, [receiptVariant]: next }))}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                <Button variant="outlined" onClick={() => setReceiptConfigState(receiptConfigQuery.data ?? defaultReceiptConfig)}>
                  Reset
                </Button>
                <Button variant="contained" onClick={() => setReceiptConfig.mutate(receiptConfig)} disabled={setReceiptConfig.isPending}>
                  Save Receipt Config
                </Button>
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <SectionCard title="Branding" subtitle="Upload the dealership logo for the shell and receipt.">
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dealership Name
                  </Typography>
                  <Typography variant="body1">{brandingConfig.dealershipName}</Typography>
                </Box>
                <Chip label={brandingConfig.logoFileName ?? 'No logo uploaded'} color={brandingConfig.logoDataUrl ? 'success' : 'default'} variant="outlined" />
              </Stack>
              <TextField
                label="Dealership Name"
                value={brandingConfig.dealershipName}
                onChange={(e) => setBrandingConfigState((current) => ({ ...current, dealershipName: e.target.value }))}
              />
              <Button component="label" variant="outlined" sx={{ width: 'fit-content' }}>
                Upload Logo
                <input hidden accept="image/*" type="file" onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)} />
              </Button>
              <Box
                sx={{
                  minHeight: 160,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  border: '1px dashed rgba(18, 32, 51, 0.16)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  p: 2
                }}
              >
                {brandingConfig.logoDataUrl ? (
                  <Box component="img" src={brandingConfig.logoDataUrl} alt="Dealership logo preview" sx={{ maxWidth: '100%', maxHeight: 120, objectFit: 'contain' }} />
                ) : (
                  <Typography color="text.secondary">Logo preview will appear here.</Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                <Button variant="outlined" onClick={() => setBrandingConfigState(defaultBrandingConfig)}>
                  Reset
                </Button>
                <Button variant="contained" onClick={() => setBrandingConfig.mutate(brandingConfig)} disabled={setBrandingConfig.isPending}>
                  Save Branding
                </Button>
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} lg={6}>
          <SectionCard title="Terminal Health" subtitle="Terminal heartbeat monitor.">
            <Stack spacing={1.5}>
              {(heartbeats.data ?? []).map((item: TerminalHeartbeat) => (
                <Alert key={item.terminalId} severity={item.status === 'online' ? 'success' : item.status === 'offline' ? 'warning' : 'info'}>
                  {item.terminalId} - {item.status} - last heartbeat {item.lastHeartbeatAt}
                </Alert>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12}>
          <SectionCard title="Portal Notes" subtitle="Demo guidance and PM rules surfaced in one place.">
            <Stack spacing={1.5}>
              {(portal.data?.portalNotes ?? []).map((note) => (
                <Alert key={note} severity="info">
                  {note}
                </Alert>
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
