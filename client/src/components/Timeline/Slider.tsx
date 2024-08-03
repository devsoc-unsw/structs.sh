import React from 'react';
import * as Internal from '@radix-ui/react-slider';
import styles from 'styles/Timeline.module.css';

const Slider = ({
  max,
  value,
  onChange,
}: {
  max: number;
  value: number;
  onChange: (value: number[]) => void;
}) => (
  <Internal.Root
    className={styles.SliderRoot}
    max={max}
    value={[value]}
    step={1}
    onValueChange={onChange}
  >
    <Internal.Track className={styles.SliderTrack}>
      <Internal.Range className={styles.SliderRange} />
    </Internal.Track>
    <Internal.Thumb className={styles.SliderThumb} aria-label="Timeline" />
  </Internal.Root>
);

export default Slider;
