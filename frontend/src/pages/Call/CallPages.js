// src/pages/Call/CallPage.js

import React, { useState, useRef, useEffect } from 'react';
import MicTest from '../../components/MicTest/MicTest';
import DeviceSelector from '../../components/DeviceSelector/DeviceSelector';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import Controls from '../../components/Controls/Controls';
import ScreenShareControls from '../../components/ScreenShareControls/ScreenShareControls';
import useMediaDevices from '../../hooks/useMediaDevices';
import useCameraStream from '../../hooks/useCameraStream';
import usePeerConnection from '../../hooks/usePeerConnection';
import useSocket from '../../hooks/useSocket';
import useScreenShare from '../../hooks/useScreenShare';
import { fpsOptions, resolutions } from '../../utils/constants';

const CallPage = ({ roomId }) => {
  const { videoDevices, audioDevices } = useMediaDevices();
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState(resolutions[0]);
  const [selectedFPS, setSelectedFPS] = useState(fpsOptions[1]);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  // Inicializar socket primero
  const socket = useSocket(roomId);

  // Luego inicializar peerConnection pasando el socket
  const peerConnection = usePeerConnection(socket, remoteVideoRef);

  const { startCameraStream, stopCameraStream } = useCameraStream(
    selectedVideoDevice,
    selectedAudioDevice,
    peerConnection,
    myVideoRef
  );

  const { screenStream, startScreenShare, stopScreenShare, updateScreenShareConstraints } = useScreenShare(
    peerConnection,
    selectedResolution,
    selectedFPS,
    socket,
    myVideoRef
  );

  const toggleCamera = () => {
    if (isVideoEnabled) {
      stopCameraStream();
    } else {
      startCameraStream();
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  // Nueva función toggle para el compartir pantalla
  const toggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
    setIsScreenSharing(!isScreenSharing);
  };

  useEffect(() => {
    if (isScreenSharing) {
      updateScreenShareConstraints(selectedResolution, selectedFPS);
    }
  }, [selectedResolution, selectedFPS]);

  useEffect(() => {
    if (screenStream && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenStream;
      console.log('Screen stream asignado al elemento de video para pantalla compartida.');
    }
  }, [screenStream]);

  return (
    <div>
      <h2>Sala de llamada: {roomId}</h2>
      <VideoPlayer myVideoRef={myVideoRef} remoteVideoRef={remoteVideoRef} />
      <div>
        <h3>Pantalla Compartida</h3>
        <video ref={screenVideoRef} autoPlay playsInline style={{ width: '45%' }} />
      </div>
      <MicTest />
      <DeviceSelector
        videoDevices={videoDevices}
        audioDevices={audioDevices}
        selectedVideoDevice={selectedVideoDevice}
        setSelectedVideoDevice={setSelectedVideoDevice}
        selectedAudioDevice={selectedAudioDevice}
        setSelectedAudioDevice={setSelectedAudioDevice}
      />
      <ScreenShareControls
        resolutions={resolutions}
        selectedResolution={selectedResolution}
        setSelectedResolution={setSelectedResolution}
        fpsOptions={fpsOptions}
        selectedFPS={selectedFPS}
        setSelectedFPS={setSelectedFPS}
      />
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
