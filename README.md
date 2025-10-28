# TP Integrador Call Center
## Integrantes del Grupo
- Matías Decurgez
- Matías Ozores  
- Patricio Sarale
- Francisco Sosa Lanza  
- Ignacio Tapia

## Descripción Corta del Proyecto
El sistema gestiona la atención de clientes a través del área de soporte técnico. Cuando un cliente llama con un problema, el sistema registra la llamada, determina el área correspondiente para derivar el caso y asigna un número de reclamo y posición en la lista de espera.  

El sistema permite verificar los datos del cliente y, en caso de inconsistencias o situaciones que impidan continuar, informa el estado del caso. Los sectores derivados realizan seguimiento hasta la resolución o reprogramación del caso, manteniendo registro del estado en todo momento.

## Tecnologías y plataformas objetivo
- **Frontend:** React + Vite, TailwindCSS
- **Backend:** Java 17, Spring Boot
- **Base de datos:** PostgreSQL/MySQL (futura integración)
- **Plataforma objetivo:** Web (navegadores modernos) 


## Cómo Compilar y Ejecutar
### Frontend

```bash
cd frontend
npm install
npm run dev
```
### Backend
Para ejecutar el backend de Spring Boot, asegúrate de estar dentro de la carpeta `backend` del proyecto.

#### Windows

Si usás el wrapper de Maven incluido en el proyecto:

```cmd
cd backend
mvnw.cmd spring-boot:run
```

Si tenés Maven instalado globalmente:
```cmd
cd backend
mvn spring-boot:run
```

#### Linux / macOS

Si usás el wrapper de Maven:

```cmd
cd backend
./mvnw spring-boot:run
```

Si tenés Maven instalado globalmente:

```cmd
cd backend
mvn spring-boot:run
```

## Puertos y URLs por defecto

- **Backend (Spring Boot)**  
  - Puerto por defecto: `8080`  
  - URL base: `http://localhost:8080`  
  - Todos los endpoints del backend se acceden a través de este puerto.

- **Frontend (React + Vite)**  
  - Puerto por defecto: `5173`  
  - URL base: `http://localhost:5173`  
  - El frontend se comunica con el backend usando este puerto como cliente para las APIs.


