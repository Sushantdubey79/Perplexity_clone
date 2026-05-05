import type { WebSearch } from "../interfaces/webSearch.js";
export declare class TavilyWebSearch implements WebSearch<String> {
    private static tavilyClient;
    constructor();
    SearchWeb(query: string): Promise<String>;
}
//# sourceMappingURL=tavilyWebSearch.d.ts.map