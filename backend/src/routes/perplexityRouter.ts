import { Router } from "express";
import { PrismaClientClass } from "../db/prismaClient.js";
import { AiClientFactory } from "../factory/aiClientFactory.js";
import { WebSearchFactory } from "../factory/webSearchFactory.js";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "../prompt.js";
import { PrismaMessageRepository } from "../respositories/message.js";
import { MessageRole } from "../generated/prisma/enums.js";

const perplexityRouter = Router();

const prismaClient = PrismaClientClass.getInstance();
const messageRepo = new PrismaMessageRepository(prismaClient);
const TavilyClient = WebSearchFactory.getWebSearchClient("TavillyWebSearch");
const GoogleAiClient = AiClientFactory.getInstance("GoogleAiClient");

perplexityRouter.post("/preplexity-ask", async (req, res) => {
  try {
    const question = req.body.query;
    const conversationId = req.body.conversationId;

    await messageRepo.createMessage({
      content: question,
      role: MessageRole.User,
      conversationId,
    });

    const webSearchResults: String = await TavilyClient.SearchWeb(question);
    const queryTemplate = PROMPT_TEMPLATE.replace(
      "{{web_search_results}}",
      JSON.stringify(webSearchResults)
    ).replace("{{user_query}}", question);
    const response = GoogleAiClient.completeChat(queryTemplate, SYSTEM_PROMPT);

    res.header("Cache-Control", "no-cache");
    res.header("Content-Type", "text/event-stream");

    let fullResponse = "";

    for await (const chunk of response) {
      fullResponse += chunk.content || "";
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    if (fullResponse) {
      await messageRepo.createMessage({
        content: fullResponse,
        role: MessageRole.Assistant,
        conversationId,
      });
    }

    res.write(
      `data: ${JSON.stringify({ type: "sources", content: webSearchResults })}\n\n`
    );
    res.write("event: done\ndata: [DONE]\n\n");
    res.end();
  } catch (e) {
    console.log(JSON.stringify(e));
    res.status(500).json({ Error: "something went wrong" });
  }
});

export default perplexityRouter;
