// src/components/VideoCall.js
import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const VideoCall = ({ roomId }) => {
    const myVideo = useRef();
    const socketRef = useRef();
    const peerRef = useRef();
    const otherUser = useRef();

    useEffect(() => {
        socketRef.current = io.connect('http://localhost:3000');
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                myVideo.current.srcObject = stream;
                socketRef.current.emit('join-room', roomId);

                socketRef.current.on('user-connected', (userId) => {
                    callUser(userId, stream);
                    otherUser.current = userId;
                });

                socketRef.current.on('user-disconnected', () => {
                    // Maneja la desconexión
                });
            });

        socketRef.current.on('offer', handleReceiveCall);
        socketRef.current.on('answer', handleAnswer);

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    const callUser = (userId, stream) => {
        const peer = new RTCPeerConnection();
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('candidate', event.candidate, userId);
            }
        };

        peer.ontrack = (event) => {
            if (otherUser.current) {
                const video = document.createElement('video');
                video.srcObject = event.streams[0];
                document.body.appendChild(video);
            }
        };

        peer.createOffer().then((offer) => {
            peer.setLocalDescription(offer);
            socketRef.current.emit('offer', offer, userId);
        });

        peerRef.current = peer;
    };

    const handleReceiveCall = (offer) => {
        const peer = new RTCPeerConnection();
        peer.ontrack = (event) => {
            const video = document.createElement('video');
            video.srcObject = event.streams[0];
            document.body.appendChild(video);
        };

        peer.setRemoteDescription(new RTCSessionDescription(offer));

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                stream.getTracks().forEach((track) => peer.addTrack(track, stream));
            });

        peer.createAnswer().then((answer) => {
            peer.setLocalDescription(answer);
            socketRef.current.emit('answer', answer, otherUser.current);
        });
    };

    const handleAnswer = (answer) => {
        peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    return <video ref={myVideo} autoPlay playsInline />;
};

export default VideoCall;
