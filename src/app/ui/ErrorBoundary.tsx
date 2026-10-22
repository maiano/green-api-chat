import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/shared/ui/button";

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Keep the fallback focused on recovery; technical details are not shown to users.
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center text-foreground">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Please reload the page to continue.
          </p>
          <Button className="mt-5" onClick={() => window.location.reload()} type="button">
            Reload page
          </Button>
        </main>
      );
    }

    return this.props.children;
  }
}
