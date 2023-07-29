import { motion } from 'framer-motion';
import React from 'react';

const MotionButton: React.FC<{
  className: string;
  onClick: () => void;
  buttonText: string;
}> = ({ className, onClick, buttonText }) => (
  <motion.button
    className={className}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
  >
    {buttonText}
  </motion.button>
);

export interface TimelineProp {
  nextState: () => void;
  forwardState: () => void;
  backwardState: () => void;
}

// Refactor the existing component
export const Timeline: React.FC<TimelineProp> = ({ nextState, forwardState, backwardState }) => (
  <div className="timeline">
    <MotionButton
      className="state-button"
      onClick={() => {
        // Do something when "Backward" is clicked
      }}
      buttonText="Backward"
    />
    <MotionButton
      className="state-button"
      onClick={() => {
        // Do something when "Forward" is clicked
      }}
      buttonText="Forward"
    />
    <MotionButton className="state-button" onClick={nextState} buttonText="Update FramerNodes" />
  </div>
);
