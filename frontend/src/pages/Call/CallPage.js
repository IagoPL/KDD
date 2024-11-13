// src/pages/CallPage.js
import React, { useEffect, useRef, useState, useCallback } from 'react';

const CallPage = ({ roomId }) => {
    const myVideo = useRef(); // Elemento de video para la cámara
    const screenVideo = useRef(); // Elemento de video para la pantalla compartida
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
    const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
    const [cameraStream, setCameraStream] = useState(null); // Stream de cámara
    const [screenStream, setScreenStream] = useState(null); // Stream de pantalla compartida
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    // Opciones de resolución y FPS
    const resolutions = [
        { label: "Nativa", width: 1920, height: 1080 },
        { label: "HD (1280x720)", width: 1280, height: 720 },
        { label: "SD (640x480)", width: 640, height: 480 },
    ];
    const fpsOptions = [15, 30, 60];

    // Estados para resolución y FPS seleccionados
    const [selectedResolution, setSelectedResolution] = useState(resolutions[0]);
    const [selectedFPS, setSelectedFPS] = useState(fpsOptions[1]);

    // Función para obtener los dispositivos de video y audio
    const getDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);

        if (videoInputs.length > 0) setSelectedVideoDevice(videoInputs[0].deviceId);
        if (audioInputs.length > 0) setSelectedAudioDevice(audioInputs[0].deviceId);
    };

    // Función para iniciar el stream de la cámara
    const startCameraStream = useCallback(async () => {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({
                video: isVideoEnabled ? { deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined } : false,
                audio: isAudioEnabled ? { deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined } : false
            });
            setCameraStream(userStream);
            myVideo.current.srcObject = userStream;
            myVideo.current.muted = true; // Desactiva el micrófono local para que no te escuches a ti mismo
        } catch (error) {
            console.error("Error al acceder a la cámara/micrófono:", error);
        }
    }, [isVideoEnabled, isAudioEnabled, selectedVideoDevice, selectedAudioDevice]);

    useEffect(() => {
        getDevices();
    }, []);

    useEffect(() => {
        if (selectedVideoDevice && selectedAudioDevice) {
            startCameraStream();
        }
    }, [selectedVideoDevice, selectedAudioDevice, startCameraStream]);

    // Función para encender/apagar la cámara
    const toggleVideo = () => {
        if (cameraStream) {
            cameraStream.getVideoTracks().forEach(track => track.enabled = !isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    // Función para encender/apagar el micrófono
    const toggleAudio = () => {
        if (cameraStream) {
            cameraStream.getAudioTracks().forEach(track => track.enabled = !isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    // Función para iniciar el stream de pantalla compartida
    const startScreenShare = async () => {
        // Detener cualquier pantalla compartida anterior
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
        }

        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always",
                    width: { ideal: selectedResolution.width },
                    height: { ideal: selectedResolution.height },
                    frameRate: { ideal: selectedFPS }
                }
            });
            setScreenStream(displayStream);
            screenVideo.current.srcObject = displayStream;

            // Cuando el usuario detiene la pantalla compartida, limpiar el stream
            displayStream.getVideoTracks()[0].onended = () => {
                stopScreenShare();
            };
        } catch (error) {
            console.error("Error al compartir pantalla:", error);
        }
    };

    // Función para detener el stream de pantalla compartida
    const stopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop());
            setScreenStream(null);
            screenVideo.current.srcObject = null; // Limpiar el video de pantalla compartida
        }
    };

    // Actualizar configuración de resolución y FPS en tiempo real
    const updateScreenShareSettings = async () => {
        if (screenStream) {
            const [videoTrack] = screenStream.getVideoTracks();
            try {
                await videoTrack.applyConstraints({
                    width: selectedResolution.width,
                    height: selectedResolution.height,
                    frameRate: selectedFPS
                });
                console.log("Configuración de pantalla compartida actualizada");
            } catch (error) {
                console.error("No se pudo actualizar la configuración de pantalla compartida:", error);
            }
        }
    };

    useEffect(() => {
        updateScreenShareSettings();
    }, [selectedResolution, selectedFPS]);

    return (
        <div>
            <h2>Sala de llamada: {roomId}</h2>

            {/* Selectores para elegir cámara y micrófono */}
            <div>
                <label>Cámara:</label>
                <select value={selectedVideoDevice} onChange={(e) => setSelectedVideoDevice(e.target.value)}>
                    {videoDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Cámara ${device.deviceId}`}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Micrófono:</label>
                <select value={selectedAudioDevice} onChange={(e) => setSelectedAudioDevice(e.target.value)}>
                    {audioDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Micrófono ${device.deviceId}`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selectores de resolución y FPS para pantalla compartida */}
            <div>
                <label>Resolución:</label>
                <select value={selectedResolution.label} onChange={(e) => setSelectedResolution(resolutions.find(r => r.label === e.target.value))}>
                    {resolutions.map(resolution => (
                        <option key={resolution.label} value={resolution.label}>
                            {resolution.label}
                        </option>
                    ))}
                </select>
                <label>FPS:</label>
                <select value={selectedFPS} onChange={(e) => setSelectedFPS(Number(e.target.value))}>
                    {fpsOptions.map(fps => (
                        <option key={fps} value={fps}>
                            {fps} FPS
                        </option>
                    ))}
                </select>
            </div>

            {/* Botones para encender/apagar la cámara, el micrófono, y compartir pantalla */}
            <div>
                <button onClick={toggleVideo}>
                    {isVideoEnabled ? 'Apagar Cámara' : 'Encender Cámara'}
                </button>
                <button onClick={toggleAudio}>
                    {isAudioEnabled ? 'Apagar Micrófono' : 'Encender Micrófono'}
                </button>
                <button onClick={startScreenShare}>
                    Compartir Pantalla
                </button>
                <button onClick={stopScreenShare} disabled={!screenStream}>
                    Detener Compartir Pantalla
                </button>
            </div>

            {/* Elemento de video para la transmisión de la cámara */}
            <h3>Video de Cámara</h3>
            <video ref={myVideo} autoPlay playsInline />

            {/* Elemento de video para la transmisión de pantalla compartida */}
            {screenStream && (
                <>
                    <h3>Pantalla Compartida</h3>
                    <video ref={screenVideo} autoPlay playsInline />
                </>
            )}
        </div>
    );
};

export default CallPage;
