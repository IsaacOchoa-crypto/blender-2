import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';
import { XR, XROrigin, TeleportTarget } from '@react-three/xr';
import { ModelLoader } from './ModelLoader';
import { FallbackModel } from './FallbackModel';
import { xrStore } from '../xrStore';

interface CanvasContainerProps {
  modelUrl: string | null;
  modelName: string;
  intensity: number;
  ambientIntensity: number;
  lightColor: string;
  shadowsEnabled: boolean;
  autoRotate: boolean;
  bgType: 'color' | 'transparent' | 'env';
  bgColor: string;
  envPreset: string;
  overridePBR: boolean;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  exposure: number;
  onLoadMetadata: (metadata: { triangles: number; vertices: number; name: string }) => void;
}

// Controller component to dynamically update WebGL renderer settings (e.g. exposure)
function RendererController({ exposure }: { exposure: number }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMappingExposure = exposure;
  }, [gl, exposure]);
  return null;
}

export function CanvasContainer({
  modelUrl,
  modelName,
  intensity,
  ambientIntensity,
  lightColor,
  shadowsEnabled,
  autoRotate,
  bgType,
  bgColor,
  envPreset,
  overridePBR,
  roughness,
  metalness,
  wireframe,
  exposure,
  onLoadMetadata,
}: CanvasContainerProps) {
  const [xrPosition, setXrPosition] = useState(new THREE.Vector3(0, -2.5, 0));

  return (
    <div className="w-full h-full webgl-container relative">
      <Canvas
        shadows={shadowsEnabled ? 'soft' : false}
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        dpr={[1, 1.5]} // Limit pixel ratio to protect GPU on high-density mobile screens
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <XR store={xrStore}>
          <RendererController exposure={exposure} />

        {/* Set Canvas Background color if selected */}
        {bgType === 'color' && <color attach="background" args={[bgColor]} />}
        {bgType === 'transparent' && null}

        {/* Ambient fill light */}
        <ambientLight intensity={ambientIntensity} color={lightColor} />

        {/* Directional support light with optimized shadow resolution */}
        <directionalLight
          castShadow={shadowsEnabled}
          intensity={intensity}
          color={lightColor}
          position={[5, 8, 5]}
          shadow-mapSize={[1024, 1024]} // Protect mobile memory
          shadow-bias={-0.0001}
        />

        <Suspense fallback={null}>
          <Center>
            {modelUrl ? (
              <ModelLoader
                url={modelUrl}
                name={modelName}
                overridePBR={overridePBR}
                roughness={roughness}
                metalness={metalness}
                wireframe={wireframe}
                onLoadMetadata={onLoadMetadata}
              />
            ) : (
              <FallbackModel
                overridePBR={overridePBR}
                roughness={roughness}
                metalness={metalness}
                wireframe={wireframe}
              />
            )}
          </Center>

          {/* Environmental HDRI Lighting */}
          <Environment
            preset={envPreset as any}
            background={bgType === 'env'}
          />
        </Suspense>

        {/* Orbit Controls optimized for touch interactions */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={1.2}
          maxDistance={15}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
        />

        <XROrigin position={xrPosition} />

        <TeleportTarget onTeleport={setXrPosition}>
          <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </TeleportTarget>
      </XR>
    </Canvas>
  </div>
);
}
