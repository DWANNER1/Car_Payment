import type { BrandingConfig, ReceiptTemplateConfig } from '../../shared/payment.js';
import type { PrototypeSurchargeRules } from '../../shared/prototype.js';
import { prototypeSeed } from '../../shared/prototype.js';
import { readRuntimeJson, writeRuntimeJson } from './runtimeStore.js';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

type PrototypeStateSnapshot = {
  demoModeEnabled: boolean;
  surchargeRules: PrototypeSurchargeRules;
  midMapping: {
    parts: string;
    service: string;
    sales: string;
    body_shop: string;
  };
  receiptConfig: ReceiptTemplateConfig;
  branding: BrandingConfig;
};

const stateFileName = 'prototype-state.json';
const defaultState: PrototypeStateSnapshot = {
  demoModeEnabled: prototypeSeed.demoModeEnabled,
  surchargeRules: clone(prototypeSeed.surchargeRules),
  midMapping: clone(prototypeSeed.midMapping),
  receiptConfig: clone(prototypeSeed.receiptConfig),
  branding: clone(prototypeSeed.branding)
};

let state = clone(readRuntimeJson(stateFileName, defaultState));
state = {
  ...state,
  surchargeRules: { ...prototypeSeed.surchargeRules, ...state.surchargeRules }
};

function persist() {
  writeRuntimeJson(stateFileName, state);
}

export const prototypeState = {
  getDemoMode: () => state.demoModeEnabled,
  setDemoMode: (enabled: boolean) => {
    state = { ...state, demoModeEnabled: enabled };
    persist();
    return state.demoModeEnabled;
  },
  getSurchargeRules: () => state.surchargeRules,
  setSurchargeRules: (next: Partial<PrototypeSurchargeRules>) => {
    state = { ...state, surchargeRules: { ...state.surchargeRules, ...next } };
    persist();
    return state.surchargeRules;
  },
  getMidMapping: () => state.midMapping,
  setMidMapping: (next: Partial<PrototypeStateSnapshot['midMapping']>) => {
    state = { ...state, midMapping: { ...state.midMapping, ...next } };
    persist();
    return state.midMapping;
  },
  getReceiptConfig: () => state.receiptConfig,
  setReceiptConfig: (next: Partial<ReceiptTemplateConfig>) => {
    state = {
      ...state,
      receiptConfig: {
        ...state.receiptConfig,
        ...next,
        print: { ...state.receiptConfig.print, ...(next.print ?? {}) },
        email: { ...state.receiptConfig.email, ...(next.email ?? {}) },
        text: { ...state.receiptConfig.text, ...(next.text ?? {}) }
      }
    };
    persist();
    return state.receiptConfig;
  },
  getBranding: () => state.branding,
  setBranding: (next: Partial<BrandingConfig>) => {
    state = {
      ...state,
      branding: {
        dealershipName: typeof next.dealershipName === 'string' ? next.dealershipName : state.branding.dealershipName,
        logoDataUrl: Object.prototype.hasOwnProperty.call(next, 'logoDataUrl') ? (next.logoDataUrl ?? null) : state.branding.logoDataUrl,
        logoFileName: Object.prototype.hasOwnProperty.call(next, 'logoFileName') ? (next.logoFileName ?? null) : state.branding.logoFileName
      }
    };
    persist();
    return state.branding;
  }
};
