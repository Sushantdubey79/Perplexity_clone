import { parseAssistantResponse } from "../utils/parseAssistantResponse";

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function FormattedAnswer({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;
        if (/^<\/?[a-zA-Z]+>/.test(trimmed)) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="mt-3 text-base font-semibold">
              {formatInline(trimmed.slice(4))}
            </h3>
          );
        }

        if (/^\s{4}\* /.test(line)) {
          return (
            <li key={index} className="ml-8 list-disc text-sm">
              {formatInline(trimmed.replace(/^\*\s+/, ""))}
            </li>
          );
        }

        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          return (
            <li key={index} className="ml-4 list-disc">
              {formatInline(trimmed.slice(2))}
            </li>
          );
        }

        return (
          <p key={index} className="text-sm leading-relaxed">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function AssistantMessage({
  content,
  isStreaming,
  onFollowUpClick,
}: {
  content: string;
  isStreaming: boolean;
  onFollowUpClick: (question: string) => void;
}) {
  const { answer, followUpQuestions } = parseAssistantResponse(content);
  const showLoading = isStreaming && content.trim().length === 0;

  if (showLoading) {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <span className="text-sm text-slate-500">Thinking...</span>
      </div>
    );
  }

  return (
    <>
      <FormattedAnswer text={answer} />
      {isStreaming && (
        <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-indigo-400" />
      )}
      {!isStreaming && followUpQuestions.length > 0 && (
        <div className="mt-4 border-t border-indigo-100 pt-3">
          <p className="mb-2 text-xs font-medium text-slate-500">Related</p>
          <div className="flex flex-col gap-2">
            {followUpQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onFollowUpClick(question)}
                className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-left text-sm text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
