import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  ChevronRight,
  Sun,
  Eye,
  Camera,
  Database,
  Upload,
  RefreshCw,
  FolderOpen,
  Info,
} from 'lucide-react';

interface ControlPanelProps {
  modelName: string;
  triangles: number;
  vertices: number;
  intensity: number;
  setIntensity: (val: number) => void;
  ambientIntensity: number;
  setAmbientIntensity: (val: number) => void;
  lightColor: string;
  setLightColor: (val: string) => void;
  shadowsEnabled: boolean;
  setShadowsEnabled: (val: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: (val: boolean) => void;
  bgType: 'color' | 'transparent' | 'env';
  setBgType: (val: 'color' | 'transparent' | 'env') => void;
  bgColor: string;
  setBgColor: (val: string) => void;
  envPreset: string;
  setEnvPreset: (val: string) => void;
  overridePBR: boolean;
  setOverridePBR: (val: boolean) => void;
  roughness: number;
  setRoughness: (val: number) => void;
  metalness: number;
  setMetalness: (val: number) => void;
  wireframe: boolean;
  setWireframe: (val: boolean) => void;
  exposure: number;
  setExposure: (val: number) => void;
  onUploadClick: () => void;
  onResetCamera: () => void;
  onOpenGuide: () => void;
}

export function ControlPanel({
  modelName,
  triangles,
  vertices,
  intensity,
  setIntensity,
  ambientIntensity,
  setAmbientIntensity,
  lightColor,
  setLightColor,
  shadowsEnabled,
  setShadowsEnabled,
  autoRotate,
  setAutoRotate,
  bgType,
  setBgType,
  bgColor,
  setBgColor,
  envPreset,
  setEnvPreset,
  overridePBR,
  setOverridePBR,
  roughness,
  setRoughness,
  metalness,
  setMetalness,
  wireframe,
  setWireframe,
  exposure,
  setExposure,
  onUploadClick,
  onResetCamera,
  onOpenGuide,
}: ControlPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'lights' | 'camera' | 'materials' | 'info'>('lights');

  // Detect mobile viewport
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
      // Close by default on mobile, open by default on desktop
      setIsOpen(window.innerWidth >= 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Helper custom switch component (touch target >= 48px)
  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    icon: Icon,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    label: string;
    icon?: any;
  }) => (
    <label className="flex items-center justify-between cursor-pointer py-3 px-1 min-h-[48px] select-none hover:bg-white/[0.02] rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-4 h-4 text-cyber-muted" />}
        <span className="text-sm font-medium text-cyber-text">{label}</span>
      </div>
      <div className="relative inline-flex items-center min-h-[48px] px-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-10 h-5 bg-white/10 rounded-full transition-colors duration-200 ${checked ? 'bg-cyber-primary' : 'bg-white/10'}`} />
        <div
          className={`absolute top-3.5 left-2 bg-white w-3 h-3 rounded-full transition-transform duration-200 ${
            checked ? 'transform translate-x-5 bg-white shadow-cyber-glow' : 'bg-cyber-muted'
          }`}
        />
      </div>
    </label>
  );

  return (
    <>
      {/* --- DESKTOP TOGGLE BUTTON --- */}
      {!isMobile && !isOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsOpen(true)}
          className="absolute right-4 top-4 z-40 w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-white hover:border-cyber-primary/60 transition-colors shadow-glass min-h-[48px] min-w-[48px]"
        >
          <Settings className="w-5 h-5 text-cyber-primary animate-pulse-slow" />
        </motion.button>
      )}

      {/* --- MOBILE COLLAPSED FLOATING HEADER --- */}
      {isMobile && !isOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-4 right-4 z-40 glass-panel p-3 rounded-2xl flex items-center justify-between shadow-glass"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-cyber-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-cyber-muted font-mono truncate">Modelo Activo</p>
              <h4 className="text-sm font-bold text-white truncate">{modelName}</h4>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onUploadClick}
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white min-h-[48px] min-w-[48px]"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-xs uppercase tracking-wider text-white shadow-cyber-glow flex items-center gap-1.5 min-h-[48px] min-w-[48px]"
            >
              <Settings className="w-3.5 h-3.5" />
              Controles
            </button>
          </div>
        </motion.div>
      )}

      {/* --- PANEL PRINCIPAL CONTAINER --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`z-40 glass-panel shadow-glass flex flex-col ${
              isMobile
                ? 'absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-3xl border-t border-white/10'
                : 'absolute right-0 top-0 bottom-0 w-96 border-l border-white/10'
            }`}
          >
            {/* Header / Tirador */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyber-primary" />
                <h3 className="font-bold text-white tracking-wide uppercase text-sm">Visualizador 3D</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onUploadClick}
                  className="px-3 py-1.5 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 text-xs font-bold text-cyber-primary hover:bg-cyber-primary/20 transition-all flex items-center gap-1.5 min-h-[36px]"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Cargar
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyber-muted hover:text-white transition-colors min-h-[32px] min-w-[32px]"
                >
                  {isMobile ? <ChevronRight className="w-4 h-4 rotate-90" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Tabs de Navegación */}
            <div className="flex border-b border-white/5 bg-black/10 shrink-0">
              {(['lights', 'materials', 'camera', 'info'] as const).map((tab) => {
                const label = {
                  lights: 'Luces',
                  materials: 'Física PBR',
                  camera: 'Escena',
                  info: 'Datos GLTF',
                }[tab];
                const Icon = {
                  lights: Sun,
                  materials: Eye,
                  camera: Camera,
                  info: Info,
                }[tab];

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold flex flex-col items-center gap-1 border-b-2 transition-all ${
                      activeTab === tab
                        ? 'border-cyber-primary text-cyber-primary bg-cyber-primary/5'
                        : 'border-transparent text-cyber-muted hover:text-white hover:bg-white/[0.01]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Contenido Desplazable */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* --- TAB LUCES --- */}
              {activeTab === 'lights' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-cyber-muted">Intensidad Direccional</span>
                      <span className="text-cyber-primary font-mono">{intensity.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center min-h-[48px]">
                      <input
                        type="range"
                        min="0"
                        max="4"
                        step="0.1"
                        value={intensity}
                        onChange={(e) => setIntensity(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-cyber-muted">Luz de Relleno (Ambient)</span>
                      <span className="text-cyber-primary font-mono">{ambientIntensity.toFixed(1)}x</span>
                    </div>
                    <div className="flex items-center min-h-[48px]">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={ambientIntensity}
                        onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-cyber-muted block">Color de la Luz</span>
                    <div className="flex items-center gap-3 min-h-[48px]">
                      <input
                        type="color"
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-sm font-mono text-white">{lightColor.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-cyber-muted block">Entorno HDRI (Estudio)</span>
                    <select
                      value={envPreset}
                      onChange={(e) => setEnvPreset(e.target.value)}
                      className="w-full cyber-input min-h-[48px]"
                    >
                      <option value="studio">Studio (Neutral)</option>
                      <option value="sunset">Sunset (Cálido)</option>
                      <option value="city">City (Urbano)</option>
                      <option value="warehouse">Warehouse (Industrial)</option>
                      <option value="lobby">Lobby (Interiores)</option>
                    </select>
                  </div>

                  <ToggleSwitch
                    checked={shadowsEnabled}
                    onChange={setShadowsEnabled}
                    label="Sombras Dinámicas"
                    icon={Sun}
                  />
                </div>
              )}

              {/* --- TAB MATERIALES --- */}
              {activeTab === 'materials' && (
                <div className="space-y-5">
                  <ToggleSwitch
                    checked={overridePBR}
                    onChange={setOverridePBR}
                    label="Sobrescribir Materiales PBR"
                    icon={Settings}
                  />

                  {overridePBR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-5 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-cyber-muted">Rugosidad (Roughness)</span>
                          <span className="text-cyber-primary font-mono">{roughness.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center min-h-[48px]">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={roughness}
                            onChange={(e) => setRoughness(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <p className="text-[10px] text-cyber-muted italic">
                          Valores bajos hacen la superficie brillante y reflectiva; valores altos la vuelven opaca.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-cyber-muted">Metalicidad (Metalness)</span>
                          <span className="text-cyber-primary font-mono">{metalness.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center min-h-[48px]">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={metalness}
                            onChange={(e) => setMetalness(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <p className="text-[10px] text-cyber-muted italic">
                          Valores altos dotan a la malla de propiedades metálicas y reflejos de entorno de alta fidelidad.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="border-t border-white/5 my-2" />

                  <ToggleSwitch
                    checked={wireframe}
                    onChange={setWireframe}
                    label="Modo Alambre (Wireframe)"
                    icon={Eye}
                  />
                </div>
              )}

              {/* --- TAB ESCENA & CÁMARA --- */}
              {activeTab === 'camera' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-cyber-muted">Exposición del Render (ToneMapping)</span>
                      <span className="text-cyber-primary font-mono">{exposure.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center min-h-[48px]">
                      <input
                        type="range"
                        min="0.2"
                        max="2.5"
                        step="0.05"
                        value={exposure}
                        onChange={(e) => setExposure(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <ToggleSwitch
                    checked={autoRotate}
                    onChange={setAutoRotate}
                    label="Auto-rotación de Cámara"
                    icon={RefreshCw}
                  />

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-cyber-muted block">Fondo del Canvas</span>
                    <div className="flex rounded-lg overflow-hidden border border-white/10 p-1 bg-black/20 min-h-[48px] items-center">
                      {(['color', 'env', 'transparent'] as const).map((type) => {
                        const label = {
                          color: 'Color',
                          env: 'Entorno',
                          transparent: 'Transp.',
                        }[type];
                        return (
                          <button
                            key={type}
                            onClick={() => setBgType(type)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                              bgType === type
                                ? 'bg-cyber-primary text-white shadow-cyber-glow'
                                : 'text-cyber-muted hover:text-white'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {bgType === 'color' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-2 bg-white/[0.02] border border-white/5 rounded-xl p-3"
                    >
                      <span className="text-xs font-semibold text-cyber-muted block">Color de Fondo</span>
                      <div className="flex items-center gap-3 min-h-[48px]">
                        <input
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                        />
                        <span className="text-sm font-mono text-white">{bgColor.toUpperCase()}</span>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={onResetCamera}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <Camera className="w-4 h-4 text-cyber-primary" />
                    Resetear Vista de Cámara
                  </button>
                </div>
              )}

              {/* --- TAB INFORMACIÓN TÉCNICA --- */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-cyber-muted block font-mono uppercase tracking-wider">
                        Nombre del Archivo
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{modelName}</h4>
                    </div>

                    <div className="border-t border-white/5" />

                    <div className="grid grid-cols-2 gap-4 font-mono">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-cyber-muted uppercase tracking-wider">
                          Triángulos
                        </span>
                        <p className="text-base font-bold text-white">
                          {triangles > 0 ? formatNumber(triangles) : 'N/A'}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] text-cyber-muted uppercase tracking-wider">
                          Vértices
                        </span>
                        <p className="text-base font-bold text-white">
                          {vertices > 0 ? formatNumber(vertices) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-white/5" />

                    <div className="space-y-1">
                      <span className="text-xs text-cyber-muted block font-mono uppercase tracking-wider">
                        Motor de Render
                      </span>
                      <p className="text-xs text-cyber-primary font-bold">
                        WebGL 2.0 (Three.js + R3F)
                      </p>
                    </div>
                  </div>

                  <div className="bg-cyber-glow/5 border border-cyber-primary/20 rounded-xl p-3 flex gap-2">
                    <Info className="w-4 h-4 text-cyber-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-cyber-muted leading-relaxed">
                      El conteo de polígonos representa las mallas renderizadas en la escena. Si exportaste tu diseño desde Blender con el modificador "Decimate" o "Subdivision Surface", estas estadísticas reflejarán la malla optimizada/final.
                    </p>
                  </div>

                  <button
                    onClick={onOpenGuide}
                    className="w-full py-3 rounded-xl bg-cyber-primary/10 border border-cyber-primary/20 text-xs font-bold text-cyber-primary hover:bg-cyber-primary/20 hover:text-white transition-all flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <Info className="w-4 h-4" />
                    Ver Guía de Optimización de Blender
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
