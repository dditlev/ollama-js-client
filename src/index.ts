import FetchJSONStream, {
  OllamaStreamCallbackType,
  OllamaStreamResponse,
  OllamaAPIErrorOrResponse,
} from "./fetch_jsonstream";
import FetchJSON, { OllamaReponse } from "./fetch_json";

// https://github.com/jmorganca/ollama/blob/main/docs/modelfile.md#valid-parameters-and-values
interface OllamaGenerationParameters {
  mirostat?: number; // 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0 (default: 0)
  mirostat_eta?: number; // Influences adjustment responsiveness (default: 0.1)
  mirostat_tau?: number; // Balances coherence and diversity (default: 5.0)
  num_ctx?: number; // Size of context window for token generation (default: 2048)
  num_gqa?: number; // Number of GQA groups in transformer layer (required for some models)
  num_gpu?: number; // Number of layers sent to GPU(s), 0 to disable (default varies)
  num_thread?: number; // Number of threads for computation (recommended: number of physical CPU cores)
  repeat_last_n?: number; // Look back to prevent repetition (default: 64, 0 = disabled, -1 = num_ctx)
  repeat_penalty?: number; // Penalty for repetitions (default: 1.1)
  temperature?: number; // Controls creativity (default: 0.8)
  seed?: number; // Random number seed for generation (default: 0)
  stop?: string; // Stop sequences for generation
  tfs_z?: number; // Tail free sampling impact reduction (default: 1)
  num_predict?: number; // Max tokens to predict (default: 128, -1 = infinite, -2 = fill context)
  top_k?: number; // Probability reduction for nonsensical generation (default: 40)
  top_p?: number; // Works with top-k for diversity (default: 0.9)
}

interface OllamaOptions {
  model: string;
  url: string;
  custom_headers?: HeadersInit;
  options?: OllamaGenerationParameters;
  verbose?: boolean;
}

export default class Ollama {
  // the ollama model name (eg. llama2)
  private model: string;

  // the ollama server url (avoid using localhost (use 127.0.0.1) for nodejs dns issues)
  private url: string;

  // add custom headers to the fetch request.
  private custom_headers: HeadersInit;

  // add model specific options
  private options: OllamaGenerationParameters;
  // enable verbose logging
  private verbose: boolean;

  // context is used to store the previous response context
  private context: number[];

  // current_stream is used to store the current stream instance
  private current_stream: FetchJSONStream | null;

  // current_json_fetch is used to store the current json fetch instance
  private current_json_fetch: FetchJSON | null;

  constructor(options: OllamaOptions) {
    this.model = options.model;
    this.url = options.url;
    this.custom_headers = options.custom_headers || {};
    this.options = options.options || {};
    this.verbose = options.verbose || false;

    this.context = [];
    this.current_stream = null;
    this.current_json_fetch = null;
  }

  stop() {
    this.current_stream?.abort();
  }

  static from(connection: string): Ollama {
    const [model, url] = connection.split("@");
    if (!model || !url) {
      throw new Error("Invalid connection string");
    }
    return new Ollama({ model: model.trim(), url: url.trim() });
  }

  clear() {
    this.context = [];
  }

  private createRequestBody(prompt: string, stream = false): object {
    const body: any = { prompt, model: this.model, stream };
    if (this.context.length > 0) {
      body.context = this.context;
    }
    if (this.options) {
      body.options = this.options;
    }
    if (this.verbose) {
        console.log("Ollama request body:", body);
    }
    return body;
  }

  async prompt_stream(
    prompt: string,
    callback: OllamaStreamCallbackType
  ): Promise<FetchJSONStream> {
    this.current_stream = new FetchJSONStream();
    const body = this.createRequestBody(prompt, true);

    try {
      await this.current_stream.fetch(
        `${this.url}generate`,
        this.custom_headers,
        JSON.stringify(body),
        (error: OllamaAPIErrorOrResponse, response?: OllamaStreamResponse) => {
          if (error) {
            callback(error);
          } else if (response) {
            if (response.done) {
              this.context = response.context;
            }
            callback(false, response);
          }
        }
      );
    } catch (error) {
    if (this.verbose) {
        console.error("Ollama fetch request error:", error);
    }
      callback({
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return this.current_stream;
  }

  async prompt(prompt: string): Promise<OllamaReponse> {
    if (!this.current_json_fetch) {
      this.current_json_fetch = new FetchJSON();
    }
    const body = this.createRequestBody(prompt);
    const res = await this.current_json_fetch.fetch(
      `${this.url}generate`,
      this.custom_headers,
      JSON.stringify(body)
    );
    if (this.verbose) {
        console.log("Ollama fetch reponse:", res);
    }
    if (res.context) {
      this.context = res.context;
    }
    return res;
  }
}
