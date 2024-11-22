import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const CallPage = ({ roomId }) => {
  const myVideo = useRef();
  const remoteVideo = useRef();
  const screenVideo = useRef();
  const screenVideoRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [resolutions, setResolutions] = useState([]);
  const [selectedResolution, setSelectedResolution] = useState(null);
  const fpsOptions = [15, 30, 60];
  const [selectedFPS, setSelectedFPS] = useState(fpsOptions[1]);
  const peerConnection = useRef(null);
  const socket = useRef(io("http://localhost:3000")).current;

  let screenShareCheckInterval;
  let animationFrameRequest;

  const getScreenResolutions = () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    const scaledResolutions = [
      {
        label: `${screenWidth} x ${screenHeight} (Nativa)`,
        width: screenWidth,
        height: screenHeight,
      },
      {
        label: `HD 720p (1280 x 720)`,
        width: Math.round(screenWidth * 0.666),
        height: Math.round(screenHeight * 0.666),
      },
      {
        label: `SD 480p (640 x 480)`,
        width: Math.round(screenWidth * 0.5),
        height: Math.round(screenHeight * 0.5),
      },
      {
        label: `LD 360p (480 x 360)`,
        width: Math.round(screenWidth * 0.375),
        height: Math.round(screenHeight * 0.375),
      },
    ];

    setResolutions(scaledResolutions);
    setSelectedResolution(scaledResolutions[0]);
  };

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(
      (device) => device.kind === "videoinput"
    );
    const audioInputs = devices.filter(
      (device) => device.kind === "audioinput"
    );
    setVideoDevices(videoInputs);
    setAudioDevices(audioInputs);

    if (videoInputs.length > 0) setSelectedVideoDevice(videoInputs[0].deviceId);
    if (audioInputs.length > 0) setSelectedAudioDevice(audioInputs[0].deviceId);
  };

  const startCameraStream = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedVideoDevice
            ? { exact: selectedVideoDevice }
            : undefined,
        },
        audio: {
          deviceId: selectedAudioDevice
            ? { exact: selectedAudioDevice }
            : undefined,
        },
      });
      setCameraStream(userStream);
      myVideo.current.srcObject = userStream;
      myVideo.current.muted = true;

      userStream
        .getTracks()
        .forEach((track) => peerConnection.current.addTrack(track, userStream));
    } catch (error) {
      console.error("Error al acceder a la cámara/micrófono:", error);
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      myVideo.current.srcObject = null;

      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === "video") {
          sender.replaceTrack(null);
        }
      });
    }
  };

  const startScreenShare = async () => {
    if (screenStream) {
      stopScreenShare();
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          width: selectedResolution.width,
          height: selectedResolution.height,
          frameRate: selectedFPS,
        },
      });

      setScreenStream(displayStream);
      screenVideo.current.srcObject = displayStream;

      monitorScreenShare(displayStream);

      displayStream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, displayStream);
      });
    } catch (error) {
      console.error("Error al compartir pantalla:", error);
    }
  };

  const monitorScreenShare = (displayStream) => {
    if (screenShareCheckInterval) {
      clearInterval(screenShareCheckInterval);
    }
    if (animationFrameRequest) {
      cancelAnimationFrame(animationFrameRequest);
    }

    screenShareCheckInterval = setInterval(() => {
      if (!displayStream.active) {
        stopScreenShare();
        clearInterval(screenShareCheckInterval);
        cancelAnimationFrame(animationFrameRequest);
      }
    }, 500);

    const checkScreenStream = () => {
      if (!displayStream.active) {
        stopScreenShare();
        clearInterval(screenShareCheckInterval);
        cancelAnimationFrame(animationFrameRequest);
      } else {
        animationFrameRequest = requestAnimationFrame(checkScreenStream);
      }
    };
    checkScreenStream();

    displayStream.getVideoTracks()[0].onended = () => {
      stopScreenShare();
      clearInterval(screenShareCheckInterval);
      cancelAnimationFrame(animationFrameRequest);
    };
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      screenVideo.current.srcObject = null;

      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === "video") {
          sender.replaceTrack(null);
        }
      });

      if (screenShareCheckInterval) {
        clearInterval(screenShareCheckInterval);
      }
    }
  };

  const callUser = async (userId) => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { roomId, offer });
  };

  useEffect(() => {
    getDevices();
    getScreenResolutions();

    startCameraStream();

    socket.emit("join-room", roomId);

    socket.on("user-connected", (userId) => {
      callUser(userId);
    });

    socket.on("offer", async (data) => {
      if (data.from !== socket.id) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      }
    });

    socket.on("answer", async (data) => {
      if (data.from !== socket.id) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    socket.on("candidate", async (data) => {
      if (data.from !== socket.id) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });

    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:your-turn-server-url",
          username: "user",
          credential: "pass",
        },
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { roomId, candidate: event.candidate });
      }
    };

    peerConnection.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    return () => {
      socket.disconnect();
      if (cameraStream)
        cameraStream.getTracks().forEach((track) => track.stop());
      if (screenStream)
        screenStream.getTracks().forEach((track) => track.stop());
    };
  }, [roomId]);

  const MicTest = () => {
    const [volume, setVolume] = useState(0);
    const [isMicActive, setIsMicActive] = useState(true);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
  
    useEffect(() => {
      const initializeMicTest = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          mediaStreamRef.current = stream;
  
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          audioContextRef.current = audioContext;
  
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;
  
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
  
          const updateVolume = () => {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
  
            const averageVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setVolume(averageVolume);
  
            if (isMicActive) {
              requestAnimationFrame(updateVolume);
            }
          };
  
          updateVolume();
        } catch (error) {
          console.error("Error al acceder al micrófono:", error);
          setIsMicActive(false);
        }
      };
  
      initializeMicTest();
  
      return () => {
        if (audioContextRef.current) audioContextRef.current.close();
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
      };
    }, [isMicActive]);
  
    const toggleMic = () => {
      if (mediaStreamRef.current) {
        const micTrack = mediaStreamRef.current.getAudioTracks()[0];
        micTrack.enabled = !micTrack.enabled;
        setIsMicActive(micTrack.enabled); // Actualizamos el estado inmediatamente
      }
    };
  
    return (
      <div>
        <h3>Prueba de Micrófono</h3>
        <button onClick={toggleMic}>
          {isMicActive ? "Apagar Micrófono" : "Encender Micrófono"}
        </button>
        <div style={{ marginTop: "10px" }}>
          <label>Volumen:</label>
          <progress value={volume} max="255" style={{ width: "100%" }} />
        </div>
        {!isMicActive && <p>El micrófono está apagado</p>}
      </div>
    );
  };

  return (
    <div>
      <h2>Sala de llamada: {roomId}</h2>
      <video ref={myVideo} autoPlay playsInline muted />
      <video ref={remoteVideo} autoPlay playsInline />
      <video ref={screenVideo} autoPlay playsInline />
      <MicTest />
      <div>
        <label>Cámara:</label>
        <select
          value={selectedVideoDevice}
          onChange={(e) => setSelectedVideoDevice(e.target.value)}
        >
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Cámara ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Micrófono:</label>
        <select
          value={selectedAudioDevice}
          onChange={(e) => setSelectedAudioDevice(e.target.value)}
        >
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Micrófono ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Resolución:</label>
        <select
          value={selectedResolution ? selectedResolution.label : ""}
          onChange={(e) =>
            setSelectedResolution(
              resolutions.find((r) => r.label === e.target.value)
            )
          }
        >
          {resolutions.map((resolution) => (
            <option key={resolution.label} value={resolution.label}>
              {resolution.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>FPS:</label>
        <select
          value={selectedFPS}
          onChange={(e) => setSelectedFPS(Number(e.target.value))}
        >
          {fpsOptions.map((fps) => (
            <option key={fps} value={fps}>
              {fps} FPS
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          onClick={() => {
            if (isVideoEnabled) {
              stopCameraStream();
            } else {
              startCameraStream();
            }
            setIsVideoEnabled(!isVideoEnabled);
          }}
        >
          {isVideoEnabled ? "Apagar Cámara" : "Encender Cámara"}
        </button>
        <button onClick={startScreenShare}>Compartir Pantalla</button>
        <button onClick={stopScreenShare} disabled={!screenStream}>
          Detener Compartir Pantalla
        </button>
      </div>
    </div>
  );
};

export default CallPage;
