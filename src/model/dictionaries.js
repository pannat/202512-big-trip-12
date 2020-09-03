class Dictionaries {
  constructor() {
    this._destination = null;
    this._offers = null;
  }

  setDestination(destination) {
    this._destination = destination.slice(0);
  }

  setOffers(offers) {
    this._offers = offers.slice(0);
  }

  getDestination() {
    return this._destination;
  }

  getOffers() {
    return this._offers;
  }
}

export default Dictionaries;
