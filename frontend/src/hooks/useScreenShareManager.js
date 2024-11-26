import { useEffect } from 'react';
import useScreenShare from './useScreenShare';

const useScreenShareManager = (
  peerConnection,
  screenVideoRef,
  selectedResolution,
  selectedFPS
) => {
  const {
    screenStream,
    startScreenShare,
    stopScreenShare,
    updateScreenShareConstraints,
  } = useScreenShare(peerConnection, screenVideoRef);

  // Actualizar restricciones de pantalla compartida
  useEffect(() => {
    if (screenStream) {
      updateScreenShareConstraints(selectedResolution, selectedFPS);
    }
  }, [selectedResolution, selectedFPS, screenStream]);

  // Asignar el stream al elemento <video>
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play(); // Forzar reproducción
    }
  }, [screenStream, screenVideoRef]);

  // Función para iniciar pantalla compartida con las restricciones actuales
  const startSharing = () => {
    startScreenShare({
      width: selectedResolution.width,
      height: selectedResolution.height,
      frameRate: selectedFPS,
    });
  };

  return {
    screenStream,
    startSharing,
    stopScreenShare,
  };
};

export default useScreenShareManager;
