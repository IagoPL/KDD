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

            {/* Botones para encender/apagar la cámara y el micrófono */}
            <div>
                <button onClick={toggleVideo}>
                    {isVideoEnabled ? 'Apagar Cámara' : 'Encender Cámara'}
                </button>
                <button onClick={toggleAudio}>
                    {isAudioEnabled ? 'Apagar Micrófono' : 'Encender Micrófono'}
                </button>
            </div>

            {/* Elemento de video para la transmisión */}
            <video ref={myVideo} autoPlay playsInline />
        </div>
    );
};

export default CallPage;
