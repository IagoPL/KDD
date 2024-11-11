// src/pages/CreateCall.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCall = () => {
    const [roomId, setRoomId] = useState(null);
    const navigate = useNavigate();

    const handleCreateCall = async () => {
        const response = await axios.post('/api/calls/create');
        setRoomId(response.data.roomId);
        navigate(`/call/${response.data.roomId}`);
    };

    return (
        <div>
            <button onClick={handleCreateCall}>Iniciar Llamada</button>
            {roomId && <p>ID de la sala: {roomId}</p>}
        </div>
    );
};

export default CreateCall;
