kubectl delete -f ./kubernetes/local/web-frontend-deployment.yml

npm run build

docker build -f Dockerfile-local -t team-f-web-shop-tomify .

kubectl apply -f ./kubernetes/local/web-frontend-deployment.yml