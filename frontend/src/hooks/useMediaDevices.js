import { useState, useEffect } from 'react';

const useMediaDevices = () => {
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);

  const updateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(devices.filter((device) => device.kind === 'videoinput'));
      setAudioDevices(devices.filter((device) => device.kind === 'audioinput'));
    } catch (error) {
      console.error('Error al enumerar dispositivos:', error);
    }
  };

  useEffect(() => {
    updateDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
    };
  }, []);

  return { videoDevices, audioDevices };
};

export default useMediaDevices;
