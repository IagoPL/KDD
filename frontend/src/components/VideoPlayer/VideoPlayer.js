// src/components/VideoPlayer/VideoPlayer.js

import React, { useEffect } from "react";

const VideoPlayer = ({
  myVideoRef,
  remoteVideoRef,
  stream,
  setStream,
  selectedVideoDevice,
  isVideoEnabled,
  setIsVideoEnabled,
}) => {
  // Función para iniciar el MediaStream de la cámara
  const startMediaStream = async () => {
    try {
      const constraints = {
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
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

  // Alternar el estado de la cámara
  const toggleCamera = () => {
    if (isVideoEnabled && stream) {
      stream.getVideoTracks().forEach((track) => track.stop());
    } else {
      startMediaStream();
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  useEffect(() => {
    console.log("myVideoRef.current:", myVideoRef.current);
    console.log("remoteVideoRef.current:", remoteVideoRef.current);
  }, [myVideoRef, remoteVideoRef]);

  return (
    <div>
      <h3>Mi Video</h3>
      <video
        ref={myVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "45%", marginRight: "5%" }}
      />
      <h3>Video Remoto</h3>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "45%" }}
      />
      <div>
        <button onClick={toggleCamera}>
          {isVideoEnabled ? 'Apagar Cámara' : 'Encender Cámara'}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;

