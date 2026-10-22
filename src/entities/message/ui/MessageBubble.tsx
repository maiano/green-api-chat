import { AlertCircle, Check, Clock3 } from "lucide-react";
import type { Message } from "@/entities/message/model/types";
import { cn } from "@/shared/lib/utils";

type MessageBubbleProps = {
  message: Message;
};

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(timestamp);
}

function MessageStatus({ message }: { message: Message }) {
  if (message.sender !== "me") return null;

  if (message.status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Clock3 aria-hidden="true" className="size-3" />
        <span className="sr-only">Sending</span>
      </span>
    );
  }

  if (message.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-destructive">
        <AlertCircle aria-hidden="true" className="size-3" />
        <span className="sr-only">Not sent</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-muted-foreground">
      <Check aria-hidden="true" className="size-3.5" />
      <span className="sr-only">Accepted by GREEN-API</span>
    </span>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.sender === "me";

  return (
    <div className={cn("flex w-full", isOutgoing ? "justify-end" : "justify-start")}>
      <article
        aria-label={isOutgoing ? "Outgoing message" : "Incoming message"}
        className={cn(
          "max-w-[min(80%,42rem)] rounded-xl px-3.5 py-2.5 shadow-sm",
          isOutgoing
            ? "rounded-br-sm bg-accent text-accent-foreground"
            : "rounded-bl-sm bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <footer className="mt-1 flex items-center justify-end gap-1.5 text-[0.6875rem] leading-none text-muted-foreground">
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {formatTime(message.timestamp)}
          </time>
          <MessageStatus message={message} />
        </footer>
        {message.status === "error" && message.error && (
          <p className="mt-1 text-xs text-destructive" role="status">
            {message.error}
          </p>
        )}
      </article>
    </div>
  );
}
