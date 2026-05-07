# Practica1 - CRUD Pacientes y Doctores

Aplicación en Angular que consume la API:

`https://69fac43888a7af0ecca7bd80.mockapi.io/clinic-api/v1`

Endpoints usados:

- `/patients`
- `/doctors`

## 1) Crear proyecto

```bash
ng new Practica1
cd Practica1
```

## 2) Configurar entorno y HTTP

1. Definir `apiUrl` en `src/environment/environment.ts`.
2. Habilitar `provideHttpClient()` en `src/app/app.config.ts`.

## 3) Crear estructura base

- Interfaces:
  - `src/app/interfaces/patients.interface.ts`
  - `src/app/interfaces/doctors.interface.ts`
- Servicios:
  - `src/app/Servicios/patient-service.ts`
  - `src/app/Servicios/doctor-service.ts`
- Componentes:
  - `src/app/patients-component`
  - `src/app/doctors-component`

## 4) Implementar CRUD

En cada servicio:

- `getAll()` -> GET
- `create()` -> POST
- `update()` -> PUT
- `delete()` -> DELETE

En cada componente:

- Cargar datos al iniciar.
- Mostrar datos en **cartas**.
- Agregar, editar el primero, eliminar y recargar.
- Buscar por nombre.


## 5) Ejecutar proyecto

Instalar dependencias y levantar:

```bash
ng serve
```

Abrir en:

`http://localhost:4200/`


