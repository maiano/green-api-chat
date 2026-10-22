import { chatIdSchema } from "@/entities/chat/model/schemas";

export function normalizePhone(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, "");
  return /^\d{7,15}$/.test(digits) ? digits : null;
}

export function createChatId(rawPhone: string): string | null {
  const phone = normalizePhone(rawPhone);
  return phone ? `${phone}@c.us` : null;
}

export function getPhoneFromChatId(chatId: string): string | null {
  const parsedChatId = chatIdSchema.safeParse(chatId);
  return parsedChatId.success ? parsedChatId.data.replace(/@c\.us$/, "") : null;
}
