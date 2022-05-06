FROM node:16.15.0-alpine3.15 AS dependenciesInstalled
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install


# seperate image needed because the client generator requires a JVM
FROM timbru31/java-node:11 AS clientBuilder
WORKDIR /app
COPY --from=dependenciesInstalled /app/ /app/
COPY ./src/resources/openapi-def.yml /app/src/resources/openapi-def.yml
RUN npm run generate-client


FROM node:16.15.0-alpine3.15 AS builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY --from=clientBuilder /app/ /app/
COPY . .
RUN npm run test -- --watchAll=false
# Build the app
RUN npm run build


# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]