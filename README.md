# Purser: cashier for the DataONE Bookkeeper

Purser provides payment services and a web interface for DataONE.

- Version: 0.6.0 (pre-release)
- Repo Status: Work in Progress (WIP)

This is an experimental, untested work in progress. Use with caution.

## Requirements

### Ingress Controller, nginx

To install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop)from Helm on Docker Desktop, use:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
```

## Installation

Installation is via the helm chart, from the root of the repository directory:

```sh
helm upgrade --install -n purser purser ./helm
```

## Other helpful commands

- `helm -n purser status purser`
- `helm rollback purser 2 -n purser`
