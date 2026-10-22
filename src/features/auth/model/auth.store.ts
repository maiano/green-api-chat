import { create } from "zustand";
import type { GreenApiCredentials } from "@/shared/api/green-api";
import { credentialsSchema } from "@/shared/api/schemas";

const STORAGE_KEY = "green-api-chat:credentials";

type LoginResult = { success: true; warning?: string } | { success: false; error: string };

type AuthState = {
  credentials: GreenApiCredentials | null;
  login: (input: unknown) => LoginResult;
  logout: () => void;
};

function readCredentials(): GreenApiCredentials | null {
  if (typeof window === "undefined") return null;

  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    const result = credentialsSchema.safeParse(saved);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

function persistCredentials(credentials: GreenApiCredentials) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
    return true;
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  credentials: readCredentials(),
  login: (input) => {
    const result = credentialsSchema.safeParse(input);
    if (!result.success) {
      return {
        success: false,
        error: result.error.issues[0]?.message ?? "Enter your GREEN-API credentials.",
      };
    }

    set({ credentials: result.data });
    if (!persistCredentials(result.data)) {
      return {
        success: true,
        warning: "Credentials are active for this session but could not be saved in this browser.",
      };
    }

    return { success: true };
  },
  logout: () => {
    set({ credentials: null });
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Keep the current session logged out even when browser storage is unavailable.
    }
  },
}));
