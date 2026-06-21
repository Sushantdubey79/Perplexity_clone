import { Router , type Request , type Response } from "express";
import { PrismaUserRepository } from "../respositories/user.js";
import { PrismaConversationRepository, type CreateConversation } from "../respositories/conversations.js";
import { PrismaMessageRepository } from "../respositories/message.js";

import { PrismaClientClass } from "../db/prismaClient.js";

import { Prisma } from "../generated/prisma/client.js";

import type { CreateMessageInput } from "../respositories/message.js";

import { MessageRole } from "../generated/prisma/client.js";


const prismaClient = PrismaClientClass.getInstance();

const userRepo = new PrismaUserRepository(prismaClient);
const conversationRepo = new PrismaConversationRepository(prismaClient);
const messageRepo = new PrismaMessageRepository(prismaClient);

const userRouter = Router();


const getUserData = async (req : Request ,res : Response) => {
    const id = req.params.id;
    return userRepo.findBySuperBaseId(String(id));
}


userRouter.get("/:id" , async (req , res) => {

    try{

        const resp = await getUserData(req,res);

        res.json({
            "name" : resp?.name,
            "email" : resp?.email
        })
        
    }

    catch(e){

        console.log("Error in creating the user " + JSON.stringify(e));

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    return res.status(409).json({
                        error: "A user with this unique value already exists.",
                        code: e.code,
                    });
                case "P2003":
                    return res.status(400).json({
                        error: "Invalid reference data provided.",
                        code: e.code,
                    });
                case "P2025":
                    return res.status(404).json({
                        error: "Requested record was not found.",
                        code: e.code,
                    });
                case "P2023":
                    return res.status(400).json({
                        error: "Malformed input for database query.",
                        code: e.code,
                    });
                default:
                    return res.status(400).json({
                        error: "Database request failed.",
                        code: e.code,
                    });
            }
          }
        res.status(500).json({
            "error" : "Something went wrong. Please Try Again"
        })

    }



})

userRouter.post("/" , async (req , res) => {

    try{

        const data = req.body;

        const userData : Prisma.UserCreateInput = {
            name : data.name,
            email : data.email,
            supaBaseId : data.supaBaseId
        }
    
    const resp = await userRepo.upsert(userData);

    res.status(200).json({

        "name" : resp?.name,
        "email" : resp?.email

    });

    }
    catch(e){

        console.log("Error in the search by id api with error " + JSON.stringify(e));

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    return res.status(409).json({
                        error: "A user with this unique value already exists.",
                        code: e.code,
                    });
                case "P2003":
                    return res.status(400).json({
                        error: "Invalid reference data provided.",
                        code: e.code,
                    });
                case "P2025":
                    return res.status(404).json({
                        error: "Requested record was not found.",
                        code: e.code,
                    });
                case "P2023":
                    return res.status(400).json({
                        error: "Malformed input for database query.",
                        code: e.code,
                    });
                default:
                    return res.status(400).json({
                        error: "Database request failed.",
                        code: e.code,
                    });
            }
          }
        res.status(500).json({
            "error" : "Something went wrong. Please Try Again"
        })

    }

});

userRouter.get('/isUser/:id' , async (req, res) => {

    try{

        const resp = await getUserData(req,res);



        if (Object.keys(resp!).length > 0){

            res.json({
                "success": "userExist"
            })

        }
        else{

            res.status(404).json({
                "error" : "user not found"
            })

        }

    }
    catch(e){

        console.log("Error in the search by id api with error " + JSON.stringify(e));

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    return res.status(409).json({
                        error: "A user with this unique value already exists.",
                        code: e.code,
                    });
                case "P2003":
                    return res.status(400).json({
                        error: "Invalid reference data provided.",
                        code: e.code,
                    });
                case "P2025":
                    return res.status(404).json({
                        error: "Requested record was not found.",
                        code: e.code,
                    });
                case "P2023":
                    return res.status(400).json({
                        error: "Malformed input for database query.",
                        code: e.code,
                    });
                default:
                    return res.status(400).json({
                        error: "Database request failed.",
                        code: e.code,
                    });
            }
          }


}


})


