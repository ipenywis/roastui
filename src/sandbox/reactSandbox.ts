import { Worker } from 'worker_threads';
import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import { fileURLToPath } from 'url';

interface SandboxOptions {
  moduleCache?: string;
  allowedDependencies?: Map<string, string>;
}

interface CompilationResult {
  code: string;
  dependencies: string[];
}

type WorkerResponse = {
  success: boolean;
  result?: string;
  error?: string;
};

export class ReactSandbox {
  private volume;
  private fs;
  private moduleCache: string;
  private allowedDependencies: Map<string, string>;
  private workerPath: string;

  constructor(options: SandboxOptions = {}) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.volume = new Volume();
    this.fs = createFsFromVolume(this.volume);
    this.moduleCache =
      options.moduleCache || '/path/to/pre-installed/node_modules';

    // Create necessary directories in virtual filesystem
    this.fs.mkdirSync('/src', { recursive: true });
    this.fs.mkdirSync('/dist', { recursive: true });

    // Initialize allowed dependencies
    this.allowedDependencies =
      options.allowedDependencies ||
      new Map([
        ['react', '^18.0.0'],
        ['lucide-react', '^0.263.1'],
      ]);

    // Path to worker file
    this.workerPath = path.resolve('./src/sandbox/worker.js');
  }

  private async createComponent(code: string): Promise<string> {
    // Wrap the component code with necessary imports and exports
    // const wrappedCode = `
    //   ${code}

    //   // Ensure the component is properly exported
    //   export default typeof Component !== 'undefined' ? Component : (() => {
    //     const exports = eval('(' + code + ')');
    //     return typeof exports === 'function' ? exports : null;
    //   })();
    // `;

    const wrappedCode = `      
      ${code}
    `;

    const componentPath = '/component.jsx';

    try {
      this.fs.writeFileSync(componentPath, wrappedCode, { encoding: 'utf8' });
      return componentPath;
    } catch (error) {
      throw new Error(
        `Failed to create component file: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  private async setupDependencies(): Promise<void> {
    try {
      if (this.moduleCache) {
        // Symlink pre-installed node_modules
        this.fs.symlinkSync(this.moduleCache, '/node_modules', 'dir');
      } else {
        throw new Error('Module cache path is required');
      }
    } catch (error) {
      throw new Error(
        `Failed to setup dependencies: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  public async compile(code: string): Promise<CompilationResult> {
    if (!code || typeof code !== 'string') {
      throw new TypeError('Component code must be a non-empty string');
    }

    const componentPath = await this.createComponent(code);
    await this.setupDependencies();

    // Serialize the filesystem contents
    const fsJson = this.volume.toJSON();

    const worker = new Worker(this.workerPath);

    // Pass the serialized filesystem, component path, and allowed dependencies to the worker
    worker.postMessage({
      fsJson,
      componentPath,
      allowedDependencies: Array.from(this.allowedDependencies.entries()),
    });

    const cleanup = () => {
      worker.terminate();
    };

    return new Promise((resolve, reject) => {
      worker.on('message', (response: WorkerResponse) => {
        cleanup();
        if (response.success && response.result) {
          resolve({
            code: response.result,
            dependencies: Array.from(this.allowedDependencies.keys()),
          });
        } else {
          reject(new Error(response.error || 'Unknown compilation error'));
        }
      });

      worker.on('error', (error) => {
        cleanup();
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  public async cleanup(): Promise<void> {
    this.volume.reset();
  }

  // Getter for allowed dependencies
  public getAllowedDependencies(): ReadonlyMap<string, string> {
    return new Map(this.allowedDependencies);
  }

  // Method to add new allowed dependencies
  public addAllowedDependency(name: string, version: string): void {
    this.allowedDependencies.set(name, version);
  }
}

export default ReactSandbox;
