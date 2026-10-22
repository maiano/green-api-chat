import type { z } from "zod";
import { GreenApiError, normalizeHttpError } from "@/shared/api/errors";

function parseResponseBody(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new GreenApiError("INVALID_RESPONSE", "GREEN-API вернул ответ в неизвестном формате.");
  }
}

export async function requestJson<T>(
  url: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    if (init.signal?.aborted || (error instanceof DOMException && error.name === "AbortError"))
      throw error;
    throw new GreenApiError(
      "NETWORK_ERROR",
      "Не удалось связаться с GREEN-API. Проверьте подключение к интернету.",
    );
  }

  const responseText = await response.text();
  if (!response.ok) {
    let details: unknown;
    try {
      details = responseText ? (JSON.parse(responseText) as unknown) : undefined;
    } catch {
      details = undefined;
    }
    throw normalizeHttpError(response.status, details);
  }

  const data = parseResponseBody(responseText);
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new GreenApiError(
      "INVALID_RESPONSE",
      "GREEN-API вернул ответ, который не соответствует ожидаемому формату.",
      { details: parsed.error.issues },
    );
  }
  return parsed.data;
}
