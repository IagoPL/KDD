// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import CreateCall from './pages/CreateCall';
import JoinCall from './pages/JoinCall';
import CallPage from './pages/CallPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/create-call" element={<CreateCall />} />
                <Route path="/join-call" element={<JoinCall />} />
                <Route path="/call/:roomId" element={<CallPage />} />
            </Routes>
        </Router>
    );
};

export default App;
