import Days from "../view/days";
import {RenderPosition, render, remove, generateId} from "../utils/render";
import {filter} from "../utils/filter";
import {LOCALE, SortType, sortTypes, UserAction, UpdateType, FilterType} from "../constants";
import NoPoints from "../view/no-points";
import Sort from "../view/sort";
import PointPresenter from "./point";
import PointNew from "./point-new";

class Trip {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.EVENT;
    this._daysView = null;
    this._sortView = null;
    this._pointPresenter = {};

    this._handleSortPoints = this._handleSortPoints.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNew(this._container, this._handleViewAction);
  }

  init() {
    if (this._getPoints().length) {
      this._renderSort();
      this._renderPointsLists();
    } else {
      this._renderNoPoints();
    }
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);

    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);
    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort((a, b) => b.price - a.price);
      case SortType.TIME:
        // TODO: здесь нужна сортировка по продолжительности
        return filteredPoints.sort((a, b) => a.dates.endDate - b.dates.endDate);
    }
    return filteredPoints.sort((a, b) => a.dates.startDate - b.dates.startDate);
  }

  _getUniqueDays() {
    const uniqueDays = [];
    this._getPoints().forEach(({dates}) => {
      const startDay = dates.startDate.toLocaleDateString(LOCALE);
      if (uniqueDays.indexOf(startDay) === -1) {
        uniqueDays.push(startDay);
      }
    });
    return uniqueDays;
  }

  _renderPointsLists() {
    let uniqueDays = [``];
    if (this._currentSortType === SortType.EVENT) {
      uniqueDays = this._getUniqueDays();
    }
    this._renderDays(uniqueDays);
    this._renderPoints(uniqueDays);
  }

  _renderDays(days) {
    this._daysView = new Days(days);
    render(this._container, this._daysView, RenderPosition.BEFORE_END);
  }

  _renderPoints(days) {
    const points = this._getPoints();
    this._daysView.getTripPointsLists().forEach((element, i) => {
      let pointsForDay = points;
      if (days.length > 1) {
        pointsForDay = points.filter(({dates}) => dates.startDate.toLocaleDateString(LOCALE) === days[i]);
      }
      pointsForDay.forEach((point) => {
        const pointPresenter = new PointPresenter(element, this._handleViewAction, this._handleModeChange);
        pointPresenter.init(point);
        this._pointPresenter[point.id] = pointPresenter;
      });
    });
  }

  _renderNoPoints() {
    const noPointsView = new NoPoints();
    render(this._container, noPointsView, RenderPosition.BEFORE_END);
  }

  _renderSort() {
    this._sortView = new Sort(sortTypes);
    render(this._container, this._sortView, RenderPosition.AFTER_BEGIN);
    this._sortView.setSortTypeChangeHandler(this._handleSortPoints);
    this._sortView.restoreHandlers();
  }

  _clearPointsLists() {
    remove(this._daysView);
    this._daysView = null;

    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderTrip() {
    remove(this._sortView);
    this._sortView = null;

    this._currentSortType = SortType.EVENT;
    this._clearPointsLists();
    this.init();
  }

  _handleSortPoints(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPointsLists();
    if (this._getPoints().length) {
      this._renderPointsLists();
    }
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => {
      presenter.resetView();
    });

    this._pointNewPresenter.destroy();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MAJOR:
        this._renderTrip();
        break;
      case UpdateType.MINOR:
        this._clearPointsLists();
        if (this._getPoints().length) {
          this._renderPointsLists();
        } else {
          this._renderNoPoints();
        }
        break;
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
    }
  }
}

export default Trip;
