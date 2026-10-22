import { MessageCircle } from "lucide-react";
import type { Chat } from "@/entities/chat/model/types";
import type { Message } from "@/entities/message/model/types";
import { MessageBubble } from "@/entities/message/ui/MessageBubble";
import { ScrollArea } from "@/shared/ui/scroll-area";

type ChatWindowProps = {
  chat: Chat;
  messages: Message[];
  pollingError?: string | null;
};

export function ChatWindow({ chat, messages, pollingError }: ChatWindowProps) {
  return (
    <section
      aria-label={`Conversation with +${chat.phone}`}
      className="flex min-h-0 flex-1 flex-col"
    >
      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-3 px-4 py-5 sm:px-6">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle aria-hidden="true" className="size-5" />
              </span>
              <h2 className="text-sm font-medium">No messages yet</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Send a message to start the conversation. New replies will appear here.
              </p>
            </div>
          ) : (
            <div aria-label="Messages" className="flex flex-col gap-3" role="log">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          )}
          {pollingError && (
            <p
              className="mx-auto rounded-lg border bg-card px-3 py-2 text-center text-xs text-muted-foreground"
              role="status"
            >
              {pollingError}
            </p>
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
