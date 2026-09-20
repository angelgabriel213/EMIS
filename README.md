# EMIS — Gestión de productos y proveedores

Aplicación web desarrollada con Java y Spring Boot para gestionar productos y proveedores mediante una API REST y una interfaz web.

## Tecnologías

- Java 17
- Spring Boot 3.3.4
- Spring Web
- Spring Data JPA
- MySQL
- PostgreSQL (driver disponible en el proyecto)
- Thymeleaf
- Lombok
- Maven
- JUnit / Spring Boot Test

## Funcionalidades

- Gestión de productos.
- Gestión de proveedores.
- Relación entre productos y proveedores mediante JPA.
- Operaciones CRUD para productos.
- Operaciones CRUD para proveedores.
- Consulta de productos por proveedor.
- Actualización del estado de productos.
- Interfaz web con recursos estáticos y plantillas.

## Arquitectura

```text
src/main/java/com/example/EMIS/
├── controller/   # Endpoints REST
├── Service/      # Lógica de negocio
├── repository/   # Acceso a datos con Spring Data JPA
├── model/        # Entidades JPA
└── config/       # Configuración

src/main/resources/
├── templates/    # Vistas
└── static/       # CSS, JavaScript e imágenes
```

## API principal

### Productos

```http
GET    /productos
GET    /productos/{id}
GET    /productos/proveedor/{proveedorId}
POST   /productos
POST   /productos/registrar/{proveedorId}
PUT    /productos/{id}
PUT    /productos/{id}/cambiarEstado
DELETE /productos/{id}
```

### Proveedores

```http
GET    /proveedores
GET    /proveedores/{id}
POST   /proveedores/proveedor
PUT    /proveedores/{id}
DELETE /proveedores/{id}
```

## Configuración de base de datos

La conexión se configura mediante variables de entorno para evitar guardar credenciales directamente en el repositorio.

Variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
```

Ejemplo para MySQL:

```text
DB_URL=jdbc:mysql://localhost:3306/emis
DB_USERNAME=root
DB_PASSWORD=tu_password
```

## Ejecución

Windows:

```bash
mvnw.cmd spring-boot:run
```

Linux/macOS:

```bash
./mvnw spring-boot:run
```

También puede ejecutarse desde un IDE compatible con Spring Boot.

## Pruebas

El proyecto incluye una prueba de carga del contexto de Spring Boot.

```bash
mvnw.cmd test
```

## Objetivo técnico

Este proyecto demuestra experiencia práctica con Java, Spring Boot, Spring Data JPA, relaciones entre entidades, APIs REST, operaciones CRUD y conexión con bases de datos relacionales.
