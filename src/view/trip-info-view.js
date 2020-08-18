import AbstractView from "./abstract-view";

class TripInfoView extends AbstractView {
  constructor(totalPrice) {
    super();
    this._totalPrice = totalPrice ? totalPrice : 0;
  }

  _getTemplate() {
    return `<section class="trip-main__trip-info trip-info">
              <p class="trip-info__cost">
                Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._totalPrice}</span>
              </p>
            </section>`.trim();
  }
}

export default TripInfoView;
