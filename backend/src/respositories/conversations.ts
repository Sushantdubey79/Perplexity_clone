import type { PrismaClient, Conversation } from "../generated/prisma/client.js";

export interface CreateConversation {
    title: string;
    slug: string;
    userId: string;
}

export interface ConversationRepository {
    findByUserId(id: string): Promise<Conversation[] | null>;
    create(data: CreateConversation): Promise<Conversation>;
}

export class PrismaConversationRepository implements ConversationRepository {
    constructor(private readonly prismaClient: PrismaClient) {}

    public async findByUserId(id: string): Promise<Conversation[] | null> {
        return this.prismaClient.conversation.findMany({
            where: { userId : id },
        });
    }

    public async create(data: CreateConversation): Promise<Conversation> {
    return this.prismaClient.conversation.create({
        data: {
            title: data.title,
            slug: data.slug,


            user: {
                connect: {
                    id: data.userId
                }
            }
        }
    });
}
}