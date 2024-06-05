import React, { useEffect, useRef } from 'react';
import Rive from '@rive-app/react-canvas';

function ComponenteRive() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const rive = new Rive({
            src: '/assets/riv',  // Asegúrate de que esta ruta es correcta
            canvas: canvasRef.current,
            autoplay: true,
        });

        return () => {
            rive.cleanup();
        };
    }, []);

    return <canvas ref={canvasRef}></canvas>;
}

export default ComponenteRive;
