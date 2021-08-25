# Purser: cashier for the DataONE Bookkeeper

Purser provides payment services and a web interface for DataONE.


## Requirements

### Ingress Controller, nginx

To install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop)from Helm on Docker Desktop, use:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
```

### Simple Hello World example

Example from the Kubernetes [External IP Example](https://kubernetes.io/docs/tutorials/stateless-application/expose-external-ip-address/). 
First, deploy a simple express node app:

```
kubectl apply -f load-balancer-example.yaml
kubectl expose deployment hello-world --type=LoadBalancer --name=hello-service
```

The preceding command creates a Deployment and an associated ReplicaSet. The ReplicaSet has five Pods each of which runs the Hello World application. We then create a service to access it. Display all of the deployed objects with:

```
kubectl get pods,services,deployments
```

To delete everything, use:

```
kubectl delete services hello-service
kubectl delete deployment hello-world
```

### Simple nginx-based static site example

In this example, we build an [nginx-based static website](https://igou.io/blog/20191108-static-website-in-a-container/) with a custom image that contains static files to be served.  Start by building the image to be used based on the `Dockerfile` definition:

```
docker build -t purser-server:v1 .
kubectl apply -f purser-deployment.yaml
kubectl apply -f purser-service.yaml
kubectl apply -f purser-ingress.yaml
```

The html files are served via nginx at the advertised ingress (e.g., http://localhost/).
