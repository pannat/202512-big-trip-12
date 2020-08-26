import AbstractView from "./abstract";

const createNoPointsTemplate = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`.trim();

class NoPoints extends AbstractView {
  _getTemplate() {
    return createNoPointsTemplate();
  }
}

export default NoPoints;
