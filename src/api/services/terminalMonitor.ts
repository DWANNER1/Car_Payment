const terminals = [
  { terminalId: 'TPN-001', status: 'online', lastHeartbeatAt: new Date().toISOString() },
  { terminalId: 'TPN-002', status: 'offline', lastHeartbeatAt: new Date(Date.now() - 8 * 60 * 1000).toISOString() }
];

export const terminalMonitorService = {
  list: () => terminals
};
