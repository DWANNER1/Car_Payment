let demoModeEnabled = (process.env.DEMO_MODE ?? 'true') !== 'false';

export const demoModeService = {
  isEnabled: () => demoModeEnabled,
  setEnabled: (value: boolean) => (demoModeEnabled = value)
};
