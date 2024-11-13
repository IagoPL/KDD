// src/pages/CallPage.js
import React, { useEffect, useRef, useState, useCallback } from 'react';

const CallPage = ({ roomId }) => {
    const myVideo = useRef();
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
    const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
    const [stream, setStream] = useState(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false); // Estado para compartir pantalla

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

    // Función para iniciar la transmisión de video y audio respetando los estados de cámara y micrófono
    const startStream = useCallback(async () => {
        try {
            const userStream = await navigator.mediaDevices.getUserMedia({
                video: isVideoEnabled ? { deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined } : false,
                audio: isAudioEnabled ? { deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined } : false
            });
            setStream(userStream);
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
            startStream();
        }
    }, [selectedVideoDevice, selectedAudioDevice, startStream]);

    // Función para encender/apagar la cámara
    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => track.enabled = !isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    // Función para encender/apagar el micrófono
    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => track.enabled = !isAudioEnabled);
            setIsAudioEnabled(!isAudioEnabled);
        }
    };

    // Función para compartir pantalla
    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });
                setIsScreenSharing(true);
                const videoTrack = screenStream.getVideoTracks()[0];

                // Muestra el stream de pantalla en el elemento de video
                myVideo.current.srcObject = screenStream;

                // Al terminar de compartir pantalla, regresa al stream de cámara
                videoTrack.onended = () => {
                    setIsScreenSharing(false);
                    startStream();
                };
            } catch (error) {
                console.error("Error al compartir pantalla:", error);
            }
        } else {
            // Detener la pantalla compartida y regresar a la cámara
            setIsScreenSharing(false);
            startStream();
        }
    };

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

            {/* Botones para encender/apagar la cámara, el micrófono, y compartir pantalla */}
            <div>
                <button onClick={toggleVideo}>
                    {isVideoEnabled ? 'Apagar Cámara' : 'Encender Cámara'}
                </button>
                <button onClick={toggleAudio}>
                    {isAudioEnabled ? 'Apagar Micrófono' : 'Encender Micrófono'}
                </button>
                <button onClick={toggleScreenShare}>
                    {isScreenSharing ? 'Dejar de Compartir Pantalla' : 'Compartir Pantalla'}
                </button>
            </div>

            {/* Elemento de video para la transmisión propia */}
            <video ref={myVideo} autoPlay playsInline />
        </div>
    );
};

export default CallPage;
