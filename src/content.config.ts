import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { STAGES } from "./site.config";

// The /admin editor saves empty optional fields as "", so treat "" as not set.
const unset = (v: unknown) => (v === "" || v === null ? undefined : v);
const opt = <T extends z.ZodTypeAny>(t: T) => z.preprocess(unset, t.optional());

const media = z.object({
  image: opt(z.string()),
  video: opt(z.string()),   // YouTube or Vimeo link
  caption: opt(z.string()),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().default(""),
    titleEnd: z.string(),               // the part of the title shown in the project colour
    order: z.number(),
    section: z.preprocess(unset, z.enum(["art", "not-art"]).default("art")),
    mode: z.enum(["digital", "model", "drawing", "venture"]),
    kind: z.string(),
    stage: opt(z.enum(STAGES)),
    status: opt(z.string()),        // shown instead of the stage, e.g. "Live" for Not Art pages
    link: opt(z.string()),          // outside website
    linkLabel: opt(z.string()),
    summary: z.string(),                // short text on the project cards
    intro: opt(z.string()),             // longer intro on the project's own page (falls back to summary)
    accent: z.string(),
    accentDark: z.string(),
    bg: z.string(),
    bgDark: z.string(),
    cover: z.string(),
    coverFit: z.preprocess(unset, z.enum(["cover", "contain"]).default("cover")),
    coverBg: opt(z.string()),
    embed: opt(z.string()),
    embedNote: opt(z.string()),
    heroImage: opt(z.string()),
    heroNote: opt(z.string()),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    decisions: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    gallery: z.array(media).default([]),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({
    title: z.string(),
    project: z.string(),
    date: z.coerce.date(),
    stage: z.enum(STAGES),
    excerpt: z.string(),
    image: opt(z.string()),
    video: opt(z.string()),
    caption: opt(z.string()),
    gallery: z.array(media).default([]),
    draft: z.boolean().default(false),
    comments: z.array(z.object({
      name: z.string(),
      date: z.coerce.date(),
      text: z.string(),
      artist: z.boolean().default(false),
    })).default([]),
  }),
});

export const collections = { projects, updates };
