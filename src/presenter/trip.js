import DaysView from "../view/days-view";
import {RenderPosition, SortType, LOCALE, sortTypes, replace, render} from "../utils";
import PointView from "../view/point-view";
import PointEditView from "../view/point-edit-view";
import NoPointsView from "../view/no-points-view";
import SortView from "../view/sort-view";

class Trip {
  constructor(container) {
    this._container = container;
    this._handleSortPoints = this._handleSortPoints.bind(this);
    this._points = null;
    this._currentSortType = SortType.EVENT;
  }

  init(points) {
    this._points = points.slice(0).sort((a, b) => a.dates.startDate - b.dates.startDate);
    if (this._points.length) {
      this._renderSort();
      this._renderTrip();
    } else {
      this._renderNoPoints();
    }
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

  _renderTrip() {
    let uniqueDays = [``];
    if (this._currentSortType === SortType.EVENT) {
      uniqueDays = this._getUniqueDays();
    }
    this._renderDays(uniqueDays);
    this._renderPoints(uniqueDays);
  }

  _renderPoints(days) {
    this._daysView.getTripPointsLists().forEach((element, i) => {
      let pointsForDay = this._points.slice(0);
      if (days.length > 1) {
        pointsForDay = this._points.filter(({dates}) => dates.startDate.toLocaleDateString(LOCALE) === days[i].toLocaleDateString(LOCALE));
      }
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

  _renderSort() {
    const sort = new SortView(sortTypes);
    render(this._container, sort, RenderPosition.BEFORE_END);
    sort.setSortTypeChangeHandler(this._handleSortPoints);
  }

  _clearTrip() {
    this._daysView.getElement().innerHTML = ``;
  }

  _handleSortPoints(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    switch (sortType) {
      case SortType.PRICE:
        this._points = this._points.slice(0).sort((a, b) => b.price - a.price);
        break;
      case SortType.TIME:
        this._points = this._points.slice(0).sort((a, b) => a.dates.endDate - b.dates.endDate);
        break;
      default:
        this._points = this._points.slice(0).sort((a, b) => a.dates.startDate - b.dates.startDate);
    }

    this._clearTrip();
    if (this._points.length) {
      this._renderTrip();
    }
  }
}

export default Trip;
