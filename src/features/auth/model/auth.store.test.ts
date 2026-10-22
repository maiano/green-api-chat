import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/features/auth/model/auth.store";

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    window.localStorage.clear();
  });

  it("validates, trims, and persists credentials", () => {
    const result = useAuthStore.getState().login({
      idInstance: "  instance-1  ",
      apiTokenInstance: " token-1 ",
    });

    expect(result.success).toBe(true);
    expect(useAuthStore.getState().credentials).toEqual({
      idInstance: "instance-1",
      apiTokenInstance: "token-1",
    });
    expect(window.localStorage.getItem("green-api-chat:credentials")).toContain("instance-1");
  });

  it("rejects empty credentials and removes saved credentials on logout", () => {
    expect(useAuthStore.getState().login({ idInstance: "", apiTokenInstance: "token" })).toEqual({
      success: false,
      error: "Instance ID is required",
    });

    useAuthStore.getState().login({ idInstance: "instance", apiTokenInstance: "token" });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().credentials).toBeNull();
    expect(window.localStorage.getItem("green-api-chat:credentials")).toBeNull();
  });
});
