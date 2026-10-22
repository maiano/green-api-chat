import { beforeEach, describe, expect, it } from "vitest";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";

const message = {
  id: "message-1",
  externalId: "external-1",
  chatId: "14155552671@c.us",
  text: "Hello",
  sender: "them" as const,
  timestamp: 123,
  status: "sent" as const,
};

describe("messaging store", () => {
  beforeEach(() => useMessagingStore.getState().clear());

  it("tracks active chats and stores messages by chat", () => {
    const store = useMessagingStore.getState();
    store.openChat({ id: message.chatId, phone: "14155552671" });
    store.addIncomingMessage(message);

    expect(useMessagingStore.getState().activeChatId).toBe(message.chatId);
    expect(useMessagingStore.getState().messagesByChat[message.chatId]).toEqual([message]);
  });

  it("discovers chats from incoming messages and deduplicates them", () => {
    const store = useMessagingStore.getState();
    store.addIncomingMessage(message);
    store.addIncomingMessage(message);

    expect(useMessagingStore.getState().chats[message.chatId]).toEqual({
      id: message.chatId,
      phone: "14155552671",
    });
    expect(useMessagingStore.getState().messagesByChat[message.chatId]).toHaveLength(1);
  });
});
