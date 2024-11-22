// src/components/Controls/Controls.js

import React from 'react';
import { MESSAGES } from '../../utils/constants';

const Controls = ({
  isVideoEnabled,
  toggleCamera,
  startScreenShare,
  stopScreenShare,
  screenStream,
}) => (
  <div>
    <button onClick={toggleCamera}>
      {isVideoEnabled ? MESSAGES.cameraOn : MESSAGES.cameraOff}
    </button>
    <button onClick={startScreenShare}>{MESSAGES.screenShareStart}</button>
    <button onClick={stopScreenShare} disabled={!screenStream}>
      {MESSAGES.screenShareStop}
    </button>
  </div>
);

export default Controls;
