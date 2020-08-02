const render = (container, element, place) => {
  container.insertAdjacentHTML(place, element);
};

export {render};
