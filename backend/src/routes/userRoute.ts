import { Router } from "express";
import { PrismaUserRepository } from "../respositories/user.js";

import { PrismaClientClass } from "../db/prismaClient.js";

import { Prisma, type User } from "../generated/prisma/client.js";


const prismaClient = PrismaClientClass.getInstance();

const userRepo = new PrismaUserRepository(prismaClient);

const userRouter = Router();


userRouter.get("/:id" , async (req , res) => {

    try{

    const id = req.query.id;
    
    const resp = await userRepo.findBySuperBaseId(String(id));

    res.status(200).json({

        "name" : resp?.name,
        "email" : resp?.email

    });

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

        const userData : User = req.body;
    
        const resp = await userRepo.create(userData);

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



})


export default userRouter;

