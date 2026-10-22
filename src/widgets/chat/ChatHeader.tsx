import { ArrowLeft, LogOut, MessageCircle } from "lucide-react";
import type { Chat } from "@/entities/chat/model/types";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

type ChatHeaderProps = {
  chat: Chat;
  onBack?: () => void;
  onLogout?: () => void;
};

export function ChatHeader({ chat, onBack, onLogout }: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card px-4 sm:px-6">
      {onBack && (
        <Button
          aria-label="Back to chats"
          className="md:hidden"
          onClick={onBack}
          size="icon"
          type="button"
          variant="ghost"
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
      )}
      <Avatar className="size-10">
        <AvatarFallback className="bg-primary/10 font-medium text-primary">
          {chat.phone.slice(-2)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold">+{chat.phone}</h1>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageCircle aria-hidden="true" className="size-3" />
          WhatsApp chat
        </p>
      </div>
      {onLogout && (
        <Button
          aria-label="Sign out"
          className="ml-auto"
          onClick={onLogout}
          size="icon"
          type="button"
          variant="ghost"
        >
          <LogOut aria-hidden="true" />
        </Button>
      )}
    </header>
  );
}
