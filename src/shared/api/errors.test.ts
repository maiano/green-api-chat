import { describe, expect, it } from "vitest";
import { normalizeHttpError } from "@/shared/api/errors";

describe("GREEN-API error normalization", () => {
  it("recognizes webhook conflicts", () => {
    const error = normalizeHttpError(400, { message: "custom webhook url is set" });

    expect(error.code).toBe("WEBHOOK_CONFLICT");
    expect(error.message).toContain("Disable the webhook");
  });

  it("recognizes unauthorized credentials without exposing API details", () => {
    const error = normalizeHttpError(401, { message: "token rejected" });

    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.message).toContain("Check the instance ID and API token");
    expect(error.message).not.toContain("token rejected");
  });

  it("maps message length validation errors to a safe user message", () => {
    const error = normalizeHttpError(400, { message: "Message length is too large" });

    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toContain("maximum length");
  });
});
