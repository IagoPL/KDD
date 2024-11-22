// socketService.js
import io from 'socket.io-client';

class SocketService {
  socket = null;

  connect(url) {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      this.socket.on('connect', () => {
        console.log('Conectado al servidor de Socket.io');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error al conectar con Socket.io:', error);
        reject(error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Desconectado del servidor de Socket.io');
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

const socketService = new SocketService();
export default socketService;
