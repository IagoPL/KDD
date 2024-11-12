// src/pages/CallPage.js
import React, { useEffect, useRef, useState } from 'react';

const CallPage = ({ roomId }) => {
    const myVideo = useRef();
    const [videoDevices, setVideoDevices] = useState([]);
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
    const [selectedAudioDevice, setSelectedAudioDevice] = useState('');

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

    // Función para iniciar la transmisión de video y audio
    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined },
                audio: { deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined }
            });
            myVideo.current.srcObject = stream;
        } catch (error) {
            console.error("Error al acceder a la cámara/micrófono:", error);
        }
    };

    useEffect(() => {
        getDevices();
    }, []);

    useEffect(() => {
        if (selectedVideoDevice && selectedAudioDevice) {
            startStream();
        }
    }, [selectedVideoDevice, selectedAudioDevice]);

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

            {/* Elemento de video para la transmisión */}
            <video ref={myVideo} autoPlay playsInline />

        </div>
    );
};

export default CallPage;
