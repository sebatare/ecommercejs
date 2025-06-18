# Construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Producción: solo servimos los archivos (si quieres servir desde un contenedor)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
