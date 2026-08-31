+++
title = 'Part 3: Working with DNS'
subtitle = "Technitium DNS server and DDNS updaters"
description = "Setting up Technitium DNS, Cloudflare and NOIP DDNS updaters in Docker containers."
date = 2026-08-31T21:21:19+01:00
lastmod = 2026-08-31T21:21:19+01:00
tags = ["linux", "build-log", "Technitium", "DNS", "homelab"] # ["tech", "opinion"]
draft = true
+++

I have OPNsemse set up and a working internet connection, so it's time to set up the DNS server and a couple of DDNS updaters, so I can use domain names with the dynamic IP address assigned to me from my ISP.

Once I had cloned a VM from my ubuntu cloud template and set it up with a static IP address, and installed Docker, I now wanted to set up the Dynamic DNS updaters for No-IP & Cloudflare, then set up Technitium DNS.

> **INFO**: This is not a step-by-step guide, and is more an account of my process, set up and configuration, while building and configuring my homelab. There will be many commands I've run, docker and kubernetes config files. Please be aware that if you do follow this as a guide, you may run in to your own issues, based on your own configuration, and will have to troubleshoot for your situation. 
What worked for me, may not work for you. Also, some of my configurations may not work at the point, as sometimes I will enter settings in preparation of a future step making that setting viable, and working.

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

There is no shortage of options for DNS servers. There are the default options assigned by your ISP, then there are free public offerings like Cloudflare's 1.1.1.1, Quad9 9.9.9.9, and Google's 8.8.8.8 being the more common ones, but there are many advantages to having a custom DNS server.
Caching DNS queries locally can help speed up performance by resolving requests quicker, it can act as a network-wide ad-blocker, and allows to block traffic at the host, effectively restricting some devices from "phoning-home" when this is not wanted.

For my use, this also allows me to set up and route all my local domains in my homelab, so that I can easily access all my hosted services with easy to remember URLs and avoid having to memorise a number of IP addresses.

**Why Technitium?**

Like public DNS, there are also several great options for self-hosting a DNS server. I chose Technitium due to the features and options included. It can block ads like Pi-Hole, it can do DNS over TLS, DNS over HTTP, DNS over QUIC for encrypted DNS, allows SPlit-Horizon, preconfigured Allow/Block lists, as well as able to add manual entries and full configuration of Zones. Overall, it's a complete and powerful package. With that comes a little bit of a learning curve for advanced configuration, but is also easy to pick up and get started with.

### Port 53 conflicts
Before setting up Technitium, I conflict needed to be resolved before it's a conflict. Whichever network management system is in use, it's likely that port 53 is already in use.

On my VM, this is in use by systemd-resolved's stub listener, so I used the steps below. These steps should work on Ubuntu and Debian, but it's always good to check before making any changes.

First check which kernel process is using the socket.
```bash
sudo lsof -i :53
```
&nbsp;

Some guides will say to edit the `/etc/systemd/resolved.conf` directly, and some say to avoid this, as package upgrades may alter it.
I opted to not edit the file and created a separate file to disable the stub listener.

```bash
sudo mkdir -p /etc/systemd/resolved.conf.d
sudo vim /etc/systemd/resolved.conf.d/99-technitium.conf
```
&nbsp;

The following 2 lines are all I entered in this file, and then saved it.

```ini
[Resolve]
DNSStubListener=no
```
&nbsp;

Restart the service and confirm that port 53 is now free.

```bash
sudo systemctl restart systemd-resolved
systemctl is-active systemd-resolved
sudo ss -lnup | grep -q '127.0.0.53:53' && echo "stub still up" || echo "stub listener gone"
```
&nbsp;

If the command above shows the stub listener is gone, it's important to remember that `/etc/resolv.conf` is still symlinked to `stub-resolv.conf`, so this needs to be updated. Once updated, the upstream can be tested, and if it returns addresses, the host can resolve.

```
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
getent hosts registry-1.docker.io
```
&nbsp;

```shell
2600:1f18:2148:bc00:2672:ecc7:69d9:6b47 registry-1.docker.io
2600:1f18:2148:bc00:ed50:f2bb:b7f1:6296 registry-1.docker.io
2600:1f18:2148:bc02:c55c:72b:e74c:428c registry-1.docker.io
2600:1f18:2148:bc02:e0b2:afa1:bd26:2843 registry-1.docker.io
2600:1f18:2148:bc01:9767:724a:6b76:e733 registry-1.docker.io
2600:1f18:2148:bc01:b366:46a2:13e2:4c65 registry-1.docker.io
2600:1f18:2148:bc01:3ebc:5fea:5e26:4a57 registry-1.docker.io
2600:1f18:2148:bc01:fc83:9bf5:b124:43bc registry-1.docker.io
```
&nbsp;

