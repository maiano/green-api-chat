import { create } from "zustand";
import type { Message } from "@/entities/message/model/types";

type MessagingState = {
  messagesByChat: Record<string, Message[]>;
  pollingError: string | null;
  addIncomingMessage: (message: Message) => void;
  addOptimisticMessage: (message: Message) => void;
  markMessageSent: (chatId: string, localId: string, externalId: string) => void;
  markMessageError: (chatId: string, localId: string, error: string) => void;
  setPollingError: (error: string | null) => void;
};

function containsMessage(messages: Message[], message: Message) {
  return messages.some(
    (existing) =>
      existing.id === message.id ||
      (message.externalId !== undefined && existing.externalId === message.externalId),
  );
}

function appendMessage(
  messagesByChat: Record<string, Message[]>,
  message: Message,
): Record<string, Message[]> {
  const messages = messagesByChat[message.chatId] ?? [];
  if (containsMessage(messages, message)) return messagesByChat;

  return {
    ...messagesByChat,
    [message.chatId]: [...messages, message],
  };
}

export const useMessagingStore = create<MessagingState>((set) => ({
  messagesByChat: {},
  pollingError: null,
  addIncomingMessage: (message) =>
    set((state) => ({ messagesByChat: appendMessage(state.messagesByChat, message) })),
  addOptimisticMessage: (message) =>
    set((state) => ({ messagesByChat: appendMessage(state.messagesByChat, message) })),
  markMessageSent: (chatId, localId, externalId) =>
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId]: (state.messagesByChat[chatId] ?? []).map((message) =>
          message.id === localId
            ? { ...message, externalId, status: "sent", error: undefined }
            : message,
        ),
      },
    })),
  markMessageError: (chatId, localId, error) =>
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId]: (state.messagesByChat[chatId] ?? []).map((message) =>
          message.id === localId ? { ...message, status: "error", error } : message,
        ),
      },
    })),
  setPollingError: (pollingError) => set({ pollingError }),
}));
