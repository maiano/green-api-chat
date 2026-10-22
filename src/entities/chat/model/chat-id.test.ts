import { describe, expect, it } from "vitest";
import { createChatId, getPhoneFromChatId, normalizePhone } from "@/entities/chat/model/chat-id";

describe("chat phone helpers", () => {
  it("normalizes an international phone number to digits", () => {
    expect(normalizePhone("+44 (20) 7946-0958")).toBe("442079460958");
  });

  it("rejects numbers outside the supported length", () => {
    expect(normalizePhone("123456")).toBeNull();
    expect(normalizePhone("1234567890123456")).toBeNull();
  });

  it("creates and parses WhatsApp chat IDs", () => {
    expect(createChatId("+1 415 555 2671")).toBe("14155552671@c.us");
    expect(getPhoneFromChatId("14155552671@c.us")).toBe("14155552671");
    expect(getPhoneFromChatId("not-a-chat-id")).toBeNull();
  });
});
