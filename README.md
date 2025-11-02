# Duma Labs Portfolio Website

This is the source code repository for the Duma Labs personal portfolio website, built with **Hugo** and deployed to a **Dockerised Virtual Private Server (VPS)** via a **GitHub Actions CI/CD Pipeline**.

---

## Overview and Features

This project serves as a comprehensive platform to showcase my experiences in cybersecurity, programming, and also my passions for TTRPGs and photography.

Key technical features include:
- **Custom Hugo Theme:** Built from scratch (named `duma-theme`) to ensure a unique, lightweight, and customisable design.
- **Static Site Generation:** Uses Hugo to generate fast, highly secure static HTML/CSS/JS.
- **Automated Deployment (CI/CD):** Uses **GitHub Actions** and **`rsync` over SSH** for automatic build and deployment upon every push to the `main` branch.
- **Dockerised Hosting:** Content is served securely from an Nginx web server container managed by Nginx Proxy Manager (NPM).

---

## Local Development Setup

To run this project locally, you must have Hugo Extended installed.

### 1. Clone the Repository

```bash
git clone git@github.com:e-duMaurier/portfolio-website.git
cd portfolio-website
```

### 2. Run Hugo Server

Execute the following command from the root directory to build the site and launch a local server with live reloading:

```bash
hugo server
```

The site will be available at `http://localhost:1313/`.

---

## Content Structure and Customization

### Content Types (Archetypes)

The content workflow uses custom archetypes located in the **website's root directory (`archetypes/`)** to maintain structured front matter for specific content sections. This decision keeps the content structure separate from the theme, ensuring the theme remains highly reusable.

|**Section**|**Archetype File**|**Key Feature**|
|---|---|---|
|**Blog**|`blog.md`|Standard metadata fields.|
|**Cybersecurity**|`writeups.md`|Structured fields for **`platform`**, **`difficulty`**, and pre-defined technical headings.|
|**TTRPG**|`ttrpg.md`|Gaming fields for **`game`**, **`campaign`**, and **`characters`**.|
|**Photography**|`tog.md`|Metadata for **`date_taken`**, **`camera`**, and **`lens`**.|

To create new content using an archetype, use the `hugo new` command:

```bash
# Example: Create a new cybersecurity write-up
hugo new cybersec/writeups/my-new-hack.md
```

### Theme Styling

The theme's aesthetic is controlled by a customised version of **Bootstrap** and the custom stylesheet:

- **Custom Styles:** `themes/duma-theme/static/css/style.css`
- **Base Templates:** `themes/duma-theme/layouts/baseof.html` and the partials within `layouts/_partials/`.

---

## Deployment Workflow

The deployment process is entirely automated via GitHub Actions.

### 1. Prerequisites (GitHub Secrets)

The pipeline relies on the following secrets, configured in the repository settings, for secure SSH access:

- `VPS_WEB_DEPLOY_KEY` (The private ED25519 key)
- `VPS_IP`, `VPS_USER`, `VPS_PORT`, `VPS_DEPLOY_PATH`

### 2. Local Publishing

The entire build and deployment process is triggered by simply pushing changes to the `main` branch. A helper script is provided to automate the Git workflow:

|**Action**|**Command**|**Purpose**|
|---|---|---|
|**Make changes**|Edit content/theme files|Prepare files for publishing.|
|**Publish**|`./deploy.sh "Your commit message"`|Runs `git add .`, `git commit`, and `git push origin main`.|

The pipeline takes over immediately after the push, handling the Hugo build and the `rsync` file transfer to the VPS.

---

## Troubleshooting

- **Images Not Displaying:** Ensure images are placed in a **Page Bundle** (a directory containing an `index.md` file) alongside the content file. Use the simple relative path in the markdown link (e.g., `![Alt Text](./image.png)`).
- **Deployment Failure:** Check the GitHub Actions logs. If the error is **"Permission denied"**, the `VPS_WEB_DEPLOY_KEY` secret is likely incorrect or improperly formatted (ensure it includes the `-----BEGIN` and `-----END` lines).

## License

This project is licensed under the MIT License.
- The source code and website configuration are covered by the main LICENSE file in the repository root.
- The custom theme (duma-theme) is also licensed separately under the MIT License for easier reuse.