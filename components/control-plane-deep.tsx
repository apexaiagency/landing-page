import type { Site } from "@/content";
import { SectionShell, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { CtaButton } from "./cta-button";
import { ProvisioningChecklist } from "./provisioning-checklist";

type Capability = Site["controlPlane"]["capabilities"][number];

/* ── Bespoke mini-UI per capability — real product surfaces, not illustration. ── */

function IsolationUI() {
  const tenants = [
    { name: "Meridian Health", tags: ["Own directory", "Own network", "Own keys"] },
    { name: "Lakeside Legal", tags: ["Own directory", "Own network", "Own keys"] },
    { name: "Northwind Retail", tags: ["Own directory", "Own network", "Own keys"] },
  ];
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
        One account per client
      </div>
      <div className="space-y-2.5">
        {tenants.map((t) => (
          <div
            key={t.name}
            className="rounded-control border border-line-soft bg-raised px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-glow-sm" aria-hidden />
              <span className="text-sm font-medium text-fg">{t.name}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-line-soft px-1.5 py-0.5 font-mono text-[10px] text-fg-3"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FleetUI() {
  const rows = [
    { name: "Meridian Health", meta: "48 seats", status: "active", label: "Running" },
    { name: "Cascade Logistics", meta: "15 seats", status: "provisioning", label: "Provisioning" },
    { name: "Delta Design", meta: "8 seats", status: "stopped", label: "Idle" },
    { name: "Harbor Point", meta: "12 seats", status: "error", label: "Needs attention" },
  ];
  const dot: Record<string, string> = {
    active: "bg-accent shadow-glow-sm",
    provisioning: "bg-accent animate-pulse-dot",
    stopped: "bg-status-off",
    error: "bg-status-attention",
  };
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="border-b border-line-soft px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
        Every desktop, every client
      </div>
      <ul className="divide-y divide-line-soft">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 px-5 py-3">
            <span className={`h-2 w-2 shrink-0 rounded-full ${dot[r.status]}`} aria-hidden />
            <span className="flex-1 text-sm font-medium text-fg">{r.name}</span>
            <span className="font-mono text-xs text-fg-3">{r.meta}</span>
            <span className="w-28 text-right text-xs text-fg-2">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BillingUI() {
  const rows = [
    { name: "Meridian Health", seats: "48", amount: "$6,240" },
    { name: "Lakeside Legal", seats: "22", amount: "$2,860" },
    { name: "Northwind Retail", seats: "60", amount: "$7,800" },
  ];
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
        <span>Per client, already split</span>
        <span>This month</span>
      </div>
      <div className="space-y-1">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center justify-between rounded-control px-2 py-2 text-sm hover:bg-raised"
          >
            <span className="text-fg">{r.name}</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-xs text-fg-3">{r.seats} seats</span>
              <span className="font-mono tabular-nums text-fg">{r.amount}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3 text-sm">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
          Wholesale in · your rate out
        </span>
        <span className="font-mono tabular-nums font-medium text-accent">Invoice-ready</span>
      </div>
    </div>
  );
}

function CapabilityUI({ capKey }: { capKey: Capability["key"] }) {
  switch (capKey) {
    case "isolation":
      return <IsolationUI />;
    case "fleet":
      return <FleetUI />;
    case "provisioning":
      return <ProvisioningChecklist />;
    case "billing":
      return <BillingUI />;
  }
}

export function ControlPlaneDeep({
  controlPlane,
  ctas,
}: {
  controlPlane: Site["controlPlane"];
  ctas: Site["ctas"];
}) {
  return (
    <SectionShell id="control-plane" className="border-t border-line-soft py-20 sm:py-28">
      <SectionHeading
        eyebrow={controlPlane.eyebrow}
        heading={controlPlane.heading}
        intro={controlPlane.intro}
      />

      <div className="mt-14 space-y-16 sm:space-y-20">
        {controlPlane.capabilities.map((cap, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={cap.key}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              <Reveal className={flip ? "lg:order-2" : ""}>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">
                  {cap.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-fg-2">{cap.body}</p>
                <ul className="mt-5 space-y-2.5">
                  {cap.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-fg">
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={100} duration={600} className={flip ? "lg:order-1" : ""}>
                <CapabilityUI capKey={cap.key} />
              </Reveal>
            </div>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-start gap-4 border-t border-line-soft pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-xl font-semibold tracking-tight text-fg">
          {controlPlane.ctaLine}
        </p>
        <div className="flex flex-wrap gap-3">
          <CtaButton cta={ctas.pilot} position="control-plane" variant="primary" />
          <CtaButton cta={ctas.pricing} position="control-plane" variant="secondary" />
        </div>
      </div>
    </SectionShell>
  );
}
