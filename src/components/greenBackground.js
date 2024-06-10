import React from 'react';
import styles from '../assets/css/GreenBackgroundLayout.module.css';

const GreenBackgroundLayout = ({ children }) => {
  return <div className={styles.greenBackground}>{children}</div>;
};

export default GreenBackgroundLayout;
