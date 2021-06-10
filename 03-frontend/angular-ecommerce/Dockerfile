###Stage 1: Build ###
FROM node:latest AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build --prod

###Stage 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.config /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html
#COPY nginx.config /etc/nginx/conf.d/default.conf
EXPOSE 80