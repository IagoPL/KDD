// src/pages/CreateCall.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCall = () => {
    const [roomId, setRoomId] = useState(null);
    const navigate = useNavigate();

    const handleCreateCall = async () => {
        try {
            // Realiza una solicitud POST al backend para crear una nueva sala de llamada
            const response = await axios.post('http://localhost:3000/api/calls/create');
            setRoomId(response.data.roomId);
            navigate(`/call/${response.data.roomId}`);
        } catch (error) {
            console.error('Error al crear la llamada:', error);
        }
    };

    return (
        <div>
            <button onClick={handleCreateCall}>Iniciar Llamada</button>
            {roomId && <p>ID de la sala: {roomId}</p>}
        </div>
    );
};

export default CreateCall;
