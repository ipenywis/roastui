export function getStreamingHeaders() {
  return {
    Connection: 'keep-alive',
    'Keep-Alive': 'timeout=300', // Keep connection alive for 300 seconds
    'Cache-Control': 'no-cache, no-transform',
    'Content-Type': 'text/event-stream',
    'Transfer-Encoding': 'chunked',
  };
}
