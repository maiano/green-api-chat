import { z } from "zod";
import type { Chat } from "@/entities/chat/model/types";

export const chatIdSchema = z.string().regex(/^\d{7,15}@c\.us$/, "Invalid WhatsApp chat ID");

export const chatSchema = z
  .object({
    id: chatIdSchema,
    phone: z.string().regex(/^\d{7,15}$/, "Enter a phone number in international format"),
  })
  .refine(({ id, phone }) => id === `${phone}@c.us`, {
    path: ["id"],
    message: "Chat ID must match the phone number",
  }) satisfies z.ZodType<Chat>;
