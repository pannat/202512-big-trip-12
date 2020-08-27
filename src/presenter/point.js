import Point from "../view/point";
import PointEdit from "../view/point-edit";
import {render, RenderPosition, replace, remove} from "../utils";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class PointPresenter {
  constructor(container, changePoint, changeMode) {
    this._container = container;

    this._pointView = null;
    this._pointEditView = null;
    this._mode = Mode.DEFAULT;
    this._changePoint = changePoint;
    this._changeMode = changeMode;
    this._replaceCardToForm = this._replaceCardToForm.bind(this);
    this._replaceFormToCard = this._replaceFormToCard.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
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

  _handleFavoriteClick() {
    this._changePoint(Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToCard();
    }
  }
}

export default PointPresenter;
