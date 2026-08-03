#!/usr/bin/env python3
"""Compile the business plan markdown into a single professional PDF."""
import re, os, sys, asyncio, shutil
import markdown as md
from pypdf import PdfReader, PdfWriter

ROOT = "/home/user/branden"
OUT = "/tmp/claude-0/-home-user-branden/f3840c2e-73cc-5fec-8f22-b276ecf79485/scratchpad"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

DOCS = [
    ("README.md", "Overview"),
    ("docs/01-executive-summary.md", None),
    ("docs/02-formation-and-ownership.md", None),
    ("docs/03-services-and-pricing.md", None),
    ("docs/04-operations-manual.md", None),
    ("docs/05-staffing-and-crew.md", None),
    ("docs/06-financial-model.md", None),
    ("docs/07-marketing-and-sales.md", None),
    ("docs/08-risk-insurance-compliance.md", None),
    ("docs/09-90-day-launch-plan.md", None),
    ("forms/README.md", "Appendix: Forms &amp; Templates"),
    ("forms/work-authorization.md", None),
    ("forms/change-order.md", None),
    ("forms/daily-job-log.md", None),
    ("forms/sub-insurance-checklist.md", None),
    ("forms/emergency-call-sheet.md", None),
    ("forms/subcontractor-agreement.md", None),
]


LIST_RE = re.compile(r"^\s*(?:[-*+]|\d+\.)\s+\S")
TABLE_RE = re.compile(r"^\s*\|")


def loosen(src):
    """GitHub starts a list/table straight after a paragraph; Python-Markdown needs a
    blank line first. Insert one so the PDF matches how the source reads on GitHub."""
    out, fence, prev = [], False, ""
    for line in src.split("\n"):
        if re.match(r"^\s*(```|~~~)", line):
            fence = not fence
            out.append(line)
            prev = line
            continue
        if not fence and prev.strip():
            q = line.startswith(">")
            body = re.sub(r"^>\s?", "", line) if q else line
            pbody = re.sub(r"^>\s?", "", prev) if prev.startswith(">") else prev
            starts_list, starts_table = bool(LIST_RE.match(body)), bool(TABLE_RE.match(body))
            if (starts_list or starts_table) and q == prev.startswith(">"):
                same = LIST_RE.match(pbody) if starts_list else TABLE_RE.match(pbody)
                cont = pbody.startswith(("  ", "\t")) or pbody.lstrip().startswith("#")
                if not same and not cont:
                    out.append(">" if q else "")
        out.append(line)
        prev = line
    return "\n".join(out)


def slug(h):
    return re.sub(r"[^\w\s-]", "", h.strip().lower()).replace(" ", "-")


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


# ---------- load & preprocess ----------
path_to_idx = {os.path.normpath(p): i for i, (p, _) in enumerate(DOCS)}
sections = []

for i, (rel, title_override) in enumerate(DOCS):
    src = open(os.path.join(ROOT, rel)).read()
    base = os.path.dirname(rel)

    # Drop the README "Read in this order" nav table (redundant with the TOC)
    if rel == "README.md":
        src = re.sub(r"## Read in this order.*?(?=\n## )", "", src, flags=re.S)

    def fix_link(m):
        text, link = m.group(1), m.group(2)
        if link.startswith(("http", "mailto:")):
            return m.group(0)
        p, _, anc = link.partition("#")
        if not p:
            return f"[{text}](#d{i}-{anc})"
        tgt = os.path.normpath(os.path.join(base, p))
        j = path_to_idx.get(tgt)
        if j is None:  # directory link, e.g. forms/
            j = path_to_idx.get("forms/README.md", i)
            return f"[{text}](#d{j})"
        return f"[{text}](#d{j}-{anc})" if anc else f"[{text}](#d{j})"

    src = re.sub(r"\[([^\]]*)\]\(([^)]+)\)", fix_link, src)
    src = loosen(src)

    # capture headings for the TOC before conversion
    heads = []
    for line in src.split("\n"):
        m = re.match(r"^(#{1,2})\s+(.*)$", line)
        if m:
            lvl = len(m.group(1))
            txt = re.sub(r"\*\*|\`|\*", "", m.group(2)).strip()
            heads.append((lvl, txt))
    if title_override:
        title = title_override
    else:
        title = heads[0][1] if heads else rel
    if title_override:
        heads[0] = (1, re.sub("&amp;", "&", title_override))

    body = md.markdown(
        src,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list", "md_in_html"],
    )
    # anchor ids, namespaced per document
    def add_id(m):
        tag, attrs, inner = m.group(1), m.group(2), m.group(3)
        plain = re.sub(r"<[^>]+>", "", inner)
        return f'<{tag}{attrs} id="d{i}-{slug(plain)}">{inner}</{tag}>'

    body = re.sub(r"<(h[1-6])([^>]*)>(.*?)</\1>", add_id, body, flags=re.S)
    # replace the H1 text when overridden
    if title_override:
        body = re.sub(r"<h1([^>]*)>.*?</h1>", f"<h1\\1>{title_override}</h1>", body, count=1, flags=re.S)
    body = f'<div class="section" id="d{i}">{body}</div>'
    sections.append({"idx": i, "title": re.sub("&amp;", "&", title), "heads": heads, "html": body})


