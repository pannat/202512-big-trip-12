import Point from "../view/point";
import PointEdit from "../view/point-edit";
import {RenderPosition, render, replace, remove} from "../utils/render";
import {UpdateType, UserAction} from "../constants";

const State = {
  DELETING: `DELETING`,
  SAVING: `SAVING`,
  ABORTING: `ABORTING`
};

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class PointPresenter {
  constructor(container, changeData, changeMode, dictionariesModel) {
    this._container = container;
    this._dictionariesModel = dictionariesModel;

    this._pointView = null;
    this._pointEditView = null;
    this._mode = Mode.DEFAULT;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._replaceCardToForm = this._replaceCardToForm.bind(this);
    this._replaceFormToCard = this._replaceFormToCard.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleButtonDeleteClick = this._handleButtonDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointView = this._pointView;
    const prevPointEditView = this._pointEditView;

    this._pointView = new Point(this._point);
    this._pointEditView = new PointEdit(this._dictionariesModel.getDestinations(), this._dictionariesModel.getOffersLists(), this._point);
    this._pointEditView.setOnFormSubmit(this._handleFormSubmit);
    this._pointEditView.setOnButtonCloseClick(this._replaceFormToCard);
    this._pointEditView.setOnFavoriteChange(this._handleFavoriteClick);
    this._pointEditView.setOnButtonResetClick(this._handleButtonDeleteClick);
    this._pointView.setOnButtonClick(this._replaceCardToForm);

    if (!prevPointView || !prevPointEditView) {
      render(this._container, this._pointView, RenderPosition.BEFORE_END);
      this._pointView.restoreHandlers();
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointView, prevPointView);
      this._pointView.restoreHandlers();
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditView, prevPointEditView);
      this._pointEditView.restoreHandlers();
    }
  }

  destroy() {
    this._pointEditView.destroyDataPickers();
    remove(this._pointView);
    remove(this._pointEditView);

    this._pointView = null;
    this._pointEditView = null;
  }

  resetView() {
    if (this._mode === Mode.EDITING) {
      this._replaceFormToCard();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditView.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditView.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._pointEditView.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._pointEditView.shake(resetFormState);
        break;
    }
  }

  _replaceCardToForm() {
    replace(this._pointEditView, this._pointView);
    this._pointEditView.restoreHandlers();
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    this._pointEditView.reset(this._point);
    replace(this._pointView, this._pointEditView);
    this._pointView.restoreHandlers();
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleFavoriteClick(update) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        update);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _handleButtonDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }
}

export {State, PointPresenter as default};

