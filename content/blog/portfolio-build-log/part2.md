+++
title = 'Portfolio Build Log: Part 2'
subtitle = "Hugo Install & Project Creation"
description = "Portfolio Build Log: Installing Hugo and Creating the Core Project Structure"
date = 2025-10-26T17:00:13Z
lastmod = 2025-10-26T17:00:13Z
categories = ["blog", "hugo"]
tags = ["potfolio", "build-log"]
draft = false
+++

Hugo is available in three editions: **standard**, **extended**, and **extended/deploy**. While the standard is enough for core functionality, the deploy version is the same as the extended edition but includes extras for deploying directly to online storage like AWS S3 or Google Cloud Storage buckets.

I chose Hugo because it is lightweight, but powerful. It is fast and flexible in its modules and frameworks, and it includes an embedded web server that can be used to quickly start and stop the site when reviewing changes.

While the initial configuration of a new Hugo site may take a little work, once it is set, new content can be quickly added using Markdown. As I use a range of note-taking apps like Notesnook and Obsidian, it makes it very easy to create content directly from notes I’ve already created. When Hugo builds the site, it then turns all this Markdown content into ready-to-host web pages.

With all that, plus a great user base, a wide range of content, and modules to help build bigger and better sites, the most compelling feature of Hugo that moved it higher up my list is that it is **free and open-source.**

---

### 1. Installing Hugo

There are several options for installing Hugo, especially on Linux. There are prebuilt binaries, package managers like Snap or Homebrew, repository packages, and it can be built from source.

