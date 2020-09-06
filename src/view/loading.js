import AbstractView from "./abstract";

const createLoadingTemplate = () => `<p class="trip-events__msg">Loading...</p>`;

class Loading extends AbstractView {
  _getTemplate() {
    return createLoadingTemplate();
  }
}

export default Loading;