# ---------- styling ----------
CSS = """
@page { size: Letter; margin: 0.7in 0.7in 0.75in 0.7in; }
* { box-sizing: border-box; }
body { font-family: "Liberation Sans","DejaVu Sans",sans-serif; font-size: 9.4pt;
       line-height: 1.5; color: #1c1c1c; margin: 0; }
p { margin: 0 0 7pt; orphans: 2; widows: 2; }
strong { color: #0f0f0f; }
em { color: #333; }
a { color: #1a4d7a; text-decoration: none; }

.section { page-break-before: always; }
.section:first-child { page-break-before: avoid; }

h1 { font-size: 19pt; color: #16344f; margin: 0 0 14pt; padding-bottom: 7pt;
     border-bottom: 2.5pt solid #16344f; line-height: 1.2; letter-spacing: -0.2pt; }
h2 { font-size: 12.5pt; color: #16344f; margin: 17pt 0 7pt; line-height: 1.25;
     break-after: avoid; page-break-after: avoid; }
h3 { font-size: 10.4pt; color: #22456b; margin: 12pt 0 5pt; break-after: avoid;
     page-break-after: avoid; }
h4 { font-size: 9.6pt; color: #333; margin: 10pt 0 4pt; break-after: avoid; }

ul, ol { margin: 0 0 8pt; padding-left: 16pt; }
li { margin-bottom: 3pt; }
li > ul, li > ol { margin-top: 3pt; }

table { width: 100%; border-collapse: collapse; margin: 8pt 0 11pt; font-size: 8.2pt;
        page-break-inside: auto; }
th { background: #16344f; color: #fff; text-align: left; padding: 4.5pt 5pt;
     font-weight: bold; border: 0.5pt solid #16344f; line-height: 1.3; }
th strong, th b, th em, th code { color: #fff; background: none; }
td { padding: 4pt 5pt; border: 0.5pt solid #c9d4de; vertical-align: top; line-height: 1.35; }
tbody tr:nth-child(even) td { background: #f4f7fa; }
tr { page-break-inside: avoid; }
thead { display: table-header-group; }

pre { background: #f4f6f8; border-left: 2.5pt solid #16344f; padding: 7pt 9pt;
      font-family: "DejaVu Sans Mono","Liberation Mono",monospace; font-size: 7.4pt;
      line-height: 1.35; margin: 8pt 0 11pt; page-break-inside: avoid;
      white-space: pre; overflow: hidden; }
code { font-family: "DejaVu Sans Mono",monospace; font-size: 8.2pt;
       background: #eef1f4; padding: 0.5pt 2.5pt; border-radius: 2pt; }
pre code { background: none; padding: 0; font-size: inherit; }

blockquote { margin: 9pt 0; padding: 7pt 10pt; background: #f2f6fa;
             border-left: 3pt solid #2c6ca3; page-break-inside: avoid; }
blockquote p:last-child { margin-bottom: 0; }
blockquote h2, blockquote h3 { margin-top: 0; font-size: 10.4pt; }

hr { border: none; border-top: 0.5pt solid #ccd6df; margin: 13pt 0; }

/* ---------- cover ---------- */
.cover { height: 9.4in; display: flex; flex-direction: column; }
.cover-rule { height: 10pt; background: #16344f; margin-bottom: 42pt; }
.cover .eyebrow { font-size: 9.5pt; letter-spacing: 2.6pt; text-transform: uppercase;
                  color: #2c6ca3; font-weight: bold; margin-bottom: 16pt; }
.cover h1.t { font-size: 40pt; line-height: 1.08; color: #16344f; border: none;
              margin: 0 0 12pt; padding: 0; letter-spacing: -1pt; }
.cover .sub { font-size: 16pt; color: #3d5a72; line-height: 1.35; margin-bottom: 30pt;
              font-weight: normal; }
.cover .thesis { font-size: 10.2pt; line-height: 1.62; color: #333; max-width: 5.2in;
                 border-left: 3pt solid #2c6ca3; padding-left: 13pt; margin-bottom: auto; }
.cover .meta { border-top: 1pt solid #c9d4de; padding-top: 14pt; font-size: 9pt;
               color: #444; line-height: 1.75; }
.cover .meta b { color: #16344f; display: inline-block; min-width: 92pt; }
.cover .conf { margin-top: 16pt; font-size: 7.6pt; color: #7b8794; line-height: 1.5; }

/* ---------- toc ---------- */
.toc h1 { margin-bottom: 16pt; }
.toc-l1 { display: flex; align-items: baseline; margin: 11pt 0 3pt; font-size: 10.6pt;
          font-weight: bold; color: #16344f; break-inside: avoid; }
.toc-l2 { display: flex; align-items: baseline; margin: 2.5pt 0 2.5pt 17pt;
          font-size: 8.9pt; color: #3d4a57; break-inside: avoid; }
.toc-dots { flex: 1; border-bottom: 0.5pt dotted #a8b4c0; margin: 0 5pt 3pt; }
.toc-pg { font-variant-numeric: tabular-nums; color: #2c6ca3; }
.toc-l2 .toc-pg { color: #64717e; }
"""

