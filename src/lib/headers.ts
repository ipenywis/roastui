export function getStreamingHeaders() {
  return {
    Connection: 'Keep-Alive',
    'Keep-Alive': 'timeout=300', // Keep connection alive for 300 seconds
    'Cache-Control': 'no-cache, no-store, no-transform, must-revalidate',
    // 'Content-Type': 'text/event-stream',
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'Content-Encoding': 'identity', // Disable compression
    // 'X-Accel-Buffering': 'no', // Disable buffering
  };
}
