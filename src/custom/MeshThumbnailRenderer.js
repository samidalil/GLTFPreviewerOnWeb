import * as THREE from "../three/three.js";

import MeshGallery from "../ui/MeshGallery.js";

class MeshThumbnailRenderer {
  constructor(mesh, onSelect) {
    this.setup(mesh.clone(), onSelect);
    this.render();
  }

  camera = null;
  containerId = null;
  orbitPoint = null;
  renderer = null;
  scene = null;

  setup = (mesh, onSelect) => {
    /** Init */

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.8;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    MeshGallery.append(this.renderer.domElement, onSelect);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.renderer.domElement.clientWidth /
        this.renderer.domElement.clientHeight,
      0.25,
      500
    );

    /** Target convex hull of mesh */

    const target = new THREE.Box3().setFromObject(mesh);
    const center = target.getCenter(new THREE.Vector3());
    const size = target.getSize(new THREE.Vector3());
    const position = center.clone().add(size);

    this.camera.position.copy(position);

    this.orbitPoint = new THREE.Object3D();
    this.orbitPoint.position.copy(center);
    this.orbitPoint.add(this.camera);

    /** Populate */

    this.scene.add(new THREE.AmbientLight(0xffffff));
    this.scene.add(mesh);
  };

  changeBackground = (backgroundTexture) => {
    this.scene.background = backgroundTexture.clone();
    this.scene.background.needsUpdate = true;
  };

  render = () => {
    this.orbitPoint.rotation.y += 0.005;
    this.camera.lookAt(this.orbitPoint.position);
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render);
  };
}

export default MeshThumbnailRenderer;
