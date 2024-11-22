// src/hooks/useCameraStream.js

import { useEffect, useState } from 'react';
import { mediaConstraints, MESSAGES } from '../utils/constants';

const useCameraStream = (
  selectedVideoDevice,
  selectedAudioDevice,
  peerConnection,
  myVideoRef
) => {
  const [cameraStream, setCameraStream] = useState(null);

  const startCameraStream = async () => {
    try {
      const constraints = {
        video: selectedVideoDevice
          ? { deviceId: { exact: selectedVideoDevice } }
          : mediaConstraints.video,
        audio: selectedAudioDevice
          ? { deviceId: { exact: selectedAudioDevice } }
          : mediaConstraints.audio,
      };

      const userStream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(userStream);

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = userStream;
        myVideoRef.current.muted = true;
      }

      userStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, userStream);
      });
    } catch (error) {
      console.error(MESSAGES.cameraAccessError, error);
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = null;
      }
      // Remover tracks del peerConnection
      peerConnection.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === 'video') {
          peerConnection.removeTrack(sender);
        }
      });
    }
  };

  useEffect(() => {
    startCameraStream();

    return () => {
      stopCameraStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVideoDevice, selectedAudioDevice]);

  return { cameraStream, startCameraStream, stopCameraStream };
};

export default useCameraStream;
