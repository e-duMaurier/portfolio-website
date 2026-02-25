+++
title = 'Part 1: rm -rf homelab/'
subtitle = "Why I am resetting and rebuilding my homelab"
description = "Part 1 of a series of blog posts going through building my homelab, and the hardware, applications and services I will be using."
date = 2026-02-25T22:03:49Z
lastmod = 2026-02-25T22:03:49Z
categories = ["blog", "homelab"] # ["blogging", "general"]
tags = ["linux", "build-log"] # ["tech", "opinion"]
draft = false
+++

# Why I am rebuilding my homelab environment.

My homelab was ready for a reset. Backing up my databases, application files, and getting an overhaul. Better planning, design and configuration. While it was originally in place for getting a little practice with some applications, cyber security and infrastructure, it is now getting a fundamental reset, driven by my growing frustration with "Big Tech's" attitudes and practices.

I am sure we are all seeing the _enshitification_ happen in real-time. Over the last several years companies have removed core features and hide them behind paywalls, or forcing us into proprietary, and costly, cloud services. Adding insult to injury, using the terms and conditions to give themselves unadulterated access to our data to feed to their AI/LLMs.
We don't own what we pay for, and we pay these companies to sell our data, in one way or another.

I have had enough! I want control back. Control of my data, control of my privacy.

This reset is about being in charge of my own personal and private information, and using products and services that suit what I need, what I want, and not what some unethical, morally bankrupt, corporation and greedy CEOs want to force upon me, because they don't yet have all the money.
My push for self-hosting is about taking back my digital life, my privacy, security, and hopefully spread more awareness and knowledge that there are great free and open-source alternatives to the mainstream services.

## The Journey to Open Source

In the early 90's we got our first "PC", after having a few different home computers before that. Since then, I have used every consumer edition of Windows from Windows 3.11 up to Windows 11. A few times I dabbled with Windows NT 3 and 4, and then some Windows Server.
By the mid 90's I even tried dabbling with Linux (S.u.S.E) but didn't get far with it, so I've always been a Windows user Windows got a lot better from those early days, but more recently I think it has declined, and in my experience, it got worse.

By early 2024, I was getting more and more frustrated with Windows, so I set myself a 30 day challenge. Can I use Linux for 30 days, finding alternatives to what I was using in Windows, if there wasn't a native Linux application.
After 30 days, I found myself needing, or wanting, to log back into my Windows installation.
I still have a dual boot with Windows installed, but I genuinely can't remember the last time I logged in there now, and Linux has become my daily driver.
Even migrating from Linux Mint, which I chose purely for the desktop environment as I thought it had a similar feel to Windows, to scrapping that and moving to Arch, to force myself to learn more about the OS.

From there it was then only a short jump to wanting to self-host any applications and services that I wanted, and could independently, free from endless subscription fees, paywalls for basic features, or basic features removed.  
**Do you remember when Microsoft Word would let you auto save a document on your local hard drive, without being forced to store it in OneDrive?**

## Building Something Serious

