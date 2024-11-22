// src/components/MicTest/MicTest.js

import React, { useEffect, useRef, useState } from 'react';
import { MESSAGES } from '../../utils/constants';

const MicTest = () => {
  const [volume, setVolume] = useState(0);
  const [isMicActive, setIsMicActive] = useState(true);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    const initializeMicTest = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

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

          if (isMicActive) {
            requestAnimationFrame(updateVolume);
          }
        };

        updateVolume();
      } catch (error) {
        console.error(MESSAGES.micAccessError, error);
        setIsMicActive(false);
      }
    };

    initializeMicTest();

    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isMicActive]);

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const micTrack = mediaStreamRef.current.getAudioTracks()[0];
      micTrack.enabled = !micTrack.enabled;
      setIsMicActive(micTrack.enabled);
    }
  };

  return (
    <div>
      <h3>{MESSAGES.micTestTitle}</h3>
      <button onClick={toggleMic}>
        {isMicActive ? MESSAGES.micOn : MESSAGES.micOff}
      </button>
      <div style={{ marginTop: '10px' }}>
        <label>Volumen:</label>
        <progress value={volume} max="255" style={{ width: '100%' }} />
      </div>
      {!isMicActive && <p>El micrófono está apagado</p>}
    </div>
  );
};

export default MicTest;
