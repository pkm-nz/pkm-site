// Short fields (intros, summaries, excerpts) allow **bold**, *italic* and [links](url) from the /admin editor.
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function inline(s = ""): string {
  const slots: string[] = [];
  const keep = (html: string) => `\u0000${slots.push(html) - 1}\u0000`;
  let t = s.replace(/\s*\n+\s*/g, " ").trim()
    .replace(/\\([\\`*_{}\[\]()#+\-.!'"~>|])/g, (_, c) => keep(esc(c)));   // the editor's backslash escapes
  t = esc(t)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) =>
      /^(https?:|mailto:|\/)/.test(url) ? `<a href="${url}"${url.startsWith("/") ? "" : ' target="_blank" rel="noopener"'}>${text}</a>` : text)
    .replace(/\*\*(?=\S)(.+?)(?<=\S)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\w)__(?=\S)(.+?)(?<=\S)__(?!\w)/g, "<strong>$1</strong>")
    .replace(/\*(?=\S)(.+?)(?<=\S)\*/g, "<em>$1</em>")
    .replace(/(?<!\w)_(?=\S)(.+?)(?<=\S)_(?!\w)/g, "<em>$1</em>");
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => slots[+i]);
}

// Several paragraphs (separated by a blank line), each with inline formatting.
export const paragraphs = (s = "") =>
  s.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => `<p>${inline(p)}</p>`).join("");

// The same text with the formatting marks taken out, for page descriptions and link previews.
export const plain = (s = "") =>
  s.replace(/\s*\n+\s*/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|\*)(?=\S)(.+?)(?<=\S)\1/g, "$2").replace(/(\*\*|\*)(?=\S)(.+?)(?<=\S)\1/g, "$2")
    .replace(/(?<!\w)(__|_)(?=\S)(.+?)(?<=\S)\1(?!\w)/g, "$2").replace(/\\(.)/g, "$1").trim();
