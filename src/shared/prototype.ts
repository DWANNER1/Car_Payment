import type { BrandingConfig, ReceiptTemplateConfig, TokenMetadata } from './payment.js';

export type PrototypeLineCategory = 'sales' | 'parts' | 'service' | 'other';
export type TerminalStatus = 'online' | 'offline' | 'unknown';

export interface PrototypeLineItem {
  lineId: string;
  description: string;
  departmentId: string;
  departmentName: string;
  amount: number;
  category: PrototypeLineCategory;
}

export interface PrototypeRo {
  roNumber: string;
  customerName: string;
  vin: string;
  status: 'open' | 'closed';
  totalAmountDue: number;
  remainingBalance: number;
  defaultRoutingMid: string;
  createdAt: string;
  lineItems: PrototypeLineItem[];
}

export interface PrototypeCustomer {
  customerId: string;
  customerName: string;
  vehicle: string;
  preferredMethod: string;
  defaultRoutingMid: string;
  openRos: number;
  tokenOnFile: boolean;
  tokens: TokenMetadata[];
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  phone: string;
  vehicles: {
    vehicleId: string;
    year: number;
    make: string;
    model: string;
    vin: string;
    licensePlate: string;
    isPrimary: boolean;
  }[];
}

export interface PrototypeTransaction {
  gatewayTransactionId: string;
  roNumber: string;
  amount: number;
  status: 'accepted' | 'finalized' | 'failed';
  departmentId: string;
  dmsPosted: boolean;
  routingMid: string;
  paymentFlow: 'terminal' | 'token' | 'cash' | 'debit' | 'credit' | 'stored_token';
  surchargeAmount: number;
  createdAt: string;
  dmsSyncError?: string;
  refundAmount?: number;
}

export interface PrototypeSurchargeRules {
  enabled: boolean;
  percentage: number;
  label: string;
  dmsCode: string;
  refundSurcharge: boolean;
}

export interface PrototypeTerminalHeartbeat {
  terminalId: string;
  status: TerminalStatus;
  lastHeartbeatAt: string;
}

export interface PrototypeData {
  demoModeEnabled: boolean;
  generatedAt: string;
  surchargeRules: PrototypeSurchargeRules;
  midMapping: {
    parts: string;
    service: string;
    sales: string;
    body_shop: string;
  };
  receiptConfig: ReceiptTemplateConfig;
  branding: BrandingConfig;
  stats: { label: string; value: string }[];
  sampleRos: PrototypeRo[];
  sampleCustomers: PrototypeCustomer[];
  sampleTransactions: PrototypeTransaction[];
  terminalHeartbeats: PrototypeTerminalHeartbeat[];
  portalNotes: string[];
}

