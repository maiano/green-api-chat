import { messageSchema } from "@/entities/message/model/schemas";
import type { Message } from "@/entities/message/model/types";
import { greenApiIncomingTextMessageSchema } from "@/shared/api/schemas";

export function mapIncomingMessage(value: unknown): Message | null {
  const apiMessage = greenApiIncomingTextMessageSchema.safeParse(value);
  if (!apiMessage.success) return null;

  const { idMessage, messageData, senderData, timestamp } = apiMessage.data;
  return messageSchema.parse({
    id: idMessage,
    externalId: idMessage,
    chatId: senderData.chatId,
    text: messageData.textMessageData.textMessage,
    sender: "them",
    timestamp: timestamp * 1000,
    status: "sent",
  });
}

export function createOutgoingMessage(input: {
  id: string;
  chatId: string;
  text: string;
  timestamp?: number;
}): Message {
  return messageSchema.parse({
    ...input,
    sender: "me",
    timestamp: input.timestamp ?? Date.now(),
    status: "pending",
  });
}
