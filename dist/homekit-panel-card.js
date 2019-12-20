/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
//# sourceMappingURL=template.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the thrid
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
try {
    const options = {
        get capture() {
            eventOptionsSupported = true;
            return false;
        }
    };
    // tslint:disable-next-line:no-any
    window.addEventListener('test', options, options);
    // tslint:disable-next-line:no-any
    window.removeEventListener('test', options, options);
}
catch (_e) {
}
//# sourceMappingURL=parts.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
(window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
//# sourceMappingURL=lit-html.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
if (typeof window.ShadyCSS === 'undefined') ;
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
}
//# sourceMappingURL=shady-render.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
//# sourceMappingURL=updating-element.js.map

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};
//# sourceMappingURL=css-tag.js.map

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.2.1');
//# sourceMappingURL=lit-element.js.map

/**
 * Parse or format dates
 * @class fecha
 */
var fecha = {};
var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
var twoDigits = '\\d\\d?';
var threeDigits = '\\d{3}';
var fourDigits = '\\d{4}';
var word = '[^\\s]+';
var literal = /\[([^]*?)\]/gm;
var noop = function () {
};

function regexEscape(str) {
  return str.replace( /[|\\{()[^$+*?.-]/g, '\\$&');
}

function shorten(arr, sLen) {
  var newArr = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    newArr.push(arr[i].substr(0, sLen));
  }
  return newArr;
}

function monthUpdate(arrName) {
  return function (d, v, i18n) {
    var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
    if (~index) {
      d.month = index;
    }
  };
}

function pad(val, len) {
  val = String(val);
  len = len || 2;
  while (val.length < len) {
    val = '0' + val;
  }
  return val;
}

var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var monthNamesShort = shorten(monthNames, 3);
var dayNamesShort = shorten(dayNames, 3);
fecha.i18n = {
  dayNamesShort: dayNamesShort,
  dayNames: dayNames,
  monthNamesShort: monthNamesShort,
  monthNames: monthNames,
  amPm: ['am', 'pm'],
  DoFn: function DoFn(D) {
    return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
  }
};

var formatFlags = {
  D: function(dateObj) {
    return dateObj.getDate();
  },
  DD: function(dateObj) {
    return pad(dateObj.getDate());
  },
  Do: function(dateObj, i18n) {
    return i18n.DoFn(dateObj.getDate());
  },
  d: function(dateObj) {
    return dateObj.getDay();
  },
  dd: function(dateObj) {
    return pad(dateObj.getDay());
  },
  ddd: function(dateObj, i18n) {
    return i18n.dayNamesShort[dateObj.getDay()];
  },
  dddd: function(dateObj, i18n) {
    return i18n.dayNames[dateObj.getDay()];
  },
  M: function(dateObj) {
    return dateObj.getMonth() + 1;
  },
  MM: function(dateObj) {
    return pad(dateObj.getMonth() + 1);
  },
  MMM: function(dateObj, i18n) {
    return i18n.monthNamesShort[dateObj.getMonth()];
  },
  MMMM: function(dateObj, i18n) {
    return i18n.monthNames[dateObj.getMonth()];
  },
  YY: function(dateObj) {
    return pad(String(dateObj.getFullYear()), 4).substr(2);
  },
  YYYY: function(dateObj) {
    return pad(dateObj.getFullYear(), 4);
  },
  h: function(dateObj) {
    return dateObj.getHours() % 12 || 12;
  },
  hh: function(dateObj) {
    return pad(dateObj.getHours() % 12 || 12);
  },
  H: function(dateObj) {
    return dateObj.getHours();
  },
  HH: function(dateObj) {
    return pad(dateObj.getHours());
  },
  m: function(dateObj) {
    return dateObj.getMinutes();
  },
  mm: function(dateObj) {
    return pad(dateObj.getMinutes());
  },
  s: function(dateObj) {
    return dateObj.getSeconds();
  },
  ss: function(dateObj) {
    return pad(dateObj.getSeconds());
  },
  S: function(dateObj) {
    return Math.round(dateObj.getMilliseconds() / 100);
  },
  SS: function(dateObj) {
    return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
  },
  SSS: function(dateObj) {
    return pad(dateObj.getMilliseconds(), 3);
  },
  a: function(dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
  },
  A: function(dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
  },
  ZZ: function(dateObj) {
    var o = dateObj.getTimezoneOffset();
    return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
  }
};

var parseFlags = {
  D: [twoDigits, function (d, v) {
    d.day = v;
  }],
  Do: [twoDigits + word, function (d, v) {
    d.day = parseInt(v, 10);
  }],
  M: [twoDigits, function (d, v) {
    d.month = v - 1;
  }],
  YY: [twoDigits, function (d, v) {
    var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
    d.year = '' + (v > 68 ? cent - 1 : cent) + v;
  }],
  h: [twoDigits, function (d, v) {
    d.hour = v;
  }],
  m: [twoDigits, function (d, v) {
    d.minute = v;
  }],
  s: [twoDigits, function (d, v) {
    d.second = v;
  }],
  YYYY: [fourDigits, function (d, v) {
    d.year = v;
  }],
  S: ['\\d', function (d, v) {
    d.millisecond = v * 100;
  }],
  SS: ['\\d{2}', function (d, v) {
    d.millisecond = v * 10;
  }],
  SSS: [threeDigits, function (d, v) {
    d.millisecond = v;
  }],
  d: [twoDigits, noop],
  ddd: [word, noop],
  MMM: [word, monthUpdate('monthNamesShort')],
  MMMM: [word, monthUpdate('monthNames')],
  a: [word, function (d, v, i18n) {
    var val = v.toLowerCase();
    if (val === i18n.amPm[0]) {
      d.isPm = false;
    } else if (val === i18n.amPm[1]) {
      d.isPm = true;
    }
  }],
  ZZ: ['[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z', function (d, v) {
    var parts = (v + '').match(/([+-]|\d\d)/gi), minutes;

    if (parts) {
      minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
      d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
    }
  }]
};
parseFlags.dd = parseFlags.d;
parseFlags.dddd = parseFlags.ddd;
parseFlags.DD = parseFlags.D;
parseFlags.mm = parseFlags.m;
parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
parseFlags.MM = parseFlags.M;
parseFlags.ss = parseFlags.s;
parseFlags.A = parseFlags.a;


// Some common format strings
fecha.masks = {
  default: 'ddd MMM DD YYYY HH:mm:ss',
  shortDate: 'M/D/YY',
  mediumDate: 'MMM D, YYYY',
  longDate: 'MMMM D, YYYY',
  fullDate: 'dddd, MMMM D, YYYY',
  shortTime: 'HH:mm',
  mediumTime: 'HH:mm:ss',
  longTime: 'HH:mm:ss.SSS'
};

/***
 * Format a date
 * @method format
 * @param {Date|number} dateObj
 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
 */
fecha.format = function (dateObj, mask, i18nSettings) {
  var i18n = i18nSettings || fecha.i18n;

  if (typeof dateObj === 'number') {
    dateObj = new Date(dateObj);
  }

  if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
    throw new Error('Invalid Date in fecha.format');
  }

  mask = fecha.masks[mask] || mask || fecha.masks['default'];

  var literals = [];

  // Make literals inactive by replacing them with ??
  mask = mask.replace(literal, function($0, $1) {
    literals.push($1);
    return '@@@';
  });
  // Apply formatting rules
  mask = mask.replace(token, function ($0) {
    return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
  });
  // Inline literal values back into the formatted value
  return mask.replace(/@@@/g, function() {
    return literals.shift();
  });
};

