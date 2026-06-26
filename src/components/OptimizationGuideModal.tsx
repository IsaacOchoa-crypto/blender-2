import { motion } from 'framer-motion';
import { 
  X, 
  HelpCircle, 
  Layers, 
  Compass, 
  FileCode, 
  Flame, 
  Copy, 
  Check, 
  Download 
} from 'lucide-react';
import { useState } from 'react';

interface OptimizationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OptimizationGuideModal({ isOpen, onClose }: OptimizationGuideModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonScript = `import bpy
import os

def optimize_and_export_gltf(filepath, export_selected=True):
    """
    Automates the optimization of meshes and exports them to glTF/glb format.
    Following the 4 rules of WebGL optimization:
    1. Apply all modifiers.
    2. Recalculate normals (pointing outwards).
    3. Triangulate geometry.
    4. Export to .glb with +Y Up, selected objects, normals/UVs enabled, vertex colors disabled.
    """
    initial_selected = list(bpy.context.selected_objects)
    initial_active = bpy.context.active_object
    
    meshes = [obj for obj in initial_selected if obj.type == 'MESH']
    if not meshes:
        meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
        for obj in meshes:
            obj.select_set(True)
            
    if not meshes:
        print("Error: No meshes found.")
        return False
        
    if bpy.ops.object.mode_set.poll():
        bpy.ops.object.mode_set(mode='OBJECT')
        
    for obj in meshes:
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.convert(target='MESH') # Apply all modifiers
        
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode='OBJECT')
        
        tri_mod = obj.modifiers.new(name="Auto_Triangulate", type='TRIANGULATE')
        bpy.ops.object.modifier_apply(modifier=tri_mod.name)
        
    bpy.ops.object.select_all(action='DESELECT')
    for obj in meshes:
        obj.select_set(True)
    if meshes:
        bpy.context.view_layer.objects.active = meshes[0]
        
    output_dir = os.path.dirname(filepath)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    try:
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            export_format='GLB',
            export_selected=export_selected,
            export_apply=True,
            export_yup=True,
            export_texcoords=True,
            export_normals=True,
            export_colors=False,
            export_materials='EXPORT',
            export_cameras=False,
            export_lights=False
        )
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([pythonScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'export_optimizer.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-bg/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="glass-panel-glow max-w-3xl w-full rounded-3xl p-6 md:p-8 flex flex-col space-y-6 relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyber-muted hover:text-white hover:border-white/20 transition-all min-h-[40px] min-w-[40px] z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center md:text-left pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyber-primary/10 border border-cyber-primary/20 text-xs font-bold text-cyber-primary uppercase tracking-wider font-mono">
            Guía de Optimización
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyber-primary via-white to-cyber-secondary">
            Preparación de Modelos de Blender
          </h2>
          <p className="text-xs md:text-sm text-cyber-muted">
            Sigue estos pasos cruciales para asegurar que tus modelos 3D se rendericen con texturas impecables, iluminación realista y alto rendimiento en WebGL.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step 1 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyber-primary/10 border border-cyber-primary/20 flex items-center justify-center text-cyber-primary">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Estandarización de Materiales
              </h3>
            </div>
            <p className="text-xs text-cyber-muted leading-relaxed flex-grow">
              glTF solo entiende sombreado PBR estándar. Usa exclusivamente el nodo <strong className="text-white">Principled BSDF</strong> en Blender. Conecta tus mapas directo a:
            </p>
            <ul className="text-[11px] text-cyber-muted space-y-1 font-mono bg-black/20 p-2 rounded-lg border border-white/5">
              <li>• Base Color ➔ Albedo / Color</li>
              <li>• Metallic ➔ Mapa de Metalicidad</li>
              <li>• Roughness ➔ Mapa de Rugosidad</li>
              <li>• Normal ➔ Normal Map (con nodo intermedio)</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyber-secondary/10 border border-cyber-secondary/20 flex items-center justify-center text-cyber-secondary">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Horneado de Texturas (Baking)
              </h3>
            </div>
            <p className="text-xs text-cyber-muted leading-relaxed flex-grow">
              Si creaste texturas procedurales (como Wave o Noise), debes "hornearlas" en imágenes 2D para que WebGL las cargue:
            </p>
            <ol className="text-[11px] text-cyber-muted space-y-1 list-decimal list-inside bg-black/20 p-2.5 rounded-lg border border-white/5 leading-relaxed">
              <li>Haz un <span className="text-white font-medium">UV Unwrap</span> del objeto.</li>
              <li>Crea un nodo <span className="text-white font-medium">Image Texture</span> (seleccionado, sin conectar).</li>
              <li>Cambia el motor de render a <span className="text-white font-medium">Cycles</span>.</li>
              <li>En la sección <span className="text-white font-medium">Bake</span>, hornea el pase de textura.</li>
            </ol>
          </div>

          {/* Step 3 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyber-accent/10 border border-cyber-accent/20 flex items-center justify-center text-cyber-accent">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Geometría y Modificadores
              </h3>
            </div>
            <p className="text-xs text-cyber-muted leading-relaxed flex-grow">
              La GPU web requiere geometría limpia para no degradar los FPS:
            </p>
            <ul className="text-[11px] text-cyber-muted space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5 leading-relaxed">
              <li>
                <strong className="text-white">Aplica modificadores:</strong> Colapsa modificadores (Arrays, Bevels, Booleans).
              </li>
              <li>
                <strong className="text-white">Recalcula normales:</strong> Selecciona todo en Modo Edición y presiona <kbd className="bg-white/10 px-1 rounded text-white font-mono text-[9px]">Shift + N</kbd> para evitar iluminación invertida.
              </li>
              <li>
                <strong className="text-white">Triangulación:</strong> Se recomienda aplicar el modificador <em className="not-italic text-white">Triangulate</em> para predecir cortes de polígonos.
              </li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                4. Configuración del Exportador
              </h3>
            </div>
            <p className="text-xs text-cyber-muted leading-relaxed flex-grow">
              Al exportar en Blender (<kbd className="bg-white/10 px-1 rounded text-white font-mono text-[9px]">File &gt; Export &gt; glTF 2.0</kbd>), configura lo siguiente:
            </p>
            <ul className="text-[11px] text-cyber-muted space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5 font-mono">
              <li>• Format: <span className="text-white">glTF Binary (.glb)</span></li>
              <li>• Include: <span className="text-white">Selected Objects</span> (opcional)</li>
              <li>• Transform: <span className="text-cyber-primary font-bold">+Y Up</span> (WebGL vertical)</li>
              <li>• Geometry: <span className="text-white">Apply Modifiers, UVs, Normals</span></li>
              <li>• Vertex Colors: <span className="text-cyber-secondary">Desmarcar</span> (para reducir peso)</li>
            </ul>
          </div>
        </div>

        {/* Python automation section */}
        <div className="bg-cyber-primary/5 border border-cyber-primary/20 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-primary/10 border border-cyber-primary/25 flex items-center justify-center text-cyber-primary shrink-0">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                Script de Automatización en Python
              </h4>
              <p className="text-xs text-cyber-muted leading-relaxed max-w-lg">
                Hemos creado un script que realiza automáticamente el colapso de modificadores, el recálculo de normales, la triangulación y la exportación correcta de tus mallas dentro de Blender.
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={handleCopy}
              className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all min-h-[40px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-cyber-accent" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Código
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyber-primary to-cyber-secondary font-bold text-xs uppercase tracking-wider text-white shadow-cyber-glow hover:brightness-110 flex items-center justify-center gap-1.5 transition-all min-h-[40px]"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
