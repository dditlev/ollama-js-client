export interface OllamaAPIError {
    error: string;
}
export type OllamaAPIErrorOrResponse = OllamaAPIError | false;
export interface OllamaStreamResponse {
    model: string;
    created_at: string;
    response: string;
    context?: number[];
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    sample_count?: number;
    sample_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
export type OllamaStreamCallbackType = (error: OllamaAPIErrorOrResponse, response?: OllamaStreamResponse) => void;
export default class FetchJSONStream {
    private abortController;
    constructor();
    abort(): void;
    private processStreamReader;
    private processNodeStream;
    private processBuffer;
    fetch(url: string, headers: HeadersInit, postData: string, callback: OllamaStreamCallbackType): Promise<void>;
}