userRouter.get('/getConversationalData/:id' , async (req, res) => {

    try{

        const resp = await getUserData(req,res);



        if (Object.keys(resp!).length > 0){

            const conversations = await conversationRepo.findByUserId(resp?.id!);

            if (conversations){

                res.json({"conversation" : conversations});

            }
            else{
                res.status(404).json({
                "error" : "No conversation available for the user"
            })
            }

        }
        else{

            res.status(404).json({
                "error" : "user not found"
            })

        }

    }
    catch(e){

        console.log("Error in the search by id api with error " + JSON.stringify(e));

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    return res.status(409).json({
                        error: "A user with this unique value already exists.",
                        code: e.code,
                    });
                case "P2003":
                    return res.status(400).json({
                        error: "Invalid reference data provided.",
                        code: e.code,
                    });
                case "P2025":
                    return res.status(404).json({
                        error: "Requested record was not found.",
                        code: e.code,
                    });
                case "P2023":
                    return res.status(400).json({
                        error: "Malformed input for database query.",
                        code: e.code,
                    });
                default:
                    return res.status(400).json({
                        error: "Database request failed.",
                        code: e.code,
                    });
            }
          }


}


})

userRouter.get('/getMessages/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!conversationId) {
            return res.status(400).json({ error: "conversationId parameter is required" });
        }

        const messages = await messageRepo.findMessagesByConversationId(conversationId);

        return res.json({ conversationId, messages });
    } catch (e) {
        console.log("Error fetching messages by conversation id: " + JSON.stringify(e));

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    return res.status(409).json({
                        error: "A user with this unique value already exists.",
                        code: e.code,
                    });
                case "P2003":
                    return res.status(400).json({
                        error: "Invalid reference data provided.",
                        code: e.code,
                    });
                case "P2025":
                    return res.status(404).json({
                        error: "Requested record was not found.",
                        code: e.code,
                    });
                case "P2023":
                    return res.status(400).json({
                        error: "Malformed input for database query.",
                        code: e.code,
                    });
                default:
                    return res.status(400).json({
                        error: "Database request failed.",
                        code: e.code,
                    });
            }
        }

        return res.status(500).json({ error: "Something went wrong. Please Try Again" });
    }
});


userRouter.post("/createConversation" , async (req , res) => {

    try{

        const data = req.body;

        // Find user by supabaseId
        const user = await userRepo.findBySuperBaseId(data.supabaseId);
        
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const conversationData : CreateConversation = {
            title : data.title,
            slug : data.slug,
            userId : user.id
        }
    
    const resp = await conversationRepo.create(conversationData);

    res.status(200).json({

        "conversationId" : resp.id

    });

    }
    catch(e){

        console.log("Error in the search by id api with error " + JSON.stringify(e));

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    return res.status(409).json({
                        error: "A Conversation already exists.",
                        code: e.code,
                    });
                case "P2003":
                    return res.status(400).json({
                        error: "Invalid reference data provided.",
                        code: e.code,
                    });
                case "P2025":
                    return res.status(404).json({
                        error: "Requested record was not found.",
                        code: e.code,
                    });
                case "P2023":
                    return res.status(400).json({
                        error: "Malformed input for database query.",
                        code: e.code,
                    });
                default:
                    return res.status(400).json({
                        error: "Database request failed.",
                        code: e.code,
                    });
            }
          }
        res.status(500).json({
            "error" : "Something went wrong. Please Try Again"
        })

    }

});

userRouter.post("/createMessage" , async (req , res) => {

    try{

        const data = req.body;
            
        const messageData : CreateMessageInput = {
            content : data.message,
            role : data.role == "user"? MessageRole.User : MessageRole.Assistant,
            conversationId : data.conversationId

        }
    
    const resp = await messageRepo.createMessage(messageData);

    res.status(200).json({

        "success" : "message added"

    });

    }
    catch(e){

        console.log("Error in the search by id api with error " + JSON.stringify(e));

        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    return res.status(409).json({
                        error: "A Conversation already exists.",
                        code: e.code,
                    });
                case "P2003":
                    return res.status(400).json({
                        error: "Invalid reference data provided.",
                        code: e.code,
                    });
                case "P2025":
                    return res.status(404).json({
                        error: "Requested record was not found.",
                        code: e.code,
                    });
                case "P2023":
                    return res.status(400).json({
                        error: "Malformed input for database query.",
                        code: e.code,
                    });
                default:
                    return res.status(400).json({
                        error: "Database request failed.",
                        code: e.code,
                    });
            }
          }
        res.status(500).json({
            "error" : "Something went wrong. Please Try Again"
        })

    }

});


export default userRouter;

