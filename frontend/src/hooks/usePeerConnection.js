// src/hooks/usePeerConnection.js

import { useRef, useEffect } from "react";
import { iceServers } from "../utils/constants";

const usePeerConnection = (socket, remoteVideoRef) => {
  const peerConnectionRef = useRef(null);
  const remoteStreamRef = useRef(null); // Añadimos una referencia al flujo remoto

  if (!peerConnectionRef.current) {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: iceServers,
    });
  }

  if (!remoteStreamRef.current) {
    remoteStreamRef.current = new MediaStream(); // Inicializamos el MediaStream remoto
  }

  const peerConnection = peerConnectionRef.current;

  useEffect(() => {
    // Manejo de eventos de peerConnection
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", {
          candidate: event.candidate,
          from: socket.id,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("Evento ontrack recibido:", event);
      if (remoteVideoRef.current) {
        // Agregamos la pista al MediaStream remoto
        remoteStreamRef.current.addTrack(event.track);
        remoteVideoRef.current.srcObject = remoteStreamRef.current;

        console.log("remoteStreamRef.current:", remoteStreamRef.current);
        console.log(
          "Pistas en remoteStreamRef:",
          remoteStreamRef.current.getTracks()
        );
      }
    };

    // Manejo de eventos de socket relacionados con WebRTC
    socket.on("offer", async (data) => {
      if (data.from !== socket.id) {
        try {
          console.log("Oferta recibida:", data.offer);
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("answer", {
            answer: peerConnection.localDescription,
            from: socket.id,
          });
        } catch (error) {
          console.error("Error al manejar la oferta:", error);
        }
      }
    });

    socket.on("answer", async (data) => {
      if (data.from !== socket.id) {
        try {
          console.log("Respuesta recibida:", data.answer);
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        } catch (error) {
          console.error(
            "Error al establecer la descripción remota de la respuesta:",
            error
          );
        }
      }
    });

    socket.on("candidate", async (data) => {
      if (data.from !== socket.id) {
        try {
          console.log("Candidato ICE recibido:", data.candidate);
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (error) {
          console.error("Error al agregar ICE Candidate:", error);
        }
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, [peerConnection, socket, remoteVideoRef]);

  return peerConnection;
};

export default usePeerConnection;
