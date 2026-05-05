import { tavily } from "@tavily/core";
export class TavilyWebSearch {
    static tavilyClient;
    constructor() {
        if (!process.env.TAVILY_API_KEY) {
            throw new Error("TAVILY_API_KEY is missing in environment variables");
        }
        if (!TavilyWebSearch.tavilyClient) {
            TavilyWebSearch.tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });
        }
    }
    async SearchWeb(query) {
        const webSearchResults = await TavilyWebSearch.tavilyClient.search(query, { search_depth: "advanced" });
        const FormatttedSearchResults = webSearchResults.results;
        return JSON.stringify(FormatttedSearchResults);
    }
}
//# sourceMappingURL=tavilyWebSearch.js.map