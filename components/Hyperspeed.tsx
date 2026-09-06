"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, SMAAPreset } from 'postprocessing';
import './Hyperspeed.css';

export default function Hyperspeed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- CONFIGURATION COULEURS TECHSTRATIX ---
    const options = {
      length: 400,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 3,
      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 50,
      lightPairsPerRoadWay: 50,
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,
      lightStickWidth: [0.12, 0.5],
      lightStickHeight: [1.3, 1.7],
      movingAwaySpeed: [60, 80],
      movingCloserSpeed: [-120, -160],
      carLightsLength: [400 * 0.05, 400 * 0.15],
      carLightsRadius: [0.05, 0.14],
      carWidthPercentage: [0.3, 0.5],
      carShiftX: [-0.2, 0.2],
      carFloorSeparation: [0.05, 1],
      colors: {
        roadColor: 0x060B14, // Fond sombre TechStratix
        islandColor: 0x060B14,
        background: 0x060B14,
        shoulderLines: 0x101D42,
        brokenLines: 0x101D42,
        leftCars: [0x2563EB, 0x60A5FA, 0x1D4ED8], // Bleus vifs
        rightCars: [0x9CA3AF, 0xE5E7EB, 0x4B5563], // Argent/Gris
        sticks: 0x2563EB // Bâtons lumineux bleus
      }
    };

    // --- LE MOTEUR THREE.JS SIMPLIFIÉ POUR L'ARRIÈRE-PLAN ---
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(options.fov, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 10000);
    camera.position.set(0, 8, -5);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500);

    // Effets de Post-Processing (Glow)
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera, new BloomEffect({ luminanceThreshold: 0.2, luminanceSmoothing: 0, resolutionScale: 1 })));

    // Simulation de particules lumineuses simples pour l'effet "Hyperspeed"
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for ( let i = 0; i < 2000; i ++ ) {
        vertices.push( (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 50, -Math.random() * options.length * 2 );
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    
    const material = new THREE.PointsMaterial({ color: options.colors.sticks, size: 0.5, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points( geometry, material );
    scene.add( stars );

    let animationFrameId: number;
    let speed = 2;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Animation hyperspeed
      const positions = stars.geometry.attributes.position.array as Float32Array;
      for(let i = 2; i < positions.length; i += 3) {
          positions[i] += speed;
          if (positions[i] > 100) positions[i] = -options.length * 2;
      }
      stars.geometry.attributes.position.needsUpdate = true;

      composer.render();
    };
    animate();

    const handleResize = () => {
      if(!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      composer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if(containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="lights" ref={containerRef}></div>;
}