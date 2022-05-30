kubectl delete -f ./kubernetes/web-frontend-deployment.yml

npm run build

docker build -f Dockerfile-kubernetes -t team-f-web-shop-tomify .

kubectl apply -f ./kubernetes/web-frontend-deployment.yml

# On Windows get url of this service
#minikube service web-shop-tomify --url
