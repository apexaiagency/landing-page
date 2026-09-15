/**
 * The build sheet, beside "How it works".
 *
 * It shows the five things the platform creates for a brand new customer, completing
 * in sequence. Step 02 of the section says this in words; this says it in order, which
 * is the part words are bad at.
 *
 * Deliberately NOT a terminal and NOT a product screen: no prompt, no cursor, no
 * command, no resemblance to a screen a customer would recognise. hero.imageRule
 * forbids a mockup of something unbuilt, and this claims nothing about what any screen
 * looks like. The five names and the 20-40 minute figure are both straight from the
 * provisioning sequence in the technical documentation.
 */

const STEPS = ["Cloud account", "Private network", "Encryption key", "Directory", "First machine"];

export function BuildSheet() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-card border border-line bg-surface"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-3">Building</span>
        <span className="font-mono text-[10px] tracking-[0.14em] text-accent">unattended</span>
      </div>

      <div className="py-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className="build-row flex items-center gap-3 px-5 py-2.5"
            style={{ animationDelay: `${i * 0.9}s` }}
          >
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="flex-1 text-[13px] text-fg">{label}</span>
            <span className="font-mono text-[10px] text-fg-3">done</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line px-5 py-3.5">
        <span className="font-mono text-[10px] tracking-[0.12em] text-fg-3">nobody watching</span>
        <span className="font-mono text-[11px] text-fg">20&ndash;40 min</span>
      </div>
    </div>
  );
}