/**
 * Parse a date string into an object, changes - into /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @returns {Date|boolean}
 */
fecha.parse = function (dateStr, format, i18nSettings) {
  var i18n = i18nSettings || fecha.i18n;

  if (typeof format !== 'string') {
    throw new Error('Invalid format in fecha.parse');
  }

  format = fecha.masks[format] || format;

  // Avoid regular expression denial of service, fail early for really long strings
  // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
  if (dateStr.length > 1000) {
    return null;
  }

  var dateInfo = {};
  var parseInfo = [];
  var literals = [];
  format = format.replace(literal, function($0, $1) {
    literals.push($1);
    return '@@@';
  });
  var newFormat = regexEscape(format).replace(token, function ($0) {
    if (parseFlags[$0]) {
      var info = parseFlags[$0];
      parseInfo.push(info[1]);
      return '(' + info[0] + ')';
    }

    return $0;
  });
  newFormat = newFormat.replace(/@@@/g, function() {
    return literals.shift();
  });
  var matches = dateStr.match(new RegExp(newFormat, 'i'));
  if (!matches) {
    return null;
  }

  for (var i = 1; i < matches.length; i++) {
    parseInfo[i - 1](dateInfo, matches[i], i18n);
  }

  var today = new Date();
  if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
    dateInfo.hour = +dateInfo.hour + 12;
  } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
    dateInfo.hour = 0;
  }

  var date;
  if (dateInfo.timezoneOffset != null) {
    dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
    date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
      dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
  } else {
    date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
      dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
  }
  return date;
};

