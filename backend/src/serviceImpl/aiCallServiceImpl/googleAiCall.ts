import type { AiCall } from "../../services/aiCall.js";
import { GoogleGenAI } from "@google/genai";
import { CONFIGURATION } from "../../configuration.js";

export class GoogleAiCall implements AiCall{

    private static googleAiClient :  GoogleGenAI;

    constructor(){
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error("GOOGLE_API_KEY is missing in environment variables");
        }

        if (!GoogleAiCall.googleAiClient) {
            GoogleAiCall.googleAiClient = new GoogleGenAI({apiKey : process.env.GOOGLE_API_KEY});
        }
        
    }

    public async *completeChat(userQuery: string, systemPrompt: string): AsyncGenerator<{ type: string; content: string; }, void, unknown> {
        

        const response =  await GoogleAiCall.googleAiClient.models.generateContentStream({
                        model: CONFIGURATION.model,
                        contents: userQuery,
                        config: {
                            systemInstruction: systemPrompt,
                        },
                    });

        for await (const chunk of response){
            if (chunk.text){
                yield  { type: "answer", content: chunk.text };
            }
        }


    }


}