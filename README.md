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

- **dotenv** v17.2.2
- **express** v5.1.0
- **method-override** v3.0.0
- **pug** v3.0.3
- **uuid** v13.0.0

## Estructura del proyecto

```
DSWB_2A_2C25/
│── public/
│   └── assets/styles/
│       └── custom.css
│       └── reset.css
│── src/
│   └── controllers/
│       └── empleadosController.js
│       └── TurnosController.js
│   └── data/
│       └── areas.json
│       └── empleados.json
│       └── insumos.json
│       └── pacientes.json
│       └── roles.json
│       └── turnos.json
│   └── models/
│       └── Empleado.js
│       └── Turno.js
│   └── routes/
│       └── empleadosRoutes.js
│       └── TurnosRouters.js
│       └── viewRoutes.js
│   └── views/
│       └── empleados/
│           └── edit.pug
│           └── list.pug
│           └── new.pug
│       └── turnos/
│           └── actualizar.pug
│           └── list.pug
│           └── new.pug
│       └── 404.pug
│       └── 500.pug
│       └── home.pug
│       └── layout.pug
│── test/
│   └── empleados.http
│   └── turnos.http
│── .gitignore
│── index.js
│── LICENSE
│── package-lock.json
│── package.json
│── README
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
