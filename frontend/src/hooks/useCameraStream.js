import { useEffect, useState } from 'react';
import { mediaConstraints, MESSAGES } from '../utils/constants';

const useCameraStream = (selectedVideoDevice, selectedAudioDevice, myVideoRef) => {
  const [cameraStream, setCameraStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

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

      if (myVideoRef?.current) {
        myVideoRef.current.srcObject = userStream;
      }
    } catch (error) {
      console.error(MESSAGES.cameraAccessError, error);
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);

      if (myVideoRef?.current) {
        myVideoRef.current.srcObject = null;
      }
    }
  };

  const toggleCamera = () => {
    if (isVideoEnabled) {
      stopCameraStream();
    } else {
      startCameraStream();
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  useEffect(() => {
    startCameraStream();
    return () => stopCameraStream();
  }, [selectedVideoDevice, selectedAudioDevice]);

  return { cameraStream, isVideoEnabled, toggleCamera };
};

export default useCameraStream;
