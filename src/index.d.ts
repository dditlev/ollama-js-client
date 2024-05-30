import FetchJSONStream, { OllamaStreamCallbackType } from "./fetch_jsonstream";
import FetchChatJSONStream, { OllamaFinalStreamChatResponse, OllamaChatStreamCallbackType } from "./fetch_chat_jsonstream";
import { OllamaReponse } from "./fetch_json";
interface OllamaGenerationParameters {
    mirostat?: number;
    mirostat_eta?: number;
    mirostat_tau?: number;
    num_ctx?: number;
    num_gqa?: number;
    num_gpu?: number;
    num_thread?: number;
    repeat_last_n?: number;
    repeat_penalty?: number;
    temperature?: number;
    seed?: number;
    stop?: string;
    tfs_z?: number;
    num_predict?: number;
    top_k?: number;
    top_p?: number;
}
interface OllamaOptions {
    model: string;
    url: string;
    custom_headers?: HeadersInit;
    options?: OllamaGenerationParameters;
    verbose?: boolean;
    stream?: boolean;
}
interface OllamaChatMessage {
    role: "system" | "assistant" | "user";
    content: string;
}
export default class Ollama {
    private model;
    private url;
    private custom_headers;
    private options;
    private verbose;
    private context;
    private current_stream;
    private current_json_fetch;
    constructor(options: OllamaOptions);
    stop(): void;
    static from(connection: string): Ollama;
    clear(): void;
    private createRequestBody;
    private createRequestBodyChat;
    prompt_stream(prompt: string, callback: OllamaStreamCallbackType): Promise<FetchJSONStream>;
    prompt(prompt: string): Promise<OllamaReponse>;
    chat_request(messages: OllamaChatMessage[]): Promise<OllamaFinalStreamChatResponse>;
    chat(messages: OllamaChatMessage[], callback: OllamaChatStreamCallbackType): Promise<FetchChatJSONStream>;
}
export {};
