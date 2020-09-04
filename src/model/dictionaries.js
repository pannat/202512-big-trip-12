class Dictionaries {
  constructor() {
    this._destination = null;
    this._offersList = null;
  }

  setDestination(destination) {
    this._destination = destination.slice(0);
  }

  setOffersLists(offersLists) {
    this._offersLists = offersLists.slice(0);
  }

  getDestinations() {
    return this._destination;
  }

  getOffersLists() {
    return this._offersLists;
  }
}

export default Dictionaries;
