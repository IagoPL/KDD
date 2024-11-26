import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../utils/constants';

const useSocket = (roomId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    const socket = socketRef.current;

    socket.emit('join-room', roomId);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const emit = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event) => {
    socketRef.current?.off(event);
  };

  return { emit, on, off };
};

export default useSocket;
