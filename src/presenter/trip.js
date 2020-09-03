import Days from "../view/days";
import {RenderPosition, render, remove} from "../utils/render";
import {filter} from "../utils/filter";
import {LOCALE, SortType, UserAction, UpdateType, FilterType} from "../constants";
import NoPoints from "../view/no-points";
import Sort from "../view/sort";
import PointPresenter from "./point";
import PointNew from "./point-new";

class Trip {
  constructor(container, pointsModel, filterModel, dictionariesModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._dictionariesModel = dictionariesModel;

    this._currentSortType = SortType.EVENT;
    this._daysView = null;
    this._sortView = null;
    this._noPointsView = null;
    this._pointPresenter = {};

    this._handleSortPoints = this._handleSortPoints.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointNewPresenter = new PointNew(this._container, this._handleViewAction);
  }

  init() {
    if (this._getPoints().length) {
      this._renderSort();
      this._renderPointsLists();
      this._pointsModel.addObserver(this._handleModelEvent);
      this._filterModel.addObserver(this._handleModelEvent);
    } else {
      this._renderNoPoints();
    }
  }

  destroy() {
    if (this._getPoints().length) {
      remove(this._sortView);
      this._sortView = null;
      this._currentSortType = SortType.EVENT;
      this._clearPointsLists();
      this._pointsModel.removeObserver(this._handleModelEvent);
      this._filterModel.removeObserver(this._handleModelEvent);
    } else {
      remove(this._noPointsView);
      this._noPointsView = null;
    }
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
    if (this._getPoints().length) {
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    } else {
      remove(this._noPointsView);
      this._noPointsView = null;
    }
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);
    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort((a, b) => b.price - a.price);
      case SortType.TIME:
        return filteredPoints.sort((a, b) => b.duration - a.duration);
    }

    return filteredPoints.sort((a, b) => a.dates.startDate - b.dates.startDate);
  }

  _getUniqueDays() {
    const uniqueDays = [];
    this._getPoints().forEach(({dates}) => {
      const startDay = dates.startDate.format(`ll`);
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
        pointsForDay = points.filter(({dates}) => dates.startDate.format(`ll`) === days[i]);
      }
      pointsForDay.forEach((point) => {
        const pointPresenter = new PointPresenter(element, this._handleViewAction, this._handleModeChange, this._dictionariesModel);
        pointPresenter.init(point);
        this._pointPresenter[point.id] = pointPresenter;
      });
    });
  }

  _renderNoPoints() {
    this._noPointsView = new NoPoints();
    render(this._container, this._noPointsView, RenderPosition.AFTER_BEGIN);
  }

  _renderSort() {
    this._sortView = new Sort(this._currentSortType);
    render(this._container, this._sortView, RenderPosition.AFTER_BEGIN);
    this._sortView.setSortTypeChangeHandler(this._handleSortPoints);
    this._sortView.restoreHandlers();
  }

  _clearPointsLists() {
    if (this._daysView) {
      remove(this._daysView);
      this._daysView = null;
    }

    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderTrip() {
    if (this._sortView) {
      remove(this._sortView);
      this._sortView = null;
    }

    if (this._noPointsView) {
      remove(this._noPointsView);
      this._noPointsView = null;
    }

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
    this._renderPointsLists();
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
      // case UpdateType.MINOR:
      //   this._clearPointsLists();
      //   this._renderPointsLists();
      //   break;
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
    }
  }
}

export default Trip;
