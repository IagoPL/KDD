// src/components/MicTest/MicTest.js

import React, { useEffect, useRef, useState } from 'react';
import { MESSAGES } from '../../utils/constants';

const MicTest = ({ stream, setStream, selectedAudioDevice }) => {
  const [volume, setVolume] = useState(0);
  const [isMicActive, setIsMicActive] = useState(true); // Micrófono encendido inicialmente
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);

  // Función para iniciar el MediaStream del micrófono
  const startAudioStream = async () => {
    try {
      const constraints = {
        audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
      };
      const audioStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(audioStream);
    } catch (error) {
      console.error('Error al obtener el MediaStream de audio:', error);
    }
  };

  useEffect(() => {
    if (stream && stream.getAudioTracks().length > 0) {
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        mediaStreamSourceRef.current = source;
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

      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMicActive;
      });
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stream]);

  const toggleMic = () => {
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setIsMicActive(track.enabled);
      });
    }
  };

  useEffect(() => {
    startAudioStream();
  }, [selectedAudioDevice]);

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
