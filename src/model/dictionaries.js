import Observer from "../utils/observer";
import {UpdateType} from "../constants";

class Dictionaries extends Observer {
  constructor() {
    super();
    this._dictionaries = {};
  }

  setDictionaries(dictionaries) {
    Object.entries(dictionaries).forEach(([key, value]) => {
      this._dictionaries[key] = value.slice(0);
    });
    this._notify(UpdateType.MINOR);
  }

  getDictionaries() {
    return this._dictionaries;
  }
}

export default Dictionaries;
