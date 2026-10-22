import { describe, expect, it } from "vitest";
import { createOutgoingMessage, mapIncomingMessage } from "@/entities/message/model/mapper";
import { messageSchema } from "@/entities/message/model/schemas";

describe("message mapping and validation", () => {
  it("maps a valid incoming text message", () => {
    expect(
      mapIncomingMessage({
        typeWebhook: "incomingMessageReceived",
        idMessage: "external-1",
        timestamp: 1_700_000_000,
        senderData: { chatId: "14155552671@c.us" },
        messageData: { textMessageData: { textMessage: "Hello" } },
      }),
    ).toEqual({
      id: "external-1",
      externalId: "external-1",
      chatId: "14155552671@c.us",
      text: "Hello",
      sender: "them",
      timestamp: 1_700_000_000_000,
      status: "sent",
    });
  });

  it("ignores unsupported or malformed notifications", () => {
    expect(mapIncomingMessage({ typeWebhook: "outgoingMessageStatus" })).toBeNull();
    expect(mapIncomingMessage({ typeWebhook: "incomingMessageReceived" })).toBeNull();
  });

  it("validates message status and rejects invalid messages", () => {
    const message = createOutgoingMessage({
      id: "local-1",
      chatId: "14155552671@c.us",
      text: "Hello",
      timestamp: 123,
    });
    expect(message.status).toBe("pending");
    expect(message.sender).toBe("me");
    expect(messageSchema.safeParse({ ...message, status: "delivered" }).success).toBe(false);
  });
});
