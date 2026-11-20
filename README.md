# Sitaram Yechury Foundation — website

A plain static website (HTML + CSS + JavaScript). No build step, no frameworks, no dependencies.

## Pages
| File | Content |
|---|---|
| `index.html` | Home — hero slider, introduction, upcoming event, milestones, logo-unveiling video |
| `about.html` | The Foundation — purpose, activities, office bearers, emblem |
| `life.html` | Life & Legacy — 12 illustrated chapters and a timeline (adapted from *A Life of Study, Struggle and Solidarity*, The Left Views) |
| `events.html` | 22 November 2026 programme, Kolkata |
| `gallery.html` | Filterable photo archive with lightbox |

## Structure
```
assets/css/style.css        all styles (colour tokens at the top)
assets/js/main.js           menu, slider, countdown, gallery, lightbox
assets/js/gallery-data.js   photo list: file, size, category, caption  ← edit captions here
assets/gallery/             large photos (max 1800px)
assets/thumbs/              thumbnails (max 640px)
assets/img/                 logos, favicon, programme flyer, logo video
```

## Preview locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Publish on GitHub Pages
1. Create a repository and push the contents of this folder to it (`index.html` must be at the root).
2. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**, choose `main` and `/ (root)`.
3. The site will be live at `https://<username>.github.io/<repository>/`.

## Adding photos
Put a resized JPEG in `assets/gallery/` and a small copy in `assets/thumbs/` (same file name), then add an entry to `assets/js/gallery-data.js`.
Categories: `early`, `congress`, `movements`, `parliament`, `international`, `bengal`, `culture`, `portraits`.

## To do
- Add the Foundation's contact email / phone / social links (search for `TODO` in the HTML files).

## Firebase Hosting

The site can also be served from Firebase Hosting (project `sitaramyechurifoundation`).
`firebase.json` serves the repository root as-is and leaves out `README.md`, dotfiles and the Firebase config.

```sh
npm install -g firebase-tools      # or: curl -sL https://firebase.tools | bash
firebase login
firebase projects:list             # confirm the Project ID matches .firebaserc
firebase deploy --only hosting
```

The site is then live at `https://sitaramyechurifoundation.web.app`.
Add a custom domain under **Firebase console → Hosting → Add custom domain**.