FOOT = ('<div style="font-size:7pt;color:#96a0aa;width:100%;padding:0 0.7in;'
        'font-family:Liberation Sans,sans-serif;display:flex;justify-content:space-between;">'
        '<span>Operating Business Plan &#183; Emergency Home Repair &amp; Carpentry</span>'
        '<span class="pageNumber"></span></div>')


def page_html(inner, cls=""):
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body class='{cls}'>{inner}</body></html>"


COVER = """
<div class="cover">
  <div class="cover-rule"></div>
  <div class="eyebrow">Operating Business Plan</div>
  <h1 class="t">Emergency Home&nbsp;Repair<br>&amp; Carpentry</h1>
  <div class="sub">24/7 emergency response for homeowners,<br>
      integrated with a full carpentry &amp; remodeling division.</div>
  <div class="thesis">
    Emergency work is real revenue &mdash; much of it billed to homeowners insurance &mdash;
    but its strategic job is <b>customer acquisition</b>. Every emergency call puts us inside a
    damaged house at the exact moment the owner has to decide who rebuilds it. We convert roughly
    one in four of the calls involving real damage into a full carpentry or remodeling contract at
    4&ndash;20&times; the ticket size.<br><br>
    Competitors sell remodeling and hope the phone rings.<br>
    <b>We buy the relationship at the moment of crisis and own the rebuild.</b>
  </div>
  <div class="meta">
    <b>Company</b> [COMPANY NAME] LLC<br>
    <b>Prepared</b> August 2026<br>
    <b>Principals</b> Operator A (Branden) &#183; Operator B (Partner) &#183; Capital Partner (Investor)<br>
    <b>Capital sought</b> $250,000
    <div class="conf">CONFIDENTIAL &mdash; This document contains proprietary business information and is
    provided for evaluation purposes only. Financial projections are planning estimates based on national
    averages and must be calibrated to local market conditions; they are not guarantees of performance.
    Nothing in this document is legal, tax, or insurance advice.</div>
  </div>
</div>"""


