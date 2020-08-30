import {remove, render, RenderPosition} from "../utils/render";
import {UserAction, UpdateType} from "../constants";
import {generateId} from "../mock";
import PointEdit from "../view/point-edit";

class PointNew {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._destroyCallback = null;
    this._pointEditView = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleButtonCancelClick = this._handleButtonCancelClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointEditView !== null) {
      return;
    }

    this._pointEditView = new PointEdit();
    this._pointEditView.setOnFormSubmit(this._handleFormSubmit);
    this._pointEditView.setOnButtonResetClick(this._handleButtonCancelClick);
    this._pointEditView.restoreHandlers();

    render(this._container, this._pointEditView, RenderPosition.AFTER_BEGIN);
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  destroy() {
    if (this._pointEditView === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointEditView);
    this._pointEditView = null;
  }

  _handleButtonCancelClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    point.id = generateId();
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        point
    );

    this.destroy();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default PointNew;
