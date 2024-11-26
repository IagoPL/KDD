// src/pages/Call/CallPage.js

import React, { useState, useRef, useEffect } from 'react';
import MicTest from '../../components/MicTest/MicTest';
import DeviceSelector from '../../components/DeviceSelector/DeviceSelector';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import Controls from '../../components/Controls/Controls';
import ScreenShareControls from '../../components/ScreenShareControls/ScreenShareControls';
import useMediaDevices from '../../hooks/useMediaDevices';
import usePeerConnection from '../../hooks/usePeerConnection';
import useSocket from '../../hooks/useSocket';
import useScreenShare from '../../hooks/useScreenShare';
import { fpsOptions, resolutions } from '../../utils/constants';

const CallPage = ({ roomId }) => {
  // Estados y referencias para manejar los dispositivos y el streaming
  const { videoDevices, audioDevices } = useMediaDevices();
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(resolutions[0]);
  const [selectedFPS, setSelectedFPS] = useState(fpsOptions[1]);
  const [stream, setStream] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null); // Nueva referencia para el video de pantalla compartida

  // Inicialización del socket
  const socket = useSocket(roomId);

  // Inicialización de la conexión peer-to-peer
  const peerConnection = usePeerConnection(socket, remoteVideoRef);

  // Funciones para manejar el compartir pantalla
  const {
    screenStream,
    startScreenShare,
    stopScreenShare,
    updateScreenShareConstraints,
  } = useScreenShare(peerConnection, selectedResolution, selectedFPS, socket, myVideoRef, screenVideoRef);

  // Efecto para iniciar el MediaStream de video y audio
  useEffect(() => {
    const startMediaStream = async () => {
      try {
        const constraints = {
          video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
          audio: selectedAudioDevice ? { deviceId: { exact: selectedAudioDevice } } : true,
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error al obtener el MediaStream:', error);
      }
    };

    if (isVideoEnabled || selectedAudioDevice) {
      startMediaStream();
    }
  }, [selectedVideoDevice, selectedAudioDevice, isVideoEnabled]);

  // Alternar el estado de la cámara
  const toggleCamera = () => {
    if (isVideoEnabled && stream) {
      stream.getVideoTracks().forEach((track) => track.stop());
      setStream(null);
    } else {
      setIsVideoEnabled(true);
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  // Alternar el estado de compartir pantalla
  const toggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  // Efecto para actualizar las restricciones de compartir pantalla cuando cambian la resolución o el FPS
  useEffect(() => {
    if (isScreenSharing) {
      updateScreenShareConstraints(selectedResolution, selectedFPS);
    }
  }, [selectedResolution, selectedFPS]);

  // Efecto para limpiar el video de pantalla compartida cuando se detiene
  useEffect(() => {
    if (!isScreenSharing && screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }
  }, [isScreenSharing]);

  // Efecto para asignar el stream de pantalla compartida al elemento de video
  useEffect(() => {
    if (screenStream && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
      console.log('Screen stream asignado al elemento de video para pantalla compartida.');
    }
  }, [screenStream]);

  return (
    <div>
      <h2>Sala de llamada: {roomId}</h2>
      
      {/* Video del usuario y el video remoto */}
      <VideoPlayer
        myVideoRef={myVideoRef}
        remoteVideoRef={remoteVideoRef}
        stream={stream}
        setStream={setStream}
        selectedVideoDevice={selectedVideoDevice}
        isVideoEnabled={isVideoEnabled}
        setIsVideoEnabled={setIsVideoEnabled}
      />
      
      {/* Video de la pantalla compartida */}
      <div>
        <h3>Pantalla Compartida</h3>
        <video ref={screenVideoRef} autoPlay playsInline style={{ width: '45%' }} />
      </div>

      {/* Componente para manejar el micrófono */}
      <MicTest stream={stream} setStream={setStream} selectedAudioDevice={selectedAudioDevice} />

      {/* Selector de dispositivos de audio y video */}
      <DeviceSelector
        videoDevices={videoDevices}
        audioDevices={audioDevices}
        selectedVideoDevice={selectedVideoDevice}
        setSelectedVideoDevice={setSelectedVideoDevice}
        selectedAudioDevice={selectedAudioDevice}
        setSelectedAudioDevice={setSelectedAudioDevice}
      />

      {/* Controles para compartir pantalla */}
      <ScreenShareControls
        resolutions={resolutions}
        selectedResolution={selectedResolution}
        setSelectedResolution={setSelectedResolution}
        fpsOptions={fpsOptions}
        selectedFPS={selectedFPS}
        setSelectedFPS={setSelectedFPS}
      />

      {/* Controles generales para la llamada */}
      <Controls
        isVideoEnabled={isVideoEnabled}
        toggleCamera={toggleCamera}
        startScreenShare={toggleScreenShare}
        stopScreenShare={toggleScreenShare}
        screenStream={screenStream}
      />
    </div>
  );
};

export default CallPage;
