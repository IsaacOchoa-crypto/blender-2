import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoadingOverlay() {
  const { active, progress } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cyber-bg/90 backdrop-blur-md"
        >
          {/* Glass Card */}
          <div className="glass-panel-glow p-8 rounded-2xl max-w-sm w-full mx-4 flex flex-col items-center text-center space-y-6">
            {/* Spinning Indicator */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-cyber-primary/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyber-primary animate-spin" />
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-cyber-primary animate-ping opacity-30" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-wide text-white uppercase">
                Procesando Modelo
              </h3>
              <p className="text-sm text-cyber-muted">
                Cargando búfer de texturas y mallas 3D...
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-2">
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                {/* Glowing progress filler */}
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full shadow-cyber-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-cyber-primary">
                <span>WebGL Pipeline</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
