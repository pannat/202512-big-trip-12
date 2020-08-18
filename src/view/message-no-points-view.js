import AbstractView from "./abstract-view";

class MessageNoPointsView extends AbstractView {
  _getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`.trim();
  }
}

export default MessageNoPointsView;
