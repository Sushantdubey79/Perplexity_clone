import type { WebSearch } from "../services/webSearch.js";
import { tavily } from "@tavily/core";
import type { TavilyClient } from "@tavily/core";

export class TavilyWebSearch implements WebSearch<String> {

    private static tavilyClient: TavilyClient;

    constructor() {
        if (!process.env.TAVILY_API_KEY) {
            throw new Error("TAVILY_API_KEY is missing in environment variables");
        }

        if (!TavilyWebSearch.tavilyClient) {
            TavilyWebSearch.tavilyClient = tavily({apiKey: process.env.TAVILY_API_KEY!});
        }
    }

    public async SearchWeb(query: string): Promise<String> {
        const webSearchResults = await TavilyWebSearch.tavilyClient.search(query, { search_depth: "advanced" });
        const FormatttedSearchResults = webSearchResults.results;
        return JSON.stringify(FormatttedSearchResults);

    }



}