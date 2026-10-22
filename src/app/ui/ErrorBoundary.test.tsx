import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "@/app/ui/ErrorBoundary";

afterEach(cleanup);

function BrokenContent(): never {
  throw new Error("internal detail");
}

describe("ErrorBoundary", () => {
  it("shows a recovery action after a child render error", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenContent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload page" })).toBeInTheDocument();
    expect(screen.queryByText("internal detail")).not.toBeInTheDocument();
    consoleError.mockRestore();
  });
});
