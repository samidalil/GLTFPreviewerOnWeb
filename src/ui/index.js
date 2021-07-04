import { manager } from "../context.js";

const upload = document.getElementById("upload");

upload.addEventListener("change", event => manager.loadMesh(event.target.files[0]));