Now, I need to take this a little more seriously. My current cyber security courses (like Level Effect's SOC100) are stressing the importance of having a structured homelab. Not just for messing around, but for documenting and showcasing real-world experience and knowledge to potential employers.

The goal of this reset is clear:

1. To ditch the proprietary junk and establish a suite of free and open-source alternatives where _I_ control the data, who sees it, and what's done with it.
2. To build something that, while obviously not “enterprise” scale, will help me further develop my skills in defending networks, identifying compromises, and properly securing services.

This blog series is going to document every step I am taking, what software and services I am using, and, most importantly, why I'm doing it.

# The Infrastructure

## Current Hardware

I've been fortunate enough over the years to get my hands on some pretty reasonable, and sometimes cheap, hardware that I will be using in my network.
The current systems are enough for me to build a well-rounded start to my network and homelab, and enough resources to run and work on my lab, and other projects.

I also have 3 current VPS solutions, where I have my [Nextcloud](https://nextcloud.com/), blog and other services hosted.  
| Hostname | Hardware | Specs | Role |
| --------- | ------------------- | ------------------------------------------------------------- | ----------------------------- |
| HAL-900D | Desktop PC | AMD 5950x (16c/32t), 64GB RAM, 3080, 8.5TB storage | Desktop PC / Daily driver |
| Monolith | TrueNAS Server | Intel i7-4790k (4c/8t), 16GB RAM, 6x2TB HDD, 8TB storage pool | Network storage |
| Excelsior | Dell PowerEdge R610 | 2x Intel Xeon E5645 (6c/12t), 48GB RAM, 2x900GB HDD | Proxmox host |
| Discovery | Dell PowerEdge R730 | 2x Intel Xeon E5-2690 v4 (14c/28t), 128GB RAM, 3x1TB HDD | Proxmox host |
| AE35 | Mini PC (TVI7309X) | Intel Celeron N5105 (4c), 8GB RAM, 240GB SSD | DNS (Technitium), Dynamic DNS |

## Domain Configuration

To help manage and use the applications I will be running in my homelab, I will be using one of my registered domain names. While I could use internal domains, I decided that using subdomains tied to my domain name, would allow me to make sure I could get some real TLS certificates, and would give me the opportunity to experiment a little with DNS.

I still intend to use an internal-only, local domain, for my SOC lab and corporate test environment.

| Domain            | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| dumalabs.uk       | Primary domain and public facing services hosted on VPS |
| infra.dumalabs.uk | Infrastructure devices and services                     |
| int.dumalabs.uk   | Internal only applications                              |
| ext.dumalabs.uk   | External/public facing apps                             |
| dumalabs.corp     | SOC lab, corporate test environment                     |

## IP Mapping

I am currently using a router provided by my ISP, which is very limited in configuration options. Due to this, VLANs are not currently incorporated, but I am planning on being able to get my infrastructure in place and set up, so when I can replace to a better router option then it will be fairly easy to add the VLANs and enhance the security and routing.

While not completely strict at the moment, I've laid out my IP planning for where I want certain devices and services. This is the guide, but as with most projects, this will evolve and change over time, depending on needs and situations.  
| VLAN ID | Purpose | CIDR | Status | Notes |
| ------- | ----------------------- | ------------- | ------- | -------------------------------------------------------------- |
| 0 | Hardware Core | 10.0.0.0/24 | Current | Router, switches, APs. ISP router. |
| 1 | Software Core | 10.1.0.0/24 | Current | Technitium DNS |
| 2 | Hypervisors & Mgmt | 10.2.0.0/24 | Current | Proxmox hosts, iDRACs. |
| 3 | Infrastructure Services | 10.3.0.0/24 | Planned | Proxies, Authentik, Logs, Dashboards. |
| 4 | Databases | 10.4.0.0/24 | Current | Dedicated DB nodes. Internal-only. |
| 5 | NAS & Storage | 10.5.0.0/24 | Current | TrueNAS, Backup Targets. |
| 10 | User/Personal Devices | 10.10.0.0/24 | Current | PCs, laptops, printers. |
| 15 | Restricted Devices | 10.15.0.0/24 | Current | Work laptops, guest Wi-Fi. Isolated. |
| 30 | Internal Services | 10.30.0.0/24 | Planned | Firefly, Paperless, Booklore, Trilium, Homepage. |
| 40 | Virtual Machines | 10.40.0.0/24 | Planned | General VMs, Docker Hosts, K8s workers. |
| 50 | External Services | 10.50.0.0/24 | Planned | External facing services. |
| 77 | Media Devices | 10.77.0.0/24 | Current | Smart TVs, consoles, streaming boxes. |
| 88 | Mobile Devices | 10.88.0.0/24 | Current | Phones, tablets. |
| 120 | Staging/Default DHCP | 10.120.0.0/24 | Current | DHCP range. Unconfigured/untrusted devices. |
| 180 | IoT & Pi Projects | 10.180.0.0/24 | Future | ESP32, sensor nodes. Highly restricted. |
| 200 | SOC Lab/Corporate Test | 10.200.0.0/24 | Future | Isolated environment for cybersecurity, malware analysis, GRC. |
| 210 | VPN/Jump Box | 10.210.0.0/24 | Future | VPN endpoints, jump hosts. |
