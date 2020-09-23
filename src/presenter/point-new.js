import {remove, render, RenderPosition} from "../utils/render";
import {UserAction, UpdateType} from "../constants";
import PointEdit from "../view/point-edit";

class PointNew {
  constructor(container, changeData, dictionariesModel) {
    this._container = container;
    this._changeData = changeData;

    this._dictionariesModel = dictionariesModel;

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

    this._pointEditView = new PointEdit(this._dictionariesModel.getDictionaries());
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
    this._pointEditView.destroyDataPickers();
    this._pointEditView = null;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setSaving() {
    this._pointEditView.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditView.updateData({
        isDisabled: false,
        isSaving: false
      });
    };

    this._pointEditView.shake(resetFormState);
  }

  _handleButtonCancelClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default PointNew;
