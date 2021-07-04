import { button, div } from "./elements.js";

class BackgroundPicker {
  static list = document.getElementById("background-picker");

  static append = (name, onClick) => {
    const element = div({
      class: "background-picker-item",
      children: button({ children: name }),
    });

    element.addEventListener("click", onClick);
    BackgroundPicker.list.appendChild(element);

    return element;
  };
}

export default BackgroundPicker;
