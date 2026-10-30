// The updates as an RSS feed, for feed readers and for sending updates by email.
import type { APIRoute } from "astro";
import { getProjects, getUpdates, fullTitle } from "../lib/content";
import { paragraphs } from "../lib/inline";
import { SITE } from "../site.config";

const x = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async ({ site }) => {
  const projects = await getProjects();
  const items = (await getUpdates()).map(u => {
    const p = projects.find(p => p.id === u.data.project);
    const link = new URL(`/updates/${u.id}/`, site).href;
    const img = u.data.image ? `<p><img src="${new URL(u.data.image, site).href}" alt="" /></p>` : "";
    return `<item><title>${x(u.data.title)}</title><link>${link}</link><guid>${link}</guid>` +
      `<pubDate>${u.data.date.toUTCString()}</pubDate>${p ? `<category>${x(fullTitle(p))}</category>` : ""}` +
      `<description>${x(img + paragraphs(u.data.excerpt))}</description></item>`;
  }).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>${x(SITE.title)}</title><link>${site}</link><description>${x(SITE.description)}</description><language>en-nz</language>` +
    `<atom:link href="${new URL("/rss.xml", site).href}" rel="self" type="application/rss+xml" />${items}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
