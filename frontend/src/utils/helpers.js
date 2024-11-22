// src/utils/helpers.js

/**
 * Obtiene las resoluciones de pantalla escaladas basadas en el tamaño de la pantalla del usuario.
 * Si `window` no está disponible (por ejemplo, en SSR), utiliza resoluciones por defecto.
 */
export const getScreenResolutions = () => {
    if (typeof window !== 'undefined' && window.screen) {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
  
      return [
        {
          label: `${screenWidth} x ${screenHeight} (Nativa)`,
          width: screenWidth,
          height: screenHeight,
        },
        {
          label: `HD 720p (1280 x 720)`,
          width: 1280,
          height: 720,
        },
        {
          label: `SD 480p (640 x 480)`,
          width: 640,
          height: 480,
        },
        {
          label: `LD 360p (480 x 360)`,
          width: 480,
          height: 360,
        },
      ];
    } else {
      // Si window.screen no está disponible, retorna resoluciones por defecto
      return [
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
    }
  };
  