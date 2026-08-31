+++
title = 'Part 3: Working with DNS'
subtitle = "Technitium DNS server and DDNS updaters"
description = "Setting up Technitium DNS, Cloudflare and NOIP DDNS updaters in Docker containers."
date = 2026-08-29T20:28:19+01:00
lastmod = 2026-08-29T20:28:19+01:00
tags = ["linux", "build-log"] # ["tech", "opinion"]
draft = true
+++

I have OPNsemse set up and a working internet connection, so it's time to set up the DNS server and a couple of DDNS updaters, so I can use domain names with the dynamic IP address assigned to me from my ISP.

Once I had cloned a VM from my ubuntu cloud template and set it up with a static IP address, and installed Docker, I now wanted to set up the Dynamic DNS updaters for No-IP & Cloudflare, then set up Technitium DNS.

## Setting Up Dynamic DNS updaters

### No-IP
I've been using No-IP for a free Dynamic DNS for a very long time, and while I don't really need it at the moment, I keep it active, should I ever need to use it. After all, it's not costing me anything, except about 1 minute of time every month to confirm I want to keep it active, by clicking on a link.

No-IP does have a dynamic update client for Linux, Windows and MacOS, but I set up DDNS Keys within my account management and used a Docker image, so that I can check and monitor all my DDNS updaters from one place.

Different DDNS services will have their own methods, but with the DDNS Key set up, these are automatically generated account credentials for the device or update client, offering different credentials from my account login, and I can update my login details without needing to configure any clients.

With my DDNS Key details gathered, I used SSH to log into my DNS server VM, and set up a directory for my update clients.

First I needed a `.env` file to store my credentials, so these can be kept isolated from my compose file, replacing the placeholder values with my details.

```env
NOIP_USERNAME={DDNS_KEY_USERNAME}
NOIP_PASSWORD={DDNS_KEY_PASSWORD}
NOIP_HOSTNAMES={HOSTNAME}
```
&nbsp;

I then created a `compose.yaml` file and entered in the following details.

```yaml
services:
  noip-ddns:
    container_name: noip-ddns
    image: ghcr.io/noipcom/noip-duc:latest
    env_file: [.env]
    restart: always
```
&nbsp;

After saving the file, I checked it ran and didn't generate any errors in the logs.
```bash
docker compose up -d && docker compose logs -f
```
&nbsp;

With everything working correctly, I could now look at setting up a Cloudflare updater.

### Cloudflare

Similar to No-IP, I needed to log into my Cloudflare dashboard and set up a Cloudflare API token for my zone, with `Zone Settings:Read`, `Zone:Read` and `DNS:Edit permissions`.

I then edited the `.env` file and added the details to the file.
```env
DOMAIN_NAMES={CF_DOMAIN_NAME(S)}
ZONE_ID={CF_ZONE_ID}
API_KEY={CF_DOMAIN_API_KEY}

```
&nbsp;

Then I needed to edit the Docker compose file to add the Cloudflare updater.
```yaml
  cloudflare-ddns:
    container_name: cf-ddns
    image: mxmlndml/cloudflare-dynamic-dns
    restart: always
    env_file: [.env]
```
&nbsp;

Once the files are saved, I started the container.

```bash
docker compose up cloudflare-ddns
```
&nbsp;

Once both update clients where running, I checked in both my No-IP and Cloudflare dashboards, and verified the domains had updated, and showing my current public IP address, assigned by my ISP.

## Setting Up Technitium DNS


## References
- [No IP](https://www.noip.com/)
- [No-IP Linux DUC for Docker](https://github.com/noipcom/linux-update-client-docker/pkgs/container/noip-duc)
- [Cloudflare](https://www.cloudflare.com/en-gb/)
- [Dynamic DNS Updates with Cloudflare](https://github.com/mxmlndml/cloudflare-dynamic-dns)
- [Technitium DNS Server](https://technitium.com/dns/)
