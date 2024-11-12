// src/pages/CallPage.js
import React, { useEffect, useRef } from 'react';

const CallPage = ({ roomId }) => {
    const myVideo = useRef();
    const otherVideo = useRef();

    useEffect(() => {
        // Aquí podríamos configurar WebRTC para la transmisión de video
        // Usa `navigator.mediaDevices.getUserMedia` para acceder a la cámara y el micrófono
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myVideo.current.srcObject = stream;
            })
            .catch(error => console.error("Error al acceder a la cámara/micrófono:", error));
    }, []);

    return (
        <div>
            <h2>Sala de llamada: {roomId}</h2>
            <video ref={myVideo} autoPlay playsInline />
            <video ref={otherVideo} autoPlay playsInline />
        </div>
    );
};

export default CallPage;
