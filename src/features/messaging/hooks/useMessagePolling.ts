import { useEffect } from "react";
import { mapIncomingMessage } from "@/entities/message/model/mapper";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";
import { GreenApiError } from "@/shared/api/errors";
import { deleteNotification, receiveNotification } from "@/shared/api/green-api";

const INITIAL_RETRY_DELAY_MS = 1_000;
const MAX_RETRY_DELAY_MS = 30_000;

function waitForRetry(signal: AbortSignal, delayMs: number) {
  return new Promise<void>((resolve) => {
    let timeoutId: number | undefined;
    const finish = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      signal.removeEventListener("abort", finish);
      resolve();
    };

    signal.addEventListener("abort", finish, { once: true });
    if (signal.aborted) {
      finish();
      return;
    }
    timeoutId = window.setTimeout(finish, delayMs);
  });
}

function getPollingError(error: unknown) {
  if (error instanceof GreenApiError) return error.message;
  return "GREEN-API could not receive messages. Retrying automatically.";
}

export function useMessagePolling() {
  const credentials = useAuthStore((state) => state.credentials);
  const addIncomingMessage = useMessagingStore((state) => state.addIncomingMessage);
  const setPollingError = useMessagingStore((state) => state.setPollingError);

  useEffect(() => {
    if (!credentials) {
      setPollingError(null);
      return;
    }
    const activeCredentials = credentials;

    const controller = new AbortController();
    let retryDelayMs = INITIAL_RETRY_DELAY_MS;

    async function poll() {
      while (!controller.signal.aborted) {
        try {
          const notification = await receiveNotification(activeCredentials, controller.signal);
          if (controller.signal.aborted) break;
          if (!notification) {
            setPollingError(null);
            retryDelayMs = INITIAL_RETRY_DELAY_MS;
            continue;
          }

          const message = mapIncomingMessage(notification.body);
          await deleteNotification(activeCredentials, notification.receiptId, controller.signal);
          if (controller.signal.aborted) break;

          if (message) addIncomingMessage(message);
          setPollingError(null);
          retryDelayMs = INITIAL_RETRY_DELAY_MS;
        } catch (error) {
          if (
            controller.signal.aborted ||
            (error instanceof DOMException && error.name === "AbortError")
          ) {
            break;
          }

          setPollingError(getPollingError(error));
          await waitForRetry(controller.signal, retryDelayMs);
          retryDelayMs = Math.min(retryDelayMs * 2, MAX_RETRY_DELAY_MS);
        }
      }
    }

    void poll();
    return () => {
      controller.abort();
      setPollingError(null);
    };
  }, [addIncomingMessage, credentials, setPollingError]);
}
