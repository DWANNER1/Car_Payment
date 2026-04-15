let demoModeEnabled = (process.env.DEMO_MODE ?? 'true') !== 'false';

export const demoModeService = {
  isEnabled() {
    return demoModeEnabled;
  },
  setEnabled(value: boolean) {
    demoModeEnabled = value;
    return demoModeEnabled;
  }
};
