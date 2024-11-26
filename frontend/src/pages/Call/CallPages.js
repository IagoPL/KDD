import React, { useRef, useState, useEffect } from 'react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import Controls from '../../components/Controls/Controls';
import DeviceSelector from '../../components/DeviceSelector/DeviceSelector';
import MicTest from '../../components/MicTest/MicTest';
import ScreenShareControls from '../../components/ScreenShareControls/ScreenShareControls';
import useCameraStream from '../../hooks/useCameraStream';
import useMediaDevices from '../../hooks/useMediaDevices';
import usePeerConnection from '../../hooks/usePeerConnection';
import useScreenShare from '../../hooks/useScreenShare';
import useSocket from '../../hooks/useSocket';
import { resolutions, fpsOptions } from '../../utils/constants';

const CallPage = ({ roomId }) => {
  // Referencias de video
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  // Socket y conexión Peer-to-Peer
  const socket = useSocket(roomId);
  const peerConnection = usePeerConnection(socket, remoteVideoRef);

  // Manejo de dispositivos
  const { videoDevices, audioDevices } = useMediaDevices();
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');

  // Manejo de cámara
  const {
    cameraStream,
    isVideoEnabled,
    toggleCamera,
  } = useCameraStream(selectedVideoDevice, selectedAudioDevice, myVideoRef);

  // Manejo de pantalla compartida
  const [selectedResolution, setSelectedResolution] = useState(resolutions[0]);
  const [selectedFPS, setSelectedFPS] = useState(fpsOptions[1]);

  const {
    screenStream,
    startScreenShare,
    stopScreenShare,
    updateScreenShareConstraints,
  } = useScreenShare(peerConnection, screenVideoRef);

  // Actualizar restricciones de pantalla compartida
  useEffect(() => {
    updateScreenShareConstraints(selectedResolution, selectedFPS);
  }, [selectedResolution, selectedFPS]);

  // Depuración: Asignar el stream globalmente
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play(); // Forzar reproducción
    }
  }, [screenStream]);

  // Iniciar pantalla compartida con las restricciones actuales
  const startSharing = () => {
    startScreenShare({
      width: selectedResolution.width,
      height: selectedResolution.height,
      frameRate: selectedFPS,
    });
  };

  return (
    <div>
      <h2>Sala de Llamada: {roomId}</h2>

      {/* Video local y remoto */}
      <VideoPlayer
        myVideoRef={myVideoRef}
        remoteVideoRef={remoteVideoRef}
        isVideoEnabled={isVideoEnabled}
        toggleCamera={toggleCamera}
      />

      {/* Pantalla compartida */}
      <div>
        <h3>Pantalla Compartida</h3>
        <video
          ref={screenVideoRef}
          autoPlay
          playsInline
          style={{ width: '45%' }}
        />
      </div>

      {/* Selector de dispositivos */}
      <DeviceSelector
        videoDevices={videoDevices}
        audioDevices={audioDevices}
        selectedVideoDevice={selectedVideoDevice}
        setSelectedVideoDevice={setSelectedVideoDevice}
        selectedAudioDevice={selectedAudioDevice}
        setSelectedAudioDevice={setSelectedAudioDevice}
      />

      {/* Prueba de micrófono */}
      <MicTest
        stream={cameraStream}
        selectedAudioDevice={selectedAudioDevice}
      />

      {/* Controles de pantalla compartida */}
      <ScreenShareControls
        resolutions={resolutions}
        selectedResolution={selectedResolution}
        setSelectedResolution={setSelectedResolution}
        fpsOptions={fpsOptions}
        selectedFPS={selectedFPS}
        setSelectedFPS={setSelectedFPS}
      />

      {/* Controles generales */}
      <Controls
        isVideoEnabled={isVideoEnabled}
        toggleCamera={toggleCamera}
        startScreenShare={startSharing}
        stopScreenShare={stopScreenShare}
        screenStream={screenStream}
      />
    </div>
  );
};

export default CallPage;
