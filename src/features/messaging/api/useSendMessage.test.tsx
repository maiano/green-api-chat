import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { useMessagingStore } from "@/features/messaging/model/messaging.store";
import { GreenApiError } from "@/shared/api/errors";

const { sendMessageMock } = vi.hoisted(() => ({ sendMessageMock: vi.fn() }));

vi.mock("@/shared/api/green-api", () => ({ sendMessage: sendMessageMock }));

import { useSendMessage } from "@/features/messaging/api/useSendMessage";

const chatId = "14155552671@c.us";

beforeEach(() => {
  useAuthStore.getState().login({ idInstance: "instance-1", apiTokenInstance: "token-1" });
  useMessagingStore.getState().clear();
  sendMessageMock.mockReset();
  vi.stubGlobal("crypto", { randomUUID: () => "local-message-1" });
});

afterEach(() => {
  cleanup();
  useAuthStore.getState().logout();
  useMessagingStore.getState().clear();
  vi.unstubAllGlobals();
});

describe("useSendMessage", () => {
  it("adds an optimistic message and marks it sent after GREEN-API accepts it", async () => {
    sendMessageMock.mockResolvedValue("external-message-1");
    const { result } = renderHook(() => useSendMessage());

    await act(async () => result.current(chatId, "Hello"));

    expect(sendMessageMock).toHaveBeenCalledWith(
      { idInstance: "instance-1", apiTokenInstance: "token-1" },
      chatId,
      "Hello",
    );
    expect(useMessagingStore.getState().messagesByChat[chatId]).toMatchObject([
      {
        id: "local-message-1",
        externalId: "external-message-1",
        text: "Hello",
        status: "sent",
      },
    ]);
  });

  it("retains the message with an error status when sending fails", async () => {
    sendMessageMock.mockRejectedValue(new Error("Request failed"));
    const { result } = renderHook(() => useSendMessage());

    await act(async () => result.current(chatId, "Hello"));

    expect(useMessagingStore.getState().messagesByChat[chatId]).toMatchObject([
      { id: "local-message-1", status: "error", error: "Request failed" },
    ]);
  });

  it("clears the session when GREEN-API rejects the credentials", async () => {
    sendMessageMock.mockRejectedValue(
      new GreenApiError(
        "UNAUTHORIZED",
        "GREEN-API rejected the credentials. Check the instance ID and API token.",
      ),
    );
    const { result } = renderHook(() => useSendMessage());

    await act(async () => result.current(chatId, "Hello"));

    expect(useAuthStore.getState().credentials).toBeNull();
    expect(useMessagingStore.getState().messagesByChat).toEqual({});
  });
});
