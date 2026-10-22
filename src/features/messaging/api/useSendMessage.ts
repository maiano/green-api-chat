import { useCallback } from "react";
import { toast } from "sonner";
import { createOutgoingMessage } from "@/entities/message/model/mapper";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";
import { GreenApiError } from "@/shared/api/errors";
import { sendMessage } from "@/shared/api/green-api";

export function useSendMessage() {
  const credentials = useAuthStore((state) => state.credentials);
  const logout = useAuthStore((state) => state.logout);
  const addOptimisticMessage = useMessagingStore((state) => state.addOptimisticMessage);
  const clearMessaging = useMessagingStore((state) => state.clear);
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
        if (error instanceof GreenApiError && error.code === "UNAUTHORIZED") {
          toast.error(error.message);
          clearMessaging();
          logout();
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "GREEN-API could not send this message.";
        markMessageError(chatId, message.id, errorMessage);
      }
    },
    [addOptimisticMessage, clearMessaging, credentials, logout, markMessageError, markMessageSent],
  );
}
