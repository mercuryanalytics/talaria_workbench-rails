'use strict';
window.define(['module'], function(module) {
  // here's the planned API...
  //      Talaria(urn) => promise (or perhaps progress stream) for the dataset of the project or question specified by the URN
  //      Dataset#respondents -- an array of respondents, suitable for using in queries
  //      Dataset#schema -- an array of Variable, identifying the available variables and their definitions
  //      Dataset#discard -- discard the dataset so as to free memory; caller responsible to not call any other methods (and their behavior is undefined)
  //      Respondent#rid
  //      Respondent#weight
  //      Respondent#staticWeight
  //      Respondent#response(variable)
  //      Variable#name
  //      Variable#type
  //      Variable[type === 'category' || type === 'multipunch']#categories
  //      Variable[type === 'm2m']#labels
  //      Variable[type === 'm2m']#buttons
  //      Variable[type === 'text-highlight']#copy
  // the query API should be mostly separate.
  //      Query(string) => a function that returns true when passed an object that "matches" the query; use it like this: data.respondents.filter(Query("..."));
  //

  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  class Dataset {
    constructor(data) {
      this.schema = [];
      if (data.schema) this.schema = data.schema.map(entry => Variable.create(this, entry));
      this.respondents = [];
      if (data.respondents) this.respondents = data.respondents.map(entry => new Respondent(this, entry));
      this.disableStaticWeights = false;
    }

    discard() {
      this.respondents = [];
      this.schema = [];
    }
  }

  class Variable {
    static create(dataset, data) {
      switch (data.type) {
        case 'categorical': return new CategoricalVariable(dataset, data);
        case 'multipunch': return new MultipunchVariable(dataset, data);
        case 'text': return new TextVariable(dataset, data);
        case 'm2m': return new M2MVariable(dataset, data);
        case 'text_highlight': return new TextHighlightVariable(dataset, data);
        case 'spotlight': return new SpotlightVariable(dataset, data);
        default: throw new TypeError("Unknown type " + data.type);
      }
    }

    constructor(dataset, data) {
      this.dataset = dataset;
      this.type = data.type;
      this.name = data.name;
      this.key = Symbol(data.name);
    }

    store(map, value) {
      map[this.key] = value;
      return map;
    }

    lookup(map) { return this.interpret(map[this.key]); }
    interpret(value) { return value; }
  }

  class CategoricalVariable extends Variable {
    constructor(dataset, data) {
      super(dataset, data);
      this._categories = data.categories;
    }
    get categories() { return this._categories; }
    interpret(value) { return this.categories[value]; }
  }
  class MultipunchVariable extends CategoricalVariable {}
  class TextVariable extends Variable {}
  class M2MVariable extends Variable {
    get labels() {}
    get buttons() {}
  }
  class TextHighlightVariable extends Variable {
    get copy() {}
  }
  class SpotlightVariable extends Variable {
    get image() {}
  }

  class Respondent {
    constructor(dataset, data) {
      this.dataset = dataset;
      this.rid = data.rid
      this.staticWeight = data.weight;
      this.dynamicWeight = 1;
      this.responses = []; // data.responses;
      if (data.responses) this.responses = data.responses.reduce((map, r) => dataset.schema[r.k].store(map, r.v), {});
    }

    get weight() {
      if (this.dataset && this.dataset.disableStaticWeights) return this.dynamicWeight
      return this.staticWeight * this.dynamicWeight;
    }

    response(variable) {
      return this.responses[variable.name];
    }

    getResponseValue(name) {
      var v = this.dataset.schema.find(vv => vv.name === name);
      return v ? v.lookup(this.responses) : null;
    }
  }

  var scriptBase = (function(base) {
    var pos = base.lastIndexOf('/') + 1;
    var resource = base.substr(pos);
    base = base.substr(0, pos);
    pos = base.indexOf('/') + 1;
    pos = base.indexOf('/', pos) + 1;
    pos = base.indexOf('/', pos) + 1;
    var authority = base.substr(0, pos);
    var path = base.substr(pos);
    return { authority: authority, path: path, resource: resource };
  })(module.uri);

  function Workbench(urn) {
    var talariaURN = /^(?:urn:)?talaria:(question|project):/;
    var match = talariaURN.exec(urn);
    if (!match) throw new TypeError("Talaria URN required");

    var name = urn.substr(match.index + match[0].length);
    // switch (match[1]) { case 'question': break; case 'project': break; }

    var authority = scriptBase.authority;
    return window.fetch(`${authority}api/questions/${name}`, {
      mode: 'cors',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    }).then(response => response.json())
      .then(response => new Dataset(response));
  }

  return Workbench;
});
