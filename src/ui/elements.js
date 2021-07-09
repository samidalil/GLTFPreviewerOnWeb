const htmlElementFactory = (name) => (properties) => {
  const element = document.createElement(name);

  if (typeof properties === "object" && properties !== null) {
    const { children, ...attributes } = properties;

    Object.entries(attributes).forEach(([key, value]) =>
      element.setAttribute(key, value)
    );

    if (children !== undefined && children !== null) {
      const type = typeof children;

      if (type === "string") element.innerHTML = children;
      else if (type === "number") element.innerHTML = children.toString();
      else element.appendChild(children);
    }
  }

  return element;
};

export const button = htmlElementFactory("button");

export const div = htmlElementFactory("div");
