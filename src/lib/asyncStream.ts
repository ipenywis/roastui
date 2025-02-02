export class AsyncStream<QUEUE_TYPE = string> {
  private queue: QUEUE_TYPE[] = []; // Shared queue for storing data
  private controller: ReadableStreamDefaultController<string> | null = null; // Controller for the stream
  private resolveNext: ((value?: any) => void) | null = null; // Promise resolver for waiting producers
  private stream: ReadableStream<string> | null = null; // Stream instance
  private readers: Set<ReadableStream<string>> = new Set();
  private isClosed = false;

  constructor() {
    this.initStream(); // Initialize the stream
  }

  initStream() {
    this.stream = new ReadableStream({
      start: (controller) => {
        this.controller = controller; // Store the controller
      },
      pull: async (controller) => {
        while (this.queue.length > 0) {
          const data = this.queue.shift();

          if (typeof data === 'string') {
            controller.enqueue(data); // Enqueue data into the stream
          } else {
            const stringifiedData = JSON.stringify(data);
            controller.enqueue(stringifiedData); // Enqueue data into the stream
          }
        }

        // Wait for more data if the queue is empty
        if (!this.queue.length) {
          await new Promise((resolve) => (this.resolveNext = resolve));
        }
      },
      cancel() {},
    });
  }

  enqueue(data: QUEUE_TYPE) {
    if (this.isClosed) {
      throw new Error('Cannot enqueue to closed stream');
    }

    // Add data to the queue
    this.queue.push(data);

    // Notify the stream if it was waiting for data
    if (this.resolveNext) {
      this.resolveNext();
      this.resolveNext = null;
    }
  }

  /**
   * Get a new stream from the main stream.
   * This is used to create a new stream that can be read by a new reader.
   * Readers will be added to the readers set and will be canceled when the main stream is canceled.
   * @returns A new stream or null if the main stream is not initialized.
   */
  getStream() {
    if (!this.stream) return null;

    // Create a new branch of the stream
    const [newStream, original] = this.stream.tee();
    this.stream = original; // Keep one branch for future readers

    this.readers.add(newStream);

    return newStream; // Return the other branch
  }

  close() {
    this.isClosed = true;

    // Resolve any waiting pull operation
    if (this.resolveNext) {
      this.resolveNext();
      this.resolveNext = null;
    }

    // Close the controller
    if (this.controller) {
      this.controller.close();
    }

    // Close all readers
    this.readers.forEach((reader) => {
      if (!reader.locked) {
        reader.cancel();
      }
    });
    this.readers.clear();
  }

  cancel() {
    this.stream?.cancel();
    //Cancel all registered readers
    this.readers.forEach((reader) => reader.cancel());
  }
}
