import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;
export type Update = CollectionEntry<"updates">;

export async function getProjects() {
  return (await getCollection("projects")).sort((a, b) => a.data.order - b.data.order);
}

export async function getUpdates() {
  return (await getCollection("updates", u => import.meta.env.DEV || !u.data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const fullTitle = (p: Project) => `${p.data.title} ${p.data.titleEnd}`;

// The project's colours, read by the .pa class (switches for dark mode).
export const paStyle = (p: Project) =>
  `--pa-l:${p.data.accent};--pa-d:${p.data.accentDark};--bg-l:${p.data.bg};--bg-d:${p.data.bgDark}`;

export const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric", timeZone: "Pacific/Auckland" });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

// Turns a YouTube or Vimeo link into its embeddable player address.
export function videoEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}
