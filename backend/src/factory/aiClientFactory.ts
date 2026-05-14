import { GoogleAiCall } from "../serviceImpl/aiCallServiceImpl/googleAiCall.js";
import type { AiCall } from "../services/aiCall.js";

export class AiClientFactory{


    public static getInstance(clientType : string) : AiCall{

        switch(clientType){

            case "GoogleAiClient":
                return new GoogleAiCall();
            default:
                throw new Error("This Client is not Implemented Yet")
        }

    }


}