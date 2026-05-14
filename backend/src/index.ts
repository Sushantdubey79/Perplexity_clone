import express from "express";
import dotenv from "dotenv";
import perplexityRouter from "./routes/perplexityRouter.js"
import { startServer } from "./startServer.js";
import userRouter from "./routes/userRoute.js";



dotenv.config();

const app = express();

app.use(express.json());

try{

    app.use("/perplexity" , perplexityRouter);
    app.use("/user" , userRouter);

}

    catch(e){
    console.log(JSON.stringify(e));
    process.exit(1);
}

try{
    startServer(app);
}
catch(e){
    console.log(JSON.stringify(e));
    console.log("Error in starting the server");
    process.exit(1);
}

