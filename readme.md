# **KDD**

## **Descripción**

"KDD" es una aplicación de videollamadas diseñada para ofrecer una experiencia de videoconferencia con la mejor calidad posible en audio y video. Está diseñada para superar a otras aplicaciones mediante características avanzadas como ajustes de volumen individuales, filtros de video en tiempo real y personalización del HUD. Por ejemplo, un grupo de trabajo remoto puede aprovechar la funcionalidad de ajuste de volumen para enfocarse en el orador principal, mientras que otros miembros tienen su volumen reducido.

## **Características**

- **Videollamadas con Alta Calidad**: Soporte para resoluciones HD y optimización de audio con el códec Opus.
- **Ajuste de Volumen por Participante**: Ajusta el volumen de cada participante de forma independiente para mayor control.
- **Guardado de Chats**: Los chats de cada llamada se guardan automáticamente y se pueden exportar en formatos PDF o de texto.
- **Llamadas Grupales**: Crea y gestiona grupos para hacer llamadas grupales fácilmente y de forma recurrente.
- **Invitaciones en Tiempo Real**: Invita a nuevos participantes mediante notificaciones de chat, email o SMS.
- **Filtros de Video y Fondos Virtuales**: Personaliza tu fondo y aplica filtros en tiempo real para una experiencia visual mejorada.
- **Personalización del HUD y Perfil**: Personaliza la interfaz de usuario y tu perfil para adaptarlo a tus preferencias.
- **Multiplataforma**: Disponible en versiones para web, escritorio (Electron) y dispositivos móviles (React Native).

## **Tecnologías Utilizadas**

- **Frontend**: React.js, Redux, WebRTC, CSS-in-JS (Styled Components).
- **Backend**: Node.js con Express (posible alternativa: Django), Socket.io para mensajes en tiempo real.
- **Infraestructura de Medios**: Mediasoup o Jitsi Videobridge como SFU, servidores TURN/STUN con Coturn.
- **Base de Datos**: PostgreSQL o MongoDB.
- **Seguridad**: Autenticación mediante JSON Web Token (JWT), cifrado SRTP para audio y video.

## **Requisitos del Sistema**

### **Servidor**

- **Node.js**: v18 o superior.
- **Docker**: Para servicios como Redis y Coturn.
- **Ubuntu 20.04** o superior para el servidor.

### **Cliente**

- **Navegador**: Última versión de Chrome, Firefox o Edge.
- **Móvil**: Android 8+ o iOS 13+.

## **Instalación**

### **Backend**

1. **Clonar el Repositorio**:

   ```bash
   git clone https://github.com/user/KDD.git
   cd KDD/backend
   ```
2. **Instalar Dependencias**:

   ```bash
   npm install
   ```
3. **Configurar Variables de Entorno**:
   Crea un archivo `.env` con las siguientes variables:

   - `JWT_SECRET`: Clave secreta para autenticación.
   - `DB_URL`: URL de la base de datos.
   - `TURN_URL`: URL del servidor TURN.
4. **Iniciar el Servidor**:

   ```bash
   npm start
   ```

### **Frontend**

1. **Instalar Dependencias**:

   ```bash
   cd KDD/frontend
   npm install
   ```
2. **Iniciar la Aplicación**:

   ```bash
   npm start
   ```

### **Servidor TURN**

1. **Instalar Coturn**:

   ```bash
   sudo apt-get install coturn
   ```
2. **Configuración**:
   Edita `/etc/turnserver.conf` y añade una configuración básica como:

   ```conf
   listening-port=3478
   realm=example.com
   fingerprint
   use-auth-secret
   static-auth-secret=your_secret_key
   lt-cred-mech
   ```

## **Uso**

### **Creación de Grupos y Llamadas Grupales**

Los usuarios pueden crear grupos desde la interfaz principal, enviar invitaciones a miembros existentes y gestionar reuniones recurrentes fácilmente.

### **Ajuste de Volumen**

En la ventana de llamada, haz clic en el nombre del participante para mostrar y ajustar su control de volumen.

### **Aplicar Filtros y Fondos Virtuales**

Selecciona "Filtros de Video" en la barra de herramientas de la llamada para activar efectos visuales y fondos virtuales.

### **Exportar Chats**

Al final de una llamada, selecciona "Exportar Chat" para guardar el historial de conversación como un archivo PDF o de texto.

## **Rutas del API**

- **`POST /users/signup`**: Registro de nuevos usuarios. **Parámetros**: `email`, `password`, `nombre`.
- **`POST /users/login`**: Inicio de sesión de usuarios existentes. **Respuesta**: JWT.
- **`GET /groups/`**: Obtiene los grupos del usuario. **Respuesta**: JSON con la lista de grupos.
- **`POST /calls/join`**: Únete a una llamada. **Parámetros**: `callId`, `userId`.

## **Seguridad**

- **JWT**: Autenticación segura para todos los endpoints.
- **Cifrado SRTP**: Garantiza la privacidad de las llamadas al cifrar el tráfico de audio y video.
- **Protección de Datos**: Se recomienda implementar políticas de protección de datos y cumplir con normativas como GDPR.

## **Pruebas y Optimización**

- **Pruebas Unitarias**: Realizadas con frameworks como Jest para el backend.
- **Pruebas de Integración**: Para validar la funcionalidad completa de los módulos interconectados.
- **Optimización de Recursos**: Se monitorean los logs y el rendimiento del servidor en producción con herramientas como PM2 y New Relic.

## **Despliegue**

- **Configuración**: Desplegar en servidores con NGINX configurado para servir aplicaciones y gestionar tráfico.
- **Seguridad**: Implementar SSL para conexiones seguras.
- **Monitoreo**: Configurar monitoreo de la aplicación con Prometheus y Grafana.
