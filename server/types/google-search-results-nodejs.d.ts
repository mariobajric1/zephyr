declare module 'google-search-results-nodejs' {
  export default class SerpApi {
    constructor(apiKey: string);
    search(params: {
      engine: string;
      q: string;
      num?: number;
    }, callback: (data: any) => void): void;
  }
}
