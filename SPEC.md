# offsitelabs.io — landing page build spec

Brand: **Offsite Labs**. Domain: **offsitelabs.io**. Draft 1, 14 Sep 2026.

Companion file: `landing-content.json`. That file holds every string. This file describes structure and behaviour. **Import the copy from the JSON, do not retype it into components.**

---

## Ground rules

1. Every claim on this page traces to a Current capability in the Offsite Labs v1.0 technical and marketing documentation. Do not add, embellish or "tighten" copy in a way that adds a claim.
2. Nothing In Progress or Planned is written as though it exists.
3. Voice: plain and blunt. Short sentences. No buzzwords, no hedging, no em dashes anywhere in the source.
4. `constraints.neverSay` in the JSON is a hard blocklist. Worth a CI check, in the same spirit as the existing banned-AWS-vocabulary scanner.
5. `constraints.doNotBuild` lists sections that must not be created, even if a component for them already exists in the repo.

---

## Page structure

One page. Shared hero, a soft three-way selector below it, then a branched middle and a shared tail.

```
├─ Hero                    shared    content.hero
├─ PositioningBand         shared    content.band
├─ PathSelector            shared    content.selector
├─ PathPanel               branched  content.paths[msp|org|solo]
├─ HowItWorks              shared    content.howItWorks
├─ UseCases                shared    content.useCases
├─ Management              shared    content.management
├─ Trust                   shared    content.trust
├─ Roadmap                 shared    content.roadmap
├─ Sustainability          shared    content.sustainability
└─ Close                   shared    content.close
```

---

## Component behaviour

### Hero
Single H1, two body paragraphs, one primary CTA. No background video, no 100vh lock.

If a product image is used it must show the product as it currently is: four locations, the real computers list, real screens. The current site's hero shows locations that did not exist when it was written. Do not repeat that.

### PositioningBand
Narrow strip directly under the hero. Visually quieter than the hero but not a footnote. One heading, two short paragraphs.

### PathSelector
Three cards. **This is a soft selector, not a gate.**

- No path is pre-selected on load.
- Every shared section below remains fully rendered and readable before any click. A visitor who never chooses still reads a complete page.
- Selecting a path reveals `PathPanel` for that path and scrolls to it. Selecting another swaps it.
- Reflect the choice in the URL as a query param or hash (`?for=msp`) so a path can be linked directly for outreach.
- Keep all three panels in the DOM and toggle with the `hidden` attribute, so the page still works without JS and the copy stays indexable.
- Treat the cards as tabs for accessibility: `role="tablist"` / `role="tab"` / `role="tabpanel"`, `aria-selected`, arrow-key navigation.

### PathPanel
Each path renders: H2, body paragraphs, an optional proof block, and a caveat block, then the shared CTA.

The caveat block is **not** a disclaimer in small print. Same type size and same weight as the body above it. On path B the caveat list is the section a security-minded buyer will read most carefully, and putting it on the page rather than saving it for the call is the deliberate choice here.

### HowItWorks
Four numbered steps. The numbering is real sequence, not decoration, so keep the numerals. No infrastructure diagram.

### UseCases
Five items, title plus one line each. Item 4 is the AI use case. It says agent software runs on a Windows machine, and nothing more. No parallelism, no fleets, no disposable environments. That is the paused product line.

### Management
Body, then the caveat paragraph in the same block. Do not split the caveat into a tooltip or an accordion.

### Trust
Two panels side by side, equal width, equal weight. "True today" and "Not built yet". The second panel is the differentiator, so it does not get a muted treatment, a collapse, or a smaller heading.

Open issue flagged in the JSON: the eleven-minute restore figure came from a drill at trivial data volume. Either carry the caveat in the sentence or drop the number until a second drill runs.

### Roadmap
Three columns, labelled by status and never by date. Directly below Trust, because it is what converts that "Not built yet" panel from absence into velocity.

### Sustainability
Body block, then the founder note as a distinct quoted block with attribution.

**The founder note in the JSON is marked `"draft": true`.** It is placeholder text pending Jay's rewrite. Do not ship it without that flag being cleared.

### Close
One CTA, the same one as the hero. No competing secondary action.

`close.optionalPricingLine.include` controls one sentence about the pricing model. It publishes no number. If Jay sets it to false, render nothing in its place.

---

## Things to strip from the current site

Live strings that the product disproves in under a minute. Full list with reasons in `constraints.removeFromCurrentSite`.

- "sold only through managed service providers"
- "we never sell direct"
- "there is no end-customer signup"
- "wholesale rate card within one business day"
- Any remaining `offsiteLABS` or `Off-Site Desktops` in customer-facing strings

---

## Acceptance checks

- [ ] No string on the page appears in `constraints.neverSay`
- [ ] No section listed in `constraints.doNotBuild` exists
- [ ] All five strings in `constraints.removeFromCurrentSite` are gone from the repo
- [ ] Page renders complete and readable with JS disabled, all three path panels included
- [ ] Every path's CTA points at the same walkthrough destination
- [ ] No em dashes in any copy string
- [ ] Trust panels are visually equal weight
- [ ] Founder note either rewritten by Jay or not shipped
- [ ] Restore-time figure either carries its caveat or is absent
