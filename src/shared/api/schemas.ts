import { z } from "zod";
import { MAX_MESSAGE_LENGTH } from "@/shared/config/messaging";

export const credentialsSchema = z.object({
  idInstance: z.string().trim().min(1, "Instance ID is required"),
  apiTokenInstance: z.string().trim().min(1, "API token is required"),
});

export const sendMessageRequestSchema = z.object({
  chatId: z.string().min(1),
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(
      MAX_MESSAGE_LENGTH,
      `Message cannot exceed ${MAX_MESSAGE_LENGTH.toLocaleString("en-US")} characters`,
    ),
});

export const sendMessageResponseSchema = z.object({
  idMessage: z.string().min(1),
});

export const receiveNotificationResponseSchema = z.object({
  receiptId: z.number().int(),
  body: z.unknown(),
});

export const greenApiIncomingTextMessageSchema = z.object({
  typeWebhook: z.literal("incomingMessageReceived"),
  idMessage: z.string().min(1),
  timestamp: z.number().int().nonnegative(),
  senderData: z.object({
    chatId: z.string().min(1),
  }),
  messageData: z.object({
    textMessageData: z.object({
      textMessage: z.string(),
    }),
  }),
});

export const deleteNotificationResponseSchema = z.object({
  result: z.boolean(),
  reason: z.string().optional(),
});
