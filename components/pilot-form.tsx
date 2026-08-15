"use client";

import { useEffect, useRef, useState } from "react";
import type { Site } from "@/content";
import { track, type AnalyticsIntent } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export function PilotForm({
  form,
  intent,
  position,
  signupHandoffUrl,
  onClose,
}: {
  form: Site["form"];
  intent: AnalyticsIntent;
  position: string;
  signupHandoffUrl: string | null;
  onClose: () => void;
}) {
  const copy = form[intent];
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [handoffUrl, setHandoffUrl] = useState<string | null>(signupHandoffUrl);
  const startedRef = useRef(false);
  const lastFieldRef = useRef<string>("");
  const statusRef = useRef<Status>("idle");
  statusRef.current = status;

  // Fire form_abandon if the visitor started typing but left without a successful submit.
  useEffect(() => {
    return () => {
      if (startedRef.current && statusRef.current !== "success") {
        track({
          name: "form_abandon",
          props: { intent, lastField: lastFieldRef.current || "(none)" },
        });
      }
    };
  }, [intent]);

  function markStarted() {
    if (!startedRef.current) {
      startedRef.current = true;
      track({ name: "form_start", props: { intent } });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);
    const seatsRaw = String(fd.get("clientSeats") ?? "").trim();
    const clientSeats = seatsRaw === "" ? null : Number(seatsRaw);

    track({ name: "form_submit", props: { intent, clientSeats } });

    try {
      const res = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          position,
          email: fd.get("email"),
          mspName: fd.get("mspName"),
          clientSeats: seatsRaw,
          currentPlatform: fd.get("currentPlatform"),
          [form.honeypotField]: fd.get(form.honeypotField),
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Something went wrong. Try again.");
      }

      const data = (await res.json()) as { handoffUrl?: string | null };
      if (data.handoffUrl) setHandoffUrl(data.handoffUrl);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div>
        <div className="mb-4 flex items-center gap-2 text-accent">
          <span aria-hidden className="text-lg">
            ✓
          </span>
          <span className="text-xs font-medium uppercase tracking-wide">Received</span>
        </div>
        <h2 id="lead-form-heading" className="font-display text-2xl font-semibold text-fg">
          {copy.successHeading}
        </h2>
        <p className="mt-3 text-fg-2">{copy.successBody}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {handoffUrl && (
            <a
              href={handoffUrl}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
            >
              {copy.handoffLabel}
              <span aria-hidden>→</span>
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-3 text-sm font-medium text-fg-2 hover:text-fg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="lead-form-heading" className="font-display text-2xl font-semibold text-fg">
            {copy.heading}
          </h2>
          <p className="mt-2 text-sm text-fg-2">{copy.blurb}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 -mt-2 rounded-md p-2 text-fg-3 hover:text-fg"
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>
      </div>

      {/* Honeypot: visually hidden, off-screen, not tab-reachable. Bots fill it; humans don't. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={form.honeypotField}>Leave this field empty</label>
        <input
          id={form.honeypotField}
          name={form.honeypotField}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-4">
        {form.fields.map((field) => {
          const id = `field-${field.name}`;
          return (
            <div key={field.name}>
              <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  id={id}
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  onFocus={markStarted}
                  onBlur={(e) => {
                    lastFieldRef.current = field.name;
                    track({
                      name: "form_field_blur",
                      props: { intent, field: field.name, filled: e.target.value !== "" },
                    });
                  }}
                  className="w-full rounded-md border border-line bg-raised px-3 py-2.5 text-sm text-fg transition-colors focus:border-accent"
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={field.type}
                  inputMode={field.type === "number" ? "numeric" : undefined}
                  required={field.required}
                  placeholder={field.placeholder}
                  autoComplete={field.name === "email" ? "email" : "off"}
                  onFocus={markStarted}
                  onBlur={(e) => {
                    lastFieldRef.current = field.name;
                    track({
                      name: "form_field_blur",
                      props: { intent, field: field.name, filled: e.target.value.trim() !== "" },
                    });
                  }}
                  className="w-full rounded-md border border-line bg-raised px-3 py-2.5 text-sm text-fg transition-colors placeholder:text-fg-3 focus:border-accent"
                />
              )}
              {field.helper && <p className="mt-1 text-xs text-fg-3">{field.helper}</p>}
            </div>
          );
        })}
      </div>

      {status === "error" && error && (
        <p role="alert" className="mt-4 text-sm text-status-attention">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : copy.submitLabel}
      </button>
      <p className="mt-3 text-center text-xs text-fg-3">No phone number. No sales sequence.</p>
    </form>
  );
}
