import { useContext, useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Input from "./Input";
import AssistantMessage from "./AssistantMessage";
import { ConversationContext } from "../context/ConversationContext";
import axios from "axios";
import { config } from "../configuration/config";
import { useUserData } from "../hooks/useUserData";
import { toast } from "react-toastify";

type ConversationMessage = {
  id: number;
  content: string;
  role: string;
  created: string;
};

type StreamChunk = {
  type?: string;
  content?: string;
  text?: string;
};

async function* readSseStream(response: Response): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          yield line.slice(6).trim();
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export default function Main({
  messages,
  setMessages,
  loading,
  onConversationCreated,
}: Readonly<{
  messages: ConversationMessage[];
  setMessages: Dispatch<SetStateAction<ConversationMessage[]>>;
  loading: boolean;
  onConversationCreated?: () => void;
}>) {
  const { userData } = useUserData();
  const { conversationId: selectedConversationId, setConversationId } =
    useContext(ConversationContext)!;
  const [streamingMessageId, setStreamingMessageId] = useState<number | null>(
    null
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: isAiLoading ? "auto" : "smooth",
    });
  }, [messages, isAiLoading, streamingMessageId, loading]);

  const createConversation = async (message: string) => {
    try {
      if (!userData?.supaBaseId) {
        toast.error("User ID not available");
        return null;
      }

      const resp = await axios.post(config.BACKEND_URL + "/user/createConversation", {
        supabaseId: userData.supaBaseId,
        title: message,
        slug: message
      } , {headers : {
        Authorization : userData.access_token
      }});

      const newConversationId = resp.data.conversationId || resp.data.id;
      setConversationId(newConversationId);
      onConversationCreated?.();
      return newConversationId;
    } catch (error) {
      toast.error("Error creating conversation: " + error);
      return null;
    }
  }

  const submit = async (userMessage: string) => {
    if (!userMessage.trim() || isAiLoading) return;

    const userMsgId = Date.now();
    const assistantMsgId = Date.now() + 1;

    const userMsg: ConversationMessage = {
      id: userMsgId,
      content: userMessage,
      role: "User",
      created: new Date().toISOString(),
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: assistantMsgId,
        content: "",
        role: "Assistant",
        created: new Date().toISOString(),
      },
    ]);
    setStreamingMessageId(assistantMsgId);
    setIsAiLoading(true);

    let convId = selectedConversationId;

    try {
      if (selectedConversationId == null || selectedConversationId == "") {
        convId = await createConversation(userMessage);
        if (!convId) {
          toast.error("Failed to create conversation");
          setMessages((prev) =>
            prev.filter((m) => m.id !== userMsgId && m.id !== assistantMsgId)
          );
          return;
        }
      }

      const response = await fetch(config.BACKEND_URL + "/perplexity/preplexity-ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData?.access_token || "",
        },
        body: JSON.stringify({
          query: userMessage,
          conversationId: convId,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to get response");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
        return;
      }

      let assistantMessage = "";

      for await (const data of readSseStream(response)) {
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data) as StreamChunk;
          if (parsed.type === "sources") continue;

          const chunkText = parsed.content ?? parsed.text;
          if (!chunkText) continue;

          assistantMessage += chunkText;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: assistantMessage }
                : m
            )
          );
        } catch {
          // ignore malformed SSE chunks
        }
      }
    } catch (error) {
      toast.error("Error sending message: " + error);
      console.error(error);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
    } finally {
      setIsAiLoading(false);
      setStreamingMessageId(null);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setConversationId("");
  };

  const renderMessages = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          Loading messages...
        </div>
      );
    }

    if (messages.length > 0) {
      return messages.map((message) => {
        const isUser = message.role?.toLowerCase() === "user";
        const isStreaming = message.id === streamingMessageId;

        return (
          <div
            key={message.id}
            className={`mb-3 flex ${isUser ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl border ${
                isUser
                  ? "bg-slate-50 border-slate-100 text-slate-900"
                  : "bg-indigo-50 border-indigo-100 text-slate-900"
              }`}
            >
              <div className="text-[11px] text-slate-500">{message.role}</div>
              <div className="mt-1 text-sm">
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <AssistantMessage
                    content={message.content}
                    isStreaming={isStreaming}
                    onFollowUpClick={submit}
                  />
                )}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                {new Date(message.created).toLocaleString()}
              </div>
            </div>
          </div>
        );
      });
    }

    if (selectedConversationId !== null) {
      return <div className="text-sm text-gray-500">No messages in this conversation.</div>;
    }

    return <div className="text-sm text-gray-500">Start a new conversation to see messages here.</div>;
  };

  return (
    <div className="flex h-full min-h-0 flex-col p-8">
      <div className="flex flex-row justify-end shrink-0">
        <button
          className="bg-indigo-600 shadow rounded p-2 text-white text-xs"
          onClick={startNewConversation}
        >
          New Conversation
        </button>
      </div>
      <div
        ref={messagesContainerRef}
        className="mt-2 flex-1 min-h-0 overflow-y-auto rounded p-2 shadow"
      >
        {renderMessages()}
      </div>

      <div className="mt-4 shrink-0">
        <Input submit={submit} disabled={isAiLoading}></Input>
      </div>
    </div>
  );
}