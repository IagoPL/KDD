// src/hooks/useSocket.js

import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../utils/constants';

const useSocket = (roomId) => {
  const socketRef = useRef(null);

  if (!socketRef.current) {
    socketRef.current = io(SOCKET_SERVER_URL);
  }

  const socket = socketRef.current;

  useEffect(() => {
    socket.emit('join-room', { roomId, from: socket.id });

    return () => {
      socket.disconnect();
    };
  }, [socket, roomId]);

  return socket;
};

export default useSocket;