> Hugo provides a helpful [comparison of the different editions](https://gohugo.io/installation/linux/#editions) on their site.

I opted for a prebuilt binary of the extended edition.

From the Hugo GitHub releases, I found the latest version at the time of writing, `v0.151.2`, and downloaded the `hugo_extended_0.151.2_linux-amd64.tar.gz` file directly to my VM:

```bash
wget https://github.com/gohugoio/hugo/releases/download/v0.151.2/hugo_extended_0.151.2_linux-amd64.tar.gz
```

Similar to the process with Go, I first made sure that I had no current Hugo installation:

```bash
sudo rm -rf /usr/local/hugo
```

Then I extracted the contents of the compressed file to my home directory (`~/`):

```bash
sudo tar -C ~/ -xzf hugo_extended_0.151.2_linux-amd64.tar.gz
```

This extracted the file contents, a Hugo file, a `LICENSE`, and `README.md` files. I then moved just the `hugo` executable to the `/usr/bin` directory:

```bash
sudo mv ~/hugo /usr/bin
```

I checked the path to ensure the system could find the file:

```bash
which hugo
```

```
/usr/bin/hugo
```

Finally, I checked the version to confirm the installation was complete and ready to use:

```bash
hugo version
```

The version was confirmed:

```
hugo v0.151.2-a3574f6f70c9b272e3de53cf976018ee3ff16fd1+extended linux/amd64 BuildDate=2025-10-16T16:52:34Z VendorInfo=gohugoio
```

---

### 2. Creating the Core Project Structure

Hugo might lack the fancy GUIs a lot of other applications have, but for a static site generator, it is very simple in its functions. The advantage of a command-line based tool is that single commands can offer multiple functions. The `new` command in Hugo can be used to create new content, themes, or, in this case, a new site.

I started with creating a new site and named it **`portfolio`**:

```bash
hugo new site portfolio
```

This created the site and provided a nice summary of next steps:

```
Congratulations! Your new Hugo site was created in /home/labemma/portfolio.

Just a few more steps...

1. Change the current directory to /home/labemma/portfolio.
2. Create or install a theme:
   - Create a new theme with the command "hugo new theme <THEMENAME>"
   - Or, install a theme from https://themes.gohugo.io/
3. Edit hugo.toml, setting the "theme" property to the theme name.
4. Create new content with the command "hugo new content <SECTIONNAME>/<FILENAME>.<FORMAT>".
5. Start the embedded web server with the command "hugo server --buildDrafts".

See documentation at https://gohugo.io/.
```

Hugo created a directory filled with pre-generated files to get started with:

```tree
~/portfolio
├── archetypes
│   └── default.md
├── assets
├── content
├── data
├── hugo.toml
├── i18n
├── layouts
├── static
└── themes
```

#### Running the Embedded Webserver

The summary suggests using the embedded webserver with the `hugo server --buildDrafts` command. Normally, I would just use `hugo server -D` and access it on `http://localhost:1313/`.

However, since I am running this on a headless VM on my network, I can't access the URL directly. To ensure I can review the changes as they happen, I need to start the server with a `bind` command, allowing me to access the webserver through the VM's IP address:

```bash
hugo server --bind 10.40.0.66 -D
```

Accessing the page in a browser at this point still results in a 'Page Not Found' message. The Hugo webserver is running, but there is nothing for it to generate yet—and for that, I needed to set a theme.

---

### 3. Choosing and Implementing the Theme

Themes in Hugo are a very versatile feature and can initially feel overwhelming. Apart from the many great free and premium themes already out there, there are several different methods of applying them, including:

1. Using `git clone`.
2. Using `git submodule`.
3. Using `git subtree`.
4. Moving the theme directory.
5. Using Hugo modules.
6. Pointing directly at the theme on GitHub.

I weighed up all these options, noting that if a theme is linked to another repository (which can happen with methods like Git submodule), any updates made by the theme creator could potentially affect my site's look and style.

### Designing the Portfolio

The Hugo site is running locally, which means I now have a solid, empty canvas on which to build. The core structure is in place, but currently, the site is rendering with Hugo’s minimal, unstyled default. Until a theme is implemented, the site is effectively empty; the web server is running, but there is no template or content to load.

I reviewed a number of community themes, looking for a simple, portfolio-focused layout. However, since it has been many years since I dabbled with HTML and CSS, I realised I would much rather give making my own minimal theme a shot. This way, I can ensure the site looks how I want it to, has only the features and options I genuinely need, and remains minimal and lightweight by intentionally skipping out on complex, unnecessary components. This will also give me a great opportunity to brush up on my front-end skills.

### Setting Up Git

With my Ubuntu VM prepped, and the Hugo site structure created, the project is finally at a stable starting point. Before starting on building a custom theme, the most critical step is to set up version control. This ensures I have an instant backup, a clean starting line, and a rollback point if (or when!) I inevitably break something.

---

### 1. Preparing the Local Git Repository

I navigated into the main project folder I created in Part 3 and initialised Git.

```bash
cd portfolio
git init
```

The `git init` command simply creates a hidden `.git` directory inside the project folder. This directory holds all the version history and tracking information, transforming a regular directory into a local repository.

---

### 2. Ignoring Unnecessary Files

Adopting a modern, efficient workflow means excluding automatically generated files from version control. I need to tell Git to ignore these directories by creating a **`.gitignore`** file.

I created and edited the file using `vim`:

```bash
vim .gitignore
```

I added the two most critical directories that Hugo generates: the final output directory and the cache directory:

```ini
# Hugo output directory (generated by 'hugo' or CI/CD pipeline)
public/

# Hugo cache
resources/
```

> **Why ignore `public/`?** The `public/` directory contains the final HTML, CSS, and assets that Hugo compiles. We don't track it because it would introduce massive amounts of noise and unnecessary commits. More importantly, using best practices means that when we set up Continuous Integration/Continuous Deployment (CI/CD) later, the deployment service (like GitHub Actions) will run the Hugo build command itself. This keeps our repository lean and clean, tracking only the source code and configuration.

---

### 3. Creating the Remote Repository on GitHub

With the local repository ready, the next step was to create a remote destination for the code. I logged into GitHub and from the dashboard, created a new, empty repository named `portfolio-website`.

I made sure to create it without a `README`, a `license`, or a `.gitignore` file. Since I was pushing the files from my local VM, keeping the remote repository completely blank prevented any potential conflicts with the first push, and I could create and add these files later.

---

### 4. The Initial Commit and Push

Now that everything was organized, it was time for the first commit.

First, I used `git add .` to stage all the source files in the current directory (including the crucial `.gitignore` file):

```bash
git add .
```

#### Troubleshooting: Setting Git Identity

As this was the first time using Git on this VM, the initial `git commit` command failed, letting me know that the Author identity was unknown:

```
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: unable to auto-detect email address (got 'labemma@devbox.(none)')
```

I ran the two configuration commands provided, entering my email address and name where required:

```bash
git config --global user.email "myemail@address.com"
git config --global user.name "My name"
```

With the Git config set, I re-ran the commit command:

```bash
git commit -m "Initial commit: Basic Hugo site structure"
```

This time I received the expected output, confirming the commit:

```
[master (root-commit) 751a327] Initial commit: Basic Hugo site structure
  3 files changed, 16 insertions(+)
  create mode 100644 .gitignore
  create mode 100644 archetypes/default.md
  create mode 100644 hugo.toml
```

Before pushing to the remote repository, I used the `git branch` command to quickly verify I was on the correct `main` branch (Git often initialises a repository with a default of `master` or `main`):

```bash
git branch -M main
```

Finally, I linked the local repository to the new remote repository on GitHub using the SH URL, which leverages the SSH key I had previously set up:

```bash
git remote add origin git@github.com:your_username/portfolio-website.git
```

I then pushed the committed files to the remote repository, setting the upstream tracking for the `main` branch:

```bash
git push -u origin main
```

A quick check of the GitHub repository confirmed that the files were safely backed up and under version control. Not all the directories showed, though, as Git does not track empty directories; these will appear automatically once I add files to them.

---

### What's Next?

The core project structure is safe, secure, and backed up on GitHub, ready for development.

The immediate next step is to start working on creating a custom theme. **Part 5** will shift focus entirely to **Creating the Custom Hugo Theme**, where I'll begin the process of translating my vision into HTML and CSS.

Looking further ahead, once the base site is functional, I plan to leverage GitHub Projects with a Kanban board to track future features, bugs, and design improvements, helping me manage the portfolio's continuous growth.

### References
- [Hugo](https://gohugo.io/)
- [Notesnook](https://notesnook.com/)
- [Obsidian](https://obsidian.md/)
- [Hugo Releases](https://github.com/gohugoio/hugo/releases)
- [Hugo Modules](https://gohugo.io/hugo-modules/use-modules/)