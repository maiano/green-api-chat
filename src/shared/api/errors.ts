export type GreenApiErrorCode =
  | "UNAUTHORIZED"
  | "WEBHOOK_CONFLICT"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "HTTP_ERROR"
  | "DELETE_FAILED";

export class GreenApiError extends Error {
  readonly code: GreenApiErrorCode;
  readonly status?: number;
  readonly details?: unknown;

  constructor(
    code: GreenApiErrorCode,
    message: string,
    options?: { status?: number; details?: unknown },
  ) {
    super(message);
    this.name = "GreenApiError";
    this.code = code;
    this.status = options?.status;
    this.details = options?.details;
  }
}

function getErrorMessage(details: unknown) {
  if (!details || typeof details !== "object") return "";
  if ("message" in details && typeof details.message === "string") return details.message;
  if ("error" in details && typeof details.error === "string") return details.error;
  return "";
}

export function normalizeHttpError(status: number, details: unknown) {
  const apiMessage = getErrorMessage(details);
  const normalizedMessage = apiMessage.toLowerCase();

  if (normalizedMessage.includes("custom webhook url is set")) {
    return new GreenApiError(
      "WEBHOOK_CONFLICT",
      "Отключите Webhook в настройках инстанса GREEN-API для получения сообщений.",
      { status, details },
    );
  }

  if (status === 401 || status === 403) {
    return new GreenApiError(
      "UNAUTHORIZED",
      "GREEN-API отклонил учётные данные. Проверьте ID инстанса и API-токен.",
      { status, details },
    );
  }

  if (status === 429) {
    return new GreenApiError(
      "RATE_LIMITED",
      "GREEN-API ограничил частоту запросов. Повторите попытку позже.",
      { status, details },
    );
  }

  if (status === 400) {
    return new GreenApiError(
      "VALIDATION_ERROR",
      normalizedMessage.includes("message") && normalizedMessage.includes("length")
        ? "Текст сообщения превышает допустимую длину GREEN-API."
        : "GREEN-API отклонил запрос. Проверьте параметры и настройки инстанса.",
      { status, details },
    );
  }

  return new GreenApiError(
    "HTTP_ERROR",
    "Не удалось выполнить запрос к GREEN-API. Повторите попытку позже.",
    { status, details },
  );
}
