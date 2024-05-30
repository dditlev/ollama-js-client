export interface OllamaReponse {
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
export default class FetchJSON {
    abort_controller: AbortController;
    constructor();
    abort(): void;
    fetch(url: string, headers: HeadersInit, postData: string): Promise<OllamaReponse>;
}
