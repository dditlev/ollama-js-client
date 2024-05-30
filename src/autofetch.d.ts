type NodeFetchResponse = InstanceType<typeof import('node-fetch')['Response']>;
type UniversalResponse = Response | NodeFetchResponse;
export default function autofetch(url: string, init?: RequestInit): Promise<UniversalResponse>;
export {};
