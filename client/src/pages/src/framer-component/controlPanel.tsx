import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowPointer,
  faBug,
  faLightbulb,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons"; // Add faLock and faUnlock
import { UiState } from "./types/uiState";
import "./css/controlPanel.css";

interface ControlPanelProps {
  settings: UiState;
  setSettings: React.Dispatch<React.SetStateAction<UiState>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  setSettings,
}) => {
  const [shakePointer, setShakePointer] = useState(false);
  const [shakeLightbulb, setShakeLightbulb] = useState(false);
  const [isLocked, setIsLocked] = useState(!settings.canDrag);
  const [isDebug, setIsDebug] = useState(settings.debug);

  const handlePointerClick = () => {
    setShakePointer(true);
    setTimeout(() => setShakePointer(false), 1000);
  };

  const handleLightbulbClick = () => {
    setShakeLightbulb(true);
    setTimeout(() => setShakeLightbulb(false), 1000);
  };

  const handleLockClick = () => {
    setIsLocked(!isLocked);
    setSettings({ ...settings, canDrag: isLocked });
  };

  const handleDebugClick = () => {
    // added this function
    setIsDebug(!isDebug);
    setSettings({ ...settings, debug: isDebug });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="icon-row">
        <FontAwesomeIcon
          icon={faArrowPointer}
          shake={shakePointer}
          className="fa-2x icon-item"
          onClick={handlePointerClick}
        />
        <span className="tooltip">Plan to implement admin feature boo boo</span>
      </div>
      <div className="icon-row">
        <FontAwesomeIcon
          icon={faLightbulb}
          shake={shakeLightbulb}
          className="fa-2x icon-item"
          onClick={handleLightbulbClick}
        />
        <span className="tooltip">
          Plan to implement admin feature boo booe
        </span>
      </div>
      <div className="icon-row">
        <FontAwesomeIcon
          icon={isLocked ? faLock : faUnlock} // Switch between faLock and faUnlock based on isLocked state
          className="fa-2x icon-item"
          onClick={handleLockClick}
        />
        <span className="tooltip">Click to {isLocked ? "lock" : "unlock"}</span>{" "}
        {/* Change tooltip text based on isLocked state */}
      </div>
      <div className="icon-row">
        <FontAwesomeIcon
          icon={faBug} // Use faBug icon
          className="fa-2x icon-item"
          onClick={handleDebugClick} // Use handleDebugClick function
        />
        <span className="tooltip">Debug Mode: {isDebug ? "On" : "Off"}</span>{" "}
        {/* Change tooltip text based on isDebug state */}
      </div>
    </div>
  );
};
