+++
title = 'Part 2: Laying the foundations'
subtitle = "Preparing the foundations for the rebuild"
description = "Part 2 of my homelab rebuild project."
date = 2026-08-24T18:16:46+01:00
lastmod = 2026-08-24T18:16:46+01:00
tags = ["linux", "build-log"]
draft = true
+++


It has been a little while since I've been able to make any progress on my projects. A busy job, as well as personal reasons having an impact, means I've not been able to fully progress on anything. 
Things are starting to look, and feel, better now, so I am planning on trying to pick up where I left off.

With the initial Domain Configuration and IP Planning in place, I needed to start organising resources.
As I will be running many VMs on my Dell servers, it made sense to save a little time by setting up a template VM, so that I could create a full clone of this template. This ensured any basic SSH access was set up with a key already set up, each using the base environment. Once a VM is prepared, I can then modify any vCPUs, RAM and Storage space as required.

I will then log in to each one, and ensure that each VM has a static IP set up. I could do this from the router too, but in the spirit of keeping up with experience and knowledge, I like to set them on the VM directly, and can then set them with Static IP assignment in my router. This will ensure that VMs will always get the same IP address, should there be any issues with the router or the assignment on the VM.

## Setting up a static IP

As I have my VM template uses a Cloud-Init set up, the VMs are given a dynamic IP at start up. Cloud-Init dynamically manages the network configuration, and this can change on a reboot, or override static DNS settings, having an impact on internal domain resolution.

The method I use to move from the Cloud-Init to a static IP configuration does not disable the systemd-resolved, does not mask cloud-init services and does not delete /etc/resolve.conf, to avoid breaking the resolver which can break the DNS in containers.

**Backup the netplan config
```bash
sudo mv /etc/netplan/50-cloud-init.yaml /etc/netplan/50-cloud-init.yaml.bak
```
