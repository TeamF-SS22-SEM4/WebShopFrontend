docker-compose -f docker-compose.local.yml down
npm run build
docker-compose -f docker-compose.local.yml build
docker-compose -f docker-compose.local.yml up -d