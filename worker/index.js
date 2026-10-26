// Sends the contact and comment forms as email, through Cloudflare Email Routing.
// Everything else is the static site in dist/.
import { EmailMessage } from "cloudflare:email";

const FROM = "website@pkm.nz";
const MAX = 10000;  // characters per field

const json = (ok, status = ok ? 200 : 400) =>
  new Response(JSON.stringify({ ok }), { status, headers: { "content-type": "application/json" } });

// Header values can't carry line breaks; non-ASCII goes in RFC 2047 form.
const clean = s => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 200);
const encodeHeader = s => /^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`;
const b64 = s => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

async function send(request, env) {
  if (request.method !== "POST") return json(false, 405);
  const origin = request.headers.get("origin");
  if (origin && !/^https:\/\/(www\.)?pkm\.nz$/.test(origin)) return json(false, 403);
  if (!env.MAIL_TO) return json(false, 500);

  let fd;
  try { fd = await request.formData(); } catch { return json(false); }
  if (fd.get("_gotcha")) return json(true);  // a bot filled the hidden field: pretend it worked

  const fields = [...fd.entries()]
    .filter(([k, v]) => !k.startsWith("_") && typeof v === "string" && v.trim())
    .map(([k, v]) => [k, v.slice(0, MAX)]);
  if (!fields.some(([k]) => k === "message" || k === "comment")) return json(false);

  const replyTo = clean(fd.get("email"));
  const subject = clean(fd.get("_subject")) || "Message from pkm.nz";
  const body = fields.map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)}:\n${v.trim()}`).join("\n\n");

  const headers = [
    `From: "pkm.nz" <${FROM}>`,
    `To: <${env.MAIL_TO}>`,
    /^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$/.test(replyTo) ? `Reply-To: <${replyTo}>` : null,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@pkm.nz>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ].filter(Boolean);
  const raw = `${headers.join("\r\n")}\r\n\r\n${b64(body).replace(/.{76}/g, "$&\r\n")}\r\n`;

  try {
    await env.MAILER.send(new EmailMessage(FROM, env.MAIL_TO, raw));
    return json(true);
  } catch (e) {
    console.error("send failed", e);
    return json(false, 502);
  }
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/send") return send(request, env);
    return env.ASSETS.fetch(request);
  },
};
