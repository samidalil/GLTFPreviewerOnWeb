import { div } from "./elements.js";

class MeshGallery {
  static gallery = document.getElementById("mesh-gallery");

  static append = (canvas, onClick) => {
    const container = div({
      class: "mesh-gallery-item",
      children: canvas,
    });

    container.addEventListener("click", onClick);
    MeshGallery.gallery.appendChild(container);

    return container;
  };
}

export default MeshGallery;
