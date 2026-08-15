"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Site } from "@/content";
import { PilotForm } from "./pilot-form";
import { track, type AnalyticsIntent } from "@/lib/analytics";

type OpenArgs = { intent: AnalyticsIntent; position: string };

type FormCtx = {
  open: (args: OpenArgs) => void;
};

const Ctx = createContext<FormCtx | null>(null);

export function useLeadForm(): FormCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLeadForm must be used within <LeadFormProvider>");
  return ctx;
}

export function LeadFormProvider({
  form,
  signupHandoffUrl,
  children,
}: {
  form: Site["form"];
  signupHandoffUrl: string | null;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OpenArgs | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((args: OpenArgs) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setState(args);
    track({ name: "form_open", props: { intent: args.intent, position: args.position } });
  }, []);

  const close = useCallback(() => {
    setState(null);
    lastFocused.current?.focus?.();
  }, []);

  // Lock scroll + focus management + Escape + focus trap while open.
  useEffect(() => {
    if (!state) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const node = dialogRef.current;
    const focusables = node?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusables?.[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [state, close]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {state && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-form-heading"
            className="w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)] sm:p-8"
          >
            <PilotForm
              form={form}
              intent={state.intent}
              position={state.position}
              signupHandoffUrl={signupHandoffUrl}
              onClose={close}
            />
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