var a=function(){try{(new Date).toLocaleDateString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleDateString(t,{year:"numeric",month:"long",day:"numeric"})}:function(t){return fecha.format(t,"mediumDate")},n=function(){try{(new Date).toLocaleString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleString(t,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"haDateTime")},r=function(){try{(new Date).toLocaleTimeString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleTimeString(t,{hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"shortTime")};function d(e){return e.substr(0,e.indexOf("."))}function g(e){return d(e.entity_id)}function b(e,t,i){var o,s=g(t);if("binary_sensor"===s)t.attributes.device_class&&(o=e("state."+s+"."+t.attributes.device_class+"."+t.state)),o||(o=e("state."+s+".default."+t.state));else if(t.attributes.unit_of_measurement&&!["unknown","unavailable"].includes(t.state))o=t.state+" "+t.attributes.unit_of_measurement;else if("input_datetime"===s){var c;if(t.attributes.has_time)if(t.attributes.has_date)c=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day,t.attributes.hour,t.attributes.minute),o=n(c,i);else{var u=new Date;c=new Date(u.getFullYear(),u.getMonth(),u.getDay(),t.attributes.hour,t.attributes.minute),o=r(c,i);}else c=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day),o=a(c,i);}else o="zwave"===s?["initializing","dead"].includes(t.state)?e("state.zwave.query_stage."+t.state,"query_stage",t.attributes.query_stage):e("state.zwave.default."+t.state):e("state."+s+"."+t.state);return o||(o=e("state.default."+t.state)||e("component."+s+".state."+t.state)||t.state),o}//# sourceMappingURL=index.m.js.map

var longPress = document.createElement('long-press');
document.body.appendChild(longPress);
var actionHandler = document.createElement('action-handler');
document.body.appendChild(actionHandler);
customElements.whenDefined('card-tools').then(() => {
    var cardTools = customElements.get('card-tools');
    class HomeKitCard extends cardTools.LitElement {
        static get properties() {
            return {
                hass: {},
                config: {}
            };
        }
        setConfig(config) {
            if (!config.entities) {
                throw new Error("You need to define entities");
            }
            this.config = config;
        }
        render() {
            console.log(this.hass.language);
            console.log(this.hass.localize);
            return cardTools.LitHtml `
      <div class="container" >
        ${this.config.home ? cardTools.LitHtml `
            <div class="header">
                ${this.config.title ? cardTools.LitHtml `<h1>${this.config.title}</h1>` : cardTools.LitHtml ``}
            </div>
        ` : cardTools.LitHtml ``}
        ${this.config.entities.map(row => {
                return cardTools.LitHtml `
                <div class="card-title" >${row.title}</div><br>
                    <div class="homekit-card">
                        ${row.entities.map(ent => {
                    const stateObj = this.hass.states[ent.entity];
                    var type = ent.entity.split('.')[0];
                    if (type == "light") {
                        return stateObj ? cardTools.LitHtml `
                                <homekit-card-item>
                                  <homekit-button class="${stateObj.state === "off" ? 'button' : 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                      <div class="button-inner">
                                        <span class="${stateObj.state === "off" ? 'icon' : 'icon on'}">
                                          <ha-icon icon="${ent.icon || stateObj.attributes.icon || 'mdi:lightbulb'}" class=" ${ent.spin && stateObj.state === "on" ? 'spin' : ""}"/>
                                        </span>
                                        <span class="${stateObj.state === "off" ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                        <span class="${stateObj.state === "off" ? 'state' : 'state on'}">${stateObj.state}${stateObj.attributes.brightness ? cardTools.LitHtml ` <span class=" ${stateObj.state === "off" ? 'value' : 'value on'}"><span>${Math.round(stateObj.attributes.brightness / 2.55)}%</span></span>` : cardTools.LitHtml ``}</span>
                                      </div>
                                  </homekit-button>
                                </homekit-card-item>
                                `
                            : this._notFound(ent);
                    }
                    else if (type == "sensor" || type == "binary_sensor") {
                        return stateObj ? cardTools.LitHtml `
                              <homekit-card-item>
                                <homekit-button class="button on" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                    <div class="button-inner">
                                      <span class="icon on">
                                        <ha-icon icon="${ent.icon || stateObj.attributes.icon || 'mdi:lightbulb'}" />
                                      </span>
                                      <span class="name on">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="state on">${stateObj.state}${stateObj.attributes.unit_of_measurement ? cardTools.LitHtml ` ${stateObj.attributes.unit_of_measurement}` : cardTools.LitHtml ``}</span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                            `
                            : this._notFound(ent);
                    }
                    else if (type == "weather") {
                        return stateObj ? cardTools.LitHtml `
                              <homekit-card-item>
                                <homekit-button class="button size-2 on" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                    <div class="button-inner">
                                      <span class="icon on">
                                        <ha-icon icon="${ent.icon || stateObj.attributes.icon || "mdi:weather-" + stateObj.state}" />
                                      </span>
                                      <span class="name on">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="state on">${b(this.hass.localize, stateObj, this.hass.language)}
                                        ${stateObj.attributes.forecast[0] && stateObj.attributes.forecast[0].precipitation ? cardTools.LitHtml `
                                            <span class="value on">${stateObj.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                        ` : cardTools.LitHtml ``}
                                      </span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                            `
                            : this._notFound(ent);
                    }
                    else {
                        return stateObj ? cardTools.LitHtml `
                              <homekit-card-item>
                                <homekit-button class="${stateObj.state === "off" ? 'button' : 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                    <div class="button-inner">
                                      <span class="${stateObj.state === "off" ? 'icon' : 'icon on'}">
                                        <ha-icon icon="${ent.icon || stateObj.attributes.icon}" />
                                      </span>
                                      <span class="${stateObj.state === "off" ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${stateObj.state === "off" ? 'state' : 'state on'}">${b(this.hass.localize, stateObj, this.hass.language)}</span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                            `
                            : this._notFound(ent);
                    }
                })}
                    </div>
                </div>
            `;
            })}
        
        `;
        }
        firstUpdated() {
            var myNodelist = this.shadowRoot.querySelectorAll('homekit-button');
            for (var i = 0; i < myNodelist.length; i++) {
                cardTools.longpress(myNodelist[i], { hasHold: true, hasDoubleClick: true });
            }
        }
        _handleClick(ev, state, entity, type, row) {
            if (type == "light") {
                if (ev.detail.action == "tap") {
                    this._toggle(state, entity.service);
                }
                else if (ev.detail.action == "hold") {
                    if ((row && row.popup) || entity.popup) {
                        if (row.popup) {
                            var popUpCard = Object.assign({}, row.popup, { entity: state.entity_id });
                            if (entity.popupExtend) {
                                var popUpCard = Object.assign({}, popUpCard, entity.popupExtend);
                            }
                        }
                        else {
                            var popUpCard = Object.assign({}, entity.popup, { entity: state.entity_id });
                        }
                        var popUpStyle = {
                            "position": "fixed",
                            "z-index": 999,
                            "top": 0,
                            "left": 0,
                            "height": "100%",
                            "width": "100%",
                            "display": "block",
                            "align-items": "center",
                            "justify-content": "center",
                            "background": "rgba(0, 0, 0, 0.8)",
                            "flex-direction": "column",
                            "margin": 0,
                            "--iron-icon-fill-color": "#FFF"
                        };
                        cardTools.popUp('test', popUpCard, false, popUpStyle);
                    }
                    else {
                        this._hold(state);
                    }
                }
            }
            else if (type == "sensor" || type == "binary_sensor") {
                if (ev.detail.action == "hold") {
                    this._hold(state);
                }
            }
            else {
                if (ev.detail.action == "hold") {
                    this._hold(state);
                }
            }
        }
        getCardSize() {
            return this.config.entities.length + 1;
        }
        _toggle(state, service) {
            this.hass.callService("homeassistant", service || "toggle", {
                entity_id: state.entity_id
            });
        }
        _hold(stateObj) {
            cardTools.moreInfo(stateObj.entity_id);
        }
        _getUnit(measure) {
            const lengthUnit = this.hass.config.unit_system.length;
            switch (measure) {
                case "air_pressure":
                    return lengthUnit === "km" ? "hPa" : "inHg";
                case "length":
                    return lengthUnit;
                case "precipitation":
                    return lengthUnit === "km" ? "mm" : "in";
                default:
                    return this.hass.config.unit_system[measure] || "";
            }
        }
        _notFound(ent) {
            return cardTools.LitHtml `
        <homekit-card-item>
          <homekit-button class="not-found">
            <div class="button-inner">
              <span class="name">${ent.entity}</span>
              <span class="state">Not found</span>
            </div>
          </homekit-button>
        </homekit-card-item>
      `;
        }
        static get styles() {
            return css `
        :host {

        }
        .card-title {
            margin-bottom:-10px;
            margin-left: 4px;
            font-size: 18px;
            padding-top:18px;
        }
        .homekit-card { }

        .container {
            float: left;
            clear: left;
            margin-top: 10px;
            padding: 5px 0 5px 15px;
            white-space: nowrap;
            width: 100%;
        }
        
        .header {
            min-height: 250px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin-bottom: 30px;
            margin-left: 4px;
            font-size: 32px;
            font-weight: 300;
        }
        
        .button {
          cursor: pointer;
          display:inline-block;
          width: 110px;
          height: 110px;
          padding:5px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
          margin: 3px;
          position: relative;
          overflow:hidden;
          font-weight:300;
          touch-action: auto!important;
        }
        .button.size-2 {
          width: 240px;
        }
        
        :host:last-child .button {
          margin-right:13px;
        }
        
        .button.on {
          background-color: rgba(255, 255, 255, 1);
        }
        
        .button .button-inner {
          display:flex;
          flex-direction:column;
          height:100%;
        }
        
        homekit-button .name {
          display:block;
          font-size: 17px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.4);
          width: 100%;
          margin-top: auto;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-wrap:break-word;
          overflow: hidden;
          white-space: normal;
        }
        
        homekit-button .name.on {
          color: rgba(0, 0, 0, 1);
        }
        
        homekit-button .state {
          position: relative;
          font-size: 17px;
          color: rgba(0, 0, 0, 0.4);
          text-transform: capitalize;
          float: left;
        }
        
        homekit-button .value {
          visibility: hidden;
        }
        
        homekit-button .value.on {
          visibility: visible;
          position: relative;
          margin-left: 5px;
          font-size: 12px;
          color: rgba(255, 0, 0, 1);
          text-transform: capitalize;
        }
        
        homekit-button .state.on {
          color: rgba(0, 0, 0, 1);
        }
        homekit-button .state.unavailable {
          color: rgba(255, 0, 0, 1);
        }
        
        homekit-button .icon {
          display:block;
          height: 40px;
          width: 40px;
          color: rgba(0, 0, 0, 0.3);
          font-size: 30px;
          padding-top:5px;
        }
        homekit-button .icon ha-icon {
          width:30px;
          height:30px;
        }
                  
        homekit-button .icon.on {
          color: #f7d959;
        }
        
        homekit-button .circle {
          position: absolute;
          top: 17px;
          left: 10px;
          height: 35px;
          width: 35px;
          background-color: rgba(0, 255, 0, 1);
          border-radius: 20px;
        }
        
        homekit-button .temp {
          position: absolute;
          top: 26px;
          left: 19px;
          font-family: Arial;
          font-size: 14px;
          font-weight: bold;
          color: white;
        }
        
        .not-found {
          cursor: pointer;
          display:inline-block;
          width: 110px;
          height: 110px;
          padding:5px;
          background-color: rgba(255, 0, 0, 0.8);
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
          margin: 3px;
          position: relative;
          overflow:hidden;
          font-weight:300;
          touch-action: auto!important;
        }

      `;
        }
    }
    customElements.define("homekit-card", HomeKitCard);
});
setTimeout(() => {
    if (customElements.get('card-tools'))
        return;
    customElements.define('my-plugin', class extends HTMLElement {
        setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools"); }
    });
}, 2000);
