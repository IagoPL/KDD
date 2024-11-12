// src/pages/JoinCall.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JoinCall = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinCall = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/calls/join', { roomId });
            if (response.status === 200) {
                navigate(`/call/${roomId}`);
            }
        } catch (error) {
            console.error('Error al unirse a la llamada:', error);
            alert('Sala no encontrada. Verifica el ID e intenta nuevamente.');
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
