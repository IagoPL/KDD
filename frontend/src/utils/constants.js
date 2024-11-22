// src/utils/constants.js

// Opciones de FPS disponibles
export const fpsOptions = [15, 30, 60];

// Resoluciones predeterminadas
export const resolutions = [
  {
    label: '1920 x 1080 (Full HD)',
    width: 1920,
    height: 1080,
  },
  {
    label: '1280 x 720 (HD)',
    width: 1280,
    height: 720,
  },
  {
    label: '640 x 480 (SD)',
    width: 640,
    height: 480,
  },
  {
    label: '480 x 360 (LD)',
    width: 480,
    height: 360,
  },
];

// Configuración de servidores ICE para WebRTC
export const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  // Puedes agregar más servidores STUN/TURN aquí
];

// Opciones de constraints para getUserMedia
export const mediaConstraints = {
  audio: true,
  video: true,
};

// URL del servidor Socket.io
export const SOCKET_SERVER_URL = 'http://localhost:3000';

// Intervalo de comprobación para el monitoreo de compartir pantalla (en milisegundos)
export const SCREEN_SHARE_CHECK_INTERVAL = 500;

// Título de la aplicación
export const APP_TITLE = 'Aplicación de Videollamada';

// Otros textos y mensajes utilizados en la aplicación
export const MESSAGES = {
  micAccessError: 'Error al acceder al micrófono.',
  cameraAccessError: 'Error al acceder a la cámara.',
  screenShareError: 'Error al compartir pantalla.',
  micTestTitle: 'Prueba de Micrófono',
  micOn: 'Apagar Micrófono',
  micOff: 'Encender Micrófono',
  cameraOn: 'Apagar Cámara',
  cameraOff: 'Encender Cámara',
  screenShareStart: 'Compartir Pantalla',
  screenShareStop: 'Detener Compartir Pantalla',
};