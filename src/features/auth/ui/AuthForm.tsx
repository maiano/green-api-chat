import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function AuthForm() {
  const login = useAuthStore((state) => state.login);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setWarning("");

    const result = login({ idInstance, apiTokenInstance });
    if (!result.success) {
      setError(result.error);
      return;
    }

    setWarning(result.warning ?? "");
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-10 text-foreground">
      <section className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-sm sm:p-9">
        <div className="mb-8 inline-flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <MessageCircle aria-hidden="true" className="size-5" />
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          GREEN-API · WhatsApp
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Connect your account</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter your instance credentials to continue to your chats.
        </p>

        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="id-instance">
              Instance ID
            </label>
            <Input
              autoComplete="username"
              id="id-instance"
              name="idInstance"
              onChange={(event) => setIdInstance(event.target.value)}
              placeholder="Enter your instance ID"
              required
              value={idInstance}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="api-token">
              API token
            </label>
            <Input
              autoComplete="current-password"
              id="api-token"
              name="apiTokenInstance"
              onChange={(event) => setApiTokenInstance(event.target.value)}
              placeholder="Enter your API token"
              required
              type="password"
              value={apiTokenInstance}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {warning && (
            <p className="text-sm text-muted-foreground" role="status">
              {warning}
            </p>
          )}

          <Button className="w-full" size="lg" type="submit">
            Connect to WhatsApp
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-6 flex items-center gap-2 text-xs leading-5 text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
          Credentials are stored in this browser and are not encrypted.
        </p>
      </section>
    </main>
  );
}
