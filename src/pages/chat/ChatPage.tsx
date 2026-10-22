import { LogOut, MessageCircle, Plus, Search } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import { createChatId, getPhoneFromChatId } from "@/entities/chat/model/chat-id";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { useSendMessage } from "@/features/messaging/api/useSendMessage";
import { useMessagePolling } from "@/features/messaging/hooks/useMessagePolling";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ChatComposer, ChatHeader, ChatWindow } from "@/widgets/chat";

export function ChatPage() {
  const logout = useAuthStore((state) => state.logout);
  const clearMessaging = useMessagingStore((state) => state.clear);
  const chats = useMessagingStore((state) => state.chats);
  const activeChatId = useMessagingStore((state) => state.activeChatId);
  const messagesByChat = useMessagingStore((state) => state.messagesByChat);
  const pollingError = useMessagingStore((state) => state.pollingError);
  const openChat = useMessagingStore((state) => state.openChat);
  const setActiveChat = useMessagingStore((state) => state.setActiveChat);
  const sendMessage = useSendMessage();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useMessagePolling();

  const activeChat = activeChatId ? chats[activeChatId] : undefined;
  const sortedChats = Object.values(chats).sort((left, right) =>
    left.phone.localeCompare(right.phone),
  );

  function handleOpenChat(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const chatId = createChatId(phone);
    const normalizedPhone = chatId ? getPhoneFromChatId(chatId) : null;
    if (!chatId || !normalizedPhone) {
      setPhoneError("Enter a valid phone number with country code.");
      return;
    }

    openChat({ id: chatId, phone: normalizedPhone });
    setPhone("");
    setPhoneError(null);
  }

  function handleLogout() {
    clearMessaging();
    logout();
  }

  return (
    <main className="flex h-svh flex-col bg-background text-foreground">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 border-x bg-card shadow-sm">
        <aside
          className={`flex w-full shrink-0 flex-col border-r md:w-80 ${activeChat ? "hidden md:flex" : "flex"}`}
        >
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-5">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageCircle aria-hidden="true" className="size-4" />
              </span>
              Green Chat
            </div>
            <Button
              aria-label="Sign out"
              onClick={handleLogout}
              size="icon"
              type="button"
              variant="ghost"
            >
              <LogOut aria-hidden="true" />
            </Button>
          </header>

          <form className="space-y-2 border-b p-4" onSubmit={handleOpenChat}>
            <label className="text-xs font-medium text-muted-foreground" htmlFor="recipient-phone">
              Start a conversation
            </label>
            <div className="flex gap-2">
              <Input
                aria-describedby={phoneError ? "phone-error" : undefined}
                aria-invalid={phoneError ? true : undefined}
                autoComplete="tel"
                id="recipient-phone"
                inputMode="tel"
                onChange={(event) => {
                  setPhone(event.target.value);
                  if (phoneError) setPhoneError(null);
                }}
                placeholder="Phone with country code"
                value={phone}
              />
              <Button aria-label="Open chat" size="icon" type="submit">
                <Plus aria-hidden="true" />
              </Button>
            </div>
            {phoneError && (
              <p className="text-xs text-destructive" id="phone-error" role="alert">
                {phoneError}
              </p>
            )}
          </form>

          <div className="flex items-center gap-2 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground">
            <Search aria-hidden="true" className="size-3.5" />
            Conversations
          </div>
          <nav aria-label="Conversations" className="min-h-0 flex-1 overflow-y-auto p-2">
            {sortedChats.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Your conversations will appear here.
              </p>
            ) : (
              sortedChats.map((chat) => (
                <button
                  aria-current={activeChatId === chat.id ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted ${activeChatId === chat.id ? "bg-muted" : ""}`}
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  type="button"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {chat.phone.slice(-2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">+{chat.phone}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {messagesByChat[chat.id]?.at(-1)?.text ?? "No messages yet"}
                    </span>
                  </span>
                </button>
              ))
            )}
          </nav>
        </aside>

        <section className={`min-w-0 flex-1 flex-col ${activeChat ? "flex" : "hidden md:flex"}`}>
          {activeChat ? (
            <>
              <ChatHeader chat={activeChat} onBack={() => setActiveChat(null)} />
              <ChatWindow
                chat={activeChat}
                messages={messagesByChat[activeChat.id] ?? []}
                pollingError={pollingError}
              />
              <ChatComposer onSend={(text) => void sendMessage(activeChat.id, text)} />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle aria-hidden="true" className="size-5" />
              </span>
              <h1 className="text-lg font-semibold tracking-tight">Select a chat</h1>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Choose a conversation or enter a phone number to start a new one.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
