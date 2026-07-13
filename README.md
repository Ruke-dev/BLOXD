<div align="center">

# ✦ BLOXD

### A browser-based blog tag parser and live preview generator

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Font Awesome](https://img.shields.io/badge/Font_Awesome_v7-528DD7?style=flat-square&logo=fontawesome&logoColor=white)

[Live Demo](#) · [Report Bug](rukedev01@gmail.com) · [Request Feature](rukedev01@gmail.com)

</div>

---

## ✦ What is BLOXD?

BLOXD is a lightweight, zero-dependency, browser-based tool that converts structured plain-text syntax into a live styled blog preview. No markdown. No rich text editor. No build step. Just a textarea, a custom tag syntax, and instant HTML output rendered in your browser.

You write this:

```
head: text-4xl font-bold text-white : JavaScript — The Language of the Web
subh: text-2xl text-blue-300 : Why Every Developer Must Learn It
para: text-base text-gray-400 : JavaScript powers everything on the modern web...
```

BLOXD renders it as a fully styled, live blog preview — with your own Tailwind utility classes applied directly in the browser.

---

## ✦ Features

- **Custom tag syntax** — write `head:`, `subh:`, `para:` entries with optional Tailwind classes
- **Live preview generation** — renders styled HTML instantly on button click
- **Dynamic Tailwind class injection** — pass any Tailwind utility class directly in your syntax line
- **Default style fallback** — renders clean defaults when no classes are provided
- **Smart comma split** — comma separator only triggers between tag entries, never inside content
- **Copy to clipboard** — one-click copy of the entire preview output with icon toggle feedback
- **Inline error handling** — invalid syntax lines render as flagged error blocks without breaking the rest
- **Animated gradient heading** — gradient wave animation on the BLOXD title via CSS keyframes
- **Corner bracket UI** — aesthetic bracket decorations on textarea and output div
- **Custom typography** — Space Grotesk for headings and preview, Sora for body and syntax hints
- **Zero build step** — runs entirely in the browser via Tailwind CDN v4

---

## ✦ Syntax Guide

Every line follows this format:

```
tag: [optional tailwind classes] : Your content here
```

| Tag | Renders As | Default Classes When No Classes Provided |
|-----|-----------|------------------------------------------|
| `head:` | `<h1>` | `text-3xl antialiased` |
| `subh:` | `<h2>` | `text-xl antialiased` |
| `para:` | `<p>` | `text-lg antialiased` |

### With custom Tailwind classes:
```
head: text-4xl font-extrabold text-white : My Heading
subh: text-2xl font-bold text-blue-300 : My Subheading
para: text-base text-gray-400 : My paragraph content goes here
```

### Without custom classes — default styles applied automatically:
```
head: My Heading
subh: My Subheading
para: My paragraph content goes here
```

### Multi-entry input — newline separator (recommended for long content):
```
head: text-4xl font-bold text-white : First Heading
subh: text-xl text-blue-300 : First Subheading
para: text-base text-gray-400 : Paragraph with long content including commas, dashes, and colons: all safe.
```

### Multi-entry input — comma separator:
```
head: text-3xl text-white : Title,subh: text-xl text-blue-300 : Subtitle,para: text-base : Content here
```

> ⚠️ Commas inside paragraph content are completely safe. BLOXD only splits on commas that are immediately followed by `head:`, `subh:`, or `para:` using a regex lookahead — never on commas inside your actual content.

---

## ✦ How It Works

```
User types syntax into textarea
            │
            ▼
    sanitizeTextAreaValue()
    ─ checks for empty input
    ─ returns raw string or alerts
            │
            ▼
    parseInpStrToObj()
    ─ splits by \r?\n or smart comma lookahead
    ─ validates each line via validateTextInp()
    ─ builds array of {tag, classes, content} objects
            │
            ▼
    validateTextInp()
    ─ Pattern 1: tag: classes : content  → second colon present, classes extracted
    ─ Pattern 2: tag: content            → no second colon, no classes, content direct
    ─ returns parsed object or null
            │
            ▼
    generateHtmlFromOutputObj()
    ─ maps tag name → HTML element (h1, h2, p, div)
    ─ applies custom classes or default fallback
    ─ returns {htmlTag, htmlTagPredefinedClass, content}
            │
            ▼
    DOM Injection (click handler)
    ─ createElement per entry
    ─ className applied directly
    ─ appendChild to output container div
    ─ copy icon created and attached
    ─ outputDiv.replaceChildren() updates DOM cleanly
            │
            ▼
    Live Blog Preview Rendered
```

---

## ✦ The Core Regex — Two Pattern Strategy

`validateTextInp()` uses two regex patterns with priority ordering instead of one complex pattern:

```javascript
// Pattern 1 — entry has custom classes (second colon present)
const withClasses = /^(head|subh|para):\s*([^:]+):\s*(.+)$/i;

// Pattern 2 — entry has no classes (no second colon)
const withoutClasses = /^(head|subh|para):\s*(.+)$/i;

const match1 = withClasses.exec(textInpStr);
if (match1) return { tag: match1[1], classes: match1[2].trim().split(/\s+/).filter(Boolean), content: match1[3].trim() };

const match2 = withoutClasses.exec(textInpStr);
if (match2) return { tag: match2[1], classes: [], content: match2[2].trim() };

return null;
```

**Why two patterns instead of one?**

A single regex cannot reliably distinguish between:
- A colon that separates classes from content → `head: text-xl font-bold : My Title`
- A colon that is part of the actual content → `head: JavaScript — The Language: A Deep Dive`

Two patterns with priority ordering solves this cleanly. Pattern 1 fires first. If a second colon exists anywhere in the line, it treats everything before that colon as classes and everything after as content. If no second colon exists, Pattern 2 treats everything after the tag as direct content.

**Capture groups — Pattern 1:**

| Group | Captures | Example Value |
|-------|----------|---------------|
| `match1[1]` | Tag name | `"head"` |
| `match1[2]` | Classes string | `"text-4xl font-bold text-white "` |
| `match1[3]` | Content | `"My Heading"` |

**Capture groups — Pattern 2:**

| Group | Captures | Example Value |
|-------|----------|---------------|
| `match2[1]` | Tag name | `"head"` |
| `match2[2]` | Content (no classes) | `"My Heading Without Classes"` |

**Why `exec()` and not `test()`:**

`test()` returns a boolean and discards all capture groups. `exec()` returns the full match array with every captured group intact. Since BLOXD needs the actual tag, classes, and content extracted from each match — not just a yes/no — `exec()` is the only viable choice.

---

## ✦ Key Technical Decisions

### 1. Tailwind CDN over CLI
BLOXD injects user-provided Tailwind class names at runtime — classes that are unknown until the user types them. Tailwind CLI scans source files at build time and only generates CSS for classes it finds statically. It cannot generate CSS for runtime-dynamic classes. The Tailwind CDN v4 browser build runs in the browser and generates styles on demand, making dynamic class injection work without any build configuration or safelist.

### 2. Smart comma split with lookahead
```javascript
inputStr.split(/\r?\n|,(?=\s*(?:head|subh|para)\s*:)/i)
```
A lookahead `(?=...)` checks what comes after each comma without consuming it. The split only triggers on commas immediately followed by a valid tag keyword. All other commas — inside paragraph content, titles, or any other text — are left untouched.

### 3. `replaceChildren()` over `innerHTML = ""`
`innerHTML = ""` serializes the entire DOM subtree to a string, destroys every node including the preview `<p>` and the four corner bracket `<span>` elements, then rebuilds from scratch. `replaceChildren(...cornerSpans, preview, output)` directly swaps DOM nodes — preserving the corner spans and preview element, faster, and with no string serialization.

### 4. Corner spans captured once at module level
```javascript
const cornerSpans = [...outputDiv.querySelectorAll("span")];
```
Captured once on page load before any click events fire. Since `replaceChildren()` moves rather than copies DOM nodes, the same four span references are reinserted on every click — no recreation, no duplication.

### 5. Guard before DOM mutation
```javascript
const textAreaValue = sanitizeTextAreaValue();
if (!textAreaValue) return; // guard fires here

preview.textContent = "My Blog Preview"; // only runs if input is valid
```
The guard runs before any DOM changes. If the textarea is empty the function exits immediately — the preview text stays as "Currently No Blog Previews" and no partial DOM mutation happens.

---

## ✦ Project Structure

```
BLOXD/
├── index.html       — markup, layout, textarea, output div, corner brackets
├── main.js          — parser, validator, DOM generator, clipboard, event listener
├── output.css       — Google Fonts imports, gradient-wave keyframe, font assignments
├── favicon.ico      — browser tab icon
└── README.md
```

---

## ✦ Tech Stack

| Technology | Version | Role |
|-----------|---------|------|
| HTML5 | — | Page structure and semantic markup |
| Tailwind CSS | v4 CDN | All utility styling including runtime dynamic classes |
| Vanilla JavaScript | ES6+ | Parsing, regex, DOM manipulation, Clipboard API |
| Font Awesome | v7 CDN | Copy icon and check icon with toggle feedback |
| Google Fonts | — | Space Grotesk (headings), Sora (body text) |
| CSS Keyframes | — | Gradient wave animation on BLOXD heading |

---

## ✦ Getting Started

No installation. No build step. No package manager.

```bash
# Clone the repo
git clone https://github.com/yourusername/bloxd.git

# Open directly in browser
cd bloxd && open index.html
```

Or just double-click `index.html` in your file manager. Works in any modern browser.

---

## ✦ Usage Examples

**Minimal — no classes:**
```
head: Welcome to My Blog
subh: A place for thoughts on tech and life
para: This is my first post. Built with BLOXD.
```

**Fully styled:**
```
head: text-5xl font-black text-white : The Future of Web Development
subh: text-2xl font-semibold text-teal-400 : What Changes and What Stays
para: text-base text-gray-300 leading-relaxed : The web has changed more in the last five years than in the previous fifteen combined.
```

**Mixed — some styled, some default:**
```
head: text-4xl font-bold text-white : JavaScript Fundamentals
subh: Variables and Scope
para: text-sm text-gray-400 : Understanding scope is the single most important concept in JavaScript.
para: Closures, hoisting, and the temporal dead zone all stem from how scope works.
```

**Error handling — bad line surrounded by valid lines:**
```
head: text-3xl text-white : Valid Heading
this line has no valid tag and will render as an error block
para: text-base text-gray-400 : This paragraph still renders correctly after the error above.
```

---

## ✦ Roadmap

- [ ] Export preview as PDF
- [ ] Save and load drafts via localStorage
- [ ] Syntax highlighting inside the textarea
- [ ] Custom tag support beyond head, subh, para
- [ ] Multiple preview themes
- [ ] Markdown export
- [ ] Dark / light theme toggle

---

## ✦ Author

**Rahul Ray** — Fullstack Web Developer

Portfolio → [rukedev.vercel.app](https://rukedev.vercel.app)

---

## ✦ License

MIT — use it, break it, build on it.

---

<div align="center">

*Built with vanilla JS and way too much regex debugging*

</div>
