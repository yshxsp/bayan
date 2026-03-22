import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, MeshDistortMaterial } from '@react-three/drei';

const AnimatedApple = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.8}>
      <MeshDistortMaterial
        color="#37eb3d"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.5}
      />
    </Sphere>
  );
};

const HeroApple = () => {
  return (
    <div style={{ height: '350px', width: '100%', position: 'relative', zIndex: 10, cursor: 'grab' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedApple />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default HeroApple;
