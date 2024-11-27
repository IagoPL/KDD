// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SingupPage from './pages/Auth/SingupPage.js'
import MainPage from './pages/Main/MainPage';
import CreateCall from './pages/Call/CreateCall';
import JoinCall from './pages/Call/JoinCall';
import CallPage from './pages/Call/CallPages';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SingupPage />} />
                <Route path="/" element={<MainPage />} />
                <Route path="/create-call" element={<CreateCall />} />
                <Route path="/join-call" element={<JoinCall />} />
                <Route path="/call/:roomId" element={<CallPage />} />
            </Routes>
        </Router>
    );
};

export default App;
