const generateReadFunction = (method) => (file) =>
  new Promise((res) => {
    const reader = new FileReader();

    reader.addEventListener("load", (event) => res(event.target.result), false);
    reader[method](file);
  });

export const readAsDataURL = generateReadFunction("readAsDataURL");
