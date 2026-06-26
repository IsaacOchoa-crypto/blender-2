import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { xrStore } from '../xrStore';

// Beautiful custom VR Headset SVG icon
const VRHeadsetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M4 8h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
    <path d="M10 8V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v3" />
    <circle cx="7.5" cy="12.5" r="1" />
    <circle cx="16.5" cy="12.5" r="1" />
    <path d="M12 14v-1" />
  </svg>
);

export function VRButtonCustom() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    // Check if WebXR immersive-vr mode is supported
    if ('xr' in navigator && (navigator as any).xr) {
      (navigator as any).xr.isSessionSupported('immersive-vr').then(setIsSupported);
    }

    // Subscribe to xrStore to know if we are presenting
    const unsub = xrStore.subscribe((state) => {
      setIsPresenting(!!state.session);
    });

    return unsub;
  }, []);

  const handleClick = () => {
    if (!isSupported) {
      alert(
        'El soporte de Realidad Virtual (WebXR) no está disponible en este navegador.\n\nRecomendaciones:\n1. Utiliza el navegador nativo en tus gafas Meta Quest.\n2. Si estás en PC, asegúrate de tener un visor conectado o usa la extensión Chrome Immersive Web Emulator.'
      );
      return;
    }

    if (isPresenting) {
      xrStore.getState().session?.end();
    } else {
      xrStore.enterVR();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border backdrop-blur-md font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-300 z-30 cursor-pointer shadow-lg ${
        isPresenting
          ? 'bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30 shadow-red-500/10'
          : 'bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/20 shadow-black/20'
      }`}
    >
      <VRHeadsetIcon />
      <span>{isPresenting ? 'Salir de VR' : isSupported ? 'Entrar en VR' : 'VR No Soportado'}</span>
    </motion.button>
  );
}
