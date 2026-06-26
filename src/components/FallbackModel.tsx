import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FallbackModelProps {
  overridePBR: boolean;
  roughness: number;
  metalness: number;
  wireframe: boolean;
}

export function FallbackModel({ overridePBR, roughness, metalness, wireframe }: FallbackModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);

  // Generate procedural canvas-based normal map for cool texture detail
  const normalMap = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw some techy grid lines/patterns to act as normal details
    ctx.fillStyle = '#8080ff'; // Default flat normal color
    ctx.fillRect(0, 0, size, size);

    // Draw procedural grid pattern into normal channels
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)'; // Red channel controls X offset
    ctx.lineWidth = 4;
    for (let i = 0; i < size; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // Add some random micro-details
    for (let j = 0; j < 15; j++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 10 + Math.random() * 20;
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)'; // Green channel controls Y offset
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, []);

  // Animate the procedurally generated showcase mesh
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y = -t * 0.08;
      outerMeshRef.current.rotation.z = Math.cos(t * 0.1) * 0.15;
    }
  });

  return (
    <group>
      {/* Primary High-Tech Torus Knot */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.35, 150, 20]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={overridePBR ? metalness : 0.9}
          roughness={overridePBR ? roughness : 0.1}
          wireframe={wireframe}
          normalMap={normalMap || undefined}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>

      {/* Orbiting Tech Ring */}
      <mesh ref={outerMeshRef} castShadow receiveShadow>
        <torusGeometry args={[1.8, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#ec4899"
          metalness={overridePBR ? metalness : 0.95}
          roughness={overridePBR ? roughness : 0.05}
          wireframe={wireframe}
        />
      </mesh>

      {/* Internal Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={overridePBR ? metalness : 0.8}
          roughness={overridePBR ? roughness : 0.2}
          wireframe={wireframe}
          emissive="#10b981"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cyber Grid Floor helper */}
      <gridHelper args={[20, 20, '#4f46e5', '#1e1b4b']} position={[0, -2.5, 0]} />
    </group>
  );
}
