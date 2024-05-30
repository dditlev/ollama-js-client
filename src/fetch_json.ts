import autofetch from "./autofetch";
import { OllamaFinalStreamChatResponse } from "./fetch_chat_jsonstream";
export interface OllamaPromptReponse {
  model: string;
  created_at: string;
  response: string;
  context: number[];
  done: boolean;
  total_duration: number;
  load_duration: number;
  sample_count: number;
  sample_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}
export class FetchJSON {
  public abort_controller: AbortController;
  constructor() {
    this.abort_controller = new AbortController();
  }
  abort() {
    this.abort_controller.abort();
  }
  public async fetch(
    url: string,
    headers: HeadersInit,
    postData: string
  ): Promise<OllamaPromptReponse> {
    const response = await autofetch(url, {
      signal: this.abort_controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: postData,
    });
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (await response.text()) || response.status;
      console.error(`HTTP error! status: ${response.status} message: ${error}`);
      throw new Error(`[Connection Error]: ${error}`);
    }
    const json: OllamaPromptReponse = await response.json();
    return json;
  }
}
export class FetchChatJSON {
  public abort_controller: AbortController;
  constructor() {
    this.abort_controller = new AbortController();
  }
  abort() {
    this.abort_controller.abort();
  }
  public async fetch(
    url: string,
    headers: HeadersInit,
    postData: string
  ): Promise<OllamaFinalStreamChatResponse> {
    const response = await autofetch(url, {
      signal: this.abort_controller.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: postData,
    });
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (await response.text()) || response.status;
      console.error(`HTTP error! status: ${response.status} message: ${error}`);
      throw new Error(`[Connection Error]: ${error}`);
    }
    const json: OllamaFinalStreamChatResponse = await response.json();
    return json;
  }
}