// src/pages/CallPage.js
import React, { useEffect, useRef } from 'react';

const CallPage = ({ roomId }) => {
    const myVideo = useRef();
    const otherVideo = useRef();

    useEffect(() => {
        // Configura WebRTC aquí, usando los detalles de la sala
    }, [roomId]);

    return (
        <div>
            <video ref={myVideo} autoPlay playsInline />
            <video ref={otherVideo} autoPlay playsInline />
        </div>
    );
};

export default CallPage;
