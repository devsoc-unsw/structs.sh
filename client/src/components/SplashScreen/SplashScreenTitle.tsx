import React from 'react';
import Typist from 'react-typist';
import styles from './SplashScreen.module.scss';

interface Props {
  speedModifier?: number;
}

const Title: React.FC<Props> = ({ speedModifier = 1 }) => (
  <Typist avgTypingDelay={125 / speedModifier} cursor={{ show: false }}>
    <h1 className={styles.title}>
      <span className={styles.prompt}>›</span>
      {' '}
      <Typist.Delay ms={750 / speedModifier} />
      Structs.sh
    </h1>
  </Typist>
);

export default Title;
