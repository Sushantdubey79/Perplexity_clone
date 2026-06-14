import type { PrismaClient, Message } from "../generated/prisma/client.js";
import type { MessageRole } from "../generated/prisma/enums.js";

export interface CreateMessageInput {
    content: string;
    role: MessageRole;
    conversationId: string;
}

export interface MessageRepository {
    findMessagesByConversationId(conversationId: string): Promise<Message[]>;
    createMessage(data: CreateMessageInput): Promise<Message>;
}

export class PrismaMessageRepository implements MessageRepository {
    constructor(private readonly prismaClient: PrismaClient) {}

    public async findMessagesByConversationId(conversationId: string): Promise<Message[]> {
        return this.prismaClient.message.findMany({
            where: { conversationId },
            orderBy: { created: "asc" },
        });
    }

    public async createMessage(data: CreateMessageInput): Promise<Message> {
        return this.prismaClient.message.create({
            data: {
                content: data.content,
                role: data.role,
                conversation: {
                    connect: {
                        id: data.conversationId,
                    },
                },
            },
        });
    }
}
