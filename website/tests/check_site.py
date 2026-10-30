#!/usr/bin/env python3
"""Dependency-free structural checks for the O'BUUMBA Creative static site."""
from html.parser import HTMLParser
from pathlib import Path
import sys

SITE = Path(__file__).resolve().parents[1] / "index.html"

class SiteAudit(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = []
        self.anchor_refs = []
        self.bad_blank_links = []
        self.images_without_alt = []
        self.title_seen = False
        self.description_seen = False
        self.viewport_seen = False
        self.title_text = []
        self.title_open = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        element_id = a.get("id")
        if element_id:
            if element_id in self.ids:
                self.duplicates.append(element_id)
            self.ids.add(element_id)

        if tag == "a":
            href = a.get("href", "")
            if href.startswith("#"):
                self.anchor_refs.append(href[1:])
            if a.get("target") == "_blank":
                rel = set((a.get("rel") or "").lower().split())
                if not {"noopener", "noreferrer"}.issubset(rel):
                    self.bad_blank_links.append(href)

        if tag == "img" and "alt" not in a:
            self.images_without_alt.append(a.get("src", "(unknown image)"))

        if tag == "title":
            self.title_seen = True
            self.title_open = True
        if tag == "meta":
            if a.get("name") == "description" and a.get("content"):
                self.description_seen = True
            if a.get("name") == "viewport":
                self.viewport_seen = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.title_open = False

    def handle_data(self, data):
        if self.title_open:
            self.title_text.append(data.strip())

def main():
    if not SITE.exists():
        raise SystemExit("FAIL: website/index.html is missing")

    html = SITE.read_text(encoding="utf-8")
    audit = SiteAudit()
    audit.feed(html)
    errors = []

    if audit.duplicates:
        errors.append("Duplicate element IDs: " + ", ".join(audit.duplicates))
    missing = sorted(set(audit.anchor_refs) - audit.ids)
    if missing:
        errors.append("Broken in-page links: " + ", ".join("#" + x for x in missing))
    if audit.bad_blank_links:
        errors.append("External target=_blank links missing noopener noreferrer")
    if audit.images_without_alt:
        errors.append("Images missing alt text: " + ", ".join(audit.images_without_alt))
    if not audit.title_seen or not "".join(audit.title_text).strip():
        errors.append("A non-empty page title is required")
    if not audit.description_seen:
        errors.append("A meta description is required")
    if not audit.viewport_seen:
        errors.append("A mobile viewport meta tag is required")
    for required in ("https://wa.me/260776745837", "mailto:sianyamabuumba@gmail.com",
                     "Livingstone, Zambia", "CREATE. UPLIFT. COCKIENESS."):
        if required not in html:
            errors.append("Required public content/link missing: " + required)

    if errors:
        print("O'BUUMBA website checks: FAIL")
        for error in errors:
            print("- " + error)
        return 1

    print("O'BUUMBA website checks: PASS")
    print(f"Checked {len(audit.ids)} unique IDs and {len(audit.anchor_refs)} in-page links.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
