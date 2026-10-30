// Every page, so search engines can find them all.
import type { APIRoute } from "astro";
import { getProjects, getUpdates, projectHref } from "../lib/content";

export const GET: APIRoute = async ({ site }) => {
  const paths = ["/", "/updates/", "/play/", "/not-art/", "/contact/",
    ...(await getProjects()).map(projectHref),
    ...(await getUpdates()).map(u => `/updates/${u.id}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    paths.map(p => `<url><loc>${new URL(p, site).href}</loc></url>`).join("") + `</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
