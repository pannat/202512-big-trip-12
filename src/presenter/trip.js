import Days from "../view/days";
import {RenderPosition, SortType, LOCALE, sortTypes, render, remove, updateItem} from "../utils";
import NoPoints from "../view/no-points";
import Sort from "../view/sort";
import PointPresenter from "./point";

class Trip {
  constructor(container) {
    this._container = container;
    this._points = null;
    this._currentSortType = SortType.EVENT;
    this._pointPresenter = new Map();

    this._handleSortPoints = this._handleSortPoints.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
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
      pointsForDay.forEach((point) => {
        const pointPresenter = new PointPresenter(element, this._handlePointChange, this._handleModeChange);
        pointPresenter.init(point);
        this._pointPresenter.set(Symbol(point.id), pointPresenter);
      });
    });
  }

  _renderDays(days) {
    this._daysView = new Days(days);
    render(this._container, this._daysView, RenderPosition.BEFORE_END);
  }

  _renderNoPoints() {
    const noPointsView = new NoPoints();
    render(this._container, noPointsView, RenderPosition.BEFORE_END);
  }

  _renderSort() {
    const sort = new Sort(sortTypes);
    render(this._container, sort, RenderPosition.BEFORE_END);
    sort.setSortTypeChangeHandler(this._handleSortPoints);
  }

  _clearTrip() {
    remove(this._daysView);

    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
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

  _handlePointChange(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => {
      presenter.resetView();
    });
  }
}

export default Trip;
