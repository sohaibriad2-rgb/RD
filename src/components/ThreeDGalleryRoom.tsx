import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, RotateCcw, Maximize2, Minimize2, Layers, Sparkles, HelpCircle, Eye, Compass, Palette, ChevronUp, ChevronDown, Info, ArrowLeft, Check } from 'lucide-react';
import { Artwork } from '../types';
import { ARTWORKS } from '../data/artworks';

interface ThreeDGalleryRoomProps {
  artwork: Artwork;
  onClose?: () => void;
  formattedPrice?: string;
}

export interface WallFinish {
  id: string;
  name: string;
  hex: number;
  bgCss: string;
}

export const WALL_FINISHES: WallFinish[] = [
  { id: 'alabaster', name: 'Alabaster White', hex: 0xE8E5DF, bgCss: '#E8E5DF' },
  { id: 'charcoal', name: 'Charcoal Sanctuary', hex: 0x22211F, bgCss: '#22211F' },
  { id: 'limestone', name: 'Warm Limestone', hex: 0x332F2A, bgCss: '#332F2A' },
  { id: 'ochre', name: 'Moroccan Ochre', hex: 0x8C5E34, bgCss: '#8C5E34' },
  { id: 'emerald', name: 'Midnight Emerald', hex: 0x1B2E24, bgCss: '#1B2E24' },
  { id: 'navy', name: 'Royal Navy', hex: 0x1A2332, bgCss: '#1A2332' },
  { id: 'terracotta', name: 'Atlas Terracotta', hex: 0x7E3F33, bgCss: '#7E3F33' },
];

