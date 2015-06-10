'use strict';
window.define(['module'], function(module) {var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;
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

  var Dataset = (function(){var proto$0={};
    function Dataset(data) {var this$0 = this;
      this.schema = [];
      if (data.schema) this.schema = data.schema.map(function(entry ) {return Variable.create(this$0, entry)});
      this.respondents = [];
      if (data.respondents) this.respondents = data.respondents.map(function(entry ) {return new Respondent(this$0, entry)});
      this.disableStaticWeights = false;
    }DP$0(Dataset,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.discard = function() {
      this.respondents = [];
      this.schema = [];
    };
  MIXIN$0(Dataset.prototype,proto$0);proto$0=void 0;return Dataset;})();

  var Variable = (function(){var static$0={},proto$0={};
    static$0.create = function(dataset, data) {
      switch (data.type) {
        case 'categorical': return new CategoricalVariable(dataset, data);
        case 'multipunch': return new MultipunchVariable(dataset, data);
        case 'text': return new TextVariable(dataset, data);
        case 'm2m': return new M2MVariable(dataset, data);
        case 'text_highlight': return new TextHighlightVariable(dataset, data);
        case 'spotlight': return new SpotlightVariable(dataset, data);
        default: throw new TypeError("Unknown type " + data.type);
      }
    };

    function Variable(dataset, data) {
      this.dataset = dataset;
      this.type = data.type;
      this.name = data.name;
      this.key = Symbol(data.name);
    }DP$0(Variable,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    proto$0.store = function(map, value) {
      map[this.key] = value;
      return map;
    };

    proto$0.lookup = function(map) { return this.interpret(map[this.key]); };
    proto$0.interpret = function(value) { return value; };
  MIXIN$0(Variable,static$0);MIXIN$0(Variable.prototype,proto$0);static$0=proto$0=void 0;return Variable;})();

  var CategoricalVariable = (function(super$0){if(!PRS$0)MIXIN$0(CategoricalVariable, super$0);var proto$0={};
    function CategoricalVariable(dataset, data) {
      super$0.call(this, dataset, data);
      this._categories = data.categories;
    }if(super$0!==null)SP$0(CategoricalVariable,super$0);CategoricalVariable.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":CategoricalVariable,"configurable":true,"writable":true}, categories: {"get": $categories_get$0, "configurable":true,"enumerable":true}});DP$0(CategoricalVariable,"prototype",{"configurable":false,"enumerable":false,"writable":false});
    function $categories_get$0() { return this._categories; }
    proto$0.interpret = function(value) { return this.categories[value]; };
  MIXIN$0(CategoricalVariable.prototype,proto$0);proto$0=void 0;return CategoricalVariable;})(Variable);
  var MultipunchVariable = (function(super$0){function MultipunchVariable() {if(super$0!==null)super$0.apply(this, arguments)}if(!PRS$0)MIXIN$0(MultipunchVariable, super$0);if(super$0!==null)SP$0(MultipunchVariable,super$0);MultipunchVariable.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":MultipunchVariable,"configurable":true,"writable":true}});DP$0(MultipunchVariable,"prototype",{"configurable":false,"enumerable":false,"writable":false});;return MultipunchVariable;})(CategoricalVariable);
  var TextVariable = (function(super$0){function TextVariable() {if(super$0!==null)super$0.apply(this, arguments)}if(!PRS$0)MIXIN$0(TextVariable, super$0);if(super$0!==null)SP$0(TextVariable,super$0);TextVariable.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":TextVariable,"configurable":true,"writable":true}});DP$0(TextVariable,"prototype",{"configurable":false,"enumerable":false,"writable":false});;return TextVariable;})(Variable);
  var M2MVariable = (function(super$0){function M2MVariable() {if(super$0!==null)super$0.apply(this, arguments)}if(!PRS$0)MIXIN$0(M2MVariable, super$0);if(super$0!==null)SP$0(M2MVariable,super$0);M2MVariable.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":M2MVariable,"configurable":true,"writable":true}, labels: {"get": $labels_get$0, "configurable":true,"enumerable":true}, buttons: {"get": $buttons_get$0, "configurable":true,"enumerable":true}});DP$0(M2MVariable,"prototype",{"configurable":false,"enumerable":false,"writable":false});
    function $labels_get$0() {}
    function $buttons_get$0() {}
  ;return M2MVariable;})(Variable);
  var TextHighlightVariable = (function(super$0){function TextHighlightVariable() {if(super$0!==null)super$0.apply(this, arguments)}if(!PRS$0)MIXIN$0(TextHighlightVariable, super$0);if(super$0!==null)SP$0(TextHighlightVariable,super$0);TextHighlightVariable.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":TextHighlightVariable,"configurable":true,"writable":true}, copy: {"get": $copy_get$0, "configurable":true,"enumerable":true}});DP$0(TextHighlightVariable,"prototype",{"configurable":false,"enumerable":false,"writable":false});
    function $copy_get$0() {}
  ;return TextHighlightVariable;})(Variable);
  var SpotlightVariable = (function(super$0){function SpotlightVariable() {if(super$0!==null)super$0.apply(this, arguments)}if(!PRS$0)MIXIN$0(SpotlightVariable, super$0);if(super$0!==null)SP$0(SpotlightVariable,super$0);SpotlightVariable.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":SpotlightVariable,"configurable":true,"writable":true}, image: {"get": $image_get$0, "configurable":true,"enumerable":true}});DP$0(SpotlightVariable,"prototype",{"configurable":false,"enumerable":false,"writable":false});
    function $image_get$0() {}
  ;return SpotlightVariable;})(Variable);

  var Respondent = (function(){var DPS$0 = Object.defineProperties;var proto$0={};
    function Respondent(dataset, data) {
      this.dataset = dataset;
      this.rid = data.rid
      this.staticWeight = data.weight;
      this.dynamicWeight = 1;
      this.responses = []; // data.responses;
      if (data.responses) this.responses = data.responses.reduce(function(map, r)  {return dataset.schema[r.k].store(map, r.v)}, {});
    }DPS$0(Respondent.prototype,{weight: {"get": $weight_get$0, "configurable":true,"enumerable":true}});DP$0(Respondent,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    function $weight_get$0() {
      if (this.dataset && this.dataset.disableStaticWeights) return this.dynamicWeight
      return this.staticWeight * this.dynamicWeight;
    }

    proto$0.response = function(variable) {
      return this.responses[variable.name];
    };

    proto$0.getResponseValue = function(name) {
      var v = this.dataset.schema.find(function(vv ) {return vv.name === name});
      return v ? v.lookup(this.responses) : null;
    };
  MIXIN$0(Respondent.prototype,proto$0);proto$0=void 0;return Respondent;})();

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
    return window.fetch((("" + authority) + ("api/questions/" + name) + ""), {
      mode: 'cors',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    }).then(function(response ) {return response.json()})
      .then(function(response ) {return new Dataset(response)});
  }

  return Workbench;
});
