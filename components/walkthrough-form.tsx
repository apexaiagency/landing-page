"use client";

import type { Site } from "@/content";
import { PilotForm } from "./pilot-form";

/**
 * Client boundary for the standalone /walkthrough page.
 *
 * PilotForm needs an `onClose`, which is a function and therefore cannot cross from a
 * server component. On the standalone page there is nothing to close: the form is the
 * page, so the handler is a no-op defined on this side of the boundary rather than
 * passed across it.
 */
export function WalkthroughForm({
  form,
  signupHandoffUrl,
}: {
  form: Site["form"];
  signupHandoffUrl: string | null;
}) {
  return (
    <PilotForm
      form={form}
      intent="pilot"
      position="walkthrough-page"
      signupHandoffUrl={signupHandoffUrl}
      onClose={() => {}}
    />
  );
}
