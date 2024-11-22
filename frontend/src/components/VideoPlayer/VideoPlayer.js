import React, { useEffect } from "react";

const VideoPlayer = ({ myVideoRef, remoteVideoRef }) => {
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
    </div>
  );
};

export default VideoPlayer;
