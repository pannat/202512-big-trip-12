import AbstractView from "./abstract";

const createTripInfoTemplate = (totalPrice) => `
            <section class="trip-main__trip-info trip-info">
              <p class="trip-info__cost">
                Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
              </p>
            </section>`.trim();

class TripInfo extends AbstractView {
  constructor(totalPrice) {
    super();
    this._totalPrice = totalPrice ? totalPrice : 0;
  }

  _getTemplate() {
    return createTripInfoTemplate(this._totalPrice);
  }
}

export default TripInfo;
