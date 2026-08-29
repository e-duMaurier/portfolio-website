# duma-theme

A lightweight Hugo theme for personal portfolios and blogs: Bootstrap 5.3 with
icons, a light/dark toggle, Chroma syntax highlighting with copy buttons, and
built-in support for multi-part **blog series** and custom sections.

## Requirements

- Hugo (**extended**) v0.146.0 or newer — the theme declares its minimum in
  `hugo.toml`.

## Quickstart

1. Copy the theme into your site's `themes/` directory (or set it up as a
   Hugo module).
2. Reference it and set your own details in `hugo.toml`:

   ```toml
   baseURL = 'https://example.org/'
   locale = 'en-GB'
   title = 'My Site'
   theme = 'duma-theme'
   ```

3. Add a menu (`Home`, `About`, `Blog` are a good starting point):

   ```toml
   [menu]
     [[menu.main]]
       name = "Home"
       url = "/"
       weight = 10

     [[menu.main]]
       name = "About"
       url = "/about/"
       weight = 20

     [[menu.main]]
       name = "Blog"
       url = "/blog/"
       weight = 30
   ```

4. Recommended extras:

   ```toml
   [taxonomies]
     tag = 'tags'

   [markup.highlight]
     noClasses = false
   ```

   `noClasses = false` makes Chroma emit classes so the theme's hand-tuned
   `assets/css/syntax.css` colours apply.

### Try the example site

For a working reference of a complete setup (Home, About, Blog with posts and
a series), serve the bundled example site:

```sh
hugo serve --source themes/duma-theme/exampleSite
```

The example site lives in `themes/duma-theme/exampleSite/` (its `hugo.toml`
sets `themesDir = '../../'` to reach the theme). It is a **reference demo only
— it is never merged into consuming sites**. Build your own content in your
site's `content/` directory following the sections below.

## Front matter

Pages and posts use a common set of fields:

| Field | Purpose |
|---|---|
| `title` | The page heading (H1). |
| `subtitle` | A lead line shown under the title on the page and on listing cards. |
| `description` | A short summary used on listing pages; falls back to the truncated page summary. |
| `date` / `lastmod` | Rendered (en-GB) as `Published … · Updated …`. The "Updated" part only appears when `lastmod` differs from `date`. |
| `tags` | Taxonomy terms; each post can list several. |
| `draft` | Set `true` to keep a page out of production builds. |

Archetypes ship in `archetypes/` — `default.md`, `blog.md` and `series.md` — so
`hugo new` produces content with these fields already in place.

## Blog & series

`content/blog/` is rendered by `layouts/blog/list.html`:

- child **sections** (series) are listed first, ordered by the date of their
  newest part (descending) — no weights or manual ordering to maintain;
- any standalone posts directly under `blog/` follow in a "Latest Posts" list,
  newest first.

A series is a normal blog section whose `_index.md` sets `layout = 'series'`:

```toml
+++
title = 'Example Series'
subtitle = "A multi-part series"
description = "A short series description."
layout = 'series'
draft = false
+++
```

The parts sit inside the series directory and use the blog fields, with titles
like `Part 1: <what it covers>`:

```
content/blog/example-series/
├── _index.md          # layout = 'series'
└── part-1/index.md
└── part-2/index.md
```

- Parts are ordered by `date` (oldest first) via `layouts/blog/series.html`,
  which renders one card per part (`_partials/post-item.html`: title, subtitle,
  `Published · Updated` line, description).
- Each part page shows a prev/next box (`_partials/series-nav.html`) with the
  series name, "Part N of M", and links to the previous/next part. The partial
  is guarded to only render on pages whose parent sets
  `layout = 'series'`, so unpaged posts are unaffected.

Create a series with the matching archetype:

```sh
hugo new blog/example-series/index.md   # uses archetypes/series.md
hugo new blog/example-series/part-1/index.md   # uses archetypes/blog.md
```

## Adding custom sections (e.g. TTRPG, Photography, Cybersecurity)

Sections play nicely out of the box with the generic `layouts/section.html`,
so a new top-level area is three steps:

1. Create the section's index page:

   ```sh
   hugo new ttrpg/_index.md
   ```

   with `title = "Tabletop RPGs"` and `draft = false`.

2. Add its pages below it, e.g. `hugo new ttrpg/my-session/index.md`.

3. Point a menu entry at it (reusing the menu syntax above with
   `name = "TTRPG"` / `url = "/ttrpg/"`).

Variations:

- **Nested sub-sections.** Give a section its own `_index.md` and it becomes a
  route in its own right — e.g. `content/cybersec/writeups/` serves
  `/cybersec/writeups/`. A dropdown menu links a parent (no `url`) to child
  items:

  ```toml
  [[menu.main]]
    name = "Cybersecurity"           # parent item, no url
    weight = 40

  [[menu.main]]
    name = "Write-Ups"               # child item
    url = "/cybersec/writeups/"
    parent = "Cybersecurity"
    weight = 10
  ```

- **Custom content.** Any `params` you add to front matter are available to
  layouts as `.Params.<name>` — handy for gallery metadata, machine names,
  difficulty ratings, and so on. Add your own archetype (like `archetypes/`)
  to pre-fill each new page in that section.

## Features & formatting

- Bootstrap 5.3 + Bootstrap Icons (CDN), Google Fonts (Inter, Montserrat).
- **Dark mode**: footer toggle, persisted in `localStorage`, defaulting to the
  OS `prefers-color-scheme`; a `?theme=dark` / `?theme=light` URL query
  overrides it. See `_partials/head.html` (document-level, flicker-free) and
  `assets/js/main.js`.
- **Syntax highlighting**: Chroma with hand-tuned colours for both themes
  (`assets/css/syntax.css`); code blocks get a one-click **copy** button with a
  "Copied" state and a fallback for non-secure contexts (`assets/js/main.js`).
- **Styling**: design tokens (colors, code-block background/border) live in
  `assets/css/style.css`.
- **Navigation**: responsive navbar with dropdown support; a `skip-link`,
  semantic landmarks and `aria` labels throughout.
- **Dates** are formatted en-GB (`2 January 2006`) — keep `locale = 'en-GB'`.
- **Footer**: theme toggle, social links and copyright. The social links and
  `Duma Labs` name are hardcoded — edit `_partials/footer.html` to use your
  own profiles.

## Layout map

| Layout | Renders |
|---|---|
| `layouts/baseof.html` | Site shell: `<head>`, header, `#main-content`, footer |
| `layouts/home.html` | The site root (`content/_index.md`) |
| `layouts/page.html` | Ordinary pages: title, subtitle, metadata line, content |
| `layouts/section.html` | Any classic list section |
| `layouts/blog/list.html` | The blog index (series + "Latest Posts") |
| `layouts/blog/series.html` | A blog series listing |
| `layouts/taxonomy.html` / `layouts/term.html` | `/tags/…` pages |
| `_partials/series-nav.html` | Prev/next part box on series pages |
| `_partials/published-line.html` | The `Published · Updated` line |

## Example site

`themes/duma-theme/exampleSite/content/` ships a minimal reference demo —
Home, About, Blog with three example posts and an example series — so you can
see a complete, sensible setup in one place. Serve it with
`hugo serve --source themes/duma-theme/exampleSite` and browse the structure
as a template for your own content. It lives outside the theme's `content/`
directory on purpose: content inside a theme's `content/` directory is merged
into every site that uses the theme, whereas `exampleSite/` is inert — good
to know before you add any demo pages to a theme.