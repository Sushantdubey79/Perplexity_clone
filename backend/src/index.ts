import express from "express";

import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

import { SYSTEM_PROMPT, PROMPT_TEMPLATE } from "./prompt.js";

import { CONFIGURATION } from "./configuration.js";

import { WebSearchFactory } from "./factory/webSearchFactory.js";

import { PrismaClientClass } from "./db/prismaClient.js";
import { PrismaUserRepository } from "./respositories/user.js";
import { UserService } from "./services/userService.js";




dotenv.config();

const app = express();

app.use(express.json());

try{

    const prismaClient =  PrismaClientClass.getInstance();

    const TavilyClient = WebSearchFactory.getWebSearchClient("TavillyWebSearch");

    const ai = new GoogleGenAI({apiKey : process.env.GOOGLE_API_KEY!});

    app.post("/preplexity-ask" , async (req,res) => {


        try{

            const question = req.body.query;

            const webSearchResults : String = await TavilyClient.SearchWeb(question);
            

            const queryTemplate = PROMPT_TEMPLATE.replace("{{web_search_results}}", JSON.stringify(webSearchResults)).replace("{{user_query}}" , question);


            const response = await ai.models.generateContentStream({
                model: CONFIGURATION.model,
                contents: queryTemplate,
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                },
            });

            res.header("Cache-Control" , "no-cache");
            res.header("Content-Type" , "text/event-stream");


            for await (const chunk of response) {
                const text = chunk.text;
                if (text) {
                    res.write(`data: ${JSON.stringify({ type: "answer", content: text })}\n\n`);
                }
            }

            res.write(`data: ${JSON.stringify({ type: "sources", content: webSearchResults })}\n\n`);
            res.write("event: done\ndata: [DONE]\n\n");
            
            res.end();
            

        }
        catch(e){
            console.log(JSON.stringify(e));
            res.status(500).json({"Error" : "something went wrong"});
        }

        })

    }

    catch(e){
        console.log(JSON.stringify(e));
        console.log("Error in initializing the server");
        process.exit(1);
    }

try{
    app.listen(CONFIGURATION.port, () => {
        console.log("Server is running on port 3000");
    });
}
catch(e){
    console.log(JSON.stringify(e));
    console.log("Error in starting the server");
    process.exit(1);
}

