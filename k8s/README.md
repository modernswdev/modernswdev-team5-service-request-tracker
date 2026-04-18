# How to run using Kubernetes in a GitHub Codespaces
## Run the following commands in order from the project root:
- minikube start
- eval $(minikube -p minikube docker-env)
- docker build -t service-request-tracker:local .
- kubectl apply -f k8s/namespace.yaml
- kubectl apply -f k8s/app.yaml
## Either run the commands in the "Deploy" section, or the "Ingress" section:
### Deploy:
- kubectl -n service-request-tracker-local rollout status deploy/web
- kubectl -n service-request-tracker-local port-forward svc/web 5173:5173
### Ingress:
- kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
- kubectl -n ingress-nginx wait --for=condition=ready pod -l app.kubernetes.io/component=controller --timeout=180s
- kubectl apply -f k8s/ingress.yaml
- kubectl -n service-request-tracker-local get ingress
- kubectl -n ingress-nginx port-forward service/ingress-nginx-controller 8080:80
## Do cleanup for best practice:
- kubectl delete -f k8s/ingress.yaml --ignore-not-found
- kubectl delete -f k8s/app.yaml
- kubectl delete -f k8s/namespace.yaml