const receiptConfig: ReceiptTemplateConfig = {
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

const branding: BrandingConfig = {
  dealershipName: 'Northline Automotive Group',
  logoDataUrl: null,
  logoFileName: null
};

export const prototypeSeed: PrototypeData = {
  demoModeEnabled: true,
  generatedAt: '2026-04-17T15:00:00.000Z',
  surchargeRules: {
    enabled: true,
    percentage: 3,
    label: 'Service Fee',
    dmsCode: 'NON_TAX_MISC_FEE',
    refundSurcharge: false
  },
  midMapping: {
    parts: 'MID-PARTS-DEMO',
    service: 'MID-SERVICE-DEMO',
    sales: 'MID-SALES-DEMO',
    body_shop: 'MID-BODY-DEMO'
  },
  receiptConfig,
  branding,
  stats: [
    { label: 'Sample ROs', value: '13' },
    { label: 'Sample Customers', value: '10' },
    { label: 'Active Transactions', value: '10' },
    { label: 'Terminal Health', value: '3' }
  ],
  sampleRos: [
    {
      roNumber: 'RO-10001',
      customerName: 'Avery Johnson',
      vin: '1C4RJEBG1RC123001',
      status: 'open',
      totalAmountDue: 184,
      remainingBalance: 184,
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      createdAt: '2026-04-02T09:12:00.000Z',
      lineItems: [
        { lineId: 'L-10001-1', description: 'Brake pads and rotors', departmentId: 'parts', departmentName: 'Parts', amount: 98, category: 'parts' },
        { lineId: 'L-10001-2', description: 'Brake inspection and labor', departmentId: 'service', departmentName: 'Service', amount: 86, category: 'service' }
      ]
    },
    {
      roNumber: 'RO-10002',
      customerName: 'Maria Chen',
      vin: '1FA6P8CF2P5102002',
      status: 'open',
      totalAmountDue: 129.5,
      remainingBalance: 72.5,
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      createdAt: '2026-04-03T11:45:00.000Z',
      lineItems: [
        { lineId: 'L-10002-1', description: 'Oil change package', departmentId: 'service', departmentName: 'Service', amount: 72.5, category: 'service' },
        { lineId: 'L-10002-2', description: 'Cabin air filter', departmentId: 'parts', departmentName: 'Parts', amount: 57, category: 'parts' }
      ]
    },
    {
      roNumber: 'RO-10011',
      customerName: 'Maria Chen',
      vin: '1FA6P8CF2P5102002',
      status: 'open',
      totalAmountDue: 58.75,
      remainingBalance: 58.75,
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      createdAt: '2026-04-06T15:22:00.000Z',
      lineItems: [
        { lineId: 'L-10011-1', description: 'Tire pressure monitor reset', departmentId: 'service', departmentName: 'Service', amount: 58.75, category: 'service' }
      ]
    },
    {
      roNumber: 'RO-10012',
      customerName: 'Maria Chen',
      vin: '1FA6P8CF2P5102002',
      status: 'open',
      totalAmountDue: 214.2,
      remainingBalance: 214.2,
      defaultRoutingMid: 'MID-PARTS-DEMO',
      createdAt: '2026-04-07T10:30:00.000Z',
      lineItems: [
        { lineId: 'L-10012-1', description: 'Custom wheel package', departmentId: 'parts', departmentName: 'Parts', amount: 214.2, category: 'parts' }
      ]
    },
    {
      roNumber: 'RO-10013',
      customerName: 'Maria Chen',
      vin: '1FA6P8CF2P5102002',
      status: 'closed',
      totalAmountDue: 41.25,
      remainingBalance: 0,
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      createdAt: '2026-04-08T14:00:00.000Z',
      lineItems: [
        { lineId: 'L-10013-1', description: 'Cabin air filter replacement', departmentId: 'parts', departmentName: 'Parts', amount: 41.25, category: 'parts' }
      ]
    },
    {
      roNumber: 'RO-10003',
      customerName: 'Andre Williams',
      vin: '3GNAXUEV6PS101003',
      status: 'closed',
      totalAmountDue: 28650,
      remainingBalance: 0,
      defaultRoutingMid: 'MID-SALES-DEMO',
      createdAt: '2026-03-28T16:05:00.000Z',
      lineItems: [
        { lineId: 'L-10003-1', description: 'Vehicle sale deposit', departmentId: 'sales', departmentName: 'Sales', amount: 5000, category: 'sales' },
        { lineId: 'L-10003-2', description: 'Delivery documentation and fees', departmentId: 'sales', departmentName: 'Sales', amount: 23650, category: 'sales' }
      ]
    },
    {
      roNumber: 'RO-10004',
      customerName: 'Nina Patel',
      vin: '5YJ3E1EA6MF000404',
      status: 'open',
      totalAmountDue: 82.4,
      remainingBalance: 41.2,
      defaultRoutingMid: 'MID-PARTS-DEMO',
      createdAt: '2026-04-04T08:25:00.000Z',
      lineItems: [
        { lineId: 'L-10004-1', description: 'Air filter replacement', departmentId: 'parts', departmentName: 'Parts', amount: 24.9, category: 'parts' },
        { lineId: 'L-10004-2', description: 'Wiper blades', departmentId: 'parts', departmentName: 'Parts', amount: 17.5, category: 'parts' },
        { lineId: 'L-10004-3', description: 'Install labor', departmentId: 'service', departmentName: 'Service', amount: 40, category: 'service' }
      ]
    },
    {
      roNumber: 'RO-10005',
      customerName: 'Jordan Brooks',
      vin: '1N4BL4CV0PN050505',
      status: 'open',
      totalAmountDue: 314.75,
      remainingBalance: 104.75,
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      createdAt: '2026-04-04T13:15:00.000Z',
      lineItems: [
        { lineId: 'L-10005-1', description: 'Factory scheduled maintenance', departmentId: 'service', departmentName: 'Service', amount: 214.75, category: 'service' },
        { lineId: 'L-10005-2', description: 'Brake fluid flush', departmentId: 'service', departmentName: 'Service', amount: 100, category: 'service' }
      ]
    },
    {
      roNumber: 'RO-10006',
      customerName: 'Sofia Ramirez',
      vin: 'KMHD84LF2MU606606',
      status: 'open',
      totalAmountDue: 512,
      remainingBalance: 212,
      defaultRoutingMid: 'MID-SALES-DEMO',
      createdAt: '2026-04-05T10:10:00.000Z',
      lineItems: [
        { lineId: 'L-10006-1', description: 'New vehicle preparation', departmentId: 'sales', departmentName: 'Sales', amount: 320, category: 'sales' },
        { lineId: 'L-10006-2', description: 'Detailing and delivery inspection', departmentId: 'service', departmentName: 'Service', amount: 192, category: 'service' }
      ]
    },
    {
      roNumber: 'RO-10007',
      customerName: 'Caleb Thompson',
      vin: '1GCPYCEF7MZ707707',
      status: 'open',
      totalAmountDue: 229.99,
      remainingBalance: 129.99,
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      createdAt: '2026-04-06T12:40:00.000Z',
      lineItems: [
        { lineId: 'L-10007-1', description: 'Tire rotation and balance', departmentId: 'service', departmentName: 'Service', amount: 79.99, category: 'service' },
        { lineId: 'L-10007-2', description: 'Wheel lug kit', departmentId: 'parts', departmentName: 'Parts', amount: 150, category: 'parts' }
      ]
    },
    {
      roNumber: 'RO-10008',
      customerName: 'Priya Desai',
      vin: 'W1KLF4HB5NU808808',
      status: 'closed',
      totalAmountDue: 64.5,
      remainingBalance: 0,
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      createdAt: '2026-04-07T09:00:00.000Z',
      lineItems: [{ lineId: 'L-10008-1', description: 'Battery diagnostic', departmentId: 'service', departmentName: 'Service', amount: 64.5, category: 'service' }]
    },
    {
      roNumber: 'RO-10009',
      customerName: 'Evan Martinez',
      vin: '2HGFE2F57MH909909',
      status: 'open',
      totalAmountDue: 148.25,
      remainingBalance: 148.25,
      defaultRoutingMid: 'MID-PARTS-DEMO',
      createdAt: '2026-04-08T11:55:00.000Z',
      lineItems: [
        { lineId: 'L-10009-1', description: 'Brake caliper kit', departmentId: 'parts', departmentName: 'Parts', amount: 98.25, category: 'parts' },
        { lineId: 'L-10009-2', description: 'Shop supplies', departmentId: 'service', departmentName: 'Service', amount: 50, category: 'service' }
      ]
    },
    {
      roNumber: 'RO-10010',
      customerName: 'Harper Wilson',
      vin: '5NMS5CAD0MH010010',
      status: 'closed',
      totalAmountDue: 957.33,
      remainingBalance: 0,
      defaultRoutingMid: 'MID-SALES-DEMO',
      createdAt: '2026-03-30T17:30:00.000Z',
      lineItems: [
        { lineId: 'L-10010-1', description: 'Used vehicle sale', departmentId: 'sales', departmentName: 'Sales', amount: 825, category: 'sales' },
        { lineId: 'L-10010-2', description: 'Accessories package', departmentId: 'parts', departmentName: 'Parts', amount: 82.33, category: 'parts' },
        { lineId: 'L-10010-3', description: 'Delivery clean-up', departmentId: 'service', departmentName: 'Service', amount: 50, category: 'service' }
      ]
    }
  ],
  sampleCustomers: [
    {
      customerId: 'CUST-1001',
      customerName: 'Avery Johnson',
      vehicle: '2024 Jeep Grand Cherokee',
      preferredMethod: 'Credit',
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      openRos: 1,
      tokenOnFile: true,
      tokens: [{ tokenId: 'tok_avj_1', tokenReference: 'PMT-AVJ-4412', last4: '4412', brand: 'Visa', isDefault: true, createdAt: '2026-04-01T10:15:00.000Z' }],
      address: { line1: '1800 Congress Ave', line2: 'Apt 4B', city: 'Austin', state: 'TX', postalCode: '78701' },
      phone: '512-555-0141',
      vehicles: [
        { vehicleId: 'veh-avj-1', year: 2024, make: 'Jeep', model: 'Grand Cherokee', vin: '1C4RJEBG1RC123001', licensePlate: 'AVJ-4412', isPrimary: true }
      ]
    },
    {
      customerId: 'CUST-1002',
      customerName: 'Maria Chen',
      vehicle: '2023 Ford Mustang',
      preferredMethod: 'Stored token',
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      openRos: 3,
      tokenOnFile: true,
      tokens: [
        { tokenId: 'tok_mch_1', tokenReference: 'PMT-MCH-8821', last4: '8821', brand: 'Mastercard', isDefault: true, createdAt: '2026-04-03T09:00:00.000Z' },
        { tokenId: 'tok_mch_2', tokenReference: 'PMT-MCH-1324', last4: '1324', brand: 'Visa', isDefault: false, createdAt: '2026-04-04T13:20:00.000Z' }
      ],
      address: { line1: '24 W 21st St', city: 'New York', state: 'NY', postalCode: '10010' },
      phone: '212-555-0119',
      vehicles: [
        { vehicleId: 'veh-mch-1', year: 2023, make: 'Ford', model: 'Mustang', vin: '1FA6P8CF2P5102002', licensePlate: 'MCH-8821', isPrimary: true },
        { vehicleId: 'veh-mch-2', year: 2021, make: 'Tesla', model: 'Model Y', vin: '5YJYGDEE8MF123456', licensePlate: 'MCH-1324', isPrimary: false }
      ]
    },
    {
      customerId: 'CUST-1003',
      customerName: 'Andre Williams',
      vehicle: '2025 Chevrolet Tahoe',
      preferredMethod: 'Cash',
      defaultRoutingMid: 'MID-SALES-DEMO',
      openRos: 0,
      tokenOnFile: false,
      tokens: [],
      address: { line1: '4517 Beechwood Dr', city: 'Dallas', state: 'TX', postalCode: '75201' },
      phone: '214-555-0198',
      vehicles: [
        { vehicleId: 'veh-aw-1', year: 2025, make: 'Chevrolet', model: 'Tahoe', vin: '3GNAXUEV6PS101003', licensePlate: 'AW-1003', isPrimary: true }
      ]
    },
    {
      customerId: 'CUST-1004',
      customerName: 'Nina Patel',
      vehicle: '2022 Tesla Model 3',
      preferredMethod: 'Debit',
      defaultRoutingMid: 'MID-PARTS-DEMO',
      openRos: 1,
      tokenOnFile: true,
      tokens: [{ tokenId: 'tok_npa_1', tokenReference: 'PMT-NPA-8821', last4: '8821', brand: 'Mastercard', isDefault: true, createdAt: '2026-04-05T08:42:00.000Z' }],
      address: { line1: '88 Market St', line2: 'Suite 400', city: 'San Francisco', state: 'CA', postalCode: '94105' },
      phone: '415-555-0144',
      vehicles: [
        { vehicleId: 'veh-npa-1', year: 2022, make: 'Tesla', model: 'Model 3', vin: '5YJ3E1EA6MF000404', licensePlate: 'NPA-8821', isPrimary: true },
        { vehicleId: 'veh-npa-2', year: 2021, make: 'Honda', model: 'Civic', vin: '2HGFC2F59MH123111', licensePlate: 'NPA-1111', isPrimary: false }
      ]
    },
    {
      customerId: 'CUST-1005',
      customerName: 'Jordan Brooks',
      vehicle: '2021 Toyota RAV4',
      preferredMethod: 'Credit',
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      openRos: 1,
      tokenOnFile: true,
      tokens: [{ tokenId: 'tok_jbr_1', tokenReference: 'PMT-JBR-2045', last4: '2045', brand: 'Visa', isDefault: true, createdAt: '2026-04-02T11:10:00.000Z' }],
      address: { line1: '2401 S Lamar Blvd', city: 'Austin', state: 'TX', postalCode: '78704' },
      phone: '512-555-0187',
      vehicles: [
        { vehicleId: 'veh-jbr-1', year: 2021, make: 'Toyota', model: 'RAV4', vin: '1N4BL4CV0PN050505', licensePlate: 'JBR-2045', isPrimary: true }
      ]
    },
    {
      customerId: 'CUST-1006',
      customerName: 'Sofia Ramirez',
      vehicle: '2024 Hyundai Sonata',
      preferredMethod: 'Credit',
      defaultRoutingMid: 'MID-SALES-DEMO',
      openRos: 1,
      tokenOnFile: true,
      tokens: [{ tokenId: 'tok_sra_1', tokenReference: 'PMT-SRA-3009', last4: '3009', brand: 'AmEx', isDefault: true, createdAt: '2026-04-03T15:55:00.000Z' }],
      address: { line1: '1200 Biscayne Blvd', city: 'Miami', state: 'FL', postalCode: '33132' },
      phone: '305-555-0130',
      vehicles: [
        { vehicleId: 'veh-sra-1', year: 2024, make: 'Hyundai', model: 'Sonata', vin: 'KMHD84LF2MU606606', licensePlate: 'SRA-3009', isPrimary: true }
      ]
    },
    {
      customerId: 'CUST-1007',
      customerName: 'Caleb Thompson',
      vehicle: '2020 GMC Sierra',
      preferredMethod: 'Debit',
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      openRos: 1,
      tokenOnFile: false,
      tokens: [],
      address: { line1: '16 Lakeview Dr', city: 'Denver', state: 'CO', postalCode: '80202' },
      phone: '303-555-0148',
      vehicles: [
        { vehicleId: 'veh-cth-1', year: 2020, make: 'GMC', model: 'Sierra', vin: '1GCPYCEF7MZ707707', licensePlate: 'CTH-7077', isPrimary: true }
      ]
    },
    {
      customerId: 'CUST-1008',
      customerName: 'Priya Desai',
      vehicle: '2022 Mercedes-Benz GLC',
      preferredMethod: 'Visa **** 1188',
      defaultRoutingMid: 'MID-SERVICE-DEMO',
      openRos: 0,
      tokenOnFile: true,
      tokens: [{ tokenId: 'tok_pde_1', tokenReference: 'PMT-PDE-1188', last4: '1188', brand: 'Visa', isDefault: true, createdAt: '2026-04-06T07:25:00.000Z' }],
      address: { line1: '900 Walnut St', city: 'Philadelphia', state: 'PA', postalCode: '19107' },
      phone: '215-555-0177',
      vehicles: [
        { vehicleId: 'veh-pde-1', year: 2022, make: 'Mercedes-Benz', model: 'GLC', vin: 'W1KLF4HB5NU808808', licensePlate: 'PDE-1188', isPrimary: true }
      ]
    },
    {
      customerId: 'CUST-1009',
      customerName: 'Evan Martinez',
      vehicle: '2019 Honda Accord',
      preferredMethod: 'Stored token',
      defaultRoutingMid: 'MID-PARTS-DEMO',
      openRos: 1,
      tokenOnFile: true,
      tokens: [{ tokenId: 'tok_emz_1', tokenReference: 'PMT-EMZ-6622', last4: '6622', brand: 'Visa', isDefault: true, createdAt: '2026-04-07T12:35:00.000Z' }],
      address: { line1: '2210 Alpine Rd', city: 'Boulder', state: 'CO', postalCode: '80304' },
      phone: '720-555-0199',
      vehicles: [
        { vehicleId: 'veh-emz-1', year: 2019, make: 'Honda', model: 'Accord', vin: '2HGFE2F57MH909909', licensePlate: 'EMZ-6622', isPrimary: true }
      ]
    },
    {
      customerId: 'CUST-1010',
      customerName: 'Harper Wilson',
      vehicle: '2024 Hyundai Palisade',
      preferredMethod: 'Credit',
      defaultRoutingMid: 'MID-SALES-DEMO',
      openRos: 0,
      tokenOnFile: false,
      tokens: [],
      address: { line1: '75 King St', city: 'Seattle', state: 'WA', postalCode: '98104' },
      phone: '206-555-0160',
      vehicles: [
        { vehicleId: 'veh-hwi-1', year: 2024, make: 'Hyundai', model: 'Palisade', vin: '5NMS5CAD0MH010010', licensePlate: 'HWI-1010', isPrimary: true }
      ]
    }
  ],
  sampleTransactions: [
    { gatewayTransactionId: 'demo-cash-1', roNumber: 'RO-10001', amount: 184, status: 'finalized', departmentId: 'mixed', dmsPosted: true, routingMid: 'MID-SERVICE-DEMO', paymentFlow: 'cash', surchargeAmount: 0, createdAt: '2026-04-17T09:15:00.000Z' },
    { gatewayTransactionId: 'demo-stored_token-2', roNumber: 'RO-10002', amount: 72.5, status: 'accepted', departmentId: 'service', dmsPosted: false, routingMid: 'MID-SERVICE-DEMO', paymentFlow: 'stored_token', surchargeAmount: 2.18, createdAt: '2026-04-17T10:42:00.000Z', dmsSyncError: 'Waiting for DMS write-back retry' },
    { gatewayTransactionId: 'demo-credit-3', roNumber: 'RO-10003', amount: 28650, status: 'finalized', departmentId: 'sales', dmsPosted: true, routingMid: 'MID-SALES-DEMO', paymentFlow: 'credit', surchargeAmount: 0, createdAt: '2026-04-17T11:09:00.000Z' },
    { gatewayTransactionId: 'demo-debit-4', roNumber: 'RO-10004', amount: 41.2, status: 'accepted', departmentId: 'parts', dmsPosted: false, routingMid: 'MID-PARTS-DEMO', paymentFlow: 'debit', surchargeAmount: 0, createdAt: '2026-04-17T12:01:00.000Z' },
    { gatewayTransactionId: 'demo-cash-5', roNumber: 'RO-10005', amount: 210, status: 'failed', departmentId: 'service', dmsPosted: false, routingMid: 'MID-SERVICE-DEMO', paymentFlow: 'cash', surchargeAmount: 0, createdAt: '2026-04-17T12:29:00.000Z' },
    { gatewayTransactionId: 'demo-stored_token-6', roNumber: 'RO-10006', amount: 212, status: 'accepted', departmentId: 'sales', dmsPosted: false, routingMid: 'MID-SALES-DEMO', paymentFlow: 'stored_token', surchargeAmount: 0, createdAt: '2026-04-17T13:12:00.000Z', dmsSyncError: 'Force post required after gateway timeout' },
    { gatewayTransactionId: 'demo-cash-7', roNumber: 'RO-10007', amount: 100, status: 'finalized', departmentId: 'mixed', dmsPosted: true, routingMid: 'MID-SERVICE-DEMO', paymentFlow: 'cash', surchargeAmount: 0, createdAt: '2026-04-17T13:44:00.000Z' },
    { gatewayTransactionId: 'demo-credit-8', roNumber: 'RO-10008', amount: 64.5, status: 'finalized', departmentId: 'service', dmsPosted: true, routingMid: 'MID-SERVICE-DEMO', paymentFlow: 'credit', surchargeAmount: 1.94, createdAt: '2026-04-17T14:09:00.000Z' },
    { gatewayTransactionId: 'demo-debit-9', roNumber: 'RO-10009', amount: 148.25, status: 'accepted', departmentId: 'parts', dmsPosted: false, routingMid: 'MID-PARTS-DEMO', paymentFlow: 'debit', surchargeAmount: 0, createdAt: '2026-04-17T14:22:00.000Z' },
    { gatewayTransactionId: 'demo-credit-10', roNumber: 'RO-10010', amount: 957.33, status: 'finalized', departmentId: 'sales', dmsPosted: true, routingMid: 'MID-SALES-DEMO', paymentFlow: 'credit', surchargeAmount: 0, createdAt: '2026-04-17T14:50:00.000Z' }
  ],
  terminalHeartbeats: [
    { terminalId: 'TPN-001', status: 'online', lastHeartbeatAt: '2026-04-17T14:59:00.000Z' },
    { terminalId: 'TPN-002', status: 'offline', lastHeartbeatAt: '2026-04-17T14:42:00.000Z' },
    { terminalId: 'TPN-003', status: 'unknown', lastHeartbeatAt: '2026-04-17T14:21:00.000Z' }
  ],
  portalNotes: [
    'Demo mode stays enabled by default so the portal works without live credentials.',
    'Mixed RO routing defaults to the Primary Service MID when Parts and Service both appear, and the cashier can override it before charge.',
    'Supported payment methods are cash, credit, debit, and stored token/recurring.',
    'Cash and debit do not surcharge; credit and stored token follow the admin surcharge policy.',
    'Credit purchases can optionally save a token for future use, and demo mode fakes token-on-file states safely.',
    'Surcharge is admin-controlled, can be enabled or disabled, and is calculated only on the amount being paid now.',
    'Surcharges are shown separately on the receipt and posted as NON_TAX_MISC_FEE.'
  ]
};
