export type ParsedAssistantResponse = {
  answer: string;
  followUpQuestions: string[];
};

function extractFollowUpQuestions(content: string): string[] {
  const followUpQuestions: string[] = [];
  const followUpBlock = content.match(
    /<FollowUpQuestions>([\s\S]*?)(?:<\/FollowUpQuestions>|$)/i
  );

  if (!followUpBlock) return followUpQuestions;

  const questionRegex = /<questions>\s*([\s\S]*?)\s*<\/questions>/gi;
  let match: RegExpExecArray | null;
  while ((match = questionRegex.exec(followUpBlock[1])) !== null) {
    const question = match[1].trim();
    if (question) followUpQuestions.push(question);
  }

  return followUpQuestions;
}

function stripFollowUpBlock(content: string): string {
  return content
    .replace(/<FollowUpQuestions>[\s\S]*?(?:<\/FollowUpQuestions>|$)/gi, "")
    .trim();
}

function stripQueryResponseWrapper(content: string): string {
  const queryMatch = content.match(
    /<QueryResponse>\s*([\s\S]*?)(?:<\/QueryResponse>|<QueryResponse>|$)/i
  );

  if (queryMatch?.[1] !== undefined) {
    return queryMatch[1].trim();
  }

  return content
    .replace(/<\/?QueryResponse>/gi, "")
    .trim();
}

function stripXmlArtifacts(text: string): string {
  return text
    .replace(/<\/?QueryResponse>/gi, "")
    .replace(/<\/?FollowUpQuestions>/gi, "")
    .replace(/<\/?questions>/gi, "")
    .trim();
}

export function parseAssistantResponse(
  content: string
): ParsedAssistantResponse {
  const followUpQuestions = extractFollowUpQuestions(content);

  let answer = stripFollowUpBlock(content);
  answer = stripQueryResponseWrapper(answer);
  answer = stripXmlArtifacts(answer);

  return { answer, followUpQuestions };
}
