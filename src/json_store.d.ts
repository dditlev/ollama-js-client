type Appendable = string | number | any[] | Record<string, unknown>;
export default class JSONStore {
    private path;
    private data;
    constructor(path: string);
    remove(key: string): void;
    clear(): void;
    destroy(): Promise<void>;
    has(key: string): boolean;
    set(key: string, value: any): void;
    append(key: string, value: Appendable): void;
    get(key: string): any;
    load(): Promise<void>;
    save(): Promise<void>;
    download(): void;
}
export {};
