import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { STAGES } from "./site.config";

const media = z.object({
  image: z.string().optional(),
  video: z.string().optional(),   // YouTube or Vimeo link
  caption: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    titleEnd: z.string(),               // the part of the title shown in the project colour
    order: z.number(),
    mode: z.enum(["digital", "model", "drawing"]),
    kind: z.string(),
    stage: z.enum(STAGES),
    summary: z.string(),
    accent: z.string(),
    accentDark: z.string(),
    bg: z.string(),
    bgDark: z.string(),
    cover: z.string(),
    coverFit: z.enum(["cover", "contain"]).default("cover"),
    coverBg: z.string().optional(),
    embed: z.string().optional(),
    embedNote: z.string().optional(),
    heroImage: z.string().optional(),
    heroNote: z.string().optional(),
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
    image: z.string().optional(),
    video: z.string().optional(),
    caption: z.string().optional(),
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
