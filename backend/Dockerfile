# Imagen de python que uso, slim porque es más ligera
FROM python:3.11-slim

# Evita archivos .pyc y buffer de stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Paquetes del sistema necesarios para compilar psycopg2 y conectar a Postgres
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev curl && \
    rm -rf /var/lib/apt/lists/*

# Crea usuario no-root por seguridad
RUN useradd -m appuser
WORKDIR /app


# Instala dependencias primero (aprovecha caché de Docker)
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código del backend
COPY app.py /app/app.py

# Expone el puerto interno donde correrá Flask/Gunicorn
EXPOSE 5000

# Corre como usuario no-root
USER appuser

# Comando para ejecutar la aplicación Flask
CMD ["python", "app.py"]