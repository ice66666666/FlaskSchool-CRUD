# Dockerfile para Frontend
FROM nginx:alpine

# Copiar archivos fuentes
COPY . /usr/share/nginx/html/

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
