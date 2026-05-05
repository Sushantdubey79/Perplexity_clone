import { PrismaClient } from "../generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";  

export class PrismaClientClass{

   private static prismaClient : PrismaClient;

   public static getInstance() {


        if (this.prismaClient === undefined ){

            this.prismaClient = new PrismaClient({
                adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
              })

        }

        return this.prismaClient;

   }



}