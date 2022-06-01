npm run build
docker build -f Dockerfile-kubernetes -t team-f-web-shop-tomify .
kubectl rollout restart deployment/web-shop-tomify