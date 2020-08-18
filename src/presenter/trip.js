import DaysView from "../view/days-view";
import {render, RenderPosition, LOCALE, replace} from "../utils";
import PointView from "../view/point-view";
import PointEditView from "../view/point-edit-view";

class Trip {
  constructor(container) {
    this._container = container;
  }

  init(points) {
    this._points = points.slice(0);
    const uniqueDays = this._getUniqueDays();
    this._daysView = new DaysView(uniqueDays);
    render(this._container, this._daysView, RenderPosition.BEFORE_END);
    this._daysView.getTripPointsLists().forEach((element, i) => {
      const pointsForDay = this._points.filter(({dates}) => dates.startDate.toLocaleDateString(LOCALE) === uniqueDays[i].toLocaleDateString(LOCALE));
      pointsForDay.forEach((point) => this._renderPoint(element, point));
    });
  }

  _getUniqueDays() {
    const uniqueDays = [];
    this._points.forEach(({dates}) => {
      const startDay = dates.startDate.toLocaleDateString(LOCALE);
      if (uniqueDays.indexOf(startDay) === -1) {
        uniqueDays.push(new Date(startDay));
      }
    });

    return uniqueDays;
  }

  _renderSort() {}

  _renderPoint(container, point) {
    const pointView = new PointView(point);
    const pointEditView = new PointEditView(point);

    const replaceFormToCard = () => {
      replace(pointView, pointEditView);
      pointView.setOnButtonClick(replaceCardToForm);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const replaceCardToForm = () => {
      replace(pointEditView, pointView);
      pointEditView.setOnSubmitForm(replaceFormToCard);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
      }
    };

    render(container, point.getElement(), RenderPosition.BEFORE_END);
    point.setOnButtonClick(replaceCardToForm);
  }

  _renderNoPoints() {}

  _renderTrip() {}
}

export default Trip;
