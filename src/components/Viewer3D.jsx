import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Viewer3D = forwardRef(function Viewer3D({ modelUrl, chosenColors, onColorChange, onMeshesDetected }, ref) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshesRef = useRef({});
  const animFrameRef = useRef(null);
  const [selectedMesh, setSelectedMesh] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Expose screenshot capture
  useImperativeHandle(ref, () => ({
    captureScreenshot: () => {
      if (!rendererRef.current) return null;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      return rendererRef.current.domElement.toDataURL('image/png');
    }
  }));

  useEffect(() => {
    if (!mountRef.current || !modelUrl) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.set(0, 0.5, 2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Load GLB
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        scene.add(model);

        // Detect meshes
        const detected = {};
        model.traverse((child) => {
          if (child.isMesh) {
            // Clone material so each mesh has independent color
            child.material = child.material.clone();
            child.material.roughness = 0.6;
            child.material.metalness = 0.2;
            detected[child.name || `mesh_${Object.keys(detected).length}`] = child;
          }
        });

        meshesRef.current = detected;
        const meshNames = Object.keys(detected);
        onMeshesDetected && onMeshesDetected(meshNames);
        if (meshNames.length > 0) setSelectedMesh(meshNames[0]);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error(err);
        setError("Impossible de charger le modèle 3D.");
        setLoading(false);
      }
    );

    // Animate
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  // Apply colors when chosenColors change
  useEffect(() => {
    Object.entries(chosenColors || {}).forEach(([meshName, hexColor]) => {
      const mesh = meshesRef.current[meshName];
      if (mesh) {
        mesh.material.color.set(hexColor);
      }
    });
  }, [chosenColors]);

  // Raycasting for mesh selection on click
  const handleCanvasClick = (e) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const meshList = Object.values(meshesRef.current);
    const intersects = raycaster.intersectObjects(meshList, false);
    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      const name = Object.keys(meshesRef.current).find(k => meshesRef.current[k] === clicked);
      if (name) setSelectedMesh(name);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="w-full h-full rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={handleCanvasClick}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Chargement du modèle 3D…</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-xl">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {Object.keys(meshesRef.current).map(name => (
            <button
              key={name}
              onClick={(e) => { e.stopPropagation(); setSelectedMesh(name); onColorChange && onColorChange({ ...(chosenColors || {}), _selectedMesh: name }); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedMesh === name
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white/90 text-gray-700 border-gray-200 hover:border-orange-300'
              }`}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full mr-1 border border-gray-200"
                style={{ backgroundColor: chosenColors?.[name] || '#808080' }}
              />
              {name}
            </button>
          ))}
        </div>
      )}
      {!loading && !error && (
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-500">
          🖱️ Glisser pour tourner • Scroll pour zoomer
        </div>
      )}
    </div>
  );
});

export default Viewer3D;
