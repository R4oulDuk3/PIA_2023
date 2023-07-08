# Step 1: Build the angular app in a node image
FROM node:14 as build-step
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Step 2: Serve the app from an nginx server
FROM nginx:1.21.1
COPY --from=build-step /app/dist/frontend /usr/share/nginx/html
