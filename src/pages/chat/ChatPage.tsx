import { LogOut, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { Button } from "@/shared/ui/button";

export function ChatPage() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-5 sm:px-8">
        <Link className="inline-flex items-center gap-2 font-semibold tracking-tight" to="/chat">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageCircle aria-hidden="true" className="size-4" />
          </span>
          Green Chat
        </Link>
        <Button onClick={logout} size="sm" type="button" variant="ghost">
          <LogOut aria-hidden="true" />
          Sign out
        </Button>
      </header>
      <section className="flex flex-1 items-center justify-center px-6 py-12 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-5 inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageCircle aria-hidden="true" className="size-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Your WhatsApp workspace</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your conversations will appear here. Chat setup is coming in the next step.
          </p>
        </div>
      </section>
    </main>
  );
}
