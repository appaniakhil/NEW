import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, OrbitControls, Stars, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useEffect } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function CityModel() {
  const { scene } = useGLTF('/cyberpunk_city.glb');
  return <primitive object={scene} scale={1.5} position={[0, -2, 0]} />;
}

function CameraRig({ children }) {
  const ref = useRef();
  const scroll = useScroll();

  useEffect(() => {
    scroll.scroll.current = 0;
  }, []);

  useEffect(() => {
    const onFrame = () => {
      const offset = scroll.offset; // 0 to 1
      if (ref.current) {
        ref.current.position.z = 8 - offset * 20;
        ref.current.position.y = 1 + Math.sin(offset * Math.PI) * 2;
        ref.current.rotation.y = offset * Math.PI;
      }
    };
    return () => {};
  }, [scroll]);

  return <group ref={ref}>{children}</group>;
}

function Home() {
  const audioRef = useRef(null);

  return (
    <div className="relative h-screen w-screen">
      <Canvas camera={{ position: [0, 1, 8], fov: 60 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={3} damping={0.2}>
            <Scroll>
              <Stars radius={100} depth={50} count={5000} factor={4} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <EffectComposer>
                <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.2} />
              </EffectComposer>
              <CameraRig>
                <CityModel />
              </CameraRig>
            </Scroll>
          </ScrollControls>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <audio ref={audioRef} src="/synthwave.mp3" loop autoPlay />

      <div className="absolute top-10 w-full text-center z-10 pointer-events-none">
        <h1 className="text-5xl font-bold glitch text-neonPink mb-2">Akhil Appani</h1>
        <p className="text-lg text-neonBlue">Scroll to fly through the neon city</p>
      </div>
    </div>
  );
}

export default Home;