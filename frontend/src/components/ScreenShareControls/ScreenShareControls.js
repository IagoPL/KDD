import React from 'react';

const ScreenShareControls = ({
  resolutions,
  selectedResolution,
  setSelectedResolution,
  fpsOptions,
  selectedFPS,
  setSelectedFPS,
}) => (
  <div>
    {/* Selector de resolución */}
    <div>
      <label>Resolución:</label>
      <select
        value={selectedResolution?.label || ''}
        onChange={(e) =>
          setSelectedResolution(
            resolutions.find((res) => res.label === e.target.value)
          )
        }
      >
        {resolutions.map((res) => (
          <option key={res.label} value={res.label}>
            {res.label}
          </option>
        ))}
      </select>
    </div>

    {/* Selector de FPS */}
    <div>
      <label>FPS:</label>
      <select
        value={selectedFPS || ''}
        onChange={(e) => setSelectedFPS(Number(e.target.value))}
      >
        {fpsOptions.map((fps) => (
          <option key={fps} value={fps}>
            {fps} FPS
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default ScreenShareControls;
