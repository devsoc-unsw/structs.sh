import { motion } from 'framer-motion';
import React from 'react';
import '../css/timeline.css';

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
  nextStateDummy: () => void;
  nextState: () => void;
  forwardState: () => void;
  backwardState: () => void;
}

// Refactor the existing component
export const Timeline: React.FC<TimelineProp> = ({
  nextStateDummy,
  nextState,
  forwardState,
  backwardState,
}) => (
  <div className="timeline">
    <MotionButton className="state-button" onClick={nextStateDummy} buttonText="Dummy Next" />
    <MotionButton className="state-button" onClick={nextState} buttonText="Execute Next" />
    <MotionButton className="state-button" onClick={backwardState} buttonText="Backward" />
    <MotionButton className="state-button" onClick={forwardState} buttonText="Forward" />
  </div>
);
