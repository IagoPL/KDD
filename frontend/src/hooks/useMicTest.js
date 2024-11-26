import { useEffect, useState, useRef } from 'react';

const useMicTest = (stream, selectedAudioDevice) => {
  const [volume, setVolume] = useState(0);
  const [isMicActive, setIsMicActive] = useState(true);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    const startAudioAnalysis = () => {
      if (!stream) return;

      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const updateVolume = () => {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          const averageVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(averageVolume);
          requestAnimationFrame(updateVolume);
        };

        updateVolume();
      }
    };

    startAudioAnalysis();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stream]);

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsMicActive(track.enabled);
      });
    }
  };

  return { volume, isMicActive, toggleMic };
};

export default useMicTest;
