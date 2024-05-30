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
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}
export type OllamaChatStreamCallbackType = (error: OllamaAPIErrorOrResponse, response?: OllamaStreamChatResponse) => void;
export default class FetchChatJSONStream {
    private abortController;
    constructor();
    abort(): void;
    private processStreamReader;
    private processNodeStream;
    private processBuffer;
    fetch(url: string, headers: HeadersInit, postData: string, callback: OllamaChatStreamCallbackType): Promise<void>;
}
export {};
