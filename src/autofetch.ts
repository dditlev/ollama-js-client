// We are going to use this type as our universal Response type
type NodeFetchResponse = InstanceType<typeof import('node-fetch')['Response']>;

// Here we define the UniversalResponse type as a union of the browser's Response and the NodeFetchResponse
type UniversalResponse = Response | NodeFetchResponse;

// This function dynamically imports node-fetch only in Node.js environment
async function _getNodeFetch(): Promise<typeof fetch> {
  if (typeof window === 'undefined') {
    // Here we need to cast to unknown first because TypeScript does not allow direct casts from types with no overlap
    const nodeFetch = (await import('node-fetch')).default as unknown as typeof fetch;
    return nodeFetch;
  } else {
    return window.fetch;
  }
}

// Export a wrapper function that uses the appropriate fetch implementation
export default async function autofetch(url: string, init?: RequestInit): Promise<UniversalResponse> {
  const fetch = await _getNodeFetch();
  // The fetched response is either a browser's Response or a NodeFetchResponse, so it should be assignable to UniversalResponse
  return fetch(url, init) as Promise<UniversalResponse>;
}