// Utility to check WebGL availability
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export const ThreeDGalleryRoom: React.FC<ThreeDGalleryRoomProps> = ({
  artwork,
  onClose,
  formattedPrice,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentArtwork, setCurrentArtwork] = useState<Artwork>(artwork);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [wallFinishId, setWallFinishId] = useState<string>('alabaster');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMobileWallMenu, setShowMobileWallMenu] = useState(false);
  const [showMobileArtPicker, setShowMobileArtPicker] = useState(false);
  const [isMobileInfoExpanded, setIsMobileInfoExpanded] = useState(false);
  const [showMobileDpad, setShowMobileDpad] = useState(true);
  const [showMobileGestureHint, setShowMobileGestureHint] = useState(true);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isPureMode, setIsPureMode] = useState(false);
  const [webGlSupported] = useState<boolean>(() => isWebGLAvailable());

  // Auto-hide mobile gesture guide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowMobileGestureHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Click / Tap tracking for Pure 3D mode toggle
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const pointerDownTimeRef = useRef(0);

  // Inactivity UI Auto-Hide Timer
  const uiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetUiInactivityTimer = () => {
    setIsUiVisible(true);
    if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);
    uiTimeoutRef.current = setTimeout(() => {
      setIsUiVisible(false);
    }, 6000);
  };

  // Sync prop change
  useEffect(() => {
    if (artwork) {
      setCurrentArtwork(artwork);
    }
  }, [artwork]);

  // Three.js instances ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const wallMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const frameGroupRef = useRef<THREE.Group | null>(null);
  const plaqueMeshRef = useRef<THREE.Mesh | null>(null);

  // Smooth Motion Camera State (Damping & Inertia)
  const targetYawRef = useRef(0);
  const targetPitchRef = useRef(0);
  const currentYawRef = useRef(0);
  const currentPitchRef = useRef(0);

  const moveStateRef = useRef({ forward: false, backward: false, left: false, right: false });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const touchStartDistRef = useRef<number | null>(null);

  // Delta Time Clock
  const clockRef = useRef(new THREE.Clock());

  const displayPrice = formattedPrice || `$${currentArtwork.priceUSD.toLocaleString()} USD`;

  const selectedFinish = WALL_FINISHES.find(f => f.id === wallFinishId) || WALL_FINISHES[0];

  // Preferred Reduced Motion check
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    if (!webGlSupported) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x151413);
    scene.fog = new THREE.FogExp2(0x151413, 0.032);
    sceneRef.current = scene;

    // 2. Camera Setup (Human Eye Level ~ 1.6m)
    const aspect = width / height;
    const initialFov = aspect < 1.25 ? Math.min(82, 55 / Math.max(0.65, aspect)) : 55;
    const camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 50);
    const targetBaseZ = aspect < 1.0 ? 3.1 : 2.6;
    const initialZ = prefersReducedMotion.current ? targetBaseZ : (aspect < 1.0 ? 4.2 : 3.8);
    camera.position.set(0, 1.6, initialZ);
    cameraRef.current = camera;

    // 3. WebGL Renderer Setup (Cap pixel ratio at 2 for mobile GPU protection)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // 4. Wood Floor Texture Generator
    const createWoodFloorTexture = () => {
      const canvasTex = document.createElement('canvas');
      canvasTex.width = 1024;
      canvasTex.height = 1024;
      const ctx = canvasTex.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1D1A17';
        ctx.fillRect(0, 0, 1024, 1024);
        const plankHeight = 64;
        ctx.strokeStyle = '#12100E';
        ctx.lineWidth = 2;

        for (let y = 0; y < 1024; y += plankHeight) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1024, y);
          ctx.stroke();

          const offset = (y / plankHeight) % 2 === 0 ? 0 : 256;
          for (let x = offset; x < 1024; x += 512) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + plankHeight);
            ctx.stroke();
          }
        }

        for (let i = 0; i < 35000; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 1024;
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(45, 38, 32, 0.15)' : 'rgba(12, 10, 8, 0.15)';
          ctx.fillRect(x, y, Math.random() * 50 + 10, 1);
        }
      }

      const texture = new THREE.CanvasTexture(canvasTex);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      texture.anisotropy = maxAnisotropy;
      return texture;
    };

    // 5. Gallery Room Architecture
    const ROOM_W = 10;
    const ROOM_H = 4.2;
    const ROOM_D = 12;

    const wallMat = new THREE.MeshStandardMaterial({
      color: selectedFinish.hex,
      roughness: 0.85,
      metalness: 0.05,
    });
    wallMaterialRef.current = wallMat;

    const floorTex = createWoodFloorTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.35,
      metalness: 0.1,
    });

    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xF2EFEA, roughness: 0.9 });
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x1C1B19, roughness: 0.5 });

    // Floor Mesh
    const floorGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_D);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling Mesh
    const ceilingGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_D);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = ROOM_H;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Walls
    const backWallGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_H);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, ROOM_H / 2, -ROOM_D / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const sideWallGeo = new THREE.PlaneGeometry(ROOM_D, ROOM_H);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(ROOM_W / 2, ROOM_H / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Baseboards
    const bbGeo = new THREE.BoxGeometry(ROOM_W, 0.15, 0.04);
    const bbBack = new THREE.Mesh(bbGeo, baseboardMat);
    bbBack.position.set(0, 0.075, -ROOM_D / 2 + 0.02);
    scene.add(bbBack);

    // Ceiling Track Light Fixture
    const trackGeo = new THREE.BoxGeometry(ROOM_W - 2, 0.05, 0.15);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const trackLight = new THREE.Mesh(trackGeo, trackMat);
    trackLight.position.set(0, ROOM_H - 0.025, -ROOM_D / 2 + 2.5);
    scene.add(trackLight);

    // 6. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFFAF0, 0.75);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 0.45);
    hemiLight.position.set(0, ROOM_H, 0);
    scene.add(hemiLight);

    // Spotlight focusing on artwork
    const artSpotlight = new THREE.SpotLight(0xFFF3DF, 3.2);
    artSpotlight.position.set(0, ROOM_H - 0.2, -ROOM_D / 2 + 2.5);
    artSpotlight.target.position.set(0, 1.85, -ROOM_D / 2);
    artSpotlight.angle = Math.PI / 4.5;
    artSpotlight.penumbra = 0.45;
    artSpotlight.decay = 1.2;
    artSpotlight.castShadow = true;
    artSpotlight.shadow.mapSize.width = 1024;
    artSpotlight.shadow.mapSize.height = 1024;
    scene.add(artSpotlight);
    scene.add(artSpotlight.target);

    // 7. Decorative Bench
    const benchGroup = new THREE.Group();
    const benchSeatGeo = new THREE.BoxGeometry(1.8, 0.1, 0.6);
    const benchSeatMat = new THREE.MeshStandardMaterial({ color: 0x1C1B19, roughness: 0.4 });
    const benchSeat = new THREE.Mesh(benchSeatGeo, benchSeatMat);
    benchSeat.position.y = 0.45;
    benchGroup.add(benchSeat);

    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xB08D57, metalness: 0.8, roughness: 0.2 });
    [[-0.8, -0.2], [0.8, -0.2], [-0.8, 0.2], [0.8, 0.2]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, 0.225, lz);
      benchGroup.add(leg);
    });

    benchGroup.position.set(0, 0, 1.0);
    scene.add(benchGroup);

    // Group container for frame & artwork
    const mainFrameGroup = new THREE.Group();
    frameGroupRef.current = mainFrameGroup;
    scene.add(mainFrameGroup);

    // 8. Event Listeners & Input Handlers
    const canvasEl = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      pointerDownTimeRef.current = Date.now();
      resetUiInactivityTimer();
    };

    const onMouseUp = (e: MouseEvent) => {
      isDraggingRef.current = false;
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.y);
      const timeElapsed = Date.now() - pointerDownTimeRef.current;
      if (dx < 8 && dy < 8 && timeElapsed < 300) {
        setIsPureMode((prev) => !prev);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      resetUiInactivityTimer();
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;

      targetYawRef.current -= dx * 0.0028;
      targetPitchRef.current -= dy * 0.0028;
      targetPitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetPitchRef.current));

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onTouchStart = (e: TouchEvent) => {
      resetUiInactivityTimer();
      if (e.cancelable) e.preventDefault();
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        pointerDownPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        pointerDownTimeRef.current = Date.now();
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistRef.current = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      resetUiInactivityTimer();
      if (e.cancelable) e.preventDefault();
      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - prevMouseRef.current.x;
        const dy = e.touches[0].clientY - prevMouseRef.current.y;

        targetYawRef.current -= dx * 0.0035;
        targetPitchRef.current -= dy * 0.0035;
        targetPitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetPitchRef.current));

        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && touchStartDistRef.current !== null && cameraRef.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = touchStartDistRef.current / dist;

        cameraRef.current.fov = Math.max(35, Math.min(75, cameraRef.current.fov * factor));
        cameraRef.current.updateProjectionMatrix();
        touchStartDistRef.current = dist;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      isDraggingRef.current = false;
      touchStartDistRef.current = null;
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const dx = Math.abs(touch.clientX - pointerDownPosRef.current.x);
        const dy = Math.abs(touch.clientY - pointerDownPosRef.current.y);
        const timeElapsed = Date.now() - pointerDownTimeRef.current;
        if (dx < 10 && dy < 10 && timeElapsed < 300) {
          setIsPureMode((prev) => !prev);
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      resetUiInactivityTimer();
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveStateRef.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': moveStateRef.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': moveStateRef.current.left = true; break;
        case 'KeyD': case 'ArrowRight': moveStateRef.current.right = true; break;
        case 'KeyR': handleResetView(); break;
        case 'Escape': if (onClose) onClose(); break;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveStateRef.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': moveStateRef.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': moveStateRef.current.left = false; break;
        case 'KeyD': case 'ArrowRight': moveStateRef.current.right = false; break;
      }
    };

    const onWheel = (e: WheelEvent) => {
      resetUiInactivityTimer();
      if (cameraRef.current) {
        cameraRef.current.fov += e.deltaY * 0.025;
        cameraRef.current.fov = Math.max(35, Math.min(75, cameraRef.current.fov));
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      cameraRef.current.aspect = aspect;
      cameraRef.current.fov = aspect < 1.25 ? Math.min(82, 55 / Math.max(0.65, aspect)) : 55;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h, false);
    };

    let isPaused = false;
    const onVisibilityChange = () => {
      isPaused = document.hidden;
    };

    canvasEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvasEl.addEventListener('mousemove', onMouseMove);

    canvasEl.addEventListener('touchstart', onTouchStart, { passive: false });
    canvasEl.addEventListener('touchmove', onTouchMove, { passive: false });
    canvasEl.addEventListener('touchend', onTouchEnd);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    container.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibilityChange);

    resetUiInactivityTimer();

    // 9. Frame Loop
    let animId: number;
    const WALK_SPEED = 2.4;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isPaused) return;

      const delta = Math.min(clockRef.current.getDelta(), 0.1);

      if (cameraRef.current && rendererRef.current && sceneRef.current) {
        const dampingFactor = prefersReducedMotion.current ? 1.0 : Math.min(1.0, delta * 12);
        currentYawRef.current += (targetYawRef.current - currentYawRef.current) * dampingFactor;
        currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * dampingFactor;

        const euler = new THREE.Euler(currentPitchRef.current, currentYawRef.current, 0, 'YXZ');
        cameraRef.current.quaternion.setFromEuler(euler);

        const idealTargetZ = cameraRef.current.aspect < 1.0 ? 3.1 : 2.6;
        if (!prefersReducedMotion.current && cameraRef.current.position.z > idealTargetZ + 0.05 && !isDraggingRef.current) {
          cameraRef.current.position.z -= delta * 0.8;
          if (cameraRef.current.position.z < idealTargetZ) cameraRef.current.position.z = idealTargetZ;
        }

        const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), currentYawRef.current);
        const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), currentYawRef.current);

        const ms = moveStateRef.current;
        const step = WALK_SPEED * delta;
        if (ms.forward) cameraRef.current.position.addScaledVector(forwardVec, step);
        if (ms.backward) cameraRef.current.position.addScaledVector(forwardVec, -step);
        if (ms.left) cameraRef.current.position.addScaledVector(rightVec, -step);
        if (ms.right) cameraRef.current.position.addScaledVector(rightVec, step);

        const BOUND_X = ROOM_W / 2 - 0.8;
        const BOUND_Z_BACK = -ROOM_D / 2 + 1.2;
        const BOUND_Z_FRONT = ROOM_D / 2 - 1.0;

        cameraRef.current.position.x = Math.max(-BOUND_X, Math.min(BOUND_X, cameraRef.current.position.x));
        cameraRef.current.position.z = Math.max(BOUND_Z_BACK, Math.min(BOUND_Z_FRONT, cameraRef.current.position.z));
        cameraRef.current.position.y = 1.6;

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    clockRef.current.start();
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (uiTimeoutRef.current) clearTimeout(uiTimeoutRef.current);

      canvasEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvasEl.removeEventListener('mousemove', onMouseMove);

      canvasEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [webGlSupported]);

  // Handle Artwork Switching
  useEffect(() => {
    if (!webGlSupported || !sceneRef.current || !frameGroupRef.current) return;

    setIsLoading(true);
    setLoadProgress(10);

    const textureLoader = new THREE.TextureLoader();
    const frameGroup = frameGroupRef.current;

    while (frameGroup.children.length > 0) {
      const child = frameGroup.children[0];
      frameGroup.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    if (plaqueMeshRef.current && sceneRef.current) {
      sceneRef.current.remove(plaqueMeshRef.current);
      if (plaqueMeshRef.current.geometry) plaqueMeshRef.current.geometry.dispose();
    }

    const maxAnisotropy = rendererRef.current ? rendererRef.current.capabilities.getMaxAnisotropy() : 4;

    textureLoader.load(
      currentArtwork.primaryImage,
      (texture) => {
        texture.anisotropy = maxAnisotropy;
        const aspect = texture.image.width / texture.image.height;
        const artH = 2.0;
        const artW = artH * aspect;

        const artGeo = new THREE.PlaneGeometry(artW, artH);
        const artMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.25 });
        const paintingMesh = new THREE.Mesh(artGeo, artMat);
        paintingMesh.position.z = 0.02;
        paintingMesh.castShadow = true;

        const matteBorder = 0.12;
        const matteW = artW + matteBorder * 2;
        const matteH = artH + matteBorder * 2;
        const matteGeo = new THREE.PlaneGeometry(matteW, matteH);
        const matteMat = new THREE.MeshStandardMaterial({ color: 0xF7F5F0, roughness: 0.9 });
        const matteMesh = new THREE.Mesh(matteGeo, matteMat);
        matteMesh.position.z = 0.01;

        const frameDepth = 0.08;
        const frameThick = 0.06;
        const outerW = matteW + frameThick * 2;
        const outerH = matteH + frameThick * 2;

        const frameShape = new THREE.Shape();
        frameShape.moveTo(-outerW / 2, -outerH / 2);
        frameShape.lineTo(outerW / 2, -outerH / 2);
        frameShape.lineTo(outerW / 2, outerH / 2);
        frameShape.lineTo(-outerW / 2, outerH / 2);
        frameShape.closePath();

        const holePath = new THREE.Path();
        holePath.moveTo(-matteW / 2, -matteH / 2);
        holePath.lineTo(matteW / 2, -matteH / 2);
        holePath.lineTo(matteW / 2, matteH / 2);
        holePath.lineTo(-matteW / 2, -matteH / 2);
        holePath.closePath();
        frameShape.holes.push(holePath);

        const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
          depth: frameDepth,
          bevelEnabled: true,
          bevelSegments: 3,
          bevelSize: 0.015,
          bevelThickness: 0.015,
        });

        const frameMat = new THREE.MeshStandardMaterial({ color: 0x967440, roughness: 0.35, metalness: 0.6 });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        frameMesh.position.z = -frameDepth;

        const shadowGeo = new THREE.PlaneGeometry(outerW + 0.4, outerH + 0.4);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.position.z = -frameDepth - 0.005;

        frameGroup.add(shadowMesh);
        frameGroup.add(frameMesh);
        frameGroup.add(matteMesh);
        frameGroup.add(paintingMesh);

        const hangingY = 1.85;
        const ROOM_D = 12;
        frameGroup.position.set(0, hangingY, -ROOM_D / 2 + frameDepth + 0.01);

        const canvasTex = document.createElement('canvas');
        canvasTex.width = 512;
        canvasTex.height = 256;
        const ctx = canvasTex.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#1C1B19';
          ctx.fillRect(0, 0, 512, 256);
          ctx.strokeStyle = '#B08D57';
          ctx.lineWidth = 6;
          ctx.strokeRect(10, 10, 492, 236);

          ctx.fillStyle = '#B08D57';
          ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
          ctx.fillText('RD FINE ART — CATALOG MASTER', 30, 45);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '600 30px "Cormorant Garamond", serif';
          const titleText = currentArtwork.title.length > 25 ? currentArtwork.title.substring(0, 24) + '...' : currentArtwork.title;
          ctx.fillText(titleText, 30, 95);

          ctx.fillStyle = '#C2C0BA';
          ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(currentArtwork.artistName || '', 30, 135);

          ctx.fillStyle = '#B08D57';
          ctx.font = '600 24px "Cormorant Garamond", serif';
          ctx.fillText(displayPrice, 30, 190);
        }

        const plaqueTex = new THREE.CanvasTexture(canvasTex);
        const plaqueGeo = new THREE.PlaneGeometry(0.45, 0.225);
        const plaqueMat = new THREE.MeshBasicMaterial({ map: plaqueTex });
        const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
        plaqueMesh.position.set(artW / 2 + matteBorder + 0.4, hangingY - artH / 2, -ROOM_D / 2 + 0.02);
        plaqueMeshRef.current = plaqueMesh;

        if (sceneRef.current) {
          sceneRef.current.add(plaqueMesh);
        }

        setLoadProgress(100);
        setTimeout(() => setIsLoading(false), 200);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(percent);
        }
      },
      (err) => {
        console.error("Error loading artwork texture:", err);
        setIsLoading(false);
      }
    );
  }, [currentArtwork, webGlSupported]);

  // Handle Wall Color Switch
  useEffect(() => {
    if (wallMaterialRef.current && selectedFinish) {
      wallMaterialRef.current.color.setHex(selectedFinish.hex);
    }
  }, [wallFinishId, selectedFinish]);

  const handleResetView = () => {
    targetYawRef.current = 0;
    targetPitchRef.current = 0;
    currentYawRef.current = 0;
    currentPitchRef.current = 0;
    if (cameraRef.current) {
      const container = containerRef.current;
      const w = container?.clientWidth || window.innerWidth;
      const h = container?.clientHeight || window.innerHeight;
      const aspect = w / h;
      cameraRef.current.fov = aspect < 1.25 ? Math.min(82, 55 / Math.max(0.65, aspect)) : 55;
      cameraRef.current.updateProjectionMatrix();
      cameraRef.current.position.set(0, 1.6, aspect < 1.0 ? 3.1 : 2.6);
    }
    resetUiInactivityTimer();
  };

  const toggleFullscreen = () => {
    resetUiInactivityTimer();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // ResizeObserver for instant tablet orientation & container responsiveness
  useEffect(() => {
    if (!containerRef.current || !webGlSupported) return;

    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      const aspect = w / h;
      cameraRef.current.aspect = aspect;
      cameraRef.current.fov = aspect < 1.25 ? Math.min(82, 55 / Math.max(0.65, aspect)) : 55;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h, false);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [webGlSupported]);

  if (!webGlSupported) {
    return (
      <div className="relative w-full h-full min-h-[500px] bg-[#151413] text-[#E8E6E1] flex flex-col items-center justify-center p-6 text-center rounded-sm border border-[#B08D57]/30">
        <div className="max-w-md bg-[#1C1B19] p-8 rounded-sm border border-[#B08D57]/40 shadow-2xl">
          <Eye className="w-12 h-12 text-[#B08D57] mx-auto mb-4 animate-pulse" />
          <h3 className="font-serif-display text-2xl text-[#E8E6E1] mb-2 font-semibold">
            High-Resolution 2D Master Preview
          </h3>
          <p className="text-xs text-[#8C8983] mb-6 font-light">
            3D WebGL acceleration is unavailable on this device. Viewing high-fidelity 2D gallery exhibit for <strong>{currentArtwork.title}</strong>.
          </p>
          <div className="relative mb-6 border-4 border-[#967440] p-1 bg-[#151413] shadow-lg">
            <img
              src={currentArtwork.primaryImage}
              alt={currentArtwork.title}
              referrerPolicy="no-referrer"
              className="w-full h-64 object-contain"
            />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#B08D57] text-[#151413] font-semibold text-xs uppercase tracking-widest hover:bg-[#D4B26F] transition-colors rounded-sm"
            >
              Close Gallery
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={resetUiInactivityTimer}
      onClick={resetUiInactivityTimer}
      className="relative w-full h-full sm:min-h-[500px] bg-[#151413] text-[#E8E6E1] overflow-hidden select-none font-sans-clean rounded-sm touch-none overscroll-none"
    >
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#151413] flex flex-col items-center justify-center p-6 transition-opacity duration-500">
          <div className="w-14 h-14 border-2 border-[#B08D57]/20 border-t-[#B08D57] rounded-full animate-spin mb-4" />
          <h3 className="font-serif-display text-xl tracking-[0.25em] text-[#B08D57] uppercase font-medium mb-1">
            Rendering 3D Gallery Salon
          </h3>
          <p className="text-xs text-[#8C8983] font-light">
            Loading master texture ({loadProgress}%)
          </p>
          <div className="w-48 h-1 bg-[#1C1B19] rounded-full mt-3 overflow-hidden border border-[#B08D57]/20">
            <div
              className="h-full bg-[#B08D57] transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Mobile Top Header (Phone & Small Portrait Devices) */}
      {onClose && !isPureMode && (
        <div className="md:hidden absolute top-2 left-2 right-2 z-50 flex items-center justify-between bg-[#151413]/95 backdrop-blur-md border border-[#B08D57]/50 p-1.5 rounded-sm shadow-2xl pointer-events-auto">
          <button
            onClick={onClose}
            className="flex items-center space-x-1 px-2 py-1.5 bg-[#B08D57] text-[#151413] font-bold text-[10px] uppercase tracking-wider rounded-sm active:scale-95 transition-transform shadow-lg shrink-0"
            aria-label="Exit 3D Gallery"
          >
            <X className="w-3.5 h-3.5 stroke-[3]" />
            <span>Exit</span>
          </button>

          {/* Artwork Selector Trigger Button */}
          <button
            onClick={() => setShowMobileArtPicker(true)}
            className="flex items-center space-x-1.5 px-2 py-1 bg-[#1C1B19] border border-[#B08D57]/60 hover:border-[#B08D57] rounded-sm max-w-[150px] truncate active:scale-95 transition-all shadow-md"
            title="Select Gallery Artwork"
          >
            <Layers className="w-3.5 h-3.5 text-[#B08D57] shrink-0 animate-pulse" />
            <span className="text-[10px] font-serif-display font-semibold text-[#E8E6E1] truncate">
              {currentArtwork.title}
            </span>
            <ChevronDown className="w-3 h-3 text-[#B08D57] shrink-0" />
          </button>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setShowMobileWallMenu(!showMobileWallMenu)}
              className={`p-1.5 rounded-sm border transition-colors ${
                showMobileWallMenu
                  ? 'bg-[#B08D57] text-[#151413] border-[#B08D57]'
                  : 'bg-[#1C1B19] text-[#B08D57] border-[#B08D57]/40'
              }`}
              title="Select Wall Finish"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowHelp(true)}
              className="p-1.5 bg-[#1C1B19] text-[#E8E6E1] border border-white/20 rounded-sm"
              title="Help"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsPureMode(true)}
              className="text-[9px] tracking-wider text-[#E8E6E1] uppercase border border-white/20 px-1.5 py-1.5 rounded-sm bg-[#1C1B19] font-medium"
            >
              Hide UI
            </button>
          </div>
        </div>
      )}

      {/* Mobile Gesture Helper Toast */}
      {showMobileGestureHint && !isPureMode && (
        <div className="md:hidden absolute top-12 left-1/2 -translate-x-1/2 z-40 bg-[#151413]/90 backdrop-blur-md border border-[#B08D57]/40 text-[#B08D57] px-3 py-1 rounded-full text-[10px] tracking-wide flex items-center space-x-1.5 shadow-lg animate-fadeIn">
          <Sparkles className="w-3 h-3 text-[#B08D57] animate-pulse" />
          <span>1-Finger Drag to Rotate · Pinch to Zoom</span>
        </div>
      )}

      {/* Mobile Wall Finish Swatch Sheet */}
      {showMobileWallMenu && !isPureMode && (
        <div className="md:hidden absolute top-12 left-2 right-2 z-50 bg-[#151413]/98 backdrop-blur-md border border-[#B08D57]/60 p-3 rounded-sm shadow-2xl pointer-events-auto animate-fadeIn">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#B08D57]/20">
            <span className="text-[10px] font-semibold tracking-widest text-[#B08D57] uppercase flex items-center space-x-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Room Wall Finish:</span>
            </span>
            <button
              onClick={() => setShowMobileWallMenu(false)}
              className="text-[#8C8983] hover:text-[#B08D57] p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-0.5">
            {WALL_FINISHES.map((finish) => {
              const isSelected = finish.id === wallFinishId;
              return (
                <button
                  key={finish.id}
                  onClick={() => {
                    setWallFinishId(finish.id);
                    setShowMobileWallMenu(false);
                  }}
                  className={`flex items-center space-x-2 p-1.5 rounded-sm border text-left transition-all ${
                    isSelected
                      ? 'bg-[#B08D57]/20 border-[#B08D57] text-[#B08D57] font-semibold'
                      : 'bg-[#1C1B19] border-[#B08D57]/20 text-[#E8E6E1]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                    style={{ backgroundColor: finish.bgCss }}
                  />
                  <span className="text-[10px] truncate">{finish.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pure 3D Floating Mode Indicator */}
      {isPureMode && (
        <button
          onClick={() => setIsPureMode(false)}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-[#151413]/90 backdrop-blur-md border border-[#B08D57]/60 text-[#B08D57] px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase flex items-center space-x-2 shadow-2xl hover:bg-[#B08D57] hover:text-[#151413] transition-all"
        >
          <Eye className="w-3.5 h-3.5 animate-pulse" />
          <span>Pure 3D View — Tap for Controls</span>
        </button>
      )}

      {/* Desktop & Tablet Top Controls Header Bar */}
      <div
        className={`absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 lg:top-4 lg:left-4 lg:right-4 z-30 hidden md:flex items-center justify-between bg-[#151413]/95 backdrop-blur-md border border-[#B08D57]/40 px-3 py-2 md:px-4 md:py-2.5 rounded-sm shadow-2xl transition-all duration-300 gap-2 flex-nowrap overflow-x-auto scrollbar-none ${
          isUiVisible && !isPureMode ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 md:px-3.5 bg-[#B08D57] text-[#151413] font-bold text-[11px] md:text-xs uppercase tracking-wider rounded-sm hover:bg-[#CBB07E] active:scale-95 transition-all shadow-lg shrink-0"
              title="Exit 3D Gallery Room"
              aria-label="Exit 3D View"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[2.5]" />
              <span>Exit 3D View</span>
            </button>
          )}

          <div className="hidden sm:flex items-center space-x-2 border-l border-[#B08D57]/30 pl-2.5 sm:pl-3 shrink-0">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#B08D57] shadow-[0_0_8px_#B08D57]" />
            <div>
              <h4 className="font-serif-display text-sm md:text-base text-[#E8E6E1] font-semibold leading-none">RD Fine Art</h4>
              <span className="text-[8px] md:text-[9px] tracking-[0.2em] text-[#B08D57] uppercase block mt-0.5">3D Virtual Gallery</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* Artwork Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-[#1C1B19] border border-[#B08D57]/40 px-2 py-1 rounded-sm shrink-0">
            <Layers className="w-3.5 h-3.5 text-[#B08D57] shrink-0" />
            <select
              value={currentArtwork.id}
              onChange={(e) => {
                const selected = ARTWORKS.find((a) => a.id === e.target.value);
                if (selected) setCurrentArtwork(selected);
              }}
              className="bg-transparent text-[#B08D57] text-xs font-medium focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[220px] truncate"
              aria-label="Select Gallery Artwork"
            >
              {ARTWORKS.map((art) => (
                <option key={art.id} value={art.id} className="bg-[#151413] text-[#E8E6E1]">
                  {art.title} — {art.artistName}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop & Tablet Universal Wall Finish Palette Selector */}
          <div className="hidden sm:flex items-center space-x-2 bg-[#1C1B19] border border-[#B08D57]/30 px-2.5 py-1 md:px-3 md:py-1.5 rounded-sm text-xs shrink-0">
            <span className="text-[10px] text-[#B08D57] font-semibold uppercase tracking-wider flex items-center space-x-1">
              <Palette className="w-3 h-3" />
              <span className="hidden lg:inline">Wall Color:</span>
            </span>
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              {WALL_FINISHES.map((finish) => {
                const isSelected = finish.id === wallFinishId;
                return (
                  <button
                    key={finish.id}
                    onClick={() => setWallFinishId(finish.id)}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border transition-all ${
                      isSelected
                        ? 'border-[#B08D57] scale-125 shadow-[0_0_8px_#B08D57]'
                        : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: finish.bgCss }}
                    title={finish.name}
                    aria-label={`Select ${finish.name} Wall Finish`}
                  />
                );
              })}
            </div>
          </div>

          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            className="flex items-center space-x-1.5 px-2.5 py-1 md:px-3 md:py-1.5 bg-[#B08D57]/20 border border-[#B08D57]/40 text-[#B08D57] text-[10px] tracking-widest uppercase font-semibold hover:bg-[#B08D57] hover:text-[#1C1B19] transition-all rounded-sm shrink-0"
            title="Reset camera position (Hotkey: R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>

          {/* Touch D-Pad Toggle for Tablets */}
          <button
            onClick={() => setShowMobileDpad(!showMobileDpad)}
            className={`p-1.5 border rounded-sm transition-colors shrink-0 ${
              showMobileDpad
                ? 'bg-[#B08D57] text-[#151413] border-[#B08D57]'
                : 'bg-[#1C1B19] text-[#E8E6E1] border-white/20'
            }`}
            title="Toggle Touch Movement Controls"
            aria-label="Toggle Movement Controls"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-[#E8E6E1] hover:text-[#B08D57] transition-colors rounded-sm shrink-0"
            title="Toggle Fullscreen"
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Help Overlay Trigger */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 text-[#E8E6E1] hover:text-[#B08D57] transition-colors rounded-sm shrink-0"
            title="Gallery Room Navigation Guide"
            aria-label="Help Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Close Modal Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#E8E6E1] hover:text-[#B08D57] transition-colors rounded-sm shrink-0"
              title="Close 3D View"
              aria-label="Close 3D View"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Artwork Switcher Carousel (Shown on All Screens) */}
      <div
        className={`absolute top-12 md:top-16 lg:top-20 left-2 right-2 md:left-3 md:right-3 lg:left-4 lg:right-4 z-20 pointer-events-auto transition-all duration-300 ${
          isUiVisible && !isPureMode && !showMobileWallMenu ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-[#151413]/95 backdrop-blur-md border border-[#B08D57]/40 p-1.5 sm:p-2 rounded-sm shadow-2xl flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setShowMobileArtPicker(true)}
            className="text-[9px] tracking-[0.15em] text-[#151413] bg-[#B08D57] uppercase font-bold shrink-0 px-2 py-1.5 rounded-sm flex items-center space-x-1 active:scale-95 transition-transform shadow-md"
            title="Open Full Collection Grid"
          >
            <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Collection ({ARTWORKS.length})</span>
            <span className="sm:hidden">Grid</span>
          </button>
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto py-0.5 px-0.5 scrollbar-none">
            {ARTWORKS.map((art) => {
              const isSelected = art.id === currentArtwork.id;
              return (
                <button
                  key={art.id}
                  onClick={() => setCurrentArtwork(art)}
                  className={`group relative shrink-0 flex items-center space-x-1.5 p-1 sm:p-1.5 rounded-sm border transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'bg-[#B08D57]/30 border-[#B08D57] shadow-[0_0_12px_rgba(176,141,87,0.5)] scale-105'
                      : 'bg-[#1C1B19] border-[#B08D57]/20 hover:border-[#B08D57]/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={art.primaryImage}
                    alt={art.title}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain bg-[#11100F] rounded-sm p-0.5"
                  />
                  <div className="text-left max-w-[90px] sm:max-w-[130px]">
                    <div className={`text-[10px] sm:text-[11px] truncate font-serif-display font-medium ${isSelected ? 'text-[#B08D57] font-semibold' : 'text-[#E8E6E1]'}`}>
                      {art.title}
                    </div>
                    <div className="text-[8px] sm:text-[9px] text-[#8C8983] truncate">{art.artistName}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Bottom Information Card & Interactive Hints */}
      <div
        className={`absolute bottom-4 left-4 right-4 z-30 hidden lg:flex flex-row items-end justify-between gap-4 pointer-events-none transition-all duration-300 ${
          isUiVisible && !isPureMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Artwork Info Sheet */}
        <div className="pointer-events-auto bg-[#151413]/90 backdrop-blur-md border border-[#B08D57]/30 p-4 rounded-sm max-w-sm w-full shadow-2xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] tracking-[0.25em] text-[#B08D57] uppercase font-semibold block">
              Exhibiting in 3D Gallery
            </span>
            <span className="text-[9px] tracking-wider text-[#8C8983] uppercase flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFinish.bgCss }} />
              <span>{selectedFinish.name}</span>
            </span>
          </div>
          <h3 className="font-serif-display text-xl text-[#E8E6E1] font-semibold leading-snug">
            {currentArtwork.title}
          </h3>
          <p className="text-xs text-[#C2C0BA] font-light mt-0.5">
            {currentArtwork.artistName} · {currentArtwork.medium}
          </p>
          <div className="mt-1.5 text-[10px] text-[#8C8983]">
            Dimensions: {currentArtwork.dimensions}
          </div>
          <div className="mt-3 pt-2 border-t border-[#B08D57]/20 flex items-center justify-between">
            <span className="font-serif-display text-lg text-[#E8E6E1] font-semibold">
              {displayPrice}
            </span>
            <button
              onClick={() => setShowMobileArtPicker(true)}
              className="text-[9px] tracking-widest text-[#151413] bg-[#B08D57] font-bold uppercase px-2.5 py-1 rounded-sm hover:bg-[#CBB07E] transition-colors"
            >
              Browse All Art
            </button>
          </div>
        </div>

        {/* Desktop Hint Overlay */}
        <div className="hidden md:flex items-center space-x-2 bg-[#151413]/85 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs text-[#8C8983] pointer-events-auto shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
          <span>Click 3D Canvas for Pure View &nbsp;•&nbsp; WASD to Walk &nbsp;•&nbsp; Pinch/Scroll to Zoom</span>
        </div>
      </div>

      {/* Mobile & Tablet Bottom Control Dock */}
      <div
        className={`lg:hidden absolute bottom-2 left-2 right-2 z-30 flex items-end justify-between gap-2 pointer-events-auto transition-all duration-300 ${
          isUiVisible && !isPureMode ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Mobile & Tablet Compact Artwork Card */}
        <button
          onClick={() => setIsMobileInfoExpanded(true)}
          className="flex items-center space-x-2 bg-[#151413]/95 backdrop-blur-md border border-[#B08D57]/50 p-2 rounded-sm shadow-2xl max-w-[180px] sm:max-w-[260px] text-left active:scale-95 transition-transform"
        >
          <img
            src={currentArtwork.primaryImage}
            alt={currentArtwork.title}
            referrerPolicy="no-referrer"
            className="w-9 h-9 object-contain bg-[#11100F] rounded-sm p-0.5 shrink-0"
          />
          <div className="truncate">
            <div className="text-[11px] font-serif-display font-semibold text-[#E8E6E1] truncate leading-tight">
              {currentArtwork.title}
            </div>
            <div className="text-[9px] text-[#B08D57] font-medium mt-0.5">
              {displayPrice}
            </div>
          </div>
          <ChevronUp className="w-4 h-4 text-[#B08D57] shrink-0 ml-auto animate-bounce" />
        </button>

        {/* Mobile & Tablet Quick Action Buttons */}
        <div className="flex items-center space-x-1.5 bg-[#151413]/95 backdrop-blur-md border border-[#B08D57]/40 p-1.5 rounded-sm shadow-2xl">
          <button
            onClick={() => setShowMobileArtPicker(true)}
            className="flex items-center space-x-1 px-2.5 py-2 bg-[#B08D57] text-[#151413] border border-[#B08D57] rounded-sm font-bold text-xs active:scale-95 transition-transform shadow-lg shrink-0"
            title="Browse & Select Gallery Art"
            aria-label="Browse & Select Gallery Art"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold">Choose Art</span>
          </button>

          <button
            onClick={handleResetView}
            className="p-2 bg-[#1C1B19] text-[#B08D57] border border-[#B08D57]/30 rounded-sm active:scale-95 transition-transform"
            title="Reset View"
            aria-label="Reset 3D Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowMobileDpad(!showMobileDpad)}
            className={`p-2 border rounded-sm active:scale-95 transition-transform ${
              showMobileDpad
                ? 'bg-[#B08D57] text-[#151413] border-[#B08D57]'
                : 'bg-[#1C1B19] text-[#E8E6E1] border-white/20'
            }`}
            title="Toggle Movement D-Pad"
            aria-label="Toggle Movement Controls"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Detailed Artwork Modal Sheet */}
      {isMobileInfoExpanded && (
        <div className="lg:hidden absolute inset-0 z-50 bg-[#151413]/95 backdrop-blur-md p-4 flex flex-col justify-between animate-fadeIn pointer-events-auto overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#B08D57]/30">
            <span className="text-[10px] tracking-[0.25em] text-[#B08D57] uppercase font-semibold flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>3D Exhibition Details</span>
            </span>
            <button
              onClick={() => setIsMobileInfoExpanded(false)}
              className="p-1.5 bg-[#1C1B19] border border-[#B08D57]/40 text-[#E8E6E1] rounded-sm"
              aria-label="Close Details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="my-auto py-4 space-y-3">
            <div className="relative w-full h-44 sm:h-56 bg-[#11100F] border border-[#B08D57]/30 rounded-sm overflow-hidden p-2 flex items-center justify-center">
              <img
                src={currentArtwork.primaryImage}
                alt={currentArtwork.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain shadow-2xl"
              />
            </div>

            <div>
              <span className="text-[10px] tracking-wider text-[#8C8983] uppercase">
                {currentArtwork.artistName}
              </span>
              <h3 className="font-serif-display text-2xl text-[#E8E6E1] font-semibold leading-tight">
                {currentArtwork.title}
              </h3>
              <p className="text-xs text-[#C2C0BA] font-light mt-1">
                {currentArtwork.medium} · {currentArtwork.year}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#1C1B19] p-3 rounded-sm border border-[#B08D57]/20">
              <div>
                <span className="text-[9px] text-[#8C8983] uppercase block">Dimensions</span>
                <span className="text-[#E8E6E1] font-medium">{currentArtwork.dimensions}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#8C8983] uppercase block">Edition</span>
                <span className="text-[#B08D57] font-semibold">Original 1 of 1</span>
              </div>
            </div>

            <p className="text-xs text-[#C2C0BA] leading-relaxed line-clamp-3">
              {currentArtwork.description}
            </p>
          </div>

          <div className="pt-3 border-t border-[#B08D57]/30 flex items-center justify-between gap-3">
            <div>
              <span className="text-[9px] text-[#8C8983] uppercase block">Asking Price</span>
              <span className="font-serif-display text-xl text-[#E8E6E1] font-semibold">
                {displayPrice}
              </span>
            </div>
            <button
              onClick={() => setIsMobileInfoExpanded(false)}
              className="px-5 py-2.5 bg-[#B08D57] text-[#151413] font-bold text-xs uppercase tracking-wider rounded-sm active:scale-95 transition-transform"
            >
              Resume 3D View
            </button>
          </div>
        </div>
      )}

      {/* Mobile & Tablet Full 3D Gallery Collection Selector Modal Sheet */}
      {showMobileArtPicker && (
        <div className="absolute inset-0 z-[60] bg-[#151413]/98 backdrop-blur-xl p-3 sm:p-5 flex flex-col justify-between animate-fadeIn pointer-events-auto overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#B08D57]/40 shrink-0">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#B08D57]" />
              <div>
                <h3 className="font-serif-display text-lg sm:text-xl text-[#E8E6E1] font-semibold leading-tight">
                  Virtual Gallery Collection
                </h3>
                <span className="text-[10px] text-[#B08D57] tracking-wider uppercase font-medium block">
                  Select an artwork to exhibit on the 3D wall ({ARTWORKS.length} Artworks)
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowMobileArtPicker(false)}
              className="p-1.5 bg-[#1C1B19] border border-[#B08D57]/40 text-[#E8E6E1] hover:text-[#B08D57] rounded-sm transition-colors"
              aria-label="Close Collection Picker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid of Artworks */}
          <div className="my-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pr-0.5">
            {ARTWORKS.map((art) => {
              const isSelected = art.id === currentArtwork.id;
              return (
                <div
                  key={art.id}
                  onClick={() => {
                    setCurrentArtwork(art);
                    setShowMobileArtPicker(false);
                    handleResetView();
                  }}
                  className={`group cursor-pointer relative bg-[#1C1B19] border p-2.5 rounded-sm transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#B08D57] bg-[#B08D57]/10 shadow-[0_0_15px_rgba(176,141,87,0.3)] ring-1 ring-[#B08D57]'
                      : 'border-[#B08D57]/20 hover:border-[#B08D57]/60 hover:bg-[#22201D]'
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative w-full h-36 sm:h-40 bg-[#11100F] border border-[#B08D57]/20 rounded-sm overflow-hidden p-1.5 flex items-center justify-center mb-2">
                    <img
                      src={art.primaryImage}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-[#B08D57] text-[#151413] px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-wider uppercase flex items-center space-x-1 shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Hanging</span>
                      </div>
                    )}
                  </div>

                  {/* Artwork Meta Details */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className={`font-serif-display text-sm font-medium leading-snug line-clamp-1 ${isSelected ? 'text-[#B08D57]' : 'text-[#E8E6E1]'}`}>
                        {art.title}
                      </h4>
                      <span className="text-xs font-serif-display font-semibold text-[#E8E6E1] shrink-0">
                        {art.priceUSD ? `$${art.priceUSD.toLocaleString()}` : 'Inquire'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C8983] truncate">{art.artistName}</p>
                    <p className="text-[10px] text-[#A6A29A] truncate font-light">{art.medium} · {art.dimensions}</p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentArtwork(art);
                      setShowMobileArtPicker(false);
                      handleResetView();
                    }}
                    className={`mt-2.5 w-full py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-sm transition-all flex items-center justify-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#B08D57] text-[#151413] shadow-md'
                        : 'bg-[#151413] text-[#B08D57] border border-[#B08D57]/40 hover:bg-[#B08D57] hover:text-[#151413]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Currently Hanging</span>
                      </>
                    ) : (
                      <span>Hang in 3D Room</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="pt-2 border-t border-[#B08D57]/30 flex items-center justify-between shrink-0">
            <span className="text-[10px] text-[#8C8983] uppercase tracking-wider truncate max-w-[200px]">
              Exhibiting: <strong className="text-[#E8E6E1] font-serif-display">{currentArtwork.title}</strong>
            </span>
            <button
              onClick={() => setShowMobileArtPicker(false)}
              className="px-4 py-2 bg-[#B08D57] text-[#151413] font-bold text-xs uppercase tracking-wider rounded-sm active:scale-95 transition-transform shrink-0"
            >
              Resume 3D View
            </button>
          </div>
        </div>
      )}

      {/* Touch Movement D-Pad Controls for Mobile & Tablet Devices */}
      {showMobileDpad && (
        <div
          className={`lg:hidden absolute bottom-16 right-2 z-30 grid grid-cols-3 gap-1 w-28 h-28 pointer-events-auto transition-all duration-300 ${
            isUiVisible && !isPureMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onMouseDown={() => (moveStateRef.current.forward = true)}
            onMouseUp={() => (moveStateRef.current.forward = false)}
            onMouseLeave={() => (moveStateRef.current.forward = false)}
            onTouchStart={(e) => { e.preventDefault(); moveStateRef.current.forward = true; }}
            onTouchEnd={(e) => { e.preventDefault(); moveStateRef.current.forward = false; }}
            onTouchCancel={(e) => { e.preventDefault(); moveStateRef.current.forward = false; }}
            className="col-start-2 row-start-1 bg-[#151413]/90 border border-[#B08D57]/50 text-[#B08D57] rounded-sm flex items-center justify-center font-bold text-xs active:bg-[#B08D57] active:text-[#151413] shadow-lg"
            aria-label="Walk Forward"
          >
            ▲
          </button>
          <button
            onMouseDown={() => (moveStateRef.current.left = true)}
            onMouseUp={() => (moveStateRef.current.left = false)}
            onMouseLeave={() => (moveStateRef.current.left = false)}
            onTouchStart={(e) => { e.preventDefault(); moveStateRef.current.left = true; }}
            onTouchEnd={(e) => { e.preventDefault(); moveStateRef.current.left = false; }}
            onTouchCancel={(e) => { e.preventDefault(); moveStateRef.current.left = false; }}
            className="col-start-1 row-start-2 bg-[#151413]/90 border border-[#B08D57]/50 text-[#B08D57] rounded-sm flex items-center justify-center font-bold text-xs active:bg-[#B08D57] active:text-[#151413] shadow-lg"
            aria-label="Walk Left"
          >
            ◀
          </button>
          <button
            onClick={handleResetView}
            className="col-start-2 row-start-2 bg-[#1C1B19]/90 border border-[#B08D57]/30 text-[#8C8983] rounded-sm flex items-center justify-center font-mono text-[9px] active:bg-[#B08D57] active:text-[#151413]"
            title="Reset View"
            aria-label="Reset View"
          >
            R
          </button>
          <button
            onMouseDown={() => (moveStateRef.current.right = true)}
            onMouseUp={() => (moveStateRef.current.right = false)}
            onMouseLeave={() => (moveStateRef.current.right = false)}
            onTouchStart={(e) => { e.preventDefault(); moveStateRef.current.right = true; }}
            onTouchEnd={(e) => { e.preventDefault(); moveStateRef.current.right = false; }}
            onTouchCancel={(e) => { e.preventDefault(); moveStateRef.current.right = false; }}
            className="col-start-3 row-start-2 bg-[#151413]/90 border border-[#B08D57]/50 text-[#B08D57] rounded-sm flex items-center justify-center font-bold text-xs active:bg-[#B08D57] active:text-[#151413] shadow-lg"
            aria-label="Walk Right"
          >
            ▶
          </button>
          <button
            onMouseDown={() => (moveStateRef.current.backward = true)}
            onMouseUp={() => (moveStateRef.current.backward = false)}
            onMouseLeave={() => (moveStateRef.current.backward = false)}
            onTouchStart={(e) => { e.preventDefault(); moveStateRef.current.backward = true; }}
            onTouchEnd={(e) => { e.preventDefault(); moveStateRef.current.backward = false; }}
            onTouchCancel={(e) => { e.preventDefault(); moveStateRef.current.backward = false; }}
            className="col-start-2 row-start-3 bg-[#151413]/90 border border-[#B08D57]/50 text-[#B08D57] rounded-sm flex items-center justify-center font-bold text-xs active:bg-[#B08D57] active:text-[#151413] shadow-lg"
            aria-label="Walk Backward"
          >
            ▼
          </button>
        </div>
      )}

      {/* Navigation Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-50 bg-[#151413]/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#1C1B19] border border-[#B08D57]/40 p-6 sm:p-8 rounded-sm max-w-md w-full shadow-2xl text-left relative">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-[#8C8983] hover:text-[#B08D57] transition-colors"
              aria-label="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-[#B08D57] mb-4">
              <Compass className="w-6 h-6" />
              <h3 className="font-serif-display text-2xl text-[#E8E6E1]">3D Controls Guide</h3>
            </div>
            <div className="space-y-3 text-xs text-[#C2C0BA] font-light">
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-[#B08D57] w-24 shrink-0">Look Around:</span>
                <span>Click and drag mouse or swipe 1-finger on mobile.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-[#B08D57] w-24 shrink-0">Pure View:</span>
                <span>Tap canvas to hide/show all text overlays instantly.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-[#B08D57] w-24 shrink-0">Wall Finish:</span>
                <span>Use the Palette control to customize room wall colors.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-[#B08D57] w-24 shrink-0">Walking:</span>
                <span>Use WASD keys, Arrow keys, or the mobile D-Pad.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-[#B08D57] w-24 shrink-0">Zoom:</span>
                <span>Scroll mouse wheel or 2-finger pinch on mobile.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="font-semibold text-[#B08D57] w-24 shrink-0">Hotkeys:</span>
                <span>Press <strong>R</strong> to reset view, <strong>ESC</strong> to close.</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full py-2.5 bg-[#B08D57] text-[#151413] text-xs uppercase tracking-widest font-semibold hover:bg-[#D4B26F] transition-colors rounded-sm"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
