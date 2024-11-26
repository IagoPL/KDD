import React from 'react';
import useMicTest from '../../hooks/useMicTest';
import { MESSAGES } from '../../utils/constants';

const MicTest = ({ stream, selectedAudioDevice }) => {
  const { volume, isMicActive, toggleMic } = useMicTest(stream, selectedAudioDevice);

  return (
    <div>
      <h3>{MESSAGES.micTestTitle}</h3>
      <button onClick={toggleMic}>
        {isMicActive ? MESSAGES.micOn : MESSAGES.micOff}
      </button>
      <div style={{ marginTop: '10px' }}>
        <label>Volumen:</label>
        <progress value={volume} max="255" style={{ width: '100%' }} />
      </div>
      {!isMicActive && <p>El micrófono está apagado</p>}
    </div>
  );
};

export default MicTest;
