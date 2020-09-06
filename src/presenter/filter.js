import {render, remove, RenderPosition} from "../utils/render";
import {filter} from "../utils/filter";
import {UpdateType, FilterType} from "../constants";
import FilterView from "../view/filter";

class Filter {
  constructor(container, pointsModel, filterModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._currentFilter = null;
    this._filterView = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    this._filterView = new FilterView(this._getFilters(), this._currentFilter);
    this._filterView.setOnFilterChange(this._filterChangeHandler);
    this._filterView.restoreHandlers();
    render(this._container, this._filterView, RenderPosition.BEFORE_END);
  }

  destroy() {
    remove(this._filterView);
    this._filterView = null;
  }

  _filterChangeHandler(currentFilter) {
    this._filterModel.setFilter(UpdateType.MAJOR, currentFilter);
  }

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _getFilters() {
    const points = this._getPoints();
    return [
      {
        name: FilterType.EVERYTHING,
        isDisabled: !points.length,
      },
      {
        name: FilterType.FUTURE,
        isDisabled: !filter[FilterType.FUTURE](points).length
      },
      {
        name: FilterType.PAST,
        isDisabled: !filter[FilterType.PAST](points).length
      }
    ];
  }

  _handleModelEvent(updateType) {
    if (updateType === UpdateType.MAJOR ||
        updateType === UpdateType.INIT) {
      this.destroy();
      this.init();
    }
  }
}

export default Filter;
