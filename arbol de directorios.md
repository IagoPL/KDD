# Árbol de directorios

```
KDD/
├── src/
│   ├── core/                         # Núcleo del dominio y lógica de negocio
│   │   ├── entities/                 # Entidades del dominio
│   │   │   ├── User.js
│   │   │   ├── Group.js
│   │   │   └── Call.js
│   │   ├── use-cases/                # Casos de uso que coordinan la lógica de la aplicación
│   │   │   ├── CreateUser.js
│   │   │   ├── CreateGroup.js
│   │   │   ├── JoinCall.js
│   │   │   └── AdjustVolume.js
│   │   └── interfaces/               # Interfaces para conectar con infraestructura y adaptadores
│   │       ├── UserRepository.js
│   │       ├── GroupRepository.js
│   │       └── CallRepository.js
│   │
│   ├── adapters/                     # Adaptadores de entrada y salida de datos
│   │   ├── controllers/              # Controladores para la entrada (interfaz de usuario)
│   │   │   ├── UserController.js
│   │   │   ├── GroupController.js
│   │   │   └── CallController.js
│   │   ├── gateways/                 # Gateways para servicios externos (bases de datos, APIs)
│   │   │   ├── CallGateway.js
│   │   │   └── MessagingGateway.js
│   │   └── presenters/               # Presentadores para transformar datos para la interfaz
│   │       ├── UserPresenter.js
│   │       ├── GroupPresenter.js
│   │       └── CallPresenter.js
│   │
│   ├── infrastructure/               # Implementaciones específicas de infraestructura
│   │   ├── db/                       # Implementaciones de base de datos
│   │   │   ├── MongoDBUserRepository.js
│   │   │   ├── MongoDBGroupRepository.js
│   │   │   └── MongoDBCallRepository.js
│   │   ├── services/                 # Servicios externos e infraestructura adicional
│   │   │   ├── JWTAuthService.js
│   │   │   └── CoturnService.js
│   │   └── web/                      # Configuración de servidor y middleware web
│   │       ├── server.js
│   │       └── middleware/
│   │           ├── authMiddleware.js
│   │           └── errorHandler.js
│   │
│   ├── frontend/                     # Aplicación frontend en React (opcional)
│   │   ├── components/               # Componentes reutilizables de UI
│   │   ├── pages/                    # Páginas de la aplicación
│   │   ├── hooks/                    # Custom hooks de React
│   │   ├── redux/                    # Configuración de Redux y estado global
│   │   ├── utils/                    # Utilidades y funciones generales
│   │   └── App.js                    # Componente principal
│   │
│   └── app.js                        # Punto de entrada de la aplicación
│
├── tests/                            # Pruebas de la aplicación
│   ├── core/                         # Pruebas para el núcleo de negocio
│   │   ├── entities/                 # Pruebas de entidades
│   │   └── use-cases/                # Pruebas de casos de uso
│   ├── adapters/                     # Pruebas de adaptadores
│   └── infrastructure/               # Pruebas de infraestructura
│
├── docs/                             # Documentación del proyecto
│   ├── architecture.md               # Documentación de arquitectura
│   ├── api_documentation.md          # Documentación del API
│   └── installation_guide.md         # Guía de instalación
│
├── docker-compose.yml                # Configuración para Docker
├── README.md                         # Documentación general del proyecto
└── .gitignore                        # Archivos ignorados por Git
```

# Descripción de la estructura:

- **core/**: Contiene el dominio y la lógica central de negocio. Este es el corazón de la aplicación y es independiente de cualquier framework.

  - **entities/**: Contiene las clases que representan conceptos del dominio (p. ej., User, Call).
  - **use-cases/**: Casos de uso de la aplicación que contienen la lógica específica de la aplicación.
  - **interfaces/**: Interfaces que definen cómo los casos de uso y las entidades interactúan con servicios externos, bases de datos o adaptadores.
- **adapters/**: Se encarga de adaptar el mundo exterior a la aplicación y de conectar los casos de uso con la infraestructura. Aquí se incluyen:

  - **controllers/**: Controladores de las rutas que traducen las solicitudes de la interfaz de usuario en comandos de negocio.
  - **gateways/**: Adaptadores de entrada/salida que permiten la comunicación con servicios externos (como APIs).
  - **presenters/**: Transformadores de datos para formatear la respuesta que se envía al frontend.
- **infrastructure/**: Contiene implementaciones específicas y dependientes de la infraestructura, como la base de datos, servicios externos y la configuración del servidor web.

  - **db/**: Repositorios de datos con implementaciones concretas.
  - **services/**: Servicios adicionales para autenticación, comunicación, etc.
  - **web/**: Configuración de servidor y middleware (como autenticación y manejo de errores).
- **frontend/**: Contiene el frontend en React, organizado en componentes, páginas, hooks y Redux para el estado global.
- **tests/**: Estructurado en subcarpetas que reflejan la estructura del código principal, con pruebas separadas para el core, adaptadores y la infraestructura.
- **docs/**: Contiene toda la documentación relevante del proyecto, incluyendo detalles de la arquitectura, documentación de la API y guías de instalación.