### Configuring Docker Container 

I created a new directory on my DNS VM for Technitium, and created a config directory, so I could get easy access to the local storage, for manual TLS certificates.

```bash
mkdir -p ~/technitium/config
```
&nbsp;

Navigating into the `~/technitium` directory, I created a `compose.yaml` file and set it up with the following details. Replacing any placeholder text with my required settings.

```yaml
services:
  technitium:
    container_name: technitium
    hostname: technitium
    image: technitium/dns-server:latest
    ports:
      - "5380:5380/tcp" #DNS web console (HTTP)
      - "53443:53443/tcp" #DNS web console (HTTPS)
      - "53:53/udp" #DNS service
      - "53:53/tcp" #DNS service
      - "853:853/udp" #DNS-over-QUIC service
      - "853:853/tcp" #DNS-over-TLS service
      - "8053:8053/tcp" #DNS-over-HTTP service (use with reverse proxy)
    environment:
      - DNS_SERVER_DOMAIN={LOCAL_DOMAIN} #The primary domain name used by this DNS Server to identify itself.
      - DNS_SERVER_WEB_SERVICE_HTTPS_PORT=53443 #The TCP port number for the DNS web console over HTTPS protocol.
      - DNS_SERVER_WEB_SERVICE_ENABLE_HTTPS=true #Enables HTTPS for the DNS web console.
      - DNS_SERVER_WEB_SERVICE_USE_SELF_SIGNED_CERT=false #Disables self signed TLS certificate for the DNS web console.
      - DNS_SERVER_TLS_CERT_FILE={Path/to/local/certificate.pfx} #Custom TLS certificate file path.
      - DNS_SERVER_RECURSION=Allow #Recursion options Allow, Deny, AllowOnlyForPrivateNetworks, UseSpecifiedNetworks.
      - DNS_SERVER_RECURSION_ALLOWED_NETWORKS=10.0.0.0/8 #Comma separated list of IP addresses or network addresses to allow recursion. Valid only for `UseSpecifiedNetworks` recursion option.
      - DNS_SERVER_FORWARDERS=1.1.1.1, 9.9.9.9 #Comma separated list of forwarder addresses.
    volumes:
      - ./config:/etc/dns
    restart: unless-stopped
    sysctls:
      - net.ipv4.ip_local_port_range=1024 65000

```
&nbsp;

I started the container, and checked the logs to ensure everything was running correctly as it started.
```bash
docker compose up -d && docker compose logs -f
```
&nbsp;

When Technitium was running, I logged in with the default admin account, created a new admin level user, and checked I could log in and edit the configuration, before disabling the default admin account.

I host some internal, and external, services using the same domain, so to make sure I can access the external domains from my network, once I had set up the domain zones, I needed to set up Split Horizon. Technitium has its own little 'App Store' included, and in here there is a Split Horizon app that allows creating APP records in primary and forwarder zones that can return a different set of A or AAAA records, or CNAME record for clients querying over networks.

1. Install the Split Horizon App
    1. Log in to the Technitium DNS Server web dashboard.
    2. From the left sidebar, select Apps.
    3. Open the App Store.
    4. Locate the Split Horizon app.
    5. Click Install.
    Once installed, the app becomes available for DNS records.
2. Create a DNS Zone
    1. Navigate to Zones.
    2. Click Add Zone.
    3. Enter your domain name (for example, example.com).
    4. Select Primary Zone as the zone type.
    5. Click Add.
    The authoritative DNS zone is now ready for configuration.
3. Configure Split Horizon Records
    1. Under Zones, click Edit next to your domain.
    2. Select Add Record.
    3. Set the record Type to APP.
    4. For Name, enter either:
        - @ for the root domain,
        - \* for a domain wildcard,
        - a subdomain such as www, jellyfin, or immich.
    5. In the App Name / URL field, select Split Horizon.
    6. There is then a JSON template that needs to be edited to define which client subnets should receive which IP addresses.

```json
{
  "10.0.0.0/8": ["xxx.xxx.xxx.xxx"], 
  "default": ["xxx.xxx.xxx.xxx"] 
}
```

## References
- [No IP](https://www.noip.com/)
- [No-IP Linux DUC for Docker](https://github.com/noipcom/linux-update-client-docker/pkgs/container/noip-duc)
- [Cloudflare](https://www.cloudflare.com/en-gb/)
- [Dynamic DNS Updates with Cloudflare](https://github.com/mxmlndml/cloudflare-dynamic-dns)
- [Technitium DNS Server](https://technitium.com/dns/)
- [Technitium Docker Image](https://hub.docker.com/r/technitium/dns-server)
