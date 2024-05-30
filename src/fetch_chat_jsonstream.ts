import autofetch from "./autofetch"; // isomorphic fetch

export interface OllamaAPIError {
  error: string;
}
export type OllamaAPIErrorOrResponse = OllamaAPIError | false;

interface OllamaChatMessagePart {
  role: "assistant";
  content: string;
  images: null | string[];
}
export interface OllamaStreamChatResponse {
  model: string;
  created_at: string;
  message: OllamaChatMessagePart;
  done: boolean;
}
export interface OllamaFinalStreamChatResponse {
  model: string;
  created_at: string;
  done: boolean;
  message:OllamaChatMessagePart;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export type OllamaChatStreamCallbackType = (
  error: OllamaAPIErrorOrResponse,
  response?: OllamaStreamChatResponse
) => void;

// Helper function to determine environment
const isNode = (): boolean => typeof window === "undefined";

// Helper function to determine if the stream is a browser ReadableStream
function isBrowserReadableStream(
  stream: any
): stream is ReadableStream<Uint8Array> {
  return !!stream && typeof stream.getReader === "function";
}

// Main class to fetch and process the JSON stream
export default class FetchChatJSONStream {
  private abortController: AbortController;

  constructor() {
    this.abortController = new AbortController();
  }

  abort() {
    this.abortController.abort();
  }

  private async processStreamReader(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder,
    callback: OllamaChatStreamCallbackType
  ) {
    let buffer = "";
    try {
      let result;
      while (((result = await reader.read()), !result.done)) {
        buffer = this.processBuffer(
          buffer + decoder.decode(result.value, { stream: true }),
          callback
        );
      }
      if (buffer.length > 0) {
        this.processBuffer(buffer, callback, true); // Process any remaining data
      }
    } catch (error) {
      if (error instanceof Error) {
        callback({ error: error.message });
      } else {
        callback({ error: String(error) });
      }
    }
  }

  private async processNodeStream(
    stream: NodeJS.ReadableStream,
    decoder: TextDecoder,
    callback: OllamaChatStreamCallbackType
  ) {
    let buffer = "";
    stream.on("data", (chunk) => {
      buffer = this.processBuffer(
        buffer + decoder.decode(chunk, { stream: true }),
        callback
      );
    });

    stream.on("end", () => {
      if (buffer.length > 0) {
        this.processBuffer(buffer, callback, true); // Process any remaining data
      }
    });

    stream.on("error", (error) => {
      callback({ error: error.message });
    });
  }

  private processBuffer(
    buffer: string,
    callback: OllamaChatStreamCallbackType,
    flush: boolean = false
  ): string {
    let newlineIndex;
    let lastJson: OllamaStreamChatResponse | null = null;

    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (line) {
        try {
          const json: OllamaStreamChatResponse = JSON.parse(line);
          lastJson = json; // Keep the last valid JSON
          callback(false, json);
        } catch (error) {
          console.error(`Failed to parse JSON line: ${line}`, error);
        }
      }
    }

    // Flush the buffer if true, which is the case when the stream ends.
    if (flush && buffer.trim()) {
      try {
        const json: OllamaStreamChatResponse = JSON.parse(buffer);
        callback(false, json);
      } catch (error) {
        // If there's an error parsing the buffer, check if we had a previous valid JSON object
        // and if it indicated that the stream was done.
        if (lastJson && lastJson.done) {
          callback(false, lastJson);
        } else {
          console.error(`Failed to parse JSON buffer: ${buffer}`, error);
        }
      } finally {
        buffer = ""; // Clear buffer after processing
      }
    } else if (lastJson && lastJson.done) {
      // If the stream indicated it's done, but no newline was found, clear the buffer.
      buffer = "";
    }

    return buffer;
  }

  public async fetch(
    url: string,
    headers: HeadersInit,
    postData: string,
    callback: OllamaChatStreamCallbackType
  ) {
    try {
      const response = await autofetch(url, {
        signal: this.abortController.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: postData,
      });

      if (!response.ok) {
        callback({ error: `HTTP error! status: ${response.status}` });
        return;
      }

      const decoder = new TextDecoder("utf-8");

      if (isNode()) {
        // Handle Node.js streams
        const { Readable } = await import("stream");
        if (response.body instanceof Readable) {
          return this.processNodeStream(response.body, decoder, callback);
        }
      } else if (isBrowserReadableStream(response.body)) {
        // Handle browser streams
        const reader = response.body.getReader();
        return this.processStreamReader(reader, decoder, callback);
      } else {
        callback({ error: "Unrecognized stream type" });
      }
    } catch (error) {
      if (error instanceof Error) {
        callback({ error: error.message });
      } else {
        callback({ error: String(error) });
      }
    }
  }
}
