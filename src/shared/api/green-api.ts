import { z } from "zod";
import { requestJson } from "@/shared/api/client";
import { GreenApiError } from "@/shared/api/errors";
import {
  credentialsSchema,
  deleteNotificationResponseSchema,
  receiveNotificationResponseSchema,
  sendMessageRequestSchema,
  sendMessageResponseSchema,
} from "@/shared/api/schemas";
import { GREEN_API_BASE_URL } from "@/shared/config/env";

export type GreenApiCredentials = z.infer<typeof credentialsSchema>;
export type GreenApiNotification = z.infer<typeof receiveNotificationResponseSchema>;

const DEFAULT_RECEIVE_TIMEOUT_SECONDS = 30;

function methodUrl(credentials: GreenApiCredentials, method: string) {
  const { idInstance, apiTokenInstance } = credentialsSchema.parse(credentials);
  return `${GREEN_API_BASE_URL}/waInstance${encodeURIComponent(idInstance)}/${method}/${encodeURIComponent(apiTokenInstance)}`;
}

export async function sendMessage(
  credentials: GreenApiCredentials,
  chatId: string,
  message: string,
) {
  const payload = sendMessageRequestSchema.safeParse({ chatId, message });
  if (!payload.success) {
    throw new GreenApiError(
      "VALIDATION_ERROR",
      payload.error.issues[0]?.message ?? "Проверьте текст сообщения.",
    );
  }

  const response = await requestJson(
    methodUrl(credentials, "sendMessage"),
    sendMessageResponseSchema,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload.data),
    },
  );
  return response.idMessage;
}

export async function receiveNotification(
  credentials: GreenApiCredentials,
  signal: AbortSignal,
  receiveTimeoutSeconds = DEFAULT_RECEIVE_TIMEOUT_SECONDS,
) {
  const timeout = z.number().int().min(5).max(60).safeParse(receiveTimeoutSeconds);
  if (!timeout.success) {
    throw new GreenApiError("VALIDATION_ERROR", "Таймаут получения должен быть от 5 до 60 секунд.");
  }

  const url = `${methodUrl(credentials, "receiveNotification")}?receiveTimeout=${timeout.data}`;
  const responseSchema = receiveNotificationResponseSchema.nullable();
  return requestJson(url, responseSchema, { signal });
}

export async function deleteNotification(credentials: GreenApiCredentials, receiptId: number) {
  const validReceiptId = z.number().int().nonnegative().safeParse(receiptId);
  if (!validReceiptId.success) {
    throw new GreenApiError(
      "VALIDATION_ERROR",
      "Идентификатор уведомления должен быть целым неотрицательным числом.",
    );
  }

  const response = await requestJson(
    `${methodUrl(credentials, "deleteNotification")}/${validReceiptId.data}`,
    deleteNotificationResponseSchema,
    { method: "DELETE" },
  );

  if (!response.result) {
    throw new GreenApiError(
      "DELETE_FAILED",
      response.reason || "GREEN-API не удалил уведомление из очереди.",
    );
  }
}
