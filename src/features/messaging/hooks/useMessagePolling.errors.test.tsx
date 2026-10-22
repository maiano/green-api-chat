import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";
import { GreenApiError } from "@/shared/api/errors";

const { receiveNotificationMock, deleteNotificationMock } = vi.hoisted(() => ({
  receiveNotificationMock: vi.fn(),
  deleteNotificationMock: vi.fn(),
}));

vi.mock("@/shared/api/green-api", () => ({
  receiveNotification: receiveNotificationMock,
  deleteNotification: deleteNotificationMock,
}));

import { useMessagePolling } from "@/features/messaging/hooks/useMessagePolling";

beforeEach(() => {
  useMessagingStore.getState().clear();
  useAuthStore.getState().login({ idInstance: "instance-1", apiTokenInstance: "token-1" });
  receiveNotificationMock.mockReset();
  deleteNotificationMock.mockReset();
});

afterEach(() => {
  cleanup();
  useAuthStore.getState().logout();
  useMessagingStore.getState().clear();
});

describe("useMessagePolling error handling", () => {
  it("logs out and stops polling after an unauthorized response", async () => {
    receiveNotificationMock.mockRejectedValue(
      new GreenApiError("UNAUTHORIZED", "GREEN-API rejected the credentials."),
    );
    const { unmount } = renderHook(() => useMessagePolling());

    await waitFor(() => expect(useAuthStore.getState().credentials).toBeNull());
    expect(receiveNotificationMock).toHaveBeenCalledTimes(1);
    expect(deleteNotificationMock).not.toHaveBeenCalled();
    await act(async () => unmount());
  });
});
