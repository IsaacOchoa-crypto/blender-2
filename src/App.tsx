import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasContainer } from './components/CanvasContainer';
import { ControlPanel } from './components/ControlPanel';
import { FileUploader } from './components/FileUploader';
import { LoadingOverlay } from './components/LoadingOverlay';
import { HelpCircle, Box } from 'lucide-react';
import { OptimizationGuideModal } from './components/OptimizationGuideModal';
import { VRButtonCustom } from './components/VRButtonCustom';


export default function App() {
  // --- FILE & METADATA STATES ---
  const [file, setFile] = useState<File | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string>('Toroide Procedural');
  const [metadata, setMetadata] = useState({ triangles: 0, vertices: 0 });
  const [showUploader, setShowUploader] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // --- CANVAS CONTROLS STATES ---
  const [intensity, setIntensity] = useState(1.5);
  const [ambientIntensity, setAmbientIntensity] = useState(0.4);
  const [lightColor, setLightColor] = useState('#ffffff');
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [bgType, setBgType] = useState<'color' | 'transparent' | 'env'>('transparent');
  const [bgColor, setBgColor] = useState('#0d0e12');
  const [envPreset, setEnvPreset] = useState('studio');
  const [exposure, setExposure] = useState(1.0);

  // --- PBR MATERIAL OVERRIDES ---
  const [overridePBR, setOverridePBR] = useState(false);
  const [roughness, setRoughness] = useState(0.3);
  const [metalness, setMetalness] = useState(0.85);
  const [wireframe, setWireframe] = useState(false);

  // --- CAMERA RESET KEY ---
  const [canvasKey, setCanvasKey] = useState(0);

  // --- MODEL UPLOAD HANDLER ---
  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setModelUrl(url);
    setModelName(selectedFile.name);
    setShowUploader(false);

    // Reset some overrides on load to display the model naturally
    setOverridePBR(false);
    setWireframe(false);
  }, []);

  const handleLoadSampleModel = useCallback(() => {
    setFile(null);
    setModelUrl('/models/DamagedHelmet.glb');
    setModelName('Casco Sci-Fi (Ejemplo)');
    setShowUploader(false);

    setOverridePBR(false);
    setWireframe(false);
  }, []);

  // Revoke the temporary Object URL on change or unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  // Callback triggered when the model geometry is loaded and processed
  const handleLoadMetadata = useCallback((data: { triangles: number; vertices: number; name: string }) => {
    setMetadata({
      triangles: data.triangles,
      vertices: data.vertices,
    });

    // Trigger confetti on successful custom model load
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#ec4899', '#10b981'],
    });
  }, []);

  const handleResetCamera = useCallback(() => {
    setCanvasKey((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-cyber-bg">
      {/* Dynamic 3D WebGL Canvas */}
      <CanvasContainer
        key={canvasKey}
        modelUrl={modelUrl}
        modelName={modelName}
        intensity={intensity}
        ambientIntensity={ambientIntensity}
        lightColor={lightColor}
        shadowsEnabled={shadowsEnabled}
        autoRotate={autoRotate}
        bgType={bgType}
        bgColor={bgColor}
        envPreset={envPreset}
        overridePBR={overridePBR}
        roughness={roughness}
        metalness={metalness}
        wireframe={wireframe}
        exposure={exposure}
        onLoadMetadata={handleLoadMetadata}
      />

      {/* Elegant HUD Logo Overlay */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none select-none">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl">
          <Box className="w-5 h-5 text-cyber-primary animate-pulse" />
          <div>
            <h1 className="text-xs font-black tracking-wider uppercase text-white font-mono leading-none">
              Blender Web Render
            </h1>
            <p className="text-[9px] text-cyber-muted font-mono leading-none mt-1">
              Mobile-First PBR Engine v1.0
            </p>
          </div>
        </div>
      </div>

      {/* VR Button HUD Overlay */}
      <div className="absolute top-4 right-4 md:right-20 z-30">
        <VRButtonCustom />
      </div>

      {/* Control Panel (Responsive overlay) */}
      <ControlPanel
        modelName={modelName}
        triangles={metadata.triangles}
        vertices={metadata.vertices}
        intensity={intensity}
        setIntensity={setIntensity}
        ambientIntensity={ambientIntensity}
        setAmbientIntensity={setAmbientIntensity}
        lightColor={lightColor}
        setLightColor={setLightColor}
        shadowsEnabled={shadowsEnabled}
        setShadowsEnabled={setShadowsEnabled}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        bgType={bgType}
        setBgType={setBgType}
        bgColor={bgColor}
        setBgColor={setBgColor}
        envPreset={envPreset}
        setEnvPreset={setEnvPreset}
        overridePBR={overridePBR}
        setOverridePBR={setOverridePBR}
        roughness={roughness}
        setRoughness={setRoughness}
        metalness={metalness}
        setMetalness={setMetalness}
        wireframe={wireframe}
        setWireframe={setWireframe}
        exposure={exposure}
        setExposure={setExposure}
        onUploadClick={() => setShowUploader(true)}
        onResetCamera={handleResetCamera}
        onOpenGuide={() => setShowGuide(true)}
      />

      {/* Main File Loading Dialog Overlay */}
      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-cyber-bg/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="glass-panel-glow p-6 sm:p-8 rounded-3xl max-w-xl w-full relative flex flex-col space-y-6"
            >
              {/* Close Button if we can revert to a model */}
              {(file || modelUrl) && (
                <button
                  onClick={() => setShowUploader(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cyber-muted hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary via-white to-cyber-secondary">
                  Visor 3D de Blender
                </h2>
                <p className="text-xs sm:text-sm text-cyber-muted max-w-md mx-auto">
                  Renderiza tus modelos exportados con iluminación global en tiempo real y optimizado para GPU móviles.
                </p>
              </div>

              <FileUploader
                onFileSelect={handleFileSelect}
                onDismiss={() => setShowUploader(false)}
                showDismiss={!file}
                onLoadSampleModel={handleLoadSampleModel}
              />

              {/* Technical Notice */}
              <div className="flex gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
                <HelpCircle className="w-5 h-5 text-cyber-primary shrink-0 mt-0.5" />
                <div className="space-y-2 flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Instrucciones de Blender
                    </h4>
                    <button
                      onClick={() => setShowGuide(true)}
                      className="text-[10px] text-cyber-primary hover:text-white font-bold transition-colors uppercase tracking-wider bg-transparent border-0 cursor-pointer p-0"
                    >
                      Ver Guía Completa
                    </button>
                  </div>
                  <p className="text-[10px] text-cyber-muted leading-relaxed">
                    Para un renderizado óptimo, exporta tu modelo como <span className="text-white">glTF 2.0 (.glb)</span> con las opciones de <span className="text-white">Format: Binary</span>, incluye los materiales/texturas correspondientes y asegúrate de aplicar las transformaciones (Ctrl+A en Blender) antes de exportar.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* R3F Loading Overlay */}
      <LoadingOverlay />

      {/* Blender Optimization Guide Modal */}
      <OptimizationGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}

// Inline X component to avoid missing import
function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
