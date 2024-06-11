import React, { useState } from 'react';
import styles from '../assets/css/NivelSelector.module.css';

const NivelSelector = ({ niveles, setNiveles }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNivelChange = (event) => {
    const value = event.target.value;
    setNiveles(prevNiveles =>
      prevNiveles.includes(value) ? prevNiveles.filter(nivel => nivel !== value) : [...prevNiveles, value]
    );
  };

  return (
    <div className={styles.nivelSelector}>
      <div className={styles.selectorHeader} onClick={() => setIsOpen(!isOpen)}>
        Seleccionar Niveles <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className={styles.selectorOptions}>
          <label>
            <input
              type="checkbox"
              value="infantil"
              checked={niveles.includes('infantil')}
              onChange={handleNivelChange}
            />
            Infantil
          </label>
          <label>
            <input
              type="checkbox"
              value="primaria"
              checked={niveles.includes('primaria')}
              onChange={handleNivelChange}
            />
            Primaria
          </label>
          <label>
            <input
              type="checkbox"
              value="secundaria"
              checked={niveles.includes('secundaria')}
              onChange={handleNivelChange}
            />
            Secundaria
          </label>
        </div>
      )}
    </div>
  );
};

export default NivelSelector;
