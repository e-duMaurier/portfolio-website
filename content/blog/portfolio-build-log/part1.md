+++
title = 'Portfolio Build Log: Part 1'
subtitle = "Tech Stack & Dev VM Setup"
description = "Portfolio Build Log: Defining the Tech Stack and Building the Ubuntu Dev VM"
date = 2025-10-26T16:43:42Z
lastmod = 2025-10-26T16:43:42Z
categories = ["blog", "hugo"]
tags = ["potfolio", "build-log"]
draft = false
+++

**Every enthusiast needs a home online, and this is how I built mine.**

My portfolio website began as a simple idea, born while I was following the [Level Effect](https://leveleffect.com) SOC100 course. At first, I just needed a place to document my learning and keep track of my cyber-security journey. From that simple starting point, it’s grown into so much more. I see this site as my online extension—a space to showcase my certifications, share projects, connect with others, and document all my passions. This includes sharing my photography, content for TTRPGs, personal blog posts, and my overall journey as a technology enthusiast and open-source advocate.

---

## 1. The Technology Stack: What I Chose

I wanted a setup that was simple, efficient, and easy to maintain. Here is the breakdown of what I chose and my reasoning:

### Web Server & Version Control

To build the site, I went with Hugo, a Static Site Generator. I found that this would keep things simple, secure, and requires very little maintenance once set up.

For version control, I use Git and host my repositories on GitHub. Now, why did I choose GitHub, over the open-source GitLab, especially when I consider myself an open-source enthusiast?  I am slowly moving all of my projects to GitLab, but for this project, I decided on GitHub because it was the only CI/CD process I had prior experience setting up, a key factor for a smooth deployment in the way that I was aiming for. 
Eventually, once I have had more experience with setting up and configuring runners and pipelines, in GitLab, I do intend to move this over in the future.

To make updating the blog as smooth as possible, I also wrote a Bash script and set up a CI/CD pipeline with GitHub Actions. This means I only have to push the update from my computer, and GitHub takes care of deploying the changes to the VPS.

### Custom Domain Name & Hosting

I already had a personalised domain name that I used for hosting my Foundry VTT games, and it made sense to also use this for my portfolio, and give it a more professional feel.

For hosting, I chose a Virtual Private Server (VPS) running Ubuntu 24.04. I decided this was the best route because a VPS allows me to run other applications and services (like a test Docker container) as needed, giving me maximum control and flexibility.

---

## 2. My Development Setup

My everyday personal computer runs Arch Linux, which is my home base for all my work.

However, since my live site is hosted on a VPS running Ubuntu, I chose to use a Virtual Machine (VM) running a minimal Ubuntu Server cloud setup as my dedicated development environment. This allows me to be more confident in that whatever works in my VM will work flawlessly on the live server, and diagnosing and resolving any potential issues could be made easier, knowing they're set up with the same distributions.

I already had my portfolio up and running. but I made the decision to rebuild the entire project from scratch in this new environment. This ensures I can accurately document every single step for this build log.

This investment in starting with a clean slate, while has a lot to do at the start, is what I feel makes the minimal effort required later for updates a great trade-off.

---

## 3. Configuring the Ubuntu Dev VM: The Prerequisites

Since I started with a minimal VM install, I needed to get all the core tools in place, and whenever I set up any new VM, I always like to make sure that the installation is update, before I start with installing, or configuring anything.

```bash
sudo apt update && sudo apt upgrade -y
```

> **Note:** You'll notice I use `sudo` (SuperUser Do) for system-level commands like updating repositories (`apt update`) or installing software (`apt install`). This is because these commands affect files and directories outside of my personal `$HOME` directory. My normal user account doesn't have the necessary permissions to make these changes. I don't need `sudo` when I'm working with files inside my home directory, but for any system-wide changes, it's essential.

### Essential Tools

Since I chose a minimal Ubuntu Server cloud setup, I didn't have any graphical interface or fancy text editors. I installed my preferred editing tools and terminal utilities.

In most cases, these would already be installed, but because I went for a minimised Ubuntu Cloud install for my VM, I thought it wise to make sure that I had the basic tools installed.

```bash
sudo apt install nano vim curl wget -y
```

### Generating and Configuring SSH Keys

I wanted to ensure my development environment was secure and ready for automated deployment, so the very first thing I did was generate an SSH key for securely communicating with GitHub.

From the terminal, I used `ssh-keygen` to create the keys:

```bash
ssh-keygen -t ed25519 -C "devbox-git"
```

> **Note:** While the prompt suggested the standard name of `id_ed25519`, I saved mine as **`gitdev`** and skipped the passphrase. I prefer different key names for different functions, and since this is a temporary link from a VM, I wanted to avoid having to enter a passphrase repeatedly.

The terminal confirmed the key was created:

```
Your identification has been saved in /home/labemma/.ssh/gitdev
Your public key has been saved in /home/labemma/.ssh/gitdev.pub
```

**Adding the Key to GitHub**  
To add the key to GitHub, I needed to get the public key information for the SSH key I had just generated.
```bash
cat ~/.ssh/gitdev.pub
```

Then I needed to log in to GitHub, to **Settings**, and then **SSH and GPG keys**, and then click on **'New SSH Key'**. I copied the public key details into the Key text box, and gave it an easy-to-identify Title, and set the Key Type to **Authentication Key**

This establishes a trust that allows my VM to push code without me needing to type a password every single time.

### Git Installation and User Config

The next step was to make sure Git was installed, so I could track all my code changes:

```bash
sudo apt install git -y
```

Before testing the connection with Git, I made sure the  `ssh-agent` was running.

```bash
eval "$(ssh-agent -s)"
```

I then configured the SSH identity, to use the dedicated SSH key (`gitdev`) for GitHub connections.
I edited the SSH config file (`vim ~/.ssh/config`) to instruct Git exactly which key to use for GitHub connections.

```ini
Host github.com
User git
Port 22
Hostname github.com
IdentityFile ~/.ssh/gitdev
TCPKeepAlive yes
IdentitiesOnly yes
```

Once the config file was saved, I could then test the connection.

```bash
ssh -T git@github.com
```

On the first connection, I accepted the security prompt, which permanently added `'github.com'` to the list of known hosts and confirmed success: `Hi e-duMaurier! You've successfully authenticated, but GitHub does not provide shell access.`

---

### Go for Hugo 

Since Hugo is built using the Go programming language, I needed to install the Go environment so the static site generator could run properly.
First, to avoid any broken installation, I ensured I removed any previous versions of Go from the system:

```bash
sudo rm -rf /usr/local/go
```

Next, I obtained the link for the current version (v1.25.3 at the time) from the Go website and downloaded the archive:

```bash
wget https://go.dev/dl/go1.25.3.linux-amd64.tar.gz
```

Once downloaded, I used `tar` to unpack and install it into the correct system location (`/usr/local`):

```bash
sudo tar -C /usr/local -xzf go1.25.3.linux-amd64.tar.gz
```

To ensure the system could execute Go commands, I had to add the Go binary path to my profile file:

```bash
export PATH=$PATH:/usr/local/go/bin
```

I applied these changes immediately without logging out by sourcing the profile, 

```bash
source ~/.profile
```

However, when logging in through SSH and a terminal emulator, this doesn't always work and I've noticed that some times I have to exit and log in again.

Finally, I confirmed the successful installation by checking the Go version, which returned `go version go1.25.3 linux/amd64`:

```bash
go version
```

---

## 4. What's Next?

With the editing tools, Git, Go, and my secure SSH keys all configured, my Ubuntu Dev VM is officially prepped and ready for action! The next step was is to install Hugo and actually create the initial project structure, and begin the theme design.

## References
- [GitHub](https://github.com/)
- [Go](https://go.dev/)