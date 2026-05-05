import type { Prisma, PrismaClient, User } from "../generated/prisma/client.js";

export interface CreateUserInput {
    email: string;
    name: string;
    provider: "Google" | "Github";
}

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserInput): Promise<User>;
}

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prismaClient: PrismaClient) {}

    public async findById(id: string): Promise<User | null> {
        return this.prismaClient.user.findUnique({
            where: { id },
        });
    }

    public async findByEmail(email: string): Promise<User | null> {
        return this.prismaClient.user.findFirst({
            where: { email },
        });
    }

    public async create(data: CreateUserInput): Promise<User> {
        return this.prismaClient.user.create({
            data: data as Prisma.UserCreateInput,
        });
    }
}