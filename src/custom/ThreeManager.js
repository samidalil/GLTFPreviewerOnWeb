import * as THREE from "../three/three.js";
import { GLTFLoader } from "../three/GLTFLoader.js";
import { LoadingManager } from "../three/LoadingManager.js";
import { OrbitControls } from "../three/OrbitControls.js";

import { readAsDataURL } from "../lib/index.js";
import MeshThumbnailRenderer from "./MeshThumbnailRenderer.js";
import { backgrounds } from "./resources.js";
import BackgroundPicker from "../ui/BackgroundPicker.js";

class ThreeManager {
  constructor(id) {
    this.canvasId = id;
  }

  animationBatches = [];
  backgroundTextures = [];
  camera = null;
  canvas = null;
  canvasId = null;
  clock = new THREE.Clock();
  controls = null;
  cubeTextureLoader = new THREE.CubeTextureLoader();
  currentBackgroundIndex = null;
  currentSceneIndex = null;
  gltfLoader = new GLTFLoader(new LoadingManager());
  light = null;
  mixer = null;
  renderer = null;
  scene = null;
  scenes = [];
  thumbnailRenderers = [];

  launch = () => {
    this.setup();

    window.requestAnimationFrame(this.render);
  };

  setup = () => {
    /** Init */

    this.canvas = document.getElementById(this.canvasId);

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });

    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      false
    );
    this.renderer.setClearColor(0xffffff);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.25,
      100
    );
    this.camera.position.set(0, 0, 15);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.minDistance = 2;
    this.controls.maxDistance = 50;
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    /** Populate */

    this.light = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.light);
    this.loadBackgroundTextures().then(() => this.switchBackground(0));

    new THREE.PMREMGenerator(this.renderer).compileEquirectangularShader();
  };

  loadBackgroundTextures = async () => {
    this.backgroundTextures = backgrounds.map((data) =>
      this.cubeTextureLoader.load(data)
    );

    this.backgroundTextures.forEach((e, index) =>
      BackgroundPicker.append(`Background ${index + 1}`, () =>
        this.switchBackground(index)
      )
    );
  };

  loadMesh = async (file) => {
    const data = await readAsDataURL(file);
    const gltf = await new Promise((res, rej) =>
      this.gltfLoader.load(data, res, null, rej)
    );

    this.scenes.push(gltf.scene);
    this.animationBatches.push(gltf.animations);

    const index = this.scenes.length - 1;
    const onSelect = () => this.switchScene(index);
    const thumbnail = new MeshThumbnailRenderer(this.scenes[index], onSelect);

    thumbnail.changeBackground(
      this.backgroundTextures[this.currentBackgroundIndex]
    );
    this.thumbnailRenderers.push(thumbnail);
    onSelect();
  };

  changeLightColor = (color) => this.light.color.set(color);

  changeLightIntensity = (intensity) => (this.light.intensity = intensity);

  switchScene = (index) => {
    if (this.currentSceneIndex !== null) {
      this.scene.remove(this.scenes[this.currentSceneIndex]);
      this.mixer.stopAllAction();
    }

    this.currentSceneIndex = index;
    this.scene.add(this.scenes[index]);
    this.mixer = new THREE.AnimationMixer(this.scenes[index]);
    this.animationBatches[index].forEach((clip) =>
      this.mixer.clipAction(clip).play()
    );
  };

  switchBackground = (index) => {
    this.currentBackgroundIndex = index;
    this.scene.background = this.backgroundTextures[index];
    this.thumbnailRenderers.forEach((e) =>
      e.changeBackground(this.scene.background)
    );
  };

  render = () => {
    if (this.mixer) this.mixer.update(this.clock.getDelta());

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render);
  };
}

export default ThreeManager;
