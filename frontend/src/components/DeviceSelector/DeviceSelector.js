import React from 'react';

const DeviceSelector = ({
  videoDevices,
  audioDevices,
  selectedVideoDevice,
  setSelectedVideoDevice,
  selectedAudioDevice,
  setSelectedAudioDevice,
}) => (
  <div>
    {/* Selector de cámara */}
    <div>
      <label>Cámara:</label>
      <select
        value={selectedVideoDevice}
        onChange={(e) => setSelectedVideoDevice(e.target.value)}
      >
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Cámara ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>

    {/* Selector de micrófono */}
    <div>
      <label>Micrófono:</label>
      <select
        value={selectedAudioDevice}
        onChange={(e) => setSelectedAudioDevice(e.target.value)}
      >
        {audioDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Micrófono ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default DeviceSelector;
