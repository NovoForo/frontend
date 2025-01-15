export function sessionTimeout(timestamp: number | undefined) {
  const now = Date.now();
  const oneHourInMillis = 60 * 60 * 1000; // 60 minutes * 60 seconds * 1000 milliseconds

  if (!timestamp) {
    return false;
  }
  return now - timestamp >= oneHourInMillis;
}
