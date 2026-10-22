import { z } from "zod";

export const credentialsSchema = z.object({
  idInstance: z.string().trim().min(1, "ID инстанса обязателен"),
  apiTokenInstance: z.string().trim().min(1, "API-токен обязателен"),
});

export const sendMessageRequestSchema = z.object({
  chatId: z.string().min(1),
  message: z
    .string()
    .trim()
    .min(1, "Сообщение не может быть пустым")
    .max(20_000, "Максимальная длина сообщения — 20 000 символов"),
});

export const sendMessageResponseSchema = z.object({
  idMessage: z.string().min(1),
});

export const receiveNotificationResponseSchema = z.object({
  receiptId: z.number().int(),
  body: z.unknown(),
});

export const deleteNotificationResponseSchema = z.object({
  result: z.boolean(),
  reason: z.string().optional(),
});
