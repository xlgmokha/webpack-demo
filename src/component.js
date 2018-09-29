export default (text = HELLO) => {
  const element = document.createElement("div");
  element.className = "pure-button";
  element.innerHTML = text;

  element.onclick = () => {
    import("./lazy")
      .then(lazy => {
        element.textContent = lazy.default;
      })
      .catch(error => {
        console.error(error);
      })
  }

  return element;
};
