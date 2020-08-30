import Point from "../view/point";
import PointEdit from "../view/point-edit";
import {RenderPosition, render, replace, remove} from "../utils/render";
import {UpdateType, UserAction} from "../constants";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class PointPresenter {
  constructor(container, changeData, changeMode) {
    this._container = container;

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
    this._pointEditView = new PointEdit(this._point);
    this._pointEditView.setOnFormSubmit(this._replaceFormToCard);
    this._pointEditView.setOnButtonCloseClick(this._replaceFormToCard);
    this._pointEditView.setOnFavoriteChange(this._handleFavoriteClick);
    this._pointEditView.setOnButtonDeleteClick(this._handleButtonDeleteClick);
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
    remove(this._pointView);
    remove(this._pointEditView);
  }

  resetView() {
    if (this._mode === Mode.EDITING) {
      this._replaceFormToCard();
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

  _handleFavoriteClick(isFavorite) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        Object.assign({}, this._point, {isFavorite}));
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.PATCH,
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

export default PointPresenter;
