eval $(minikube docker-env)
minikube addons enable ingress

kubectl delete -f ./kubernetes/nginx-ingress.yml
kubectl delete -f ./kubernetes/web-frontend-deployment.yml

npm run build

docker build -f Dockerfile-kubernetes -t team-f-web-shop-tomify .

kubectl apply -f ./kubernetes/web-frontend-deployment.yml
kubectl apply -f ./kubernetes/nginx-ingress.yml
