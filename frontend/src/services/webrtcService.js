import socketService from './socketService';

class WebRTCService {
    peerConnection = null;
    remoteStream = null;
  
    createPeerConnection(config) {
      this.peerConnection = new RTCPeerConnection(config);
  
      // Manejar eventos ICE
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Emitir el candidato ICE a través de Socket.io
          socketService.emit('candidate', { candidate: event.candidate });
        }
      };
  
      // Manejar eventos de conexión de datos
      this.peerConnection.ontrack = (event) => {
        if (this.remoteStream) {
          this.remoteStream.addTrack(event.track);
        } else {
          this.remoteStream = new MediaStream([event.track]);
        }
      };
  
      return this.peerConnection;
    }
  
    async createOffer() {
      if (this.peerConnection) {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        return offer;
      }
      return null;
    }
  
    async createAnswer() {
      if (this.peerConnection) {
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        return answer;
      }
      return null;
    }
  
    async setRemoteDescription(description) {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(description);
      }
    }
  
    async addIceCandidate(candidate) {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(candidate);
      }
    }
  
    addTrack(track, stream) {
      if (this.peerConnection) {
        this.peerConnection.addTrack(track, stream);
      }
    }
  
    closeConnection() {
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
    }
  }
  
  const webRTCService = new WebRTCService();
  export default webRTCService;
  