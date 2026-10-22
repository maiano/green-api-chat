/// <reference types="@testing-library/jest-dom/vitest" />

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MessageBubble } from "@/entities/message/ui/MessageBubble";

const message = {
  id: "message-1",
  chatId: "14155552671@c.us",
  text: "Hello from GREEN-API",
  sender: "me" as const,
  timestamp: 1_700_000_000_000,
  status: "sent" as const,
};

describe("MessageBubble", () => {
  it("renders outgoing text and accepted status accessibly", () => {
    render(<MessageBubble message={message} />);

    expect(screen.getByText("Hello from GREEN-API")).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Outgoing message" })).toBeInTheDocument();
    expect(screen.getByText("Accepted by GREEN-API")).toBeInTheDocument();
  });

  it("shows the error reason for a failed outgoing message", () => {
    render(<MessageBubble message={{ ...message, status: "error", error: "Try again" }} />);

    expect(screen.getByRole("status")).toHaveTextContent("Try again");
    expect(screen.getByText("Not sent")).toBeInTheDocument();
  });
});
