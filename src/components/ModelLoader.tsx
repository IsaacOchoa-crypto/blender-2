import { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import * as THREE from 'three';

interface ModelLoaderProps {
  url: string;
  name: string;
  overridePBR: boolean;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  onLoadMetadata: (metadata: { triangles: number; vertices: number; name: string }) => void;
}

export function ModelLoader({
  url,
  name,
  overridePBR,
  roughness,
  metalness,
  wireframe,
  onLoadMetadata,
}: ModelLoaderProps) {
  // Load the GLTF model. This suspends the component while loading.
  const gltf = useLoader(GLTFLoader, url);

  // Traverse the scene to calculate metadata and apply material configurations
  useEffect(() => {
    let triangles = 0;
    let vertices = 0;

    gltf.scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const geometry = mesh.geometry;
        if (geometry) {
          // Calculate polycount
          const position = geometry.attributes.position;
          if (position) {
            vertices += position.count;
            if (geometry.index) {
              triangles += geometry.index.count / 3;
            } else {
              triangles += position.count / 3;
            }
          }
        }

        // Apply material configurations
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (overridePBR && mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = roughness;
              mat.metalness = metalness;
            }
            if ('wireframe' in mat) {
              (mat as any).wireframe = wireframe;
            }
            mat.needsUpdate = true;
          });
        }
      }
    });

    onLoadMetadata({
      triangles: Math.round(triangles),
      vertices: Math.round(vertices),
      name,
    });
  }, [gltf, overridePBR, roughness, metalness, wireframe, name, onLoadMetadata]);

  return <primitive object={gltf.scene} />;
}
