// src/pages/JoinCall.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinCall = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinCall = async () => {
        try {
            await axios.post('/api/calls/join', { roomId });
            navigate(`/call/${roomId}`);
        } catch (error) {
            alert('Sala no encontrada');
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="ID de la sala"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleJoinCall}>Unirse a la Llamada</button>
        </div>
    );
};

export default JoinCall;
