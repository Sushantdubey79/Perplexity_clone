import type { Prisma, PrismaClient, User } from "../generated/prisma/client.js";

export interface CreateUserInput {
    email: string;
    name: string;
    supaBaseId : string
}

export interface UserRepository {
    findBySuperBaseId(id: string): Promise<User | null>;
    create(data: CreateUserInput): Promise<User>;
}

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prismaClient: PrismaClient) {}

    public async findBySuperBaseId(id: string): Promise<User | null> {
        return this.prismaClient.user.findUnique({
            where: { supaBaseId : id },
        });
    }

    public async create(data: CreateUserInput): Promise<User> {
        return this.prismaClient.user.create({
            data: data as Prisma.UserCreateInput,
        });
    }
}