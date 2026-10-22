export type MessageSender = "me" | "them";
export type MessageStatus = "pending" | "sent" | "error";

export type Message = {
  id: string;
  externalId?: string;
  chatId: string;
  text: string;
  sender: MessageSender;
  timestamp: number;
  status: MessageStatus;
  error?: string;
};
