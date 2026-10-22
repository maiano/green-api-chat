const configuredGreenApiUrl = import.meta.env.VITE_GREEN_API_BASE_URL ?? "https://api.greenapi.com";

export const GREEN_API_BASE_URL = configuredGreenApiUrl.replace(/\/+$/, "");