def build_toc(pages=None):
    rows = []
    for s in sections:
        for k, (lvl, txt) in enumerate(s["heads"]):
            if lvl == 1:
                key = ("h1", s["idx"])
                cls = "toc-l1"
            else:
                key = ("h2", s["idx"], k)
                cls = "toc-l2"
            pg = "" if pages is None else str(pages.get(key, ""))
            rows.append(f'<div class="{cls}"><span>{txt}</span>'
                        f'<span class="toc-dots"></span><span class="toc-pg">{pg}</span></div>')
    return '<div class="section toc"><h1>Contents</h1>' + "".join(rows) + "</div>"


async def render(html, out, footer=True, first_page=1):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        pg = await b.new_page()
        await pg.set_content(html, wait_until="load")
        await pg.emulate_media(media="print")
        opts = dict(path=out, format="Letter", print_background=True,
                    margin={"top": "0.7in", "bottom": "0.75in", "left": "0.7in", "right": "0.7in"})
        if footer:
            opts.update(display_header_footer=True, header_template="<div></div>", footer_template=FOOT)
        await pg.pdf(**opts)
        await b.close()


def npages(f):
    return len(PdfReader(f).pages)


async def main():
    # pass 0 — how long is the TOC?
    toc_only = os.path.join(OUT, "_toc.pdf")
    await render(page_html(build_toc()), toc_only, footer=True)
    n_toc = npages(toc_only)
    print(f"TOC pages: {n_toc}")

    # pass 1 — render the body, then locate every heading
    body1 = os.path.join(OUT, "_body1.pdf")
    html1 = page_html(build_toc() + "".join(s["html"] for s in sections))
    await render(html1, body1)
    r = PdfReader(body1)
    total = len(r.pages)
    print(f"Body pages (pass 1): {total}")
    ptext = [norm(r.pages[i].extract_text() or "") for i in range(total)]

    pages, cursor = {}, n_toc  # 0-indexed page after the TOC
    for s in sections:
        for k, (lvl, txt) in enumerate(s["heads"]):
            key = ("h1", s["idx"]) if lvl == 1 else ("h2", s["idx"], k)
            needle = norm(txt)
            found = None
            for i in range(cursor, total):
                if needle and needle in ptext[i]:
                    found = i
                    break
            if found is not None:
                pages[key] = found + 1
                cursor = found
            else:
                pages[key] = cursor + 1
    missing = sum(1 for s in sections for k, (l, t) in enumerate(s["heads"])
                  if (("h1", s["idx"]) if l == 1 else ("h2", s["idx"], k)) not in pages)
    print(f"Headings located: {len(pages)} (unresolved: {missing})")

    # pass 2 — TOC with real page numbers
    body2 = os.path.join(OUT, "_body2.pdf")
    html2 = page_html(build_toc(pages) + "".join(s["html"] for s in sections))
    await render(html2, body2)
    if npages(body2) != total:
        d = npages(body2) - total
        print(f"TOC grew by {d} page(s); re-rendering with adjusted numbers")
        pages = {k: v + d for k, v in pages.items()}
        html2 = page_html(build_toc(pages) + "".join(s["html"] for s in sections))
        await render(html2, body2)
    print(f"Body pages (final): {npages(body2)}")

    # cover, then merge
    cover = os.path.join(OUT, "_cover.pdf")
    await render(page_html(COVER), cover, footer=False)

    w = PdfWriter()
    for f in (cover, body2):
        for p in PdfReader(f).pages:
            w.add_page(p)
    w.add_metadata({
        "/Title": "Operating Business Plan - Emergency Home Repair & Carpentry",
        "/Subject": "Business plan and operations manual",
        "/Keywords": "business plan, emergency home repair, carpentry, remodeling, LLC",
    })
    final = os.path.join(ROOT, "Business-Plan-Emergency-Home-Repair-and-Carpentry.pdf")
    with open(final, "wb") as fh:
        w.write(fh)
    print(f"\nWROTE {final}  ({npages(final)} pages, {os.path.getsize(final)/1024:.0f} KB)")


asyncio.run(main())
