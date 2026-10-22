import { Send } from "lucide-react";
import { type KeyboardEvent, type SubmitEvent, useState } from "react";
import { MAX_MESSAGE_LENGTH } from "@/shared/config/messaging";
import { Button } from "@/shared/ui/button";

type ChatComposerProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled = false }: ChatComposerProps) {
  const [text, setText] = useState("");
  const trimmedText = text.trim();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmedText || disabled) return;

    onSend(trimmedText);
    setText("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form className="shrink-0 border-t bg-card px-3 py-3 sm:px-6 sm:py-4" onSubmit={handleSubmit}>
      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border bg-background p-2 pl-4 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
        <label className="sr-only" htmlFor="chat-message">
          Message
        </label>
        <textarea
          className="max-h-40 min-h-9 flex-1 resize-y bg-transparent py-2 text-sm leading-5 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          disabled={disabled}
          id="chat-message"
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          rows={1}
          value={text}
        />
        <Button
          aria-label="Send message"
          disabled={!trimmedText || disabled}
          size="icon"
          type="submit"
        >
          <Send aria-hidden="true" />
        </Button>
      </div>
      <p className="mx-auto mt-2 max-w-4xl text-[11px] text-muted-foreground">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
}
