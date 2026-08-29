+++
title = 'Part 2: Laying the foundations'
subtitle = "Preparing the foundations for the rebuild"
description = "Part 2 of my homelab rebuild project."
date = 2026-08-24T18:16:46+01:00
lastmod = 2026-08-24T18:16:46+01:00
tags = ["linux", "build-log"]
draft = false
+++

It has been a little while since I've been able to make any progress on my projects. A busy job, as well as personal reasons having an impact, means I've not been able to fully progress on anything. 
Things are starting to look, and feel, better now, so I am planning on trying to pick up where I left off.

With the initial Domain Configuration and IP Planning in place, I needed to start organising resources.
As I will be running many VMs on my Dell servers, it made sense to save a little time by setting up a template VM, so that I could create a full clone of this template. This ensured any basic SSH access was set up with a key already set up, each using the base environment. Once a VM is prepared, I can then modify any vCPUs, RAM and Storage space as required.

I will then log in to each one, and ensure that each VM has a static IP set up. I could do this from the router too, but in the spirit of keeping up with experience and knowledge, I like to set them on the VM directly, and can then set them with Static IP assignment in my router. This will ensure that VMs will always get the same IP address, should there be any issues with the router or the assignment on the VM.

## Setting up a static IP

As I have my VM template uses a Cloud-Init set up, the VMs are given a dynamic IP at start up. Cloud-Init dynamically manages the network configuration, and this can change on a reboot, or override static DNS settings, having an impact on internal domain resolution.

The method I use to move from the Cloud-Init to a static IP configuration does not disable the systemd-resolved, does not mask cloud-init services and does not delete /etc/resolve.conf, to avoid breaking the resolver which can break the DNS in containers.

 **Backup the netplan config**
```bash
sudo mv /etc/netplan/50-cloud-init.yaml /etc/netplan/50-cloud-init.yaml.bak
```  
&nbsp;

**Create new netplan yaml file**
```bash
sudo tee /etc/netplan/01-static.yaml << 'EOF'
network:
  version: 2
  ethernets:
    eth0:  # Replace with your interface name
      dhcp4: false
      addresses:
        - 10.x.x.x/24 # Enter the preferred IP in CIDR notation
      nameservers:
        addresses:
          # Enter the IP addresses of the DNS to use
          - 10.1.0.1
          - 10.0.0.0
      routes:
        - to: 0.0.0.0/0
          via: 10.x.x.x
EOF
```
&nbsp;

**Set correct file permissions**
```bash
sudo chmod 600 /etc/netplan/01-static.yaml
```
&nbsp;

**Test and Apply the new config**
The netplan try command will attempt to apply the configuration and warn of any issues.
If it works as expected, it will prompt to confirm the changes.
```bash
sudo netplan try
```
&nbsp;

## Setting Up OPNSense

With being able to finally swap out the ISP provided equipment for a 3rd-party router, it was time to finally set up OPNSense on the mini PC. The installation for OPNsense is pretty straight-forward, and I will provide a link to the installation guide at the end of this page. I downloaded the image file, set it up on a small USB drive, and followed the guide to get it started.

Once installed and the pc had rebooted, the first thing to do, was to set up a new user with a secure password, then disable the default admin account. I then configured the interfaces, and set them as the following:
* igc0 - WAN
* igc1 - LAN
* igc2 - OPT1
* igc3 - OPT2

WAN is the connection to the internet, so this is set up to get a dynamic IP from my service provider.
LAN is set up with a static IP so my router will always have the same IP.
OPT1 and OPT2 are currently set with no IP and not active, until I can get hold of some smart/managed switches, and configure the VLANs fully.

### General settings

Once I verified OPNsense was getting an IP from my ISP, and I could connect another device and get a valid IP address, I logged into the router with the new user I set up. I then went through the general settings, setting up the hostname, domain, timezone and theme.

I selected to prefer IPv4 over IPv6 and set up the preferred DNS servers. The primary pointing to a local DNS server, then the next to Cloudflare.

### Dnsmasq DNS & DHCP 
For the DHCP and DNS forwarder, I configured the Dnsmasq DNS & DHCP service.  

**General**
* Enabled: Checked
* Interface: LAN, OPT1, OPT2
* Query DNS servers sequentially: Checked
* DHCP FQDN: Checked
* DHCP default domain: dumalabs.uk
* DHCP register firewall rules: Checked
* Router advertisements: Checked

**Hosts**  
Here I set up static IP assignments to some specific devices

**DHCP ranges**  
For now, I only require one DHCP range, so I set up a range on the LAN interface, and set my start and end addresses.  
All other settings left as default.

**DHCP options**  
I set up a DCHP option to align with what my DNS server would be set up with, with the following options.  
* Interface: Any
* Type: Set
* Option: dns-server[6]
* Option6: None
* Tag: Nothing Selected
* Value: 10.1.0.1
* Force: Unchecked
* Description: Technitium DNS

Now that OPNsense is set up and all my devices connected and working as expected, it was time to move on to the DNS server and my DDNS updaters.


## References
* [Use Proxmox Cloud-Init to Deploy Your Virtual Machines](https://www.youtube.com/watch?v=Kv6-_--y5CM)  
* [OPNsense](https://opnsense.org/)  
* [OPNSense Installation](https://docs.opnsense.org/manual/install.html)
