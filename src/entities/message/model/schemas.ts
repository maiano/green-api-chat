import { z } from "zod";
import type { Message } from "@/entities/message/model/types";

export const messageSchema = z.object({
  id: z.string().min(1),
  externalId: z.string().min(1).optional(),
  chatId: z.string().min(1),
  text: z.string(),
  sender: z.enum(["me", "them"]),
  timestamp: z.number().int().nonnegative(),
  status: z.enum(["pending", "sent", "error"]),
  error: z.string().optional(),
}) satisfies z.ZodType<Message>;
