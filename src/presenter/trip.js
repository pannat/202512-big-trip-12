import Days from "../view/days";
import LoadingView from "../view/loading";
import {RenderPosition, render, remove} from "../utils/render";
import {filter} from "../utils/filter";
import {SortType, UserAction, UpdateType, FilterType} from "../constants";
import NoPoints from "../view/no-points";
import Sort from "../view/sort";
import PointPresenter, {State as PointPresenterViewState} from "./point";
import PointNew from "./point-new";

import PointsModel from "../model/points";

class Trip {
  constructor(container, pointsModel, filterModel, dictionariesModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._dictionariesModel = dictionariesModel;

    this._api = api;

    this._isLoading = true;

    this._currentSortType = SortType.EVENT;

    this._daysView = null;
    this._sortView = null;
    this._noPointsView = null;
    this._loadingView = new LoadingView();

    this._pointPresenter = {};

    this._handleSortPoints = this._handleSortPoints.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointNewPresenter = new PointNew(
        this._container,
        this._handleViewAction,
        this._dictionariesModel
    );
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderTrip();
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getPoints().length) {
      this._renderSort();
      this._renderPointsLists();
    } else {
      this._renderNoPoints();
    }
  }

  destroy() {
    if (this._daysView) {
      this._clearPointsLists();
    }

    if (this._sortView) {
      remove(this._sortView);
      this._sortView = null;
      this._currentSortType = SortType.EVENT;
    }

    if (this._noPointsView) {
      remove(this._noPointsView);
      this._noPointsView = null;
    }

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    const handleCloseCreatePoint = () => {
      if (!this._getPoints().length) {
        this._renderNoPoints();
      }
      callback();
    };

    this._pointNewPresenter.init(handleCloseCreatePoint);
    if (this._getPoints().length) {
      if (this._filterModel.getFilter() !== FilterType.EVERYTHING) {
        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      } else {
        this.destroy();
        this.init();
      }
    } else {
      remove(this._noPointsView);
      this._noPointsView = null;
    }
  }

  _renderLoading() {
    render(this._container, this._loadingView, RenderPosition.AFTER_BEGIN);
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
    remove(this._daysView);
    this._daysView = null;

    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
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
        this._pointNewPresenter.setSaving();
        this._api.addPoint(PointsModel.adaptToServer(update))
          .then((point) => {
            this._pointsModel.addPoint(updateType, point);
            this._pointNewPresenter.destroy();
          })
          .catch((error) => {
            this._pointNewPresenter.setAborting();
            throw new Error(error);
          });
        break;

      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(PointsModel.adaptToServer(update))
          .then((point) => {
            this._pointsModel.updatePoint(updateType, point);
          })
          .catch((error) => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
            throw new Error(error);
          });
        break;

      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch((error) => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
            throw new Error(error);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.destroy();
        this.init();
        break;
      case UpdateType.MINOR:
        this._clearPointsLists();
        this._renderPointsLists();
        break;
      case UpdateType.PATCH:
        this._pointPresenter[data.id].updateData(data);
        this._pointPresenter[data.id].setViewState(PointPresenterViewState.DEFAULT);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingView);
        this._renderTrip();
        break;
    }
  }
}

export default Trip;
