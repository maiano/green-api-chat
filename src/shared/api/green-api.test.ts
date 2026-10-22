import { afterEach, describe, expect, it, vi } from "vitest";
import { GreenApiError } from "@/shared/api/errors";
import { receiveNotification, sendMessage } from "@/shared/api/green-api";

const credentials = { idInstance: "instance-1", apiTokenInstance: "token-1" };

afterEach(() => vi.unstubAllGlobals());

describe("GREEN-API client", () => {
  it("sends a validated text message and returns its external ID", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ idMessage: "external-1" }), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendMessage(credentials, "14155552671@c.us", "Hello")).resolves.toBe("external-1");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/waInstanceinstance-1/sendMessage/token-1"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ chatId: "14155552671@c.us", message: "Hello" }),
      }),
    );
  });

  it("rejects empty text before making a request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendMessage(credentials, "14155552671@c.us", "  ")).rejects.toBeInstanceOf(
      GreenApiError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps long polling below the Netlify proxy timeout", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("null", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      receiveNotification(credentials, new AbortController().signal),
    ).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/receiveNotification/token-1?receiveTimeout=20"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
