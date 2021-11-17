FROM node:12.22.7-buster-slim as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV PUBLIC_URL /

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn run build

# Nginx wrapper to serve static files
FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]