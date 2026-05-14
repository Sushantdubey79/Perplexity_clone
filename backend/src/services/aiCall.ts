export interface AiCall{

    completeChat(userQuery : string , systemPrompt : string) : AsyncGenerator<{ type: string; content: string }, void, unknown>;

}