import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onDismiss?: () => void;
  showDismiss?: boolean;
  onLoadSampleModel?: () => void;
}

export function FileUploader({
  onFileSelect,
  onDismiss,
  showDismiss = true,
  onLoadSampleModel,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'glb' || extension === 'gltf') {
      onFileSelect(file);
    } else {
      setError('Formato no soportado. Selecciona un archivo .glb o .gltf');
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center p-1">
      {/* 1. GLOWS (Sci-Fi Ambient Lighting) */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />

      {/* 2. CONTENEDOR (Glassmorphism Modal Body) */}
      <div className="relative w-full bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col space-y-6 shadow-2xl overflow-hidden">
        {/* Decorative corner grid */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-3xl pointer-events-none" />
        
        {/* Title and Metadata */}
        <div className="text-center space-y-1.5 z-10">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] uppercase font-bold tracking-widest text-cyan-400 font-mono">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> WebGL Render Core
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-indigo-400 uppercase font-mono">
            NEXUS VISOR 3D
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto font-sans">
            Renderizado de fidelidad cinematográfica directamente en tu navegador.
          </p>
        </div>

        {/* 3. DRAG ZONE (Área Central de Arrastre) */}
        <motion.div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          animate={{
            borderColor: isDragging ? 'rgba(6, 182, 212, 0.8)' : 'rgba(255, 255, 255, 0.1)',
            backgroundColor: isDragging ? 'rgba(6, 182, 212, 0.08)' : 'rgba(255, 255, 255, 0.01)',
            boxShadow: isDragging ? '0 0 25px rgba(6, 182, 212, 0.25)' : 'none',
          }}
          transition={{ duration: 0.2 }}
          className="relative w-full aspect-[4/3] md:aspect-video rounded-2xl flex flex-col items-center justify-center border-2 border-dashed p-6 text-center cursor-pointer overflow-hidden group"
        >
          {/* Invisible File Input covering the entire drag area for touch access */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {/* Dotted helper alignment */}
          <div className="absolute inset-2 border border-white/[0.02] border-dashed rounded-xl pointer-events-none" />

          <div className="space-y-4 z-10 pointer-events-none flex flex-col items-center">
            {/* Animated Icon */}
            <motion.div
              animate={{
                scale: isDragging ? 1.15 : 1,
                y: isDragging ? -5 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5 transition-all duration-300 shadow-lg"
            >
              <Upload className="w-8 h-8 text-cyan-400" />
            </motion.div>

            <div className="space-y-1">
              <h3 className="text-sm md:text-base font-bold text-white font-mono uppercase tracking-wide">
                {isDragging ? '¡Suelta el archivo aquí!' : 'Cargar Archivo 3D'}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Arrastra tu archivo <span className="text-cyan-400 font-bold">.glb</span> o <span className="text-cyan-400 font-bold">.gltf</span>, o haz clic para explorar.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] uppercase tracking-wider text-slate-500 font-mono font-bold">
              GLB, GLTF (Max 50MB)
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl text-xs text-rose-400 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. FOOTER (Botón secundario de Escena de Prueba y Modelo de Ejemplo) */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 z-10">
          {onLoadSampleModel && (
            <button
              onClick={onLoadSampleModel}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs md:text-sm font-bold uppercase tracking-wider text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/50 active:scale-95 transition-all duration-200"
            >
              Cargar Modelo de Ejemplo (3D)
            </button>
          )}
          {showDismiss && onDismiss && (
            <button
              onClick={onDismiss}
              className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 active:scale-95 transition-all duration-200"
            >
              Explorar Modelo de Prueba
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
