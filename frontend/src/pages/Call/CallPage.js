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
    const [participants, setParticipants] = useState([
        { id: 1, ref: useRef(), volume: 1 },
        { id: 2, ref: useRef(), volume: 1 }
    ]); // Simulación de participantes con referencias y volúmenes individuales

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

    // Controlador de volumen individual para cada participante
    const handleVolumeChange = (id, newVolume) => {
        setParticipants(prevParticipants =>
            prevParticipants.map(participant =>
                participant.id === id ? { ...participant, volume: newVolume } : participant
            )
        );
        const participant = participants.find(participant => participant.id === id);
        if (participant && participant.ref.current) {
            participant.ref.current.volume = newVolume;
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

            {/* Control de volumen individual para cada participante */}
            <div>
                <h3>Control de Volumen de Participantes:</h3>
                {participants.map(participant => (
                    <div key={participant.id}>
                        <label>Participante {participant.id}:</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={participant.volume}
                            onChange={(e) => handleVolumeChange(participant.id, parseFloat(e.target.value))}
                        />
                        <video ref={participant.ref} autoPlay playsInline volume={participant.volume} />
                    </div>
                ))}
            </div>

            {/* Elemento de video para la transmisión propia */}
            <video ref={myVideo} autoPlay playsInline />
        </div>
    );
};

export default CallPage;
