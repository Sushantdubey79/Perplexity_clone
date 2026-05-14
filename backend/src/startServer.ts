import type {Express} from "express"
import { CONFIGURATION } from "./configuration.js";

export function startServer(app : Express){


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

}