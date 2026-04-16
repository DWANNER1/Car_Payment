const terminals = [
  { terminalId: 'TPN-001', status: 'online', lastHeartbeatAt: new Date().toISOString() },
  { terminalId: 'TPN-002', status: 'offline', lastHeartbeatAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() }
];

export const terminalMonitorService = {
  list() {
    return terminals;
  },
  heartbeat(terminalId: string, status: 'online' | 'offline' | 'unknown') {
    const existing = terminals.find((t) => t.terminalId === terminalId);
    if (existing) {
      existing.status = status;
      existing.lastHeartbeatAt = new Date().toISOString();
      return existing;
    }
    const created = { terminalId, status, lastHeartbeatAt: new Date().toISOString() };
    terminals.push(created);
    return created;
  }
};
