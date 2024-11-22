// src/hooks/useScreenShare.js

import { useState, useRef } from 'react';
import { MESSAGES, SCREEN_SHARE_CHECK_INTERVAL } from '../utils/constants';

const useScreenShare = (peerConnection, selectedResolution, selectedFPS, socket, myVideoRef) => {
  const [screenStream, setScreenStream] = useState(null);
  const screenShareCheckInterval = useRef(null);
  const animationFrameRequest = useRef(null);

  const startScreenShare = async () => {
    if (screenStream) {
      await stopScreenShare();
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          width: selectedResolution.width,
          height: selectedResolution.height,
          frameRate: selectedFPS,
        },
      });

      setScreenStream(displayStream);

      const videoTrack = displayStream.getVideoTracks()[0];
      const sender = peerConnection.getSenders().find(
        (s) => s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      } else {
        peerConnection.addTrack(videoTrack, displayStream);
      }

      // Renegociar la conexión
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', { offer: peerConnection.localDescription, from: socket.id });

      monitorScreenShare(displayStream);
    } catch (error) {
      console.error(MESSAGES.screenShareError, error);
    }
  };

  const stopScreenShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);

      // Restaurar la pista de la cámara
      if (myVideoRef.current && myVideoRef.current.srcObject) {
        const cameraStream = myVideoRef.current.srcObject;
        const cameraTrack = cameraStream.getVideoTracks()[0];
        const sender = peerConnection.getSenders().find(
          (s) => s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(cameraTrack);
        }
      }

      // Renegociar la conexión
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', { offer: peerConnection.localDescription, from: socket.id });

      if (screenShareCheckInterval.current) {
        clearInterval(screenShareCheckInterval.current);
      }
    }
  };

  const monitorScreenShare = (displayStream) => {
    if (screenShareCheckInterval.current) {
      clearInterval(screenShareCheckInterval.current);
    }
    if (animationFrameRequest.current) {
      cancelAnimationFrame(animationFrameRequest.current);
    }

    screenShareCheckInterval.current = setInterval(() => {
      if (!displayStream.active) {
        stopScreenShare();
        clearInterval(screenShareCheckInterval.current);
        cancelAnimationFrame(animationFrameRequest.current);
      }
    }, SCREEN_SHARE_CHECK_INTERVAL);

    const checkScreenStream = () => {
      if (!displayStream.active) {
        stopScreenShare();
        clearInterval(screenShareCheckInterval.current);
        cancelAnimationFrame(animationFrameRequest.current);
      } else {
        animationFrameRequest.current = requestAnimationFrame(checkScreenStream);
      }
    };
    checkScreenStream();

    displayStream.getVideoTracks()[0].onended = () => {
      stopScreenShare();
      clearInterval(screenShareCheckInterval.current);
      cancelAnimationFrame(animationFrameRequest.current);
    };
  };

  return { screenStream, startScreenShare, stopScreenShare };
};

export default useScreenShare;
