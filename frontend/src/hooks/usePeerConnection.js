import { useEffect, useRef } from 'react';
import { iceServers } from '../utils/constants';

const usePeerConnection = (socket, remoteVideoRef) => {
  const peerConnectionRef = useRef(new RTCPeerConnection({ iceServers }));
  const remoteStreamRef = useRef(new MediaStream());

  useEffect(() => {
    const peerConnection = peerConnectionRef.current;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', { candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      remoteStreamRef.current.addTrack(event.track);
      if (remoteVideoRef?.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    };

    return () => {
      peerConnection.close();
    };
  }, [socket, remoteVideoRef]);

  return peerConnectionRef.current;
};

export default usePeerConnection;
