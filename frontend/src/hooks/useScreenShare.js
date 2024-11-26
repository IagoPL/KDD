import { useState } from 'react';

const useScreenShare = (peerConnection, screenVideoRef) => {
  const [screenStream, setScreenStream] = useState(null);

  const startScreenShare = async ({ width, height, frameRate }) => {
    try {
      const constraints = {
        video: {
          cursor: 'always',
          width: width || 1280,
          height: height || 720,
          frameRate: frameRate || 30,
        },
      };

      const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      console.log('Stream de pantalla compartida obtenido:', displayStream);

      setScreenStream(displayStream);

      // Reemplazar pista de video en el peerConnection
      const videoTrack = displayStream.getVideoTracks()[0];
      const sender = peerConnection.getSenders().find(
        (s) => s.track?.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      } else {
        peerConnection.addTrack(videoTrack, displayStream);
      }

      // Mostrar la pantalla compartida en el elemento video
      if (screenVideoRef?.current) {
        screenVideoRef.current.srcObject = displayStream;
        screenVideoRef.current.play(); // Forzar reproducción
      }
    } catch (error) {
      console.error('Error al iniciar pantalla compartida:', error);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }
    if (screenVideoRef?.current) {
      screenVideoRef.current.srcObject = null;
    }
  };

  const updateScreenShareConstraints = async (newResolution, newFPS) => {
    if (screenStream) {
      const videoTrack = screenStream.getVideoTracks()[0];
      try {
        await videoTrack.applyConstraints({
          width: newResolution.width,
          height: newResolution.height,
          frameRate: newFPS,
        });
        console.log('Restricciones de pantalla compartida actualizadas.');
      } catch (error) {
        console.error('Error al actualizar restricciones:', error);
      }
    }
  };

  return { screenStream, startScreenShare, stopScreenShare, updateScreenShareConstraints };
};

export default useScreenShare;
