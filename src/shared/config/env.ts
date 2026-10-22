const defaultGreenApiUrl = import.meta.env.PROD ? "/api/green-api" : "https://api.greenapi.com";
const configuredGreenApiUrl = import.meta.env.VITE_GREEN_API_BASE_URL ?? defaultGreenApiUrl;

export const GREEN_API_BASE_URL = configuredGreenApiUrl.replace(/\/+$/, "");
