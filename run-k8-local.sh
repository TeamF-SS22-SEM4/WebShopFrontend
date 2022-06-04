eval $(minikube docker-env)

kubectl delete -f ./kubernetes/local/web-frontend-deployment.yml

npm run build

docker build -f Dockerfile-kubernetes -t team-f-web-shop-tomify .

kubectl apply -f ./kubernetes/local/web-frontend-deployment.yml

minikube service web-shop-tomify --url
