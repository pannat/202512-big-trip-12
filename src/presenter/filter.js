import {render, RenderPosition} from "../utils/render";
import FilterView from "../view/filter";
import {filters} from "../constants";
import {UpdateType} from "../constants";

class Filter {
  constructor(container, filterModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._currentFilter = null;
    this._filterView = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    this._filterView = new FilterView(filters, this._currentFilter);
    this._filterView.setOnFilterChange(this._filterChangeHandler);
    this._filterView.restoreHandlers();
    render(this._container, this._filterView, RenderPosition.BEFORE_END);
  }

  _filterChangeHandler(filter) {
    this._filterModel.setFilter(UpdateType.MAJOR, filter);
  }
}

export default Filter;
