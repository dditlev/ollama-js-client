// interface OllamaModelInfo {
//   lisence: string;
//   modelfile: string;
//   parameters: string;
//   template: string;
// }
// interface OllamaModelCreation {
//   status: string;
// }
// interface OllamaModelCreateSpec {
//   name: string;
//   path: string;
//   stream?: boolean;
// }
// interface OllamaModelListItem {
//   name: string;
//   modified_at: Date;
//   // "modified_at": "2023-08-02T17:02:23.713454393-07:00",
//   size: number;
// }
// export class OllamaOps {
//   constructor(private url: string, private custom_headers: HeadersInit) {
//     this.url = url;
//     this.custom_headers = custom_headers || {};
//   }

//   async model_list(): Promise<OllamaModelListItem[]> {
//     const fetchJSON = new FetchJSON();
//     return (
//       await fetchJSON.fetch(
//         this.url + "tags",
//         this.custom_headers,
//         JSON.stringify({})
//       )
//     ).models;
//   }

//   async model_info(name: string): Promise<OllamaModelInfo> {
//     const fetchJSON = new FetchJSON();
//     return await fetchJSON.fetch(
//       this.url + "show",
//       this.custom_headers,
//       JSON.stringify({
//         model: name,
//       })
//     );
//   }

//   async model_pull(name: string): Promise<OllamaModelCreation> {
//     const fetchJSON = new FetchJSON();
//     return await fetchJSON.fetch(
//       this.url + "pull",
//       this.custom_headers,
//       JSON.stringify({
//         name: name,
//       })
//     );
//   }

//   async model_pull_stream(name: string): Promise<OllamaModelCreation> {
//     const fetchJSON = new FetchJSON();
//     return await fetchJSON.fetch(
//       this.url + "pull",
//       this.custom_headers,
//       JSON.stringify({
//         name: name,
//       })
//     );
//   }

//   // missing
//   // https://github.com/jmorganca/ollama/blob/main/docs/api.md#push-a-model
//   //   async model_push(name:string):Promise<OllamaModelCreation> {}

//   async model_create(
//     model_spec: OllamaModelCreateSpec
//   ): Promise<OllamaModelCreation> {
//     const fetchJSON = new FetchJSON();
//     return await fetchJSON.fetch(
//       this.url + "create",
//       this.custom_headers,
//       JSON.stringify({
//         name: model_spec.name,
//         path: model_spec.path,
//         stream: model_spec.stream || false,
//       })
//     );
//   }

//   async model_create_stream(
//     model_spec: OllamaModelCreateSpec,
//     callback: (response: OllamaStreamResponse) => void
//   ): Promise<FetchJSONstream> {
//     const fetchJSON = new FetchJSON();
//     return await fetchJSON.fetch(
//       this.url + "create",
//       this.custom_headers,
//       JSON.stringify({
//         name: model_spec.name,
//         path: model_spec.path,
//         stream: model_spec.stream || false,
//       })
//     );
//   }

//   async model_copy(
//     source: string,
//     destination: string
//   ): Promise<OllamaModelCreation> {
//     const fetchJSON = new FetchJSON();
//     return await fetchJSON.fetch(
//       this.url + "copy",
//       this.custom_headers,
//       JSON.stringify({
//         source: source,
//         destination: destination,
//       })
//     );
//   }

//   async model_delete(model: string): Promise<OllamaModelCreation> {
//     const fetchJSON = new FetchJSON();
//     return await fetchJSON.fetch(
//       this.url + "delete",
//       this.custom_headers,
//       JSON.stringify({
//         name: model,
//       })
//     );
//   }
// }