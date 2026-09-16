import type { Site } from "./schema";

/**
 * Site chrome only. Page copy lives in `landing-content.json`; see SPEC.md.
 *
 * Nothing in this file is a product claim, which is deliberate: the claim scanner reads
 * the JSON, so anything assertable belongs there where it will be checked.
 */
export const site: Site = {
  meta: {
    title: "Offsite Labs — cloud computers that run themselves",
    description:
      "Real Windows machines in the cloud, running on AWS. We set them up, keep them running, and fix them when they break. No hardware, no server, nobody who has to know AWS.",
    url: "https://www.offsitelabs.io",
    ogImage: "/og.png",
    keywords: [
      "cloud computers",
      "Windows desktop as a service",
      "cloud desktops for MSPs",
      "per-customer cloud account isolation",
      "remote work computers without hardware",
      "Canadian data residency cloud desktops",
    ],
  },

  brand: { name: "Offsite Labs" },

  form: {
    honeypotField: "company_website",
    fields: [
      { name: "email", label: "Work email", type: "email", placeholder: "you@yourcompany.com", required: true },
      { name: "mspName", label: "Company name", type: "text", placeholder: "Your company", required: true },
      {
        name: "clientSeats",
        label: "Machines you'd start with",
        type: "number",
        placeholder: "e.g. 25",
        required: true,
        helper: "Rough is fine. Across every client, if you run machines for others.",
      },
      {
        name: "currentPlatform",
        label: "What you run today",
        type: "select",
        required: true,
        options: [
          { value: "workspaces", label: "AWS WorkSpaces" },
          { value: "avd", label: "Azure Virtual Desktop" },
          { value: "citrix", label: "Citrix" },
          { value: "physical", label: "Physical machines" },
          { value: "other", label: "Something else" },
        ],
      },
    ],
    pilot: {
      heading: "Book a walkthrough",
      blurb:
        "We will build a brand new environment from nothing while you watch, and go through what it costs for your situation.",
      submitLabel: "Book a walkthrough",
      successHeading: "Got it.",
      successBody:
        "A real person on our side has your details and will come back to you within one business day to find a time. No drip campaign, no sales sequence.",
      handoffLabel: "Continue to set up your account",
    },
    /**
     * Retained because the API and the analytics both understand a `pricing` intent, and
     * removing it would be a schema migration for no gain. Nothing on the site routes
     * here: public pricing is off by decision, and the close section carries the one
     * sentence about the model that does ship.
     */
    pricing: {
      heading: "Talk to us about your book of clients",
      blurb:
        "What you would pay, and what you would make on it, is a conversation with a person rather than a document we can send you.",
      submitLabel: "Start the conversation",
      successHeading: "Got it.",
      successBody:
        "Someone will come back to you within one business day with a straight answer on where the commercial terms stand, including the parts that are not settled.",
      handoffLabel: "Continue to set up your account",
    },
  },

  footer: {
    ctaHeading: "See an environment built from nothing.",
    tagline: "Cloud computers that run themselves. Built in Vancouver, British Columbia.",
    columns: [
      {
        title: "The page",
        links: [
          { label: "How it works", href: "#how-it-works" },
          { label: "What it is for", href: "#use-cases" },
          { label: "Who it is for", href: "#industries" },
        ],
      },
      {
        title: "Get in touch",
        // The only way to reach us from the footer is the same booking page every call
        // to action points at. The partners@ mailbox is gone from here: mail is not
        // live on the domain, so it was an address nobody could have replied from.
        links: [
          {
            label: "Book a walkthrough",
            href: "https://calendar.app.google/KaRuBEod9pBg3GibA",
          },
        ],
      },
    ],
    legalLine: "Offsite Labs. Windows machines in the cloud, one customer at a time.",
  },
};
