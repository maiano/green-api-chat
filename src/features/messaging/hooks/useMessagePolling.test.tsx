import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";

const { receiveNotificationMock, deleteNotificationMock } = vi.hoisted(() => ({
  receiveNotificationMock: vi.fn(),
  deleteNotificationMock: vi.fn(),
}));

vi.mock("@/shared/api/green-api", () => ({
  receiveNotification: receiveNotificationMock,
  deleteNotification: deleteNotificationMock,
}));

import { useMessagePolling } from "@/features/messaging/hooks/useMessagePolling";

const chatId = "14155552671@c.us";
const notification = {
  receiptId: 42,
  body: {
    typeWebhook: "incomingMessageReceived",
    idMessage: "external-message-1",
    timestamp: 1_700_000_000,
    senderData: { chatId },
    messageData: { textMessageData: { textMessage: "Reply" } },
  },
};

beforeEach(() => {
  useMessagingStore.getState().clear();
  useAuthStore.getState().login({ idInstance: "instance-1", apiTokenInstance: "token-1" });
  receiveNotificationMock.mockReset();
  deleteNotificationMock.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  cleanup();
  useAuthStore.getState().logout();
  useMessagingStore.getState().clear();
});

describe("useMessagePolling", () => {
  it("deletes the notification before storing its incoming text message", async () => {
    let receiveCount = 0;
    receiveNotificationMock.mockImplementation((_credentials, signal: AbortSignal) => {
      receiveCount += 1;
      if (receiveCount === 1) return Promise.resolve(notification);
      return new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), {
          once: true,
        });
      });
    });
    deleteNotificationMock.mockImplementation(async () => {
      expect(useMessagingStore.getState().messagesByChat[chatId]).toBeUndefined();
    });

    const { unmount } = renderHook(() => useMessagePolling());
    await waitFor(() => {
      expect(useMessagingStore.getState().messagesByChat[chatId]).toMatchObject([
        { id: "external-message-1", sender: "them", text: "Reply" },
      ]);
    });

    expect(deleteNotificationMock).toHaveBeenCalledWith(
      { idInstance: "instance-1", apiTokenInstance: "token-1" },
      42,
      expect.any(AbortSignal),
    );
    expect(useMessagingStore.getState().chats[chatId]).toEqual({
      id: chatId,
      phone: "14155552671",
    });
    await act(async () => unmount());
  });
});
