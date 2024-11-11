// backend/config/mediasoupConfig.js
module.exports = {
    mediasoup: {
        worker: {
            rtcMinPort: 10000,
            rtcMaxPort: 10100,
            logLevel: 'warn',
        },
        webRtcTransport: {
            listenIps: [
                { ip: '0.0.0.0', announcedIp: null }
            ],
            initialAvailableOutgoingBitrate: 1000000,
            maxIncomingBitrate: 1500000
        }
    }
};
