import {createElement} from "../helpers";

class TripInfo {
  constructor(totalPrice) {
    this._totalPrice = totalPrice ? totalPrice : 0;
    this._element = null;
  }

  getElement() {
    if (this._element) {
      return this._element;
    }
    this._element = createElement(this._getTemplate());

    return this._element;
  }

  removeElement() {
    this._element.remove();
    this._element = null;
  }

  _getTemplate() {
    return `<section class="trip-main__trip-info trip-info">
              <p class="trip-info__cost">
                Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._totalPrice}</span>
              </p>
            </section>`.trim();
  }
}

export default TripInfo;
