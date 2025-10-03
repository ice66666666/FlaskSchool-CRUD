#importats y configuracion
from flask import Flask
from flask_cors import CORS  #cors para que se comunique el back con el front
from flask_migrate import Migrate
from config import config
import os #para usar variables de entorno

# Configurar base de datos
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from models import Base

# Crear la aplicación Flask
app = Flask(__name__)   

# Configurar la aplicación
config_name = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[config_name])

# Configurar CORS
CORS(app)


# Crear engine de SQLAlchemy
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

# Crear sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#configuracion de flask-migrate
migrate = Migrate(app, Base)  

#importar y register blueprints
from routes.auth import auth_bp
from routes.usuarios import alumnos_bp
from routes.profesores import profesores_bp
from routes.instituciones import instituciones_bp

app.register_blueprint(auth_bp)
app.register_blueprint(alumnos_bp)
app.register_blueprint(profesores_bp)
app.register_blueprint(instituciones_bp)


# Crear tablas si no existen
def create_tables():
    Base.metadata.create_all(bind=engine)

# Crear tablas al iniciar
create_tables()

# EJECUTAR LA APLICACIÓN
if __name__ == '__main__':
    puerto = int(os.getenv('BACKEND_PORT', 5000))
    app.run(host='0.0.0.0', port=puerto, debug=True)