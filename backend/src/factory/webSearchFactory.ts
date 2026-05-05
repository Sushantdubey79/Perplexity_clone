import { TavilyWebSearch } from "../serviceImpl/tavilyWebSearch.js";
import type { WebSearch } from "../services/webSearch.js";


export class WebSearchFactory{


    public static getWebSearchClient(clientClass : String) : WebSearch<String>{

        switch(clientClass){

            case "TavillyWebSearch":
                return new TavilyWebSearch();
            default:
                throw new Error("Web search client not implemented");
                
        }


    }


}