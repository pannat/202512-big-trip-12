import AbstractView from "./abstract";
import {MenuItem} from "../constants";

const createNavTemplate = () => `
            <nav class="trip-controls__trip-tabs  trip-tabs">
              <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-item-name="table">Table</a>
              <a class="trip-tabs__btn" href="#" data-item-name="stats">Stats</a>
            </nav>`.trim();

class Nav extends AbstractView {
  constructor() {
    super();

    this._currentMenuItem = MenuItem.TABLE;
    this._onMenuClick = this._onMenuClick.bind(this);
  }

  setMenuItem(menuItem) {
    this._currentMenuItem = menuItem;

    const items = this.getElement().querySelectorAll(`.trip-tabs__btn`);
    items.forEach((item) => {
      if (item.dataset.itemName === menuItem) {
        item.classList.add(`trip-tabs__btn--active`);
      } else {
        item.classList.remove(`trip-tabs__btn--active`);
      }
    });
  }

  setOnMenuClick(callback) {
    this._callback.itemClick = callback;
    this.getElement().addEventListener(`click`, this._onMenuClick);
  }

  _getTemplate() {
    return createNavTemplate();
  }

  _onMenuClick(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains(`trip-tabs__btn`)) {
      return;
    }

    if (evt.target.dataset.itemName === this._currentMenuItem) {
      return;
    }

    this._callback.itemClick(evt.target.dataset.itemName);
  }
}


export default Nav;

