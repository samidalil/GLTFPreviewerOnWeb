import { manager } from "../context.js";
import BackgroundPicker from "./BackgroundPicker.js";
import MeshGallery from "./MeshGallery.js";

const upload = document.getElementById("upload");
const colorPicker = document.getElementById("light-color");
const intensityRange = document.getElementById("light-intensity");
const meshGalleryDisplay = document.getElementById("mesh-gallery-display-button");
const BackgroundPickerDisplay = document.getElementById("background-picker-display-button");

upload.addEventListener("change", (event) =>
  manager.loadMesh(event.target.files[0])
);
colorPicker.addEventListener("input", (event) =>
  manager.changeLightColor(event.target.value)
);
intensityRange.addEventListener("input", (event) =>
  manager.changeLightIntensity(+event.target.value)
);
meshGalleryDisplay.addEventListener("click", () => {
  meshGalleryDisplay.classList.toggle("bg-color-primary");
  meshGalleryDisplay.classList.toggle("bg-color-neutral");
  MeshGallery.galleryContainer.classList.toggle("hide");
  MeshGallery.galleryContainer.classList.toggle("interactable");
});
BackgroundPickerDisplay.addEventListener("click", () => {
  BackgroundPickerDisplay.classList.toggle("bg-color-primary");
  BackgroundPickerDisplay.classList.toggle("bg-color-neutral");
  BackgroundPicker.listContainer.classList.toggle("hide");
  BackgroundPicker.listContainer.classList.toggle("interactable");
});
