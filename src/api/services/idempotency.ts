export function createIdempotencyGuard() {
  const seen = new Set<string>();

  return {
    checkAndMark(key: string) {
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
      return false;
    },
    reset() {
      seen.clear();
    }
  };
}
