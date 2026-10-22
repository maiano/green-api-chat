import { useCallback } from "react";
import { createOutgoingMessage } from "@/entities/message/model/mapper";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";
import { sendMessage } from "@/shared/api/green-api";

export function useSendMessage() {
  const credentials = useAuthStore((state) => state.credentials);
  const addOptimisticMessage = useMessagingStore((state) => state.addOptimisticMessage);
  const markMessageSent = useMessagingStore((state) => state.markMessageSent);
  const markMessageError = useMessagingStore((state) => state.markMessageError);

  return useCallback(
    async (chatId: string, text: string) => {
      if (!credentials) return;

      const message = createOutgoingMessage({
        id: crypto.randomUUID(),
        chatId,
        text,
      });
      addOptimisticMessage(message);

      try {
        const externalId = await sendMessage(credentials, chatId, message.text);
        markMessageSent(chatId, message.id, externalId);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "GREEN-API could not send this message.";
        markMessageError(chatId, message.id, errorMessage);
      }
    },
    [addOptimisticMessage, credentials, markMessageError, markMessageSent],
  );
}
