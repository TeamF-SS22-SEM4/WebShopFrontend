docker-compose -f docker-compose-linux.yml down
npm run build
docker-compose -f docker-compose-linux.yml build
docker-compose -f docker-compose-linux.yml up -d