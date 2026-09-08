FROM nginx:stable-alpine

# Build context is the `src` folder; copy all files into nginx html dir
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
