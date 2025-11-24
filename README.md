# Tecnicatura Superior en Desarrollo de Software

## Desarrollo de Sistemas Web Back End

- 2025 | 2º Cuatrimestre | Comisión A
- Profesor: Emir Eliezer Garcia Ontiveros
- Grupo 15
- integrantes:
  - Branko Haberkon
  - Camila Lerman
  - Matías Lorenzo
  - Martín Morondo
  - Fernando Clemens

## Clínica Médica "San Fulgencio"

Proyecto de CRUD (Create, Read, Update, Delete) desarrollado con Node.js y Express.js. Incluye interfaz gráfica para consultas y manipulación de datos.

## Dependencias

- **dotenv** v17.2.3
- **express** v5.1.0
- **method-override** v3.0.0
- **mongoose**: v8.19.1
- **nodemon**: v3.1.10
- **pug** v3.0.3
- **uuid** v13.0.0

## Estructura del proyecto

```
DSWB_2A_2C25/
├── public/
│   └── assets/
│       └── styles/  (Archivos CSS estáticos)
│           ├── custom.css
│           └── reset.css
├── src/
│   ├── controllers/ (Manejan la lógica de la petición)
│   │   ├── AreasController.js
│   │   ├── EmpleadosController.js
│   │   ├── InsumosController.js
│   │   ├── PacientesController.js
│   │   └── TurnosController.js
│   ├── data/ (Datos de prueba para la inicialización)
│   │   ├── areas.json
│   │   ├── empleados.json
│   │   ├── insumos.json
│   │   ├── pacientes.json
│   │   ├── roles.json
│   │   └── turnos.json
│   ├── models/ (Definen la estructura de los datos (Mongoose Schemas))
│   │   ├── Area.js
│   │   ├── Empleado.js
│   │   ├── Insumos.js
│   │   ├── Paciente.js
│   │   └── Turno.js
│   ├── routes/ (Definen los endpoints de la API RESTful)
│   │   ├── areasRoutes.js
│   │   ├── empleadosRoutes.js
│   │   ├── insumosRoutes.js
│   │   ├── pacientesRoutes.js
│   │   ├── turnosRoutes.js
│   │   └── viewRoutes.js (Rutas para las vistas Pugjs)
│   ├── services/
│   │   └── TurnosService.js
│   └── views/ (Plantillas Pugjs para la interfaz simple)
│       ├── empleados/
│       ├── pacientes/
│       ├── turnos/
│       ├── 404.pug
│       ├── 500.pug
│       ├── home.pug
│       └── layout.pug
├── test/ (Archivos para probar los endpoints de la API)
│   ├── areas.http
│   ├── empleados.http
│   ├── insumos.http
│   ├── pacientes.http
│   └── turnos.http
├── .env (Variables de entorno)
├── .gitignore (Archivos a ignorar en Git)
├── index.js (Punto de entrada de la aplicación)
├── LICENSE
├── package-lock.json
├── package.json
└── README.md

```

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/brankohbk/DSWB_2A_2C25.git
   cd DSWB_2A_2C25
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Iniciar servidor:
   ```bash
   npm start
   ```
