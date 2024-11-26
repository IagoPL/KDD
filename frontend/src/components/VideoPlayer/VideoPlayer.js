import React from 'react';

const VideoPlayer = ({
  myVideoRef,
  remoteVideoRef,
  isVideoEnabled,
  toggleCamera,
}) => {
  return (
    <div>
      {/* Video del usuario */}
      <h3>Mi Video</h3>
      <video
        ref={myVideoRef}
        autoPlay
        playsInline
        muted
        style={{ width: '45%', marginRight: '5%' }}
      />

      {/* Video remoto */}
      <h3>Video Remoto</h3>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: '45%' }}
      />

      {/* Botón para alternar la cámara */}
      <div>
        <button onClick={toggleCamera}>
          {isVideoEnabled ? 'Apagar Cámara' : 'Encender Cámara'}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
