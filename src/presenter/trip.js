import DaysView from "../view/days-view";
import {render, RenderPosition, LOCALE, replace} from "../utils";
import PointView from "../view/point-view";
import PointEditView from "../view/point-edit-view";
import NoPointsView from "../view/no-points-view";

class Trip {
  constructor(container) {
    this._container = container;
  }

  init(points) {
    this._points = points.slice(0).sort((a, b) => a.dates.startDate - b.dates.startDate);
    if (this._points.length) {
      this.renderTrip();
    } else {
      this._renderNoPoints();
    }
  }

  renderTrip() {
    const uniqueDays = this._getUniqueDays();
    this._renderDays(uniqueDays);
    this._renderPoints(uniqueDays);
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

  _renderPoints(days) {
    this._daysView.getTripPointsLists().forEach((element, i) => {
      const pointsForDay = this._points.filter(({dates}) => dates.startDate.toLocaleDateString(LOCALE) === days[i].toLocaleDateString(LOCALE));
      pointsForDay.forEach((point) => this._renderPoint(element, point));
    });
  }

  _renderDays(days) {
    this._daysView = new DaysView(days);
    render(this._container, this._daysView, RenderPosition.BEFORE_END);
  }

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

    render(container, pointView, RenderPosition.BEFORE_END);
    pointView.setOnButtonClick(replaceCardToForm);
  }

  _renderNoPoints() {
    const noPointsView = new NoPointsView();
    render(this._container, noPointsView, RenderPosition.BEFORE_END);
  }

  _renderSort() {}
}

export default Trip;
