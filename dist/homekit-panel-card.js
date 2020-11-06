var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
var twoDigitsOptional = "[1-9]\\d?";
var twoDigits = "\\d\\d";
var threeDigits = "\\d{3}";
var fourDigits = "\\d{4}";
var word = "[^\\s]+";
var literal = /\[([^]*?)\]/gm;
function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
}
var monthUpdate = function (arrName) { return function (v, i18n) {
    var lowerCaseArr = i18n[arrName].map(function (v) { return v.toLowerCase(); });
    var index = lowerCaseArr.indexOf(v.toLowerCase());
    if (index > -1) {
        return index;
    }
    return null;
}; };
function assign(origObj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var obj = args_1[_a];
        for (var key in obj) {
            // @ts-ignore ex
            origObj[key] = obj[key];
        }
    }
    return origObj;
}
var dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var monthNamesShort = shorten(monthNames, 3);
var dayNamesShort = shorten(dayNames, 3);
var defaultI18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ["am", "pm"],
    DoFn: function (dayOfMonth) {
        return (dayOfMonth +
            ["th", "st", "nd", "rd"][dayOfMonth % 10 > 3
                ? 0
                : ((dayOfMonth - (dayOfMonth % 10) !== 10 ? 1 : 0) * dayOfMonth) % 10]);
    }
};
var globalI18n = assign({}, defaultI18n);
var setGlobalDateI18n = function (i18n) {
    return (globalI18n = assign(globalI18n, i18n));
};
var regexEscape = function (str) {
    return str.replace(/[|\\{()[^$+*?.-]/g, "\\$&");
};
var pad = function (val, len) {
    if (len === void 0) { len = 2; }
    val = String(val);
    while (val.length < len) {
        val = "0" + val;
    }
    return val;
};
var formatFlags = {
    D: function (dateObj) { return String(dateObj.getDate()); },
    DD: function (dateObj) { return pad(dateObj.getDate()); },
    Do: function (dateObj, i18n) {
        return i18n.DoFn(dateObj.getDate());
    },
    d: function (dateObj) { return String(dateObj.getDay()); },
    dd: function (dateObj) { return pad(dateObj.getDay()); },
    ddd: function (dateObj, i18n) {
        return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function (dateObj, i18n) {
        return i18n.dayNames[dateObj.getDay()];
    },
    M: function (dateObj) { return String(dateObj.getMonth() + 1); },
    MM: function (dateObj) { return pad(dateObj.getMonth() + 1); },
    MMM: function (dateObj, i18n) {
        return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function (dateObj, i18n) {
        return i18n.monthNames[dateObj.getMonth()];
    },
    YY: function (dateObj) {
        return pad(String(dateObj.getFullYear()), 4).substr(2);
    },
    YYYY: function (dateObj) { return pad(dateObj.getFullYear(), 4); },
    h: function (dateObj) { return String(dateObj.getHours() % 12 || 12); },
    hh: function (dateObj) { return pad(dateObj.getHours() % 12 || 12); },
    H: function (dateObj) { return String(dateObj.getHours()); },
    HH: function (dateObj) { return pad(dateObj.getHours()); },
    m: function (dateObj) { return String(dateObj.getMinutes()); },
    mm: function (dateObj) { return pad(dateObj.getMinutes()); },
    s: function (dateObj) { return String(dateObj.getSeconds()); },
    ss: function (dateObj) { return pad(dateObj.getSeconds()); },
    S: function (dateObj) {
        return String(Math.round(dateObj.getMilliseconds() / 100));
    },
    SS: function (dateObj) {
        return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function (dateObj) { return pad(dateObj.getMilliseconds(), 3); },
    a: function (dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function (dateObj, i18n) {
        return dateObj.getHours() < 12
            ? i18n.amPm[0].toUpperCase()
            : i18n.amPm[1].toUpperCase();
    },
    ZZ: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return ((offset > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(offset) / 60) * 100 + (Math.abs(offset) % 60), 4));
    },
    Z: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return ((offset > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(offset) / 60), 2) +
            ":" +
            pad(Math.abs(offset) % 60, 2));
    }
};
var monthParse = function (v) { return +v - 1; };
var emptyDigits = [null, twoDigitsOptional];
var emptyWord = [null, word];
var amPm = [
    "isPm",
    word,
    function (v, i18n) {
        var val = v.toLowerCase();
        if (val === i18n.amPm[0]) {
            return 0;
        }
        else if (val === i18n.amPm[1]) {
            return 1;
        }
        return null;
    }
];
var timezoneOffset = [
    "timezoneOffset",
    "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",
    function (v) {
        var parts = (v + "").match(/([+-]|\d\d)/gi);
        if (parts) {
            var minutes = +parts[1] * 60 + parseInt(parts[2], 10);
            return parts[0] === "+" ? minutes : -minutes;
        }
        return 0;
    }
];
var parseFlags = {
    D: ["day", twoDigitsOptional],
    DD: ["day", twoDigits],
    Do: ["day", twoDigitsOptional + word, function (v) { return parseInt(v, 10); }],
    M: ["month", twoDigitsOptional, monthParse],
    MM: ["month", twoDigits, monthParse],
    YY: [
        "year",
        twoDigits,
        function (v) {
            var now = new Date();
            var cent = +("" + now.getFullYear()).substr(0, 2);
            return +("" + (+v > 68 ? cent - 1 : cent) + v);
        }
    ],
    h: ["hour", twoDigitsOptional, undefined, "isPm"],
    hh: ["hour", twoDigits, undefined, "isPm"],
    H: ["hour", twoDigitsOptional],
    HH: ["hour", twoDigits],
    m: ["minute", twoDigitsOptional],
    mm: ["minute", twoDigits],
    s: ["second", twoDigitsOptional],
    ss: ["second", twoDigits],
    YYYY: ["year", fourDigits],
    S: ["millisecond", "\\d", function (v) { return +v * 100; }],
    SS: ["millisecond", twoDigits, function (v) { return +v * 10; }],
    SSS: ["millisecond", threeDigits],
    d: emptyDigits,
    dd: emptyDigits,
    ddd: emptyWord,
    dddd: emptyWord,
    MMM: ["month", word, monthUpdate("monthNamesShort")],
    MMMM: ["month", word, monthUpdate("monthNames")],
    a: amPm,
    A: amPm,
    ZZ: timezoneOffset,
    Z: timezoneOffset
};
// Some common format strings
var globalMasks = {
    default: "ddd MMM DD YYYY HH:mm:ss",
    shortDate: "M/D/YY",
    mediumDate: "MMM D, YYYY",
    longDate: "MMMM D, YYYY",
    fullDate: "dddd, MMMM D, YYYY",
    isoDate: "YYYY-MM-DD",
    isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
    shortTime: "HH:mm",
    mediumTime: "HH:mm:ss",
    longTime: "HH:mm:ss.SSS"
};
var setGlobalDateMasks = function (masks) { return assign(globalMasks, masks); };
/***
 * Format a date
 * @method format
 * @param {Date|number} dateObj
 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
 * @returns {string} Formatted date string
 */
var format = function (dateObj, mask, i18n) {
    if (mask === void 0) { mask = globalMasks["default"]; }
    if (i18n === void 0) { i18n = {}; }
    if (typeof dateObj === "number") {
        dateObj = new Date(dateObj);
    }
    if (Object.prototype.toString.call(dateObj) !== "[object Date]" ||
        isNaN(dateObj.getTime())) {
        throw new Error("Invalid Date pass to format");
    }
    mask = globalMasks[mask] || mask;
    var literals = [];
    // Make literals inactive by replacing them with @@@
    mask = mask.replace(literal, function ($0, $1) {
        literals.push($1);
        return "@@@";
    });
    var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {
        return formatFlags[$0](dateObj, combinedI18nSettings);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/@@@/g, function () { return literals.shift(); });
};
/**
 * Parse a date string into a Javascript Date object /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @param {i18n} I18nSettingsOptional Full or subset of I18N settings
 * @returns {Date|null} Returns Date object. Returns null what date string is invalid or doesn't match format
 */
function parse(dateStr, format, i18n) {
    if (i18n === void 0) { i18n = {}; }
    if (typeof format !== "string") {
        throw new Error("Invalid format in fecha parse");
    }
    // Check to see if the format is actually a mask
    format = globalMasks[format] || format;
    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
        return null;
    }
    // Default to the beginning of the year.
    var today = new Date();
    var dateInfo = {
        year: today.getFullYear(),
        month: 0,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        isPm: null,
        timezoneOffset: null
    };
    var parseInfo = [];
    var literals = [];
    // Replace all the literals with @@@. Hopefully a string that won't exist in the format
    var newFormat = format.replace(literal, function ($0, $1) {
        literals.push(regexEscape($1));
        return "@@@";
    });
    var specifiedFields = {};
    var requiredFields = {};
    // Change every token that we find into the correct regex
    newFormat = regexEscape(newFormat).replace(token, function ($0) {
        var info = parseFlags[$0];
        var field = info[0], regex = info[1], requiredField = info[3];
        // Check if the person has specified the same field twice. This will lead to confusing results.
        if (specifiedFields[field]) {
            throw new Error("Invalid format. " + field + " specified twice in format");
        }
        specifiedFields[field] = true;
        // Check if there are any required fields. For instance, 12 hour time requires AM/PM specified
        if (requiredField) {
            requiredFields[requiredField] = true;
        }
        parseInfo.push(info);
        return "(" + regex + ")";
    });
    // Check all the required fields are present
    Object.keys(requiredFields).forEach(function (field) {
        if (!specifiedFields[field]) {
            throw new Error("Invalid format. " + field + " is required in specified format");
        }
    });
    // Add back all the literals after
    newFormat = newFormat.replace(/@@@/g, function () { return literals.shift(); });
    // Check if the date string matches the format. If it doesn't return null
    var matches = dateStr.match(new RegExp(newFormat, "i"));
    if (!matches) {
        return null;
    }
    var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
    // For each match, call the parser function for that date part
    for (var i = 1; i < matches.length; i++) {
        var _a = parseInfo[i - 1], field = _a[0], parser = _a[2];
        var value = parser
            ? parser(matches[i], combinedI18nSettings)
            : +matches[i];
        // If the parser can't make sense of the value, return null
        if (value == null) {
            return null;
        }
        dateInfo[field] = value;
    }
    if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) {
        dateInfo.hour = +dateInfo.hour + 12;
    }
    else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) {
        dateInfo.hour = 0;
    }
    var dateWithoutTZ = new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute, dateInfo.second, dateInfo.millisecond);
    var validateFields = [
        ["month", "getMonth"],
        ["day", "getDate"],
        ["hour", "getHours"],
        ["minute", "getMinutes"],
        ["second", "getSeconds"]
    ];
    for (var i = 0, len = validateFields.length; i < len; i++) {
        // Check to make sure the date field is within the allowed range. Javascript dates allows values
        // outside the allowed range. If the values don't match the value was invalid
        if (specifiedFields[validateFields[i][0]] &&
            dateInfo[validateFields[i][0]] !== dateWithoutTZ[validateFields[i][1]]()) {
            return null;
        }
    }
    if (dateInfo.timezoneOffset == null) {
        return dateWithoutTZ;
    }
    return new Date(Date.UTC(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute - dateInfo.timezoneOffset, dateInfo.second, dateInfo.millisecond));
}
var fecha = {
    format: format,
    parse: parse,
    defaultI18n: defaultI18n,
    setGlobalDateI18n: setGlobalDateI18n,
    setGlobalDateMasks: setGlobalDateMasks
};

var a=function(){try{(new Date).toLocaleDateString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleDateString(t,{year:"numeric",month:"long",day:"numeric"})}:function(t){return fecha.format(t,"mediumDate")},r=function(){try{(new Date).toLocaleString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleString(t,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"haDateTime")},n=function(){try{(new Date).toLocaleTimeString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleTimeString(t,{hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"shortTime")};function d(e){return e.substr(0,e.indexOf("."))}function v(e){return d(e.entity_id)}function b(e,t,s){if("unknown"===t.state||"unavailable"===t.state)return e("state.default."+t.state);if(t.attributes.unit_of_measurement)return t.state+" "+t.attributes.unit_of_measurement;var i=v(t);if("input_datetime"===i){var o;if(!t.attributes.has_time)return o=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day),a(o,s);if(!t.attributes.has_date){var c=new Date;return o=new Date(c.getFullYear(),c.getMonth(),c.getDay(),t.attributes.hour,t.attributes.minute),n(o,s)}return o=new Date(t.attributes.year,t.attributes.month-1,t.attributes.day,t.attributes.hour,t.attributes.minute),r(o,s)}return t.attributes.device_class&&e("component."+i+".state."+t.attributes.device_class+"."+t.state)||e("component."+i+".state._."+t.state)||t.state}var _="hass:bookmark",D=["closed","locked","off"],C=function(e,t,a,r){r=r||{},a=null==a?{}:a;var n=new Event(t,{bubbles:void 0===r.bubbles||r.bubbles,cancelable:Boolean(r.cancelable),composed:void 0===r.composed||r.composed});return n.detail=a,e.dispatchEvent(n),n},N={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function O(e,t){if(e in N)return N[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return "hass:bell-plus";case"armed_night":return "hass:bell-sleep";case"disarmed":return "hass:bell-outline";case"triggered":return "hass:bell-ring";default:return "hass:bell"}case"binary_sensor":return t&&"off"===t?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return "closed"===t?"hass:window-closed":"hass:window-open";case"lock":return t&&"unlocked"===t?"hass:lock-open":"hass:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"hass:cast-connected":"hass:cast";case"zwave":switch(t){case"dead":return "hass:emoticon-dead";case"sleeping":return "hass:sleep";case"initializing":return "hass:timer-sand";default:return "hass:z-wave"}default:return console.warn("Unable to find icon for domain "+e+" ("+t+")"),_}}var z=function(e){C(window,"haptic",e);},F=function(e,t,a){void 0===a&&(a=!1),a?history.replaceState(null,"",t):history.pushState(null,"",t),C(window,"location-changed",{replace:a});},I=function(e,t,a){void 0===a&&(a=!0);var r,n=d(t),s="group"===n?"homeassistant":n;switch(n){case"lock":r=a?"unlock":"lock";break;case"cover":r=a?"open_cover":"close_cover";break;default:r=a?"turn_on":"turn_off";}return e.callService(s,r,{entity_id:t})},B=function(e,t){var a=D.includes(e.states[t].state);return I(e,t,a)};

function bound01(n, max) {
    if (isOnePointZero(n)) {
        n = '100%';
    }
    var processPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (processPercent) {
        n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }
    if (max === 360) {
        n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
    }
    else {
        n = (n % max) / parseFloat(String(max));
    }
    return n;
}
function clamp01(val) {
    return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n) {
    return typeof n === 'string' && n.includes('.') && parseFloat(n) === 1;
}
function isPercentage(n) {
    return typeof n === 'string' && n.includes('%');
}
function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }
    return a;
}
function convertToPercentage(n) {
    if (n <= 1) {
        return Number(n) * 100 + "%";
    }
    return n;
}
function pad2(c) {
    return c.length === 1 ? '0' + c : String(c);
}

function rgbToRgb(r, g, b) {
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255,
    };
}
function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
        s = 0;
        h = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d) + (g < b ? 6 : 0);
                break;
            case g:
                h = ((b - r) / d) + 2;
                break;
            case b:
                h = ((r - g) / d) + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, l: l };
}
function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + ((q - p) * (6 * t));
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + ((q - p) * ((2 / 3) - t) * 6);
    }
    return p;
}
function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
        g = l;
        b = l;
        r = l;
    }
    else {
        var q = l < 0.5 ? (l * (1 + s)) : (l + s - (l * s));
        var p = (2 * l) - q;
        r = hue2rgb(p, q, h + (1 / 3));
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - (1 / 3));
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    }
    else {
        switch (max) {
            case r:
                h = ((g - b) / d) + (g < b ? 6 : 0);
                break;
            case g:
                h = ((b - r) / d) + 2;
                break;
            case b:
                h = ((r - g) / d) + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}
function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - (f * s));
    var t = v * (1 - ((1 - f) * s));
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
}
function rgbToHex(r, g, b, allow3Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
    ];
    if (allow3Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join('');
}
function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
        pad2(convertDecimalToHex(a)),
    ];
    if (allow4Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1)) &&
        hex[3].startsWith(hex[3].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join('');
}
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
}
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

var names = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;
    if (typeof color === 'string') {
        color = stringInputToObject(color);
    }
    if (typeof color === 'object') {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = 'hsv';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = 'hsl';
        }
        if (Object.prototype.hasOwnProperty.call(color, 'a')) {
            a = color.a;
        }
    }
    a = boundAlpha(a);
    return {
        ok: ok,
        format: color.format || format,
        r: Math.min(255, Math.max(rgb.r, 0)),
        g: Math.min(255, Math.max(rgb.g, 0)),
        b: Math.min(255, Math.max(rgb.b, 0)),
        a: a,
    };
}
var CSS_INTEGER = '[-\\+]?\\d+%?';
var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
    rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
    hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
    hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
    hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
    hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};
function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
        return false;
    }
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    match = matchers.hex4.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    return false;
}
function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
}

var TinyColor = (function () {
    function TinyColor(color, opts) {
        if (color === void 0) { color = ''; }
        if (opts === void 0) { opts = {}; }
        var _a;
        if (color instanceof TinyColor) {
            return color;
        }
        this.originalInput = color;
        var rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = (_a = opts.format, (_a !== null && _a !== void 0 ? _a : rgb.format));
        this.gradientType = opts.gradientType;
        if (this.r < 1) {
            this.r = Math.round(this.r);
        }
        if (this.g < 1) {
            this.g = Math.round(this.g);
        }
        if (this.b < 1) {
            this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
    }
    TinyColor.prototype.isDark = function () {
        return this.getBrightness() < 128;
    };
    TinyColor.prototype.isLight = function () {
        return !this.isDark();
    };
    TinyColor.prototype.getBrightness = function () {
        var rgb = this.toRgb();
        return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
    };
    TinyColor.prototype.getLuminance = function () {
        var rgb = this.toRgb();
        var R;
        var G;
        var B;
        var RsRGB = rgb.r / 255;
        var GsRGB = rgb.g / 255;
        var BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
        }
        else {
            R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
        }
        else {
            G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
        }
        else {
            B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    };
    TinyColor.prototype.getAlpha = function () {
        return this.a;
    };
    TinyColor.prototype.setAlpha = function (alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
    };
    TinyColor.prototype.toHsv = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor.prototype.toHsvString = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        var h = Math.round(hsv.h * 360);
        var s = Math.round(hsv.s * 100);
        var v = Math.round(hsv.v * 100);
        return this.a === 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
    };
    TinyColor.prototype.toHsl = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor.prototype.toHslString = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        var h = Math.round(hsl.h * 360);
        var s = Math.round(hsl.s * 100);
        var l = Math.round(hsl.l * 100);
        return this.a === 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
    };
    TinyColor.prototype.toHex = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor.prototype.toHexString = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return '#' + this.toHex(allow3Char);
    };
    TinyColor.prototype.toHex8 = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor.prototype.toHex8String = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return '#' + this.toHex8(allow4Char);
    };
    TinyColor.prototype.toRgb = function () {
        return {
            r: Math.round(this.r),
            g: Math.round(this.g),
            b: Math.round(this.b),
            a: this.a,
        };
    };
    TinyColor.prototype.toRgbString = function () {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b = Math.round(this.b);
        return this.a === 1 ? "rgb(" + r + ", " + g + ", " + b + ")" : "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")";
    };
    TinyColor.prototype.toPercentageRgb = function () {
        var fmt = function (x) { return Math.round(bound01(x, 255) * 100) + "%"; };
        return {
            r: fmt(this.r),
            g: fmt(this.g),
            b: fmt(this.b),
            a: this.a,
        };
    };
    TinyColor.prototype.toPercentageRgbString = function () {
        var rnd = function (x) { return Math.round(bound01(x, 255) * 100); };
        return this.a === 1 ?
            "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)" :
            "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")";
    };
    TinyColor.prototype.toName = function () {
        if (this.a === 0) {
            return 'transparent';
        }
        if (this.a < 1) {
            return false;
        }
        var hex = '#' + rgbToHex(this.r, this.g, this.b, false);
        for (var _i = 0, _a = Object.keys(names); _i < _a.length; _i++) {
            var key = _a[_i];
            if (names[key] === hex) {
                return key;
            }
        }
        return false;
    };
    TinyColor.prototype.toString = function (format) {
        var formatSet = Boolean(format);
        format = (format !== null && format !== void 0 ? format : this.format);
        var formattedString = false;
        var hasAlpha = this.a < 1 && this.a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
        if (needsAlphaFormat) {
            if (format === 'name' && this.a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === 'rgb') {
            formattedString = this.toRgbString();
        }
        if (format === 'prgb') {
            formattedString = this.toPercentageRgbString();
        }
        if (format === 'hex' || format === 'hex6') {
            formattedString = this.toHexString();
        }
        if (format === 'hex3') {
            formattedString = this.toHexString(true);
        }
        if (format === 'hex4') {
            formattedString = this.toHex8String(true);
        }
        if (format === 'hex8') {
            formattedString = this.toHex8String();
        }
        if (format === 'name') {
            formattedString = this.toName();
        }
        if (format === 'hsl') {
            formattedString = this.toHslString();
        }
        if (format === 'hsv') {
            formattedString = this.toHsvString();
        }
        return formattedString || this.toHexString();
    };
    TinyColor.prototype.clone = function () {
        return new TinyColor(this.toString());
    };
    TinyColor.prototype.lighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.brighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor(rgb);
    };
    TinyColor.prototype.darken = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.tint = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('white', amount);
    };
    TinyColor.prototype.shade = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('black', amount);
    };
    TinyColor.prototype.desaturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.saturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    TinyColor.prototype.greyscale = function () {
        return this.desaturate(100);
    };
    TinyColor.prototype.spin = function (amount) {
        var hsl = this.toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor(hsl);
    };
    TinyColor.prototype.mix = function (color, amount) {
        if (amount === void 0) { amount = 50; }
        var rgb1 = this.toRgb();
        var rgb2 = new TinyColor(color).toRgb();
        var p = amount / 100;
        var rgba = {
            r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
            g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
            b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
            a: ((rgb2.a - rgb1.a) * p) + rgb1.a,
        };
        return new TinyColor(rgba);
    };
    TinyColor.prototype.analogous = function (results, slices) {
        if (results === void 0) { results = 6; }
        if (slices === void 0) { slices = 30; }
        var hsl = this.toHsl();
        var part = 360 / slices;
        var ret = [this];
        for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(new TinyColor(hsl));
        }
        return ret;
    };
    TinyColor.prototype.complement = function () {
        var hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor(hsl);
    };
    TinyColor.prototype.monochromatic = function (results) {
        if (results === void 0) { results = 6; }
        var hsv = this.toHsv();
        var h = hsv.h;
        var s = hsv.s;
        var v = hsv.v;
        var res = [];
        var modification = 1 / results;
        while (results--) {
            res.push(new TinyColor({ h: h, s: s, v: v }));
            v = (v + modification) % 1;
        }
        return res;
    };
    TinyColor.prototype.splitcomplement = function () {
        var hsl = this.toHsl();
        var h = hsl.h;
        return [
            this,
            new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
            new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
        ];
    };
    TinyColor.prototype.triad = function () {
        return this.polyad(3);
    };
    TinyColor.prototype.tetrad = function () {
        return this.polyad(4);
    };
    TinyColor.prototype.polyad = function (n) {
        var hsl = this.toHsl();
        var h = hsl.h;
        var result = [this];
        var increment = 360 / n;
        for (var i = 1; i < n; i++) {
            result.push(new TinyColor({ h: (h + (i * increment)) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
    };
    TinyColor.prototype.equals = function (color) {
        return this.toRgbString() === new TinyColor(color).toRgbString();
    };
    return TinyColor;
}());
function tinycolor(color, opts) {
    if (color === void 0) { color = ''; }
    if (opts === void 0) { opts = {}; }
    return new TinyColor(color, opts);
}

const LitElement = customElements.get('home-assistant-main')
  ? Object.getPrototypeOf(customElements.get('home-assistant-main'))
  : Object.getPrototypeOf(customElements.get('hui-view'));

const html = LitElement.prototype.html;

const css = LitElement.prototype.css;

function hass() {
  if(document.querySelector('hc-main'))
    return document.querySelector('hc-main').hass;

  if(document.querySelector('home-assistant'))
    return document.querySelector('home-assistant').hass;

  return undefined;
}
function provideHass(element) {
  if(document.querySelector('hc-main'))
    return document.querySelector('hc-main').provideHass(element);

  if(document.querySelector('home-assistant'))
    return document.querySelector("home-assistant").provideHass(element);

  return undefined;
}
function lovelace_view() {
  var root = document.querySelector("hc-main");
  if(root) {
    root = root && root.shadowRoot;
    root = root && root.querySelector("hc-lovelace");
    root = root && root.shadowRoot;
    root = root && root.querySelector("hui-view") || root.querySelector("hui-panel-view");
    return root;
  }

  root = document.querySelector("home-assistant");
  root = root && root.shadowRoot;
  root = root && root.querySelector("home-assistant-main");
  root = root && root.shadowRoot;
  root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
  root = root && root.shadowRoot || root;
  root = root && root.querySelector("ha-panel-lovelace");
  root = root && root.shadowRoot;
  root = root && root.querySelector("hui-root");
  root = root && root.shadowRoot;
  root = root && root.querySelector("ha-app-layout");
  root = root && root.querySelector("#view");
  root = root && root.firstElementChild;
  return root;
}

async function load_lovelace() {
  if(customElements.get("hui-view")) return true;

  await customElements.whenDefined("partial-panel-resolver");
  const ppr = document.createElement("partial-panel-resolver");
  ppr.hass = {panels: [{
    url_path: "tmp",
    "component_name": "lovelace",
  }]};
  ppr._updateRoutes();
  await ppr.routerOptions.routes.tmp.load();
  if(!customElements.get("ha-panel-lovelace")) return false;
  const p = document.createElement("ha-panel-lovelace");
  p.hass = hass();
  if(p.hass === undefined) {
    await new Promise(resolve => {
      window.addEventListener('connection-status', (ev) => {
        console.log(ev);
        resolve();
      }, {once: true});
    });
    p.hass = hass();
  }
  p.panel = {config: {mode: null}};
  p._fetchConfig();
  return true;
}

function fireEvent(ev, detail, entity=null) {
  ev = new Event(ev, {
    bubbles: true,
    cancelable: false,
    composed: true,
  });
  ev.detail = detail || {};
  if(entity) {
    entity.dispatchEvent(ev);
  } else {
    var root = lovelace_view();
    if (root) root.dispatchEvent(ev);
  }
}

async function _selectTree(root, path, all=false) {
  let el = root;
  if(typeof(path) === "string") {
    path = path.split(/(\$| )/);
  }
  if(path[path.length-1] === "")
     path.pop();
  for(const [i, p] of path.entries()) {
    if(!p.trim().length) continue;
    if(!el) return null;
    if(el.localName && el.localName.includes("-"))
      await customElements.whenDefined(el.localName);
    if(el.updateComplete)
      await el.updateComplete;
    if(p === "$")
      if(all && i == path.length-1)
        el = [el.shadowRoot];
      else
        el = el.shadowRoot;
    else
      if(all && i == path.length-1)
        el = el.querySelectorAll(p);
      else
        el = el.querySelector(p);
  }
  return el;
}

async function selectTree(root, path, all=false, timeout=10000) {
  return Promise.race([
    _selectTree(root, path, all),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]).catch((err) => {
    if(!err.message || err.message !== "timeout")
      throw(err);
    return null;
  });
}

async function moreInfo(entity, large=false) {
  const root = document.querySelector("hc-main") || document.querySelector("home-assistant");
  fireEvent("hass-more-info", {entityId: entity}, root);
  const el = await selectTree(root, "$ ha-more-info-dialog");
  if(el)
    el.large = large;
  return el;
}

const ID_STORAGE_KEY = 'lovelace-player-device-id';
function _deviceID() {
  if(!localStorage[ID_STORAGE_KEY])
  {
    const s4 = () => {
      return Math.floor((1+Math.random())*100000).toString(16).substring(1);
    };
    if(window['fully'] && typeof fully.getDeviceId === "function")
      localStorage[ID_STORAGE_KEY] = fully.getDeviceId();
    else
      localStorage[ID_STORAGE_KEY] = `${s4()}${s4()}-${s4()}${s4()}`;
  }
  return localStorage[ID_STORAGE_KEY];
}
let deviceID = _deviceID();

const setDeviceID = (id) => {
  if(id === null) return;
  if(id === "clear") {
    localStorage.removeItem(ID_STORAGE_KEY);
  } else {
    localStorage[ID_STORAGE_KEY] = id;
  }
  deviceID = _deviceID();
};

const params = new URLSearchParams(window.location.search);
if(params.get('deviceID')) {
  setDeviceID(params.get('deviceID'));
}

async function parseTemplate(hass, str, specialData = {}) {
  if (!hass) hass = hass();
  if (typeof(specialData === "string")) specialData = {};
    specialData = Object.assign({
      user: hass.user.name,
      browser: deviceID,
      hash: location.hash.substr(1) || ' ',
    },
    specialData);

    for (var k in specialData) {
      var re = new RegExp(`\\{${k}\\}`, "g");
      str = str.replace(re, specialData[k]);
    }

    return hass.callApi("POST", "template", {template: str});
}

const CUSTOM_TYPE_PREFIX = "custom:";

let helpers = window.cardHelpers;
const helperPromise = new Promise(async (resolve, reject) => {
  if(helpers) resolve();

  const updateHelpers = async () => {
    helpers = await window.loadCardHelpers();
    window.cardHelpers = helpers;
    resolve();
  };

  if(window.loadCardHelpers) {
    updateHelpers();
  } else {
    // If loadCardHelpers didn't exist, force load lovelace and try once more.
    window.addEventListener("load", async () => {
      load_lovelace();
      if(window.loadCardHelpers) {
        updateHelpers();
      }
    });
  }
});

function errorElement(error, origConfig) {
  const cfg = {
    type: "error",
    error,
    origConfig,
  };
  const el = document.createElement("hui-error-card");
  customElements.whenDefined("hui-error-card").then(() => {
    const newel = document.createElement("hui-error-card");
    newel.setConfig(cfg);
    if(el.parentElement)
      el.parentElement.replaceChild(newel, el);
  });
  helperPromise.then(() => {
    fireEvent("ll-rebuild", {}, el);
  });
  return el;
}

function _createElement(tag, config) {
  let el = document.createElement(tag);
  try {
    el.setConfig(JSON.parse(JSON.stringify(config)));
  } catch (err) {
    el = errorElement(err, config);
  }
  helperPromise.then(() => {
    fireEvent("ll-rebuild", {}, el);
  });
  return el;
}

function createLovelaceElement(thing, config) {
  if(!config || typeof config !== "object" || !config.type)
    return errorElement(`No ${thing} type configured`, config);

  let tag = config.type;
  if(tag.startsWith(CUSTOM_TYPE_PREFIX))
    tag = tag.substr(CUSTOM_TYPE_PREFIX.length);
  else
    tag = `hui-${tag}-${thing}`;

  if(customElements.get(tag))
    return _createElement(tag, config);

  const el = errorElement(`Custom element doesn't exist: ${tag}.`, config);
  el.style.display = "None";

  const timer = setTimeout(() => {
    el.style.display = "";
  }, 2000);

  customElements.whenDefined(tag).then(() => {
    clearTimeout(timer);
    fireEvent("ll-rebuild", {}, el);
  });

  return el;
}

function createCard(config) {
  if(helpers) return helpers.createCardElement(config);
  return createLovelaceElement('card', config);
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var hammer = createCommonjsModule(function (module) {
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined$1) {

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined$1) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined$1 || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined$1 && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined$1)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined$1 : undefined$1, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined$1) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined$1;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined$1;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined$1)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined$1;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined$1) {
            return;
        }
        if (handler === undefined$1) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined$1) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (typeof undefined$1 === 'function' && undefined$1.amd) {
    undefined$1(function() {
        return Hammer;
    });
} else if ( module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');
});

var evEmitter = createCommonjsModule(function (module) {
/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if (  module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : commonjsGlobal, function() {

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i];
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));
});

var getSize = createCommonjsModule(function (module) {
/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */
/* globals console: false */

( function( window, factory ) {
  /* jshint strict: false */ /* globals define, module */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.getSize = factory();
  }

})( window, function factory() {

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See https://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * Chrome & Safari measure the outer-width on style.width on border-box elems
   * IE11 & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );
  // round value for browser zoom. desandro/masonry#928
  isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
  getSize.isBoxSizeOuter = isBoxSizeOuter;

  body.removeChild( div );
}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});
});

var matchesSelector = createCommonjsModule(function (module) {
/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  // universal module definition
  if (  module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.matchesSelector = factory();
  }

}( window, function factory() {

  var matchesMethod = ( function() {
    var ElemProto = window.Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));
});

var utils = createCommonjsModule(function (module) {
/**
 * Fizzy UI utils v2.0.7
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      matchesSelector
    );
  } else {
    // browser global
    window.fizzyUIUtils = factory(
      window,
      window.matchesSelector
    );
  }

}( window, function factory( window, matchesSelector ) {

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }
  // return empty array if undefined or null. #6
  if ( obj === null || obj === undefined ) {
    return [];
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem.parentNode && elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  threshold = threshold || 100;
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    clearTimeout( timeout );

    var args = arguments;
    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  var readyState = document.readyState;
  if ( readyState == 'complete' || readyState == 'interactive' ) {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout( callback );
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('namespace')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));
});

var item = createCommonjsModule(function (module) {
/**
 * Outlayer Item
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (  module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      evEmitter,
      getSize
    );
  } else {
    // browser global
    window.Outlayer = {};
    window.Outlayer.Item = factory(
      window.EvEmitter,
      window.getSize
    );
  }

}( window, function factory( EvEmitter, getSize ) {

// ----- helpers ----- //

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// -------------------------- CSS3 support -------------------------- //


var docElemStyle = document.documentElement.style;

var transitionProperty = typeof docElemStyle.transition == 'string' ?
  'transition' : 'WebkitTransition';
var transformProperty = typeof docElemStyle.transform == 'string' ?
  'transform' : 'WebkitTransform';

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  transition: 'transitionend'
}[ transitionProperty ];

// cache all vendor properties that could have vendor prefix
var vendorProperties = {
  transform: transformProperty,
  transition: transitionProperty,
  transitionDuration: transitionProperty + 'Duration',
  transitionProperty: transitionProperty + 'Property',
  transitionDelay: transitionProperty + 'Delay'
};

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EvEmitter
var proto = Item.prototype = Object.create( EvEmitter.prototype );
proto.constructor = Item;

proto._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
proto.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
proto.getPosition = function() {
  var style = getComputedStyle( this.element );
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  var xValue = style[ isOriginLeft ? 'left' : 'right' ];
  var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
  var x = parseFloat( xValue );
  var y = parseFloat( yValue );
  // convert percent to pixels
  var layoutSize = this.layout.size;
  if ( xValue.indexOf('%') != -1 ) {
    x = ( x / 100 ) * layoutSize.width;
  }
  if ( yValue.indexOf('%') != -1 ) {
    y = ( y / 100 ) * layoutSize.height;
  }
  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
proto.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var style = {};
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');

  // x
  var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
  var xProperty = isOriginLeft ? 'left' : 'right';
  var xResetProperty = isOriginLeft ? 'right' : 'left';

  var x = this.position.x + layoutSize[ xPadding ];
  // set in percentage or pixels
  style[ xProperty ] = this.getXValue( x );
  // reset other property
  style[ xResetProperty ] = '';

  // y
  var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
  var yProperty = isOriginTop ? 'top' : 'bottom';
  var yResetProperty = isOriginTop ? 'bottom' : 'top';

  var y = this.position.y + layoutSize[ yPadding ];
  // set in percentage or pixels
  style[ yProperty ] = this.getYValue( y );
  // reset other property
  style[ yResetProperty ] = '';

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};

proto.getXValue = function( x ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && !isHorizontal ?
    ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

proto.getYValue = function( y ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && isHorizontal ?
    ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};

proto._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var didNotMove = x == this.position.x && y == this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  transitionStyle.transform = this.getTranslate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

proto.getTranslate = function( x, y ) {
  // flip cooridinates if origin on right or bottom
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  x = isOriginLeft ? x : -x;
  y = isOriginTop ? y : -y;
  return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
};

// non transition + transform support
proto.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

proto.moveTo = proto._transitionTo;

proto.setPosition = function( x, y ) {
  this.position.x = parseFloat( x );
  this.position.y = parseFloat( y );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
proto._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
proto.transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
  return str.replace( /([A-Z])/g, function( $1 ) {
    return '-' + $1.toLowerCase();
  });
}

var transitionProps = 'opacity,' + toDashedAll( transformProperty );

proto.enableTransition = function(/* style */) {
  // HACK changing transitionProperty during a transition
  // will cause transition to jump
  if ( this.isTransitioning ) {
    return;
  }

  // make `transition: foo, bar, baz` from style object
  // HACK un-comment this when enableTransition can work
  // while a transition is happening
  // var transitionValues = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   prop = vendorProperties[ prop ] || prop;
  //   transitionValues.push( toDashedAll( prop ) );
  // }
  // munge number to millisecond, to match stagger
  var duration = this.layout.options.transitionDuration;
  duration = typeof duration == 'number' ? duration + 'ms' : duration;
  // enable transition styles
  this.css({
    transitionProperty: transitionProps,
    transitionDuration: duration,
    transitionDelay: this.staggerDelay || 0
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

// ----- events ----- //

proto.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

proto.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform'
};

proto.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

proto.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
proto._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: '',
  transitionDelay: ''
};

proto.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- stagger ----- //

proto.stagger = function( delay ) {
  delay = isNaN( delay ) ? 0 : delay;
  this.staggerDelay = delay + 'ms';
};

// ----- show/hide/remove ----- //

// remove element from DOM
proto.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  // remove display: none
  this.css({ display: '' });
  this.emitEvent( 'remove', [ this ] );
};

proto.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  this.once( 'transitionEnd', function() {
    this.removeElem();
  });
  this.hide();
};

proto.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onRevealTransitionEnd = function() {
  // check if still visible
  // during transition, item may have been hidden
  if ( !this.isHidden ) {
    this.emitEvent('reveal');
  }
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
proto.getHideRevealTransitionEndProperty = function( styleProperty ) {
  var optionStyle = this.layout.options[ styleProperty ];
  // use opacity
  if ( optionStyle.opacity ) {
    return 'opacity';
  }
  // get first property
  for ( var prop in optionStyle ) {
    return prop;
  }
};

proto.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onHideTransitionEnd = function() {
  // check if still hidden
  // during transition, item may have been un-hidden
  if ( this.isHidden ) {
    this.css({ display: 'none' });
    this.emitEvent('hide');
  }
};

proto.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}));
});

var outlayer = createCommonjsModule(function (module) {
/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if (  module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory(
      window,
      evEmitter,
      getSize,
      utils,
      item
    );
  } else {
    // browser global
    window.Outlayer = factory(
      window,
      window.EvEmitter,
      window.getSize,
      window.fizzyUIUtils,
      window.Outlayer.Item
    );
  }

}( window, function factory( window, EvEmitter, getSize, utils, Item ) {

// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for ' + this.constructor.namespace +
        ': ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  var isInitLayout = this._getOption('initLayout');
  if ( isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  initLayout: true,
  originLeft: true,
  originTop: true,
  resize: true,
  resizeContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

var proto = Outlayer.prototype;
// inherit EvEmitter
utils.extend( proto, EvEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

/**
 * get backwards compatible option value, check old name
 */
proto._getOption = function( option ) {
  var oldOption = this.constructor.compatOptions[ option ];
  return oldOption && this.options[ oldOption ] !== undefined ?
    this.options[ oldOption ] : this.options[ option ];
};

Outlayer.compatOptions = {
  // currentName: oldName
  initLayout: 'isInitLayout',
  horizontal: 'isHorizontal',
  layoutInstant: 'isLayoutInstant',
  originLeft: 'isOriginLeft',
  originTop: 'isOriginTop',
  resize: 'isResizeBound',
  resizeContainer: 'isResizingContainer'
};

proto._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  utils.extend( this.element.style, this.options.containerStyle );

  // bind resize method
  var canBindResize = this._getOption('resize');
  if ( canBindResize ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
proto.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
proto._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0; i < itemElems.length; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
proto._filterFindItemElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
proto.getItemElements = function() {
  return this.items.map( function( item ) {
    return item.element;
  });
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
proto.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var layoutInstant = this._getOption('layoutInstant');
  var isInstant = layoutInstant !== undefined ?
    layoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
proto._init = proto.layout;

/**
 * logic before any new layout
 */
proto._resetLayout = function() {
  this.getSize();
};


proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
proto._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option == 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( option instanceof HTMLElement ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
proto.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
proto._getItemsForLayout = function( items ) {
  return items.filter( function( item ) {
    return !item.isIgnored;
  });
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
proto._layoutItems = function( items, isInstant ) {
  this._emitCompleteOnItems( 'layout', items );

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    return;
  }

  var queue = [];

  items.forEach( function( item ) {
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }, this );

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
proto._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
proto._processLayoutQueue = function( queue ) {
  this.updateStagger();
  queue.forEach( function( obj, i ) {
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant, i );
  }, this );
};

// set stagger from option in milliseconds number
proto.updateStagger = function() {
  var stagger = this.options.stagger;
  if ( stagger === null || stagger === undefined ) {
    this.stagger = 0;
    return;
  }
  this.stagger = getMilliseconds( stagger );
  return this.stagger;
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
proto._positionItem = function( item, x, y, isInstant, i ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.stagger( i * this.stagger );
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
proto._postLayout = function() {
  this.resizeContainer();
};

proto.resizeContainer = function() {
  var isResizingContainer = this._getOption('resizeContainer');
  if ( !isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
proto._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
proto._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
proto._emitCompleteOnItems = function( eventName, items ) {
  var _this = this;
  function onComplete() {
    _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
  }

  var count = items.length;
  if ( !items || !count ) {
    onComplete();
    return;
  }

  var doneCount = 0;
  function tick() {
    doneCount++;
    if ( doneCount == count ) {
      onComplete();
    }
  }

  // bind callback
  items.forEach( function( item ) {
    item.once( eventName, tick );
  });
};

/**
 * emits events via EvEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  // add original event to arguments
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery ) {
    // set this.$element
    this.$element = this.$element || jQuery( this.element );
    if ( event ) {
      // create jQuery event
      var $event = jQuery.Event( event );
      $event.type = type;
      this.$element.trigger( $event, args );
    } else {
      // just trigger with type if no event available
      this.$element.trigger( type, args );
    }
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
proto.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
proto.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
proto.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  elems.forEach( this.ignore, this );
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
proto.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  elems.forEach( function( elem ) {
    // filter out removed stamp elements
    utils.removeFrom( this.stamps, elem );
    this.unignore( elem );
  }, this );
};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
proto._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems == 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = utils.makeArray( elems );
  return elems;
};

proto._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  this.stamps.forEach( this._manageStamp, this );
};

// update boundingLeft / Top
proto._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
proto._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
proto._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
proto.handleEvent = utils.handleEvent;

/**
 * Bind layout to window resizing
 */
proto.bindResize = function() {
  window.addEventListener( 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
proto.unbindResize = function() {
  window.removeEventListener( 'resize', this );
  this.isResizeBound = false;
};

proto.onresize = function() {
  this.resize();
};

utils.debounceMethod( Outlayer, 'onresize', 100 );

proto.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
proto.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
proto.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
proto.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
proto.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.reveal = function( items ) {
  this._emitCompleteOnItems( 'reveal', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.reveal();
  });
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.hide = function( items ) {
  this._emitCompleteOnItems( 'hide', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.hide();
  });
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.revealItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.hideItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
proto.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0; i < this.items.length; i++ ) {
    var item = this.items[i];
    if ( item.element == elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
proto.getItems = function( elems ) {
  elems = utils.makeArray( elems );
  var items = [];
  elems.forEach( function( elem ) {
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }, this );

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
proto.remove = function( elems ) {
  var removeItems = this.getItems( elems );

  this._emitCompleteOnItems( 'remove', removeItems );

  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  removeItems.forEach( function( item ) {
    item.remove();
    // remove item from collection
    utils.removeFrom( this.items, item );
  }, this );
};

// ----- destroy ----- //

// remove and disable Outlayer instance
proto.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  this.items.forEach( function( item ) {
    item.destroy();
  });

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  var Layout = subclass( Outlayer );
  // apply new options and compatOptions
  Layout.defaults = utils.extend( {}, Outlayer.defaults );
  utils.extend( Layout.defaults, options );
  Layout.compatOptions = utils.extend( {}, Outlayer.compatOptions  );

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = subclass( Item );

  // -------------------------- declarative -------------------------- //

  utils.htmlInit( Layout, namespace );

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

function subclass( Parent ) {
  function SubClass() {
    Parent.apply( this, arguments );
  }

  SubClass.prototype = Object.create( Parent.prototype );
  SubClass.prototype.constructor = SubClass;

  return SubClass;
}

// ----- helpers ----- //

// how many milliseconds are in each unit
var msUnits = {
  ms: 1,
  s: 1000
};

// munge time-like parameter into millisecond number
// '0.4s' -> 40
function getMilliseconds( time ) {
  if ( typeof time == 'number' ) {
    return time;
  }
  var matches = time.match( /(^\d*\.?\d*)(\w*)/ );
  var num = matches && matches[1];
  var unit = matches && matches[2];
  if ( !num.length ) {
    return 0;
  }
  num = parseFloat( num );
  var mult = msUnits[ unit ] || 1;
  return num * mult;
}

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));
});

var masonry = createCommonjsModule(function (module) {
/*!
 * Masonry v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if (  module.exports ) {
    // CommonJS
    module.exports = factory(
      outlayer,
      getSize
    );
  } else {
    // browser global
    window.Masonry = factory(
      window.Outlayer,
      window.getSize
    );
  }

}( window, function factory( Outlayer, getSize ) {

// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');
  // isFitWidth -> fitWidth
  Masonry.compatOptions.fitWidth = 'isFitWidth';

  var proto = Masonry.prototype;

  proto._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    this.colYs = [];
    for ( var i=0; i < this.cols; i++ ) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
    this.horizontalColIndex = 0;
  };

  proto.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = this.columnWidth += this.gutter;

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - containerWidth % columnWidth;
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[ mathMethod ]( cols );
    this.cols = Math.max( cols, 1 );
  };

  proto.getContainerWidth = function() {
    // container is parent if fit width
    var isFitWidth = this._getOption('fitWidth');
    var container = isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  proto._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );
    // use horizontal or top column position
    var colPosMethod = this.options.horizontalOrder ?
      '_getHorizontalColPosition' : '_getTopColPosition';
    var colPosition = this[ colPosMethod ]( colSpan, item );
    // position the brick
    var position = {
      x: this.columnWidth * colPosition.col,
      y: colPosition.y
    };
    // apply setHeight to necessary columns
    var setHeight = colPosition.y + item.size.outerHeight;
    var setMax = colSpan + colPosition.col;
    for ( var i = colPosition.col; i < setMax; i++ ) {
      this.colYs[i] = setHeight;
    }

    return position;
  };

  proto._getTopColPosition = function( colSpan ) {
    var colGroup = this._getTopColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );

    return {
      col: colGroup.indexOf( minimumY ),
      y: minimumY,
    };
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  proto._getTopColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      colGroup[i] = this._getColGroupY( i, colSpan );
    }
    return colGroup;
  };

  proto._getColGroupY = function( col, colSpan ) {
    if ( colSpan < 2 ) {
      return this.colYs[ col ];
    }
    // make an array of colY values for that one group
    var groupColYs = this.colYs.slice( col, col + colSpan );
    // and get the max value of the array
    return Math.max.apply( Math, groupColYs );
  };

  // get column position based on horizontal index. #873
  proto._getHorizontalColPosition = function( colSpan, item ) {
    var col = this.horizontalColIndex % this.cols;
    var isOver = colSpan > 1 && col + colSpan > this.cols;
    // shift to next row if item can't fit on current row
    col = isOver ? 0 : col;
    // don't let zero-size items take up space
    var hasSize = item.size.outerWidth && item.size.outerHeight;
    this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

    return {
      col: col,
      y: this._getColGroupY( col, colSpan ),
    };
  };

  proto._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var isOriginLeft = this._getOption('originLeft');
    var firstX = isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp

    var isOriginTop = this._getOption('originTop');
    var stampMaxY = ( isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  proto._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this._getOption('fitWidth') ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  proto._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  proto.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth != this.containerWidth;
  };

  return Masonry;

}));
});

class HomeKitCard extends LitElement {
    constructor() {
        super(...arguments);
        this.renderedRules = [];
        this.doubleTapped = false;
        this.tileHoldAnimation = false;
        this.useTemperature = false;
        this.useBrightness = false;
        this.CUSTOM_TYPE_PREFIX = "custom:";
        this.masonry = false;
    }
    static get properties() {
        return {
            hass: {},
            config: {}
        };
    }
    setConfig(config) {
        if (!config.entities && !config.rows) {
            throw new Error("You need to define entities: or rows:");
        }
        if (!config.entities && config.rows && !config.enableColumns) {
            throw new Error("If you use rows and columns you need to set enableColumns: true");
        }
        this.config = config;
        this.useTemperature = "useTemperature" in this.config ? this.config.useTemperature : false;
        this.useBrightness = "useBrightness" in this.config ? this.config.useBrightness : true;
        this.rowTitleColor = this.config.titleColor ? this.config.titleColor : false;
        this.horizontalScroll = "horizontalScroll" in this.config ? this.config.fullscreen : false;
        this.enableColumns = "enableColumns" in this.config ? this.config.enableColumns : false;
        this.statePositionTop = "statePositionTop" in this.config ? this.config.statePositionTop : false;
        this.tileHoldAnimation = "tileHoldAnimation" in this.config ? this.config.tileHoldAnimation : false;
        this.rulesColor = this.config.rulesColor ? this.config.rulesColor : false;
        this.masonry = "masonry" in this.config ? this.config.masonry : false;
    }
    addHammer(el) {
        var hammer = new Hammer(el, {});
        var $this = this;
        hammer.on("tap doubletap pressup press panmove", function (ev) {
            ev.preventDefault();
            var dataset = ev.target.dataset;
            var ent = JSON.parse(dataset.ent);
            var row = JSON.parse(dataset.row);
            $this.doubleTapped = false;
            if (ev.type == 'tap') {
                $this.doubleTapped = false;
                var timeoutTime = 200;
                if (!ent.double_tap_action) {
                    timeoutTime = 0;
                }
                setTimeout(function () {
                    if ($this.doubleTapped === false) {
                        ev.target.classList.remove('longpress');
                        $this._handleClick(ev.type, ent, dataset.type, row);
                    }
                }, timeoutTime);
            }
            else {
                if (ev.type == 'doubletap') {
                    $this.doubleTapped = true;
                }
                var dataset = ev.target.dataset;
                if (ev.type == 'press') {
                    ev.target.classList.add('longpress');
                }
                else if (ev.type == 'panmove') {
                    ev.target.classList.remove('longpress');
                }
                else {
                    ev.target.classList.remove('longpress');
                    $this._handleClick(ev.type, ent, dataset.type, row);
                }
            }
        });
    }
    render() {
        return html `
      ${this.config.style ? html `
        <style>
          ${this.config.style}
        </style>
      ` : html ``}
      <div class="container${this.enableColumns ? ' rows' : ''}" >
        ${this.config.home ? html `
            <div class="header">
                ${this.config.title ? html `<h1 style="${this.rowTitleColor ? 'color:' + this.rowTitleColor : ''}">${this.config.title}</h1>` : html ``}
                <ul style="${this.rulesColor ? 'color:' + this.rulesColor : ''}">
                  ${this.renderedRules.map(rule => {
            return html `<li>${rule}</li>`;
        })}
                </ul>
            </div>
        ` : html ``}
       
        ${this.enableColumns ? this._renderRows() : this._renderEntities(this.config.entities)}
      </div>
    `;
    }
    firstUpdated() {
        var myNodelist = this.shadowRoot.querySelectorAll('homekit-button.event');
        for (var i = 0; i < myNodelist.length; i++) {
            this.addHammer(myNodelist[i]);
        }
        this.shadowRoot.querySelectorAll(".card-tile").forEach(customCard => {
            var card = {
                type: customCard.dataset.card
            };
            card = Object.assign({}, card, JSON.parse(customCard.dataset.options));
            const cardElement = createCard(card);
            customCard.appendChild(cardElement);
            provideHass(cardElement);
            let style = "";
            if (customCard.dataset.style) {
                style = customCard.dataset.style;
            }
            else if (customCard.dataset.card == 'custom:mini-graph-card') {
                style = ":host { height: 100%; } ha-card { background: transparent; color: #000; padding: 0!important; box-shadow: none; } .header { padding: 10px 10px 0 10px; } .header .name, .header .name .ellipsis { font-size: 13px!important; font-weight: 500; color: #000; opacity: 1; } .header icon { color: #f7d959; } .states { padding: 0 10px; } .states .state .state__value { font-size: 13px; } .states .state .state__uom { font-size: 13px; margin-top: 0; line-height: normal; } .header .icon { color: #f7d959; }";
            }
            if (style != "") {
                let itterations = 0;
                let interval = setInterval(function () {
                    if (cardElement && cardElement.shadowRoot) {
                        window.clearInterval(interval);
                        var styleElement = document.createElement('style');
                        styleElement.innerHTML = style;
                        cardElement.shadowRoot.appendChild(styleElement);
                    }
                    else if (++itterations === 10) {
                        window.clearInterval(interval);
                    }
                }, 100);
            }
        });
        if (this.masonry) {
            console.log("MASONRY");
            var windowInnerWidth = window.innerWidth;
            console.log(windowInnerWidth);
            var masonryColumWidth = 120;
            if (windowInnerWidth <= 768) {
                masonryColumWidth = 110;
            }
            this.shadowRoot.querySelectorAll('.homekit-card').forEach(masonryItem => {
                console.log(masonryItem);
                new masonry(masonryItem, {
                    itemSelector: 'homekit-button',
                    columnWidth: masonryColumWidth,
                    gutter: 6,
                });
            });
        }
    }
    updated() {
        this._renderRules();
    }
    _renderRows() {
        return html `
      ${this.config.rows.map(row => {
            return html `
          <div class="row">
            ${row.columns.map(column => {
                return html `
                <div class="col${column.tileOnRow ? ' fixed' : ''}" style="${column.tileOnRow ? '--tile-on-row:' + column.tileOnRow : ''}">
                  ${this._renderEntities(column.entities)}
                </div>
              `;
            })}
          </div>
        `;
        })}
    `;
    }
    _renderState(ent, stateObj, offStates, type) {
        if (!ent.hideState) {
            if (type == 'light' && (stateObj.attributes.brightness || ent.state)) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                }
                else {
                    return html `
            <span class=" ${offStates.includes(stateObj.state) ? 'value' : 'value on'}">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            }
            else if ((type == "sensor" || type == "binary_sensor") && (stateObj.last_changed || ent.state)) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                }
                else {
                    return html `
            <span class="previous">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            }
            else if ((type == "switch" || type == "input_boolean") && ent.state) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                }
                else {
                    return html `
            <span class="value on">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            }
            else if (type == "climate" && stateObj.attributes.temperature) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                }
                else {
                    return html `
            <span class=" ${offStates.includes(stateObj.state) ? 'value' : 'value on'}">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            }
            else {
                if (ent.state) {
                    if (this.statePositionTop) {
                        return this._renderCircleState(ent, stateObj, type);
                    }
                    else {
                        return html `
              <span class="value on">${this._renderStateValue(ent, stateObj, type)}</span>
            `;
                    }
                }
            }
        }
    }
    _renderCircleState(ent, stateObj, type) {
        return html `
      <svg class="circle-state" viewbox="0 0 100 100" style="${stateObj.attributes.brightness && !ent.state ? '--percentage:' + (stateObj.attributes.brightness / 2.55)
            : ''}">
        <path id="progress" stroke-width="3" stroke="#aaabad" fill="none"
              d="M50 10
                a 40 40 0 0 1 0 80
                a 40 40 0 0 1 0 -80">
        </path>
        <text id="count" x="50" y="50" fill="#7d7e80" text-anchor="middle" dy="7" font-size="20">${this._renderStateValue(ent, stateObj, type)}</text>
      </svg>
    `;
    }
    _getValue(state, statePath) {
        var stateObj = this.hass.states[state];
        var path = statePath.split('.');
        for (var pathItem of path) {
            if (stateObj[pathItem]) {
                stateObj = stateObj[pathItem];
            }
            else {
                stateObj = null;
            }
        }
        return stateObj;
    }
    _renderStateValue(ent, stateObj, type) {
        if (type == 'light') {
            return html `
        ${stateObj.attributes.brightness && !ent.state ? html `${Math.round(stateObj.attributes.brightness / 2.55)}%` : html ``}
        ${ent.state && !ent.statePath ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
        ${ent.state && ent.statePath ? html `${this._getValue(ent.state, ent.statePath)}` : html ``}
      `;
        }
        else if (type == "sensor" || type == "binary_sensor") {
            return html `
        ${stateObj.last_changed && !ent.state ? html `${this._calculateTime(stateObj.last_changed)}` : html ``}
        ${ent.state && !ent.statePath ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
        ${ent.state && ent.statePath ? html `${this._getValue(ent.state, ent.statePath)}` : html ``}
      `;
        }
        else if (type == "switch" || type == "input_boolean") {
            return html `
        ${ent.state && !ent.statePath ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
        ${ent.state && ent.statePath ? html `${this._getValue(ent.state, ent.statePath)}` : html ``}
      `;
        }
        else if (type == "climate") {
            return html `
        ${stateObj.attributes.temperature ? html `${stateObj.attributes.temperature}&#176;` : html ``}
      `;
        }
        else {
            return html `
        ${ent.state && !ent.statePath ? html `${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html ``}
        ${ent.state && ent.statePath ? html `${this._getValue(ent.state, ent.statePath)}` : html ``}
      `;
        }
    }
    _evalTemplate(state, func) {
        /* eslint no-new-func: 0 */
        try {
            return new Function('states', 'entity', 'user', 'hass', 'variables', 'html', `'use strict'; ${func}`).call(this, this.hass.states, state, this.hass.user, this.hass, html);
        }
        catch (e) {
            const funcTrimmed = func.length <= 100 ? func.trim() : `${func.trim().substring(0, 98)}...`;
            e.message = `${e.name}: ${e.message} in '${funcTrimmed}'`;
            e.name = 'ButtonCardJSTemplateError';
            throw e;
        }
    }
    _getTemplate(state, value) {
        const trimmed = value.trim();
        if (trimmed.substring(0, 3) === '[[[' && trimmed.slice(-3) === ']]]') {
            return this._evalTemplate(state, trimmed.slice(3, -3));
        }
    }
    _renderEntities(entities) {
        return html `
      ${entities.map(row => {
            var entityCount = 0;
            return html `
            <div class="card-title" style="${this.rowTitleColor ? 'color:' + this.rowTitleColor : ''}">${row.title}</div>
                <div class="homekit-card${this.horizontalScroll === true ? ' scroll' : ''}${this.masonry === true ? ' masonry' : ''}">
                    ${row.entities.map(ent => {
                if (!ent.card && !ent.custom) {
                    var offStates = ['off', 'unavailable'];
                    if (ent.offStates) {
                        offStates = ent.offStates;
                    }
                    const stateObj = this.hass.states[ent.entity];
                    var color = '#f7d959';
                    if (entityCount == 3) {
                        entityCount = 0;
                    }
                    if (entityCount == 4) {
                        entityCount = 2;
                    }
                    if (ent.color) {
                        color = ent.color;
                    }
                    else {
                        color = this._getColorForLightEntity(stateObj, this.useTemperature, this.useBrightness);
                    }
                    var type = ent.entity.split('.')[0];
                    if (type == "light") {
                        entityCount++;
                        if (!ent.slider) {
                            return stateObj ? html `
                                <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                    <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                      <span class="icon${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}" style="${!offStates.includes(stateObj.state) ? 'color:' + color + ';' : ''}">

                                        ${ent.image ? html `
                                          <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                        ` : html `
                                          <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin' : ""}"/>
                                        `}
                                      </span>
                                      <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                        ${b(this.hass.localize, stateObj, this.hass.language)}
                                        ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                      </span>
                                      ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </div>
                                </homekit-button>
                              ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                              `
                                : this._notFound(ent);
                        }
                        else {
                            return stateObj ? html `
                                <homekit-button class="event slider ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                    <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                      <span class="icon${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}" style="${!offStates.includes(stateObj.state) ? 'color:' + color + ';' : ''}">
          
                                        ${ent.image ? html `
                                          <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                        ` : html `
                                          <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin' : ""}"/>
                                        `}
                                        
                                      </span>
                                      <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                        ${b(this.hass.localize, stateObj, this.hass.language)}
                                        ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                      </span>
                                      ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </div>
                                    ${offStates.includes(stateObj.state) ? html `` : html `<input type="range" .value="${stateObj.attributes.brightness / 2.55}" @change=${e => this._setBrightness(stateObj, e.target.value)}>`}
                                </homekit-button>
                              ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                              `
                                : this._notFound(ent);
                        }
                    }
                    else if (type == "sensor" || type == "binary_sensor") {
                        entityCount++;
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html `
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                      ` : html `
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else if (type == "switch" || type == "input_boolean") {
                        entityCount++;
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html `
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                      ` : html `
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else if (type == "weather") {
                        entityCount = entityCount + 2;
                        return stateObj ? html `
                            ${entityCount == 4 ? html `<div class="break"></div>` : html ``}
                              <homekit-button class="event button size-2 on${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="icon on">
                                      <ha-icon icon="${ent.icon || stateObj.attributes.icon || "mdi:weather-" + stateObj.state}" />
                                    </span>
                                    <span class="name on">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="state on">${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${stateObj.attributes.forecast[0] && stateObj.attributes.forecast[0].precipitation ? html `
                                          <span class="value on">${stateObj.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                      ` : html ``}
                                    </span>
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else if (type == "climate") {
                        entityCount++;
                        var modes = {
                            auto: "hass:calendar-repeat",
                            heat_cool: "hass:autorenew",
                            heat: "hass:fire",
                            cool: "hass:snowflake",
                            off: "hass:power",
                            fan_only: "hass:fan",
                            dry: "hass:water-percent",
                        };
                        var mode = '';
                        if (stateObj.state == 'off') {
                            mode = 'off';
                        }
                        else if (stateObj.attributes.hvac_action == 'heating') {
                            mode = 'heat';
                        }
                        else if (stateObj.attributes.hvac_action == 'idle') {
                            mode = 'idle';
                        }
                        else {
                            mode = stateObj.state in modes ? stateObj.state : "unknown-mode";
                        }
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon climate ' + mode : 'icon climate on ' + mode}">
                                      ${ent.state ? Math.round(this.hass.states[ent.state].state) : Math.round(stateObj.attributes.current_temperature)}&#176;
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                    else {
                        entityCount++;
                        return stateObj ? html `
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html `
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                      ` : html `
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || O(d(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${b(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `
                            : this._notFound(ent);
                    }
                }
                else if (ent.card && !ent.custom) {
                    entityCount++;
                    var stateObj = { state: '' };
                    offStates = ['off', 'unavailable'];
                    if (ent.entity) {
                        if (ent.offStates) {
                            offStates = ent.offStates;
                        }
                        stateObj = this.hass.states[ent.entity];
                    }
                    if (ent.tap_action) {
                        return html `
                            <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'} event${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(undefined, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(undefined, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="'card'" data-row="${JSON.stringify(row)}">
                                <div class="button-inner card-tile" data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                </div>
                            </homekit-button>
                          ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                        `;
                    }
                    else {
                        return html `
                              <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(undefined, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(undefined, ent.conditionalClass) : ''}">
                                  <div class="button-inner card-tile" data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                          `;
                    }
                }
                else if (ent.custom) {
                    entityCount++;
                    var stateObj = { state: '' };
                    offStates = ['off', 'unavailable'];
                    if (ent.entity) {
                        if (ent.offStates) {
                            offStates = ent.offStates;
                        }
                        stateObj = this.hass.states[ent.entity];
                    }
                    return html `
                          <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'} event${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(undefined, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(undefined, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="'custom'" data-row="${JSON.stringify(row)}">
                              <div class="button-inner">
                                <span class="icon on${ent.spin === true ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                  ${ent.image ? html `
                                    <img src="${ent.image}" />
                                  ` : html `
                                    <ha-icon icon="${ent.icon}" />
                                  `}
                                </span>
                                <span class="name on">${ent.name}</span>
                                ${ent.state ? html `<span class="state">${b(this.hass.localize, this.hass.states[ent.state], this.hass.language)}</span>` : html ``}
                              </div>
                          </homekit-button>
                        ${entityCount == 3 ? html `<div class="break"></div>` : html ``}
                        `;
                }
            })}
                </div>
            </div>
        `;
        })}
    `;
    }
    _setBrightness(state, value) {
        this.hass.callService("homeassistant", "turn_on", {
            entity_id: state.entity_id,
            brightness: value * 2.55
        });
    }
    _renderRules() {
        if (this.config.home === true && this.config.rules) {
            parseTemplate(this.hass, this.config.rules).then((c) => {
                if (c) {
                    var result = c.match(/<li>([^]*?)<\/li>/g).map(function (val) {
                        return val.replace(/<\/?li>/g, '');
                    });
                    this.renderedRules = result;
                }
            });
        }
    }
    _calculateTime(lastUpdated) {
        const currentDate = new Date();
        const lastDate = new Date(lastUpdated);
        const diffMs = currentDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffMs / 86400000); // days
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        const diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000);
        if (diffDays > 0) {
            return this.statePositionTop ? diffDays + 'd' : diffDays + ' days ago';
        }
        else if (diffHrs > 0) {
            return this.statePositionTop ? diffHrs + 'h' : diffHrs + ' hours ago';
        }
        else if (diffMins > 0) {
            return this.statePositionTop ? diffMins + 'm' : diffMins + ' minutes ago';
        }
        else {
            return this.statePositionTop ? diffSecs + 's' : diffSecs + ' seconds ago';
        }
    }
    _handleClick(action, entity, type, row) {
        var state = null;
        if (entity.entity) {
            state = this.hass.states[entity.entity];
        }
        if ((action == "tap" || action == "doubletap")) {
            if (action == "doubletap" && entity.double_tap_action) {
                this._customAction(entity.double_tap_action, entity, row);
            }
            else if (entity.tap_action) {
                this._customAction(entity.tap_action, entity, row);
            }
            else if (type === "light" || type === "switch" || type === "input_boolean" || type === "group") {
                this._toggle(state, entity.service);
            }
        }
        else if (action == "pressup") {
            if (entity.hold_action) {
                this._customAction(entity.hold_action, entity, row);
            }
            else {
                this._hold(state, entity, row);
            }
        }
    }
    _customAction(tapAction, entity, row) {
        if (tapAction.confirmation) {
            z("warning");
            if (!confirm(tapAction.confirmation.text ||
                `Are you sure you want to ${tapAction.action}?`)) {
                return;
            }
        }
        switch (tapAction.action) {
            case "popup":
                this._createPopup((tapAction.entity || entity.entity), entity, row);
                break;
            case "more-info":
                if (tapAction.entity || tapAction.camera_image) {
                    moreInfo(tapAction.entity ? tapAction.entity : tapAction.camera_image);
                }
                break;
            case "navigate":
                if (tapAction.navigation_path) {
                    F(window, tapAction.navigation_path);
                }
                break;
            case "url":
                if (tapAction.url_path) {
                    window.open(tapAction.url_path);
                }
                break;
            case "toggle":
                if (tapAction.entity) {
                    B(this.hass, tapAction.entity);
                    z("success");
                }
                break;
            case "call-service": {
                if (!tapAction.service) {
                    z("failure");
                    return;
                }
                const [domain, service] = tapAction.service.split(".", 2);
                this.hass.callService(domain, service, tapAction.service_data);
                z("success");
            }
        }
    }
    getCardSize() {
        return 1;
    }
    async _createPopup(entity_id, entity, row) {
        if ((row && row.popup) || entity.popup) {
            if (row.popup) {
                var popUpCard = Object.assign({}, row.popup, { entity: entity_id });
                if (entity.popupExtend) {
                    var popUpCard = Object.assign({}, popUpCard, entity.popupExtend);
                }
            }
            else {
                var popUpCard = Object.assign({}, entity.popup, { entity: entity_id });
            }
            var popUpStyle = {
                '$': ".mdc-dialog .mdc-dialog__container { width: 100%; } .mdc-dialog .mdc-dialog__container .mdc-dialog__surface { width:100%; box-shadow:none; }",
                '.': ":host { --mdc-theme-surface: rgba(0,0,0,0); --secondary-background-color: rgba(0,0,0,0); --ha-card-background: rgba(0,0,0,0); --mdc-dialog-scrim-color: rgba(0,0,0,0.8); --mdc-dialog-min-height: 100%; --mdc-dialog-min-width: 100%; --mdc-dialog-max-width: 100%; } mwc-icon-button { color: #FFF; }"
            };
            var service_data = {
                title: " ",
                style: popUpStyle,
                card: popUpCard,
                deviceID: ['this']
            };
            var result = await this.hass.callService("browser_mod", "popup", service_data);
        }
        else {
            moreInfo(entity_id);
        }
    }
    _toggle(state, service) {
        this.hass.callService("homeassistant", service || "toggle", {
            entity_id: state.entity_id
        });
    }
    _hold(stateObj, entity, row) {
        this._createPopup(stateObj.entity_id, entity, row);
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
        return html `
        <homekit-button class="not-found">
          <div class="button-inner">
            <span class="name">${ent.entity}</span>
            <span class="state">Not found</span>
          </div>
        </homekit-button>
    `;
    }
    _getColorForLightEntity(stateObj, useTemperature, useBrightness) {
        var color = this.config.default_color ? this.config.default_color : undefined;
        if (stateObj) {
            if (stateObj.attributes.rgb_color) {
                color = `rgb(${stateObj.attributes.rgb_color.join(',')})`;
                if (useBrightness && stateObj.attributes.brightness) {
                    color = this._applyBrightnessToColor(color, (stateObj.attributes.brightness + 245) / 5);
                }
            }
            else if (useTemperature && stateObj.attributes.color_temp && stateObj.attributes.min_mireds && stateObj.attributes.max_mireds) {
                color = this._getLightColorBasedOnTemperature(stateObj.attributes.color_temp, stateObj.attributes.min_mireds, stateObj.attributes.max_mireds);
                if (useBrightness && stateObj.attributes.brightness) {
                    color = this._applyBrightnessToColor(color, (stateObj.attributes.brightness + 245) / 5);
                }
            }
            else if (useBrightness && stateObj.attributes.brightness) {
                color = this._applyBrightnessToColor(this._getDefaultColorForState(), (stateObj.attributes.brightness + 245) / 5);
            }
            else {
                color = this._getDefaultColorForState();
            }
        }
        return color;
    }
    _applyBrightnessToColor(color, brightness) {
        const colorObj = new TinyColor(this._getColorFromVariable(color));
        if (colorObj.isValid) {
            const validColor = colorObj.mix('black', 100 - brightness).toString();
            if (validColor)
                return validColor;
        }
        return color;
    }
    _getLightColorBasedOnTemperature(current, min, max) {
        const high = new TinyColor('rgb(255, 160, 0)'); // orange-ish
        const low = new TinyColor('rgb(166, 209, 255)'); // blue-ish
        const middle = new TinyColor('white');
        const mixAmount = (current - min) / (max - min) * 100;
        if (mixAmount < 50) {
            return tinycolor(low).mix(middle, mixAmount * 2).toRgbString();
        }
        else {
            return tinycolor(middle).mix(high, (mixAmount - 50) * 2).toRgbString();
        }
    }
    _getDefaultColorForState() {
        return this.config.color_on ? this.config.color_on : '#f7d959';
    }
    _getColorFromVariable(color) {
        if (typeof color !== "undefined" && color.substring(0, 3) === 'var') {
            return window.getComputedStyle(document.documentElement).getPropertyValue(color.substring(4).slice(0, -1)).trim();
        }
        return color;
    }
    static get styles() {
        return css `
        :host {
            --auto-color: #ee7600;
            --eco-color: springgreen;
            --cool-color: #2b9af9;
            --heat-color: #ee7600;
            --manual-color: #44739e;
            --off-color: lightgrey;
            --fan_only-color: #8a8a8a;
            --dry-color: #efbd07;
            --idle-color: #00cc66;
            --unknown-color: #bac;
            box-sizing: border-box;
        }
        
        :host::after {
            display: table;
            content: "";
            clear: both;
        }
        
        .card-title {
            font-size: 16px;
            font-weight: bold;
            padding-top: 16px;
            padding-left: 4px;
        }
        
        .row {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            padding-top: 50px;
        }
        
        .row:first-child {
            padding-top: 0;
        }
        
        .row .col {
            padding: 0 25px;
        }
        
        .row .col.fixed {
            min-width: calc(var(--tile-on-row) * calc(var(--tile-width, 100px) + 29px));
            width: calc(var(--tile-on-row) * calc(var(--tile-width, 100px) + 29px));
        }
        
        .homekit-card {
            white-space: initial;
        }
        
        .homekit-card.scroll {
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
        }
        
        .container {
            float: left;
            clear: left;
            margin-top: 10px;
            margin-bottom: 10px;
            padding: 5px 0 5px 15px;
            white-space: nowrap;
            width: 100%;
            box-sizing: border-box;
        }
        .container.rows {
            padding: 5px 0;
        }
        .container.rows .header {
            padding: 0 25px;
        }
        .header {
            min-height: var(--min-header-height, 150px);
            margin-bottom: 30px;
        }
        .header h1 {
            margin-bottom: 30px;
            margin-left: 4px;
            font-size: 32px;
            font-weight: 300;
        }
        
        .header ul {
            margin: 0 0 30px 4px;
            padding: 0 16px 0 0;
            list-style: none;
        }
        
        .header ul li {
            display: block;
            color: inherit;
            font-size: 20px;
            font-weight: 300;
            white-space: normal;
        }
        
        homekit-button {
            transform-origin: center center;
        }
        
        .button {
            vertical-align: top;
            cursor: pointer;
            display: inline-block;
            width: var(--tile-width, 100px);
            height: var(--tile-height, 100px);
            padding: 10px;
            background-color: var(--tile-background, rgba(255, 255, 255, 0.8));
            border-radius: var(--tile-border-radius, 12px);
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
            margin: 5px 3px;
            position: relative;
            overflow: hidden;
            font-weight: 300;
            touch-action: auto !important;
        }
        
        .button.height-half {
            height: calc((var(--tile-height, 100px) * 0.5) - 13px);
        }
        
        .button.no-padding {
            padding: 0;
            width: calc(var(--tile-width, 100px) * 1.2);
            height: 120px;
        }
        
        .button.no-padding.height-half {
            height: calc((var(--tile-height, 100px) * 0.5) - 3px + 10px);
        }
        
        .button.size-2 {
            width: calc((var(--tile-width, 100px) * 2) + (10px * 2) + (10px * 1) - 1px);
        }
        
        .button.size-3 {
            width: calc((var(--tile-width, 100px) * 3) + (10px * 4) + (10px * 2) - 1px);
        }
        
        .button.size-4 {
            width: calc((var(--tile-width, 100px) * 4) + (10px * 6) + (10px * 3) - 1px);
        }
        
        .button.size-5 {
            width: calc((var(--tile-width, 100px) * 5) + (10px * 8) + (10px * 4) - 1px);
        }
        
        .button.size-6 {
            width: calc(
                (var(--tile-width, 100px) * 6) + (10px * 10) + (10px * 5) - 1px
            );
        }
        
        .button.height-2 {
            height: calc(
                (var(--tile-height, 100px) * 2) + (10px * 2) + (10px * 1) - 1px
            );
        }
        
        .button.height-3 {
            height: calc(
                (var(--tile-height, 100px) * 3) + (10px * 4) + (10px * 2) - 1px
            );
        }
        
        .button.height-4 {
            height: calc(
                (var(--tile-height, 100px) * 4) + (10px * 6) + (10px * 3) - 1px
            );
        }
        
        .button.height-5 {
            height: calc(
                (var(--tile-height, 100px) * 5) + (10px * 8) + (10px * 4) - 1px
            );
        }
        
        .button.height-6 {
            height: calc(
                (var(--tile-height, 100px) * 6) + (10px * 10) + (10px * 5) - 1px
            );
        }
        
        .button.size-2.no-padding {
            width: calc((var(--tile-width, 100px) * 2) + (10px * 4) + (10px * 1) - 1px);
        }
        
        .button.size-3.no-padding {
            width: calc((var(--tile-width, 100px) * 3) + (10px * 6) + (10px * 2) - 1px);
        }
        
        .button.size-4.no-padding {
            width: calc((var(--tile-width, 100px) * 4) + (10px * 8) + (10px * 3) - 1px);
        }
        
        .button.size-5.no-padding {
            width: calc(
                (var(--tile-width, 100px) * 5) + (10px * 10) + (10px * 4) - 1px
            );
        }
        
        .button.size-6.no-padding {
            width: calc(
                (var(--tile-width, 100px) * 6) + (10px * 12) + (10px * 5) - 1px
            );
        }
        
        .button.height-2.no-padding {
            height: calc(
                (var(--tile-width, 100px) * 2) + (10px * 4) + (10px * 1) - 1px
            );
        }
        
        .button.height-3.no-padding {
            height: calc(
                (var(--tile-width, 100px) * 3) + (10px * 6) + (10px * 2) - 1px
            );
        }
        
        .button.height-4.no-padding {
            height: calc(
                (var(--tile-width, 100px) * 4) + (10px * 8) + (10px * 3) - 1px
            );
        }
        
        .button.height-5.no-padding {
            height: calc(
                (var(--tile-width, 100px) * 5) + (10px * 10) + (10px * 4) - 1px
            );
        }
        
        .button.height-6.no-padding {
            height: calc(
                (var(--tile-width, 100px) * 6) + (10px * 12) + (10px * 5) - 1px
            );
        }
        
        .button input[type="range"] {
            pointer-events: none;
            outline: 0;
            border: 0;
            border-radius: 8px;
            width: var(--slider-width, 120px);
            margin: 0;
            transition: box-shadow 0.2s ease-in-out;
            overflow: hidden;
            height: var(--slider-height, 120px);
            -webkit-appearance: none;
            background-color: var(--tile-background);
            position: absolute;
            top: calc(50% - (var(--slider-height, 120px) / 2));
            right: calc(50% - (var(--slider-width, 120px) / 2));
        }
        
        .button input[type="range"]::-webkit-slider-runnable-track {
            height: var(--slider-height, 120px);
            -webkit-appearance: none;
            color: var(--tile-background);
            margin-top: -1px;
            transition: box-shadow 0.2s ease-in-out;
        }
        
        .button input[type="range"]::-webkit-slider-thumb {
            pointer-events: auto;
            width: 25px;
            border-right: 10px solid var(--tile-on-background);
            border-left: 10px solid var(--tile-on-background);
            border-top: 20px solid var(--tile-on-background);
            border-bottom: 20px solid var(--tile-on-background);
            -webkit-appearance: none;
            height: 80px;
            cursor: ew-resize;
            background: var(--tile-on-background);
            box-shadow: -350px 0 0 350px var(--tile-on-background),
                inset 0 0 0 80px var(--tile-background);
            border-radius: 0;
            transition: box-shadow 0.2s ease-in-out;
            position: relative;
            top: calc((var(--slider-height, 120px) - 80px) / 2);
        }
        
        .button.size-2 input[type="range"] {
            width: calc(var(--slider-width, 120px) * 2.26);
            right: calc(50% - ((var(--slider-width, 120px) * 2.26) / 2));
        }
        
        .button.height-2 input[type="range"] {
            height: calc(var(--slider-height, 120px) * 2.26);
            top: calc(50% - ((var(--slider-height, 120px) * 2.26) / 2));
        }
        
        .button.height-2 input[type="range"]::-webkit-slider-runnable-track {
            height: calc(var(--slider-height, 120px) * 2.26);
        }
        
        .button.height-2 input[type="range"]::-webkit-slider-thumb {
            top: calc(((var(--slider-height, 120px) * 2.26) - 80px) / 2);
        }
        
        .button.height-half input[type="range"] {
            height: calc(var(--slider-height, 120px) * 0.58333333333);
            top: calc(50% - ((var(--slider-height, 120px) * 0.58333333333) / 2));
        }
        
        .button.height-half input[type="range"]::-webkit-slider-runnable-track {
            height: calc(var(--slider-height, 120px) * 0.58333333333);
        }
        
        .button.height-half input[type="range"]::-webkit-slider-thumb {
            top: calc(((var(--slider-height, 120px) * 0.58333333333) - 80px) / 2);
        }
        
        :host:last-child .button {
            margin-right: 13px;
        }
        
        .button.on {
            background-color: var(--tile-on-background, rgba(255, 255, 255, 1));
        }
        
        .button .button-inner {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .button.event .button-inner {
            pointer-events: none;
        }
        
        .button.slider .button-inner {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            z-index: 1;
            display: flex;
            flex-direction: column;
            pointer-events: none;
            height: auto;
        }
        
        .button.height-half .button-inner {
            flex-direction: row;
            align-items: center;
        }
        
        .button.height-half .button-inner .name {
            margin-top: 0;
            margin-left: 10px;
        }
        
        .button.height-half .button-inner .icon ha-icon {
            display: block;
            line-height: 35px;
            height: 35px;
        }
        
        homekit-button.hide {
            display: none;
        }
        
        homekit-button .name {
            display: block;
            font-size: 14px;
            line-height: 14px;
            font-weight: 500;
            color: var(--tile-name-text-color, rgba(0, 0, 0, 0.4));
            width: 100%;
            margin-top: auto;
            margin-bottom: -5px;
            padding-bottom: 5px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            overflow: hidden;
            white-space: normal;
            pointer-events: none;
        }
        
        homekit-button .name.on {
            color: var(--tile-on-name-text-color, rgba(0, 0, 0, 1));
        }
        
        homekit-button .state {
            position: relative;
            font-size: 14px;
            color: var(--tile-state-text-color, rgba(0, 0, 0, 0.4));
            text-transform: capitalize;
            float: left;
            white-space: nowrap;
            pointer-events: none;
        }
        
        homekit-button .state .previous {
            position: relative;
            margin-left: 5px;
            font-size: 9px;
            color: var(--tile-state-changed-text-color, rgb(134, 134, 134));
            text-transform: lowercase;
            pointer-events: none;
        }
        
        homekit-button .value {
            visibility: hidden;
            pointer-events: none;
        }
        
        homekit-button .value.on {
            visibility: visible;
            position: relative;
            margin-left: 5px;
            font-size: 11px;
            color: var(--tile-value-text-color, rgba(255, 0, 0, 1));
            text-transform: lowercase;
        }
        
        .button .button-inner .circle-state {
            stroke-dasharray: calc((251.2 / 100) * var(--percentage)), 251.2;
            position: absolute;
            margin: 0;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            pointer-events: none;
        }
        
        homekit-button .state.on {
            color: var(--tile-on-state-text-color, rgba(0, 0, 0, 1));
        }
        
        homekit-button .state.unavailable {
            color: var(--tile-unavailable-state-text-color, rgba(255, 0, 0, 1));
        }
        
        homekit-button .icon {
            display: block;
            height: calc(var(--tile-icon-size, 30px) + 10px);
            width: calc(var(--tile-icon-size, 30px) + 10px);
            color: var(--tile-icon-color, rgba(0, 0, 0, 0.3));
            font-size: var(--tile-icon-size, 30px);
            --mdc-icon-size: var(--tile-icon-size, 30px);
            transform-origin: 50% 50%;
            line-height: calc(var(--tile-icon-size, 30px) + 10px);
            text-align: center;
            pointer-events: none;
        }
        
        homekit-button .icon.image img {
            width: 100%;
            border-radius: var(--tile-image-radius, 100%);
        }
        
        homekit-button .icon ha-icon {
            width: 30px;
            height: 30px;
            pointer-events: none;
        }
        
        homekit-button .icon.on {
            color: var(--tile-on-icon-color, #f7d959);
        }
        
        homekit-button .icon.climate {
            color: #fff;
            background-color: rgba(0, 255, 0, 1);
            font-size: 16px;
            font-weight: 400;
            text-align: center;
            line-height: 45px;
            padding: 0;
            border-radius: 100%;
            height: 45px;
            width: 45px;
        }
        
        homekit-button .icon.climate.temp.heat_cool {
            background-color: var(--auto-color);
        }
        
        homekit-button .icon.climate.temp.cool {
            background-color: var(--cool-color);
        }
        
        homekit-button .icon.climate.temp.heat {
            background-color: var(--heat-color);
        }
        
        homekit-button .icon.climate.temp.manual {
            background-color: var(--manual-color);
        }
        
        homekit-button .icon.climate.temp.off {
            background-color: var(--off-color);
        }
        
        homekit-button .icon.climate.temp.fan_only {
            background-color: var(--fan_only-color);
        }
        
        homekit-button .icon.climate.temp.eco {
            background-color: var(--eco-color);
        }
        
        homekit-button .icon.climate.temp.dry {
            background-color: var(--dry-color);
        }
        
        homekit-button .icon.climate.temp.idle {
            background-color: var(--idle-color);
        }
        
        homekit-button .icon.climate.temp.unknown-mode {
            background-color: var(--unknown-color);
        }
        
        homekit-button .circle {
            position: absolute;
            top: 17px;
            left: 10px;
            height: 35px;
            width: 35px;
            background-color: rgba(0, 255, 0, 1);
            border-radius: 20px;
            pointer-events: none;
        }
        
        homekit-button .temp {
            position: absolute;
            top: 26px;
            left: 19px;
            font-family: Arial;
            font-size: 14px;
            font-weight: bold;
            color: white;
            pointer-events: none;
        }
        
        .not-found {
            cursor: pointer;
            display: inline-block;
            width: 110px;
            height: 110px;
            padding: 5px;
            background-color: rgba(255, 0, 0, 0.8);
            border-radius: 12px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
            margin: 3px;
            position: relative;
            overflow: hidden;
            font-weight: 300;
            touch-action: auto !important;
        }
        
        .break {
            display: none;
        }
        
        @media only screen and (max-width: 768px) {
            .button {
                width: var(--tile-width-mobile, 90px);
                height: var(--tile-height-mobile, 90px);
            }
        
            .button.height-half {
                height: calc((var(--tile-height-mobile, 90px) * 0.5) - 13px);
            }
        
            .button.no-padding {
                width: calc(var(--tile-width-mobile, 90px) * 1.22);
                height: calc(var(--tile-height-mobile, 90px) * 1.22);
            }
        
            .button.no-padding.height-half {
                height: calc((var(--tile-height-mobile, 90px) * 0.5) - 3px + 10px);
            }
        
            .button.size-2 {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 2) + (10px * 2) + (10px * 1) - 1px
                );
            }
        
            .button.size-3 {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 4) + (10px * 2) - 1px
                );
            }
        
            .button.size-4 {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 4) + (10px * 2) - 1px
                );
            }
        
            .button.size-5 {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 4) + (10px * 2) - 1px
                );
            }
        
            .button.size-6 {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 4) + (10px * 2) - 1px
                );
            }
        
            .button.height-2 {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 2) + (10px * 2) + (10px * 1) -
                        1px
                );
            }
        
            .button.height-3 {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 3) + (10px * 4) + (10px * 2) -
                        1px
                );
            }
        
            .button.height-4 {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 4) + (10px * 6) + (10px * 3) -
                        1px
                );
            }
        
            .button.height-5 {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 5) + (10px * 8) + (10px * 4) -
                        1px
                );
            }
        
            .button.height-6 {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 6) + (10px * 10) + (10px * 5) -
                        1px
                );
            }
        
            .button.size-2.no-padding {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 2) + (10px * 4) + (10px * 1) - 1px
                );
            }
        
            .button.size-3.no-padding {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 6) + (10px * 2) - 1px
                );
            }
        
            .button.size-4.no-padding {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 6) + (10px * 2) - 1px
                );
            }
        
            .button.size-5.no-padding {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 6) + (10px * 2) - 1px
                );
            }
        
            .button.size-6.no-padding {
                width: calc(
                    (var(--tile-width-mobile, 90px) * 3) + (10px * 6) + (10px * 2) - 1px
                );
            }
        
            .button.height-2.no-padding {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 2) + (10px * 4) + (10px * 1) -
                        1px
                );
            }
        
            .button.height-3.no-padding {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 3) + (10px * 6) + (10px * 2) -
                        1px
                );
            }
        
            .button.height-4.no-padding {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 4) + (10px * 8) + (10px * 3) -
                        1px
                );
            }
        
            .button.height-5.no-padding {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 5) + (10px * 10) + (10px * 4) -
                        1px
                );
            }
        
            .button.height-6.no-padding {
                height: calc(
                    (var(--tile-height-mobile, 90px) * 6) + (10px * 12) + (10px * 5) -
                        1px
                );
            }
        
            .container {
                padding-left: 0;
            }
        
            .header h1 {
                margin-left: 0;
            }
        
            .header ul {
                margin: 0 0 30px 0;
            }
        
            .header,
            .homekit-card {
                width: 358px;
                text-align: left;
                padding: 0;
                margin: 0 auto;
            }
        
            .card-title {
                width: 358px;
                text-align: left;
                padding-bottom: 0;
                margin: 0 auto;
            }
        
            homekit-button .name {
                font-size: 13px;
                line-height: 13px;
            }
        
            homekit-button .state {
                font-size: 13px;
            }
        
            homekit-button .value.on {
                font-size: 10px;
            }
        
            .row {
                padding: 0;
                flex-direction: column;
            }
        
            .row .col,
            .row .col.fixed {
                width: auto;
                min-width: auto;
                padding: 0;
            }
        }
        
        .spin {
            animation-name: spin;
            animation-duration: 1000ms;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
        
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        
        .longpress.animate {
            animation-fill-mode: forwards;
            -webkit-animation: 0.5s longpress forwards;
            animation: 0.5s longpress forwards;
        }
        
        @-webkit-keyframes longpress {
            0%,
            20% {
                transform: scale(1);
            }
            100% {
                transform: scale(1.2);
            }
        }
        
        @keyframes longpress {
            0%,
            20% {
                transform: scale(1);
            }
            100% {
                transform: scale(1.2);
            }
        }
        `;
    }
}
customElements.define("homekit-card", HomeKitCard);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZWtpdC1wYW5lbC1jYXJkLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvZmVjaGEvbGliL2ZlY2hhLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2N1c3RvbS1jYXJkLWhlbHBlcnMvZGlzdC9pbmRleC5tLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BjdHJsL3Rpbnljb2xvci9kaXN0L2VzL3V0aWwuanMiLCIuLi9ub2RlX21vZHVsZXMvQGN0cmwvdGlueWNvbG9yL2Rpc3QvZXMvY29udmVyc2lvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9AY3RybC90aW55Y29sb3IvZGlzdC9lcy9jc3MtY29sb3ItbmFtZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvQGN0cmwvdGlueWNvbG9yL2Rpc3QvZXMvZm9ybWF0LWlucHV0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BjdHJsL3Rpbnljb2xvci9kaXN0L2VzL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhcmQtdG9vbHMvc3JjL2xpdC1lbGVtZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhcmQtdG9vbHMvc3JjL2hhc3MuanMiLCIuLi9ub2RlX21vZHVsZXMvY2FyZC10b29scy9zcmMvZXZlbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvY2FyZC10b29scy9zcmMvaGVscGVycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jYXJkLXRvb2xzL3NyYy9tb3JlLWluZm8uanMiLCIuLi9ub2RlX21vZHVsZXMvY2FyZC10b29scy9zcmMvZGV2aWNlSUQuanMiLCIuLi9ub2RlX21vZHVsZXMvY2FyZC10b29scy9zcmMvdGVtcGxhdGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NhcmQtdG9vbHMvc3JjL2xvdmVsYWNlLWVsZW1lbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvaGFtbWVyanMvaGFtbWVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2V2LWVtaXR0ZXIvZXYtZW1pdHRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9nZXQtc2l6ZS9nZXQtc2l6ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9kZXNhbmRyby1tYXRjaGVzLXNlbGVjdG9yL21hdGNoZXMtc2VsZWN0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvZml6enktdWktdXRpbHMvdXRpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvb3V0bGF5ZXIvaXRlbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9vdXRsYXllci9vdXRsYXllci5qcyIsIi4uL25vZGVfbW9kdWxlcy9tYXNvbnJ5LWxheW91dC9tYXNvbnJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciB0b2tlbiA9IC9kezEsNH18TXsxLDR9fFlZKD86WVkpP3xTezEsM318RG98Wlp8WnwoW0hoTXNEbV0pXFwxP3xbYUFdfFwiW15cIl0qXCJ8J1teJ10qJy9nO1xudmFyIHR3b0RpZ2l0c09wdGlvbmFsID0gXCJbMS05XVxcXFxkP1wiO1xudmFyIHR3b0RpZ2l0cyA9IFwiXFxcXGRcXFxcZFwiO1xudmFyIHRocmVlRGlnaXRzID0gXCJcXFxcZHszfVwiO1xudmFyIGZvdXJEaWdpdHMgPSBcIlxcXFxkezR9XCI7XG52YXIgd29yZCA9IFwiW15cXFxcc10rXCI7XG52YXIgbGl0ZXJhbCA9IC9cXFsoW15dKj8pXFxdL2dtO1xuZnVuY3Rpb24gc2hvcnRlbihhcnIsIHNMZW4pIHtcbiAgICB2YXIgbmV3QXJyID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBuZXdBcnIucHVzaChhcnJbaV0uc3Vic3RyKDAsIHNMZW4pKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0Fycjtcbn1cbnZhciBtb250aFVwZGF0ZSA9IGZ1bmN0aW9uIChhcnJOYW1lKSB7IHJldHVybiBmdW5jdGlvbiAodiwgaTE4bikge1xuICAgIHZhciBsb3dlckNhc2VBcnIgPSBpMThuW2Fyck5hbWVdLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gdi50b0xvd2VyQ2FzZSgpOyB9KTtcbiAgICB2YXIgaW5kZXggPSBsb3dlckNhc2VBcnIuaW5kZXhPZih2LnRvTG93ZXJDYXNlKCkpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59OyB9O1xuZnVuY3Rpb24gYXNzaWduKG9yaWdPYmopIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIGZvciAodmFyIF9hID0gMCwgYXJnc18xID0gYXJnczsgX2EgPCBhcmdzXzEubGVuZ3RoOyBfYSsrKSB7XG4gICAgICAgIHZhciBvYmogPSBhcmdzXzFbX2FdO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlIGV4XG4gICAgICAgICAgICBvcmlnT2JqW2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3JpZ09iajtcbn1cbnZhciBkYXlOYW1lcyA9IFtcbiAgICBcIlN1bmRheVwiLFxuICAgIFwiTW9uZGF5XCIsXG4gICAgXCJUdWVzZGF5XCIsXG4gICAgXCJXZWRuZXNkYXlcIixcbiAgICBcIlRodXJzZGF5XCIsXG4gICAgXCJGcmlkYXlcIixcbiAgICBcIlNhdHVyZGF5XCJcbl07XG52YXIgbW9udGhOYW1lcyA9IFtcbiAgICBcIkphbnVhcnlcIixcbiAgICBcIkZlYnJ1YXJ5XCIsXG4gICAgXCJNYXJjaFwiLFxuICAgIFwiQXByaWxcIixcbiAgICBcIk1heVwiLFxuICAgIFwiSnVuZVwiLFxuICAgIFwiSnVseVwiLFxuICAgIFwiQXVndXN0XCIsXG4gICAgXCJTZXB0ZW1iZXJcIixcbiAgICBcIk9jdG9iZXJcIixcbiAgICBcIk5vdmVtYmVyXCIsXG4gICAgXCJEZWNlbWJlclwiXG5dO1xudmFyIG1vbnRoTmFtZXNTaG9ydCA9IHNob3J0ZW4obW9udGhOYW1lcywgMyk7XG52YXIgZGF5TmFtZXNTaG9ydCA9IHNob3J0ZW4oZGF5TmFtZXMsIDMpO1xudmFyIGRlZmF1bHRJMThuID0ge1xuICAgIGRheU5hbWVzU2hvcnQ6IGRheU5hbWVzU2hvcnQsXG4gICAgZGF5TmFtZXM6IGRheU5hbWVzLFxuICAgIG1vbnRoTmFtZXNTaG9ydDogbW9udGhOYW1lc1Nob3J0LFxuICAgIG1vbnRoTmFtZXM6IG1vbnRoTmFtZXMsXG4gICAgYW1QbTogW1wiYW1cIiwgXCJwbVwiXSxcbiAgICBEb0ZuOiBmdW5jdGlvbiAoZGF5T2ZNb250aCkge1xuICAgICAgICByZXR1cm4gKGRheU9mTW9udGggK1xuICAgICAgICAgICAgW1widGhcIiwgXCJzdFwiLCBcIm5kXCIsIFwicmRcIl1bZGF5T2ZNb250aCAlIDEwID4gM1xuICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgIDogKChkYXlPZk1vbnRoIC0gKGRheU9mTW9udGggJSAxMCkgIT09IDEwID8gMSA6IDApICogZGF5T2ZNb250aCkgJSAxMF0pO1xuICAgIH1cbn07XG52YXIgZ2xvYmFsSTE4biA9IGFzc2lnbih7fSwgZGVmYXVsdEkxOG4pO1xudmFyIHNldEdsb2JhbERhdGVJMThuID0gZnVuY3Rpb24gKGkxOG4pIHtcbiAgICByZXR1cm4gKGdsb2JhbEkxOG4gPSBhc3NpZ24oZ2xvYmFsSTE4biwgaTE4bikpO1xufTtcbnZhciByZWdleEVzY2FwZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1t8XFxcXHsoKVteJCsqPy4tXS9nLCBcIlxcXFwkJlwiKTtcbn07XG52YXIgcGFkID0gZnVuY3Rpb24gKHZhbCwgbGVuKSB7XG4gICAgaWYgKGxlbiA9PT0gdm9pZCAwKSB7IGxlbiA9IDI7IH1cbiAgICB2YWwgPSBTdHJpbmcodmFsKTtcbiAgICB3aGlsZSAodmFsLmxlbmd0aCA8IGxlbikge1xuICAgICAgICB2YWwgPSBcIjBcIiArIHZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn07XG52YXIgZm9ybWF0RmxhZ3MgPSB7XG4gICAgRDogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIFN0cmluZyhkYXRlT2JqLmdldERhdGUoKSk7IH0sXG4gICAgREQ6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBwYWQoZGF0ZU9iai5nZXREYXRlKCkpOyB9LFxuICAgIERvOiBmdW5jdGlvbiAoZGF0ZU9iaiwgaTE4bikge1xuICAgICAgICByZXR1cm4gaTE4bi5Eb0ZuKGRhdGVPYmouZ2V0RGF0ZSgpKTtcbiAgICB9LFxuICAgIGQ6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBTdHJpbmcoZGF0ZU9iai5nZXREYXkoKSk7IH0sXG4gICAgZGQ6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBwYWQoZGF0ZU9iai5nZXREYXkoKSk7IH0sXG4gICAgZGRkOiBmdW5jdGlvbiAoZGF0ZU9iaiwgaTE4bikge1xuICAgICAgICByZXR1cm4gaTE4bi5kYXlOYW1lc1Nob3J0W2RhdGVPYmouZ2V0RGF5KCldO1xuICAgIH0sXG4gICAgZGRkZDogZnVuY3Rpb24gKGRhdGVPYmosIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIGkxOG4uZGF5TmFtZXNbZGF0ZU9iai5nZXREYXkoKV07XG4gICAgfSxcbiAgICBNOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gU3RyaW5nKGRhdGVPYmouZ2V0TW9udGgoKSArIDEpOyB9LFxuICAgIE1NOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gcGFkKGRhdGVPYmouZ2V0TW9udGgoKSArIDEpOyB9LFxuICAgIE1NTTogZnVuY3Rpb24gKGRhdGVPYmosIGkxOG4pIHtcbiAgICAgICAgcmV0dXJuIGkxOG4ubW9udGhOYW1lc1Nob3J0W2RhdGVPYmouZ2V0TW9udGgoKV07XG4gICAgfSxcbiAgICBNTU1NOiBmdW5jdGlvbiAoZGF0ZU9iaiwgaTE4bikge1xuICAgICAgICByZXR1cm4gaTE4bi5tb250aE5hbWVzW2RhdGVPYmouZ2V0TW9udGgoKV07XG4gICAgfSxcbiAgICBZWTogZnVuY3Rpb24gKGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIHBhZChTdHJpbmcoZGF0ZU9iai5nZXRGdWxsWWVhcigpKSwgNCkuc3Vic3RyKDIpO1xuICAgIH0sXG4gICAgWVlZWTogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIHBhZChkYXRlT2JqLmdldEZ1bGxZZWFyKCksIDQpOyB9LFxuICAgIGg6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBTdHJpbmcoZGF0ZU9iai5nZXRIb3VycygpICUgMTIgfHwgMTIpOyB9LFxuICAgIGhoOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gcGFkKGRhdGVPYmouZ2V0SG91cnMoKSAlIDEyIHx8IDEyKTsgfSxcbiAgICBIOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gU3RyaW5nKGRhdGVPYmouZ2V0SG91cnMoKSk7IH0sXG4gICAgSEg6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBwYWQoZGF0ZU9iai5nZXRIb3VycygpKTsgfSxcbiAgICBtOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gU3RyaW5nKGRhdGVPYmouZ2V0TWludXRlcygpKTsgfSxcbiAgICBtbTogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIHBhZChkYXRlT2JqLmdldE1pbnV0ZXMoKSk7IH0sXG4gICAgczogZnVuY3Rpb24gKGRhdGVPYmopIHsgcmV0dXJuIFN0cmluZyhkYXRlT2JqLmdldFNlY29uZHMoKSk7IH0sXG4gICAgc3M6IGZ1bmN0aW9uIChkYXRlT2JqKSB7IHJldHVybiBwYWQoZGF0ZU9iai5nZXRTZWNvbmRzKCkpOyB9LFxuICAgIFM6IGZ1bmN0aW9uIChkYXRlT2JqKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoTWF0aC5yb3VuZChkYXRlT2JqLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwKSk7XG4gICAgfSxcbiAgICBTUzogZnVuY3Rpb24gKGRhdGVPYmopIHtcbiAgICAgICAgcmV0dXJuIHBhZChNYXRoLnJvdW5kKGRhdGVPYmouZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMCksIDIpO1xuICAgIH0sXG4gICAgU1NTOiBmdW5jdGlvbiAoZGF0ZU9iaikgeyByZXR1cm4gcGFkKGRhdGVPYmouZ2V0TWlsbGlzZWNvbmRzKCksIDMpOyB9LFxuICAgIGE6IGZ1bmN0aW9uIChkYXRlT2JqLCBpMThuKSB7XG4gICAgICAgIHJldHVybiBkYXRlT2JqLmdldEhvdXJzKCkgPCAxMiA/IGkxOG4uYW1QbVswXSA6IGkxOG4uYW1QbVsxXTtcbiAgICB9LFxuICAgIEE6IGZ1bmN0aW9uIChkYXRlT2JqLCBpMThuKSB7XG4gICAgICAgIHJldHVybiBkYXRlT2JqLmdldEhvdXJzKCkgPCAxMlxuICAgICAgICAgICAgPyBpMThuLmFtUG1bMF0udG9VcHBlckNhc2UoKVxuICAgICAgICAgICAgOiBpMThuLmFtUG1bMV0udG9VcHBlckNhc2UoKTtcbiAgICB9LFxuICAgIFpaOiBmdW5jdGlvbiAoZGF0ZU9iaikge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gZGF0ZU9iai5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgICAgICByZXR1cm4gKChvZmZzZXQgPiAwID8gXCItXCIgOiBcIitcIikgK1xuICAgICAgICAgICAgcGFkKE1hdGguZmxvb3IoTWF0aC5hYnMob2Zmc2V0KSAvIDYwKSAqIDEwMCArIChNYXRoLmFicyhvZmZzZXQpICUgNjApLCA0KSk7XG4gICAgfSxcbiAgICBaOiBmdW5jdGlvbiAoZGF0ZU9iaikge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gZGF0ZU9iai5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgICAgICByZXR1cm4gKChvZmZzZXQgPiAwID8gXCItXCIgOiBcIitcIikgK1xuICAgICAgICAgICAgcGFkKE1hdGguZmxvb3IoTWF0aC5hYnMob2Zmc2V0KSAvIDYwKSwgMikgK1xuICAgICAgICAgICAgXCI6XCIgK1xuICAgICAgICAgICAgcGFkKE1hdGguYWJzKG9mZnNldCkgJSA2MCwgMikpO1xuICAgIH1cbn07XG52YXIgbW9udGhQYXJzZSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiArdiAtIDE7IH07XG52YXIgZW1wdHlEaWdpdHMgPSBbbnVsbCwgdHdvRGlnaXRzT3B0aW9uYWxdO1xudmFyIGVtcHR5V29yZCA9IFtudWxsLCB3b3JkXTtcbnZhciBhbVBtID0gW1xuICAgIFwiaXNQbVwiLFxuICAgIHdvcmQsXG4gICAgZnVuY3Rpb24gKHYsIGkxOG4pIHtcbiAgICAgICAgdmFyIHZhbCA9IHYudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHZhbCA9PT0gaTE4bi5hbVBtWzBdKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWwgPT09IGkxOG4uYW1QbVsxXSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXTtcbnZhciB0aW1lem9uZU9mZnNldCA9IFtcbiAgICBcInRpbWV6b25lT2Zmc2V0XCIsXG4gICAgXCJbXlxcXFxzXSo/W1xcXFwrXFxcXC1dXFxcXGRcXFxcZDo/XFxcXGRcXFxcZHxbXlxcXFxzXSo/Wj9cIixcbiAgICBmdW5jdGlvbiAodikge1xuICAgICAgICB2YXIgcGFydHMgPSAodiArIFwiXCIpLm1hdGNoKC8oWystXXxcXGRcXGQpL2dpKTtcbiAgICAgICAgaWYgKHBhcnRzKSB7XG4gICAgICAgICAgICB2YXIgbWludXRlcyA9ICtwYXJ0c1sxXSAqIDYwICsgcGFyc2VJbnQocGFydHNbMl0sIDEwKTtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0c1swXSA9PT0gXCIrXCIgPyBtaW51dGVzIDogLW1pbnV0ZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXTtcbnZhciBwYXJzZUZsYWdzID0ge1xuICAgIEQ6IFtcImRheVwiLCB0d29EaWdpdHNPcHRpb25hbF0sXG4gICAgREQ6IFtcImRheVwiLCB0d29EaWdpdHNdLFxuICAgIERvOiBbXCJkYXlcIiwgdHdvRGlnaXRzT3B0aW9uYWwgKyB3b3JkLCBmdW5jdGlvbiAodikgeyByZXR1cm4gcGFyc2VJbnQodiwgMTApOyB9XSxcbiAgICBNOiBbXCJtb250aFwiLCB0d29EaWdpdHNPcHRpb25hbCwgbW9udGhQYXJzZV0sXG4gICAgTU06IFtcIm1vbnRoXCIsIHR3b0RpZ2l0cywgbW9udGhQYXJzZV0sXG4gICAgWVk6IFtcbiAgICAgICAgXCJ5ZWFyXCIsXG4gICAgICAgIHR3b0RpZ2l0cyxcbiAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgdmFyIGNlbnQgPSArKFwiXCIgKyBub3cuZ2V0RnVsbFllYXIoKSkuc3Vic3RyKDAsIDIpO1xuICAgICAgICAgICAgcmV0dXJuICsoXCJcIiArICgrdiA+IDY4ID8gY2VudCAtIDEgOiBjZW50KSArIHYpO1xuICAgICAgICB9XG4gICAgXSxcbiAgICBoOiBbXCJob3VyXCIsIHR3b0RpZ2l0c09wdGlvbmFsLCB1bmRlZmluZWQsIFwiaXNQbVwiXSxcbiAgICBoaDogW1wiaG91clwiLCB0d29EaWdpdHMsIHVuZGVmaW5lZCwgXCJpc1BtXCJdLFxuICAgIEg6IFtcImhvdXJcIiwgdHdvRGlnaXRzT3B0aW9uYWxdLFxuICAgIEhIOiBbXCJob3VyXCIsIHR3b0RpZ2l0c10sXG4gICAgbTogW1wibWludXRlXCIsIHR3b0RpZ2l0c09wdGlvbmFsXSxcbiAgICBtbTogW1wibWludXRlXCIsIHR3b0RpZ2l0c10sXG4gICAgczogW1wic2Vjb25kXCIsIHR3b0RpZ2l0c09wdGlvbmFsXSxcbiAgICBzczogW1wic2Vjb25kXCIsIHR3b0RpZ2l0c10sXG4gICAgWVlZWTogW1wieWVhclwiLCBmb3VyRGlnaXRzXSxcbiAgICBTOiBbXCJtaWxsaXNlY29uZFwiLCBcIlxcXFxkXCIsIGZ1bmN0aW9uICh2KSB7IHJldHVybiArdiAqIDEwMDsgfV0sXG4gICAgU1M6IFtcIm1pbGxpc2Vjb25kXCIsIHR3b0RpZ2l0cywgZnVuY3Rpb24gKHYpIHsgcmV0dXJuICt2ICogMTA7IH1dLFxuICAgIFNTUzogW1wibWlsbGlzZWNvbmRcIiwgdGhyZWVEaWdpdHNdLFxuICAgIGQ6IGVtcHR5RGlnaXRzLFxuICAgIGRkOiBlbXB0eURpZ2l0cyxcbiAgICBkZGQ6IGVtcHR5V29yZCxcbiAgICBkZGRkOiBlbXB0eVdvcmQsXG4gICAgTU1NOiBbXCJtb250aFwiLCB3b3JkLCBtb250aFVwZGF0ZShcIm1vbnRoTmFtZXNTaG9ydFwiKV0sXG4gICAgTU1NTTogW1wibW9udGhcIiwgd29yZCwgbW9udGhVcGRhdGUoXCJtb250aE5hbWVzXCIpXSxcbiAgICBhOiBhbVBtLFxuICAgIEE6IGFtUG0sXG4gICAgWlo6IHRpbWV6b25lT2Zmc2V0LFxuICAgIFo6IHRpbWV6b25lT2Zmc2V0XG59O1xuLy8gU29tZSBjb21tb24gZm9ybWF0IHN0cmluZ3NcbnZhciBnbG9iYWxNYXNrcyA9IHtcbiAgICBkZWZhdWx0OiBcImRkZCBNTU0gREQgWVlZWSBISDptbTpzc1wiLFxuICAgIHNob3J0RGF0ZTogXCJNL0QvWVlcIixcbiAgICBtZWRpdW1EYXRlOiBcIk1NTSBELCBZWVlZXCIsXG4gICAgbG9uZ0RhdGU6IFwiTU1NTSBELCBZWVlZXCIsXG4gICAgZnVsbERhdGU6IFwiZGRkZCwgTU1NTSBELCBZWVlZXCIsXG4gICAgaXNvRGF0ZTogXCJZWVlZLU1NLUREXCIsXG4gICAgaXNvRGF0ZVRpbWU6IFwiWVlZWS1NTS1ERFRISDptbTpzc1pcIixcbiAgICBzaG9ydFRpbWU6IFwiSEg6bW1cIixcbiAgICBtZWRpdW1UaW1lOiBcIkhIOm1tOnNzXCIsXG4gICAgbG9uZ1RpbWU6IFwiSEg6bW06c3MuU1NTXCJcbn07XG52YXIgc2V0R2xvYmFsRGF0ZU1hc2tzID0gZnVuY3Rpb24gKG1hc2tzKSB7IHJldHVybiBhc3NpZ24oZ2xvYmFsTWFza3MsIG1hc2tzKTsgfTtcbi8qKipcbiAqIEZvcm1hdCBhIGRhdGVcbiAqIEBtZXRob2QgZm9ybWF0XG4gKiBAcGFyYW0ge0RhdGV8bnVtYmVyfSBkYXRlT2JqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWFzayBGb3JtYXQgb2YgdGhlIGRhdGUsIGkuZS4gJ21tLWRkLXl5JyBvciAnc2hvcnREYXRlJ1xuICogQHJldHVybnMge3N0cmluZ30gRm9ybWF0dGVkIGRhdGUgc3RyaW5nXG4gKi9cbnZhciBmb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZU9iaiwgbWFzaywgaTE4bikge1xuICAgIGlmIChtYXNrID09PSB2b2lkIDApIHsgbWFzayA9IGdsb2JhbE1hc2tzW1wiZGVmYXVsdFwiXTsgfVxuICAgIGlmIChpMThuID09PSB2b2lkIDApIHsgaTE4biA9IHt9OyB9XG4gICAgaWYgKHR5cGVvZiBkYXRlT2JqID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGRhdGVPYmogPSBuZXcgRGF0ZShkYXRlT2JqKTtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRlT2JqKSAhPT0gXCJbb2JqZWN0IERhdGVdXCIgfHxcbiAgICAgICAgaXNOYU4oZGF0ZU9iai5nZXRUaW1lKCkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgRGF0ZSBwYXNzIHRvIGZvcm1hdFwiKTtcbiAgICB9XG4gICAgbWFzayA9IGdsb2JhbE1hc2tzW21hc2tdIHx8IG1hc2s7XG4gICAgdmFyIGxpdGVyYWxzID0gW107XG4gICAgLy8gTWFrZSBsaXRlcmFscyBpbmFjdGl2ZSBieSByZXBsYWNpbmcgdGhlbSB3aXRoIEBAQFxuICAgIG1hc2sgPSBtYXNrLnJlcGxhY2UobGl0ZXJhbCwgZnVuY3Rpb24gKCQwLCAkMSkge1xuICAgICAgICBsaXRlcmFscy5wdXNoKCQxKTtcbiAgICAgICAgcmV0dXJuIFwiQEBAXCI7XG4gICAgfSk7XG4gICAgdmFyIGNvbWJpbmVkSTE4blNldHRpbmdzID0gYXNzaWduKGFzc2lnbih7fSwgZ2xvYmFsSTE4biksIGkxOG4pO1xuICAgIC8vIEFwcGx5IGZvcm1hdHRpbmcgcnVsZXNcbiAgICBtYXNrID0gbWFzay5yZXBsYWNlKHRva2VuLCBmdW5jdGlvbiAoJDApIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdEZsYWdzWyQwXShkYXRlT2JqLCBjb21iaW5lZEkxOG5TZXR0aW5ncyk7XG4gICAgfSk7XG4gICAgLy8gSW5saW5lIGxpdGVyYWwgdmFsdWVzIGJhY2sgaW50byB0aGUgZm9ybWF0dGVkIHZhbHVlXG4gICAgcmV0dXJuIG1hc2sucmVwbGFjZSgvQEBAL2csIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGxpdGVyYWxzLnNoaWZ0KCk7IH0pO1xufTtcbi8qKlxuICogUGFyc2UgYSBkYXRlIHN0cmluZyBpbnRvIGEgSmF2YXNjcmlwdCBEYXRlIG9iamVjdCAvXG4gKiBAbWV0aG9kIHBhcnNlXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVN0ciBEYXRlIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IGZvcm1hdCBEYXRlIHBhcnNlIGZvcm1hdFxuICogQHBhcmFtIHtpMThufSBJMThuU2V0dGluZ3NPcHRpb25hbCBGdWxsIG9yIHN1YnNldCBvZiBJMThOIHNldHRpbmdzXG4gKiBAcmV0dXJucyB7RGF0ZXxudWxsfSBSZXR1cm5zIERhdGUgb2JqZWN0LiBSZXR1cm5zIG51bGwgd2hhdCBkYXRlIHN0cmluZyBpcyBpbnZhbGlkIG9yIGRvZXNuJ3QgbWF0Y2ggZm9ybWF0XG4gKi9cbmZ1bmN0aW9uIHBhcnNlKGRhdGVTdHIsIGZvcm1hdCwgaTE4bikge1xuICAgIGlmIChpMThuID09PSB2b2lkIDApIHsgaTE4biA9IHt9OyB9XG4gICAgaWYgKHR5cGVvZiBmb3JtYXQgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBmb3JtYXQgaW4gZmVjaGEgcGFyc2VcIik7XG4gICAgfVxuICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZm9ybWF0IGlzIGFjdHVhbGx5IGEgbWFza1xuICAgIGZvcm1hdCA9IGdsb2JhbE1hc2tzW2Zvcm1hdF0gfHwgZm9ybWF0O1xuICAgIC8vIEF2b2lkIHJlZ3VsYXIgZXhwcmVzc2lvbiBkZW5pYWwgb2Ygc2VydmljZSwgZmFpbCBlYXJseSBmb3IgcmVhbGx5IGxvbmcgc3RyaW5nc1xuICAgIC8vIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvUmVndWxhcl9leHByZXNzaW9uX0RlbmlhbF9vZl9TZXJ2aWNlXy1fUmVEb1NcbiAgICBpZiAoZGF0ZVN0ci5sZW5ndGggPiAxMDAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBEZWZhdWx0IHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHllYXIuXG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICB2YXIgZGF0ZUluZm8gPSB7XG4gICAgICAgIHllYXI6IHRvZGF5LmdldEZ1bGxZZWFyKCksXG4gICAgICAgIG1vbnRoOiAwLFxuICAgICAgICBkYXk6IDEsXG4gICAgICAgIGhvdXI6IDAsXG4gICAgICAgIG1pbnV0ZTogMCxcbiAgICAgICAgc2Vjb25kOiAwLFxuICAgICAgICBtaWxsaXNlY29uZDogMCxcbiAgICAgICAgaXNQbTogbnVsbCxcbiAgICAgICAgdGltZXpvbmVPZmZzZXQ6IG51bGxcbiAgICB9O1xuICAgIHZhciBwYXJzZUluZm8gPSBbXTtcbiAgICB2YXIgbGl0ZXJhbHMgPSBbXTtcbiAgICAvLyBSZXBsYWNlIGFsbCB0aGUgbGl0ZXJhbHMgd2l0aCBAQEAuIEhvcGVmdWxseSBhIHN0cmluZyB0aGF0IHdvbid0IGV4aXN0IGluIHRoZSBmb3JtYXRcbiAgICB2YXIgbmV3Rm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobGl0ZXJhbCwgZnVuY3Rpb24gKCQwLCAkMSkge1xuICAgICAgICBsaXRlcmFscy5wdXNoKHJlZ2V4RXNjYXBlKCQxKSk7XG4gICAgICAgIHJldHVybiBcIkBAQFwiO1xuICAgIH0pO1xuICAgIHZhciBzcGVjaWZpZWRGaWVsZHMgPSB7fTtcbiAgICB2YXIgcmVxdWlyZWRGaWVsZHMgPSB7fTtcbiAgICAvLyBDaGFuZ2UgZXZlcnkgdG9rZW4gdGhhdCB3ZSBmaW5kIGludG8gdGhlIGNvcnJlY3QgcmVnZXhcbiAgICBuZXdGb3JtYXQgPSByZWdleEVzY2FwZShuZXdGb3JtYXQpLnJlcGxhY2UodG9rZW4sIGZ1bmN0aW9uICgkMCkge1xuICAgICAgICB2YXIgaW5mbyA9IHBhcnNlRmxhZ3NbJDBdO1xuICAgICAgICB2YXIgZmllbGQgPSBpbmZvWzBdLCByZWdleCA9IGluZm9bMV0sIHJlcXVpcmVkRmllbGQgPSBpbmZvWzNdO1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGVyc29uIGhhcyBzcGVjaWZpZWQgdGhlIHNhbWUgZmllbGQgdHdpY2UuIFRoaXMgd2lsbCBsZWFkIHRvIGNvbmZ1c2luZyByZXN1bHRzLlxuICAgICAgICBpZiAoc3BlY2lmaWVkRmllbGRzW2ZpZWxkXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBmb3JtYXQuIFwiICsgZmllbGQgKyBcIiBzcGVjaWZpZWQgdHdpY2UgaW4gZm9ybWF0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHNwZWNpZmllZEZpZWxkc1tmaWVsZF0gPSB0cnVlO1xuICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgYW55IHJlcXVpcmVkIGZpZWxkcy4gRm9yIGluc3RhbmNlLCAxMiBob3VyIHRpbWUgcmVxdWlyZXMgQU0vUE0gc3BlY2lmaWVkXG4gICAgICAgIGlmIChyZXF1aXJlZEZpZWxkKSB7XG4gICAgICAgICAgICByZXF1aXJlZEZpZWxkc1tyZXF1aXJlZEZpZWxkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGFyc2VJbmZvLnB1c2goaW5mbyk7XG4gICAgICAgIHJldHVybiBcIihcIiArIHJlZ2V4ICsgXCIpXCI7XG4gICAgfSk7XG4gICAgLy8gQ2hlY2sgYWxsIHRoZSByZXF1aXJlZCBmaWVsZHMgYXJlIHByZXNlbnRcbiAgICBPYmplY3Qua2V5cyhyZXF1aXJlZEZpZWxkcykuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcbiAgICAgICAgaWYgKCFzcGVjaWZpZWRGaWVsZHNbZmllbGRdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGZvcm1hdC4gXCIgKyBmaWVsZCArIFwiIGlzIHJlcXVpcmVkIGluIHNwZWNpZmllZCBmb3JtYXRcIik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBBZGQgYmFjayBhbGwgdGhlIGxpdGVyYWxzIGFmdGVyXG4gICAgbmV3Rm9ybWF0ID0gbmV3Rm9ybWF0LnJlcGxhY2UoL0BAQC9nLCBmdW5jdGlvbiAoKSB7IHJldHVybiBsaXRlcmFscy5zaGlmdCgpOyB9KTtcbiAgICAvLyBDaGVjayBpZiB0aGUgZGF0ZSBzdHJpbmcgbWF0Y2hlcyB0aGUgZm9ybWF0LiBJZiBpdCBkb2Vzbid0IHJldHVybiBudWxsXG4gICAgdmFyIG1hdGNoZXMgPSBkYXRlU3RyLm1hdGNoKG5ldyBSZWdFeHAobmV3Rm9ybWF0LCBcImlcIikpO1xuICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGNvbWJpbmVkSTE4blNldHRpbmdzID0gYXNzaWduKGFzc2lnbih7fSwgZ2xvYmFsSTE4biksIGkxOG4pO1xuICAgIC8vIEZvciBlYWNoIG1hdGNoLCBjYWxsIHRoZSBwYXJzZXIgZnVuY3Rpb24gZm9yIHRoYXQgZGF0ZSBwYXJ0XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBfYSA9IHBhcnNlSW5mb1tpIC0gMV0sIGZpZWxkID0gX2FbMF0sIHBhcnNlciA9IF9hWzJdO1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJzZXJcbiAgICAgICAgICAgID8gcGFyc2VyKG1hdGNoZXNbaV0sIGNvbWJpbmVkSTE4blNldHRpbmdzKVxuICAgICAgICAgICAgOiArbWF0Y2hlc1tpXTtcbiAgICAgICAgLy8gSWYgdGhlIHBhcnNlciBjYW4ndCBtYWtlIHNlbnNlIG9mIHRoZSB2YWx1ZSwgcmV0dXJuIG51bGxcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGRhdGVJbmZvW2ZpZWxkXSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAoZGF0ZUluZm8uaXNQbSA9PT0gMSAmJiBkYXRlSW5mby5ob3VyICE9IG51bGwgJiYgK2RhdGVJbmZvLmhvdXIgIT09IDEyKSB7XG4gICAgICAgIGRhdGVJbmZvLmhvdXIgPSArZGF0ZUluZm8uaG91ciArIDEyO1xuICAgIH1cbiAgICBlbHNlIGlmIChkYXRlSW5mby5pc1BtID09PSAwICYmICtkYXRlSW5mby5ob3VyID09PSAxMikge1xuICAgICAgICBkYXRlSW5mby5ob3VyID0gMDtcbiAgICB9XG4gICAgdmFyIGRhdGVXaXRob3V0VFogPSBuZXcgRGF0ZShkYXRlSW5mby55ZWFyLCBkYXRlSW5mby5tb250aCwgZGF0ZUluZm8uZGF5LCBkYXRlSW5mby5ob3VyLCBkYXRlSW5mby5taW51dGUsIGRhdGVJbmZvLnNlY29uZCwgZGF0ZUluZm8ubWlsbGlzZWNvbmQpO1xuICAgIHZhciB2YWxpZGF0ZUZpZWxkcyA9IFtcbiAgICAgICAgW1wibW9udGhcIiwgXCJnZXRNb250aFwiXSxcbiAgICAgICAgW1wiZGF5XCIsIFwiZ2V0RGF0ZVwiXSxcbiAgICAgICAgW1wiaG91clwiLCBcImdldEhvdXJzXCJdLFxuICAgICAgICBbXCJtaW51dGVcIiwgXCJnZXRNaW51dGVzXCJdLFxuICAgICAgICBbXCJzZWNvbmRcIiwgXCJnZXRTZWNvbmRzXCJdXG4gICAgXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsaWRhdGVGaWVsZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBkYXRlIGZpZWxkIGlzIHdpdGhpbiB0aGUgYWxsb3dlZCByYW5nZS4gSmF2YXNjcmlwdCBkYXRlcyBhbGxvd3MgdmFsdWVzXG4gICAgICAgIC8vIG91dHNpZGUgdGhlIGFsbG93ZWQgcmFuZ2UuIElmIHRoZSB2YWx1ZXMgZG9uJ3QgbWF0Y2ggdGhlIHZhbHVlIHdhcyBpbnZhbGlkXG4gICAgICAgIGlmIChzcGVjaWZpZWRGaWVsZHNbdmFsaWRhdGVGaWVsZHNbaV1bMF1dICYmXG4gICAgICAgICAgICBkYXRlSW5mb1t2YWxpZGF0ZUZpZWxkc1tpXVswXV0gIT09IGRhdGVXaXRob3V0VFpbdmFsaWRhdGVGaWVsZHNbaV1bMV1dKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChkYXRlSW5mby50aW1lem9uZU9mZnNldCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBkYXRlV2l0aG91dFRaO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoZGF0ZUluZm8ueWVhciwgZGF0ZUluZm8ubW9udGgsIGRhdGVJbmZvLmRheSwgZGF0ZUluZm8uaG91ciwgZGF0ZUluZm8ubWludXRlIC0gZGF0ZUluZm8udGltZXpvbmVPZmZzZXQsIGRhdGVJbmZvLnNlY29uZCwgZGF0ZUluZm8ubWlsbGlzZWNvbmQpKTtcbn1cbnZhciBmZWNoYSA9IHtcbiAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICBwYXJzZTogcGFyc2UsXG4gICAgZGVmYXVsdEkxOG46IGRlZmF1bHRJMThuLFxuICAgIHNldEdsb2JhbERhdGVJMThuOiBzZXRHbG9iYWxEYXRlSTE4bixcbiAgICBzZXRHbG9iYWxEYXRlTWFza3M6IHNldEdsb2JhbERhdGVNYXNrc1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZmVjaGE7XG5leHBvcnQgeyBhc3NpZ24sIGZvcm1hdCwgcGFyc2UsIGRlZmF1bHRJMThuLCBzZXRHbG9iYWxEYXRlSTE4biwgc2V0R2xvYmFsRGF0ZU1hc2tzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mZWNoYS5qcy5tYXBcbiIsImltcG9ydCBlIGZyb21cImZlY2hhXCI7ZnVuY3Rpb24gdChlKXt2YXIgdD1lLnNwbGl0KFwiOlwiKS5tYXAoTnVtYmVyKTtyZXR1cm4gMzYwMCp0WzBdKzYwKnRbMV0rdFsyXX12YXIgYT1mdW5jdGlvbigpe3RyeXsobmV3IERhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImlcIil9Y2F0Y2goZSl7cmV0dXJuXCJSYW5nZUVycm9yXCI9PT1lLm5hbWV9cmV0dXJuITF9KCk/ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS50b0xvY2FsZURhdGVTdHJpbmcodCx7eWVhcjpcIm51bWVyaWNcIixtb250aDpcImxvbmdcIixkYXk6XCJudW1lcmljXCJ9KX06ZnVuY3Rpb24odCl7cmV0dXJuIGUuZm9ybWF0KHQsXCJtZWRpdW1EYXRlXCIpfSxyPWZ1bmN0aW9uKCl7dHJ5eyhuZXcgRGF0ZSkudG9Mb2NhbGVTdHJpbmcoXCJpXCIpfWNhdGNoKGUpe3JldHVyblwiUmFuZ2VFcnJvclwiPT09ZS5uYW1lfXJldHVybiExfSgpP2Z1bmN0aW9uKGUsdCl7cmV0dXJuIGUudG9Mb2NhbGVTdHJpbmcodCx7eWVhcjpcIm51bWVyaWNcIixtb250aDpcImxvbmdcIixkYXk6XCJudW1lcmljXCIsaG91cjpcIm51bWVyaWNcIixtaW51dGU6XCIyLWRpZ2l0XCJ9KX06ZnVuY3Rpb24odCl7cmV0dXJuIGUuZm9ybWF0KHQsXCJoYURhdGVUaW1lXCIpfSxuPWZ1bmN0aW9uKCl7dHJ5eyhuZXcgRGF0ZSkudG9Mb2NhbGVUaW1lU3RyaW5nKFwiaVwiKX1jYXRjaChlKXtyZXR1cm5cIlJhbmdlRXJyb3JcIj09PWUubmFtZX1yZXR1cm4hMX0oKT9mdW5jdGlvbihlLHQpe3JldHVybiBlLnRvTG9jYWxlVGltZVN0cmluZyh0LHtob3VyOlwibnVtZXJpY1wiLG1pbnV0ZTpcIjItZGlnaXRcIn0pfTpmdW5jdGlvbih0KXtyZXR1cm4gZS5mb3JtYXQodCxcInNob3J0VGltZVwiKX0scz1bNjAsNjAsMjQsN10saT1bXCJzZWNvbmRcIixcIm1pbnV0ZVwiLFwiaG91clwiLFwiZGF5XCJdO2Z1bmN0aW9uIG8oZSx0LGEpe3ZvaWQgMD09PWEmJihhPXt9KTt2YXIgcixuPSgoYS5jb21wYXJlVGltZXx8bmV3IERhdGUpLmdldFRpbWUoKS1lLmdldFRpbWUoKSkvMWUzLG89bj49MD9cInBhc3RcIjpcImZ1dHVyZVwiO249TWF0aC5hYnMobik7Zm9yKHZhciBjPTA7YzxzLmxlbmd0aDtjKyspe2lmKG48c1tjXSl7bj1NYXRoLmZsb29yKG4pLHI9dChcInVpLmNvbXBvbmVudHMucmVsYXRpdmVfdGltZS5kdXJhdGlvbi5cIitpW2NdLFwiY291bnRcIixuKTticmVha31uLz1zW2NdfXJldHVybiB2b2lkIDA9PT1yJiYocj10KFwidWkuY29tcG9uZW50cy5yZWxhdGl2ZV90aW1lLmR1cmF0aW9uLndlZWtcIixcImNvdW50XCIsbj1NYXRoLmZsb29yKG4pKSksITE9PT1hLmluY2x1ZGVUZW5zZT9yOnQoXCJ1aS5jb21wb25lbnRzLnJlbGF0aXZlX3RpbWUuXCIrbyxcInRpbWVcIixyKX12YXIgYz1mdW5jdGlvbihlKXtyZXR1cm4gZTwxMD9cIjBcIitlOmV9O2Z1bmN0aW9uIHUoZSl7dmFyIHQ9TWF0aC5mbG9vcihlLzM2MDApLGE9TWF0aC5mbG9vcihlJTM2MDAvNjApLHI9TWF0aC5mbG9vcihlJTM2MDAlNjApO3JldHVybiB0PjA/dCtcIjpcIitjKGEpK1wiOlwiK2Mocik6YT4wP2ErXCI6XCIrYyhyKTpyPjA/XCJcIityOm51bGx9ZnVuY3Rpb24gbChlKXt2YXIgYT10KGUuYXR0cmlidXRlcy5yZW1haW5pbmcpO2lmKFwiYWN0aXZlXCI9PT1lLnN0YXRlKXt2YXIgcj0obmV3IERhdGUpLmdldFRpbWUoKSxuPW5ldyBEYXRlKGUubGFzdF9jaGFuZ2VkKS5nZXRUaW1lKCk7YT1NYXRoLm1heChhLShyLW4pLzFlMywwKX1yZXR1cm4gYX12YXIgaD1mdW5jdGlvbihlLHQsYSxyKXt2b2lkIDA9PT1yJiYocj0hMSksZS5fdGhlbWVzfHwoZS5fdGhlbWVzPXt9KTt2YXIgbj10LmRlZmF1bHRfdGhlbWU7KFwiZGVmYXVsdFwiPT09YXx8YSYmdC50aGVtZXNbYV0pJiYobj1hKTt2YXIgcz1PYmplY3QuYXNzaWduKHt9LGUuX3RoZW1lcyk7aWYoXCJkZWZhdWx0XCIhPT1uKXt2YXIgaT10LnRoZW1lc1tuXTtPYmplY3Qua2V5cyhpKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciBhPVwiLS1cIit0O2UuX3RoZW1lc1thXT1cIlwiLHNbYV09aVt0XX0pfWlmKGUudXBkYXRlU3R5bGVzP2UudXBkYXRlU3R5bGVzKHMpOndpbmRvdy5TaGFkeUNTUyYmd2luZG93LlNoYWR5Q1NTLnN0eWxlU3VidHJlZShlLHMpLHIpe3ZhciBvPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9dGhlbWUtY29sb3JdXCIpO2lmKG8pe28uaGFzQXR0cmlidXRlKFwiZGVmYXVsdC1jb250ZW50XCIpfHxvLnNldEF0dHJpYnV0ZShcImRlZmF1bHQtY29udGVudFwiLG8uZ2V0QXR0cmlidXRlKFwiY29udGVudFwiKSk7dmFyIGM9c1tcIi0tcHJpbWFyeS1jb2xvclwiXXx8by5nZXRBdHRyaWJ1dGUoXCJkZWZhdWx0LWNvbnRlbnRcIik7by5zZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIsYyl9fX0sbT1mdW5jdGlvbihlKXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlLmdldENhcmRTaXplP2UuZ2V0Q2FyZFNpemUoKTo0fTtmdW5jdGlvbiBkKGUpe3JldHVybiBlLnN1YnN0cigwLGUuaW5kZXhPZihcIi5cIikpfWZ1bmN0aW9uIGYoZSl7cmV0dXJuIGUuc3Vic3RyKGUuaW5kZXhPZihcIi5cIikrMSl9ZnVuY3Rpb24gcChlKXt2YXIgdD1lLmxhbmd1YWdlfHxcImVuXCI7cmV0dXJuIGUudHJhbnNsYXRpb25NZXRhZGF0YS50cmFuc2xhdGlvbnNbdF0mJmUudHJhbnNsYXRpb25NZXRhZGF0YS50cmFuc2xhdGlvbnNbdF0uaXNSVEx8fCExfWZ1bmN0aW9uIGcoZSl7cmV0dXJuIHAoZSk/XCJydGxcIjpcImx0clwifWZ1bmN0aW9uIHYoZSl7cmV0dXJuIGQoZS5lbnRpdHlfaWQpfWZ1bmN0aW9uIGIoZSx0LHMpe2lmKFwidW5rbm93blwiPT09dC5zdGF0ZXx8XCJ1bmF2YWlsYWJsZVwiPT09dC5zdGF0ZSlyZXR1cm4gZShcInN0YXRlLmRlZmF1bHQuXCIrdC5zdGF0ZSk7aWYodC5hdHRyaWJ1dGVzLnVuaXRfb2ZfbWVhc3VyZW1lbnQpcmV0dXJuIHQuc3RhdGUrXCIgXCIrdC5hdHRyaWJ1dGVzLnVuaXRfb2ZfbWVhc3VyZW1lbnQ7dmFyIGk9dih0KTtpZihcImlucHV0X2RhdGV0aW1lXCI9PT1pKXt2YXIgbztpZighdC5hdHRyaWJ1dGVzLmhhc190aW1lKXJldHVybiBvPW5ldyBEYXRlKHQuYXR0cmlidXRlcy55ZWFyLHQuYXR0cmlidXRlcy5tb250aC0xLHQuYXR0cmlidXRlcy5kYXkpLGEobyxzKTtpZighdC5hdHRyaWJ1dGVzLmhhc19kYXRlKXt2YXIgYz1uZXcgRGF0ZTtyZXR1cm4gbz1uZXcgRGF0ZShjLmdldEZ1bGxZZWFyKCksYy5nZXRNb250aCgpLGMuZ2V0RGF5KCksdC5hdHRyaWJ1dGVzLmhvdXIsdC5hdHRyaWJ1dGVzLm1pbnV0ZSksbihvLHMpfXJldHVybiBvPW5ldyBEYXRlKHQuYXR0cmlidXRlcy55ZWFyLHQuYXR0cmlidXRlcy5tb250aC0xLHQuYXR0cmlidXRlcy5kYXksdC5hdHRyaWJ1dGVzLmhvdXIsdC5hdHRyaWJ1dGVzLm1pbnV0ZSkscihvLHMpfXJldHVybiB0LmF0dHJpYnV0ZXMuZGV2aWNlX2NsYXNzJiZlKFwiY29tcG9uZW50LlwiK2krXCIuc3RhdGUuXCIrdC5hdHRyaWJ1dGVzLmRldmljZV9jbGFzcytcIi5cIit0LnN0YXRlKXx8ZShcImNvbXBvbmVudC5cIitpK1wiLnN0YXRlLl8uXCIrdC5zdGF0ZSl8fHQuc3RhdGV9dmFyIF89XCJoYXNzOmJvb2ttYXJrXCIsdz1cImxvdmVsYWNlXCIseT1bXCJjbGltYXRlXCIsXCJjb3ZlclwiLFwiY29uZmlndXJhdG9yXCIsXCJpbnB1dF9zZWxlY3RcIixcImlucHV0X251bWJlclwiLFwiaW5wdXRfdGV4dFwiLFwibG9ja1wiLFwibWVkaWFfcGxheWVyXCIsXCJzY2VuZVwiLFwic2NyaXB0XCIsXCJ0aW1lclwiLFwidmFjdXVtXCIsXCJ3YXRlcl9oZWF0ZXJcIixcIndlYmxpbmtcIl0saz1bXCJhbGFybV9jb250cm9sX3BhbmVsXCIsXCJhdXRvbWF0aW9uXCIsXCJjYW1lcmFcIixcImNsaW1hdGVcIixcImNvbmZpZ3VyYXRvclwiLFwiY292ZXJcIixcImZhblwiLFwiZ3JvdXBcIixcImhpc3RvcnlfZ3JhcGhcIixcImlucHV0X2RhdGV0aW1lXCIsXCJsaWdodFwiLFwibG9ja1wiLFwibWVkaWFfcGxheWVyXCIsXCJzY3JpcHRcIixcInN1blwiLFwidXBkYXRlclwiLFwidmFjdXVtXCIsXCJ3YXRlcl9oZWF0ZXJcIixcIndlYXRoZXJcIl0sUz1bXCJpbnB1dF9udW1iZXJcIixcImlucHV0X3NlbGVjdFwiLFwiaW5wdXRfdGV4dFwiLFwic2NlbmVcIixcIndlYmxpbmtcIl0seD1bXCJjYW1lcmFcIixcImNvbmZpZ3VyYXRvclwiLFwiaGlzdG9yeV9ncmFwaFwiLFwic2NlbmVcIl0sRD1bXCJjbG9zZWRcIixcImxvY2tlZFwiLFwib2ZmXCJdLFQ9bmV3IFNldChbXCJmYW5cIixcImlucHV0X2Jvb2xlYW5cIixcImxpZ2h0XCIsXCJzd2l0Y2hcIixcImdyb3VwXCIsXCJhdXRvbWF0aW9uXCJdKSxFPVwiwrBDXCIsTT1cIsKwRlwiLHE9XCJncm91cC5kZWZhdWx0X3ZpZXdcIixDPWZ1bmN0aW9uKGUsdCxhLHIpe3I9cnx8e30sYT1udWxsPT1hP3t9OmE7dmFyIG49bmV3IEV2ZW50KHQse2J1YmJsZXM6dm9pZCAwPT09ci5idWJibGVzfHxyLmJ1YmJsZXMsY2FuY2VsYWJsZTpCb29sZWFuKHIuY2FuY2VsYWJsZSksY29tcG9zZWQ6dm9pZCAwPT09ci5jb21wb3NlZHx8ci5jb21wb3NlZH0pO3JldHVybiBuLmRldGFpbD1hLGUuZGlzcGF0Y2hFdmVudChuKSxufSxSPW5ldyBTZXQoW1wiY2FsbC1zZXJ2aWNlXCIsXCJkaXZpZGVyXCIsXCJzZWN0aW9uXCIsXCJ3ZWJsaW5rXCIsXCJjYXN0XCIsXCJzZWxlY3RcIl0pLEE9e2FsZXJ0OlwidG9nZ2xlXCIsYXV0b21hdGlvbjpcInRvZ2dsZVwiLGNsaW1hdGU6XCJjbGltYXRlXCIsY292ZXI6XCJjb3ZlclwiLGZhbjpcInRvZ2dsZVwiLGdyb3VwOlwiZ3JvdXBcIixpbnB1dF9ib29sZWFuOlwidG9nZ2xlXCIsaW5wdXRfbnVtYmVyOlwiaW5wdXQtbnVtYmVyXCIsaW5wdXRfc2VsZWN0OlwiaW5wdXQtc2VsZWN0XCIsaW5wdXRfdGV4dDpcImlucHV0LXRleHRcIixsaWdodDpcInRvZ2dsZVwiLGxvY2s6XCJsb2NrXCIsbWVkaWFfcGxheWVyOlwibWVkaWEtcGxheWVyXCIscmVtb3RlOlwidG9nZ2xlXCIsc2NlbmU6XCJzY2VuZVwiLHNjcmlwdDpcInNjcmlwdFwiLHNlbnNvcjpcInNlbnNvclwiLHRpbWVyOlwidGltZXJcIixzd2l0Y2g6XCJ0b2dnbGVcIix2YWN1dW06XCJ0b2dnbGVcIix3YXRlcl9oZWF0ZXI6XCJjbGltYXRlXCIsaW5wdXRfZGF0ZXRpbWU6XCJpbnB1dC1kYXRldGltZVwifSxMPWZ1bmN0aW9uKGUsdCl7dm9pZCAwPT09dCYmKHQ9ITEpO3ZhciBhPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHIoXCJodWktZXJyb3ItY2FyZFwiLHt0eXBlOlwiZXJyb3JcIixlcnJvcjplLGNvbmZpZzp0fSl9LHI9ZnVuY3Rpb24oZSx0KXt2YXIgcj13aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlKTt0cnl7ci5zZXRDb25maWcodCl9Y2F0Y2gocil7cmV0dXJuIGNvbnNvbGUuZXJyb3IoZSxyKSxhKHIubWVzc2FnZSx0KX1yZXR1cm4gcn07aWYoIWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlfHwhdCYmIWUudHlwZSlyZXR1cm4gYShcIk5vIHR5cGUgZGVmaW5lZFwiLGUpO3ZhciBuPWUudHlwZTtpZihuJiZuLnN0YXJ0c1dpdGgoXCJjdXN0b206XCIpKW49bi5zdWJzdHIoXCJjdXN0b206XCIubGVuZ3RoKTtlbHNlIGlmKHQpaWYoUi5oYXMobikpbj1cImh1aS1cIituK1wiLXJvd1wiO2Vsc2V7aWYoIWUuZW50aXR5KXJldHVybiBhKFwiSW52YWxpZCBjb25maWcgZ2l2ZW4uXCIsZSk7dmFyIHM9ZS5lbnRpdHkuc3BsaXQoXCIuXCIsMSlbMF07bj1cImh1aS1cIisoQVtzXXx8XCJ0ZXh0XCIpK1wiLWVudGl0eS1yb3dcIn1lbHNlIG49XCJodWktXCIrbitcIi1jYXJkXCI7aWYoY3VzdG9tRWxlbWVudHMuZ2V0KG4pKXJldHVybiByKG4sZSk7dmFyIGk9YShcIkN1c3RvbSBlbGVtZW50IGRvZXNuJ3QgZXhpc3Q6IFwiK2UudHlwZStcIi5cIixlKTtpLnN0eWxlLmRpc3BsYXk9XCJOb25lXCI7dmFyIG89c2V0VGltZW91dChmdW5jdGlvbigpe2kuc3R5bGUuZGlzcGxheT1cIlwifSwyZTMpO3JldHVybiBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChlLnR5cGUpLnRoZW4oZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQobyksQyhpLFwibGwtcmVidWlsZFwiLHt9LGkpfSksaX0sTj17YWxlcnQ6XCJoYXNzOmFsZXJ0XCIsYXV0b21hdGlvbjpcImhhc3M6cGxheWxpc3QtcGxheVwiLGNhbGVuZGFyOlwiaGFzczpjYWxlbmRhclwiLGNhbWVyYTpcImhhc3M6dmlkZW9cIixjbGltYXRlOlwiaGFzczp0aGVybW9zdGF0XCIsY29uZmlndXJhdG9yOlwiaGFzczpzZXR0aW5nc1wiLGNvbnZlcnNhdGlvbjpcImhhc3M6dGV4dC10by1zcGVlY2hcIixkZXZpY2VfdHJhY2tlcjpcImhhc3M6YWNjb3VudFwiLGZhbjpcImhhc3M6ZmFuXCIsZ3JvdXA6XCJoYXNzOmdvb2dsZS1jaXJjbGVzLWNvbW11bml0aWVzXCIsaGlzdG9yeV9ncmFwaDpcImhhc3M6Y2hhcnQtbGluZVwiLGhvbWVhc3Npc3RhbnQ6XCJoYXNzOmhvbWUtYXNzaXN0YW50XCIsaG9tZWtpdDpcImhhc3M6aG9tZS1hdXRvbWF0aW9uXCIsaW1hZ2VfcHJvY2Vzc2luZzpcImhhc3M6aW1hZ2UtZmlsdGVyLWZyYW1lc1wiLGlucHV0X2Jvb2xlYW46XCJoYXNzOmRyYXdpbmdcIixpbnB1dF9kYXRldGltZTpcImhhc3M6Y2FsZW5kYXItY2xvY2tcIixpbnB1dF9udW1iZXI6XCJoYXNzOnJheS12ZXJ0ZXhcIixpbnB1dF9zZWxlY3Q6XCJoYXNzOmZvcm1hdC1saXN0LWJ1bGxldGVkXCIsaW5wdXRfdGV4dDpcImhhc3M6dGV4dGJveFwiLGxpZ2h0OlwiaGFzczpsaWdodGJ1bGJcIixtYWlsYm94OlwiaGFzczptYWlsYm94XCIsbm90aWZ5OlwiaGFzczpjb21tZW50LWFsZXJ0XCIscGVyc29uOlwiaGFzczphY2NvdW50XCIscGxhbnQ6XCJoYXNzOmZsb3dlclwiLHByb3hpbWl0eTpcImhhc3M6YXBwbGUtc2FmYXJpXCIscmVtb3RlOlwiaGFzczpyZW1vdGVcIixzY2VuZTpcImhhc3M6Z29vZ2xlLXBhZ2VzXCIsc2NyaXB0OlwiaGFzczpmaWxlLWRvY3VtZW50XCIsc2Vuc29yOlwiaGFzczpleWVcIixzaW1wbGVfYWxhcm06XCJoYXNzOmJlbGxcIixzdW46XCJoYXNzOndoaXRlLWJhbGFuY2Utc3VubnlcIixzd2l0Y2g6XCJoYXNzOmZsYXNoXCIsdGltZXI6XCJoYXNzOnRpbWVyXCIsdXBkYXRlcjpcImhhc3M6Y2xvdWQtdXBsb2FkXCIsdmFjdXVtOlwiaGFzczpyb2JvdC12YWN1dW1cIix3YXRlcl9oZWF0ZXI6XCJoYXNzOnRoZXJtb21ldGVyXCIsd2VibGluazpcImhhc3M6b3Blbi1pbi1uZXdcIn07ZnVuY3Rpb24gTyhlLHQpe2lmKGUgaW4gTilyZXR1cm4gTltlXTtzd2l0Y2goZSl7Y2FzZVwiYWxhcm1fY29udHJvbF9wYW5lbFwiOnN3aXRjaCh0KXtjYXNlXCJhcm1lZF9ob21lXCI6cmV0dXJuXCJoYXNzOmJlbGwtcGx1c1wiO2Nhc2VcImFybWVkX25pZ2h0XCI6cmV0dXJuXCJoYXNzOmJlbGwtc2xlZXBcIjtjYXNlXCJkaXNhcm1lZFwiOnJldHVyblwiaGFzczpiZWxsLW91dGxpbmVcIjtjYXNlXCJ0cmlnZ2VyZWRcIjpyZXR1cm5cImhhc3M6YmVsbC1yaW5nXCI7ZGVmYXVsdDpyZXR1cm5cImhhc3M6YmVsbFwifWNhc2VcImJpbmFyeV9zZW5zb3JcIjpyZXR1cm4gdCYmXCJvZmZcIj09PXQ/XCJoYXNzOnJhZGlvYm94LWJsYW5rXCI6XCJoYXNzOmNoZWNrYm94LW1hcmtlZC1jaXJjbGVcIjtjYXNlXCJjb3ZlclwiOnJldHVyblwiY2xvc2VkXCI9PT10P1wiaGFzczp3aW5kb3ctY2xvc2VkXCI6XCJoYXNzOndpbmRvdy1vcGVuXCI7Y2FzZVwibG9ja1wiOnJldHVybiB0JiZcInVubG9ja2VkXCI9PT10P1wiaGFzczpsb2NrLW9wZW5cIjpcImhhc3M6bG9ja1wiO2Nhc2VcIm1lZGlhX3BsYXllclwiOnJldHVybiB0JiZcIm9mZlwiIT09dCYmXCJpZGxlXCIhPT10P1wiaGFzczpjYXN0LWNvbm5lY3RlZFwiOlwiaGFzczpjYXN0XCI7Y2FzZVwiendhdmVcIjpzd2l0Y2godCl7Y2FzZVwiZGVhZFwiOnJldHVyblwiaGFzczplbW90aWNvbi1kZWFkXCI7Y2FzZVwic2xlZXBpbmdcIjpyZXR1cm5cImhhc3M6c2xlZXBcIjtjYXNlXCJpbml0aWFsaXppbmdcIjpyZXR1cm5cImhhc3M6dGltZXItc2FuZFwiO2RlZmF1bHQ6cmV0dXJuXCJoYXNzOnotd2F2ZVwifWRlZmF1bHQ6cmV0dXJuIGNvbnNvbGUud2FybihcIlVuYWJsZSB0byBmaW5kIGljb24gZm9yIGRvbWFpbiBcIitlK1wiIChcIit0K1wiKVwiKSxffX12YXIgaj1mdW5jdGlvbihlLHQpe3ZhciBhPXQudmFsdWV8fHQscj10LmF0dHJpYnV0ZT9lLmF0dHJpYnV0ZXNbdC5hdHRyaWJ1dGVdOmUuc3RhdGU7c3dpdGNoKHQub3BlcmF0b3J8fFwiPT1cIil7Y2FzZVwiPT1cIjpyZXR1cm4gcj09PWE7Y2FzZVwiPD1cIjpyZXR1cm4gcjw9YTtjYXNlXCI8XCI6cmV0dXJuIHI8YTtjYXNlXCI+PVwiOnJldHVybiByPj1hO2Nhc2VcIj5cIjpyZXR1cm4gcj5hO2Nhc2VcIiE9XCI6cmV0dXJuIHIhPT1hO2Nhc2VcInJlZ2V4XCI6cmV0dXJuIHIubWF0Y2goYSk7ZGVmYXVsdDpyZXR1cm4hMX19LHo9ZnVuY3Rpb24oZSl7Qyh3aW5kb3csXCJoYXB0aWNcIixlKX0sRj1mdW5jdGlvbihlLHQsYSl7dm9pZCAwPT09YSYmKGE9ITEpLGE/aGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCxcIlwiLHQpOmhpc3RvcnkucHVzaFN0YXRlKG51bGwsXCJcIix0KSxDKHdpbmRvdyxcImxvY2F0aW9uLWNoYW5nZWRcIix7cmVwbGFjZTphfSl9LEk9ZnVuY3Rpb24oZSx0LGEpe3ZvaWQgMD09PWEmJihhPSEwKTt2YXIgcixuPWQodCkscz1cImdyb3VwXCI9PT1uP1wiaG9tZWFzc2lzdGFudFwiOm47c3dpdGNoKG4pe2Nhc2VcImxvY2tcIjpyPWE/XCJ1bmxvY2tcIjpcImxvY2tcIjticmVhaztjYXNlXCJjb3ZlclwiOnI9YT9cIm9wZW5fY292ZXJcIjpcImNsb3NlX2NvdmVyXCI7YnJlYWs7ZGVmYXVsdDpyPWE/XCJ0dXJuX29uXCI6XCJ0dXJuX29mZlwifXJldHVybiBlLmNhbGxTZXJ2aWNlKHMscix7ZW50aXR5X2lkOnR9KX0sQj1mdW5jdGlvbihlLHQpe3ZhciBhPUQuaW5jbHVkZXMoZS5zdGF0ZXNbdF0uc3RhdGUpO3JldHVybiBJKGUsdCxhKX0sVT1mdW5jdGlvbihlLHQsYSxyKXt2YXIgbjtpZihcImRvdWJsZV90YXBcIj09PXImJmEuZG91YmxlX3RhcF9hY3Rpb24/bj1hLmRvdWJsZV90YXBfYWN0aW9uOlwiaG9sZFwiPT09ciYmYS5ob2xkX2FjdGlvbj9uPWEuaG9sZF9hY3Rpb246XCJ0YXBcIj09PXImJmEudGFwX2FjdGlvbiYmKG49YS50YXBfYWN0aW9uKSxufHwobj17YWN0aW9uOlwibW9yZS1pbmZvXCJ9KSwhbi5jb25maXJtYXRpb258fG4uY29uZmlybWF0aW9uLmV4ZW1wdGlvbnMmJm4uY29uZmlybWF0aW9uLmV4ZW1wdGlvbnMuc29tZShmdW5jdGlvbihlKXtyZXR1cm4gZS51c2VyPT09dC51c2VyLmlkfSl8fCh6KFwid2FybmluZ1wiKSxjb25maXJtKG4uY29uZmlybWF0aW9uLnRleHR8fFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIFwiK24uYWN0aW9uK1wiP1wiKSkpc3dpdGNoKG4uYWN0aW9uKXtjYXNlXCJtb3JlLWluZm9cIjooYS5lbnRpdHl8fGEuY2FtZXJhX2ltYWdlKSYmQyhlLFwiaGFzcy1tb3JlLWluZm9cIix7ZW50aXR5SWQ6YS5lbnRpdHk/YS5lbnRpdHk6YS5jYW1lcmFfaW1hZ2V9KTticmVhaztjYXNlXCJuYXZpZ2F0ZVwiOm4ubmF2aWdhdGlvbl9wYXRoJiZGKDAsbi5uYXZpZ2F0aW9uX3BhdGgpO2JyZWFrO2Nhc2VcInVybFwiOm4udXJsX3BhdGgmJndpbmRvdy5vcGVuKG4udXJsX3BhdGgpO2JyZWFrO2Nhc2VcInRvZ2dsZVwiOmEuZW50aXR5JiYoQih0LGEuZW50aXR5KSx6KFwic3VjY2Vzc1wiKSk7YnJlYWs7Y2FzZVwiY2FsbC1zZXJ2aWNlXCI6aWYoIW4uc2VydmljZSlyZXR1cm4gdm9pZCB6KFwiZmFpbHVyZVwiKTt2YXIgcz1uLnNlcnZpY2Uuc3BsaXQoXCIuXCIsMik7dC5jYWxsU2VydmljZShzWzBdLHNbMV0sbi5zZXJ2aWNlX2RhdGEpLHooXCJzdWNjZXNzXCIpfX0sVj1mdW5jdGlvbihlLHQsYSxyLG4pe3ZhciBzO2lmKG4mJmEuZG91YmxlX3RhcF9hY3Rpb24/cz1hLmRvdWJsZV90YXBfYWN0aW9uOnImJmEuaG9sZF9hY3Rpb24/cz1hLmhvbGRfYWN0aW9uOiFyJiZhLnRhcF9hY3Rpb24mJihzPWEudGFwX2FjdGlvbiksc3x8KHM9e2FjdGlvbjpcIm1vcmUtaW5mb1wifSksIXMuY29uZmlybWF0aW9ufHxzLmNvbmZpcm1hdGlvbi5leGVtcHRpb25zJiZzLmNvbmZpcm1hdGlvbi5leGVtcHRpb25zLnNvbWUoZnVuY3Rpb24oZSl7cmV0dXJuIGUudXNlcj09PXQudXNlci5pZH0pfHxjb25maXJtKHMuY29uZmlybWF0aW9uLnRleHR8fFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIFwiK3MuYWN0aW9uK1wiP1wiKSlzd2l0Y2gocy5hY3Rpb24pe2Nhc2VcIm1vcmUtaW5mb1wiOihzLmVudGl0eXx8YS5lbnRpdHl8fGEuY2FtZXJhX2ltYWdlKSYmKEMoZSxcImhhc3MtbW9yZS1pbmZvXCIse2VudGl0eUlkOnMuZW50aXR5P3MuZW50aXR5OmEuZW50aXR5P2EuZW50aXR5OmEuY2FtZXJhX2ltYWdlfSkscy5oYXB0aWMmJnoocy5oYXB0aWMpKTticmVhaztjYXNlXCJuYXZpZ2F0ZVwiOnMubmF2aWdhdGlvbl9wYXRoJiYoRigwLHMubmF2aWdhdGlvbl9wYXRoKSxzLmhhcHRpYyYmeihzLmhhcHRpYykpO2JyZWFrO2Nhc2VcInVybFwiOnMudXJsX3BhdGgmJndpbmRvdy5vcGVuKHMudXJsX3BhdGgpLHMuaGFwdGljJiZ6KHMuaGFwdGljKTticmVhaztjYXNlXCJ0b2dnbGVcIjphLmVudGl0eSYmKEIodCxhLmVudGl0eSkscy5oYXB0aWMmJnoocy5oYXB0aWMpKTticmVhaztjYXNlXCJjYWxsLXNlcnZpY2VcIjppZighcy5zZXJ2aWNlKXJldHVybjt2YXIgaT1zLnNlcnZpY2Uuc3BsaXQoXCIuXCIsMiksbz1pWzBdLGM9aVsxXSx1PU9iamVjdC5hc3NpZ24oe30scy5zZXJ2aWNlX2RhdGEpO1wiZW50aXR5XCI9PT11LmVudGl0eV9pZCYmKHUuZW50aXR5X2lkPWEuZW50aXR5KSx0LmNhbGxTZXJ2aWNlKG8sYyx1KSxzLmhhcHRpYyYmeihzLmhhcHRpYyl9fTtmdW5jdGlvbiBXKGUpe3JldHVybiB2b2lkIDAhPT1lJiZcIm5vbmVcIiE9PWUuYWN0aW9ufWZ1bmN0aW9uIFkoZSx0LGEpe2lmKHQuaGFzKFwiY29uZmlnXCIpfHxhKXJldHVybiEwO2lmKGUuY29uZmlnLmVudGl0eSl7dmFyIHI9dC5nZXQoXCJoYXNzXCIpO3JldHVybiFyfHxyLnN0YXRlc1tlLmNvbmZpZy5lbnRpdHldIT09ZS5oYXNzLnN0YXRlc1tlLmNvbmZpZy5lbnRpdHldfXJldHVybiExfWZ1bmN0aW9uIEcoZSl7cmV0dXJuIHZvaWQgMCE9PWUmJlwibm9uZVwiIT09ZS5hY3Rpb259dmFyIEg9ZnVuY3Rpb24oZSx0LGEpe3ZvaWQgMD09PWEmJihhPSEwKTt2YXIgcj17fTt0LmZvckVhY2goZnVuY3Rpb24odCl7aWYoRC5pbmNsdWRlcyhlLnN0YXRlc1t0XS5zdGF0ZSk9PT1hKXt2YXIgbj1kKHQpLHM9W1wiY292ZXJcIixcImxvY2tcIl0uaW5jbHVkZXMobik/bjpcImhvbWVhc3Npc3RhbnRcIjtzIGluIHJ8fChyW3NdPVtdKSxyW3NdLnB1c2godCl9fSksT2JqZWN0LmtleXMocikuZm9yRWFjaChmdW5jdGlvbih0KXt2YXIgbjtzd2l0Y2godCl7Y2FzZVwibG9ja1wiOm49YT9cInVubG9ja1wiOlwibG9ja1wiO2JyZWFrO2Nhc2VcImNvdmVyXCI6bj1hP1wib3Blbl9jb3ZlclwiOlwiY2xvc2VfY292ZXJcIjticmVhaztkZWZhdWx0Om49YT9cInR1cm5fb25cIjpcInR1cm5fb2ZmXCJ9ZS5jYWxsU2VydmljZSh0LG4se2VudGl0eV9pZDpyW3RdfSl9KX0sSj1mdW5jdGlvbigpe3ZhciBlPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJob21lLWFzc2lzdGFudFwiKTtpZihlPShlPShlPShlPShlPShlPShlPShlPWUmJmUuc2hhZG93Um9vdCkmJmUucXVlcnlTZWxlY3RvcihcImhvbWUtYXNzaXN0YW50LW1haW5cIikpJiZlLnNoYWRvd1Jvb3QpJiZlLnF1ZXJ5U2VsZWN0b3IoXCJhcHAtZHJhd2VyLWxheW91dCBwYXJ0aWFsLXBhbmVsLXJlc29sdmVyXCIpKSYmZS5zaGFkb3dSb290fHxlKSYmZS5xdWVyeVNlbGVjdG9yKFwiaGEtcGFuZWwtbG92ZWxhY2VcIikpJiZlLnNoYWRvd1Jvb3QpJiZlLnF1ZXJ5U2VsZWN0b3IoXCJodWktcm9vdFwiKSl7dmFyIHQ9ZS5sb3ZlbGFjZTtyZXR1cm4gdC5jdXJyZW50X3ZpZXc9ZS5fX19jdXJWaWV3LHR9cmV0dXJuIG51bGx9LEs9e2h1bWlkaXR5OlwiaGFzczp3YXRlci1wZXJjZW50XCIsaWxsdW1pbmFuY2U6XCJoYXNzOmJyaWdodG5lc3MtNVwiLHRlbXBlcmF0dXJlOlwiaGFzczp0aGVybW9tZXRlclwiLHByZXNzdXJlOlwiaGFzczpnYXVnZVwiLHBvd2VyOlwiaGFzczpmbGFzaFwiLHNpZ25hbF9zdHJlbmd0aDpcImhhc3M6d2lmaVwifSxQPXtiaW5hcnlfc2Vuc29yOmZ1bmN0aW9uKGUpe3ZhciB0PWUuc3RhdGUmJlwib2ZmXCI9PT1lLnN0YXRlO3N3aXRjaChlLmF0dHJpYnV0ZXMuZGV2aWNlX2NsYXNzKXtjYXNlXCJiYXR0ZXJ5XCI6cmV0dXJuIHQ/XCJoYXNzOmJhdHRlcnlcIjpcImhhc3M6YmF0dGVyeS1vdXRsaW5lXCI7Y2FzZVwiY29sZFwiOnJldHVybiB0P1wiaGFzczp0aGVybW9tZXRlclwiOlwiaGFzczpzbm93Zmxha2VcIjtjYXNlXCJjb25uZWN0aXZpdHlcIjpyZXR1cm4gdD9cImhhc3M6c2VydmVyLW5ldHdvcmstb2ZmXCI6XCJoYXNzOnNlcnZlci1uZXR3b3JrXCI7Y2FzZVwiZG9vclwiOnJldHVybiB0P1wiaGFzczpkb29yLWNsb3NlZFwiOlwiaGFzczpkb29yLW9wZW5cIjtjYXNlXCJnYXJhZ2VfZG9vclwiOnJldHVybiB0P1wiaGFzczpnYXJhZ2VcIjpcImhhc3M6Z2FyYWdlLW9wZW5cIjtjYXNlXCJnYXNcIjpjYXNlXCJwb3dlclwiOmNhc2VcInByb2JsZW1cIjpjYXNlXCJzYWZldHlcIjpjYXNlXCJzbW9rZVwiOnJldHVybiB0P1wiaGFzczpzaGllbGQtY2hlY2tcIjpcImhhc3M6YWxlcnRcIjtjYXNlXCJoZWF0XCI6cmV0dXJuIHQ/XCJoYXNzOnRoZXJtb21ldGVyXCI6XCJoYXNzOmZpcmVcIjtjYXNlXCJsaWdodFwiOnJldHVybiB0P1wiaGFzczpicmlnaHRuZXNzLTVcIjpcImhhc3M6YnJpZ2h0bmVzcy03XCI7Y2FzZVwibG9ja1wiOnJldHVybiB0P1wiaGFzczpsb2NrXCI6XCJoYXNzOmxvY2stb3BlblwiO2Nhc2VcIm1vaXN0dXJlXCI6cmV0dXJuIHQ/XCJoYXNzOndhdGVyLW9mZlwiOlwiaGFzczp3YXRlclwiO2Nhc2VcIm1vdGlvblwiOnJldHVybiB0P1wiaGFzczp3YWxrXCI6XCJoYXNzOnJ1blwiO2Nhc2VcIm9jY3VwYW5jeVwiOnJldHVybiB0P1wiaGFzczpob21lLW91dGxpbmVcIjpcImhhc3M6aG9tZVwiO2Nhc2VcIm9wZW5pbmdcIjpyZXR1cm4gdD9cImhhc3M6c3F1YXJlXCI6XCJoYXNzOnNxdWFyZS1vdXRsaW5lXCI7Y2FzZVwicGx1Z1wiOnJldHVybiB0P1wiaGFzczpwb3dlci1wbHVnLW9mZlwiOlwiaGFzczpwb3dlci1wbHVnXCI7Y2FzZVwicHJlc2VuY2VcIjpyZXR1cm4gdD9cImhhc3M6aG9tZS1vdXRsaW5lXCI6XCJoYXNzOmhvbWVcIjtjYXNlXCJzb3VuZFwiOnJldHVybiB0P1wiaGFzczptdXNpYy1ub3RlLW9mZlwiOlwiaGFzczptdXNpYy1ub3RlXCI7Y2FzZVwidmlicmF0aW9uXCI6cmV0dXJuIHQ/XCJoYXNzOmNyb3AtcG9ydHJhaXRcIjpcImhhc3M6dmlicmF0ZVwiO2Nhc2VcIndpbmRvd1wiOnJldHVybiB0P1wiaGFzczp3aW5kb3ctY2xvc2VkXCI6XCJoYXNzOndpbmRvdy1vcGVuXCI7ZGVmYXVsdDpyZXR1cm4gdD9cImhhc3M6cmFkaW9ib3gtYmxhbmtcIjpcImhhc3M6Y2hlY2tib3gtbWFya2VkLWNpcmNsZVwifX0sY292ZXI6ZnVuY3Rpb24oZSl7dmFyIHQ9XCJjbG9zZWRcIiE9PWUuc3RhdGU7c3dpdGNoKGUuYXR0cmlidXRlcy5kZXZpY2VfY2xhc3Mpe2Nhc2VcImdhcmFnZVwiOnJldHVybiB0P1wiaGFzczpnYXJhZ2Utb3BlblwiOlwiaGFzczpnYXJhZ2VcIjtjYXNlXCJkb29yXCI6cmV0dXJuIHQ/XCJoYXNzOmRvb3Itb3BlblwiOlwiaGFzczpkb29yLWNsb3NlZFwiO2Nhc2VcInNodXR0ZXJcIjpyZXR1cm4gdD9cImhhc3M6d2luZG93LXNodXR0ZXItb3BlblwiOlwiaGFzczp3aW5kb3ctc2h1dHRlclwiO2Nhc2VcImJsaW5kXCI6cmV0dXJuIHQ/XCJoYXNzOmJsaW5kcy1vcGVuXCI6XCJoYXNzOmJsaW5kc1wiO2Nhc2VcIndpbmRvd1wiOnJldHVybiB0P1wiaGFzczp3aW5kb3ctb3BlblwiOlwiaGFzczp3aW5kb3ctY2xvc2VkXCI7ZGVmYXVsdDpyZXR1cm4gTyhcImNvdmVyXCIsZS5zdGF0ZSl9fSxzZW5zb3I6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5hdHRyaWJ1dGVzLmRldmljZV9jbGFzcztpZih0JiZ0IGluIEspcmV0dXJuIEtbdF07aWYoXCJiYXR0ZXJ5XCI9PT10KXt2YXIgYT1OdW1iZXIoZS5zdGF0ZSk7aWYoaXNOYU4oYSkpcmV0dXJuXCJoYXNzOmJhdHRlcnktdW5rbm93blwiO3ZhciByPTEwKk1hdGgucm91bmQoYS8xMCk7cmV0dXJuIHI+PTEwMD9cImhhc3M6YmF0dGVyeVwiOnI8PTA/XCJoYXNzOmJhdHRlcnktYWxlcnRcIjpcImhhc3M6YmF0dGVyeS1cIityfXZhciBuPWUuYXR0cmlidXRlcy51bml0X29mX21lYXN1cmVtZW50O3JldHVyblwiwrBDXCI9PT1ufHxcIsKwRlwiPT09bj9cImhhc3M6dGhlcm1vbWV0ZXJcIjpPKFwic2Vuc29yXCIpfSxpbnB1dF9kYXRldGltZTpmdW5jdGlvbihlKXtyZXR1cm4gZS5hdHRyaWJ1dGVzLmhhc19kYXRlP2UuYXR0cmlidXRlcy5oYXNfdGltZT9PKFwiaW5wdXRfZGF0ZXRpbWVcIik6XCJoYXNzOmNhbGVuZGFyXCI6XCJoYXNzOmNsb2NrXCJ9fSxRPWZ1bmN0aW9uKGUpe2lmKCFlKXJldHVybiBfO2lmKGUuYXR0cmlidXRlcy5pY29uKXJldHVybiBlLmF0dHJpYnV0ZXMuaWNvbjt2YXIgdD1kKGUuZW50aXR5X2lkKTtyZXR1cm4gdCBpbiBQP1BbdF0oZSk6Tyh0LGUuc3RhdGUpfTtleHBvcnR7dCBhcyBkdXJhdGlvblRvU2Vjb25kcyxhIGFzIGZvcm1hdERhdGUsciBhcyBmb3JtYXREYXRlVGltZSxuIGFzIGZvcm1hdFRpbWUsbyBhcyByZWxhdGl2ZVRpbWUsdSBhcyBzZWNvbmRzVG9EdXJhdGlvbixsIGFzIHRpbWVyVGltZVJlbWFpbmluZyxoIGFzIGFwcGx5VGhlbWVzT25FbGVtZW50LG0gYXMgY29tcHV0ZUNhcmRTaXplLGQgYXMgY29tcHV0ZURvbWFpbixmIGFzIGNvbXB1dGVFbnRpdHkscCBhcyBjb21wdXRlUlRMLGcgYXMgY29tcHV0ZVJUTERpcmVjdGlvbixiIGFzIGNvbXB1dGVTdGF0ZURpc3BsYXksdiBhcyBjb21wdXRlU3RhdGVEb21haW4sXyBhcyBERUZBVUxUX0RPTUFJTl9JQ09OLHcgYXMgREVGQVVMVF9QQU5FTCx5IGFzIERPTUFJTlNfV0lUSF9DQVJELGsgYXMgRE9NQUlOU19XSVRIX01PUkVfSU5GTyxTIGFzIERPTUFJTlNfSElERV9NT1JFX0lORk8seCBhcyBET01BSU5TX01PUkVfSU5GT19OT19ISVNUT1JZLEQgYXMgU1RBVEVTX09GRixUIGFzIERPTUFJTlNfVE9HR0xFLEUgYXMgVU5JVF9DLE0gYXMgVU5JVF9GLHEgYXMgREVGQVVMVF9WSUVXX0VOVElUWV9JRCxMIGFzIGNyZWF0ZVRoaW5nLE4gYXMgZml4ZWRJY29ucyxPIGFzIGRvbWFpbkljb24saiBhcyBldmFsdWF0ZUZpbHRlcixDIGFzIGZpcmVFdmVudCxVIGFzIGhhbmRsZUFjdGlvbixWIGFzIGhhbmRsZUNsaWNrLHogYXMgZm9yd2FyZEhhcHRpYyxXIGFzIGhhc0FjdGlvbixZIGFzIGhhc0NvbmZpZ09yRW50aXR5Q2hhbmdlZCxHIGFzIGhhc0RvdWJsZUNsaWNrLEYgYXMgbmF2aWdhdGUsQiBhcyB0b2dnbGVFbnRpdHksSCBhcyB0dXJuT25PZmZFbnRpdGllcyxJIGFzIHR1cm5Pbk9mZkVudGl0eSxKIGFzIGdldExvdmVsYWNlLFEgYXMgc3RhdGVJY29ufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm0uanMubWFwXG4iLCJleHBvcnQgZnVuY3Rpb24gYm91bmQwMShuLCBtYXgpIHtcbiAgICBpZiAoaXNPbmVQb2ludFplcm8obikpIHtcbiAgICAgICAgbiA9ICcxMDAlJztcbiAgICB9XG4gICAgdmFyIHByb2Nlc3NQZXJjZW50ID0gaXNQZXJjZW50YWdlKG4pO1xuICAgIG4gPSBtYXggPT09IDM2MCA/IG4gOiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KDAsIHBhcnNlRmxvYXQobikpKTtcbiAgICBpZiAocHJvY2Vzc1BlcmNlbnQpIHtcbiAgICAgICAgbiA9IHBhcnNlSW50KFN0cmluZyhuICogbWF4KSwgMTApIC8gMTAwO1xuICAgIH1cbiAgICBpZiAoTWF0aC5hYnMobiAtIG1heCkgPCAwLjAwMDAwMSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgaWYgKG1heCA9PT0gMzYwKSB7XG4gICAgICAgIG4gPSAobiA8IDAgPyAobiAlIG1heCkgKyBtYXggOiBuICUgbWF4KSAvIHBhcnNlRmxvYXQoU3RyaW5nKG1heCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbiA9IChuICUgbWF4KSAvIHBhcnNlRmxvYXQoU3RyaW5nKG1heCkpO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcDAxKHZhbCkge1xuICAgIHJldHVybiBNYXRoLm1pbigxLCBNYXRoLm1heCgwLCB2YWwpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc09uZVBvaW50WmVybyhuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSAnc3RyaW5nJyAmJiBuLmluY2x1ZGVzKCcuJykgJiYgcGFyc2VGbG9hdChuKSA9PT0gMTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1BlcmNlbnRhZ2Uobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ3N0cmluZycgJiYgbi5pbmNsdWRlcygnJScpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGJvdW5kQWxwaGEoYSkge1xuICAgIGEgPSBwYXJzZUZsb2F0KGEpO1xuICAgIGlmIChpc05hTihhKSB8fCBhIDwgMCB8fCBhID4gMSkge1xuICAgICAgICBhID0gMTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG59XG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvUGVyY2VudGFnZShuKSB7XG4gICAgaWYgKG4gPD0gMSkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKG4pICogMTAwICsgXCIlXCI7XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhZDIoYykge1xuICAgIHJldHVybiBjLmxlbmd0aCA9PT0gMSA/ICcwJyArIGMgOiBTdHJpbmcoYyk7XG59XG4iLCJpbXBvcnQgeyBib3VuZDAxLCBwYWQyIH0gZnJvbSAnLi91dGlsJztcbmV4cG9ydCBmdW5jdGlvbiByZ2JUb1JnYihyLCBnLCBiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcjogYm91bmQwMShyLCAyNTUpICogMjU1LFxuICAgICAgICBnOiBib3VuZDAxKGcsIDI1NSkgKiAyNTUsXG4gICAgICAgIGI6IGJvdW5kMDEoYiwgMjU1KSAqIDI1NSxcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcbiAgICByID0gYm91bmQwMShyLCAyNTUpO1xuICAgIGcgPSBib3VuZDAxKGcsIDI1NSk7XG4gICAgYiA9IGJvdW5kMDEoYiwgMjU1KTtcbiAgICB2YXIgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgdmFyIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgIHZhciBoID0gMDtcbiAgICB2YXIgcyA9IDA7XG4gICAgdmFyIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gICAgaWYgKG1heCA9PT0gbWluKSB7XG4gICAgICAgIHMgPSAwO1xuICAgICAgICBoID0gMDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG4gICAgICAgIHN3aXRjaCAobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6XG4gICAgICAgICAgICAgICAgaCA9ICgoZyAtIGIpIC8gZCkgKyAoZyA8IGIgPyA2IDogMCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6XG4gICAgICAgICAgICAgICAgaCA9ICgoYiAtIHIpIC8gZCkgKyAyO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBiOlxuICAgICAgICAgICAgICAgIGggPSAoKHIgLSBnKSAvIGQpICsgNDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaCAvPSA2O1xuICAgIH1cbiAgICByZXR1cm4geyBoOiBoLCBzOiBzLCBsOiBsIH07XG59XG5mdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpIHtcbiAgICBpZiAodCA8IDApIHtcbiAgICAgICAgdCArPSAxO1xuICAgIH1cbiAgICBpZiAodCA+IDEpIHtcbiAgICAgICAgdCAtPSAxO1xuICAgIH1cbiAgICBpZiAodCA8IDEgLyA2KSB7XG4gICAgICAgIHJldHVybiBwICsgKChxIC0gcCkgKiAoNiAqIHQpKTtcbiAgICB9XG4gICAgaWYgKHQgPCAxIC8gMikge1xuICAgICAgICByZXR1cm4gcTtcbiAgICB9XG4gICAgaWYgKHQgPCAyIC8gMykge1xuICAgICAgICByZXR1cm4gcCArICgocSAtIHApICogKCgyIC8gMykgLSB0KSAqIDYpO1xuICAgIH1cbiAgICByZXR1cm4gcDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoc2xUb1JnYihoLCBzLCBsKSB7XG4gICAgdmFyIHI7XG4gICAgdmFyIGc7XG4gICAgdmFyIGI7XG4gICAgaCA9IGJvdW5kMDEoaCwgMzYwKTtcbiAgICBzID0gYm91bmQwMShzLCAxMDApO1xuICAgIGwgPSBib3VuZDAxKGwsIDEwMCk7XG4gICAgaWYgKHMgPT09IDApIHtcbiAgICAgICAgZyA9IGw7XG4gICAgICAgIGIgPSBsO1xuICAgICAgICByID0gbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBxID0gbCA8IDAuNSA/IChsICogKDEgKyBzKSkgOiAobCArIHMgLSAobCAqIHMpKTtcbiAgICAgICAgdmFyIHAgPSAoMiAqIGwpIC0gcTtcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArICgxIC8gMykpO1xuICAgICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcbiAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtICgxIC8gMykpO1xuICAgIH1cbiAgICByZXR1cm4geyByOiByICogMjU1LCBnOiBnICogMjU1LCBiOiBiICogMjU1IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcmdiVG9Ic3YociwgZywgYikge1xuICAgIHIgPSBib3VuZDAxKHIsIDI1NSk7XG4gICAgZyA9IGJvdW5kMDEoZywgMjU1KTtcbiAgICBiID0gYm91bmQwMShiLCAyNTUpO1xuICAgIHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICB2YXIgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgdmFyIGggPSAwO1xuICAgIHZhciB2ID0gbWF4O1xuICAgIHZhciBkID0gbWF4IC0gbWluO1xuICAgIHZhciBzID0gbWF4ID09PSAwID8gMCA6IGQgLyBtYXg7XG4gICAgaWYgKG1heCA9PT0gbWluKSB7XG4gICAgICAgIGggPSAwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3dpdGNoIChtYXgpIHtcbiAgICAgICAgICAgIGNhc2UgcjpcbiAgICAgICAgICAgICAgICBoID0gKChnIC0gYikgLyBkKSArIChnIDwgYiA/IDYgOiAwKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZzpcbiAgICAgICAgICAgICAgICBoID0gKChiIC0gcikgLyBkKSArIDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGI6XG4gICAgICAgICAgICAgICAgaCA9ICgociAtIGcpIC8gZCkgKyA0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBoIC89IDY7XG4gICAgfVxuICAgIHJldHVybiB7IGg6IGgsIHM6IHMsIHY6IHYgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBoc3ZUb1JnYihoLCBzLCB2KSB7XG4gICAgaCA9IGJvdW5kMDEoaCwgMzYwKSAqIDY7XG4gICAgcyA9IGJvdW5kMDEocywgMTAwKTtcbiAgICB2ID0gYm91bmQwMSh2LCAxMDApO1xuICAgIHZhciBpID0gTWF0aC5mbG9vcihoKTtcbiAgICB2YXIgZiA9IGggLSBpO1xuICAgIHZhciBwID0gdiAqICgxIC0gcyk7XG4gICAgdmFyIHEgPSB2ICogKDEgLSAoZiAqIHMpKTtcbiAgICB2YXIgdCA9IHYgKiAoMSAtICgoMSAtIGYpICogcykpO1xuICAgIHZhciBtb2QgPSBpICUgNjtcbiAgICB2YXIgciA9IFt2LCBxLCBwLCBwLCB0LCB2XVttb2RdO1xuICAgIHZhciBnID0gW3QsIHYsIHYsIHEsIHAsIHBdW21vZF07XG4gICAgdmFyIGIgPSBbcCwgcCwgdCwgdiwgdiwgcV1bbW9kXTtcbiAgICByZXR1cm4geyByOiByICogMjU1LCBnOiBnICogMjU1LCBiOiBiICogMjU1IH07XG59XG5leHBvcnQgZnVuY3Rpb24gcmdiVG9IZXgociwgZywgYiwgYWxsb3czQ2hhcikge1xuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIoTWF0aC5yb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKE1hdGgucm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihNYXRoLnJvdW5kKGIpLnRvU3RyaW5nKDE2KSksXG4gICAgXTtcbiAgICBpZiAoYWxsb3czQ2hhciAmJlxuICAgICAgICBoZXhbMF0uc3RhcnRzV2l0aChoZXhbMF0uY2hhckF0KDEpKSAmJlxuICAgICAgICBoZXhbMV0uc3RhcnRzV2l0aChoZXhbMV0uY2hhckF0KDEpKSAmJlxuICAgICAgICBoZXhbMl0uc3RhcnRzV2l0aChoZXhbMl0uY2hhckF0KDEpKSkge1xuICAgICAgICByZXR1cm4gaGV4WzBdLmNoYXJBdCgwKSArIGhleFsxXS5jaGFyQXQoMCkgKyBoZXhbMl0uY2hhckF0KDApO1xuICAgIH1cbiAgICByZXR1cm4gaGV4LmpvaW4oJycpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJnYmFUb0hleChyLCBnLCBiLCBhLCBhbGxvdzRDaGFyKSB7XG4gICAgdmFyIGhleCA9IFtcbiAgICAgICAgcGFkMihNYXRoLnJvdW5kKHIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIoTWF0aC5yb3VuZChnKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKE1hdGgucm91bmQoYikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihjb252ZXJ0RGVjaW1hbFRvSGV4KGEpKSxcbiAgICBdO1xuICAgIGlmIChhbGxvdzRDaGFyICYmXG4gICAgICAgIGhleFswXS5zdGFydHNXaXRoKGhleFswXS5jaGFyQXQoMSkpICYmXG4gICAgICAgIGhleFsxXS5zdGFydHNXaXRoKGhleFsxXS5jaGFyQXQoMSkpICYmXG4gICAgICAgIGhleFsyXS5zdGFydHNXaXRoKGhleFsyXS5jaGFyQXQoMSkpICYmXG4gICAgICAgIGhleFszXS5zdGFydHNXaXRoKGhleFszXS5jaGFyQXQoMSkpKSB7XG4gICAgICAgIHJldHVybiBoZXhbMF0uY2hhckF0KDApICsgaGV4WzFdLmNoYXJBdCgwKSArIGhleFsyXS5jaGFyQXQoMCkgKyBoZXhbM10uY2hhckF0KDApO1xuICAgIH1cbiAgICByZXR1cm4gaGV4LmpvaW4oJycpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJnYmFUb0FyZ2JIZXgociwgZywgYiwgYSkge1xuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIoY29udmVydERlY2ltYWxUb0hleChhKSksXG4gICAgICAgIHBhZDIoTWF0aC5yb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKE1hdGgucm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihNYXRoLnJvdW5kKGIpLnRvU3RyaW5nKDE2KSksXG4gICAgXTtcbiAgICByZXR1cm4gaGV4LmpvaW4oJycpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnREZWNpbWFsVG9IZXgoZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZCkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0SGV4VG9EZWNpbWFsKGgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnRGcm9tSGV4KGgpIC8gMjU1O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSW50RnJvbUhleCh2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxNik7XG59XG4iLCJleHBvcnQgdmFyIG5hbWVzID0ge1xuICAgIGFsaWNlYmx1ZTogJyNmMGY4ZmYnLFxuICAgIGFudGlxdWV3aGl0ZTogJyNmYWViZDcnLFxuICAgIGFxdWE6ICcjMDBmZmZmJyxcbiAgICBhcXVhbWFyaW5lOiAnIzdmZmZkNCcsXG4gICAgYXp1cmU6ICcjZjBmZmZmJyxcbiAgICBiZWlnZTogJyNmNWY1ZGMnLFxuICAgIGJpc3F1ZTogJyNmZmU0YzQnLFxuICAgIGJsYWNrOiAnIzAwMDAwMCcsXG4gICAgYmxhbmNoZWRhbG1vbmQ6ICcjZmZlYmNkJyxcbiAgICBibHVlOiAnIzAwMDBmZicsXG4gICAgYmx1ZXZpb2xldDogJyM4YTJiZTInLFxuICAgIGJyb3duOiAnI2E1MmEyYScsXG4gICAgYnVybHl3b29kOiAnI2RlYjg4NycsXG4gICAgY2FkZXRibHVlOiAnIzVmOWVhMCcsXG4gICAgY2hhcnRyZXVzZTogJyM3ZmZmMDAnLFxuICAgIGNob2NvbGF0ZTogJyNkMjY5MWUnLFxuICAgIGNvcmFsOiAnI2ZmN2Y1MCcsXG4gICAgY29ybmZsb3dlcmJsdWU6ICcjNjQ5NWVkJyxcbiAgICBjb3Juc2lsazogJyNmZmY4ZGMnLFxuICAgIGNyaW1zb246ICcjZGMxNDNjJyxcbiAgICBjeWFuOiAnIzAwZmZmZicsXG4gICAgZGFya2JsdWU6ICcjMDAwMDhiJyxcbiAgICBkYXJrY3lhbjogJyMwMDhiOGInLFxuICAgIGRhcmtnb2xkZW5yb2Q6ICcjYjg4NjBiJyxcbiAgICBkYXJrZ3JheTogJyNhOWE5YTknLFxuICAgIGRhcmtncmVlbjogJyMwMDY0MDAnLFxuICAgIGRhcmtncmV5OiAnI2E5YTlhOScsXG4gICAgZGFya2toYWtpOiAnI2JkYjc2YicsXG4gICAgZGFya21hZ2VudGE6ICcjOGIwMDhiJyxcbiAgICBkYXJrb2xpdmVncmVlbjogJyM1NTZiMmYnLFxuICAgIGRhcmtvcmFuZ2U6ICcjZmY4YzAwJyxcbiAgICBkYXJrb3JjaGlkOiAnIzk5MzJjYycsXG4gICAgZGFya3JlZDogJyM4YjAwMDAnLFxuICAgIGRhcmtzYWxtb246ICcjZTk5NjdhJyxcbiAgICBkYXJrc2VhZ3JlZW46ICcjOGZiYzhmJyxcbiAgICBkYXJrc2xhdGVibHVlOiAnIzQ4M2Q4YicsXG4gICAgZGFya3NsYXRlZ3JheTogJyMyZjRmNGYnLFxuICAgIGRhcmtzbGF0ZWdyZXk6ICcjMmY0ZjRmJyxcbiAgICBkYXJrdHVycXVvaXNlOiAnIzAwY2VkMScsXG4gICAgZGFya3Zpb2xldDogJyM5NDAwZDMnLFxuICAgIGRlZXBwaW5rOiAnI2ZmMTQ5MycsXG4gICAgZGVlcHNreWJsdWU6ICcjMDBiZmZmJyxcbiAgICBkaW1ncmF5OiAnIzY5Njk2OScsXG4gICAgZGltZ3JleTogJyM2OTY5NjknLFxuICAgIGRvZGdlcmJsdWU6ICcjMWU5MGZmJyxcbiAgICBmaXJlYnJpY2s6ICcjYjIyMjIyJyxcbiAgICBmbG9yYWx3aGl0ZTogJyNmZmZhZjAnLFxuICAgIGZvcmVzdGdyZWVuOiAnIzIyOGIyMicsXG4gICAgZnVjaHNpYTogJyNmZjAwZmYnLFxuICAgIGdhaW5zYm9ybzogJyNkY2RjZGMnLFxuICAgIGdob3N0d2hpdGU6ICcjZjhmOGZmJyxcbiAgICBnb2xkOiAnI2ZmZDcwMCcsXG4gICAgZ29sZGVucm9kOiAnI2RhYTUyMCcsXG4gICAgZ3JheTogJyM4MDgwODAnLFxuICAgIGdyZWVuOiAnIzAwODAwMCcsXG4gICAgZ3JlZW55ZWxsb3c6ICcjYWRmZjJmJyxcbiAgICBncmV5OiAnIzgwODA4MCcsXG4gICAgaG9uZXlkZXc6ICcjZjBmZmYwJyxcbiAgICBob3RwaW5rOiAnI2ZmNjliNCcsXG4gICAgaW5kaWFucmVkOiAnI2NkNWM1YycsXG4gICAgaW5kaWdvOiAnIzRiMDA4MicsXG4gICAgaXZvcnk6ICcjZmZmZmYwJyxcbiAgICBraGFraTogJyNmMGU2OGMnLFxuICAgIGxhdmVuZGVyOiAnI2U2ZTZmYScsXG4gICAgbGF2ZW5kZXJibHVzaDogJyNmZmYwZjUnLFxuICAgIGxhd25ncmVlbjogJyM3Y2ZjMDAnLFxuICAgIGxlbW9uY2hpZmZvbjogJyNmZmZhY2QnLFxuICAgIGxpZ2h0Ymx1ZTogJyNhZGQ4ZTYnLFxuICAgIGxpZ2h0Y29yYWw6ICcjZjA4MDgwJyxcbiAgICBsaWdodGN5YW46ICcjZTBmZmZmJyxcbiAgICBsaWdodGdvbGRlbnJvZHllbGxvdzogJyNmYWZhZDInLFxuICAgIGxpZ2h0Z3JheTogJyNkM2QzZDMnLFxuICAgIGxpZ2h0Z3JlZW46ICcjOTBlZTkwJyxcbiAgICBsaWdodGdyZXk6ICcjZDNkM2QzJyxcbiAgICBsaWdodHBpbms6ICcjZmZiNmMxJyxcbiAgICBsaWdodHNhbG1vbjogJyNmZmEwN2EnLFxuICAgIGxpZ2h0c2VhZ3JlZW46ICcjMjBiMmFhJyxcbiAgICBsaWdodHNreWJsdWU6ICcjODdjZWZhJyxcbiAgICBsaWdodHNsYXRlZ3JheTogJyM3Nzg4OTknLFxuICAgIGxpZ2h0c2xhdGVncmV5OiAnIzc3ODg5OScsXG4gICAgbGlnaHRzdGVlbGJsdWU6ICcjYjBjNGRlJyxcbiAgICBsaWdodHllbGxvdzogJyNmZmZmZTAnLFxuICAgIGxpbWU6ICcjMDBmZjAwJyxcbiAgICBsaW1lZ3JlZW46ICcjMzJjZDMyJyxcbiAgICBsaW5lbjogJyNmYWYwZTYnLFxuICAgIG1hZ2VudGE6ICcjZmYwMGZmJyxcbiAgICBtYXJvb246ICcjODAwMDAwJyxcbiAgICBtZWRpdW1hcXVhbWFyaW5lOiAnIzY2Y2RhYScsXG4gICAgbWVkaXVtYmx1ZTogJyMwMDAwY2QnLFxuICAgIG1lZGl1bW9yY2hpZDogJyNiYTU1ZDMnLFxuICAgIG1lZGl1bXB1cnBsZTogJyM5MzcwZGInLFxuICAgIG1lZGl1bXNlYWdyZWVuOiAnIzNjYjM3MScsXG4gICAgbWVkaXVtc2xhdGVibHVlOiAnIzdiNjhlZScsXG4gICAgbWVkaXVtc3ByaW5nZ3JlZW46ICcjMDBmYTlhJyxcbiAgICBtZWRpdW10dXJxdW9pc2U6ICcjNDhkMWNjJyxcbiAgICBtZWRpdW12aW9sZXRyZWQ6ICcjYzcxNTg1JyxcbiAgICBtaWRuaWdodGJsdWU6ICcjMTkxOTcwJyxcbiAgICBtaW50Y3JlYW06ICcjZjVmZmZhJyxcbiAgICBtaXN0eXJvc2U6ICcjZmZlNGUxJyxcbiAgICBtb2NjYXNpbjogJyNmZmU0YjUnLFxuICAgIG5hdmFqb3doaXRlOiAnI2ZmZGVhZCcsXG4gICAgbmF2eTogJyMwMDAwODAnLFxuICAgIG9sZGxhY2U6ICcjZmRmNWU2JyxcbiAgICBvbGl2ZTogJyM4MDgwMDAnLFxuICAgIG9saXZlZHJhYjogJyM2YjhlMjMnLFxuICAgIG9yYW5nZTogJyNmZmE1MDAnLFxuICAgIG9yYW5nZXJlZDogJyNmZjQ1MDAnLFxuICAgIG9yY2hpZDogJyNkYTcwZDYnLFxuICAgIHBhbGVnb2xkZW5yb2Q6ICcjZWVlOGFhJyxcbiAgICBwYWxlZ3JlZW46ICcjOThmYjk4JyxcbiAgICBwYWxldHVycXVvaXNlOiAnI2FmZWVlZScsXG4gICAgcGFsZXZpb2xldHJlZDogJyNkYjcwOTMnLFxuICAgIHBhcGF5YXdoaXA6ICcjZmZlZmQ1JyxcbiAgICBwZWFjaHB1ZmY6ICcjZmZkYWI5JyxcbiAgICBwZXJ1OiAnI2NkODUzZicsXG4gICAgcGluazogJyNmZmMwY2InLFxuICAgIHBsdW06ICcjZGRhMGRkJyxcbiAgICBwb3dkZXJibHVlOiAnI2IwZTBlNicsXG4gICAgcHVycGxlOiAnIzgwMDA4MCcsXG4gICAgcmViZWNjYXB1cnBsZTogJyM2NjMzOTknLFxuICAgIHJlZDogJyNmZjAwMDAnLFxuICAgIHJvc3licm93bjogJyNiYzhmOGYnLFxuICAgIHJveWFsYmx1ZTogJyM0MTY5ZTEnLFxuICAgIHNhZGRsZWJyb3duOiAnIzhiNDUxMycsXG4gICAgc2FsbW9uOiAnI2ZhODA3MicsXG4gICAgc2FuZHlicm93bjogJyNmNGE0NjAnLFxuICAgIHNlYWdyZWVuOiAnIzJlOGI1NycsXG4gICAgc2Vhc2hlbGw6ICcjZmZmNWVlJyxcbiAgICBzaWVubmE6ICcjYTA1MjJkJyxcbiAgICBzaWx2ZXI6ICcjYzBjMGMwJyxcbiAgICBza3libHVlOiAnIzg3Y2VlYicsXG4gICAgc2xhdGVibHVlOiAnIzZhNWFjZCcsXG4gICAgc2xhdGVncmF5OiAnIzcwODA5MCcsXG4gICAgc2xhdGVncmV5OiAnIzcwODA5MCcsXG4gICAgc25vdzogJyNmZmZhZmEnLFxuICAgIHNwcmluZ2dyZWVuOiAnIzAwZmY3ZicsXG4gICAgc3RlZWxibHVlOiAnIzQ2ODJiNCcsXG4gICAgdGFuOiAnI2QyYjQ4YycsXG4gICAgdGVhbDogJyMwMDgwODAnLFxuICAgIHRoaXN0bGU6ICcjZDhiZmQ4JyxcbiAgICB0b21hdG86ICcjZmY2MzQ3JyxcbiAgICB0dXJxdW9pc2U6ICcjNDBlMGQwJyxcbiAgICB2aW9sZXQ6ICcjZWU4MmVlJyxcbiAgICB3aGVhdDogJyNmNWRlYjMnLFxuICAgIHdoaXRlOiAnI2ZmZmZmZicsXG4gICAgd2hpdGVzbW9rZTogJyNmNWY1ZjUnLFxuICAgIHllbGxvdzogJyNmZmZmMDAnLFxuICAgIHllbGxvd2dyZWVuOiAnIzlhY2QzMicsXG59O1xuIiwiaW1wb3J0IHsgY29udmVydEhleFRvRGVjaW1hbCwgaHNsVG9SZ2IsIGhzdlRvUmdiLCBwYXJzZUludEZyb21IZXgsIHJnYlRvUmdiIH0gZnJvbSAnLi9jb252ZXJzaW9uJztcbmltcG9ydCB7IG5hbWVzIH0gZnJvbSAnLi9jc3MtY29sb3ItbmFtZXMnO1xuaW1wb3J0IHsgYm91bmRBbHBoYSwgY29udmVydFRvUGVyY2VudGFnZSB9IGZyb20gJy4vdXRpbCc7XG5leHBvcnQgZnVuY3Rpb24gaW5wdXRUb1JHQihjb2xvcikge1xuICAgIHZhciByZ2IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcbiAgICB2YXIgYSA9IDE7XG4gICAgdmFyIHMgPSBudWxsO1xuICAgIHZhciB2ID0gbnVsbDtcbiAgICB2YXIgbCA9IG51bGw7XG4gICAgdmFyIG9rID0gZmFsc2U7XG4gICAgdmFyIGZvcm1hdCA9IGZhbHNlO1xuICAgIGlmICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbG9yID0gc3RyaW5nSW5wdXRUb09iamVjdChjb2xvcik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29sb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChpc1ZhbGlkQ1NTVW5pdChjb2xvci5yKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5nKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5iKSkge1xuICAgICAgICAgICAgcmdiID0gcmdiVG9SZ2IoY29sb3IuciwgY29sb3IuZywgY29sb3IuYik7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSBTdHJpbmcoY29sb3Iucikuc3Vic3RyKC0xKSA9PT0gJyUnID8gJ3ByZ2InIDogJ3JnYic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNWYWxpZENTU1VuaXQoY29sb3IuaCkgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IucykgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IudikpIHtcbiAgICAgICAgICAgIHMgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnMpO1xuICAgICAgICAgICAgdiA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iudik7XG4gICAgICAgICAgICByZ2IgPSBoc3ZUb1JnYihjb2xvci5oLCBzLCB2KTtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcm1hdCA9ICdoc3YnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzVmFsaWRDU1NVbml0KGNvbG9yLmgpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLnMpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLmwpKSB7XG4gICAgICAgICAgICBzID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5zKTtcbiAgICAgICAgICAgIGwgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLmwpO1xuICAgICAgICAgICAgcmdiID0gaHNsVG9SZ2IoY29sb3IuaCwgcywgbCk7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSAnaHNsJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbG9yLCAnYScpKSB7XG4gICAgICAgICAgICBhID0gY29sb3IuYTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhID0gYm91bmRBbHBoYShhKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBvazogb2ssXG4gICAgICAgIGZvcm1hdDogY29sb3IuZm9ybWF0IHx8IGZvcm1hdCxcbiAgICAgICAgcjogTWF0aC5taW4oMjU1LCBNYXRoLm1heChyZ2IuciwgMCkpLFxuICAgICAgICBnOiBNYXRoLm1pbigyNTUsIE1hdGgubWF4KHJnYi5nLCAwKSksXG4gICAgICAgIGI6IE1hdGgubWluKDI1NSwgTWF0aC5tYXgocmdiLmIsIDApKSxcbiAgICAgICAgYTogYSxcbiAgICB9O1xufVxudmFyIENTU19JTlRFR0VSID0gJ1stXFxcXCtdP1xcXFxkKyU/JztcbnZhciBDU1NfTlVNQkVSID0gJ1stXFxcXCtdP1xcXFxkKlxcXFwuXFxcXGQrJT8nO1xudmFyIENTU19VTklUID0gXCIoPzpcIiArIENTU19OVU1CRVIgKyBcIil8KD86XCIgKyBDU1NfSU5URUdFUiArIFwiKVwiO1xudmFyIFBFUk1JU1NJVkVfTUFUQ0gzID0gXCJbXFxcXHN8XFxcXChdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpXFxcXHMqXFxcXCk/XCI7XG52YXIgUEVSTUlTU0lWRV9NQVRDSDQgPSBcIltcXFxcc3xcXFxcKF0rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilcXFxccypcXFxcKT9cIjtcbnZhciBtYXRjaGVycyA9IHtcbiAgICBDU1NfVU5JVDogbmV3IFJlZ0V4cChDU1NfVU5JVCksXG4gICAgcmdiOiBuZXcgUmVnRXhwKCdyZ2InICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgIHJnYmE6IG5ldyBSZWdFeHAoJ3JnYmEnICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgIGhzbDogbmV3IFJlZ0V4cCgnaHNsJyArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICBoc2xhOiBuZXcgUmVnRXhwKCdoc2xhJyArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICBoc3Y6IG5ldyBSZWdFeHAoJ2hzdicgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgaHN2YTogbmV3IFJlZ0V4cCgnaHN2YScgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgaGV4MzogL14jPyhbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KSQvLFxuICAgIGhleDY6IC9eIz8oWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkkLyxcbiAgICBoZXg0OiAvXiM/KFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KSQvLFxuICAgIGhleDg6IC9eIz8oWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pJC8sXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ0lucHV0VG9PYmplY3QoY29sb3IpIHtcbiAgICBjb2xvciA9IGNvbG9yLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChjb2xvci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbmFtZWQgPSBmYWxzZTtcbiAgICBpZiAobmFtZXNbY29sb3JdKSB7XG4gICAgICAgIGNvbG9yID0gbmFtZXNbY29sb3JdO1xuICAgICAgICBuYW1lZCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNvbG9yID09PSAndHJhbnNwYXJlbnQnKSB7XG4gICAgICAgIHJldHVybiB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAsIGZvcm1hdDogJ25hbWUnIH07XG4gICAgfVxuICAgIHZhciBtYXRjaCA9IG1hdGNoZXJzLnJnYi5leGVjKGNvbG9yKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0Y2hbMV0sIGc6IG1hdGNoWzJdLCBiOiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBtYXRjaCA9IG1hdGNoZXJzLnJnYmEuZXhlYyhjb2xvcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGNoWzFdLCBnOiBtYXRjaFsyXSwgYjogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIG1hdGNoID0gbWF0Y2hlcnMuaHNsLmV4ZWMoY29sb3IpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIGw6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIG1hdGNoID0gbWF0Y2hlcnMuaHNsYS5leGVjKGNvbG9yKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCBsOiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgbWF0Y2ggPSBtYXRjaGVycy5oc3YuZXhlYyhjb2xvcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgdjogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgbWF0Y2ggPSBtYXRjaGVycy5oc3ZhLmV4ZWMoY29sb3IpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIHY6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBtYXRjaCA9IG1hdGNoZXJzLmhleDguZXhlYyhjb2xvcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSksXG4gICAgICAgICAgICBhOiBjb252ZXJ0SGV4VG9EZWNpbWFsKG1hdGNoWzRdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyAnbmFtZScgOiAnaGV4OCcsXG4gICAgICAgIH07XG4gICAgfVxuICAgIG1hdGNoID0gbWF0Y2hlcnMuaGV4Ni5leGVjKGNvbG9yKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyAnbmFtZScgOiAnaGV4JyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgbWF0Y2ggPSBtYXRjaGVycy5oZXg0LmV4ZWMoY29sb3IpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdICsgbWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdICsgbWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdICsgbWF0Y2hbM10pLFxuICAgICAgICAgICAgYTogY29udmVydEhleFRvRGVjaW1hbChtYXRjaFs0XSArIG1hdGNoWzRdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyAnbmFtZScgOiAnaGV4OCcsXG4gICAgICAgIH07XG4gICAgfVxuICAgIG1hdGNoID0gbWF0Y2hlcnMuaGV4My5leGVjKGNvbG9yKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSArIG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSArIG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSArIG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyAnbmFtZScgOiAnaGV4JyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRDU1NVbml0KGNvbG9yKSB7XG4gICAgcmV0dXJuIEJvb2xlYW4obWF0Y2hlcnMuQ1NTX1VOSVQuZXhlYyhTdHJpbmcoY29sb3IpKSk7XG59XG4iLCJpbXBvcnQgeyByZ2JhVG9IZXgsIHJnYlRvSGV4LCByZ2JUb0hzbCwgcmdiVG9Ic3YgfSBmcm9tICcuL2NvbnZlcnNpb24nO1xuaW1wb3J0IHsgbmFtZXMgfSBmcm9tICcuL2Nzcy1jb2xvci1uYW1lcyc7XG5pbXBvcnQgeyBpbnB1dFRvUkdCIH0gZnJvbSAnLi9mb3JtYXQtaW5wdXQnO1xuaW1wb3J0IHsgYm91bmQwMSwgYm91bmRBbHBoYSwgY2xhbXAwMSB9IGZyb20gJy4vdXRpbCc7XG52YXIgVGlueUNvbG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUaW55Q29sb3IoY29sb3IsIG9wdHMpIHtcbiAgICAgICAgaWYgKGNvbG9yID09PSB2b2lkIDApIHsgY29sb3IgPSAnJzsgfVxuICAgICAgICBpZiAob3B0cyA9PT0gdm9pZCAwKSB7IG9wdHMgPSB7fTsgfVxuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIFRpbnlDb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub3JpZ2luYWxJbnB1dCA9IGNvbG9yO1xuICAgICAgICB2YXIgcmdiID0gaW5wdXRUb1JHQihjb2xvcik7XG4gICAgICAgIHRoaXMub3JpZ2luYWxJbnB1dCA9IGNvbG9yO1xuICAgICAgICB0aGlzLnIgPSByZ2IucjtcbiAgICAgICAgdGhpcy5nID0gcmdiLmc7XG4gICAgICAgIHRoaXMuYiA9IHJnYi5iO1xuICAgICAgICB0aGlzLmEgPSByZ2IuYTtcbiAgICAgICAgdGhpcy5yb3VuZEEgPSBNYXRoLnJvdW5kKDEwMCAqIHRoaXMuYSkgLyAxMDA7XG4gICAgICAgIHRoaXMuZm9ybWF0ID0gKF9hID0gb3B0cy5mb3JtYXQsIChfYSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiByZ2IuZm9ybWF0KSk7XG4gICAgICAgIHRoaXMuZ3JhZGllbnRUeXBlID0gb3B0cy5ncmFkaWVudFR5cGU7XG4gICAgICAgIGlmICh0aGlzLnIgPCAxKSB7XG4gICAgICAgICAgICB0aGlzLnIgPSBNYXRoLnJvdW5kKHRoaXMucik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZyA8IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZyA9IE1hdGgucm91bmQodGhpcy5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5iIDwgMSkge1xuICAgICAgICAgICAgdGhpcy5iID0gTWF0aC5yb3VuZCh0aGlzLmIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNWYWxpZCA9IHJnYi5vaztcbiAgICB9XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5pc0RhcmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEJyaWdodG5lc3MoKSA8IDEyODtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuaXNMaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzRGFyaygpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5nZXRCcmlnaHRuZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JnYigpO1xuICAgICAgICByZXR1cm4gKChyZ2IuciAqIDI5OSkgKyAocmdiLmcgKiA1ODcpICsgKHJnYi5iICogMTE0KSkgLyAxMDAwO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5nZXRMdW1pbmFuY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZ2IgPSB0aGlzLnRvUmdiKCk7XG4gICAgICAgIHZhciBSO1xuICAgICAgICB2YXIgRztcbiAgICAgICAgdmFyIEI7XG4gICAgICAgIHZhciBSc1JHQiA9IHJnYi5yIC8gMjU1O1xuICAgICAgICB2YXIgR3NSR0IgPSByZ2IuZyAvIDI1NTtcbiAgICAgICAgdmFyIEJzUkdCID0gcmdiLmIgLyAyNTU7XG4gICAgICAgIGlmIChSc1JHQiA8PSAwLjAzOTI4KSB7XG4gICAgICAgICAgICBSID0gUnNSR0IgLyAxMi45MjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFIgPSBNYXRoLnBvdygoUnNSR0IgKyAwLjA1NSkgLyAxLjA1NSwgMi40KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoR3NSR0IgPD0gMC4wMzkyOCkge1xuICAgICAgICAgICAgRyA9IEdzUkdCIC8gMTIuOTI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBHID0gTWF0aC5wb3coKEdzUkdCICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEJzUkdCIDw9IDAuMDM5MjgpIHtcbiAgICAgICAgICAgIEIgPSBCc1JHQiAvIDEyLjkyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQiA9IE1hdGgucG93KChCc1JHQiArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoMC4yMTI2ICogUikgKyAoMC43MTUyICogRykgKyAoMC4wNzIyICogQik7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLmdldEFscGhhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5zZXRBbHBoYSA9IGZ1bmN0aW9uIChhbHBoYSkge1xuICAgICAgICB0aGlzLmEgPSBib3VuZEFscGhhKGFscGhhKTtcbiAgICAgICAgdGhpcy5yb3VuZEEgPSBNYXRoLnJvdW5kKDEwMCAqIHRoaXMuYSkgLyAxMDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b0hzdiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGhzdiA9IHJnYlRvSHN2KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICAgICAgICByZXR1cm4geyBoOiBoc3YuaCAqIDM2MCwgczogaHN2LnMsIHY6IGhzdi52LCBhOiB0aGlzLmEgfTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9Ic3ZTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoc3YgPSByZ2JUb0hzdih0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcbiAgICAgICAgdmFyIGggPSBNYXRoLnJvdW5kKGhzdi5oICogMzYwKTtcbiAgICAgICAgdmFyIHMgPSBNYXRoLnJvdW5kKGhzdi5zICogMTAwKTtcbiAgICAgICAgdmFyIHYgPSBNYXRoLnJvdW5kKGhzdi52ICogMTAwKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYSA9PT0gMSA/IFwiaHN2KFwiICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgdiArIFwiJSlcIiA6IFwiaHN2YShcIiArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIHYgKyBcIiUsIFwiICsgdGhpcy5yb3VuZEEgKyBcIilcIjtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9Ic2wgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoc2wgPSByZ2JUb0hzbCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcbiAgICAgICAgcmV0dXJuIHsgaDogaHNsLmggKiAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCwgYTogdGhpcy5hIH07XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvSHNsU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaHNsID0gcmdiVG9Ic2wodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gICAgICAgIHZhciBoID0gTWF0aC5yb3VuZChoc2wuaCAqIDM2MCk7XG4gICAgICAgIHZhciBzID0gTWF0aC5yb3VuZChoc2wucyAqIDEwMCk7XG4gICAgICAgIHZhciBsID0gTWF0aC5yb3VuZChoc2wubCAqIDEwMCk7XG4gICAgICAgIHJldHVybiB0aGlzLmEgPT09IDEgPyBcImhzbChcIiArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIGwgKyBcIiUpXCIgOiBcImhzbGEoXCIgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyBsICsgXCIlLCBcIiArIHRoaXMucm91bmRBICsgXCIpXCI7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvSGV4ID0gZnVuY3Rpb24gKGFsbG93M0NoYXIpIHtcbiAgICAgICAgaWYgKGFsbG93M0NoYXIgPT09IHZvaWQgMCkgeyBhbGxvdzNDaGFyID0gZmFsc2U7IH1cbiAgICAgICAgcmV0dXJuIHJnYlRvSGV4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIGFsbG93M0NoYXIpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b0hleFN0cmluZyA9IGZ1bmN0aW9uIChhbGxvdzNDaGFyKSB7XG4gICAgICAgIGlmIChhbGxvdzNDaGFyID09PSB2b2lkIDApIHsgYWxsb3czQ2hhciA9IGZhbHNlOyB9XG4gICAgICAgIHJldHVybiAnIycgKyB0aGlzLnRvSGV4KGFsbG93M0NoYXIpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS50b0hleDggPSBmdW5jdGlvbiAoYWxsb3c0Q2hhcikge1xuICAgICAgICBpZiAoYWxsb3c0Q2hhciA9PT0gdm9pZCAwKSB7IGFsbG93NENoYXIgPSBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gcmdiYVRvSGV4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIsIHRoaXMuYSwgYWxsb3c0Q2hhcik7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvSGV4OFN0cmluZyA9IGZ1bmN0aW9uIChhbGxvdzRDaGFyKSB7XG4gICAgICAgIGlmIChhbGxvdzRDaGFyID09PSB2b2lkIDApIHsgYWxsb3c0Q2hhciA9IGZhbHNlOyB9XG4gICAgICAgIHJldHVybiAnIycgKyB0aGlzLnRvSGV4OChhbGxvdzRDaGFyKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9SZ2IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBNYXRoLnJvdW5kKHRoaXMuciksXG4gICAgICAgICAgICBnOiBNYXRoLnJvdW5kKHRoaXMuZyksXG4gICAgICAgICAgICBiOiBNYXRoLnJvdW5kKHRoaXMuYiksXG4gICAgICAgICAgICBhOiB0aGlzLmEsXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvUmdiU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgciA9IE1hdGgucm91bmQodGhpcy5yKTtcbiAgICAgICAgdmFyIGcgPSBNYXRoLnJvdW5kKHRoaXMuZyk7XG4gICAgICAgIHZhciBiID0gTWF0aC5yb3VuZCh0aGlzLmIpO1xuICAgICAgICByZXR1cm4gdGhpcy5hID09PSAxID8gXCJyZ2IoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIilcIiA6IFwicmdiYShcIiArIHIgKyBcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCBcIiArIHRoaXMucm91bmRBICsgXCIpXCI7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvUGVyY2VudGFnZVJnYiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZtdCA9IGZ1bmN0aW9uICh4KSB7IHJldHVybiBNYXRoLnJvdW5kKGJvdW5kMDEoeCwgMjU1KSAqIDEwMCkgKyBcIiVcIjsgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IGZtdCh0aGlzLnIpLFxuICAgICAgICAgICAgZzogZm10KHRoaXMuZyksXG4gICAgICAgICAgICBiOiBmbXQodGhpcy5iKSxcbiAgICAgICAgICAgIGE6IHRoaXMuYSxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9QZXJjZW50YWdlUmdiU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcm5kID0gZnVuY3Rpb24gKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoYm91bmQwMSh4LCAyNTUpICogMTAwKTsgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYSA9PT0gMSA/XG4gICAgICAgICAgICBcInJnYihcIiArIHJuZCh0aGlzLnIpICsgXCIlLCBcIiArIHJuZCh0aGlzLmcpICsgXCIlLCBcIiArIHJuZCh0aGlzLmIpICsgXCIlKVwiIDpcbiAgICAgICAgICAgIFwicmdiYShcIiArIHJuZCh0aGlzLnIpICsgXCIlLCBcIiArIHJuZCh0aGlzLmcpICsgXCIlLCBcIiArIHJuZCh0aGlzLmIpICsgXCIlLCBcIiArIHRoaXMucm91bmRBICsgXCIpXCI7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRvTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICd0cmFuc3BhcmVudCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaGV4ID0gJyMnICsgcmdiVG9IZXgodGhpcy5yLCB0aGlzLmcsIHRoaXMuYiwgZmFsc2UpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gT2JqZWN0LmtleXMobmFtZXMpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmIChuYW1lc1trZXldID09PSBoZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHZhciBmb3JtYXRTZXQgPSBCb29sZWFuKGZvcm1hdCk7XG4gICAgICAgIGZvcm1hdCA9IChmb3JtYXQgIT09IG51bGwgJiYgZm9ybWF0ICE9PSB2b2lkIDAgPyBmb3JtYXQgOiB0aGlzLmZvcm1hdCk7XG4gICAgICAgIHZhciBmb3JtYXR0ZWRTdHJpbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGhhc0FscGhhID0gdGhpcy5hIDwgMSAmJiB0aGlzLmEgPj0gMDtcbiAgICAgICAgdmFyIG5lZWRzQWxwaGFGb3JtYXQgPSAhZm9ybWF0U2V0ICYmIGhhc0FscGhhICYmIChmb3JtYXQuc3RhcnRzV2l0aCgnaGV4JykgfHwgZm9ybWF0ID09PSAnbmFtZScpO1xuICAgICAgICBpZiAobmVlZHNBbHBoYUZvcm1hdCkge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ25hbWUnICYmIHRoaXMuYSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvTmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9SZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAncmdiJykge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b1JnYlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdwcmdiJykge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAnaGV4JyB8fCBmb3JtYXQgPT09ICdoZXg2Jykge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdoZXgzJykge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleFN0cmluZyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAnaGV4NCcpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXg4U3RyaW5nKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09ICdoZXg4Jykge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleDhTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAnbmFtZScpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9OYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2hzbCcpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9Ic2xTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSAnaHN2Jykge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hzdlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWRTdHJpbmcgfHwgdGhpcy50b0hleFN0cmluZygpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW55Q29sb3IodGhpcy50b1N0cmluZygpKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUubGlnaHRlbiA9IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgaWYgKGFtb3VudCA9PT0gdm9pZCAwKSB7IGFtb3VudCA9IDEwOyB9XG4gICAgICAgIHZhciBoc2wgPSB0aGlzLnRvSHNsKCk7XG4gICAgICAgIGhzbC5sICs9IGFtb3VudCAvIDEwMDtcbiAgICAgICAgaHNsLmwgPSBjbGFtcDAxKGhzbC5sKTtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW55Q29sb3IoaHNsKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuYnJpZ2h0ZW4gPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT09IHZvaWQgMCkgeyBhbW91bnQgPSAxMDsgfVxuICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JnYigpO1xuICAgICAgICByZ2IuciA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgcmdiLnIgLSBNYXRoLnJvdW5kKDI1NSAqIC0oYW1vdW50IC8gMTAwKSkpKTtcbiAgICAgICAgcmdiLmcgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIHJnYi5nIC0gTWF0aC5yb3VuZCgyNTUgKiAtKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgICAgIHJnYi5iID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCByZ2IuYiAtIE1hdGgucm91bmQoMjU1ICogLShhbW91bnQgLyAxMDApKSkpO1xuICAgICAgICByZXR1cm4gbmV3IFRpbnlDb2xvcihyZ2IpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5kYXJrZW4gPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT09IHZvaWQgMCkgeyBhbW91bnQgPSAxMDsgfVxuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICBoc2wubCAtPSBhbW91bnQgLyAxMDA7XG4gICAgICAgIGhzbC5sID0gY2xhbXAwMShoc2wubCk7XG4gICAgICAgIHJldHVybiBuZXcgVGlueUNvbG9yKGhzbCk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRpbnQgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT09IHZvaWQgMCkgeyBhbW91bnQgPSAxMDsgfVxuICAgICAgICByZXR1cm4gdGhpcy5taXgoJ3doaXRlJywgYW1vdW50KTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuc2hhZGUgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT09IHZvaWQgMCkgeyBhbW91bnQgPSAxMDsgfVxuICAgICAgICByZXR1cm4gdGhpcy5taXgoJ2JsYWNrJywgYW1vdW50KTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuZGVzYXR1cmF0ZSA9IGZ1bmN0aW9uIChhbW91bnQpIHtcbiAgICAgICAgaWYgKGFtb3VudCA9PT0gdm9pZCAwKSB7IGFtb3VudCA9IDEwOyB9XG4gICAgICAgIHZhciBoc2wgPSB0aGlzLnRvSHNsKCk7XG4gICAgICAgIGhzbC5zIC09IGFtb3VudCAvIDEwMDtcbiAgICAgICAgaHNsLnMgPSBjbGFtcDAxKGhzbC5zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW55Q29sb3IoaHNsKTtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuc2F0dXJhdGUgPSBmdW5jdGlvbiAoYW1vdW50KSB7XG4gICAgICAgIGlmIChhbW91bnQgPT09IHZvaWQgMCkgeyBhbW91bnQgPSAxMDsgfVxuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICBoc2wucyArPSBhbW91bnQgLyAxMDA7XG4gICAgICAgIGhzbC5zID0gY2xhbXAwMShoc2wucyk7XG4gICAgICAgIHJldHVybiBuZXcgVGlueUNvbG9yKGhzbCk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLmdyZXlzY2FsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzYXR1cmF0ZSgxMDApO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5zcGluID0gZnVuY3Rpb24gKGFtb3VudCkge1xuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICB2YXIgaHVlID0gKGhzbC5oICsgYW1vdW50KSAlIDM2MDtcbiAgICAgICAgaHNsLmggPSBodWUgPCAwID8gMzYwICsgaHVlIDogaHVlO1xuICAgICAgICByZXR1cm4gbmV3IFRpbnlDb2xvcihoc2wpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5taXggPSBmdW5jdGlvbiAoY29sb3IsIGFtb3VudCkge1xuICAgICAgICBpZiAoYW1vdW50ID09PSB2b2lkIDApIHsgYW1vdW50ID0gNTA7IH1cbiAgICAgICAgdmFyIHJnYjEgPSB0aGlzLnRvUmdiKCk7XG4gICAgICAgIHZhciByZ2IyID0gbmV3IFRpbnlDb2xvcihjb2xvcikudG9SZ2IoKTtcbiAgICAgICAgdmFyIHAgPSBhbW91bnQgLyAxMDA7XG4gICAgICAgIHZhciByZ2JhID0ge1xuICAgICAgICAgICAgcjogKChyZ2IyLnIgLSByZ2IxLnIpICogcCkgKyByZ2IxLnIsXG4gICAgICAgICAgICBnOiAoKHJnYjIuZyAtIHJnYjEuZykgKiBwKSArIHJnYjEuZyxcbiAgICAgICAgICAgIGI6ICgocmdiMi5iIC0gcmdiMS5iKSAqIHApICsgcmdiMS5iLFxuICAgICAgICAgICAgYTogKChyZ2IyLmEgLSByZ2IxLmEpICogcCkgKyByZ2IxLmEsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXcgVGlueUNvbG9yKHJnYmEpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5hbmFsb2dvdXMgPSBmdW5jdGlvbiAocmVzdWx0cywgc2xpY2VzKSB7XG4gICAgICAgIGlmIChyZXN1bHRzID09PSB2b2lkIDApIHsgcmVzdWx0cyA9IDY7IH1cbiAgICAgICAgaWYgKHNsaWNlcyA9PT0gdm9pZCAwKSB7IHNsaWNlcyA9IDMwOyB9XG4gICAgICAgIHZhciBoc2wgPSB0aGlzLnRvSHNsKCk7XG4gICAgICAgIHZhciBwYXJ0ID0gMzYwIC8gc2xpY2VzO1xuICAgICAgICB2YXIgcmV0ID0gW3RoaXNdO1xuICAgICAgICBmb3IgKGhzbC5oID0gKGhzbC5oIC0gKChwYXJ0ICogcmVzdWx0cykgPj4gMSkgKyA3MjApICUgMzYwOyAtLXJlc3VsdHM7KSB7XG4gICAgICAgICAgICBoc2wuaCA9IChoc2wuaCArIHBhcnQpICUgMzYwO1xuICAgICAgICAgICAgcmV0LnB1c2gobmV3IFRpbnlDb2xvcihoc2wpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5jb21wbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICBoc2wuaCA9IChoc2wuaCArIDE4MCkgJSAzNjA7XG4gICAgICAgIHJldHVybiBuZXcgVGlueUNvbG9yKGhzbCk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLm1vbm9jaHJvbWF0aWMgPSBmdW5jdGlvbiAocmVzdWx0cykge1xuICAgICAgICBpZiAocmVzdWx0cyA9PT0gdm9pZCAwKSB7IHJlc3VsdHMgPSA2OyB9XG4gICAgICAgIHZhciBoc3YgPSB0aGlzLnRvSHN2KCk7XG4gICAgICAgIHZhciBoID0gaHN2Lmg7XG4gICAgICAgIHZhciBzID0gaHN2LnM7XG4gICAgICAgIHZhciB2ID0gaHN2LnY7XG4gICAgICAgIHZhciByZXMgPSBbXTtcbiAgICAgICAgdmFyIG1vZGlmaWNhdGlvbiA9IDEgLyByZXN1bHRzO1xuICAgICAgICB3aGlsZSAocmVzdWx0cy0tKSB7XG4gICAgICAgICAgICByZXMucHVzaChuZXcgVGlueUNvbG9yKHsgaDogaCwgczogcywgdjogdiB9KSk7XG4gICAgICAgICAgICB2ID0gKHYgKyBtb2RpZmljYXRpb24pICUgMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5zcGxpdGNvbXBsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBoc2wgPSB0aGlzLnRvSHNsKCk7XG4gICAgICAgIHZhciBoID0gaHNsLmg7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgbmV3IFRpbnlDb2xvcih7IGg6IChoICsgNzIpICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgICAgICBuZXcgVGlueUNvbG9yKHsgaDogKGggKyAyMTYpICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgIF07XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRyaWFkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb2x5YWQoMyk7XG4gICAgfTtcbiAgICBUaW55Q29sb3IucHJvdG90eXBlLnRldHJhZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9seWFkKDQpO1xuICAgIH07XG4gICAgVGlueUNvbG9yLnByb3RvdHlwZS5wb2x5YWQgPSBmdW5jdGlvbiAobikge1xuICAgICAgICB2YXIgaHNsID0gdGhpcy50b0hzbCgpO1xuICAgICAgICB2YXIgaCA9IGhzbC5oO1xuICAgICAgICB2YXIgcmVzdWx0ID0gW3RoaXNdO1xuICAgICAgICB2YXIgaW5jcmVtZW50ID0gMzYwIC8gbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBUaW55Q29sb3IoeyBoOiAoaCArIChpICogaW5jcmVtZW50KSkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIFRpbnlDb2xvci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvUmdiU3RyaW5nKCkgPT09IG5ldyBUaW55Q29sb3IoY29sb3IpLnRvUmdiU3RyaW5nKCk7XG4gICAgfTtcbiAgICByZXR1cm4gVGlueUNvbG9yO1xufSgpKTtcbmV4cG9ydCB7IFRpbnlDb2xvciB9O1xuZXhwb3J0IGZ1bmN0aW9uIHRpbnljb2xvcihjb2xvciwgb3B0cykge1xuICAgIGlmIChjb2xvciA9PT0gdm9pZCAwKSB7IGNvbG9yID0gJyc7IH1cbiAgICBpZiAob3B0cyA9PT0gdm9pZCAwKSB7IG9wdHMgPSB7fTsgfVxuICAgIHJldHVybiBuZXcgVGlueUNvbG9yKGNvbG9yLCBvcHRzKTtcbn1cbiIsImV4cG9ydCBjb25zdCBMaXRFbGVtZW50ID0gY3VzdG9tRWxlbWVudHMuZ2V0KCdob21lLWFzc2lzdGFudC1tYWluJylcbiAgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YoY3VzdG9tRWxlbWVudHMuZ2V0KCdob21lLWFzc2lzdGFudC1tYWluJykpXG4gIDogT2JqZWN0LmdldFByb3RvdHlwZU9mKGN1c3RvbUVsZW1lbnRzLmdldCgnaHVpLXZpZXcnKSk7XG5cbmV4cG9ydCBjb25zdCBodG1sID0gTGl0RWxlbWVudC5wcm90b3R5cGUuaHRtbDtcblxuZXhwb3J0IGNvbnN0IGNzcyA9IExpdEVsZW1lbnQucHJvdG90eXBlLmNzcztcbiIsImV4cG9ydCBmdW5jdGlvbiBoYXNzKCkge1xuICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoYy1tYWluJykpXG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hjLW1haW4nKS5oYXNzO1xuXG4gIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hvbWUtYXNzaXN0YW50JykpXG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hvbWUtYXNzaXN0YW50JykuaGFzcztcblxuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVIYXNzKGVsZW1lbnQpIHtcbiAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGMtbWFpbicpKVxuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoYy1tYWluJykucHJvdmlkZUhhc3MoZWxlbWVudCk7XG5cbiAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaG9tZS1hc3Npc3RhbnQnKSlcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhvbWUtYXNzaXN0YW50XCIpLnByb3ZpZGVIYXNzKGVsZW1lbnQpO1xuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb3ZlbGFjZSgpIHtcbiAgdmFyIHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGMtbWFpblwiKTtcbiAgaWYocm9vdCkge1xuICAgIHZhciBsbCA9IHJvb3QuX2xvdmVsYWNlQ29uZmlnO1xuICAgIGxsLmN1cnJlbnRfdmlldyA9IHJvb3QuX2xvdmVsYWNlUGF0aDtcbiAgICByZXR1cm4gbGw7XG4gIH1cblxuICByb290ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhvbWUtYXNzaXN0YW50XCIpO1xuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XG4gIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImhvbWUtYXNzaXN0YW50LW1haW5cIik7XG4gIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiYXBwLWRyYXdlci1sYXlvdXQgcGFydGlhbC1wYW5lbC1yZXNvbHZlclwiKTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290IHx8IHJvb3Q7XG4gIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImhhLXBhbmVsLWxvdmVsYWNlXCIpXG4gIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXJvb3RcIilcbiAgaWYgKHJvb3QpIHtcbiAgICB2YXIgbGwgPSAgcm9vdC5sb3ZlbGFjZVxuICAgIGxsLmN1cnJlbnRfdmlldyA9IHJvb3QuX19fY3VyVmlldztcbiAgICByZXR1cm4gbGw7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXdhaXRfZWwoZWwpIHtcbiAgaWYoIWVsKSByZXR1cm47XG4gIGF3YWl0IGN1c3RvbUVsZW1lbnRzLndoZW5EZWZpbmVkKGVsLmxvY2FsTmFtZSk7XG4gIGlmKGVsLnVwZGF0ZUNvbXBsZXRlKVxuICAgIGF3YWl0IGVsLnVwZGF0ZUNvbXBsZXRlO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXN5bmNfbG92ZWxhY2VfdmlldygpIHtcbiAgdmFyIHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGMtbWFpblwiKTtcbiAgaWYocm9vdCkge1xuICAgIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJoYy1sb3ZlbGFjZVwiKTtcbiAgICBhd2FpdF9lbChyb290KTtcbiAgICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3Q7XG4gICAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXZpZXdcIikgfHwgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXBhbmVsLXZpZXdcIik7XG4gICAgYXdhaXRfZWwocm9vdCk7XG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cblxuICByb290ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhvbWUtYXNzaXN0YW50XCIpO1xuICBhd2FpdF9lbChyb290KTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJob21lLWFzc2lzdGFudC1tYWluXCIpO1xuICBhd2FpdF9lbChyb290KTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJhcHAtZHJhd2VyLWxheW91dCBwYXJ0aWFsLXBhbmVsLXJlc29sdmVyXCIpO1xuICBhd2FpdF9lbChyb290KTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290IHx8IHJvb3Q7XG4gIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImhhLXBhbmVsLWxvdmVsYWNlXCIpO1xuICBhd2FpdF9lbChyb290KTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJodWktcm9vdFwiKTtcbiAgYXdhaXRfZWwocm9vdCk7XG4gIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaGEtYXBwLWxheW91dFwiKVxuICBhd2FpdF9lbChyb290KTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiI3ZpZXdcIik7XG4gIHJvb3QgPSByb290ICYmIHJvb3QuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIGF3YWl0X2VsKHJvb3QpO1xuICByZXR1cm4gcm9vdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBsb3ZlbGFjZV92aWV3KCkge1xuICB2YXIgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoYy1tYWluXCIpO1xuICBpZihyb290KSB7XG4gICAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xuICAgIHJvb3QgPSByb290ICYmIHJvb3QucXVlcnlTZWxlY3RvcihcImhjLWxvdmVsYWNlXCIpO1xuICAgIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJodWktdmlld1wiKSB8fCByb290LnF1ZXJ5U2VsZWN0b3IoXCJodWktcGFuZWwtdmlld1wiKTtcbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIHJvb3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaG9tZS1hc3Npc3RhbnRcIik7XG4gIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaG9tZS1hc3Npc3RhbnQtbWFpblwiKTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5zaGFkb3dSb290O1xuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCJhcHAtZHJhd2VyLWxheW91dCBwYXJ0aWFsLXBhbmVsLXJlc29sdmVyXCIpO1xuICByb290ID0gcm9vdCAmJiByb290LnNoYWRvd1Jvb3QgfHwgcm9vdDtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaGEtcGFuZWwtbG92ZWxhY2VcIik7XG4gIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaHVpLXJvb3RcIik7XG4gIHJvb3QgPSByb290ICYmIHJvb3Quc2hhZG93Um9vdDtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5xdWVyeVNlbGVjdG9yKFwiaGEtYXBwLWxheW91dFwiKVxuICByb290ID0gcm9vdCAmJiByb290LnF1ZXJ5U2VsZWN0b3IoXCIjdmlld1wiKTtcbiAgcm9vdCA9IHJvb3QgJiYgcm9vdC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgcmV0dXJuIHJvb3Q7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkX2xvdmVsYWNlKCkge1xuICBpZihjdXN0b21FbGVtZW50cy5nZXQoXCJodWktdmlld1wiKSkgcmV0dXJuIHRydWU7XG5cbiAgYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoXCJwYXJ0aWFsLXBhbmVsLXJlc29sdmVyXCIpO1xuICBjb25zdCBwcHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicGFydGlhbC1wYW5lbC1yZXNvbHZlclwiKTtcbiAgcHByLmhhc3MgPSB7cGFuZWxzOiBbe1xuICAgIHVybF9wYXRoOiBcInRtcFwiLFxuICAgIFwiY29tcG9uZW50X25hbWVcIjogXCJsb3ZlbGFjZVwiLFxuICB9XX07XG4gIHBwci5fdXBkYXRlUm91dGVzKCk7XG4gIGF3YWl0IHBwci5yb3V0ZXJPcHRpb25zLnJvdXRlcy50bXAubG9hZCgpO1xuICBpZighY3VzdG9tRWxlbWVudHMuZ2V0KFwiaGEtcGFuZWwtbG92ZWxhY2VcIikpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoYS1wYW5lbC1sb3ZlbGFjZVwiKTtcbiAgcC5oYXNzID0gaGFzcygpO1xuICBpZihwLmhhc3MgPT09IHVuZGVmaW5lZCkge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Nvbm5lY3Rpb24tc3RhdHVzJywgKGV2KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2KTtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSwge29uY2U6IHRydWV9KTtcbiAgICB9KTtcbiAgICBwLmhhc3MgPSBoYXNzKCk7XG4gIH1cbiAgcC5wYW5lbCA9IHtjb25maWc6IHttb2RlOiBudWxsfX07XG4gIHAuX2ZldGNoQ29uZmlnKCk7XG4gIHJldHVybiB0cnVlO1xufVxuIiwiaW1wb3J0IHtsb3ZlbGFjZV92aWV3fSBmcm9tIFwiLi9oYXNzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXJlRXZlbnQoZXYsIGRldGFpbCwgZW50aXR5PW51bGwpIHtcbiAgZXYgPSBuZXcgRXZlbnQoZXYsIHtcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6IGZhbHNlLFxuICAgIGNvbXBvc2VkOiB0cnVlLFxuICB9KTtcbiAgZXYuZGV0YWlsID0gZGV0YWlsIHx8IHt9O1xuICBpZihlbnRpdHkpIHtcbiAgICBlbnRpdHkuZGlzcGF0Y2hFdmVudChldik7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJvb3QgPSBsb3ZlbGFjZV92aWV3KCk7XG4gICAgaWYgKHJvb3QpIHJvb3QuZGlzcGF0Y2hFdmVudChldik7XG4gIH1cbn1cbiIsImFzeW5jIGZ1bmN0aW9uIF9zZWxlY3RUcmVlKHJvb3QsIHBhdGgsIGFsbD1mYWxzZSkge1xuICBsZXQgZWwgPSByb290O1xuICBpZih0eXBlb2YocGF0aCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICBwYXRoID0gcGF0aC5zcGxpdCgvKFxcJHwgKS8pO1xuICB9XG4gIGlmKHBhdGhbcGF0aC5sZW5ndGgtMV0gPT09IFwiXCIpXG4gICAgIHBhdGgucG9wKCk7XG4gIGZvcihjb25zdCBbaSwgcF0gb2YgcGF0aC5lbnRyaWVzKCkpIHtcbiAgICBpZighcC50cmltKCkubGVuZ3RoKSBjb250aW51ZTtcbiAgICBpZighZWwpIHJldHVybiBudWxsO1xuICAgIGlmKGVsLmxvY2FsTmFtZSAmJiBlbC5sb2NhbE5hbWUuaW5jbHVkZXMoXCItXCIpKVxuICAgICAgYXdhaXQgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQoZWwubG9jYWxOYW1lKTtcbiAgICBpZihlbC51cGRhdGVDb21wbGV0ZSlcbiAgICAgIGF3YWl0IGVsLnVwZGF0ZUNvbXBsZXRlO1xuICAgIGlmKHAgPT09IFwiJFwiKVxuICAgICAgaWYoYWxsICYmIGkgPT0gcGF0aC5sZW5ndGgtMSlcbiAgICAgICAgZWwgPSBbZWwuc2hhZG93Um9vdF07XG4gICAgICBlbHNlXG4gICAgICAgIGVsID0gZWwuc2hhZG93Um9vdDtcbiAgICBlbHNlXG4gICAgICBpZihhbGwgJiYgaSA9PSBwYXRoLmxlbmd0aC0xKVxuICAgICAgICBlbCA9IGVsLnF1ZXJ5U2VsZWN0b3JBbGwocCk7XG4gICAgICBlbHNlXG4gICAgICAgIGVsID0gZWwucXVlcnlTZWxlY3RvcihwKTtcbiAgfVxuICByZXR1cm4gZWw7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWxlY3RUcmVlKHJvb3QsIHBhdGgsIGFsbD1mYWxzZSwgdGltZW91dD0xMDAwMCkge1xuICByZXR1cm4gUHJvbWlzZS5yYWNlKFtcbiAgICBfc2VsZWN0VHJlZShyb290LCBwYXRoLCBhbGwpLFxuICAgIG5ldyBQcm9taXNlKChfLCByZWplY3QpID0+IHNldFRpbWVvdXQoKCkgPT4gcmVqZWN0KG5ldyBFcnJvcigndGltZW91dCcpKSwgdGltZW91dCkpXG4gIF0pLmNhdGNoKChlcnIpID0+IHtcbiAgICBpZighZXJyLm1lc3NhZ2UgfHwgZXJyLm1lc3NhZ2UgIT09IFwidGltZW91dFwiKVxuICAgICAgdGhyb3coZXJyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBmaXJlRXZlbnQgfSBmcm9tIFwiLi9ldmVudFwiO1xuaW1wb3J0IHsgc2VsZWN0VHJlZSB9IGZyb20gXCIuL2hlbHBlcnNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1vcmVJbmZvKGVudGl0eSwgbGFyZ2U9ZmFsc2UpIHtcbiAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJoYy1tYWluXCIpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJob21lLWFzc2lzdGFudFwiKTtcbiAgZmlyZUV2ZW50KFwiaGFzcy1tb3JlLWluZm9cIiwge2VudGl0eUlkOiBlbnRpdHl9LCByb290KTtcbiAgY29uc3QgZWwgPSBhd2FpdCBzZWxlY3RUcmVlKHJvb3QsIFwiJCBoYS1tb3JlLWluZm8tZGlhbG9nXCIpO1xuICBpZihlbClcbiAgICBlbC5sYXJnZSA9IGxhcmdlO1xuICByZXR1cm4gZWw7XG59XG4iLCJjb25zdCBJRF9TVE9SQUdFX0tFWSA9ICdsb3ZlbGFjZS1wbGF5ZXItZGV2aWNlLWlkJztcbmZ1bmN0aW9uIF9kZXZpY2VJRCgpIHtcbiAgaWYoIWxvY2FsU3RvcmFnZVtJRF9TVE9SQUdFX0tFWV0pXG4gIHtcbiAgICBjb25zdCBzNCA9ICgpID0+IHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKCgxK01hdGgucmFuZG9tKCkpKjEwMDAwMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcbiAgICB9O1xuICAgIGlmKHdpbmRvd1snZnVsbHknXSAmJiB0eXBlb2YgZnVsbHkuZ2V0RGV2aWNlSWQgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgIGxvY2FsU3RvcmFnZVtJRF9TVE9SQUdFX0tFWV0gPSBmdWxseS5nZXREZXZpY2VJZCgpO1xuICAgIGVsc2VcbiAgICAgIGxvY2FsU3RvcmFnZVtJRF9TVE9SQUdFX0tFWV0gPSBgJHtzNCgpfSR7czQoKX0tJHtzNCgpfSR7czQoKX1gO1xuICB9XG4gIHJldHVybiBsb2NhbFN0b3JhZ2VbSURfU1RPUkFHRV9LRVldO1xufTtcblxuZXhwb3J0IGxldCBkZXZpY2VJRCA9IF9kZXZpY2VJRCgpO1xuXG5leHBvcnQgY29uc3Qgc2V0RGV2aWNlSUQgPSAoaWQpID0+IHtcbiAgaWYoaWQgPT09IG51bGwpIHJldHVybjtcbiAgaWYoaWQgPT09IFwiY2xlYXJcIikge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKElEX1NUT1JBR0VfS0VZKVxuICB9IGVsc2Uge1xuICAgIGxvY2FsU3RvcmFnZVtJRF9TVE9SQUdFX0tFWV0gPSBpZDtcbiAgfVxuICBkZXZpY2VJRCA9IF9kZXZpY2VJRCgpO1xufVxuXG5jb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuaWYocGFyYW1zLmdldCgnZGV2aWNlSUQnKSkge1xuICBzZXREZXZpY2VJRChwYXJhbXMuZ2V0KCdkZXZpY2VJRCcpKTtcbn1cblxuIiwiaW1wb3J0IHtoYXNzfSBmcm9tICcuL2hhc3MuanMnO1xuaW1wb3J0IHtkZXZpY2VJRH0gZnJvbSAnLi9kZXZpY2VJRC5qcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwYXJzZVRlbXBsYXRlKGhhc3MsIHN0ciwgc3BlY2lhbERhdGEgPSB7fSkge1xuICBpZiAoIWhhc3MpIGhhc3MgPSBoYXNzKCk7XG4gIGlmICh0eXBlb2Yoc3BlY2lhbERhdGEgPT09IFwic3RyaW5nXCIpKSBzcGVjaWFsRGF0YSA9IHt9O1xuICAgIHNwZWNpYWxEYXRhID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB1c2VyOiBoYXNzLnVzZXIubmFtZSxcbiAgICAgIGJyb3dzZXI6IGRldmljZUlELFxuICAgICAgaGFzaDogbG9jYXRpb24uaGFzaC5zdWJzdHIoMSkgfHwgJyAnLFxuICAgIH0sXG4gICAgc3BlY2lhbERhdGEpO1xuXG4gICAgZm9yICh2YXIgayBpbiBzcGVjaWFsRGF0YSkge1xuICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cChgXFxcXHske2t9XFxcXH1gLCBcImdcIik7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShyZSwgc3BlY2lhbERhdGFba10pO1xuICAgIH1cblxuICAgIHJldHVybiBoYXNzLmNhbGxBcGkoXCJQT1NUXCIsIFwidGVtcGxhdGVcIiwge3RlbXBsYXRlOiBzdHJ9KTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNUZW1wbGF0ZShzdHIpIHtcbiAgaWYoU3RyaW5nKHN0cikuaW5jbHVkZXMoXCJ7JVwiKSlcbiAgICByZXR1cm4gdHJ1ZTtcbiAgaWYoU3RyaW5nKHN0cikuaW5jbHVkZXMoXCJ7e1wiKSlcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmliZVJlbmRlclRlbXBsYXRlKGNvbm4sIG9uQ2hhbmdlLCBwYXJhbXMsIHN0cmluZ2lmeT10cnVlKSB7XG4gIC8vIHBhcmFtcyA9IHt0ZW1wbGF0ZSwgZW50aXR5X2lkcywgdmFyaWFibGVzfVxuICBpZighY29ubilcbiAgICBjb25uID0gaGFzcygpLmNvbm5lY3Rpb247XG4gIGxldCB2YXJpYWJsZXMgPSB7XG4gICAgdXNlcjogaGFzcygpLnVzZXIubmFtZSxcbiAgICBicm93c2VyOiBkZXZpY2VJRCxcbiAgICBoYXNoOiBsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSB8fCAnICcsXG4gICAgLi4ucGFyYW1zLnZhcmlhYmxlcyxcbiAgfTtcbiAgbGV0IHRlbXBsYXRlID0gcGFyYW1zLnRlbXBsYXRlO1xuICBsZXQgZW50aXR5X2lkcyA9IHBhcmFtcy5lbnRpdHlfaWRzO1xuXG4gIHJldHVybiBjb25uLnN1YnNjcmliZU1lc3NhZ2UoXG4gICAgKG1zZykgPT4ge1xuICAgICAgaWYoc3RyaW5naWZ5KSB7XG4gICAgICAgIGxldCByZXMgPSBTdHJpbmcobXNnLnJlc3VsdCk7XG4gICAgICAgIC8vIExvY2FsaXplIFwiXyhrZXkpXCIgaWYgZm91bmQgaW4gdGVtcGxhdGUgcmVzdWx0c1xuICAgICAgICBjb25zdCBsb2NhbGl6ZV9mdW5jdGlvbiA9IC9fXFwoW14pXSpcXCkvZztcbiAgICAgICAgcmVzID0gcmVzLnJlcGxhY2UobG9jYWxpemVfZnVuY3Rpb24sIChrZXkpID0+IGhhc3MoKS5sb2NhbGl6ZShrZXkuc3Vic3RyaW5nKDIsIGtleS5sZW5ndGgtMSkpIHx8IGtleSk7XG4gICAgICAgIG9uQ2hhbmdlKHJlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvbkNoYW5nZShtc2cucmVzdWx0KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHsgdHlwZTogXCJyZW5kZXJfdGVtcGxhdGVcIixcbiAgICAgIHRlbXBsYXRlLFxuICAgICAgdmFyaWFibGVzLFxuICAgICAgZW50aXR5X2lkcyxcbiAgICB9XG4gICk7XG59O1xuIiwiaW1wb3J0IHsgZmlyZUV2ZW50IH0gZnJvbSBcIi4vZXZlbnRcIjtcbmltcG9ydCB7IGxvYWRfbG92ZWxhY2UgfSBmcm9tIFwiLi9oYXNzXCI7XG5cbmV4cG9ydCBjb25zdCBDVVNUT01fVFlQRV9QUkVGSVggPSBcImN1c3RvbTpcIjtcblxuZXhwb3J0IGNvbnN0IERPTUFJTlNfSElERV9NT1JFX0lORk8gPSBbXG4gIFwiaW5wdXRfbnVtYmVyXCIsXG4gIFwiaW5wdXRfc2VsZWN0XCIsXG4gIFwiaW5wdXRfdGV4dFwiLFxuICBcInNjZW5lXCIsXG4gIFwid2VibGlua1wiLFxuXTtcblxubGV0IGhlbHBlcnMgPSB3aW5kb3cuY2FyZEhlbHBlcnM7XG5jb25zdCBoZWxwZXJQcm9taXNlID0gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICBpZihoZWxwZXJzKSByZXNvbHZlKCk7XG5cbiAgY29uc3QgdXBkYXRlSGVscGVycyA9IGFzeW5jICgpID0+IHtcbiAgICBoZWxwZXJzID0gYXdhaXQgd2luZG93LmxvYWRDYXJkSGVscGVycygpO1xuICAgIHdpbmRvdy5jYXJkSGVscGVycyA9IGhlbHBlcnM7XG4gICAgcmVzb2x2ZSgpO1xuICB9XG5cbiAgaWYod2luZG93LmxvYWRDYXJkSGVscGVycykge1xuICAgIHVwZGF0ZUhlbHBlcnMoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBJZiBsb2FkQ2FyZEhlbHBlcnMgZGlkbid0IGV4aXN0LCBmb3JjZSBsb2FkIGxvdmVsYWNlIGFuZCB0cnkgb25jZSBtb3JlLlxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBsb2FkX2xvdmVsYWNlKCk7XG4gICAgICBpZih3aW5kb3cubG9hZENhcmRIZWxwZXJzKSB7XG4gICAgICAgIHVwZGF0ZUhlbHBlcnMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGVycm9yRWxlbWVudChlcnJvciwgb3JpZ0NvbmZpZykge1xuICBjb25zdCBjZmcgPSB7XG4gICAgdHlwZTogXCJlcnJvclwiLFxuICAgIGVycm9yLFxuICAgIG9yaWdDb25maWcsXG4gIH07XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh1aS1lcnJvci1jYXJkXCIpO1xuICBjdXN0b21FbGVtZW50cy53aGVuRGVmaW5lZChcImh1aS1lcnJvci1jYXJkXCIpLnRoZW4oKCkgPT4ge1xuICAgIGNvbnN0IG5ld2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh1aS1lcnJvci1jYXJkXCIpO1xuICAgIG5ld2VsLnNldENvbmZpZyhjZmcpO1xuICAgIGlmKGVsLnBhcmVudEVsZW1lbnQpXG4gICAgICBlbC5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZChuZXdlbCwgZWwpO1xuICB9KTtcbiAgaGVscGVyUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICBmaXJlRXZlbnQoXCJsbC1yZWJ1aWxkXCIsIHt9LCBlbCk7XG4gIH0pO1xuICByZXR1cm4gZWw7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVFbGVtZW50KHRhZywgY29uZmlnKSB7XG4gIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgdHJ5IHtcbiAgICBlbC5zZXRDb25maWcoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjb25maWcpKSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVsID0gZXJyb3JFbGVtZW50KGVyciwgY29uZmlnKTtcbiAgfVxuICBoZWxwZXJQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgIGZpcmVFdmVudChcImxsLXJlYnVpbGRcIiwge30sIGVsKTtcbiAgfSk7XG4gIHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTG92ZWxhY2VFbGVtZW50KHRoaW5nLCBjb25maWcpIHtcbiAgaWYoIWNvbmZpZyB8fCB0eXBlb2YgY29uZmlnICE9PSBcIm9iamVjdFwiIHx8ICFjb25maWcudHlwZSlcbiAgICByZXR1cm4gZXJyb3JFbGVtZW50KGBObyAke3RoaW5nfSB0eXBlIGNvbmZpZ3VyZWRgLCBjb25maWcpO1xuXG4gIGxldCB0YWcgPSBjb25maWcudHlwZTtcbiAgaWYodGFnLnN0YXJ0c1dpdGgoQ1VTVE9NX1RZUEVfUFJFRklYKSlcbiAgICB0YWcgPSB0YWcuc3Vic3RyKENVU1RPTV9UWVBFX1BSRUZJWC5sZW5ndGgpO1xuICBlbHNlXG4gICAgdGFnID0gYGh1aS0ke3RhZ30tJHt0aGluZ31gO1xuXG4gIGlmKGN1c3RvbUVsZW1lbnRzLmdldCh0YWcpKVxuICAgIHJldHVybiBfY3JlYXRlRWxlbWVudCh0YWcsIGNvbmZpZyk7XG5cbiAgY29uc3QgZWwgPSBlcnJvckVsZW1lbnQoYEN1c3RvbSBlbGVtZW50IGRvZXNuJ3QgZXhpc3Q6ICR7dGFnfS5gLCBjb25maWcpO1xuICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XG5cbiAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgfSwgMjAwMCk7XG5cbiAgY3VzdG9tRWxlbWVudHMud2hlbkRlZmluZWQodGFnKS50aGVuKCgpID0+IHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIGZpcmVFdmVudChcImxsLXJlYnVpbGRcIiwge30sIGVsKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2FyZChjb25maWcpIHtcbiAgaWYoaGVscGVycykgcmV0dXJuIGhlbHBlcnMuY3JlYXRlQ2FyZEVsZW1lbnQoY29uZmlnKTtcbiAgcmV0dXJuIGNyZWF0ZUxvdmVsYWNlRWxlbWVudCgnY2FyZCcsIGNvbmZpZyk7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudChjb25maWcpIHtcbiAgaWYoaGVscGVycykgcmV0dXJuIGhlbHBlcnMuY3JlYXRlSHVpRWxlbWVudChjb25maWcpO1xuICByZXR1cm4gY3JlYXRlTG92ZWxhY2VFbGVtZW50KCdlbGVtZW50JywgY29uZmlnKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlSb3coY29uZmlnKSB7XG4gIGlmKGhlbHBlcnMpIHJldHVybiBoZWxwZXJzLmNyZWF0ZVJvd0VsZW1lbnQoY29uZmlnKTtcbiAgY29uc3QgU1BFQ0lBTF9UWVBFUyA9IG5ldyBTZXQoW1xuICAgIFwiY2FsbC1zZXJ2aWNlXCIsXG4gICAgXCJjYXN0XCIsXG4gICAgXCJjb25kaXRpb25hbFwiLFxuICAgIFwiZGl2aWRlclwiLFxuICAgIFwic2VjdGlvblwiLFxuICAgIFwic2VsZWN0XCIsXG4gICAgXCJ3ZWJsaW5rXCIsXG4gIF0pO1xuICBjb25zdCBERUZBVUxUX1JPV1MgPSB7XG4gICAgYWxlcnQ6IFwidG9nZ2xlXCIsXG4gICAgYXV0b21hdGlvbjogXCJ0b2dnbGVcIixcbiAgICBjbGltYXRlOiBcImNsaW1hdGVcIixcbiAgICBjb3ZlcjogXCJjb3ZlclwiLFxuICAgIGZhbjogXCJ0b2dnbGVcIixcbiAgICBncm91cDogXCJncm91cFwiLFxuICAgIGlucHV0X2Jvb2xlYW46IFwidG9nZ2xlXCIsXG4gICAgaW5wdXRfbnVtYmVyOiBcImlucHV0LW51bWJlclwiLFxuICAgIGlucHV0X3NlbGVjdDogXCJpbnB1dC1zZWxlY3RcIixcbiAgICBpbnB1dF90ZXh0OiBcImlucHV0LXRleHRcIixcbiAgICBsaWdodDogXCJ0b2dnbGVcIixcbiAgICBsb2NrOiBcImxvY2tcIixcbiAgICBtZWRpYV9wbGF5ZXI6IFwibWVkaWEtcGxheWVyXCIsXG4gICAgcmVtb3RlOiBcInRvZ2dsZVwiLFxuICAgIHNjZW5lOiBcInNjZW5lXCIsXG4gICAgc2NyaXB0OiBcInNjcmlwdFwiLFxuICAgIHNlbnNvcjogXCJzZW5zb3JcIixcbiAgICB0aW1lcjogXCJ0aW1lclwiLFxuICAgIHN3aXRjaDogXCJ0b2dnbGVcIixcbiAgICB2YWN1dW06IFwidG9nZ2xlXCIsXG4gICAgd2F0ZXJfaGVhdGVyOiBcImNsaW1hdGVcIixcbiAgICBpbnB1dF9kYXRldGltZTogXCJpbnB1dC1kYXRldGltZVwiLFxuICAgIG5vbmU6IHVuZGVmaW5lZCxcbiAgfTtcblxuICBpZighY29uZmlnKVxuICAgIHJldHVybiBlcnJvckVsZW1lbnQoXCJJbnZhbGlkIGNvbmZpZ3VyYXRpb24gZ2l2ZW4uXCIsIGNvbmZpZyk7XG4gIGlmKHR5cGVvZiBjb25maWcgPT09IFwic3RyaW5nXCIpXG4gICAgY29uZmlnID0ge2VudGl0eTogY29uZmlnfTtcbiAgaWYodHlwZW9mIGNvbmZpZyAhPT0gXCJvYmplY3RcIiB8fCAoIWNvbmZpZy5lbnRpdHkgJiYgIWNvbmZpZy50eXBlKSlcbiAgICByZXR1cm4gZXJyb3JFbGVtZW50KFwiSW52YWxpZCBjb25maWd1cmF0aW9uIGdpdmVuLlwiLCBjb25maWcpO1xuXG4gIGNvbnN0IHR5cGUgPSBjb25maWcudHlwZSB8fCBcImRlZmF1bHRcIjtcbiAgaWYoU1BFQ0lBTF9UWVBFUy5oYXModHlwZSkgfHwgdHlwZS5zdGFydHNXaXRoKENVU1RPTV9UWVBFX1BSRUZJWCkpXG4gICAgcmV0dXJuIGNyZWF0ZUxvdmVsYWNlRWxlbWVudCgncm93JywgY29uZmlnKTtcblxuICBjb25zdCBkb21haW4gPSBjb25maWcuZW50aXR5ID8gY29uZmlnLmVudGl0eS5zcGxpdChcIi5cIiwgMSlbMF06IFwibm9uZVwiO1xuICByZXR1cm4gY3JlYXRlTG92ZWxhY2VFbGVtZW50KCdlbnRpdHktcm93Jywge1xuICAgIHR5cGU6IERFRkFVTFRfUk9XU1tkb21haW5dIHx8IFwidGV4dFwiLFxuICAgIC4uLmNvbmZpZ1xuICB9KTtcbn1cbiIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjcgLSAyMDE2LTA0LTIyXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBleHBvcnROYW1lLCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG52YXIgVkVORE9SX1BSRUZJWEVTID0gWycnLCAnd2Via2l0JywgJ01veicsICdNUycsICdtcycsICdvJ107XG52YXIgVEVTVF9FTEVNRU5UID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbnZhciBUWVBFX0ZVTkNUSU9OID0gJ2Z1bmN0aW9uJztcblxudmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbnZhciBhYnMgPSBNYXRoLmFicztcbnZhciBub3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBzZXQgYSB0aW1lb3V0IHdpdGggYSBnaXZlbiBzY29wZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lb3V0XG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gc2V0VGltZW91dENvbnRleHQoZm4sIHRpbWVvdXQsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChiaW5kRm4oZm4sIGNvbnRleHQpLCB0aW1lb3V0KTtcbn1cblxuLyoqXG4gKiBpZiB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXksIHdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgZm4gb24gZWFjaCBlbnRyeVxuICogaWYgaXQgYWludCBhbiBhcnJheSB3ZSBkb24ndCB3YW50IHRvIGRvIGEgdGhpbmcuXG4gKiB0aGlzIGlzIHVzZWQgYnkgYWxsIHRoZSBtZXRob2RzIHRoYXQgYWNjZXB0IGEgc2luZ2xlIGFuZCBhcnJheSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7KnxBcnJheX0gYXJnXG4gKiBAcGFyYW0ge1N0cmluZ30gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF1cbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpbnZva2VBcnJheUFyZyhhcmcsIGZuLCBjb250ZXh0KSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuICAgICAgICBlYWNoKGFyZywgY29udGV4dFtmbl0sIGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHdhbGsgb2JqZWN0cyBhbmQgYXJyYXlzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqL1xuZnVuY3Rpb24gZWFjaChvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGk7XG5cbiAgICBpZiAoIW9iaikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9iai5mb3JFYWNoKSB7XG4gICAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICB9IGVsc2UgaWYgKG9iai5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBvYmoubGVuZ3RoKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgIG9iai5oYXNPd25Qcm9wZXJ0eShpKSAmJiBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiB3cmFwIGEgbWV0aG9kIHdpdGggYSBkZXByZWNhdGlvbiB3YXJuaW5nIGFuZCBzdGFjayB0cmFjZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIHN1cHBsaWVkIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gZGVwcmVjYXRlKG1ldGhvZCwgbmFtZSwgbWVzc2FnZSkge1xuICAgIHZhciBkZXByZWNhdGlvbk1lc3NhZ2UgPSAnREVQUkVDQVRFRCBNRVRIT0Q6ICcgKyBuYW1lICsgJ1xcbicgKyBtZXNzYWdlICsgJyBBVCBcXG4nO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ2dldC1zdGFjay10cmFjZScpO1xuICAgICAgICB2YXIgc3RhY2sgPSBlICYmIGUuc3RhY2sgPyBlLnN0YWNrLnJlcGxhY2UoL15bXlxcKF0rP1tcXG4kXS9nbSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXlxccythdFxccysvZ20sICcnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLCAne2Fub255bW91c30oKUAnKSA6ICdVbmtub3duIFN0YWNrIFRyYWNlJztcblxuICAgICAgICB2YXIgbG9nID0gd2luZG93LmNvbnNvbGUgJiYgKHdpbmRvdy5jb25zb2xlLndhcm4gfHwgd2luZG93LmNvbnNvbGUubG9nKTtcbiAgICAgICAgaWYgKGxvZykge1xuICAgICAgICAgICAgbG9nLmNhbGwod2luZG93LmNvbnNvbGUsIGRlcHJlY2F0aW9uTWVzc2FnZSwgc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG4vKipcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmplY3RzX3RvX2Fzc2lnblxuICogQHJldHVybnMge09iamVjdH0gdGFyZ2V0XG4gKi9cbnZhciBhc3NpZ247XG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT09ICdmdW5jdGlvbicpIHtcbiAgICBhc3NpZ24gPSBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0KSB7XG4gICAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcbn1cblxuLyoqXG4gKiBleHRlbmQgb2JqZWN0LlxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIGluIGRlc3Qgd2lsbCBiZSBvdmVyd3JpdHRlbiBieSB0aGUgb25lcyBpbiBzcmMuXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHBhcmFtIHtCb29sZWFufSBbbWVyZ2U9ZmFsc2VdXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XG4gKi9cbnZhciBleHRlbmQgPSBkZXByZWNhdGUoZnVuY3Rpb24gZXh0ZW5kKGRlc3QsIHNyYywgbWVyZ2UpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNyYyk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFtZXJnZSB8fCAobWVyZ2UgJiYgZGVzdFtrZXlzW2ldXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgZGVzdFtrZXlzW2ldXSA9IHNyY1trZXlzW2ldXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBkZXN0O1xufSwgJ2V4dGVuZCcsICdVc2UgYGFzc2lnbmAuJyk7XG5cbi8qKlxuICogbWVyZ2UgdGhlIHZhbHVlcyBmcm9tIHNyYyBpbiB0aGUgZGVzdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyB0aGF0IGV4aXN0IGluIGRlc3Qgd2lsbCBub3QgYmUgb3ZlcndyaXR0ZW4gYnkgc3JjXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHJldHVybnMge09iamVjdH0gZGVzdFxuICovXG52YXIgbWVyZ2UgPSBkZXByZWNhdGUoZnVuY3Rpb24gbWVyZ2UoZGVzdCwgc3JjKSB7XG4gICAgcmV0dXJuIGV4dGVuZChkZXN0LCBzcmMsIHRydWUpO1xufSwgJ21lcmdlJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBzaW1wbGUgY2xhc3MgaW5oZXJpdGFuY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNoaWxkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXQoY2hpbGQsIGJhc2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgYmFzZVAgPSBiYXNlLnByb3RvdHlwZSxcbiAgICAgICAgY2hpbGRQO1xuXG4gICAgY2hpbGRQID0gY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlUCk7XG4gICAgY2hpbGRQLmNvbnN0cnVjdG9yID0gY2hpbGQ7XG4gICAgY2hpbGRQLl9zdXBlciA9IGJhc2VQO1xuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgYXNzaWduKGNoaWxkUCwgcHJvcGVydGllcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIHNpbXBsZSBmdW5jdGlvbiBiaW5kXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gYmluZEZuKGZuLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kRm4oKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogbGV0IGEgYm9vbGVhbiB2YWx1ZSBhbHNvIGJlIGEgZnVuY3Rpb24gdGhhdCBtdXN0IHJldHVybiBhIGJvb2xlYW5cbiAqIHRoaXMgZmlyc3QgaXRlbSBpbiBhcmdzIHdpbGwgYmUgdXNlZCBhcyB0aGUgY29udGV4dFxuICogQHBhcmFtIHtCb29sZWFufEZ1bmN0aW9ufSB2YWxcbiAqIEBwYXJhbSB7QXJyYXl9IFthcmdzXVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGJvb2xPckZuKHZhbCwgYXJncykge1xuICAgIGlmICh0eXBlb2YgdmFsID09IFRZUEVfRlVOQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIHZhbC5hcHBseShhcmdzID8gYXJnc1swXSB8fCB1bmRlZmluZWQgOiB1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuXG4vKipcbiAqIHVzZSB0aGUgdmFsMiB3aGVuIHZhbDEgaXMgdW5kZWZpbmVkXG4gKiBAcGFyYW0geyp9IHZhbDFcbiAqIEBwYXJhbSB7Kn0gdmFsMlxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGlmVW5kZWZpbmVkKHZhbDEsIHZhbDIpIHtcbiAgICByZXR1cm4gKHZhbDEgPT09IHVuZGVmaW5lZCkgPyB2YWwyIDogdmFsMTtcbn1cblxuLyoqXG4gKiBhZGRFdmVudExpc3RlbmVyIHdpdGggbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2VcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcbiAgICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogcmVtb3ZlRXZlbnRMaXN0ZW5lciB3aXRoIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycyh0YXJnZXQsIHR5cGVzLCBoYW5kbGVyKSB7XG4gICAgZWFjaChzcGxpdFN0cih0eXBlcyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIGZpbmQgaWYgYSBub2RlIGlzIGluIHRoZSBnaXZlbiBwYXJlbnRcbiAqIEBtZXRob2QgaGFzUGFyZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGhhc1BhcmVudChub2RlLCBwYXJlbnQpIHtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBpZiAobm9kZSA9PSBwYXJlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBzbWFsbCBpbmRleE9mIHdyYXBwZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gZm91bmRcbiAqL1xuZnVuY3Rpb24gaW5TdHIoc3RyLCBmaW5kKSB7XG4gICAgcmV0dXJuIHN0ci5pbmRleE9mKGZpbmQpID4gLTE7XG59XG5cbi8qKlxuICogc3BsaXQgc3RyaW5nIG9uIHdoaXRlc3BhY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm5zIHtBcnJheX0gd29yZHNcbiAqL1xuZnVuY3Rpb24gc3BsaXRTdHIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50cmltKCkuc3BsaXQoL1xccysvZyk7XG59XG5cbi8qKlxuICogZmluZCBpZiBhIGFycmF5IGNvbnRhaW5zIHRoZSBvYmplY3QgdXNpbmcgaW5kZXhPZiBvciBhIHNpbXBsZSBwb2x5RmlsbFxuICogQHBhcmFtIHtBcnJheX0gc3JjXG4gKiBAcGFyYW0ge1N0cmluZ30gZmluZFxuICogQHBhcmFtIHtTdHJpbmd9IFtmaW5kQnlLZXldXG4gKiBAcmV0dXJuIHtCb29sZWFufE51bWJlcn0gZmFsc2Ugd2hlbiBub3QgZm91bmQsIG9yIHRoZSBpbmRleFxuICovXG5mdW5jdGlvbiBpbkFycmF5KHNyYywgZmluZCwgZmluZEJ5S2V5KSB7XG4gICAgaWYgKHNyYy5pbmRleE9mICYmICFmaW5kQnlLZXkpIHtcbiAgICAgICAgcmV0dXJuIHNyYy5pbmRleE9mKGZpbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoKGZpbmRCeUtleSAmJiBzcmNbaV1bZmluZEJ5S2V5XSA9PSBmaW5kKSB8fCAoIWZpbmRCeUtleSAmJiBzcmNbaV0gPT09IGZpbmQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn1cblxuLyoqXG4gKiBjb252ZXJ0IGFycmF5LWxpa2Ugb2JqZWN0cyB0byByZWFsIGFycmF5c1xuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiB0b0FycmF5KG9iaikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChvYmosIDApO1xufVxuXG4vKipcbiAqIHVuaXF1ZSBhcnJheSB3aXRoIG9iamVjdHMgYmFzZWQgb24gYSBrZXkgKGxpa2UgJ2lkJykgb3IganVzdCBieSB0aGUgYXJyYXkncyB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gc3JjIFt7aWQ6MX0se2lkOjJ9LHtpZDoxfV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICogQHBhcmFtIHtCb29sZWFufSBbc29ydD1GYWxzZV1cbiAqIEByZXR1cm5zIHtBcnJheX0gW3tpZDoxfSx7aWQ6Mn1dXG4gKi9cbmZ1bmN0aW9uIHVuaXF1ZUFycmF5KHNyYywga2V5LCBzb3J0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgd2hpbGUgKGkgPCBzcmMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWwgPSBrZXkgPyBzcmNbaV1ba2V5XSA6IHNyY1tpXTtcbiAgICAgICAgaWYgKGluQXJyYXkodmFsdWVzLCB2YWwpIDwgMCkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNyY1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWVzW2ldID0gdmFsO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKHNvcnQpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoZnVuY3Rpb24gc29ydFVuaXF1ZUFycmF5KGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtrZXldID4gYltrZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuLyoqXG4gKiBnZXQgdGhlIHByZWZpeGVkIHByb3BlcnR5XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlcbiAqIEByZXR1cm5zIHtTdHJpbmd8VW5kZWZpbmVkfSBwcmVmaXhlZFxuICovXG5mdW5jdGlvbiBwcmVmaXhlZChvYmosIHByb3BlcnR5KSB7XG4gICAgdmFyIHByZWZpeCwgcHJvcDtcbiAgICB2YXIgY2FtZWxQcm9wID0gcHJvcGVydHlbMF0udG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnNsaWNlKDEpO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgVkVORE9SX1BSRUZJWEVTLmxlbmd0aCkge1xuICAgICAgICBwcmVmaXggPSBWRU5ET1JfUFJFRklYRVNbaV07XG4gICAgICAgIHByb3AgPSAocHJlZml4KSA/IHByZWZpeCArIGNhbWVsUHJvcCA6IHByb3BlcnR5O1xuXG4gICAgICAgIGlmIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHByb3A7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIGdldCBhIHVuaXF1ZSBpZFxuICogQHJldHVybnMge251bWJlcn0gdW5pcXVlSWRcbiAqL1xudmFyIF91bmlxdWVJZCA9IDE7XG5mdW5jdGlvbiB1bmlxdWVJZCgpIHtcbiAgICByZXR1cm4gX3VuaXF1ZUlkKys7XG59XG5cbi8qKlxuICogZ2V0IHRoZSB3aW5kb3cgb2JqZWN0IG9mIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm5zIHtEb2N1bWVudFZpZXd8V2luZG93fVxuICovXG5mdW5jdGlvbiBnZXRXaW5kb3dGb3JFbGVtZW50KGVsZW1lbnQpIHtcbiAgICB2YXIgZG9jID0gZWxlbWVudC5vd25lckRvY3VtZW50IHx8IGVsZW1lbnQ7XG4gICAgcmV0dXJuIChkb2MuZGVmYXVsdFZpZXcgfHwgZG9jLnBhcmVudFdpbmRvdyB8fCB3aW5kb3cpO1xufVxuXG52YXIgTU9CSUxFX1JFR0VYID0gL21vYmlsZXx0YWJsZXR8aXAoYWR8aG9uZXxvZCl8YW5kcm9pZC9pO1xuXG52YXIgU1VQUE9SVF9UT1VDSCA9ICgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpO1xudmFyIFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSBwcmVmaXhlZCh3aW5kb3csICdQb2ludGVyRXZlbnQnKSAhPT0gdW5kZWZpbmVkO1xudmFyIFNVUFBPUlRfT05MWV9UT1VDSCA9IFNVUFBPUlRfVE9VQ0ggJiYgTU9CSUxFX1JFR0VYLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbnZhciBJTlBVVF9UWVBFX1RPVUNIID0gJ3RvdWNoJztcbnZhciBJTlBVVF9UWVBFX1BFTiA9ICdwZW4nO1xudmFyIElOUFVUX1RZUEVfTU9VU0UgPSAnbW91c2UnO1xudmFyIElOUFVUX1RZUEVfS0lORUNUID0gJ2tpbmVjdCc7XG5cbnZhciBDT01QVVRFX0lOVEVSVkFMID0gMjU7XG5cbnZhciBJTlBVVF9TVEFSVCA9IDE7XG52YXIgSU5QVVRfTU9WRSA9IDI7XG52YXIgSU5QVVRfRU5EID0gNDtcbnZhciBJTlBVVF9DQU5DRUwgPSA4O1xuXG52YXIgRElSRUNUSU9OX05PTkUgPSAxO1xudmFyIERJUkVDVElPTl9MRUZUID0gMjtcbnZhciBESVJFQ1RJT05fUklHSFQgPSA0O1xudmFyIERJUkVDVElPTl9VUCA9IDg7XG52YXIgRElSRUNUSU9OX0RPV04gPSAxNjtcblxudmFyIERJUkVDVElPTl9IT1JJWk9OVEFMID0gRElSRUNUSU9OX0xFRlQgfCBESVJFQ1RJT05fUklHSFQ7XG52YXIgRElSRUNUSU9OX1ZFUlRJQ0FMID0gRElSRUNUSU9OX1VQIHwgRElSRUNUSU9OX0RPV047XG52YXIgRElSRUNUSU9OX0FMTCA9IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMO1xuXG52YXIgUFJPUFNfWFkgPSBbJ3gnLCAneSddO1xudmFyIFBST1BTX0NMSUVOVF9YWSA9IFsnY2xpZW50WCcsICdjbGllbnRZJ107XG5cbi8qKlxuICogY3JlYXRlIG5ldyBpbnB1dCB0eXBlIG1hbmFnZXJcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtJbnB1dH1cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBJbnB1dChtYW5hZ2VyLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLmVsZW1lbnQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgdGhpcy50YXJnZXQgPSBtYW5hZ2VyLm9wdGlvbnMuaW5wdXRUYXJnZXQ7XG5cbiAgICAvLyBzbWFsbGVyIHdyYXBwZXIgYXJvdW5kIHRoZSBoYW5kbGVyLCBmb3IgdGhlIHNjb3BlIGFuZCB0aGUgZW5hYmxlZCBzdGF0ZSBvZiB0aGUgbWFuYWdlcixcbiAgICAvLyBzbyB3aGVuIGRpc2FibGVkIHRoZSBpbnB1dCBldmVudHMgYXJlIGNvbXBsZXRlbHkgYnlwYXNzZWQuXG4gICAgdGhpcy5kb21IYW5kbGVyID0gZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgaWYgKGJvb2xPckZuKG1hbmFnZXIub3B0aW9ucy5lbmFibGUsIFttYW5hZ2VyXSkpIHtcbiAgICAgICAgICAgIHNlbGYuaGFuZGxlcihldik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbn1cblxuSW5wdXQucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNob3VsZCBoYW5kbGUgdGhlIGlucHV0RXZlbnQgZGF0YSBhbmQgdHJpZ2dlciB0aGUgY2FsbGJhY2tcbiAgICAgKiBAdmlydHVhbFxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiBhZGRFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiBhZGRFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVuYmluZCB0aGUgZXZlbnRzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZXZFbCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldlRhcmdldCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLnRhcmdldCwgdGhpcy5ldlRhcmdldCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgICAgdGhpcy5ldldpbiAmJiByZW1vdmVFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfVxufTtcblxuLyoqXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxuICogY2FsbGVkIGJ5IHRoZSBNYW5hZ2VyIGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0hhbW1lcn0gbWFuYWdlclxuICogQHJldHVybnMge0lucHV0fVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dEluc3RhbmNlKG1hbmFnZXIpIHtcbiAgICB2YXIgVHlwZTtcbiAgICB2YXIgaW5wdXRDbGFzcyA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dENsYXNzO1xuXG4gICAgaWYgKGlucHV0Q2xhc3MpIHtcbiAgICAgICAgVHlwZSA9IGlucHV0Q2xhc3M7XG4gICAgfSBlbHNlIGlmIChTVVBQT1JUX1BPSU5URVJfRVZFTlRTKSB7XG4gICAgICAgIFR5cGUgPSBQb2ludGVyRXZlbnRJbnB1dDtcbiAgICB9IGVsc2UgaWYgKFNVUFBPUlRfT05MWV9UT1VDSCkge1xuICAgICAgICBUeXBlID0gVG91Y2hJbnB1dDtcbiAgICB9IGVsc2UgaWYgKCFTVVBQT1JUX1RPVUNIKSB7XG4gICAgICAgIFR5cGUgPSBNb3VzZUlucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFR5cGUgPSBUb3VjaE1vdXNlSW5wdXQ7XG4gICAgfVxuICAgIHJldHVybiBuZXcgKFR5cGUpKG1hbmFnZXIsIGlucHV0SGFuZGxlcik7XG59XG5cbi8qKlxuICogaGFuZGxlIGlucHV0IGV2ZW50c1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRUeXBlXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gaW5wdXRIYW5kbGVyKG1hbmFnZXIsIGV2ZW50VHlwZSwgaW5wdXQpIHtcbiAgICB2YXIgcG9pbnRlcnNMZW4gPSBpbnB1dC5wb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGNoYW5nZWRQb2ludGVyc0xlbiA9IGlucHV0LmNoYW5nZWRQb2ludGVycy5sZW5ndGg7XG4gICAgdmFyIGlzRmlyc3QgPSAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG4gICAgdmFyIGlzRmluYWwgPSAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgKHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwKSk7XG5cbiAgICBpbnB1dC5pc0ZpcnN0ID0gISFpc0ZpcnN0O1xuICAgIGlucHV0LmlzRmluYWwgPSAhIWlzRmluYWw7XG5cbiAgICBpZiAoaXNGaXJzdCkge1xuICAgICAgICBtYW5hZ2VyLnNlc3Npb24gPSB7fTtcbiAgICB9XG5cbiAgICAvLyBzb3VyY2UgZXZlbnQgaXMgdGhlIG5vcm1hbGl6ZWQgdmFsdWUgb2YgdGhlIGRvbUV2ZW50c1xuICAgIC8vIGxpa2UgJ3RvdWNoc3RhcnQsIG1vdXNldXAsIHBvaW50ZXJkb3duJ1xuICAgIGlucHV0LmV2ZW50VHlwZSA9IGV2ZW50VHlwZTtcblxuICAgIC8vIGNvbXB1dGUgc2NhbGUsIHJvdGF0aW9uIGV0Y1xuICAgIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpO1xuXG4gICAgLy8gZW1pdCBzZWNyZXQgZXZlbnRcbiAgICBtYW5hZ2VyLmVtaXQoJ2hhbW1lci5pbnB1dCcsIGlucHV0KTtcblxuICAgIG1hbmFnZXIucmVjb2duaXplKGlucHV0KTtcbiAgICBtYW5hZ2VyLnNlc3Npb24ucHJldklucHV0ID0gaW5wdXQ7XG59XG5cbi8qKlxuICogZXh0ZW5kIHRoZSBkYXRhIHdpdGggc29tZSB1c2FibGUgcHJvcGVydGllcyBsaWtlIHNjYWxlLCByb3RhdGUsIHZlbG9jaXR5IGV0Y1xuICogQHBhcmFtIHtPYmplY3R9IG1hbmFnZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBjb21wdXRlSW5wdXREYXRhKG1hbmFnZXIsIGlucHV0KSB7XG4gICAgdmFyIHNlc3Npb24gPSBtYW5hZ2VyLnNlc3Npb247XG4gICAgdmFyIHBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnM7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gc3RvcmUgdGhlIGZpcnN0IGlucHV0IHRvIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgYW5kIGRpcmVjdGlvblxuICAgIGlmICghc2Vzc2lvbi5maXJzdElucHV0KSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RJbnB1dCA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9XG5cbiAgICAvLyB0byBjb21wdXRlIHNjYWxlIGFuZCByb3RhdGlvbiB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBtdWx0aXBsZSB0b3VjaGVzXG4gICAgaWYgKHBvaW50ZXJzTGVuZ3RoID4gMSAmJiAhc2Vzc2lvbi5maXJzdE11bHRpcGxlKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgICB9IGVsc2UgaWYgKHBvaW50ZXJzTGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBmaXJzdElucHV0ID0gc2Vzc2lvbi5maXJzdElucHV0O1xuICAgIHZhciBmaXJzdE11bHRpcGxlID0gc2Vzc2lvbi5maXJzdE11bHRpcGxlO1xuICAgIHZhciBvZmZzZXRDZW50ZXIgPSBmaXJzdE11bHRpcGxlID8gZmlyc3RNdWx0aXBsZS5jZW50ZXIgOiBmaXJzdElucHV0LmNlbnRlcjtcblxuICAgIHZhciBjZW50ZXIgPSBpbnB1dC5jZW50ZXIgPSBnZXRDZW50ZXIocG9pbnRlcnMpO1xuICAgIGlucHV0LnRpbWVTdGFtcCA9IG5vdygpO1xuICAgIGlucHV0LmRlbHRhVGltZSA9IGlucHV0LnRpbWVTdGFtcCAtIGZpcnN0SW5wdXQudGltZVN0YW1wO1xuXG4gICAgaW5wdXQuYW5nbGUgPSBnZXRBbmdsZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG4gICAgaW5wdXQuZGlzdGFuY2UgPSBnZXREaXN0YW5jZShvZmZzZXRDZW50ZXIsIGNlbnRlcik7XG5cbiAgICBjb21wdXRlRGVsdGFYWShzZXNzaW9uLCBpbnB1dCk7XG4gICAgaW5wdXQub2Zmc2V0RGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcblxuICAgIHZhciBvdmVyYWxsVmVsb2NpdHkgPSBnZXRWZWxvY2l0eShpbnB1dC5kZWx0YVRpbWUsIGlucHV0LmRlbHRhWCwgaW5wdXQuZGVsdGFZKTtcbiAgICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYID0gb3ZlcmFsbFZlbG9jaXR5Lng7XG4gICAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5WSA9IG92ZXJhbGxWZWxvY2l0eS55O1xuICAgIGlucHV0Lm92ZXJhbGxWZWxvY2l0eSA9IChhYnMob3ZlcmFsbFZlbG9jaXR5LngpID4gYWJzKG92ZXJhbGxWZWxvY2l0eS55KSkgPyBvdmVyYWxsVmVsb2NpdHkueCA6IG92ZXJhbGxWZWxvY2l0eS55O1xuXG4gICAgaW5wdXQuc2NhbGUgPSBmaXJzdE11bHRpcGxlID8gZ2V0U2NhbGUoZmlyc3RNdWx0aXBsZS5wb2ludGVycywgcG9pbnRlcnMpIDogMTtcbiAgICBpbnB1dC5yb3RhdGlvbiA9IGZpcnN0TXVsdGlwbGUgPyBnZXRSb3RhdGlvbihmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAwO1xuXG4gICAgaW5wdXQubWF4UG9pbnRlcnMgPSAhc2Vzc2lvbi5wcmV2SW5wdXQgPyBpbnB1dC5wb2ludGVycy5sZW5ndGggOiAoKGlucHV0LnBvaW50ZXJzLmxlbmd0aCA+XG4gICAgICAgIHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKSA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6IHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzKTtcblxuICAgIGNvbXB1dGVJbnRlcnZhbElucHV0RGF0YShzZXNzaW9uLCBpbnB1dCk7XG5cbiAgICAvLyBmaW5kIHRoZSBjb3JyZWN0IHRhcmdldFxuICAgIHZhciB0YXJnZXQgPSBtYW5hZ2VyLmVsZW1lbnQ7XG4gICAgaWYgKGhhc1BhcmVudChpbnB1dC5zcmNFdmVudC50YXJnZXQsIHRhcmdldCkpIHtcbiAgICAgICAgdGFyZ2V0ID0gaW5wdXQuc3JjRXZlbnQudGFyZ2V0O1xuICAgIH1cbiAgICBpbnB1dC50YXJnZXQgPSB0YXJnZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlcjtcbiAgICB2YXIgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSB8fCB7fTtcbiAgICB2YXIgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgfHwge307XG4gICAgdmFyIHByZXZJbnB1dCA9IHNlc3Npb24ucHJldklucHV0IHx8IHt9O1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfU1RBUlQgfHwgcHJldklucHV0LmV2ZW50VHlwZSA9PT0gSU5QVVRfRU5EKSB7XG4gICAgICAgIHByZXZEZWx0YSA9IHNlc3Npb24ucHJldkRlbHRhID0ge1xuICAgICAgICAgICAgeDogcHJldklucHV0LmRlbHRhWCB8fCAwLFxuICAgICAgICAgICAgeTogcHJldklucHV0LmRlbHRhWSB8fCAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb2Zmc2V0ID0gc2Vzc2lvbi5vZmZzZXREZWx0YSA9IHtcbiAgICAgICAgICAgIHg6IGNlbnRlci54LFxuICAgICAgICAgICAgeTogY2VudGVyLnlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBpbnB1dC5kZWx0YVggPSBwcmV2RGVsdGEueCArIChjZW50ZXIueCAtIG9mZnNldC54KTtcbiAgICBpbnB1dC5kZWx0YVkgPSBwcmV2RGVsdGEueSArIChjZW50ZXIueSAtIG9mZnNldC55KTtcbn1cblxuLyoqXG4gKiB2ZWxvY2l0eSBpcyBjYWxjdWxhdGVkIGV2ZXJ5IHggbXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXNzaW9uXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KSB7XG4gICAgdmFyIGxhc3QgPSBzZXNzaW9uLmxhc3RJbnRlcnZhbCB8fCBpbnB1dCxcbiAgICAgICAgZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gbGFzdC50aW1lU3RhbXAsXG4gICAgICAgIHZlbG9jaXR5LCB2ZWxvY2l0eVgsIHZlbG9jaXR5WSwgZGlyZWN0aW9uO1xuXG4gICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9DQU5DRUwgJiYgKGRlbHRhVGltZSA+IENPTVBVVEVfSU5URVJWQUwgfHwgbGFzdC52ZWxvY2l0eSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICB2YXIgZGVsdGFYID0gaW5wdXQuZGVsdGFYIC0gbGFzdC5kZWx0YVg7XG4gICAgICAgIHZhciBkZWx0YVkgPSBpbnB1dC5kZWx0YVkgLSBsYXN0LmRlbHRhWTtcblxuICAgICAgICB2YXIgdiA9IGdldFZlbG9jaXR5KGRlbHRhVGltZSwgZGVsdGFYLCBkZWx0YVkpO1xuICAgICAgICB2ZWxvY2l0eVggPSB2Lng7XG4gICAgICAgIHZlbG9jaXR5WSA9IHYueTtcbiAgICAgICAgdmVsb2NpdHkgPSAoYWJzKHYueCkgPiBhYnModi55KSkgPyB2LnggOiB2Lnk7XG4gICAgICAgIGRpcmVjdGlvbiA9IGdldERpcmVjdGlvbihkZWx0YVgsIGRlbHRhWSk7XG5cbiAgICAgICAgc2Vzc2lvbi5sYXN0SW50ZXJ2YWwgPSBpbnB1dDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB1c2UgbGF0ZXN0IHZlbG9jaXR5IGluZm8gaWYgaXQgZG9lc24ndCBvdmVydGFrZSBhIG1pbmltdW0gcGVyaW9kXG4gICAgICAgIHZlbG9jaXR5ID0gbGFzdC52ZWxvY2l0eTtcbiAgICAgICAgdmVsb2NpdHlYID0gbGFzdC52ZWxvY2l0eVg7XG4gICAgICAgIHZlbG9jaXR5WSA9IGxhc3QudmVsb2NpdHlZO1xuICAgICAgICBkaXJlY3Rpb24gPSBsYXN0LmRpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBpbnB1dC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICAgIGlucHV0LnZlbG9jaXR5WCA9IHZlbG9jaXR5WDtcbiAgICBpbnB1dC52ZWxvY2l0eVkgPSB2ZWxvY2l0eVk7XG4gICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIGNyZWF0ZSBhIHNpbXBsZSBjbG9uZSBmcm9tIHRoZSBpbnB1dCB1c2VkIGZvciBzdG9yYWdlIG9mIGZpcnN0SW5wdXQgYW5kIGZpcnN0TXVsdGlwbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICogQHJldHVybnMge09iamVjdH0gY2xvbmVkSW5wdXREYXRhXG4gKi9cbmZ1bmN0aW9uIHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KSB7XG4gICAgLy8gbWFrZSBhIHNpbXBsZSBjb3B5IG9mIHRoZSBwb2ludGVycyBiZWNhdXNlIHdlIHdpbGwgZ2V0IGEgcmVmZXJlbmNlIGlmIHdlIGRvbid0XG4gICAgLy8gd2Ugb25seSBuZWVkIGNsaWVudFhZIGZvciB0aGUgY2FsY3VsYXRpb25zXG4gICAgdmFyIHBvaW50ZXJzID0gW107XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgaW5wdXQucG9pbnRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHBvaW50ZXJzW2ldID0ge1xuICAgICAgICAgICAgY2xpZW50WDogcm91bmQoaW5wdXQucG9pbnRlcnNbaV0uY2xpZW50WCksXG4gICAgICAgICAgICBjbGllbnRZOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRZKVxuICAgICAgICB9O1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGltZVN0YW1wOiBub3coKSxcbiAgICAgICAgcG9pbnRlcnM6IHBvaW50ZXJzLFxuICAgICAgICBjZW50ZXI6IGdldENlbnRlcihwb2ludGVycyksXG4gICAgICAgIGRlbHRhWDogaW5wdXQuZGVsdGFYLFxuICAgICAgICBkZWx0YVk6IGlucHV0LmRlbHRhWVxuICAgIH07XG59XG5cbi8qKlxuICogZ2V0IHRoZSBjZW50ZXIgb2YgYWxsIHRoZSBwb2ludGVyc1xuICogQHBhcmFtIHtBcnJheX0gcG9pbnRlcnNcbiAqIEByZXR1cm4ge09iamVjdH0gY2VudGVyIGNvbnRhaW5zIGB4YCBhbmQgYHlgIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gZ2V0Q2VudGVyKHBvaW50ZXJzKSB7XG4gICAgdmFyIHBvaW50ZXJzTGVuZ3RoID0gcG9pbnRlcnMubGVuZ3RoO1xuXG4gICAgLy8gbm8gbmVlZCB0byBsb29wIHdoZW4gb25seSBvbmUgdG91Y2hcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHJvdW5kKHBvaW50ZXJzWzBdLmNsaWVudFgpLFxuICAgICAgICAgICAgeTogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WSlcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgeCA9IDAsIHkgPSAwLCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHBvaW50ZXJzTGVuZ3RoKSB7XG4gICAgICAgIHggKz0gcG9pbnRlcnNbaV0uY2xpZW50WDtcbiAgICAgICAgeSArPSBwb2ludGVyc1tpXS5jbGllbnRZO1xuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogcm91bmQoeCAvIHBvaW50ZXJzTGVuZ3RoKSxcbiAgICAgICAgeTogcm91bmQoeSAvIHBvaW50ZXJzTGVuZ3RoKVxuICAgIH07XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSB2ZWxvY2l0eSBiZXR3ZWVuIHR3byBwb2ludHMuIHVuaXQgaXMgaW4gcHggcGVyIG1zLlxuICogQHBhcmFtIHtOdW1iZXJ9IGRlbHRhVGltZVxuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcmV0dXJuIHtPYmplY3R9IHZlbG9jaXR5IGB4YCBhbmQgYHlgXG4gKi9cbmZ1bmN0aW9uIGdldFZlbG9jaXR5KGRlbHRhVGltZSwgeCwgeSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHggLyBkZWx0YVRpbWUgfHwgMCxcbiAgICAgICAgeTogeSAvIGRlbHRhVGltZSB8fCAwXG4gICAgfTtcbn1cblxuLyoqXG4gKiBnZXQgdGhlIGRpcmVjdGlvbiBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHJldHVybiB7TnVtYmVyfSBkaXJlY3Rpb25cbiAqL1xuZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKHgsIHkpIHtcbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgICByZXR1cm4gRElSRUNUSU9OX05PTkU7XG4gICAgfVxuXG4gICAgaWYgKGFicyh4KSA+PSBhYnMoeSkpIHtcbiAgICAgICAgcmV0dXJuIHggPCAwID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFQ7XG4gICAgfVxuICAgIHJldHVybiB5IDwgMCA/IERJUkVDVElPTl9VUCA6IERJUkVDVElPTl9ET1dOO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgYWJzb2x1dGUgZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG4gKiBAcGFyYW0ge09iamVjdH0gcDEge3gsIHl9XG4gKiBAcGFyYW0ge09iamVjdH0gcDIge3gsIHl9XG4gKiBAcGFyYW0ge0FycmF5fSBbcHJvcHNdIGNvbnRhaW5pbmcgeCBhbmQgeSBrZXlzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAxLCBwMiwgcHJvcHMpIHtcbiAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgIHByb3BzID0gUFJPUFNfWFk7XG4gICAgfVxuICAgIHZhciB4ID0gcDJbcHJvcHNbMF1dIC0gcDFbcHJvcHNbMF1dLFxuICAgICAgICB5ID0gcDJbcHJvcHNbMV1dIC0gcDFbcHJvcHNbMV1dO1xuXG4gICAgcmV0dXJuIE1hdGguc3FydCgoeCAqIHgpICsgKHkgKiB5KSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBhbmdsZSBiZXR3ZWVuIHR3byBjb29yZGluYXRlc1xuICogQHBhcmFtIHtPYmplY3R9IHAxXG4gKiBAcGFyYW0ge09iamVjdH0gcDJcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZ2V0QW5nbGUocDEsIHAyLCBwcm9wcykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgICB9XG4gICAgdmFyIHggPSBwMltwcm9wc1swXV0gLSBwMVtwcm9wc1swXV0sXG4gICAgICAgIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAxODAgLyBNYXRoLlBJO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gZGVncmVlcyBiZXR3ZWVuIHR3byBwb2ludGVyc2V0c1xuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSByb3RhdGlvblxuICovXG5mdW5jdGlvbiBnZXRSb3RhdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGdldEFuZ2xlKGVuZFsxXSwgZW5kWzBdLCBQUk9QU19DTElFTlRfWFkpICsgZ2V0QW5nbGUoc3RhcnRbMV0sIHN0YXJ0WzBdLCBQUk9QU19DTElFTlRfWFkpO1xufVxuXG4vKipcbiAqIGNhbGN1bGF0ZSB0aGUgc2NhbGUgZmFjdG9yIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBubyBzY2FsZSBpcyAxLCBhbmQgZ29lcyBkb3duIHRvIDAgd2hlbiBwaW5jaGVkIHRvZ2V0aGVyLCBhbmQgYmlnZ2VyIHdoZW4gcGluY2hlZCBvdXRcbiAqIEBwYXJhbSB7QXJyYXl9IHN0YXJ0IGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBlbmQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEByZXR1cm4ge051bWJlcn0gc2NhbGVcbiAqL1xuZnVuY3Rpb24gZ2V0U2NhbGUoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBnZXREaXN0YW5jZShlbmRbMF0sIGVuZFsxXSwgUFJPUFNfQ0xJRU5UX1hZKSAvIGdldERpc3RhbmNlKHN0YXJ0WzBdLCBzdGFydFsxXSwgUFJPUFNfQ0xJRU5UX1hZKTtcbn1cblxudmFyIE1PVVNFX0lOUFVUX01BUCA9IHtcbiAgICBtb3VzZWRvd246IElOUFVUX1NUQVJULFxuICAgIG1vdXNlbW92ZTogSU5QVVRfTU9WRSxcbiAgICBtb3VzZXVwOiBJTlBVVF9FTkRcbn07XG5cbnZhciBNT1VTRV9FTEVNRU5UX0VWRU5UUyA9ICdtb3VzZWRvd24nO1xudmFyIE1PVVNFX1dJTkRPV19FVkVOVFMgPSAnbW91c2Vtb3ZlIG1vdXNldXAnO1xuXG4vKipcbiAqIE1vdXNlIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBNb3VzZUlucHV0KCkge1xuICAgIHRoaXMuZXZFbCA9IE1PVVNFX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBNT1VTRV9XSU5ET1dfRVZFTlRTO1xuXG4gICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7IC8vIG1vdXNlZG93biBzdGF0ZVxuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChNb3VzZUlucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBNRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IE1PVVNFX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBvbiBzdGFydCB3ZSB3YW50IHRvIGhhdmUgdGhlIGxlZnQgbW91c2UgYnV0dG9uIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIGV2LmJ1dHRvbiA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9NT1ZFICYmIGV2LndoaWNoICE9PSAxKSB7XG4gICAgICAgICAgICBldmVudFR5cGUgPSBJTlBVVF9FTkQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKCF0aGlzLnByZXNzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHRoaXMucHJlc3NlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9NT1VTRSxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxudmFyIFBPSU5URVJfSU5QVVRfTUFQID0ge1xuICAgIHBvaW50ZXJkb3duOiBJTlBVVF9TVEFSVCxcbiAgICBwb2ludGVybW92ZTogSU5QVVRfTU9WRSxcbiAgICBwb2ludGVydXA6IElOUFVUX0VORCxcbiAgICBwb2ludGVyY2FuY2VsOiBJTlBVVF9DQU5DRUwsXG4gICAgcG9pbnRlcm91dDogSU5QVVRfQ0FOQ0VMXG59O1xuXG4vLyBpbiBJRTEwIHRoZSBwb2ludGVyIHR5cGVzIGlzIGRlZmluZWQgYXMgYW4gZW51bVxudmFyIElFMTBfUE9JTlRFUl9UWVBFX0VOVU0gPSB7XG4gICAgMjogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAzOiBJTlBVVF9UWVBFX1BFTixcbiAgICA0OiBJTlBVVF9UWVBFX01PVVNFLFxuICAgIDU6IElOUFVUX1RZUEVfS0lORUNUIC8vIHNlZSBodHRwczovL3R3aXR0ZXIuY29tL2phY29icm9zc2kvc3RhdHVzLzQ4MDU5NjQzODQ4OTg5MDgxNlxufTtcblxudmFyIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAncG9pbnRlcmRvd24nO1xudmFyIFBPSU5URVJfV0lORE9XX0VWRU5UUyA9ICdwb2ludGVybW92ZSBwb2ludGVydXAgcG9pbnRlcmNhbmNlbCc7XG5cbi8vIElFMTAgaGFzIHByZWZpeGVkIHN1cHBvcnQsIGFuZCBjYXNlLXNlbnNpdGl2ZVxuaWYgKHdpbmRvdy5NU1BvaW50ZXJFdmVudCAmJiAhd2luZG93LlBvaW50ZXJFdmVudCkge1xuICAgIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAnTVNQb2ludGVyRG93bic7XG4gICAgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ01TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsJztcbn1cblxuLyoqXG4gKiBQb2ludGVyIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBQb2ludGVyRXZlbnRJbnB1dCgpIHtcbiAgICB0aGlzLmV2RWwgPSBQT0lOVEVSX0VMRU1FTlRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBQT0lOVEVSX1dJTkRPV19FVkVOVFM7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5zdG9yZSA9ICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzID0gW10pO1xufVxuXG5pbmhlcml0KFBvaW50ZXJFdmVudElucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBQRWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHN0b3JlID0gdGhpcy5zdG9yZTtcbiAgICAgICAgdmFyIHJlbW92ZVBvaW50ZXIgPSBmYWxzZTtcblxuICAgICAgICB2YXIgZXZlbnRUeXBlTm9ybWFsaXplZCA9IGV2LnR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdtcycsICcnKTtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IFBPSU5URVJfSU5QVVRfTUFQW2V2ZW50VHlwZU5vcm1hbGl6ZWRdO1xuICAgICAgICB2YXIgcG9pbnRlclR5cGUgPSBJRTEwX1BPSU5URVJfVFlQRV9FTlVNW2V2LnBvaW50ZXJUeXBlXSB8fCBldi5wb2ludGVyVHlwZTtcblxuICAgICAgICB2YXIgaXNUb3VjaCA9IChwb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX1RPVUNIKTtcblxuICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGV2ZW50IGluIHRoZSBzdG9yZVxuICAgICAgICB2YXIgc3RvcmVJbmRleCA9IGluQXJyYXkoc3RvcmUsIGV2LnBvaW50ZXJJZCwgJ3BvaW50ZXJJZCcpO1xuXG4gICAgICAgIC8vIHN0YXJ0IGFuZCBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIChldi5idXR0b24gPT09IDAgfHwgaXNUb3VjaCkpIHtcbiAgICAgICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHN0b3JlLnB1c2goZXYpO1xuICAgICAgICAgICAgICAgIHN0b3JlSW5kZXggPSBzdG9yZS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgICAgICByZW1vdmVQb2ludGVyID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0IG5vdCBmb3VuZCwgc28gdGhlIHBvaW50ZXIgaGFzbid0IGJlZW4gZG93biAoc28gaXQncyBwcm9iYWJseSBhIGhvdmVyKVxuICAgICAgICBpZiAoc3RvcmVJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICAgIHN0b3JlW3N0b3JlSW5kZXhdID0gZXY7XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHN0b3JlLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiBbZXZdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IHBvaW50ZXJUeXBlLFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChyZW1vdmVQb2ludGVyKSB7XG4gICAgICAgICAgICAvLyByZW1vdmUgZnJvbSB0aGUgc3RvcmVcbiAgICAgICAgICAgIHN0b3JlLnNwbGljZShzdG9yZUluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG52YXIgU0lOR0xFX1RPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgU0lOR0xFX1RPVUNIX1RBUkdFVF9FVkVOVFMgPSAndG91Y2hzdGFydCc7XG52YXIgU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFMgPSAndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwnO1xuXG4vKipcbiAqIFRvdWNoIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBTaW5nbGVUb3VjaElucHV0KCkge1xuICAgIHRoaXMuZXZUYXJnZXQgPSBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLmV2V2luID0gU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFM7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFNpbmdsZVRvdWNoSW5wdXQsIElucHV0LCB7XG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVEVoYW5kbGVyKGV2KSB7XG4gICAgICAgIHZhciB0eXBlID0gU0lOR0xFX1RPVUNIX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgICAvLyBzaG91bGQgd2UgaGFuZGxlIHRoZSB0b3VjaCBldmVudHM/XG4gICAgICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG91Y2hlcyA9IG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMuY2FsbCh0aGlzLCBldiwgdHlwZSk7XG5cbiAgICAgICAgLy8gd2hlbiBkb25lLCByZXNldCB0aGUgc3RhcnRlZCBzdGF0ZVxuICAgICAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmIHRvdWNoZXNbMF0ubGVuZ3RoIC0gdG91Y2hlc1sxXS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsIHR5cGUsIHtcbiAgICAgICAgICAgIHBvaW50ZXJzOiB0b3VjaGVzWzBdLFxuICAgICAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiB0b3VjaGVzWzFdLFxuICAgICAgICAgICAgcG9pbnRlclR5cGU6IElOUFVUX1RZUEVfVE9VQ0gsXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQHRoaXMge1RvdWNoSW5wdXR9XG4gKiBAcGFyYW0ge09iamVjdH0gZXZcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlIGZsYWdcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR8QXJyYXl9IFthbGwsIGNoYW5nZWRdXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNpbmdsZVRvdWNoZXMoZXYsIHR5cGUpIHtcbiAgICB2YXIgYWxsID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgY2hhbmdlZCA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpO1xuXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICBhbGwgPSB1bmlxdWVBcnJheShhbGwuY29uY2F0KGNoYW5nZWQpLCAnaWRlbnRpZmllcicsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBbYWxsLCBjaGFuZ2VkXTtcbn1cblxudmFyIFRPVUNIX0lOUFVUX01BUCA9IHtcbiAgICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgICB0b3VjaG1vdmU6IElOUFVUX01PVkUsXG4gICAgdG91Y2hlbmQ6IElOUFVUX0VORCxcbiAgICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogTXVsdGktdXNlciB0b3VjaCBldmVudHMgaW5wdXRcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgSW5wdXRcbiAqL1xuZnVuY3Rpb24gVG91Y2hJbnB1dCgpIHtcbiAgICB0aGlzLmV2VGFyZ2V0ID0gVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICB0aGlzLnRhcmdldElkcyA9IHt9O1xuXG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChUb3VjaElucHV0LCBJbnB1dCwge1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1URWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBUT1VDSF9JTlBVVF9NQVBbZXYudHlwZV07XG4gICAgICAgIHZhciB0b3VjaGVzID0gZ2V0VG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcbiAgICAgICAgaWYgKCF0b3VjaGVzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IHRvdWNoZXNbMV0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cbiAqL1xuZnVuY3Rpb24gZ2V0VG91Y2hlcyhldiwgdHlwZSkge1xuICAgIHZhciBhbGxUb3VjaGVzID0gdG9BcnJheShldi50b3VjaGVzKTtcbiAgICB2YXIgdGFyZ2V0SWRzID0gdGhpcy50YXJnZXRJZHM7XG5cbiAgICAvLyB3aGVuIHRoZXJlIGlzIG9ubHkgb25lIHRvdWNoLCB0aGUgcHJvY2VzcyBjYW4gYmUgc2ltcGxpZmllZFxuICAgIGlmICh0eXBlICYgKElOUFVUX1NUQVJUIHwgSU5QVVRfTU9WRSkgJiYgYWxsVG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGFyZ2V0SWRzW2FsbFRvdWNoZXNbMF0uaWRlbnRpZmllcl0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gW2FsbFRvdWNoZXMsIGFsbFRvdWNoZXNdO1xuICAgIH1cblxuICAgIHZhciBpLFxuICAgICAgICB0YXJnZXRUb3VjaGVzLFxuICAgICAgICBjaGFuZ2VkVG91Y2hlcyA9IHRvQXJyYXkoZXYuY2hhbmdlZFRvdWNoZXMpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyA9IFtdLFxuICAgICAgICB0YXJnZXQgPSB0aGlzLnRhcmdldDtcblxuICAgIC8vIGdldCB0YXJnZXQgdG91Y2hlcyBmcm9tIHRvdWNoZXNcbiAgICB0YXJnZXRUb3VjaGVzID0gYWxsVG91Y2hlcy5maWx0ZXIoZnVuY3Rpb24odG91Y2gpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhcmVudCh0b3VjaC50YXJnZXQsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICAvLyBjb2xsZWN0IHRvdWNoZXNcbiAgICBpZiAodHlwZSA9PT0gSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhcmdldElkc1t0YXJnZXRUb3VjaGVzW2ldLmlkZW50aWZpZXJdID0gdHJ1ZTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZpbHRlciBjaGFuZ2VkIHRvdWNoZXMgdG8gb25seSBjb250YWluIHRvdWNoZXMgdGhhdCBleGlzdCBpbiB0aGUgY29sbGVjdGVkIHRhcmdldCBpZHNcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGNoYW5nZWRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAodGFyZ2V0SWRzW2NoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXJdKSB7XG4gICAgICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5wdXNoKGNoYW5nZWRUb3VjaGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFudXAgcmVtb3ZlZCB0b3VjaGVzXG4gICAgICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl07XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgIH1cblxuICAgIGlmICghY2hhbmdlZFRhcmdldFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgICAvLyBtZXJnZSB0YXJnZXRUb3VjaGVzIHdpdGggY2hhbmdlZFRhcmdldFRvdWNoZXMgc28gaXQgY29udGFpbnMgQUxMIHRvdWNoZXMsIGluY2x1ZGluZyAnZW5kJyBhbmQgJ2NhbmNlbCdcbiAgICAgICAgdW5pcXVlQXJyYXkodGFyZ2V0VG91Y2hlcy5jb25jYXQoY2hhbmdlZFRhcmdldFRvdWNoZXMpLCAnaWRlbnRpZmllcicsIHRydWUpLFxuICAgICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlc1xuICAgIF07XG59XG5cbi8qKlxuICogQ29tYmluZWQgdG91Y2ggYW5kIG1vdXNlIGlucHV0XG4gKlxuICogVG91Y2ggaGFzIGEgaGlnaGVyIHByaW9yaXR5IHRoZW4gbW91c2UsIGFuZCB3aGlsZSB0b3VjaGluZyBubyBtb3VzZSBldmVudHMgYXJlIGFsbG93ZWQuXG4gKiBUaGlzIGJlY2F1c2UgdG91Y2ggZGV2aWNlcyBhbHNvIGVtaXQgbW91c2UgZXZlbnRzIHdoaWxlIGRvaW5nIGEgdG91Y2guXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5cbnZhciBERURVUF9USU1FT1VUID0gMjUwMDtcbnZhciBERURVUF9ESVNUQU5DRSA9IDI1O1xuXG5mdW5jdGlvbiBUb3VjaE1vdXNlSW5wdXQoKSB7XG4gICAgSW5wdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBoYW5kbGVyID0gYmluZEZuKHRoaXMuaGFuZGxlciwgdGhpcyk7XG4gICAgdGhpcy50b3VjaCA9IG5ldyBUb3VjaElucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG4gICAgdGhpcy5tb3VzZSA9IG5ldyBNb3VzZUlucHV0KHRoaXMubWFuYWdlciwgaGFuZGxlcik7XG5cbiAgICB0aGlzLnByaW1hcnlUb3VjaCA9IG51bGw7XG4gICAgdGhpcy5sYXN0VG91Y2hlcyA9IFtdO1xufVxuXG5pbmhlcml0KFRvdWNoTW91c2VJbnB1dCwgSW5wdXQsIHtcbiAgICAvKipcbiAgICAgKiBoYW5kbGUgbW91c2UgYW5kIHRvdWNoIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGlucHV0RXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXREYXRhXG4gICAgICovXG4gICAgaGFuZGxlcjogZnVuY3Rpb24gVE1FaGFuZGxlcihtYW5hZ2VyLCBpbnB1dEV2ZW50LCBpbnB1dERhdGEpIHtcbiAgICAgICAgdmFyIGlzVG91Y2ggPSAoaW5wdXREYXRhLnBvaW50ZXJUeXBlID09IElOUFVUX1RZUEVfVE9VQ0gpLFxuICAgICAgICAgICAgaXNNb3VzZSA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9NT1VTRSk7XG5cbiAgICAgICAgaWYgKGlzTW91c2UgJiYgaW5wdXREYXRhLnNvdXJjZUNhcGFiaWxpdGllcyAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzLmZpcmVzVG91Y2hFdmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdoZW4gd2UncmUgaW4gYSB0b3VjaCBldmVudCwgcmVjb3JkIHRvdWNoZXMgdG8gIGRlLWR1cGUgc3ludGhldGljIG1vdXNlIGV2ZW50XG4gICAgICAgIGlmIChpc1RvdWNoKSB7XG4gICAgICAgICAgICByZWNvcmRUb3VjaGVzLmNhbGwodGhpcywgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc01vdXNlICYmIGlzU3ludGhldGljRXZlbnQuY2FsbCh0aGlzLCBpbnB1dERhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy50b3VjaC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMubW91c2UuZGVzdHJveSgpO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiByZWNvcmRUb3VjaGVzKGV2ZW50VHlwZSwgZXZlbnREYXRhKSB7XG4gICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgIHRoaXMucHJpbWFyeVRvdWNoID0gZXZlbnREYXRhLmNoYW5nZWRQb2ludGVyc1swXS5pZGVudGlmaWVyO1xuICAgICAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgc2V0TGFzdFRvdWNoLmNhbGwodGhpcywgZXZlbnREYXRhKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldExhc3RUb3VjaChldmVudERhdGEpIHtcbiAgICB2YXIgdG91Y2ggPSBldmVudERhdGEuY2hhbmdlZFBvaW50ZXJzWzBdO1xuXG4gICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IHRoaXMucHJpbWFyeVRvdWNoKSB7XG4gICAgICAgIHZhciBsYXN0VG91Y2ggPSB7eDogdG91Y2guY2xpZW50WCwgeTogdG91Y2guY2xpZW50WX07XG4gICAgICAgIHRoaXMubGFzdFRvdWNoZXMucHVzaChsYXN0VG91Y2gpO1xuICAgICAgICB2YXIgbHRzID0gdGhpcy5sYXN0VG91Y2hlcztcbiAgICAgICAgdmFyIHJlbW92ZUxhc3RUb3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBsdHMuaW5kZXhPZihsYXN0VG91Y2gpO1xuICAgICAgICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGx0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNldFRpbWVvdXQocmVtb3ZlTGFzdFRvdWNoLCBERURVUF9USU1FT1VUKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzU3ludGhldGljRXZlbnQoZXZlbnREYXRhKSB7XG4gICAgdmFyIHggPSBldmVudERhdGEuc3JjRXZlbnQuY2xpZW50WCwgeSA9IGV2ZW50RGF0YS5zcmNFdmVudC5jbGllbnRZO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sYXN0VG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdCA9IHRoaXMubGFzdFRvdWNoZXNbaV07XG4gICAgICAgIHZhciBkeCA9IE1hdGguYWJzKHggLSB0LngpLCBkeSA9IE1hdGguYWJzKHkgLSB0LnkpO1xuICAgICAgICBpZiAoZHggPD0gREVEVVBfRElTVEFOQ0UgJiYgZHkgPD0gREVEVVBfRElTVEFOQ0UpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxudmFyIFBSRUZJWEVEX1RPVUNIX0FDVElPTiA9IHByZWZpeGVkKFRFU1RfRUxFTUVOVC5zdHlsZSwgJ3RvdWNoQWN0aW9uJyk7XG52YXIgTkFUSVZFX1RPVUNIX0FDVElPTiA9IFBSRUZJWEVEX1RPVUNIX0FDVElPTiAhPT0gdW5kZWZpbmVkO1xuXG4vLyBtYWdpY2FsIHRvdWNoQWN0aW9uIHZhbHVlXG52YXIgVE9VQ0hfQUNUSU9OX0NPTVBVVEUgPSAnY29tcHV0ZSc7XG52YXIgVE9VQ0hfQUNUSU9OX0FVVE8gPSAnYXV0byc7XG52YXIgVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTiA9ICdtYW5pcHVsYXRpb24nOyAvLyBub3QgaW1wbGVtZW50ZWRcbnZhciBUT1VDSF9BQ1RJT05fTk9ORSA9ICdub25lJztcbnZhciBUT1VDSF9BQ1RJT05fUEFOX1ggPSAncGFuLXgnO1xudmFyIFRPVUNIX0FDVElPTl9QQU5fWSA9ICdwYW4teSc7XG52YXIgVE9VQ0hfQUNUSU9OX01BUCA9IGdldFRvdWNoQWN0aW9uUHJvcHMoKTtcblxuLyoqXG4gKiBUb3VjaCBBY3Rpb25cbiAqIHNldHMgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IG9yIHVzZXMgdGhlIGpzIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRvdWNoQWN0aW9uKG1hbmFnZXIsIHZhbHVlKSB7XG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLnNldCh2YWx1ZSk7XG59XG5cblRvdWNoQWN0aW9uLnByb3RvdHlwZSA9IHtcbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIHRvdWNoQWN0aW9uIHZhbHVlIG9uIHRoZSBlbGVtZW50IG9yIGVuYWJsZSB0aGUgcG9seWZpbGxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIGZpbmQgb3V0IHRoZSB0b3VjaC1hY3Rpb24gYnkgdGhlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIGlmICh2YWx1ZSA9PSBUT1VDSF9BQ1RJT05fQ09NUFVURSkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbXB1dGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOQVRJVkVfVE9VQ0hfQUNUSU9OICYmIHRoaXMubWFuYWdlci5lbGVtZW50LnN0eWxlICYmIFRPVUNIX0FDVElPTl9NQVBbdmFsdWVdKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZWxlbWVudC5zdHlsZVtQUkVGSVhFRF9UT1VDSF9BQ1RJT05dID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3Rpb25zID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGp1c3QgcmUtc2V0IHRoZSB0b3VjaEFjdGlvbiB2YWx1ZVxuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc2V0KHRoaXMubWFuYWdlci5vcHRpb25zLnRvdWNoQWN0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY29tcHV0ZSB0aGUgdmFsdWUgZm9yIHRoZSB0b3VjaEFjdGlvbiBwcm9wZXJ0eSBiYXNlZCBvbiB0aGUgcmVjb2duaXplcidzIHNldHRpbmdzXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBjb21wdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgZWFjaCh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsIGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgIGlmIChib29sT3JGbihyZWNvZ25pemVyLm9wdGlvbnMuZW5hYmxlLCBbcmVjb2duaXplcl0pKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucyA9IGFjdGlvbnMuY29uY2F0KHJlY29nbml6ZXIuZ2V0VG91Y2hBY3Rpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucy5qb2luKCcgJykpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb24gZWFjaCBpbnB1dCBjeWNsZSBhbmQgcHJvdmlkZXMgdGhlIHByZXZlbnRpbmcgb2YgdGhlIGJyb3dzZXIgYmVoYXZpb3JcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBwcmV2ZW50RGVmYXVsdHM6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzcmNFdmVudCA9IGlucHV0LnNyY0V2ZW50O1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQub2Zmc2V0RGlyZWN0aW9uO1xuXG4gICAgICAgIC8vIGlmIHRoZSB0b3VjaCBhY3Rpb24gZGlkIHByZXZlbnRlZCBvbmNlIHRoaXMgc2Vzc2lvblxuICAgICAgICBpZiAodGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkKSB7XG4gICAgICAgICAgICBzcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGlvbnMgPSB0aGlzLmFjdGlvbnM7XG4gICAgICAgIHZhciBoYXNOb25lID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICAgICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWV07XG4gICAgICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKSAmJiAhVE9VQ0hfQUNUSU9OX01BUFtUT1VDSF9BQ1RJT05fUEFOX1hdO1xuXG4gICAgICAgIGlmIChoYXNOb25lKSB7XG4gICAgICAgICAgICAvL2RvIG5vdCBwcmV2ZW50IGRlZmF1bHRzIGlmIHRoaXMgaXMgYSB0YXAgZ2VzdHVyZVxuXG4gICAgICAgICAgICB2YXIgaXNUYXBQb2ludGVyID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSAxO1xuICAgICAgICAgICAgdmFyIGlzVGFwTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IDI7XG4gICAgICAgICAgICB2YXIgaXNUYXBUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCAyNTA7XG5cbiAgICAgICAgICAgIGlmIChpc1RhcFBvaW50ZXIgJiYgaXNUYXBNb3ZlbWVudCAmJiBpc1RhcFRvdWNoVGltZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgICAgIC8vIGBwYW4teCBwYW4teWAgbWVhbnMgYnJvd3NlciBoYW5kbGVzIGFsbCBzY3JvbGxpbmcvcGFubmluZywgZG8gbm90IHByZXZlbnRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNOb25lIHx8XG4gICAgICAgICAgICAoaGFzUGFuWSAmJiBkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkgfHxcbiAgICAgICAgICAgIChoYXNQYW5YICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXZlbnRTcmMoc3JjRXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbGwgcHJldmVudERlZmF1bHQgdG8gcHJldmVudCB0aGUgYnJvd3NlcidzIGRlZmF1bHQgYmVoYXZpb3IgKHNjcm9sbGluZyBpbiBtb3N0IGNhc2VzKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcmNFdmVudFxuICAgICAqL1xuICAgIHByZXZlbnRTcmM6IGZ1bmN0aW9uKHNyY0V2ZW50KSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZCA9IHRydWU7XG4gICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiB3aGVuIHRoZSB0b3VjaEFjdGlvbnMgYXJlIGNvbGxlY3RlZCB0aGV5IGFyZSBub3QgYSB2YWxpZCB2YWx1ZSwgc28gd2UgbmVlZCB0byBjbGVhbiB0aGluZ3MgdXAuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gY2xlYW5Ub3VjaEFjdGlvbnMoYWN0aW9ucykge1xuICAgIC8vIG5vbmVcbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX05PTkUpKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICB2YXIgaGFzUGFuWCA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpO1xuXG4gICAgLy8gaWYgYm90aCBwYW4teCBhbmQgcGFuLXkgYXJlIHNldCAoZGlmZmVyZW50IHJlY29nbml6ZXJzXG4gICAgLy8gZm9yIGRpZmZlcmVudCBkaXJlY3Rpb25zLCBlLmcuIGhvcml6b250YWwgcGFuIGJ1dCB2ZXJ0aWNhbCBzd2lwZT8pXG4gICAgLy8gd2UgbmVlZCBub25lIChhcyBvdGhlcndpc2Ugd2l0aCBwYW4teCBwYW4teSBjb21iaW5lZCBub25lIG9mIHRoZXNlXG4gICAgLy8gcmVjb2duaXplcnMgd2lsbCB3b3JrLCBzaW5jZSB0aGUgYnJvd3NlciB3b3VsZCBoYW5kbGUgYWxsIHBhbm5pbmdcbiAgICBpZiAoaGFzUGFuWCAmJiBoYXNQYW5ZKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICAvLyBwYW4teCBPUiBwYW4teVxuICAgIGlmIChoYXNQYW5YIHx8IGhhc1BhblkpIHtcbiAgICAgICAgcmV0dXJuIGhhc1BhblggPyBUT1VDSF9BQ1RJT05fUEFOX1ggOiBUT1VDSF9BQ1RJT05fUEFOX1k7XG4gICAgfVxuXG4gICAgLy8gbWFuaXB1bGF0aW9uXG4gICAgaWYgKGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04pKSB7XG4gICAgICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTUFOSVBVTEFUSU9OO1xuICAgIH1cblxuICAgIHJldHVybiBUT1VDSF9BQ1RJT05fQVVUTztcbn1cblxuZnVuY3Rpb24gZ2V0VG91Y2hBY3Rpb25Qcm9wcygpIHtcbiAgICBpZiAoIU5BVElWRV9UT1VDSF9BQ1RJT04pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdG91Y2hNYXAgPSB7fTtcbiAgICB2YXIgY3NzU3VwcG9ydHMgPSB3aW5kb3cuQ1NTICYmIHdpbmRvdy5DU1Muc3VwcG9ydHM7XG4gICAgWydhdXRvJywgJ21hbmlwdWxhdGlvbicsICdwYW4teScsICdwYW4teCcsICdwYW4teCBwYW4teScsICdub25lJ10uZm9yRWFjaChmdW5jdGlvbih2YWwpIHtcblxuICAgICAgICAvLyBJZiBjc3Muc3VwcG9ydHMgaXMgbm90IHN1cHBvcnRlZCBidXQgdGhlcmUgaXMgbmF0aXZlIHRvdWNoLWFjdGlvbiBhc3N1bWUgaXQgc3VwcG9ydHNcbiAgICAgICAgLy8gYWxsIHZhbHVlcy4gVGhpcyBpcyB0aGUgY2FzZSBmb3IgSUUgMTAgYW5kIDExLlxuICAgICAgICB0b3VjaE1hcFt2YWxdID0gY3NzU3VwcG9ydHMgPyB3aW5kb3cuQ1NTLnN1cHBvcnRzKCd0b3VjaC1hY3Rpb24nLCB2YWwpIDogdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdG91Y2hNYXA7XG59XG5cbi8qKlxuICogUmVjb2duaXplciBmbG93IGV4cGxhaW5lZDsgKlxuICogQWxsIHJlY29nbml6ZXJzIGhhdmUgdGhlIGluaXRpYWwgc3RhdGUgb2YgUE9TU0lCTEUgd2hlbiBhIGlucHV0IHNlc3Npb24gc3RhcnRzLlxuICogVGhlIGRlZmluaXRpb24gb2YgYSBpbnB1dCBzZXNzaW9uIGlzIGZyb20gdGhlIGZpcnN0IGlucHV0IHVudGlsIHRoZSBsYXN0IGlucHV0LCB3aXRoIGFsbCBpdCdzIG1vdmVtZW50IGluIGl0LiAqXG4gKiBFeGFtcGxlIHNlc3Npb24gZm9yIG1vdXNlLWlucHV0OiBtb3VzZWRvd24gLT4gbW91c2Vtb3ZlIC0+IG1vdXNldXBcbiAqXG4gKiBPbiBlYWNoIHJlY29nbml6aW5nIGN5Y2xlIChzZWUgTWFuYWdlci5yZWNvZ25pemUpIHRoZSAucmVjb2duaXplKCkgbWV0aG9kIGlzIGV4ZWN1dGVkXG4gKiB3aGljaCBkZXRlcm1pbmVzIHdpdGggc3RhdGUgaXQgc2hvdWxkIGJlLlxuICpcbiAqIElmIHRoZSByZWNvZ25pemVyIGhhcyB0aGUgc3RhdGUgRkFJTEVELCBDQU5DRUxMRUQgb3IgUkVDT0dOSVpFRCAoZXF1YWxzIEVOREVEKSwgaXQgaXMgcmVzZXQgdG9cbiAqIFBPU1NJQkxFIHRvIGdpdmUgaXQgYW5vdGhlciBjaGFuZ2Ugb24gdGhlIG5leHQgY3ljbGUuXG4gKlxuICogICAgICAgICAgICAgICBQb3NzaWJsZVxuICogICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICstLS0tLSstLS0tLS0tLS0tLS0tLS0rXG4gKiAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICstLS0tLSstLS0tLSsgICAgICAgICAgICAgICB8XG4gKiAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICB8XG4gKiAgIEZhaWxlZCAgICAgIENhbmNlbGxlZCAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0rLS0tLS0tK1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgIFJlY29nbml6ZWQgICAgICAgQmVnYW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZGVkL1JlY29nbml6ZWRcbiAqL1xudmFyIFNUQVRFX1BPU1NJQkxFID0gMTtcbnZhciBTVEFURV9CRUdBTiA9IDI7XG52YXIgU1RBVEVfQ0hBTkdFRCA9IDQ7XG52YXIgU1RBVEVfRU5ERUQgPSA4O1xudmFyIFNUQVRFX1JFQ09HTklaRUQgPSBTVEFURV9FTkRFRDtcbnZhciBTVEFURV9DQU5DRUxMRUQgPSAxNjtcbnZhciBTVEFURV9GQUlMRUQgPSAzMjtcblxuLyoqXG4gKiBSZWNvZ25pemVyXG4gKiBFdmVyeSByZWNvZ25pemVyIG5lZWRzIHRvIGV4dGVuZCBmcm9tIHRoaXMgY2xhc3MuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIFJlY29nbml6ZXIob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLmlkID0gdW5pcXVlSWQoKTtcblxuICAgIHRoaXMubWFuYWdlciA9IG51bGw7XG5cbiAgICAvLyBkZWZhdWx0IGlzIGVuYWJsZSB0cnVlXG4gICAgdGhpcy5vcHRpb25zLmVuYWJsZSA9IGlmVW5kZWZpbmVkKHRoaXMub3B0aW9ucy5lbmFibGUsIHRydWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuXG4gICAgdGhpcy5zaW11bHRhbmVvdXMgPSB7fTtcbiAgICB0aGlzLnJlcXVpcmVGYWlsID0gW107XG59XG5cblJlY29nbml6ZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIEB2aXJ0dWFsXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBkZWZhdWx0czoge30sXG5cbiAgICAvKipcbiAgICAgKiBzZXQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQHJldHVybiB7UmVjb2duaXplcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gYWxzbyB1cGRhdGUgdGhlIHRvdWNoQWN0aW9uLCBpbiBjYXNlIHNvbWV0aGluZyBjaGFuZ2VkIGFib3V0IHRoZSBkaXJlY3Rpb25zL2VuYWJsZWQgc3RhdGVcbiAgICAgICAgdGhpcy5tYW5hZ2VyICYmIHRoaXMubWFuYWdlci50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyLlxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2ltdWx0YW5lb3VzID0gdGhpcy5zaW11bHRhbmVvdXM7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKCFzaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXSkge1xuICAgICAgICAgICAgc2ltdWx0YW5lb3VzW290aGVyUmVjb2duaXplci5pZF0gPSBvdGhlclJlY29nbml6ZXI7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVjb2duaXplV2l0aCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZHJvcCB0aGUgc2ltdWx0YW5lb3VzIGxpbmsuIGl0IGRvZXNudCByZW1vdmUgdGhlIGxpbmsgb24gdGhlIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIGRyb3BSZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZWNvZ25pemVXaXRoJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBkZWxldGUgdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlY29nbml6ZXIgY2FuIG9ubHkgcnVuIHdoZW4gYW4gb3RoZXIgaXMgZmFpbGluZ1xuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICByZXF1aXJlRmFpbHVyZTogZnVuY3Rpb24ob3RoZXJSZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhvdGhlclJlY29nbml6ZXIsICdyZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXF1aXJlRmFpbCA9IHRoaXMucmVxdWlyZUZhaWw7XG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgaWYgKGluQXJyYXkocmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcikgPT09IC0xKSB7XG4gICAgICAgICAgICByZXF1aXJlRmFpbC5wdXNoKG90aGVyUmVjb2duaXplcik7XG4gICAgICAgICAgICBvdGhlclJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRyb3AgdGhlIHJlcXVpcmVGYWlsdXJlIGxpbmsuIGl0IGRvZXMgbm90IHJlbW92ZSB0aGUgbGluayBvbiB0aGUgb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG4gICAgZHJvcFJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZXF1aXJlRmFpbHVyZScsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheSh0aGlzLnJlcXVpcmVGYWlsLCBvdGhlclJlY29nbml6ZXIpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5yZXF1aXJlRmFpbC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBoYXMgcmVxdWlyZSBmYWlsdXJlcyBib29sZWFuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzUmVxdWlyZUZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogaWYgdGhlIHJlY29nbml6ZXIgY2FuIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5SZWNvZ25pemVXaXRoOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5zaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogWW91IHNob3VsZCB1c2UgYHRyeUVtaXRgIGluc3RlYWQgb2YgYGVtaXRgIGRpcmVjdGx5IHRvIGNoZWNrXG4gICAgICogdGhhdCBhbGwgdGhlIG5lZWRlZCByZWNvZ25pemVycyBoYXMgZmFpbGVkIGJlZm9yZSBlbWl0dGluZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG5cbiAgICAgICAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgICAgICAgICAgc2VsZi5tYW5hZ2VyLmVtaXQoZXZlbnQsIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vICdwYW5zdGFydCcgYW5kICdwYW5tb3ZlJ1xuICAgICAgICBpZiAoc3RhdGUgPCBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQpOyAvLyBzaW1wbGUgJ2V2ZW50TmFtZScgZXZlbnRzXG5cbiAgICAgICAgaWYgKGlucHV0LmFkZGl0aW9uYWxFdmVudCkgeyAvLyBhZGRpdGlvbmFsIGV2ZW50KHBhbmxlZnQsIHBhbnJpZ2h0LCBwaW5jaGluLCBwaW5jaG91dC4uLilcbiAgICAgICAgICAgIGVtaXQoaW5wdXQuYWRkaXRpb25hbEV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHBhbmVuZCBhbmQgcGFuY2FuY2VsXG4gICAgICAgIGlmIChzdGF0ZSA+PSBTVEFURV9FTkRFRCkge1xuICAgICAgICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQgKyBzdGF0ZVN0cihzdGF0ZSkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHRoYXQgYWxsIHRoZSByZXF1aXJlIGZhaWx1cmUgcmVjb2duaXplcnMgaGFzIGZhaWxlZCxcbiAgICAgKiBpZiB0cnVlLCBpdCBlbWl0cyBhIGdlc3R1cmUgZXZlbnQsXG4gICAgICogb3RoZXJ3aXNlLCBzZXR1cCB0aGUgc3RhdGUgdG8gRkFJTEVELlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIHRyeUVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhbkVtaXQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW1pdChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaXQncyBmYWlsaW5nIGFueXdheVxuICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjYW4gd2UgZW1pdD9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBjYW5FbWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoISh0aGlzLnJlcXVpcmVGYWlsW2ldLnN0YXRlICYgKFNUQVRFX0ZBSUxFRCB8IFNUQVRFX1BPU1NJQkxFKSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSB0aGUgcmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICAvLyBtYWtlIGEgbmV3IGNvcHkgb2YgdGhlIGlucHV0RGF0YVxuICAgICAgICAvLyBzbyB3ZSBjYW4gY2hhbmdlIHRoZSBpbnB1dERhdGEgd2l0aG91dCBtZXNzaW5nIHVwIHRoZSBvdGhlciByZWNvZ25pemVyc1xuICAgICAgICB2YXIgaW5wdXREYXRhQ2xvbmUgPSBhc3NpZ24oe30sIGlucHV0RGF0YSk7XG5cbiAgICAgICAgLy8gaXMgaXMgZW5hYmxlZCBhbmQgYWxsb3cgcmVjb2duaXppbmc/XG4gICAgICAgIGlmICghYm9vbE9yRm4odGhpcy5vcHRpb25zLmVuYWJsZSwgW3RoaXMsIGlucHV0RGF0YUNsb25lXSkpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXNldCB3aGVuIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZFxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9SRUNPR05JWkVEIHwgU1RBVEVfQ0FOQ0VMTEVEIHwgU1RBVEVfRkFJTEVEKSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMucHJvY2VzcyhpbnB1dERhdGFDbG9uZSk7XG5cbiAgICAgICAgLy8gdGhlIHJlY29nbml6ZXIgaGFzIHJlY29nbml6ZWQgYSBnZXN0dXJlXG4gICAgICAgIC8vIHNvIHRyaWdnZXIgYW4gZXZlbnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQgfCBTVEFURV9DQU5DRUxMRUQpKSB7XG4gICAgICAgICAgICB0aGlzLnRyeUVtaXQoaW5wdXREYXRhQ2xvbmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aGUgc3RhdGUgb2YgdGhlIHJlY29nbml6ZXJcbiAgICAgKiB0aGUgYWN0dWFsIHJlY29nbml6aW5nIGhhcHBlbnMgaW4gdGhpcyBtZXRob2RcbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKiBAcmV0dXJucyB7Q29uc3R9IFNUQVRFXG4gICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXREYXRhKSB7IH0sIC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBwcmVmZXJyZWQgdG91Y2gtYWN0aW9uXG4gICAgICogQHZpcnR1YWxcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkgeyB9LFxuXG4gICAgLyoqXG4gICAgICogY2FsbGVkIHdoZW4gdGhlIGdlc3R1cmUgaXNuJ3QgYWxsb3dlZCB0byByZWNvZ25pemVcbiAgICAgKiBsaWtlIHdoZW4gYW5vdGhlciBpcyBiZWluZyByZWNvZ25pemVkIG9yIGl0IGlzIGRpc2FibGVkXG4gICAgICogQHZpcnR1YWxcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24oKSB7IH1cbn07XG5cbi8qKlxuICogZ2V0IGEgdXNhYmxlIHN0cmluZywgdXNlZCBhcyBldmVudCBwb3N0Zml4XG4gKiBAcGFyYW0ge0NvbnN0fSBzdGF0ZVxuICogQHJldHVybnMge1N0cmluZ30gc3RhdGVcbiAqL1xuZnVuY3Rpb24gc3RhdGVTdHIoc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgJiBTVEFURV9DQU5DRUxMRUQpIHtcbiAgICAgICAgcmV0dXJuICdjYW5jZWwnO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9FTkRFRCkge1xuICAgICAgICByZXR1cm4gJ2VuZCc7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0NIQU5HRUQpIHtcbiAgICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQkVHQU4pIHtcbiAgICAgICAgcmV0dXJuICdzdGFydCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBkaXJlY3Rpb24gY29ucyB0byBzdHJpbmdcbiAqIEBwYXJhbSB7Q29uc3R9IGRpcmVjdGlvblxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZGlyZWN0aW9uU3RyKGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0RPV04pIHtcbiAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fVVApIHtcbiAgICAgICAgcmV0dXJuICd1cCc7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT0gRElSRUNUSU9OX0xFRlQpIHtcbiAgICAgICAgcmV0dXJuICdsZWZ0JztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fUklHSFQpIHtcbiAgICAgICAgcmV0dXJuICdyaWdodCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBnZXQgYSByZWNvZ25pemVyIGJ5IG5hbWUgaWYgaXQgaXMgYm91bmQgdG8gYSBtYW5hZ2VyXG4gKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSBvdGhlclJlY29nbml6ZXJcbiAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICogQHJldHVybnMge1JlY29nbml6ZXJ9XG4gKi9cbmZ1bmN0aW9uIGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCByZWNvZ25pemVyKSB7XG4gICAgdmFyIG1hbmFnZXIgPSByZWNvZ25pemVyLm1hbmFnZXI7XG4gICAgaWYgKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hbmFnZXIuZ2V0KG90aGVyUmVjb2duaXplcik7XG4gICAgfVxuICAgIHJldHVybiBvdGhlclJlY29nbml6ZXI7XG59XG5cbi8qKlxuICogVGhpcyByZWNvZ25pemVyIGlzIGp1c3QgdXNlZCBhcyBhIGJhc2UgZm9yIHRoZSBzaW1wbGUgYXR0cmlidXRlIHJlY29nbml6ZXJzLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIEF0dHJSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cblxuaW5oZXJpdChBdHRyUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgQXR0clJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMVxuICAgICAgICAgKi9cbiAgICAgICAgcG9pbnRlcnM6IDFcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXNlZCB0byBjaGVjayBpZiBpdCB0aGUgcmVjb2duaXplciByZWNlaXZlcyB2YWxpZCBpbnB1dCwgbGlrZSBpbnB1dC5kaXN0YW5jZSA+IDEwLlxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSByZWNvZ25pemVkXG4gICAgICovXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25Qb2ludGVycyA9IHRoaXMub3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgcmV0dXJuIG9wdGlvblBvaW50ZXJzID09PSAwIHx8IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9uUG9pbnRlcnM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgdGhlIGlucHV0IGFuZCByZXR1cm4gdGhlIHN0YXRlIGZvciB0aGUgcmVjb2duaXplclxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHsqfSBTdGF0ZVxuICAgICAqL1xuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgICAgIHZhciBldmVudFR5cGUgPSBpbnB1dC5ldmVudFR5cGU7XG5cbiAgICAgICAgdmFyIGlzUmVjb2duaXplZCA9IHN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCk7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gdGhpcy5hdHRyVGVzdChpbnB1dCk7XG5cbiAgICAgICAgLy8gb24gY2FuY2VsIGlucHV0IGFuZCB3ZSd2ZSByZWNvZ25pemVkIGJlZm9yZSwgcmV0dXJuIFNUQVRFX0NBTkNFTExFRFxuICAgICAgICBpZiAoaXNSZWNvZ25pemVkICYmIChldmVudFR5cGUgJiBJTlBVVF9DQU5DRUwgfHwgIWlzVmFsaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9DQU5DRUxMRUQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNSZWNvZ25pemVkIHx8IGlzVmFsaWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUgfCBTVEFURV9FTkRFRDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIShzdGF0ZSAmIFNUQVRFX0JFR0FOKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9CRUdBTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NIQU5HRUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBQYW5cbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGFuZCBtb3ZlZCBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBhblJlY29nbml6ZXIoKSB7XG4gICAgQXR0clJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMucFggPSBudWxsO1xuICAgIHRoaXMucFkgPSBudWxsO1xufVxuXG5pbmhlcml0KFBhblJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBQYW5SZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwYW4nLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgZGlyZWN0aW9uOiBESVJFQ1RJT05fQUxMXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICAgICAgYWN0aW9ucy5wdXNoKFRPVUNIX0FDVElPTl9QQU5fWCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvbnM7XG4gICAgfSxcblxuICAgIGRpcmVjdGlvblRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgaGFzTW92ZWQgPSB0cnVlO1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBpbnB1dC5kaXN0YW5jZTtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGlucHV0LmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIHggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHZhciB5ID0gaW5wdXQuZGVsdGFZO1xuXG4gICAgICAgIC8vIGxvY2sgdG8gYXhpcz9cbiAgICAgICAgaWYgKCEoZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9ICh4ID09PSAwKSA/IERJUkVDVElPTl9OT05FIDogKHggPCAwKSA/IERJUkVDVElPTl9MRUZUIDogRElSRUNUSU9OX1JJR0hUO1xuICAgICAgICAgICAgICAgIGhhc01vdmVkID0geCAhPSB0aGlzLnBYO1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoaW5wdXQuZGVsdGFYKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHkgPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeSA8IDApID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG4gICAgICAgICAgICAgICAgaGFzTW92ZWQgPSB5ICE9IHRoaXMucFk7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlucHV0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgICAgcmV0dXJuIGhhc01vdmVkICYmIGRpc3RhbmNlID4gb3B0aW9ucy50aHJlc2hvbGQgJiYgZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gQXR0clJlY29nbml6ZXIucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXG4gICAgICAgICAgICAodGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOIHx8ICghKHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTikgJiYgdGhpcy5kaXJlY3Rpb25UZXN0KGlucHV0KSkpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuXG4gICAgICAgIHRoaXMucFggPSBpbnB1dC5kZWx0YVg7XG4gICAgICAgIHRoaXMucFkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvblN0cihpbnB1dC5kaXJlY3Rpb24pO1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGRpcmVjdGlvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlci5lbWl0LmNhbGwodGhpcywgaW5wdXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFBpbmNoXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlcnMgYXJlIG1vdmluZyB0b3dhcmQgKHpvb20taW4pIG9yIGF3YXkgZnJvbSBlYWNoIG90aGVyICh6b29tLW91dCkuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFBpbmNoUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFBpbmNoUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAncGluY2gnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5zY2FsZSAtIDEpID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCB8fCB0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4pO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIHZhciBpbk91dCA9IGlucHV0LnNjYWxlIDwgMSA/ICdpbicgOiAnb3V0JztcbiAgICAgICAgICAgIGlucHV0LmFkZGl0aW9uYWxFdmVudCA9IHRoaXMub3B0aW9ucy5ldmVudCArIGluT3V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogUHJlc3NcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGZvciB4IG1zIHdpdGhvdXQgYW55IG1vdmVtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFByZXNzUmVjb2duaXplcigpIHtcbiAgICBSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xufVxuXG5pbmhlcml0KFByZXNzUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUHJlc3NSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwcmVzcycsXG4gICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICB0aW1lOiAyNTEsIC8vIG1pbmltYWwgdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBwcmVzc2VkXG4gICAgICAgIHRocmVzaG9sZDogOSAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX0FVVE9dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgdmFyIHZhbGlkUG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IG9wdGlvbnMucG9pbnRlcnM7XG4gICAgICAgIHZhciB2YWxpZE1vdmVtZW50ID0gaW5wdXQuZGlzdGFuY2UgPCBvcHRpb25zLnRocmVzaG9sZDtcbiAgICAgICAgdmFyIHZhbGlkVGltZSA9IGlucHV0LmRlbHRhVGltZSA+IG9wdGlvbnMudGltZTtcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKCF2YWxpZE1vdmVtZW50IHx8ICF2YWxpZFBvaW50ZXJzIHx8IChpbnB1dC5ldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiAhdmFsaWRUaW1lKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXRDb250ZXh0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgfSwgb3B0aW9ucy50aW1lLCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnB1dCAmJiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EKSkge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgJ3VwJywgaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFJvdGF0ZVxuICogUmVjb2duaXplZCB3aGVuIHR3byBvciBtb3JlIHBvaW50ZXIgYXJlIG1vdmluZyBpbiBhIGNpcmN1bGFyIG1vdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUm90YXRlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFJvdGF0ZVJlY29nbml6ZXIsIEF0dHJSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBSb3RhdGVSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdyb3RhdGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgIHBvaW50ZXJzOiAyXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgIChNYXRoLmFicyhpbnB1dC5yb3RhdGlvbikgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfVxufSk7XG5cbi8qKlxuICogU3dpcGVcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBtb3ZpbmcgZmFzdCAodmVsb2NpdHkpLCB3aXRoIGVub3VnaCBkaXN0YW5jZSBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFN3aXBlUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFN3aXBlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFN3aXBlUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAnc3dpcGUnLFxuICAgICAgICB0aHJlc2hvbGQ6IDEwLFxuICAgICAgICB2ZWxvY2l0eTogMC4zLFxuICAgICAgICBkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgICAgICBwb2ludGVyczogMVxuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBQYW5SZWNvZ25pemVyLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IHRoaXMub3B0aW9ucy5kaXJlY3Rpb247XG4gICAgICAgIHZhciB2ZWxvY2l0eTtcblxuICAgICAgICBpZiAoZGlyZWN0aW9uICYgKERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMKSkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uICYgRElSRUNUSU9OX0hPUklaT05UQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WDtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fVkVSVElDQUwpIHtcbiAgICAgICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5WTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgZGlyZWN0aW9uICYgaW5wdXQub2Zmc2V0RGlyZWN0aW9uICYmXG4gICAgICAgICAgICBpbnB1dC5kaXN0YW5jZSA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgJiZcbiAgICAgICAgICAgIGlucHV0Lm1heFBvaW50ZXJzID09IHRoaXMub3B0aW9ucy5wb2ludGVycyAmJlxuICAgICAgICAgICAgYWJzKHZlbG9jaXR5KSA+IHRoaXMub3B0aW9ucy52ZWxvY2l0eSAmJiBpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQ7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQub2Zmc2V0RGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uLCBpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIGlucHV0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBIHRhcCBpcyBlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb2luZyBhIHNtYWxsIHRhcC9jbGljay4gTXVsdGlwbGUgdGFwcyBhcmUgcmVjb2duaXplZCBpZiB0aGV5IG9jY3VyXG4gKiBiZXR3ZWVuIHRoZSBnaXZlbiBpbnRlcnZhbCBhbmQgcG9zaXRpb24uIFRoZSBkZWxheSBvcHRpb24gY2FuIGJlIHVzZWQgdG8gcmVjb2duaXplIG11bHRpLXRhcHMgd2l0aG91dCBmaXJpbmdcbiAqIGEgc2luZ2xlIHRhcC5cbiAqXG4gKiBUaGUgZXZlbnREYXRhIGZyb20gdGhlIGVtaXR0ZWQgZXZlbnQgY29udGFpbnMgdGhlIHByb3BlcnR5IGB0YXBDb3VudGAsIHdoaWNoIGNvbnRhaW5zIHRoZSBhbW91bnQgb2ZcbiAqIG11bHRpLXRhcHMgYmVpbmcgcmVjb2duaXplZC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgUmVjb2duaXplclxuICovXG5mdW5jdGlvbiBUYXBSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIC8vIHByZXZpb3VzIHRpbWUgYW5kIGNlbnRlcixcbiAgICAvLyB1c2VkIGZvciB0YXAgY291bnRpbmdcbiAgICB0aGlzLnBUaW1lID0gZmFsc2U7XG4gICAgdGhpcy5wQ2VudGVyID0gZmFsc2U7XG5cbiAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgdGhpcy5faW5wdXQgPSBudWxsO1xuICAgIHRoaXMuY291bnQgPSAwO1xufVxuXG5pbmhlcml0KFRhcFJlY29nbml6ZXIsIFJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBpbmNoUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIGV2ZW50OiAndGFwJyxcbiAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgIHRhcHM6IDEsXG4gICAgICAgIGludGVydmFsOiAzMDAsIC8vIG1heCB0aW1lIGJldHdlZW4gdGhlIG11bHRpLXRhcCB0YXBzXG4gICAgICAgIHRpbWU6IDI1MCwgLy8gbWF4IHRpbWUgb2YgdGhlIHBvaW50ZXIgdG8gYmUgZG93biAobGlrZSBmaW5nZXIgb24gdGhlIHNjcmVlbilcbiAgICAgICAgdGhyZXNob2xkOiA5LCAvLyBhIG1pbmltYWwgbW92ZW1lbnQgaXMgb2ssIGJ1dCBrZWVwIGl0IGxvd1xuICAgICAgICBwb3NUaHJlc2hvbGQ6IDEwIC8vIGEgbXVsdGktdGFwIGNhbiBiZSBhIGJpdCBvZmYgdGhlIGluaXRpYWwgcG9zaXRpb25cbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9NQU5JUFVMQVRJT05dO1xuICAgIH0sXG5cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgdmFyIHZhbGlkTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IG9wdGlvbnMudGhyZXNob2xkO1xuICAgICAgICB2YXIgdmFsaWRUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCBvcHRpb25zLnRpbWU7XG5cbiAgICAgICAgdGhpcy5yZXNldCgpO1xuXG4gICAgICAgIGlmICgoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpICYmICh0aGlzLmNvdW50ID09PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIG9ubHkgYWxsb3cgbGl0dGxlIG1vdmVtZW50XG4gICAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgICAgaWYgKHZhbGlkTW92ZW1lbnQgJiYgdmFsaWRUb3VjaFRpbWUgJiYgdmFsaWRQb2ludGVycykge1xuICAgICAgICAgICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPSBJTlBVVF9FTkQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWRJbnRlcnZhbCA9IHRoaXMucFRpbWUgPyAoaW5wdXQudGltZVN0YW1wIC0gdGhpcy5wVGltZSA8IG9wdGlvbnMuaW50ZXJ2YWwpIDogdHJ1ZTtcbiAgICAgICAgICAgIHZhciB2YWxpZE11bHRpVGFwID0gIXRoaXMucENlbnRlciB8fCBnZXREaXN0YW5jZSh0aGlzLnBDZW50ZXIsIGlucHV0LmNlbnRlcikgPCBvcHRpb25zLnBvc1RocmVzaG9sZDtcblxuICAgICAgICAgICAgdGhpcy5wVGltZSA9IGlucHV0LnRpbWVTdGFtcDtcbiAgICAgICAgICAgIHRoaXMucENlbnRlciA9IGlucHV0LmNlbnRlcjtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZE11bHRpVGFwIHx8ICF2YWxpZEludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCA9IDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcblxuICAgICAgICAgICAgLy8gaWYgdGFwIGNvdW50IG1hdGNoZXMgd2UgaGF2ZSByZWNvZ25pemVkIGl0LFxuICAgICAgICAgICAgLy8gZWxzZSBpdCBoYXMgYmVnYW4gcmVjb2duaXppbmcuLi5cbiAgICAgICAgICAgIHZhciB0YXBDb3VudCA9IHRoaXMuY291bnQgJSBvcHRpb25zLnRhcHM7XG4gICAgICAgICAgICBpZiAodGFwQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBubyBmYWlsaW5nIHJlcXVpcmVtZW50cywgaW1tZWRpYXRlbHkgdHJpZ2dlciB0aGUgdGFwIGV2ZW50XG4gICAgICAgICAgICAgICAgLy8gb3Igd2FpdCBhcyBsb25nIGFzIHRoZSBtdWx0aXRhcCBpbnRlcnZhbCB0byB0cmlnZ2VyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1JlcXVpcmVGYWlsdXJlcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUkVDT0dOSVpFRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJ5RW1pdCgpO1xuICAgICAgICAgICAgICAgICAgICB9LCBvcHRpb25zLmludGVydmFsLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX0JFR0FOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICBmYWlsVGltZW91dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfRkFJTEVEO1xuICAgICAgICB9LCB0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PSBTVEFURV9SRUNPR05JWkVEKSB7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50YXBDb3VudCA9IHRoaXMuY291bnQ7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG4vKipcbiAqIFNpbXBsZSB3YXkgdG8gY3JlYXRlIGEgbWFuYWdlciB3aXRoIGEgZGVmYXVsdCBzZXQgb2YgcmVjb2duaXplcnMuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSGFtbWVyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLnJlY29nbml6ZXJzID0gaWZVbmRlZmluZWQob3B0aW9ucy5yZWNvZ25pemVycywgSGFtbWVyLmRlZmF1bHRzLnByZXNldCk7XG4gICAgcmV0dXJuIG5ldyBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpO1xufVxuXG4vKipcbiAqIEBjb25zdCB7c3RyaW5nfVxuICovXG5IYW1tZXIuVkVSU0lPTiA9ICcyLjAuNyc7XG5cbi8qKlxuICogZGVmYXVsdCBzZXR0aW5nc1xuICogQG5hbWVzcGFjZVxuICovXG5IYW1tZXIuZGVmYXVsdHMgPSB7XG4gICAgLyoqXG4gICAgICogc2V0IGlmIERPTSBldmVudHMgYXJlIGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBCdXQgdGhpcyBpcyBzbG93ZXIgYW5kIHVudXNlZCBieSBzaW1wbGUgaW1wbGVtZW50YXRpb25zLCBzbyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgZG9tRXZlbnRzOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5L2ZhbGxiYWNrLlxuICAgICAqIFdoZW4gc2V0IHRvIGBjb21wdXRlYCBpdCB3aWxsIG1hZ2ljYWxseSBzZXQgdGhlIGNvcnJlY3QgdmFsdWUgYmFzZWQgb24gdGhlIGFkZGVkIHJlY29nbml6ZXJzLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgY29tcHV0ZVxuICAgICAqL1xuICAgIHRvdWNoQWN0aW9uOiBUT1VDSF9BQ1RJT05fQ09NUFVURSxcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgKi9cbiAgICBlbmFibGU6IHRydWUsXG5cbiAgICAvKipcbiAgICAgKiBFWFBFUklNRU5UQUwgRkVBVFVSRSAtLSBjYW4gYmUgcmVtb3ZlZC9jaGFuZ2VkXG4gICAgICogQ2hhbmdlIHRoZSBwYXJlbnQgaW5wdXQgdGFyZ2V0IGVsZW1lbnQuXG4gICAgICogSWYgTnVsbCwgdGhlbiBpdCBpcyBiZWluZyBzZXQgdGhlIHRvIG1haW4gZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVsbHxFdmVudFRhcmdldH1cbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICovXG4gICAgaW5wdXRUYXJnZXQ6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBmb3JjZSBhbiBpbnB1dCBjbGFzc1xuICAgICAqIEB0eXBlIHtOdWxsfEZ1bmN0aW9ufVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBpbnB1dENsYXNzOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogRGVmYXVsdCByZWNvZ25pemVyIHNldHVwIHdoZW4gY2FsbGluZyBgSGFtbWVyKClgXG4gICAgICogV2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyIHRoZXNlIHdpbGwgYmUgc2tpcHBlZC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgcHJlc2V0OiBbXG4gICAgICAgIC8vIFJlY29nbml6ZXJDbGFzcywgb3B0aW9ucywgW3JlY29nbml6ZVdpdGgsIC4uLl0sIFtyZXF1aXJlRmFpbHVyZSwgLi4uXVxuICAgICAgICBbUm90YXRlUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9XSxcbiAgICAgICAgW1BpbmNoUmVjb2duaXplciwge2VuYWJsZTogZmFsc2V9LCBbJ3JvdGF0ZSddXSxcbiAgICAgICAgW1N3aXBlUmVjb2duaXplciwge2RpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUx9XSxcbiAgICAgICAgW1BhblJlY29nbml6ZXIsIHtkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMfSwgWydzd2lwZSddXSxcbiAgICAgICAgW1RhcFJlY29nbml6ZXJdLFxuICAgICAgICBbVGFwUmVjb2duaXplciwge2V2ZW50OiAnZG91YmxldGFwJywgdGFwczogMn0sIFsndGFwJ11dLFxuICAgICAgICBbUHJlc3NSZWNvZ25pemVyXVxuICAgIF0sXG5cbiAgICAvKipcbiAgICAgKiBTb21lIENTUyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvIGltcHJvdmUgdGhlIHdvcmtpbmcgb2YgSGFtbWVyLlxuICAgICAqIEFkZCB0aGVtIHRvIHRoaXMgbWV0aG9kIGFuZCB0aGV5IHdpbGwgYmUgc2V0IHdoZW4gY3JlYXRpbmcgYSBuZXcgTWFuYWdlci5cbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICovXG4gICAgY3NzUHJvcHM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRleHQgc2VsZWN0aW9uIHRvIGltcHJvdmUgdGhlIGRyYWdnaW5nIGdlc3R1cmUuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGUgdGhlIFdpbmRvd3MgUGhvbmUgZ3JpcHBlcnMgd2hlbiBwcmVzc2luZyBhbiBlbGVtZW50LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoU2VsZWN0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc2FibGVzIHRoZSBkZWZhdWx0IGNhbGxvdXQgc2hvd24gd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQuXG4gICAgICAgICAqIE9uIGlPUywgd2hlbiB5b3UgdG91Y2ggYW5kIGhvbGQgYSB0b3VjaCB0YXJnZXQgc3VjaCBhcyBhIGxpbmssIFNhZmFyaSBkaXNwbGF5c1xuICAgICAgICAgKiBhIGNhbGxvdXQgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbGluay4gVGhpcyBwcm9wZXJ0eSBhbGxvd3MgeW91IHRvIGRpc2FibGUgdGhhdCBjYWxsb3V0LlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHRvdWNoQ2FsbG91dDogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgd2hldGhlciB6b29taW5nIGlzIGVuYWJsZWQuIFVzZWQgYnkgSUUxMD5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICBjb250ZW50Wm9vbWluZzogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGVjaWZpZXMgdGhhdCBhbiBlbnRpcmUgZWxlbWVudCBzaG91bGQgYmUgZHJhZ2dhYmxlIGluc3RlYWQgb2YgaXRzIGNvbnRlbnRzLiBNYWlubHkgZm9yIGRlc2t0b3AgYnJvd3NlcnMuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdXNlckRyYWc6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3ZlcnJpZGVzIHRoZSBoaWdobGlnaHQgY29sb3Igc2hvd24gd2hlbiB0aGUgdXNlciB0YXBzIGEgbGluayBvciBhIEphdmFTY3JpcHRcbiAgICAgICAgICogY2xpY2thYmxlIGVsZW1lbnQgaW4gaU9TLiBUaGlzIHByb3BlcnR5IG9iZXlzIHRoZSBhbHBoYSB2YWx1ZSwgaWYgc3BlY2lmaWVkLlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAncmdiYSgwLDAsMCwwKSdcbiAgICAgICAgICovXG4gICAgICAgIHRhcEhpZ2hsaWdodENvbG9yOiAncmdiYSgwLDAsMCwwKSdcbiAgICB9XG59O1xuXG52YXIgU1RPUCA9IDE7XG52YXIgRk9SQ0VEX1NUT1AgPSAyO1xuXG4vKipcbiAqIE1hbmFnZXJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYW5hZ2VyKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBhc3NpZ24oe30sIEhhbW1lci5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgPSB0aGlzLm9wdGlvbnMuaW5wdXRUYXJnZXQgfHwgZWxlbWVudDtcblxuICAgIHRoaXMuaGFuZGxlcnMgPSB7fTtcbiAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICB0aGlzLnJlY29nbml6ZXJzID0gW107XG4gICAgdGhpcy5vbGRDc3NQcm9wcyA9IHt9O1xuXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB0aGlzLmlucHV0ID0gY3JlYXRlSW5wdXRJbnN0YW5jZSh0aGlzKTtcbiAgICB0aGlzLnRvdWNoQWN0aW9uID0gbmV3IFRvdWNoQWN0aW9uKHRoaXMsIHRoaXMub3B0aW9ucy50b3VjaEFjdGlvbik7XG5cbiAgICB0b2dnbGVDc3NQcm9wcyh0aGlzLCB0cnVlKTtcblxuICAgIGVhY2godGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciByZWNvZ25pemVyID0gdGhpcy5hZGQobmV3IChpdGVtWzBdKShpdGVtWzFdKSk7XG4gICAgICAgIGl0ZW1bMl0gJiYgcmVjb2duaXplci5yZWNvZ25pemVXaXRoKGl0ZW1bMl0pO1xuICAgICAgICBpdGVtWzNdICYmIHJlY29nbml6ZXIucmVxdWlyZUZhaWx1cmUoaXRlbVszXSk7XG4gICAgfSwgdGhpcyk7XG59XG5cbk1hbmFnZXIucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7TWFuYWdlcn1cbiAgICAgKi9cbiAgICBzZXQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgICAgLy8gT3B0aW9ucyB0aGF0IG5lZWQgYSBsaXR0bGUgbW9yZSBzZXR1cFxuICAgICAgICBpZiAob3B0aW9ucy50b3VjaEFjdGlvbikge1xuICAgICAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5pbnB1dFRhcmdldCkge1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZXhpc3RpbmcgZXZlbnQgbGlzdGVuZXJzIGFuZCByZWluaXRpYWxpemVcbiAgICAgICAgICAgIHRoaXMuaW5wdXQuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC50YXJnZXQgPSBvcHRpb25zLmlucHV0VGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5pbml0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHN0b3AgcmVjb2duaXppbmcgZm9yIHRoaXMgc2Vzc2lvbi5cbiAgICAgKiBUaGlzIHNlc3Npb24gd2lsbCBiZSBkaXNjYXJkZWQsIHdoZW4gYSBuZXcgW2lucHV0XXN0YXJ0IGV2ZW50IGlzIGZpcmVkLlxuICAgICAqIFdoZW4gZm9yY2VkLCB0aGUgcmVjb2duaXplciBjeWNsZSBpcyBzdG9wcGVkIGltbWVkaWF0ZWx5LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ZvcmNlXVxuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKGZvcmNlKSB7XG4gICAgICAgIHRoaXMuc2Vzc2lvbi5zdG9wcGVkID0gZm9yY2UgPyBGT1JDRURfU1RPUCA6IFNUT1A7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJ1biB0aGUgcmVjb2duaXplcnMhXG4gICAgICogY2FsbGVkIGJ5IHRoZSBpbnB1dEhhbmRsZXIgZnVuY3Rpb24gb24gZXZlcnkgbW92ZW1lbnQgb2YgdGhlIHBvaW50ZXJzICh0b3VjaGVzKVxuICAgICAqIGl0IHdhbGtzIHRocm91Z2ggYWxsIHRoZSByZWNvZ25pemVycyBhbmQgdHJpZXMgdG8gZGV0ZWN0IHRoZSBnZXN0dXJlIHRoYXQgaXMgYmVpbmcgbWFkZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICByZWNvZ25pemU6IGZ1bmN0aW9uKGlucHV0RGF0YSkge1xuICAgICAgICB2YXIgc2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbjtcbiAgICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcnVuIHRoZSB0b3VjaC1hY3Rpb24gcG9seWZpbGxcbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi5wcmV2ZW50RGVmYXVsdHMoaW5wdXREYXRhKTtcblxuICAgICAgICB2YXIgcmVjb2duaXplcjtcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcblxuICAgICAgICAvLyB0aGlzIGhvbGRzIHRoZSByZWNvZ25pemVyIHRoYXQgaXMgYmVpbmcgcmVjb2duaXplZC5cbiAgICAgICAgLy8gc28gdGhlIHJlY29nbml6ZXIncyBzdGF0ZSBuZWVkcyB0byBiZSBCRUdBTiwgQ0hBTkdFRCwgRU5ERUQgb3IgUkVDT0dOSVpFRFxuICAgICAgICAvLyBpZiBubyByZWNvZ25pemVyIGlzIGRldGVjdGluZyBhIHRoaW5nLCBpdCBpcyBzZXQgdG8gYG51bGxgXG4gICAgICAgIHZhciBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyO1xuXG4gICAgICAgIC8vIHJlc2V0IHdoZW4gdGhlIGxhc3QgcmVjb2duaXplciBpcyByZWNvZ25pemVkXG4gICAgICAgIC8vIG9yIHdoZW4gd2UncmUgaW4gYSBuZXcgc2Vzc2lvblxuICAgICAgICBpZiAoIWN1clJlY29nbml6ZXIgfHwgKGN1clJlY29nbml6ZXIgJiYgY3VyUmVjb2duaXplci5zdGF0ZSAmIFNUQVRFX1JFQ09HTklaRUQpKSB7XG4gICAgICAgICAgICBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCByZWNvZ25pemVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlY29nbml6ZXIgPSByZWNvZ25pemVyc1tpXTtcblxuICAgICAgICAgICAgLy8gZmluZCBvdXQgaWYgd2UgYXJlIGFsbG93ZWQgdHJ5IHRvIHJlY29nbml6ZSB0aGUgaW5wdXQgZm9yIHRoaXMgb25lLlxuICAgICAgICAgICAgLy8gMS4gICBhbGxvdyBpZiB0aGUgc2Vzc2lvbiBpcyBOT1QgZm9yY2VkIHN0b3BwZWQgKHNlZSB0aGUgLnN0b3AoKSBtZXRob2QpXG4gICAgICAgICAgICAvLyAyLiAgIGFsbG93IGlmIHdlIHN0aWxsIGhhdmVuJ3QgcmVjb2duaXplZCBhIGdlc3R1cmUgaW4gdGhpcyBzZXNzaW9uLCBvciB0aGUgdGhpcyByZWNvZ25pemVyIGlzIHRoZSBvbmVcbiAgICAgICAgICAgIC8vICAgICAgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgICAgICAgLy8gMy4gICBhbGxvdyBpZiB0aGUgcmVjb2duaXplciBpcyBhbGxvd2VkIHRvIHJ1biBzaW11bHRhbmVvdXMgd2l0aCB0aGUgY3VycmVudCByZWNvZ25pemVkIHJlY29nbml6ZXIuXG4gICAgICAgICAgICAvLyAgICAgIHRoaXMgY2FuIGJlIHNldHVwIHdpdGggdGhlIGByZWNvZ25pemVXaXRoKClgIG1ldGhvZCBvbiB0aGUgcmVjb2duaXplci5cbiAgICAgICAgICAgIGlmIChzZXNzaW9uLnN0b3BwZWQgIT09IEZPUkNFRF9TVE9QICYmICggLy8gMVxuICAgICAgICAgICAgICAgICAgICAhY3VyUmVjb2duaXplciB8fCByZWNvZ25pemVyID09IGN1clJlY29nbml6ZXIgfHwgLy8gMlxuICAgICAgICAgICAgICAgICAgICByZWNvZ25pemVyLmNhblJlY29nbml6ZVdpdGgoY3VyUmVjb2duaXplcikpKSB7IC8vIDNcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlY29nbml6ZShpbnB1dERhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVyLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSByZWNvZ25pemVyIGhhcyBiZWVuIHJlY29nbml6aW5nIHRoZSBpbnB1dCBhcyBhIHZhbGlkIGdlc3R1cmUsIHdlIHdhbnQgdG8gc3RvcmUgdGhpcyBvbmUgYXMgdGhlXG4gICAgICAgICAgICAvLyBjdXJyZW50IGFjdGl2ZSByZWNvZ25pemVyLiBidXQgb25seSBpZiB3ZSBkb24ndCBhbHJlYWR5IGhhdmUgYW4gYWN0aXZlIHJlY29nbml6ZXJcbiAgICAgICAgICAgIGlmICghY3VyUmVjb2duaXplciAmJiByZWNvZ25pemVyLnN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCB8IFNUQVRFX0VOREVEKSkge1xuICAgICAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSByZWNvZ25pemVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGdldCBhIHJlY29nbml6ZXIgYnkgaXRzIGV2ZW50IG5hbWUuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfFN0cmluZ30gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE51bGx9XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChyZWNvZ25pemVyIGluc3RhbmNlb2YgUmVjb2duaXplcikge1xuICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlY29nbml6ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVjb2duaXplcnNbaV0ub3B0aW9ucy5ldmVudCA9PSByZWNvZ25pemVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY29nbml6ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBhZGQgYSByZWNvZ25pemVyIHRvIHRoZSBtYW5hZ2VyXG4gICAgICogZXhpc3RpbmcgcmVjb2duaXplcnMgd2l0aCB0aGUgc2FtZSBldmVudCBuYW1lIHdpbGwgYmUgcmVtb3ZlZFxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfE1hbmFnZXJ9XG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAnYWRkJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXG4gICAgICAgIHZhciBleGlzdGluZyA9IHRoaXMuZ2V0KHJlY29nbml6ZXIub3B0aW9ucy5ldmVudCk7XG4gICAgICAgIGlmIChleGlzdGluZykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoZXhpc3RpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWNvZ25pemVycy5wdXNoKHJlY29nbml6ZXIpO1xuICAgICAgICByZWNvZ25pemVyLm1hbmFnZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgIHJldHVybiByZWNvZ25pemVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYSByZWNvZ25pemVyIGJ5IG5hbWUgb3IgaW5zdGFuY2VcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge01hbmFnZXJ9XG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChpbnZva2VBcnJheUFyZyhyZWNvZ25pemVyLCAncmVtb3ZlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjb2duaXplciA9IHRoaXMuZ2V0KHJlY29nbml6ZXIpO1xuXG4gICAgICAgIC8vIGxldCdzIG1ha2Ugc3VyZSB0aGlzIHJlY29nbml6ZXIgZXhpc3RzXG4gICAgICAgIGlmIChyZWNvZ25pemVyKSB7XG4gICAgICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gaW5BcnJheShyZWNvZ25pemVycywgcmVjb2duaXplcik7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZWNvZ25pemVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogYmluZCBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdID0gaGFuZGxlcnNbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdW5iaW5kIGV2ZW50LCBsZWF2ZSBlbWl0IGJsYW5rIHRvIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2hhbmRsZXJdXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24oZXZlbnRzLCBoYW5kbGVyKSB7XG4gICAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVycztcbiAgICAgICAgZWFjaChzcGxpdFN0cihldmVudHMpLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGhhbmRsZXJzW2V2ZW50XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnNbZXZlbnRdICYmIGhhbmRsZXJzW2V2ZW50XS5zcGxpY2UoaW5BcnJheShoYW5kbGVyc1tldmVudF0sIGhhbmRsZXIpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBlbWl0IGV2ZW50IHRvIHRoZSBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIC8vIHdlIGFsc28gd2FudCB0byB0cmlnZ2VyIGRvbSBldmVudHNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kb21FdmVudHMpIHtcbiAgICAgICAgICAgIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBubyBoYW5kbGVycywgc28gc2tpcCBpdCBhbGxcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5oYW5kbGVyc1tldmVudF0gJiYgdGhpcy5oYW5kbGVyc1tldmVudF0uc2xpY2UoKTtcbiAgICAgICAgaWYgKCFoYW5kbGVycyB8fCAhaGFuZGxlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLnR5cGUgPSBldmVudDtcbiAgICAgICAgZGF0YS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZGF0YS5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGhhbmRsZXJzW2ldKGRhdGEpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGRlc3Ryb3kgdGhlIG1hbmFnZXIgYW5kIHVuYmluZHMgYWxsIGV2ZW50c1xuICAgICAqIGl0IGRvZXNuJ3QgdW5iaW5kIGRvbSBldmVudHMsIHRoYXQgaXMgdGhlIHVzZXIgb3duIHJlc3BvbnNpYmlsaXR5XG4gICAgICovXG4gICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCAmJiB0b2dnbGVDc3NQcm9wcyh0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICAgICAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBhZGQvcmVtb3ZlIHRoZSBjc3MgcHJvcGVydGllcyBhcyBkZWZpbmVkIGluIG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wc1xuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFkZFxuICovXG5mdW5jdGlvbiB0b2dnbGVDc3NQcm9wcyhtYW5hZ2VyLCBhZGQpIHtcbiAgICB2YXIgZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICBpZiAoIWVsZW1lbnQuc3R5bGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcHJvcDtcbiAgICBlYWNoKG1hbmFnZXIub3B0aW9ucy5jc3NQcm9wcywgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgcHJvcCA9IHByZWZpeGVkKGVsZW1lbnQuc3R5bGUsIG5hbWUpO1xuICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdID0gZWxlbWVudC5zdHlsZVtwcm9wXTtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdIHx8ICcnO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFhZGQpIHtcbiAgICAgICAgbWFuYWdlci5vbGRDc3NQcm9wcyA9IHt9O1xuICAgIH1cbn1cblxuLyoqXG4gKiB0cmlnZ2VyIGRvbSBldmVudFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICovXG5mdW5jdGlvbiB0cmlnZ2VyRG9tRXZlbnQoZXZlbnQsIGRhdGEpIHtcbiAgICB2YXIgZ2VzdHVyZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgZ2VzdHVyZUV2ZW50LmluaXRFdmVudChldmVudCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgZ2VzdHVyZUV2ZW50Lmdlc3R1cmUgPSBkYXRhO1xuICAgIGRhdGEudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZ2VzdHVyZUV2ZW50KTtcbn1cblxuYXNzaWduKEhhbW1lciwge1xuICAgIElOUFVUX1NUQVJUOiBJTlBVVF9TVEFSVCxcbiAgICBJTlBVVF9NT1ZFOiBJTlBVVF9NT1ZFLFxuICAgIElOUFVUX0VORDogSU5QVVRfRU5ELFxuICAgIElOUFVUX0NBTkNFTDogSU5QVVRfQ0FOQ0VMLFxuXG4gICAgU1RBVEVfUE9TU0lCTEU6IFNUQVRFX1BPU1NJQkxFLFxuICAgIFNUQVRFX0JFR0FOOiBTVEFURV9CRUdBTixcbiAgICBTVEFURV9DSEFOR0VEOiBTVEFURV9DSEFOR0VELFxuICAgIFNUQVRFX0VOREVEOiBTVEFURV9FTkRFRCxcbiAgICBTVEFURV9SRUNPR05JWkVEOiBTVEFURV9SRUNPR05JWkVELFxuICAgIFNUQVRFX0NBTkNFTExFRDogU1RBVEVfQ0FOQ0VMTEVELFxuICAgIFNUQVRFX0ZBSUxFRDogU1RBVEVfRkFJTEVELFxuXG4gICAgRElSRUNUSU9OX05PTkU6IERJUkVDVElPTl9OT05FLFxuICAgIERJUkVDVElPTl9MRUZUOiBESVJFQ1RJT05fTEVGVCxcbiAgICBESVJFQ1RJT05fUklHSFQ6IERJUkVDVElPTl9SSUdIVCxcbiAgICBESVJFQ1RJT05fVVA6IERJUkVDVElPTl9VUCxcbiAgICBESVJFQ1RJT05fRE9XTjogRElSRUNUSU9OX0RPV04sXG4gICAgRElSRUNUSU9OX0hPUklaT05UQUw6IERJUkVDVElPTl9IT1JJWk9OVEFMLFxuICAgIERJUkVDVElPTl9WRVJUSUNBTDogRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICAgIERJUkVDVElPTl9BTEw6IERJUkVDVElPTl9BTEwsXG5cbiAgICBNYW5hZ2VyOiBNYW5hZ2VyLFxuICAgIElucHV0OiBJbnB1dCxcbiAgICBUb3VjaEFjdGlvbjogVG91Y2hBY3Rpb24sXG5cbiAgICBUb3VjaElucHV0OiBUb3VjaElucHV0LFxuICAgIE1vdXNlSW5wdXQ6IE1vdXNlSW5wdXQsXG4gICAgUG9pbnRlckV2ZW50SW5wdXQ6IFBvaW50ZXJFdmVudElucHV0LFxuICAgIFRvdWNoTW91c2VJbnB1dDogVG91Y2hNb3VzZUlucHV0LFxuICAgIFNpbmdsZVRvdWNoSW5wdXQ6IFNpbmdsZVRvdWNoSW5wdXQsXG5cbiAgICBSZWNvZ25pemVyOiBSZWNvZ25pemVyLFxuICAgIEF0dHJSZWNvZ25pemVyOiBBdHRyUmVjb2duaXplcixcbiAgICBUYXA6IFRhcFJlY29nbml6ZXIsXG4gICAgUGFuOiBQYW5SZWNvZ25pemVyLFxuICAgIFN3aXBlOiBTd2lwZVJlY29nbml6ZXIsXG4gICAgUGluY2g6IFBpbmNoUmVjb2duaXplcixcbiAgICBSb3RhdGU6IFJvdGF0ZVJlY29nbml6ZXIsXG4gICAgUHJlc3M6IFByZXNzUmVjb2duaXplcixcblxuICAgIG9uOiBhZGRFdmVudExpc3RlbmVycyxcbiAgICBvZmY6IHJlbW92ZUV2ZW50TGlzdGVuZXJzLFxuICAgIGVhY2g6IGVhY2gsXG4gICAgbWVyZ2U6IG1lcmdlLFxuICAgIGV4dGVuZDogZXh0ZW5kLFxuICAgIGFzc2lnbjogYXNzaWduLFxuICAgIGluaGVyaXQ6IGluaGVyaXQsXG4gICAgYmluZEZuOiBiaW5kRm4sXG4gICAgcHJlZml4ZWQ6IHByZWZpeGVkXG59KTtcblxuLy8gdGhpcyBwcmV2ZW50cyBlcnJvcnMgd2hlbiBIYW1tZXIgaXMgbG9hZGVkIGluIHRoZSBwcmVzZW5jZSBvZiBhbiBBTURcbi8vICBzdHlsZSBsb2FkZXIgYnV0IGJ5IHNjcmlwdCB0YWcsIG5vdCBieSB0aGUgbG9hZGVyLlxudmFyIGZyZWVHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHt9KSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuZnJlZUdsb2JhbC5IYW1tZXIgPSBIYW1tZXI7XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBIYW1tZXI7XG4gICAgfSk7XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IEhhbW1lcjtcbn0gZWxzZSB7XG4gICAgd2luZG93W2V4cG9ydE5hbWVdID0gSGFtbWVyO1xufVxuXG59KSh3aW5kb3csIGRvY3VtZW50LCAnSGFtbWVyJyk7XG4iLCIvKipcbiAqIEV2RW1pdHRlciB2MS4xLjBcbiAqIExpbCcgZXZlbnQgZW1pdHRlclxuICogTUlUIExpY2Vuc2VcbiAqL1xuXG4vKiBqc2hpbnQgdW51c2VkOiB0cnVlLCB1bmRlZjogdHJ1ZSwgc3RyaWN0OiB0cnVlICovXG5cbiggZnVuY3Rpb24oIGdsb2JhbCwgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qIGdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHdpbmRvdyAqL1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuICAgIC8vIEFNRCAtIFJlcXVpcmVKU1xuICAgIGRlZmluZSggZmFjdG9yeSApO1xuICB9IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgIC8vIENvbW1vbkpTIC0gQnJvd3NlcmlmeSwgV2VicGFja1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGdsb2JhbC5FdkVtaXR0ZXIgPSBmYWN0b3J5KCk7XG4gIH1cblxufSggdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uKCkge1xuXG5cInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gRXZFbWl0dGVyKCkge31cblxudmFyIHByb3RvID0gRXZFbWl0dGVyLnByb3RvdHlwZTtcblxucHJvdG8ub24gPSBmdW5jdGlvbiggZXZlbnROYW1lLCBsaXN0ZW5lciApIHtcbiAgaWYgKCAhZXZlbnROYW1lIHx8ICFsaXN0ZW5lciApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gc2V0IGV2ZW50cyBoYXNoXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIC8vIHNldCBsaXN0ZW5lcnMgYXJyYXlcbiAgdmFyIGxpc3RlbmVycyA9IGV2ZW50c1sgZXZlbnROYW1lIF0gPSBldmVudHNbIGV2ZW50TmFtZSBdIHx8IFtdO1xuICAvLyBvbmx5IGFkZCBvbmNlXG4gIGlmICggbGlzdGVuZXJzLmluZGV4T2YoIGxpc3RlbmVyICkgPT0gLTEgKSB7XG4gICAgbGlzdGVuZXJzLnB1c2goIGxpc3RlbmVyICk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbnByb3RvLm9uY2UgPSBmdW5jdGlvbiggZXZlbnROYW1lLCBsaXN0ZW5lciApIHtcbiAgaWYgKCAhZXZlbnROYW1lIHx8ICFsaXN0ZW5lciApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gYWRkIGV2ZW50XG4gIHRoaXMub24oIGV2ZW50TmFtZSwgbGlzdGVuZXIgKTtcbiAgLy8gc2V0IG9uY2UgZmxhZ1xuICAvLyBzZXQgb25jZUV2ZW50cyBoYXNoXG4gIHZhciBvbmNlRXZlbnRzID0gdGhpcy5fb25jZUV2ZW50cyA9IHRoaXMuX29uY2VFdmVudHMgfHwge307XG4gIC8vIHNldCBvbmNlTGlzdGVuZXJzIG9iamVjdFxuICB2YXIgb25jZUxpc3RlbmVycyA9IG9uY2VFdmVudHNbIGV2ZW50TmFtZSBdID0gb25jZUV2ZW50c1sgZXZlbnROYW1lIF0gfHwge307XG4gIC8vIHNldCBmbGFnXG4gIG9uY2VMaXN0ZW5lcnNbIGxpc3RlbmVyIF0gPSB0cnVlO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxucHJvdG8ub2ZmID0gZnVuY3Rpb24oIGV2ZW50TmFtZSwgbGlzdGVuZXIgKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzWyBldmVudE5hbWUgXTtcbiAgaWYgKCAhbGlzdGVuZXJzIHx8ICFsaXN0ZW5lcnMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZiggbGlzdGVuZXIgKTtcbiAgaWYgKCBpbmRleCAhPSAtMSApIHtcbiAgICBsaXN0ZW5lcnMuc3BsaWNlKCBpbmRleCwgMSApO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wcm90by5lbWl0RXZlbnQgPSBmdW5jdGlvbiggZXZlbnROYW1lLCBhcmdzICkge1xuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1sgZXZlbnROYW1lIF07XG4gIGlmICggIWxpc3RlbmVycyB8fCAhbGlzdGVuZXJzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gY29weSBvdmVyIHRvIGF2b2lkIGludGVyZmVyZW5jZSBpZiAub2ZmKCkgaW4gbGlzdGVuZXJcbiAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLnNsaWNlKDApO1xuICBhcmdzID0gYXJncyB8fCBbXTtcbiAgLy8gb25jZSBzdHVmZlxuICB2YXIgb25jZUxpc3RlbmVycyA9IHRoaXMuX29uY2VFdmVudHMgJiYgdGhpcy5fb25jZUV2ZW50c1sgZXZlbnROYW1lIF07XG5cbiAgZm9yICggdmFyIGk9MDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV1cbiAgICB2YXIgaXNPbmNlID0gb25jZUxpc3RlbmVycyAmJiBvbmNlTGlzdGVuZXJzWyBsaXN0ZW5lciBdO1xuICAgIGlmICggaXNPbmNlICkge1xuICAgICAgLy8gcmVtb3ZlIGxpc3RlbmVyXG4gICAgICAvLyByZW1vdmUgYmVmb3JlIHRyaWdnZXIgdG8gcHJldmVudCByZWN1cnNpb25cbiAgICAgIHRoaXMub2ZmKCBldmVudE5hbWUsIGxpc3RlbmVyICk7XG4gICAgICAvLyB1bnNldCBvbmNlIGZsYWdcbiAgICAgIGRlbGV0ZSBvbmNlTGlzdGVuZXJzWyBsaXN0ZW5lciBdO1xuICAgIH1cbiAgICAvLyB0cmlnZ2VyIGxpc3RlbmVyXG4gICAgbGlzdGVuZXIuYXBwbHkoIHRoaXMsIGFyZ3MgKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxucHJvdG8uYWxsT2ZmID0gZnVuY3Rpb24oKSB7XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHM7XG4gIGRlbGV0ZSB0aGlzLl9vbmNlRXZlbnRzO1xufTtcblxucmV0dXJuIEV2RW1pdHRlcjtcblxufSkpO1xuIiwiLyohXG4gKiBnZXRTaXplIHYyLjAuM1xuICogbWVhc3VyZSBzaXplIG9mIGVsZW1lbnRzXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qIGpzaGludCBicm93c2VyOiB0cnVlLCBzdHJpY3Q6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUgKi9cbi8qIGdsb2JhbHMgY29uc29sZTogZmFsc2UgKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCBmYWN0b3J5ICkge1xuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqLyAvKiBnbG9iYWxzIGRlZmluZSwgbW9kdWxlICovXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBmYWN0b3J5ICk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlNcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5nZXRTaXplID0gZmFjdG9yeSgpO1xuICB9XG5cbn0pKCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhlbHBlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZ2V0IGEgbnVtYmVyIGZyb20gYSBzdHJpbmcsIG5vdCBhIHBlcmNlbnRhZ2VcbmZ1bmN0aW9uIGdldFN0eWxlU2l6ZSggdmFsdWUgKSB7XG4gIHZhciBudW0gPSBwYXJzZUZsb2F0KCB2YWx1ZSApO1xuICAvLyBub3QgYSBwZXJjZW50IGxpa2UgJzEwMCUnLCBhbmQgYSBudW1iZXJcbiAgdmFyIGlzVmFsaWQgPSB2YWx1ZS5pbmRleE9mKCclJykgPT0gLTEgJiYgIWlzTmFOKCBudW0gKTtcbiAgcmV0dXJuIGlzVmFsaWQgJiYgbnVtO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxudmFyIGxvZ0Vycm9yID0gdHlwZW9mIGNvbnNvbGUgPT0gJ3VuZGVmaW5lZCcgPyBub29wIDpcbiAgZnVuY3Rpb24oIG1lc3NhZ2UgKSB7XG4gICAgY29uc29sZS5lcnJvciggbWVzc2FnZSApO1xuICB9O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtZWFzdXJlbWVudHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxudmFyIG1lYXN1cmVtZW50cyA9IFtcbiAgJ3BhZGRpbmdMZWZ0JyxcbiAgJ3BhZGRpbmdSaWdodCcsXG4gICdwYWRkaW5nVG9wJyxcbiAgJ3BhZGRpbmdCb3R0b20nLFxuICAnbWFyZ2luTGVmdCcsXG4gICdtYXJnaW5SaWdodCcsXG4gICdtYXJnaW5Ub3AnLFxuICAnbWFyZ2luQm90dG9tJyxcbiAgJ2JvcmRlckxlZnRXaWR0aCcsXG4gICdib3JkZXJSaWdodFdpZHRoJyxcbiAgJ2JvcmRlclRvcFdpZHRoJyxcbiAgJ2JvcmRlckJvdHRvbVdpZHRoJ1xuXTtcblxudmFyIG1lYXN1cmVtZW50c0xlbmd0aCA9IG1lYXN1cmVtZW50cy5sZW5ndGg7XG5cbmZ1bmN0aW9uIGdldFplcm9TaXplKCkge1xuICB2YXIgc2l6ZSA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgaW5uZXJXaWR0aDogMCxcbiAgICBpbm5lckhlaWdodDogMCxcbiAgICBvdXRlcldpZHRoOiAwLFxuICAgIG91dGVySGVpZ2h0OiAwXG4gIH07XG4gIGZvciAoIHZhciBpPTA7IGkgPCBtZWFzdXJlbWVudHNMZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgc2l6ZVsgbWVhc3VyZW1lbnQgXSA9IDA7XG4gIH1cbiAgcmV0dXJuIHNpemU7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGdldFN0eWxlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogZ2V0U3R5bGUsIGdldCBzdHlsZSBvZiBlbGVtZW50LCBjaGVjayBmb3IgRmlyZWZveCBidWdcbiAqIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTU0ODM5N1xuICovXG5mdW5jdGlvbiBnZXRTdHlsZSggZWxlbSApIHtcbiAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbSApO1xuICBpZiAoICFzdHlsZSApIHtcbiAgICBsb2dFcnJvciggJ1N0eWxlIHJldHVybmVkICcgKyBzdHlsZSArXG4gICAgICAnLiBBcmUgeW91IHJ1bm5pbmcgdGhpcyBjb2RlIGluIGEgaGlkZGVuIGlmcmFtZSBvbiBGaXJlZm94PyAnICtcbiAgICAgICdTZWUgaHR0cHM6Ly9iaXQubHkvZ2V0c2l6ZWJ1ZzEnICk7XG4gIH1cbiAgcmV0dXJuIHN0eWxlO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBzZXR1cCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG52YXIgaXNTZXR1cCA9IGZhbHNlO1xuXG52YXIgaXNCb3hTaXplT3V0ZXI7XG5cbi8qKlxuICogc2V0dXBcbiAqIGNoZWNrIGlzQm94U2l6ZXJPdXRlclxuICogZG8gb24gZmlyc3QgZ2V0U2l6ZSgpIHJhdGhlciB0aGFuIG9uIHBhZ2UgbG9hZCBmb3IgRmlyZWZveCBidWdcbiAqL1xuZnVuY3Rpb24gc2V0dXAoKSB7XG4gIC8vIHNldHVwIG9uY2VcbiAgaWYgKCBpc1NldHVwICkge1xuICAgIHJldHVybjtcbiAgfVxuICBpc1NldHVwID0gdHJ1ZTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBib3ggc2l6aW5nIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLyoqXG4gICAqIENocm9tZSAmIFNhZmFyaSBtZWFzdXJlIHRoZSBvdXRlci13aWR0aCBvbiBzdHlsZS53aWR0aCBvbiBib3JkZXItYm94IGVsZW1zXG4gICAqIElFMTEgJiBGaXJlZm94PDI5IG1lYXN1cmVzIHRoZSBpbm5lci13aWR0aFxuICAgKi9cbiAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuc3R5bGUud2lkdGggPSAnMjAwcHgnO1xuICBkaXYuc3R5bGUucGFkZGluZyA9ICcxcHggMnB4IDNweCA0cHgnO1xuICBkaXYuc3R5bGUuYm9yZGVyU3R5bGUgPSAnc29saWQnO1xuICBkaXYuc3R5bGUuYm9yZGVyV2lkdGggPSAnMXB4IDJweCAzcHggNHB4JztcbiAgZGl2LnN0eWxlLmJveFNpemluZyA9ICdib3JkZXItYm94JztcblxuICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBib2R5LmFwcGVuZENoaWxkKCBkaXYgKTtcbiAgdmFyIHN0eWxlID0gZ2V0U3R5bGUoIGRpdiApO1xuICAvLyByb3VuZCB2YWx1ZSBmb3IgYnJvd3NlciB6b29tLiBkZXNhbmRyby9tYXNvbnJ5IzkyOFxuICBpc0JveFNpemVPdXRlciA9IE1hdGgucm91bmQoIGdldFN0eWxlU2l6ZSggc3R5bGUud2lkdGggKSApID09IDIwMDtcbiAgZ2V0U2l6ZS5pc0JveFNpemVPdXRlciA9IGlzQm94U2l6ZU91dGVyO1xuXG4gIGJvZHkucmVtb3ZlQ2hpbGQoIGRpdiApO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBnZXRTaXplIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbmZ1bmN0aW9uIGdldFNpemUoIGVsZW0gKSB7XG4gIHNldHVwKCk7XG5cbiAgLy8gdXNlIHF1ZXJ5U2VsZXRvciBpZiBlbGVtIGlzIHN0cmluZ1xuICBpZiAoIHR5cGVvZiBlbGVtID09ICdzdHJpbmcnICkge1xuICAgIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBlbGVtICk7XG4gIH1cblxuICAvLyBkbyBub3QgcHJvY2VlZCBvbiBub24tb2JqZWN0c1xuICBpZiAoICFlbGVtIHx8IHR5cGVvZiBlbGVtICE9ICdvYmplY3QnIHx8ICFlbGVtLm5vZGVUeXBlICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBzdHlsZSA9IGdldFN0eWxlKCBlbGVtICk7XG5cbiAgLy8gaWYgaGlkZGVuLCBldmVyeXRoaW5nIGlzIDBcbiAgaWYgKCBzdHlsZS5kaXNwbGF5ID09ICdub25lJyApIHtcbiAgICByZXR1cm4gZ2V0WmVyb1NpemUoKTtcbiAgfVxuXG4gIHZhciBzaXplID0ge307XG4gIHNpemUud2lkdGggPSBlbGVtLm9mZnNldFdpZHRoO1xuICBzaXplLmhlaWdodCA9IGVsZW0ub2Zmc2V0SGVpZ2h0O1xuXG4gIHZhciBpc0JvcmRlckJveCA9IHNpemUuaXNCb3JkZXJCb3ggPSBzdHlsZS5ib3hTaXppbmcgPT0gJ2JvcmRlci1ib3gnO1xuXG4gIC8vIGdldCBhbGwgbWVhc3VyZW1lbnRzXG4gIGZvciAoIHZhciBpPTA7IGkgPCBtZWFzdXJlbWVudHNMZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgbWVhc3VyZW1lbnQgPSBtZWFzdXJlbWVudHNbaV07XG4gICAgdmFyIHZhbHVlID0gc3R5bGVbIG1lYXN1cmVtZW50IF07XG4gICAgdmFyIG51bSA9IHBhcnNlRmxvYXQoIHZhbHVlICk7XG4gICAgLy8gYW55ICdhdXRvJywgJ21lZGl1bScgdmFsdWUgd2lsbCBiZSAwXG4gICAgc2l6ZVsgbWVhc3VyZW1lbnQgXSA9ICFpc05hTiggbnVtICkgPyBudW0gOiAwO1xuICB9XG5cbiAgdmFyIHBhZGRpbmdXaWR0aCA9IHNpemUucGFkZGluZ0xlZnQgKyBzaXplLnBhZGRpbmdSaWdodDtcbiAgdmFyIHBhZGRpbmdIZWlnaHQgPSBzaXplLnBhZGRpbmdUb3AgKyBzaXplLnBhZGRpbmdCb3R0b207XG4gIHZhciBtYXJnaW5XaWR0aCA9IHNpemUubWFyZ2luTGVmdCArIHNpemUubWFyZ2luUmlnaHQ7XG4gIHZhciBtYXJnaW5IZWlnaHQgPSBzaXplLm1hcmdpblRvcCArIHNpemUubWFyZ2luQm90dG9tO1xuICB2YXIgYm9yZGVyV2lkdGggPSBzaXplLmJvcmRlckxlZnRXaWR0aCArIHNpemUuYm9yZGVyUmlnaHRXaWR0aDtcbiAgdmFyIGJvcmRlckhlaWdodCA9IHNpemUuYm9yZGVyVG9wV2lkdGggKyBzaXplLmJvcmRlckJvdHRvbVdpZHRoO1xuXG4gIHZhciBpc0JvcmRlckJveFNpemVPdXRlciA9IGlzQm9yZGVyQm94ICYmIGlzQm94U2l6ZU91dGVyO1xuXG4gIC8vIG92ZXJ3cml0ZSB3aWR0aCBhbmQgaGVpZ2h0IGlmIHdlIGNhbiBnZXQgaXQgZnJvbSBzdHlsZVxuICB2YXIgc3R5bGVXaWR0aCA9IGdldFN0eWxlU2l6ZSggc3R5bGUud2lkdGggKTtcbiAgaWYgKCBzdHlsZVdpZHRoICE9PSBmYWxzZSApIHtcbiAgICBzaXplLndpZHRoID0gc3R5bGVXaWR0aCArXG4gICAgICAvLyBhZGQgcGFkZGluZyBhbmQgYm9yZGVyIHVubGVzcyBpdCdzIGFscmVhZHkgaW5jbHVkaW5nIGl0XG4gICAgICAoIGlzQm9yZGVyQm94U2l6ZU91dGVyID8gMCA6IHBhZGRpbmdXaWR0aCArIGJvcmRlcldpZHRoICk7XG4gIH1cblxuICB2YXIgc3R5bGVIZWlnaHQgPSBnZXRTdHlsZVNpemUoIHN0eWxlLmhlaWdodCApO1xuICBpZiAoIHN0eWxlSGVpZ2h0ICE9PSBmYWxzZSApIHtcbiAgICBzaXplLmhlaWdodCA9IHN0eWxlSGVpZ2h0ICtcbiAgICAgIC8vIGFkZCBwYWRkaW5nIGFuZCBib3JkZXIgdW5sZXNzIGl0J3MgYWxyZWFkeSBpbmNsdWRpbmcgaXRcbiAgICAgICggaXNCb3JkZXJCb3hTaXplT3V0ZXIgPyAwIDogcGFkZGluZ0hlaWdodCArIGJvcmRlckhlaWdodCApO1xuICB9XG5cbiAgc2l6ZS5pbm5lcldpZHRoID0gc2l6ZS53aWR0aCAtICggcGFkZGluZ1dpZHRoICsgYm9yZGVyV2lkdGggKTtcbiAgc2l6ZS5pbm5lckhlaWdodCA9IHNpemUuaGVpZ2h0IC0gKCBwYWRkaW5nSGVpZ2h0ICsgYm9yZGVySGVpZ2h0ICk7XG5cbiAgc2l6ZS5vdXRlcldpZHRoID0gc2l6ZS53aWR0aCArIG1hcmdpbldpZHRoO1xuICBzaXplLm91dGVySGVpZ2h0ID0gc2l6ZS5oZWlnaHQgKyBtYXJnaW5IZWlnaHQ7XG5cbiAgcmV0dXJuIHNpemU7XG59XG5cbnJldHVybiBnZXRTaXplO1xuXG59KTtcbiIsIi8qKlxuICogbWF0Y2hlc1NlbGVjdG9yIHYyLjAuMlxuICogbWF0Y2hlc1NlbGVjdG9yKCBlbGVtZW50LCAnLnNlbGVjdG9yJyApXG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHN0cmljdDogdHJ1ZSwgdW5kZWY6IHRydWUsIHVudXNlZDogdHJ1ZSAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8qZ2xvYmFsIGRlZmluZTogZmFsc2UsIG1vZHVsZTogZmFsc2UgKi9cbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyB1bml2ZXJzYWwgbW9kdWxlIGRlZmluaXRpb25cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIGZhY3RvcnkgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIGJyb3dzZXIgZ2xvYmFsXG4gICAgd2luZG93Lm1hdGNoZXNTZWxlY3RvciA9IGZhY3RvcnkoKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbWF0Y2hlc01ldGhvZCA9ICggZnVuY3Rpb24oKSB7XG4gICAgdmFyIEVsZW1Qcm90byA9IHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZTtcbiAgICAvLyBjaGVjayBmb3IgdGhlIHN0YW5kYXJkIG1ldGhvZCBuYW1lIGZpcnN0XG4gICAgaWYgKCBFbGVtUHJvdG8ubWF0Y2hlcyApIHtcbiAgICAgIHJldHVybiAnbWF0Y2hlcyc7XG4gICAgfVxuICAgIC8vIGNoZWNrIHVuLXByZWZpeGVkXG4gICAgaWYgKCBFbGVtUHJvdG8ubWF0Y2hlc1NlbGVjdG9yICkge1xuICAgICAgcmV0dXJuICdtYXRjaGVzU2VsZWN0b3InO1xuICAgIH1cbiAgICAvLyBjaGVjayB2ZW5kb3IgcHJlZml4ZXNcbiAgICB2YXIgcHJlZml4ZXMgPSBbICd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nIF07XG5cbiAgICBmb3IgKCB2YXIgaT0wOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICB2YXIgcHJlZml4ID0gcHJlZml4ZXNbaV07XG4gICAgICB2YXIgbWV0aG9kID0gcHJlZml4ICsgJ01hdGNoZXNTZWxlY3Rvcic7XG4gICAgICBpZiAoIEVsZW1Qcm90b1sgbWV0aG9kIF0gKSB7XG4gICAgICAgIHJldHVybiBtZXRob2Q7XG4gICAgICB9XG4gICAgfVxuICB9KSgpO1xuXG4gIHJldHVybiBmdW5jdGlvbiBtYXRjaGVzU2VsZWN0b3IoIGVsZW0sIHNlbGVjdG9yICkge1xuICAgIHJldHVybiBlbGVtWyBtYXRjaGVzTWV0aG9kIF0oIHNlbGVjdG9yICk7XG4gIH07XG5cbn0pKTtcbiIsIi8qKlxuICogRml6enkgVUkgdXRpbHMgdjIuMC43XG4gKiBNSVQgbGljZW5zZVxuICovXG5cbi8qanNoaW50IGJyb3dzZXI6IHRydWUsIHVuZGVmOiB0cnVlLCB1bnVzZWQ6IHRydWUsIHN0cmljdDogdHJ1ZSAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKmpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qZ2xvYmFscyBkZWZpbmUsIG1vZHVsZSwgcmVxdWlyZSAqL1xuXG4gIGlmICggdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG4gICAgLy8gQU1EXG4gICAgZGVmaW5lKCBbXG4gICAgICAnZGVzYW5kcm8tbWF0Y2hlcy1zZWxlY3Rvci9tYXRjaGVzLXNlbGVjdG9yJ1xuICAgIF0sIGZ1bmN0aW9uKCBtYXRjaGVzU2VsZWN0b3IgKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeSggd2luZG93LCBtYXRjaGVzU2VsZWN0b3IgKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHJlcXVpcmUoJ2Rlc2FuZHJvLW1hdGNoZXMtc2VsZWN0b3InKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuZml6enlVSVV0aWxzID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdyxcbiAgICAgIHdpbmRvdy5tYXRjaGVzU2VsZWN0b3JcbiAgICApO1xuICB9XG5cbn0oIHdpbmRvdywgZnVuY3Rpb24gZmFjdG9yeSggd2luZG93LCBtYXRjaGVzU2VsZWN0b3IgKSB7XG5cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0ge307XG5cbi8vIC0tLS0tIGV4dGVuZCAtLS0tLSAvL1xuXG4vLyBleHRlbmRzIG9iamVjdHNcbnV0aWxzLmV4dGVuZCA9IGZ1bmN0aW9uKCBhLCBiICkge1xuICBmb3IgKCB2YXIgcHJvcCBpbiBiICkge1xuICAgIGFbIHByb3AgXSA9IGJbIHByb3AgXTtcbiAgfVxuICByZXR1cm4gYTtcbn07XG5cbi8vIC0tLS0tIG1vZHVsbyAtLS0tLSAvL1xuXG51dGlscy5tb2R1bG8gPSBmdW5jdGlvbiggbnVtLCBkaXYgKSB7XG4gIHJldHVybiAoICggbnVtICUgZGl2ICkgKyBkaXYgKSAlIGRpdjtcbn07XG5cbi8vIC0tLS0tIG1ha2VBcnJheSAtLS0tLSAvL1xuXG52YXIgYXJyYXlTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuLy8gdHVybiBlbGVtZW50IG9yIG5vZGVMaXN0IGludG8gYW4gYXJyYXlcbnV0aWxzLm1ha2VBcnJheSA9IGZ1bmN0aW9uKCBvYmogKSB7XG4gIGlmICggQXJyYXkuaXNBcnJheSggb2JqICkgKSB7XG4gICAgLy8gdXNlIG9iamVjdCBpZiBhbHJlYWR5IGFuIGFycmF5XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICAvLyByZXR1cm4gZW1wdHkgYXJyYXkgaWYgdW5kZWZpbmVkIG9yIG51bGwuICM2XG4gIGlmICggb2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkICkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBpc0FycmF5TGlrZSA9IHR5cGVvZiBvYmogPT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai5sZW5ndGggPT0gJ251bWJlcic7XG4gIGlmICggaXNBcnJheUxpa2UgKSB7XG4gICAgLy8gY29udmVydCBub2RlTGlzdCB0byBhcnJheVxuICAgIHJldHVybiBhcnJheVNsaWNlLmNhbGwoIG9iaiApO1xuICB9XG5cbiAgLy8gYXJyYXkgb2Ygc2luZ2xlIGluZGV4XG4gIHJldHVybiBbIG9iaiBdO1xufTtcblxuLy8gLS0tLS0gcmVtb3ZlRnJvbSAtLS0tLSAvL1xuXG51dGlscy5yZW1vdmVGcm9tID0gZnVuY3Rpb24oIGFyeSwgb2JqICkge1xuICB2YXIgaW5kZXggPSBhcnkuaW5kZXhPZiggb2JqICk7XG4gIGlmICggaW5kZXggIT0gLTEgKSB7XG4gICAgYXJ5LnNwbGljZSggaW5kZXgsIDEgKTtcbiAgfVxufTtcblxuLy8gLS0tLS0gZ2V0UGFyZW50IC0tLS0tIC8vXG5cbnV0aWxzLmdldFBhcmVudCA9IGZ1bmN0aW9uKCBlbGVtLCBzZWxlY3RvciApIHtcbiAgd2hpbGUgKCBlbGVtLnBhcmVudE5vZGUgJiYgZWxlbSAhPSBkb2N1bWVudC5ib2R5ICkge1xuICAgIGVsZW0gPSBlbGVtLnBhcmVudE5vZGU7XG4gICAgaWYgKCBtYXRjaGVzU2VsZWN0b3IoIGVsZW0sIHNlbGVjdG9yICkgKSB7XG4gICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gIH1cbn07XG5cbi8vIC0tLS0tIGdldFF1ZXJ5RWxlbWVudCAtLS0tLSAvL1xuXG4vLyB1c2UgZWxlbWVudCBhcyBzZWxlY3RvciBzdHJpbmdcbnV0aWxzLmdldFF1ZXJ5RWxlbWVudCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICBpZiAoIHR5cGVvZiBlbGVtID09ICdzdHJpbmcnICkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCBlbGVtICk7XG4gIH1cbiAgcmV0dXJuIGVsZW07XG59O1xuXG4vLyAtLS0tLSBoYW5kbGVFdmVudCAtLS0tLSAvL1xuXG4vLyBlbmFibGUgLm9udHlwZSB0byB0cmlnZ2VyIGZyb20gLmFkZEV2ZW50TGlzdGVuZXIoIGVsZW0sICd0eXBlJyApXG51dGlscy5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgdmFyIG1ldGhvZCA9ICdvbicgKyBldmVudC50eXBlO1xuICBpZiAoIHRoaXNbIG1ldGhvZCBdICkge1xuICAgIHRoaXNbIG1ldGhvZCBdKCBldmVudCApO1xuICB9XG59O1xuXG4vLyAtLS0tLSBmaWx0ZXJGaW5kRWxlbWVudHMgLS0tLS0gLy9cblxudXRpbHMuZmlsdGVyRmluZEVsZW1lbnRzID0gZnVuY3Rpb24oIGVsZW1zLCBzZWxlY3RvciApIHtcbiAgLy8gbWFrZSBhcnJheSBvZiBlbGVtc1xuICBlbGVtcyA9IHV0aWxzLm1ha2VBcnJheSggZWxlbXMgKTtcbiAgdmFyIGZmRWxlbXMgPSBbXTtcblxuICBlbGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbSApIHtcbiAgICAvLyBjaGVjayB0aGF0IGVsZW0gaXMgYW4gYWN0dWFsIGVsZW1lbnRcbiAgICBpZiAoICEoIGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCApICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBhZGQgZWxlbSBpZiBubyBzZWxlY3RvclxuICAgIGlmICggIXNlbGVjdG9yICkge1xuICAgICAgZmZFbGVtcy5wdXNoKCBlbGVtICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGZpbHRlciAmIGZpbmQgaXRlbXMgaWYgd2UgaGF2ZSBhIHNlbGVjdG9yXG4gICAgLy8gZmlsdGVyXG4gICAgaWYgKCBtYXRjaGVzU2VsZWN0b3IoIGVsZW0sIHNlbGVjdG9yICkgKSB7XG4gICAgICBmZkVsZW1zLnB1c2goIGVsZW0gKTtcbiAgICB9XG4gICAgLy8gZmluZCBjaGlsZHJlblxuICAgIHZhciBjaGlsZEVsZW1zID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApO1xuICAgIC8vIGNvbmNhdCBjaGlsZEVsZW1zIHRvIGZpbHRlckZvdW5kIGFycmF5XG4gICAgZm9yICggdmFyIGk9MDsgaSA8IGNoaWxkRWxlbXMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBmZkVsZW1zLnB1c2goIGNoaWxkRWxlbXNbaV0gKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBmZkVsZW1zO1xufTtcblxuLy8gLS0tLS0gZGVib3VuY2VNZXRob2QgLS0tLS0gLy9cblxudXRpbHMuZGVib3VuY2VNZXRob2QgPSBmdW5jdGlvbiggX2NsYXNzLCBtZXRob2ROYW1lLCB0aHJlc2hvbGQgKSB7XG4gIHRocmVzaG9sZCA9IHRocmVzaG9sZCB8fCAxMDA7XG4gIC8vIG9yaWdpbmFsIG1ldGhvZFxuICB2YXIgbWV0aG9kID0gX2NsYXNzLnByb3RvdHlwZVsgbWV0aG9kTmFtZSBdO1xuICB2YXIgdGltZW91dE5hbWUgPSBtZXRob2ROYW1lICsgJ1RpbWVvdXQnO1xuXG4gIF9jbGFzcy5wcm90b3R5cGVbIG1ldGhvZE5hbWUgXSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lb3V0ID0gdGhpc1sgdGltZW91dE5hbWUgXTtcbiAgICBjbGVhclRpbWVvdXQoIHRpbWVvdXQgKTtcblxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdGhpc1sgdGltZW91dE5hbWUgXSA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgbWV0aG9kLmFwcGx5KCBfdGhpcywgYXJncyApO1xuICAgICAgZGVsZXRlIF90aGlzWyB0aW1lb3V0TmFtZSBdO1xuICAgIH0sIHRocmVzaG9sZCApO1xuICB9O1xufTtcblxuLy8gLS0tLS0gZG9jUmVhZHkgLS0tLS0gLy9cblxudXRpbHMuZG9jUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG4gIHZhciByZWFkeVN0YXRlID0gZG9jdW1lbnQucmVhZHlTdGF0ZTtcbiAgaWYgKCByZWFkeVN0YXRlID09ICdjb21wbGV0ZScgfHwgcmVhZHlTdGF0ZSA9PSAnaW50ZXJhY3RpdmUnICkge1xuICAgIC8vIGRvIGFzeW5jIHRvIGFsbG93IGZvciBvdGhlciBzY3JpcHRzIHRvIHJ1bi4gbWV0YWZpenp5L2ZsaWNraXR5IzQ0MVxuICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrICk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFjayApO1xuICB9XG59O1xuXG4vLyAtLS0tLSBodG1sSW5pdCAtLS0tLSAvL1xuXG4vLyBodHRwOi8vamFtZXNyb2JlcnRzLm5hbWUvYmxvZy8yMDEwLzAyLzIyL3N0cmluZy1mdW5jdGlvbnMtZm9yLWphdmFzY3JpcHQtdHJpbS10by1jYW1lbC1jYXNlLXRvLWRhc2hlZC1hbmQtdG8tdW5kZXJzY29yZS9cbnV0aWxzLnRvRGFzaGVkID0gZnVuY3Rpb24oIHN0ciApIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKCAvKC4pKFtBLVpdKS9nLCBmdW5jdGlvbiggbWF0Y2gsICQxLCAkMiApIHtcbiAgICByZXR1cm4gJDEgKyAnLScgKyAkMjtcbiAgfSkudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBjb25zb2xlID0gd2luZG93LmNvbnNvbGU7XG4vKipcbiAqIGFsbG93IHVzZXIgdG8gaW5pdGlhbGl6ZSBjbGFzc2VzIHZpYSBbZGF0YS1uYW1lc3BhY2VdIG9yIC5qcy1uYW1lc3BhY2UgY2xhc3NcbiAqIGh0bWxJbml0KCBXaWRnZXQsICd3aWRnZXROYW1lJyApXG4gKiBvcHRpb25zIGFyZSBwYXJzZWQgZnJvbSBkYXRhLW5hbWVzcGFjZS1vcHRpb25zXG4gKi9cbnV0aWxzLmh0bWxJbml0ID0gZnVuY3Rpb24oIFdpZGdldENsYXNzLCBuYW1lc3BhY2UgKSB7XG4gIHV0aWxzLmRvY1JlYWR5KCBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGFzaGVkTmFtZXNwYWNlID0gdXRpbHMudG9EYXNoZWQoIG5hbWVzcGFjZSApO1xuICAgIHZhciBkYXRhQXR0ciA9ICdkYXRhLScgKyBkYXNoZWROYW1lc3BhY2U7XG4gICAgdmFyIGRhdGFBdHRyRWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnWycgKyBkYXRhQXR0ciArICddJyApO1xuICAgIHZhciBqc0Rhc2hFbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuanMtJyArIGRhc2hlZE5hbWVzcGFjZSApO1xuICAgIHZhciBlbGVtcyA9IHV0aWxzLm1ha2VBcnJheSggZGF0YUF0dHJFbGVtcyApXG4gICAgICAuY29uY2F0KCB1dGlscy5tYWtlQXJyYXkoIGpzRGFzaEVsZW1zICkgKTtcbiAgICB2YXIgZGF0YU9wdGlvbnNBdHRyID0gZGF0YUF0dHIgKyAnLW9wdGlvbnMnO1xuICAgIHZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5O1xuXG4gICAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgICB2YXIgYXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKCBkYXRhQXR0ciApIHx8XG4gICAgICAgIGVsZW0uZ2V0QXR0cmlidXRlKCBkYXRhT3B0aW9uc0F0dHIgKTtcbiAgICAgIHZhciBvcHRpb25zO1xuICAgICAgdHJ5IHtcbiAgICAgICAgb3B0aW9ucyA9IGF0dHIgJiYgSlNPTi5wYXJzZSggYXR0ciApO1xuICAgICAgfSBjYXRjaCAoIGVycm9yICkge1xuICAgICAgICAvLyBsb2cgZXJyb3IsIGRvIG5vdCBpbml0aWFsaXplXG4gICAgICAgIGlmICggY29uc29sZSApIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCAnRXJyb3IgcGFyc2luZyAnICsgZGF0YUF0dHIgKyAnIG9uICcgKyBlbGVtLmNsYXNzTmFtZSArXG4gICAgICAgICAgJzogJyArIGVycm9yICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gaW5pdGlhbGl6ZVxuICAgICAgdmFyIGluc3RhbmNlID0gbmV3IFdpZGdldENsYXNzKCBlbGVtLCBvcHRpb25zICk7XG4gICAgICAvLyBtYWtlIGF2YWlsYWJsZSB2aWEgJCgpLmRhdGEoJ25hbWVzcGFjZScpXG4gICAgICBpZiAoIGpRdWVyeSApIHtcbiAgICAgICAgalF1ZXJ5LmRhdGEoIGVsZW0sIG5hbWVzcGFjZSwgaW5zdGFuY2UgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9KTtcbn07XG5cbi8vIC0tLS0tICAtLS0tLSAvL1xuXG5yZXR1cm4gdXRpbHM7XG5cbn0pKTtcbiIsIi8qKlxuICogT3V0bGF5ZXIgSXRlbVxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgZmFjdG9yeSApIHtcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qIGdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHJlcXVpcmUgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTUQgLSBSZXF1aXJlSlNcbiAgICBkZWZpbmUoIFtcbiAgICAgICAgJ2V2LWVtaXR0ZXIvZXYtZW1pdHRlcicsXG4gICAgICAgICdnZXQtc2l6ZS9nZXQtc2l6ZSdcbiAgICAgIF0sXG4gICAgICBmYWN0b3J5XG4gICAgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KUyAtIEJyb3dzZXJpZnksIFdlYnBhY2tcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXG4gICAgICByZXF1aXJlKCdldi1lbWl0dGVyJyksXG4gICAgICByZXF1aXJlKCdnZXQtc2l6ZScpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5PdXRsYXllciA9IHt9O1xuICAgIHdpbmRvdy5PdXRsYXllci5JdGVtID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdy5FdkVtaXR0ZXIsXG4gICAgICB3aW5kb3cuZ2V0U2l6ZVxuICAgICk7XG4gIH1cblxufSggd2luZG93LCBmdW5jdGlvbiBmYWN0b3J5KCBFdkVtaXR0ZXIsIGdldFNpemUgKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tIGhlbHBlcnMgLS0tLS0gLy9cblxuZnVuY3Rpb24gaXNFbXB0eU9iaiggb2JqICkge1xuICBmb3IgKCB2YXIgcHJvcCBpbiBvYmogKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHByb3AgPSBudWxsO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ1NTMyBzdXBwb3J0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cblxudmFyIGRvY0VsZW1TdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcblxudmFyIHRyYW5zaXRpb25Qcm9wZXJ0eSA9IHR5cGVvZiBkb2NFbGVtU3R5bGUudHJhbnNpdGlvbiA9PSAnc3RyaW5nJyA/XG4gICd0cmFuc2l0aW9uJyA6ICdXZWJraXRUcmFuc2l0aW9uJztcbnZhciB0cmFuc2Zvcm1Qcm9wZXJ0eSA9IHR5cGVvZiBkb2NFbGVtU3R5bGUudHJhbnNmb3JtID09ICdzdHJpbmcnID9cbiAgJ3RyYW5zZm9ybScgOiAnV2Via2l0VHJhbnNmb3JtJztcblxudmFyIHRyYW5zaXRpb25FbmRFdmVudCA9IHtcbiAgV2Via2l0VHJhbnNpdGlvbjogJ3dlYmtpdFRyYW5zaXRpb25FbmQnLFxuICB0cmFuc2l0aW9uOiAndHJhbnNpdGlvbmVuZCdcbn1bIHRyYW5zaXRpb25Qcm9wZXJ0eSBdO1xuXG4vLyBjYWNoZSBhbGwgdmVuZG9yIHByb3BlcnRpZXMgdGhhdCBjb3VsZCBoYXZlIHZlbmRvciBwcmVmaXhcbnZhciB2ZW5kb3JQcm9wZXJ0aWVzID0ge1xuICB0cmFuc2Zvcm06IHRyYW5zZm9ybVByb3BlcnR5LFxuICB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uUHJvcGVydHksXG4gIHRyYW5zaXRpb25EdXJhdGlvbjogdHJhbnNpdGlvblByb3BlcnR5ICsgJ0R1cmF0aW9uJyxcbiAgdHJhbnNpdGlvblByb3BlcnR5OiB0cmFuc2l0aW9uUHJvcGVydHkgKyAnUHJvcGVydHknLFxuICB0cmFuc2l0aW9uRGVsYXk6IHRyYW5zaXRpb25Qcm9wZXJ0eSArICdEZWxheSdcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEl0ZW0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuZnVuY3Rpb24gSXRlbSggZWxlbWVudCwgbGF5b3V0ICkge1xuICBpZiAoICFlbGVtZW50ICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gIC8vIHBhcmVudCBsYXlvdXQgY2xhc3MsIGkuZS4gTWFzb25yeSwgSXNvdG9wZSwgb3IgUGFja2VyeVxuICB0aGlzLmxheW91dCA9IGxheW91dDtcbiAgdGhpcy5wb3NpdGlvbiA9IHtcbiAgICB4OiAwLFxuICAgIHk6IDBcbiAgfTtcblxuICB0aGlzLl9jcmVhdGUoKTtcbn1cblxuLy8gaW5oZXJpdCBFdkVtaXR0ZXJcbnZhciBwcm90byA9IEl0ZW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggRXZFbWl0dGVyLnByb3RvdHlwZSApO1xucHJvdG8uY29uc3RydWN0b3IgPSBJdGVtO1xuXG5wcm90by5fY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIC8vIHRyYW5zaXRpb24gb2JqZWN0c1xuICB0aGlzLl90cmFuc24gPSB7XG4gICAgaW5nUHJvcGVydGllczoge30sXG4gICAgY2xlYW46IHt9LFxuICAgIG9uRW5kOiB7fVxuICB9O1xuXG4gIHRoaXMuY3NzKHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICB9KTtcbn07XG5cbi8vIHRyaWdnZXIgc3BlY2lmaWVkIGhhbmRsZXIgZm9yIGV2ZW50IHR5cGVcbnByb3RvLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB2YXIgbWV0aG9kID0gJ29uJyArIGV2ZW50LnR5cGU7XG4gIGlmICggdGhpc1sgbWV0aG9kIF0gKSB7XG4gICAgdGhpc1sgbWV0aG9kIF0oIGV2ZW50ICk7XG4gIH1cbn07XG5cbnByb3RvLmdldFNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zaXplID0gZ2V0U2l6ZSggdGhpcy5lbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIGFwcGx5IENTUyBzdHlsZXMgdG8gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IHN0eWxlXG4gKi9cbnByb3RvLmNzcyA9IGZ1bmN0aW9uKCBzdHlsZSApIHtcbiAgdmFyIGVsZW1TdHlsZSA9IHRoaXMuZWxlbWVudC5zdHlsZTtcblxuICBmb3IgKCB2YXIgcHJvcCBpbiBzdHlsZSApIHtcbiAgICAvLyB1c2UgdmVuZG9yIHByb3BlcnR5IGlmIGF2YWlsYWJsZVxuICAgIHZhciBzdXBwb3J0ZWRQcm9wID0gdmVuZG9yUHJvcGVydGllc1sgcHJvcCBdIHx8IHByb3A7XG4gICAgZWxlbVN0eWxlWyBzdXBwb3J0ZWRQcm9wIF0gPSBzdHlsZVsgcHJvcCBdO1xuICB9XG59O1xuXG4gLy8gbWVhc3VyZSBwb3NpdGlvbiwgYW5kIHNldHMgaXRcbnByb3RvLmdldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoIHRoaXMuZWxlbWVudCApO1xuICB2YXIgaXNPcmlnaW5MZWZ0ID0gdGhpcy5sYXlvdXQuX2dldE9wdGlvbignb3JpZ2luTGVmdCcpO1xuICB2YXIgaXNPcmlnaW5Ub3AgPSB0aGlzLmxheW91dC5fZ2V0T3B0aW9uKCdvcmlnaW5Ub3AnKTtcbiAgdmFyIHhWYWx1ZSA9IHN0eWxlWyBpc09yaWdpbkxlZnQgPyAnbGVmdCcgOiAncmlnaHQnIF07XG4gIHZhciB5VmFsdWUgPSBzdHlsZVsgaXNPcmlnaW5Ub3AgPyAndG9wJyA6ICdib3R0b20nIF07XG4gIHZhciB4ID0gcGFyc2VGbG9hdCggeFZhbHVlICk7XG4gIHZhciB5ID0gcGFyc2VGbG9hdCggeVZhbHVlICk7XG4gIC8vIGNvbnZlcnQgcGVyY2VudCB0byBwaXhlbHNcbiAgdmFyIGxheW91dFNpemUgPSB0aGlzLmxheW91dC5zaXplO1xuICBpZiAoIHhWYWx1ZS5pbmRleE9mKCclJykgIT0gLTEgKSB7XG4gICAgeCA9ICggeCAvIDEwMCApICogbGF5b3V0U2l6ZS53aWR0aDtcbiAgfVxuICBpZiAoIHlWYWx1ZS5pbmRleE9mKCclJykgIT0gLTEgKSB7XG4gICAgeSA9ICggeSAvIDEwMCApICogbGF5b3V0U2l6ZS5oZWlnaHQ7XG4gIH1cbiAgLy8gY2xlYW4gdXAgJ2F1dG8nIG9yIG90aGVyIG5vbi1pbnRlZ2VyIHZhbHVlc1xuICB4ID0gaXNOYU4oIHggKSA/IDAgOiB4O1xuICB5ID0gaXNOYU4oIHkgKSA/IDAgOiB5O1xuICAvLyByZW1vdmUgcGFkZGluZyBmcm9tIG1lYXN1cmVtZW50XG4gIHggLT0gaXNPcmlnaW5MZWZ0ID8gbGF5b3V0U2l6ZS5wYWRkaW5nTGVmdCA6IGxheW91dFNpemUucGFkZGluZ1JpZ2h0O1xuICB5IC09IGlzT3JpZ2luVG9wID8gbGF5b3V0U2l6ZS5wYWRkaW5nVG9wIDogbGF5b3V0U2l6ZS5wYWRkaW5nQm90dG9tO1xuXG4gIHRoaXMucG9zaXRpb24ueCA9IHg7XG4gIHRoaXMucG9zaXRpb24ueSA9IHk7XG59O1xuXG4vLyBzZXQgc2V0dGxlZCBwb3NpdGlvbiwgYXBwbHkgcGFkZGluZ1xucHJvdG8ubGF5b3V0UG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGxheW91dFNpemUgPSB0aGlzLmxheW91dC5zaXplO1xuICB2YXIgc3R5bGUgPSB7fTtcbiAgdmFyIGlzT3JpZ2luTGVmdCA9IHRoaXMubGF5b3V0Ll9nZXRPcHRpb24oJ29yaWdpbkxlZnQnKTtcbiAgdmFyIGlzT3JpZ2luVG9wID0gdGhpcy5sYXlvdXQuX2dldE9wdGlvbignb3JpZ2luVG9wJyk7XG5cbiAgLy8geFxuICB2YXIgeFBhZGRpbmcgPSBpc09yaWdpbkxlZnQgPyAncGFkZGluZ0xlZnQnIDogJ3BhZGRpbmdSaWdodCc7XG4gIHZhciB4UHJvcGVydHkgPSBpc09yaWdpbkxlZnQgPyAnbGVmdCcgOiAncmlnaHQnO1xuICB2YXIgeFJlc2V0UHJvcGVydHkgPSBpc09yaWdpbkxlZnQgPyAncmlnaHQnIDogJ2xlZnQnO1xuXG4gIHZhciB4ID0gdGhpcy5wb3NpdGlvbi54ICsgbGF5b3V0U2l6ZVsgeFBhZGRpbmcgXTtcbiAgLy8gc2V0IGluIHBlcmNlbnRhZ2Ugb3IgcGl4ZWxzXG4gIHN0eWxlWyB4UHJvcGVydHkgXSA9IHRoaXMuZ2V0WFZhbHVlKCB4ICk7XG4gIC8vIHJlc2V0IG90aGVyIHByb3BlcnR5XG4gIHN0eWxlWyB4UmVzZXRQcm9wZXJ0eSBdID0gJyc7XG5cbiAgLy8geVxuICB2YXIgeVBhZGRpbmcgPSBpc09yaWdpblRvcCA/ICdwYWRkaW5nVG9wJyA6ICdwYWRkaW5nQm90dG9tJztcbiAgdmFyIHlQcm9wZXJ0eSA9IGlzT3JpZ2luVG9wID8gJ3RvcCcgOiAnYm90dG9tJztcbiAgdmFyIHlSZXNldFByb3BlcnR5ID0gaXNPcmlnaW5Ub3AgPyAnYm90dG9tJyA6ICd0b3AnO1xuXG4gIHZhciB5ID0gdGhpcy5wb3NpdGlvbi55ICsgbGF5b3V0U2l6ZVsgeVBhZGRpbmcgXTtcbiAgLy8gc2V0IGluIHBlcmNlbnRhZ2Ugb3IgcGl4ZWxzXG4gIHN0eWxlWyB5UHJvcGVydHkgXSA9IHRoaXMuZ2V0WVZhbHVlKCB5ICk7XG4gIC8vIHJlc2V0IG90aGVyIHByb3BlcnR5XG4gIHN0eWxlWyB5UmVzZXRQcm9wZXJ0eSBdID0gJyc7XG5cbiAgdGhpcy5jc3MoIHN0eWxlICk7XG4gIHRoaXMuZW1pdEV2ZW50KCAnbGF5b3V0JywgWyB0aGlzIF0gKTtcbn07XG5cbnByb3RvLmdldFhWYWx1ZSA9IGZ1bmN0aW9uKCB4ICkge1xuICB2YXIgaXNIb3Jpem9udGFsID0gdGhpcy5sYXlvdXQuX2dldE9wdGlvbignaG9yaXpvbnRhbCcpO1xuICByZXR1cm4gdGhpcy5sYXlvdXQub3B0aW9ucy5wZXJjZW50UG9zaXRpb24gJiYgIWlzSG9yaXpvbnRhbCA/XG4gICAgKCAoIHggLyB0aGlzLmxheW91dC5zaXplLndpZHRoICkgKiAxMDAgKSArICclJyA6IHggKyAncHgnO1xufTtcblxucHJvdG8uZ2V0WVZhbHVlID0gZnVuY3Rpb24oIHkgKSB7XG4gIHZhciBpc0hvcml6b250YWwgPSB0aGlzLmxheW91dC5fZ2V0T3B0aW9uKCdob3Jpem9udGFsJyk7XG4gIHJldHVybiB0aGlzLmxheW91dC5vcHRpb25zLnBlcmNlbnRQb3NpdGlvbiAmJiBpc0hvcml6b250YWwgP1xuICAgICggKCB5IC8gdGhpcy5sYXlvdXQuc2l6ZS5oZWlnaHQgKSAqIDEwMCApICsgJyUnIDogeSArICdweCc7XG59O1xuXG5wcm90by5fdHJhbnNpdGlvblRvID0gZnVuY3Rpb24oIHgsIHkgKSB7XG4gIHRoaXMuZ2V0UG9zaXRpb24oKTtcbiAgLy8gZ2V0IGN1cnJlbnQgeCAmIHkgZnJvbSB0b3AvbGVmdFxuICB2YXIgY3VyWCA9IHRoaXMucG9zaXRpb24ueDtcbiAgdmFyIGN1clkgPSB0aGlzLnBvc2l0aW9uLnk7XG5cbiAgdmFyIGRpZE5vdE1vdmUgPSB4ID09IHRoaXMucG9zaXRpb24ueCAmJiB5ID09IHRoaXMucG9zaXRpb24ueTtcblxuICAvLyBzYXZlIGVuZCBwb3NpdGlvblxuICB0aGlzLnNldFBvc2l0aW9uKCB4LCB5ICk7XG5cbiAgLy8gaWYgZGlkIG5vdCBtb3ZlIGFuZCBub3QgdHJhbnNpdGlvbmluZywganVzdCBnbyB0byBsYXlvdXRcbiAgaWYgKCBkaWROb3RNb3ZlICYmICF0aGlzLmlzVHJhbnNpdGlvbmluZyApIHtcbiAgICB0aGlzLmxheW91dFBvc2l0aW9uKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRyYW5zWCA9IHggLSBjdXJYO1xuICB2YXIgdHJhbnNZID0geSAtIGN1clk7XG4gIHZhciB0cmFuc2l0aW9uU3R5bGUgPSB7fTtcbiAgdHJhbnNpdGlvblN0eWxlLnRyYW5zZm9ybSA9IHRoaXMuZ2V0VHJhbnNsYXRlKCB0cmFuc1gsIHRyYW5zWSApO1xuXG4gIHRoaXMudHJhbnNpdGlvbih7XG4gICAgdG86IHRyYW5zaXRpb25TdHlsZSxcbiAgICBvblRyYW5zaXRpb25FbmQ6IHtcbiAgICAgIHRyYW5zZm9ybTogdGhpcy5sYXlvdXRQb3NpdGlvblxuICAgIH0sXG4gICAgaXNDbGVhbmluZzogdHJ1ZVxuICB9KTtcbn07XG5cbnByb3RvLmdldFRyYW5zbGF0ZSA9IGZ1bmN0aW9uKCB4LCB5ICkge1xuICAvLyBmbGlwIGNvb3JpZGluYXRlcyBpZiBvcmlnaW4gb24gcmlnaHQgb3IgYm90dG9tXG4gIHZhciBpc09yaWdpbkxlZnQgPSB0aGlzLmxheW91dC5fZ2V0T3B0aW9uKCdvcmlnaW5MZWZ0Jyk7XG4gIHZhciBpc09yaWdpblRvcCA9IHRoaXMubGF5b3V0Ll9nZXRPcHRpb24oJ29yaWdpblRvcCcpO1xuICB4ID0gaXNPcmlnaW5MZWZ0ID8geCA6IC14O1xuICB5ID0gaXNPcmlnaW5Ub3AgPyB5IDogLXk7XG4gIHJldHVybiAndHJhbnNsYXRlM2QoJyArIHggKyAncHgsICcgKyB5ICsgJ3B4LCAwKSc7XG59O1xuXG4vLyBub24gdHJhbnNpdGlvbiArIHRyYW5zZm9ybSBzdXBwb3J0XG5wcm90by5nb1RvID0gZnVuY3Rpb24oIHgsIHkgKSB7XG4gIHRoaXMuc2V0UG9zaXRpb24oIHgsIHkgKTtcbiAgdGhpcy5sYXlvdXRQb3NpdGlvbigpO1xufTtcblxucHJvdG8ubW92ZVRvID0gcHJvdG8uX3RyYW5zaXRpb25UbztcblxucHJvdG8uc2V0UG9zaXRpb24gPSBmdW5jdGlvbiggeCwgeSApIHtcbiAgdGhpcy5wb3NpdGlvbi54ID0gcGFyc2VGbG9hdCggeCApO1xuICB0aGlzLnBvc2l0aW9uLnkgPSBwYXJzZUZsb2F0KCB5ICk7XG59O1xuXG4vLyAtLS0tLSB0cmFuc2l0aW9uIC0tLS0tIC8vXG5cbi8qKlxuICogQHBhcmFtIHtPYmplY3R9IHN0eWxlIC0gQ1NTXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblRyYW5zaXRpb25FbmRcbiAqL1xuXG4vLyBub24gdHJhbnNpdGlvbiwganVzdCB0cmlnZ2VyIGNhbGxiYWNrXG5wcm90by5fbm9uVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCBhcmdzICkge1xuICB0aGlzLmNzcyggYXJncy50byApO1xuICBpZiAoIGFyZ3MuaXNDbGVhbmluZyApIHtcbiAgICB0aGlzLl9yZW1vdmVTdHlsZXMoIGFyZ3MudG8gKTtcbiAgfVxuICBmb3IgKCB2YXIgcHJvcCBpbiBhcmdzLm9uVHJhbnNpdGlvbkVuZCApIHtcbiAgICBhcmdzLm9uVHJhbnNpdGlvbkVuZFsgcHJvcCBdLmNhbGwoIHRoaXMgKTtcbiAgfVxufTtcblxuLyoqXG4gKiBwcm9wZXIgdHJhbnNpdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGFyZ3MgLSBhcmd1bWVudHNcbiAqICAgQHBhcmFtIHtPYmplY3R9IHRvIC0gc3R5bGUgdG8gdHJhbnNpdGlvbiB0b1xuICogICBAcGFyYW0ge09iamVjdH0gZnJvbSAtIHN0eWxlIHRvIHN0YXJ0IHRyYW5zaXRpb24gZnJvbVxuICogICBAcGFyYW0ge0Jvb2xlYW59IGlzQ2xlYW5pbmcgLSByZW1vdmVzIHRyYW5zaXRpb24gc3R5bGVzIGFmdGVyIHRyYW5zaXRpb25cbiAqICAgQHBhcmFtIHtGdW5jdGlvbn0gb25UcmFuc2l0aW9uRW5kIC0gY2FsbGJhY2tcbiAqL1xucHJvdG8udHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCBhcmdzICkge1xuICAvLyByZWRpcmVjdCB0byBub25UcmFuc2l0aW9uIGlmIG5vIHRyYW5zaXRpb24gZHVyYXRpb25cbiAgaWYgKCAhcGFyc2VGbG9hdCggdGhpcy5sYXlvdXQub3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gKSApIHtcbiAgICB0aGlzLl9ub25UcmFuc2l0aW9uKCBhcmdzICk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIF90cmFuc2l0aW9uID0gdGhpcy5fdHJhbnNuO1xuICAvLyBrZWVwIHRyYWNrIG9mIG9uVHJhbnNpdGlvbkVuZCBjYWxsYmFjayBieSBjc3MgcHJvcGVydHlcbiAgZm9yICggdmFyIHByb3AgaW4gYXJncy5vblRyYW5zaXRpb25FbmQgKSB7XG4gICAgX3RyYW5zaXRpb24ub25FbmRbIHByb3AgXSA9IGFyZ3Mub25UcmFuc2l0aW9uRW5kWyBwcm9wIF07XG4gIH1cbiAgLy8ga2VlcCB0cmFjayBvZiBwcm9wZXJ0aWVzIHRoYXQgYXJlIHRyYW5zaXRpb25pbmdcbiAgZm9yICggcHJvcCBpbiBhcmdzLnRvICkge1xuICAgIF90cmFuc2l0aW9uLmluZ1Byb3BlcnRpZXNbIHByb3AgXSA9IHRydWU7XG4gICAgLy8ga2VlcCB0cmFjayBvZiBwcm9wZXJ0aWVzIHRvIGNsZWFuIHVwIHdoZW4gdHJhbnNpdGlvbiBpcyBkb25lXG4gICAgaWYgKCBhcmdzLmlzQ2xlYW5pbmcgKSB7XG4gICAgICBfdHJhbnNpdGlvbi5jbGVhblsgcHJvcCBdID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBzZXQgZnJvbSBzdHlsZXNcbiAgaWYgKCBhcmdzLmZyb20gKSB7XG4gICAgdGhpcy5jc3MoIGFyZ3MuZnJvbSApO1xuICAgIC8vIGZvcmNlIHJlZHJhdy4gaHR0cDovL2Jsb2cuYWxleG1hY2Nhdy5jb20vY3NzLXRyYW5zaXRpb25zXG4gICAgdmFyIGggPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIC8vIGhhY2sgZm9yIEpTSGludCB0byBodXNoIGFib3V0IHVudXNlZCB2YXJcbiAgICBoID0gbnVsbDtcbiAgfVxuICAvLyBlbmFibGUgdHJhbnNpdGlvblxuICB0aGlzLmVuYWJsZVRyYW5zaXRpb24oIGFyZ3MudG8gKTtcbiAgLy8gc2V0IHN0eWxlcyB0aGF0IGFyZSB0cmFuc2l0aW9uaW5nXG4gIHRoaXMuY3NzKCBhcmdzLnRvICk7XG5cbiAgdGhpcy5pc1RyYW5zaXRpb25pbmcgPSB0cnVlO1xuXG59O1xuXG4vLyBkYXNoIGJlZm9yZSBhbGwgY2FwIGxldHRlcnMsIGluY2x1ZGluZyBmaXJzdCBmb3Jcbi8vIFdlYmtpdFRyYW5zZm9ybSA9PiAtd2Via2l0LXRyYW5zZm9ybVxuZnVuY3Rpb24gdG9EYXNoZWRBbGwoIHN0ciApIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKCAvKFtBLVpdKS9nLCBmdW5jdGlvbiggJDEgKSB7XG4gICAgcmV0dXJuICctJyArICQxLnRvTG93ZXJDYXNlKCk7XG4gIH0pO1xufVxuXG52YXIgdHJhbnNpdGlvblByb3BzID0gJ29wYWNpdHksJyArIHRvRGFzaGVkQWxsKCB0cmFuc2Zvcm1Qcm9wZXJ0eSApO1xuXG5wcm90by5lbmFibGVUcmFuc2l0aW9uID0gZnVuY3Rpb24oLyogc3R5bGUgKi8pIHtcbiAgLy8gSEFDSyBjaGFuZ2luZyB0cmFuc2l0aW9uUHJvcGVydHkgZHVyaW5nIGEgdHJhbnNpdGlvblxuICAvLyB3aWxsIGNhdXNlIHRyYW5zaXRpb24gdG8ganVtcFxuICBpZiAoIHRoaXMuaXNUcmFuc2l0aW9uaW5nICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIG1ha2UgYHRyYW5zaXRpb246IGZvbywgYmFyLCBiYXpgIGZyb20gc3R5bGUgb2JqZWN0XG4gIC8vIEhBQ0sgdW4tY29tbWVudCB0aGlzIHdoZW4gZW5hYmxlVHJhbnNpdGlvbiBjYW4gd29ya1xuICAvLyB3aGlsZSBhIHRyYW5zaXRpb24gaXMgaGFwcGVuaW5nXG4gIC8vIHZhciB0cmFuc2l0aW9uVmFsdWVzID0gW107XG4gIC8vIGZvciAoIHZhciBwcm9wIGluIHN0eWxlICkge1xuICAvLyAgIC8vIGRhc2gtaWZ5IGNhbWVsQ2FzZWQgcHJvcGVydGllcyBsaWtlIFdlYmtpdFRyYW5zaXRpb25cbiAgLy8gICBwcm9wID0gdmVuZG9yUHJvcGVydGllc1sgcHJvcCBdIHx8IHByb3A7XG4gIC8vICAgdHJhbnNpdGlvblZhbHVlcy5wdXNoKCB0b0Rhc2hlZEFsbCggcHJvcCApICk7XG4gIC8vIH1cbiAgLy8gbXVuZ2UgbnVtYmVyIHRvIG1pbGxpc2Vjb25kLCB0byBtYXRjaCBzdGFnZ2VyXG4gIHZhciBkdXJhdGlvbiA9IHRoaXMubGF5b3V0Lm9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uO1xuICBkdXJhdGlvbiA9IHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uICsgJ21zJyA6IGR1cmF0aW9uO1xuICAvLyBlbmFibGUgdHJhbnNpdGlvbiBzdHlsZXNcbiAgdGhpcy5jc3Moe1xuICAgIHRyYW5zaXRpb25Qcm9wZXJ0eTogdHJhbnNpdGlvblByb3BzLFxuICAgIHRyYW5zaXRpb25EdXJhdGlvbjogZHVyYXRpb24sXG4gICAgdHJhbnNpdGlvbkRlbGF5OiB0aGlzLnN0YWdnZXJEZWxheSB8fCAwXG4gIH0pO1xuICAvLyBsaXN0ZW4gZm9yIHRyYW5zaXRpb24gZW5kIGV2ZW50XG4gIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCB0cmFuc2l0aW9uRW5kRXZlbnQsIHRoaXMsIGZhbHNlICk7XG59O1xuXG4vLyAtLS0tLSBldmVudHMgLS0tLS0gLy9cblxucHJvdG8ub253ZWJraXRUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24oIGV2ZW50ICkge1xuICB0aGlzLm9udHJhbnNpdGlvbmVuZCggZXZlbnQgKTtcbn07XG5cbnByb3RvLm9ub3RyYW5zaXRpb25lbmQgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIHRoaXMub250cmFuc2l0aW9uZW5kKCBldmVudCApO1xufTtcblxuLy8gcHJvcGVydGllcyB0aGF0IEkgbXVuZ2UgdG8gbWFrZSBteSBsaWZlIGVhc2llclxudmFyIGRhc2hlZFZlbmRvclByb3BlcnRpZXMgPSB7XG4gICctd2Via2l0LXRyYW5zZm9ybSc6ICd0cmFuc2Zvcm0nXG59O1xuXG5wcm90by5vbnRyYW5zaXRpb25lbmQgPSBmdW5jdGlvbiggZXZlbnQgKSB7XG4gIC8vIGRpc3JlZ2FyZCBidWJibGVkIGV2ZW50cyBmcm9tIGNoaWxkcmVuXG4gIGlmICggZXZlbnQudGFyZ2V0ICE9PSB0aGlzLmVsZW1lbnQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBfdHJhbnNpdGlvbiA9IHRoaXMuX3RyYW5zbjtcbiAgLy8gZ2V0IHByb3BlcnR5IG5hbWUgb2YgdHJhbnNpdGlvbmVkIHByb3BlcnR5LCBjb252ZXJ0IHRvIHByZWZpeC1mcmVlXG4gIHZhciBwcm9wZXJ0eU5hbWUgPSBkYXNoZWRWZW5kb3JQcm9wZXJ0aWVzWyBldmVudC5wcm9wZXJ0eU5hbWUgXSB8fCBldmVudC5wcm9wZXJ0eU5hbWU7XG5cbiAgLy8gcmVtb3ZlIHByb3BlcnR5IHRoYXQgaGFzIGNvbXBsZXRlZCB0cmFuc2l0aW9uaW5nXG4gIGRlbGV0ZSBfdHJhbnNpdGlvbi5pbmdQcm9wZXJ0aWVzWyBwcm9wZXJ0eU5hbWUgXTtcbiAgLy8gY2hlY2sgaWYgYW55IHByb3BlcnRpZXMgYXJlIHN0aWxsIHRyYW5zaXRpb25pbmdcbiAgaWYgKCBpc0VtcHR5T2JqKCBfdHJhbnNpdGlvbi5pbmdQcm9wZXJ0aWVzICkgKSB7XG4gICAgLy8gYWxsIHByb3BlcnRpZXMgaGF2ZSBjb21wbGV0ZWQgdHJhbnNpdGlvbmluZ1xuICAgIHRoaXMuZGlzYWJsZVRyYW5zaXRpb24oKTtcbiAgfVxuICAvLyBjbGVhbiBzdHlsZVxuICBpZiAoIHByb3BlcnR5TmFtZSBpbiBfdHJhbnNpdGlvbi5jbGVhbiApIHtcbiAgICAvLyBjbGVhbiB1cCBzdHlsZVxuICAgIHRoaXMuZWxlbWVudC5zdHlsZVsgZXZlbnQucHJvcGVydHlOYW1lIF0gPSAnJztcbiAgICBkZWxldGUgX3RyYW5zaXRpb24uY2xlYW5bIHByb3BlcnR5TmFtZSBdO1xuICB9XG4gIC8vIHRyaWdnZXIgb25UcmFuc2l0aW9uRW5kIGNhbGxiYWNrXG4gIGlmICggcHJvcGVydHlOYW1lIGluIF90cmFuc2l0aW9uLm9uRW5kICkge1xuICAgIHZhciBvblRyYW5zaXRpb25FbmQgPSBfdHJhbnNpdGlvbi5vbkVuZFsgcHJvcGVydHlOYW1lIF07XG4gICAgb25UcmFuc2l0aW9uRW5kLmNhbGwoIHRoaXMgKTtcbiAgICBkZWxldGUgX3RyYW5zaXRpb24ub25FbmRbIHByb3BlcnR5TmFtZSBdO1xuICB9XG5cbiAgdGhpcy5lbWl0RXZlbnQoICd0cmFuc2l0aW9uRW5kJywgWyB0aGlzIF0gKTtcbn07XG5cbnByb3RvLmRpc2FibGVUcmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucmVtb3ZlVHJhbnNpdGlvblN0eWxlcygpO1xuICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHJhbnNpdGlvbkVuZEV2ZW50LCB0aGlzLCBmYWxzZSApO1xuICB0aGlzLmlzVHJhbnNpdGlvbmluZyA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiByZW1vdmVzIHN0eWxlIHByb3BlcnR5IGZyb20gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IHN0eWxlXG4qKi9cbnByb3RvLl9yZW1vdmVTdHlsZXMgPSBmdW5jdGlvbiggc3R5bGUgKSB7XG4gIC8vIGNsZWFuIHVwIHRyYW5zaXRpb24gc3R5bGVzXG4gIHZhciBjbGVhblN0eWxlID0ge307XG4gIGZvciAoIHZhciBwcm9wIGluIHN0eWxlICkge1xuICAgIGNsZWFuU3R5bGVbIHByb3AgXSA9ICcnO1xuICB9XG4gIHRoaXMuY3NzKCBjbGVhblN0eWxlICk7XG59O1xuXG52YXIgY2xlYW5UcmFuc2l0aW9uU3R5bGUgPSB7XG4gIHRyYW5zaXRpb25Qcm9wZXJ0eTogJycsXG4gIHRyYW5zaXRpb25EdXJhdGlvbjogJycsXG4gIHRyYW5zaXRpb25EZWxheTogJydcbn07XG5cbnByb3RvLnJlbW92ZVRyYW5zaXRpb25TdHlsZXMgPSBmdW5jdGlvbigpIHtcbiAgLy8gcmVtb3ZlIHRyYW5zaXRpb25cbiAgdGhpcy5jc3MoIGNsZWFuVHJhbnNpdGlvblN0eWxlICk7XG59O1xuXG4vLyAtLS0tLSBzdGFnZ2VyIC0tLS0tIC8vXG5cbnByb3RvLnN0YWdnZXIgPSBmdW5jdGlvbiggZGVsYXkgKSB7XG4gIGRlbGF5ID0gaXNOYU4oIGRlbGF5ICkgPyAwIDogZGVsYXk7XG4gIHRoaXMuc3RhZ2dlckRlbGF5ID0gZGVsYXkgKyAnbXMnO1xufTtcblxuLy8gLS0tLS0gc2hvdy9oaWRlL3JlbW92ZSAtLS0tLSAvL1xuXG4vLyByZW1vdmUgZWxlbWVudCBmcm9tIERPTVxucHJvdG8ucmVtb3ZlRWxlbSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggdGhpcy5lbGVtZW50ICk7XG4gIC8vIHJlbW92ZSBkaXNwbGF5OiBub25lXG4gIHRoaXMuY3NzKHsgZGlzcGxheTogJycgfSk7XG4gIHRoaXMuZW1pdEV2ZW50KCAncmVtb3ZlJywgWyB0aGlzIF0gKTtcbn07XG5cbnByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBqdXN0IHJlbW92ZSBlbGVtZW50IGlmIG5vIHRyYW5zaXRpb24gc3VwcG9ydCBvciBubyB0cmFuc2l0aW9uXG4gIGlmICggIXRyYW5zaXRpb25Qcm9wZXJ0eSB8fCAhcGFyc2VGbG9hdCggdGhpcy5sYXlvdXQub3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gKSApIHtcbiAgICB0aGlzLnJlbW92ZUVsZW0oKTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBzdGFydCB0cmFuc2l0aW9uXG4gIHRoaXMub25jZSggJ3RyYW5zaXRpb25FbmQnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlbW92ZUVsZW0oKTtcbiAgfSk7XG4gIHRoaXMuaGlkZSgpO1xufTtcblxucHJvdG8ucmV2ZWFsID0gZnVuY3Rpb24oKSB7XG4gIGRlbGV0ZSB0aGlzLmlzSGlkZGVuO1xuICAvLyByZW1vdmUgZGlzcGxheTogbm9uZVxuICB0aGlzLmNzcyh7IGRpc3BsYXk6ICcnIH0pO1xuXG4gIHZhciBvcHRpb25zID0gdGhpcy5sYXlvdXQub3B0aW9ucztcblxuICB2YXIgb25UcmFuc2l0aW9uRW5kID0ge307XG4gIHZhciB0cmFuc2l0aW9uRW5kUHJvcGVydHkgPSB0aGlzLmdldEhpZGVSZXZlYWxUcmFuc2l0aW9uRW5kUHJvcGVydHkoJ3Zpc2libGVTdHlsZScpO1xuICBvblRyYW5zaXRpb25FbmRbIHRyYW5zaXRpb25FbmRQcm9wZXJ0eSBdID0gdGhpcy5vblJldmVhbFRyYW5zaXRpb25FbmQ7XG5cbiAgdGhpcy50cmFuc2l0aW9uKHtcbiAgICBmcm9tOiBvcHRpb25zLmhpZGRlblN0eWxlLFxuICAgIHRvOiBvcHRpb25zLnZpc2libGVTdHlsZSxcbiAgICBpc0NsZWFuaW5nOiB0cnVlLFxuICAgIG9uVHJhbnNpdGlvbkVuZDogb25UcmFuc2l0aW9uRW5kXG4gIH0pO1xufTtcblxucHJvdG8ub25SZXZlYWxUcmFuc2l0aW9uRW5kID0gZnVuY3Rpb24oKSB7XG4gIC8vIGNoZWNrIGlmIHN0aWxsIHZpc2libGVcbiAgLy8gZHVyaW5nIHRyYW5zaXRpb24sIGl0ZW0gbWF5IGhhdmUgYmVlbiBoaWRkZW5cbiAgaWYgKCAhdGhpcy5pc0hpZGRlbiApIHtcbiAgICB0aGlzLmVtaXRFdmVudCgncmV2ZWFsJyk7XG4gIH1cbn07XG5cbi8qKlxuICogZ2V0IHN0eWxlIHByb3BlcnR5IHVzZSBmb3IgaGlkZS9yZXZlYWwgdHJhbnNpdGlvbiBlbmRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHlsZVByb3BlcnR5IC0gaGlkZGVuU3R5bGUvdmlzaWJsZVN0eWxlXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5wcm90by5nZXRIaWRlUmV2ZWFsVHJhbnNpdGlvbkVuZFByb3BlcnR5ID0gZnVuY3Rpb24oIHN0eWxlUHJvcGVydHkgKSB7XG4gIHZhciBvcHRpb25TdHlsZSA9IHRoaXMubGF5b3V0Lm9wdGlvbnNbIHN0eWxlUHJvcGVydHkgXTtcbiAgLy8gdXNlIG9wYWNpdHlcbiAgaWYgKCBvcHRpb25TdHlsZS5vcGFjaXR5ICkge1xuICAgIHJldHVybiAnb3BhY2l0eSc7XG4gIH1cbiAgLy8gZ2V0IGZpcnN0IHByb3BlcnR5XG4gIGZvciAoIHZhciBwcm9wIGluIG9wdGlvblN0eWxlICkge1xuICAgIHJldHVybiBwcm9wO1xuICB9XG59O1xuXG5wcm90by5oaWRlID0gZnVuY3Rpb24oKSB7XG4gIC8vIHNldCBmbGFnXG4gIHRoaXMuaXNIaWRkZW4gPSB0cnVlO1xuICAvLyByZW1vdmUgZGlzcGxheTogbm9uZVxuICB0aGlzLmNzcyh7IGRpc3BsYXk6ICcnIH0pO1xuXG4gIHZhciBvcHRpb25zID0gdGhpcy5sYXlvdXQub3B0aW9ucztcblxuICB2YXIgb25UcmFuc2l0aW9uRW5kID0ge307XG4gIHZhciB0cmFuc2l0aW9uRW5kUHJvcGVydHkgPSB0aGlzLmdldEhpZGVSZXZlYWxUcmFuc2l0aW9uRW5kUHJvcGVydHkoJ2hpZGRlblN0eWxlJyk7XG4gIG9uVHJhbnNpdGlvbkVuZFsgdHJhbnNpdGlvbkVuZFByb3BlcnR5IF0gPSB0aGlzLm9uSGlkZVRyYW5zaXRpb25FbmQ7XG5cbiAgdGhpcy50cmFuc2l0aW9uKHtcbiAgICBmcm9tOiBvcHRpb25zLnZpc2libGVTdHlsZSxcbiAgICB0bzogb3B0aW9ucy5oaWRkZW5TdHlsZSxcbiAgICAvLyBrZWVwIGhpZGRlbiBzdHVmZiBoaWRkZW5cbiAgICBpc0NsZWFuaW5nOiB0cnVlLFxuICAgIG9uVHJhbnNpdGlvbkVuZDogb25UcmFuc2l0aW9uRW5kXG4gIH0pO1xufTtcblxucHJvdG8ub25IaWRlVHJhbnNpdGlvbkVuZCA9IGZ1bmN0aW9uKCkge1xuICAvLyBjaGVjayBpZiBzdGlsbCBoaWRkZW5cbiAgLy8gZHVyaW5nIHRyYW5zaXRpb24sIGl0ZW0gbWF5IGhhdmUgYmVlbiB1bi1oaWRkZW5cbiAgaWYgKCB0aGlzLmlzSGlkZGVuICkge1xuICAgIHRoaXMuY3NzKHsgZGlzcGxheTogJ25vbmUnIH0pO1xuICAgIHRoaXMuZW1pdEV2ZW50KCdoaWRlJyk7XG4gIH1cbn07XG5cbnByb3RvLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jc3Moe1xuICAgIHBvc2l0aW9uOiAnJyxcbiAgICBsZWZ0OiAnJyxcbiAgICByaWdodDogJycsXG4gICAgdG9wOiAnJyxcbiAgICBib3R0b206ICcnLFxuICAgIHRyYW5zaXRpb246ICcnLFxuICAgIHRyYW5zZm9ybTogJydcbiAgfSk7XG59O1xuXG5yZXR1cm4gSXRlbTtcblxufSkpO1xuIiwiLyohXG4gKiBPdXRsYXllciB2Mi4xLjFcbiAqIHRoZSBicmFpbnMgYW5kIGd1dHMgb2YgYSBsYXlvdXQgbGlicmFyeVxuICogTUlUIGxpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLy8gdW5pdmVyc2FsIG1vZHVsZSBkZWZpbml0aW9uXG4gIC8qIGpzaGludCBzdHJpY3Q6IGZhbHNlICovIC8qIGdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHJlcXVpcmUgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTUQgLSBSZXF1aXJlSlNcbiAgICBkZWZpbmUoIFtcbiAgICAgICAgJ2V2LWVtaXR0ZXIvZXYtZW1pdHRlcicsXG4gICAgICAgICdnZXQtc2l6ZS9nZXQtc2l6ZScsXG4gICAgICAgICdmaXp6eS11aS11dGlscy91dGlscycsXG4gICAgICAgICcuL2l0ZW0nXG4gICAgICBdLFxuICAgICAgZnVuY3Rpb24oIEV2RW1pdHRlciwgZ2V0U2l6ZSwgdXRpbHMsIEl0ZW0gKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3J5KCB3aW5kb3csIEV2RW1pdHRlciwgZ2V0U2l6ZSwgdXRpbHMsIEl0ZW0pO1xuICAgICAgfVxuICAgICk7XG4gIH0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG4gICAgLy8gQ29tbW9uSlMgLSBCcm93c2VyaWZ5LCBXZWJwYWNrXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgcmVxdWlyZSgnZXYtZW1pdHRlcicpLFxuICAgICAgcmVxdWlyZSgnZ2V0LXNpemUnKSxcbiAgICAgIHJlcXVpcmUoJ2Zpenp5LXVpLXV0aWxzJyksXG4gICAgICByZXF1aXJlKCcuL2l0ZW0nKVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgLy8gYnJvd3NlciBnbG9iYWxcbiAgICB3aW5kb3cuT3V0bGF5ZXIgPSBmYWN0b3J5KFxuICAgICAgd2luZG93LFxuICAgICAgd2luZG93LkV2RW1pdHRlcixcbiAgICAgIHdpbmRvdy5nZXRTaXplLFxuICAgICAgd2luZG93LmZpenp5VUlVdGlscyxcbiAgICAgIHdpbmRvdy5PdXRsYXllci5JdGVtXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIHdpbmRvdywgRXZFbWl0dGVyLCBnZXRTaXplLCB1dGlscywgSXRlbSApIHtcbid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0gdmFycyAtLS0tLSAvL1xuXG52YXIgY29uc29sZSA9IHdpbmRvdy5jb25zb2xlO1xudmFyIGpRdWVyeSA9IHdpbmRvdy5qUXVlcnk7XG52YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIE91dGxheWVyIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8vIGdsb2JhbGx5IHVuaXF1ZSBpZGVudGlmaWVyc1xudmFyIEdVSUQgPSAwO1xuLy8gaW50ZXJuYWwgc3RvcmUgb2YgYWxsIE91dGxheWVyIGludGFuY2VzXG52YXIgaW5zdGFuY2VzID0ge307XG5cblxuLyoqXG4gKiBAcGFyYW0ge0VsZW1lbnQsIFN0cmluZ30gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPdXRsYXllciggZWxlbWVudCwgb3B0aW9ucyApIHtcbiAgdmFyIHF1ZXJ5RWxlbWVudCA9IHV0aWxzLmdldFF1ZXJ5RWxlbWVudCggZWxlbWVudCApO1xuICBpZiAoICFxdWVyeUVsZW1lbnQgKSB7XG4gICAgaWYgKCBjb25zb2xlICkge1xuICAgICAgY29uc29sZS5lcnJvciggJ0JhZCBlbGVtZW50IGZvciAnICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lc3BhY2UgK1xuICAgICAgICAnOiAnICsgKCBxdWVyeUVsZW1lbnQgfHwgZWxlbWVudCApICk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLmVsZW1lbnQgPSBxdWVyeUVsZW1lbnQ7XG4gIC8vIGFkZCBqUXVlcnlcbiAgaWYgKCBqUXVlcnkgKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9IGpRdWVyeSggdGhpcy5lbGVtZW50ICk7XG4gIH1cblxuICAvLyBvcHRpb25zXG4gIHRoaXMub3B0aW9ucyA9IHV0aWxzLmV4dGVuZCgge30sIHRoaXMuY29uc3RydWN0b3IuZGVmYXVsdHMgKTtcbiAgdGhpcy5vcHRpb24oIG9wdGlvbnMgKTtcblxuICAvLyBhZGQgaWQgZm9yIE91dGxheWVyLmdldEZyb21FbGVtZW50XG4gIHZhciBpZCA9ICsrR1VJRDtcbiAgdGhpcy5lbGVtZW50Lm91dGxheWVyR1VJRCA9IGlkOyAvLyBleHBhbmRvXG4gIGluc3RhbmNlc1sgaWQgXSA9IHRoaXM7IC8vIGFzc29jaWF0ZSB2aWEgaWRcblxuICAvLyBraWNrIGl0IG9mZlxuICB0aGlzLl9jcmVhdGUoKTtcblxuICB2YXIgaXNJbml0TGF5b3V0ID0gdGhpcy5fZ2V0T3B0aW9uKCdpbml0TGF5b3V0Jyk7XG4gIGlmICggaXNJbml0TGF5b3V0ICkge1xuICAgIHRoaXMubGF5b3V0KCk7XG4gIH1cbn1cblxuLy8gc2V0dGluZ3MgYXJlIGZvciBpbnRlcm5hbCB1c2Ugb25seVxuT3V0bGF5ZXIubmFtZXNwYWNlID0gJ291dGxheWVyJztcbk91dGxheWVyLkl0ZW0gPSBJdGVtO1xuXG4vLyBkZWZhdWx0IG9wdGlvbnNcbk91dGxheWVyLmRlZmF1bHRzID0ge1xuICBjb250YWluZXJTdHlsZToge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gIH0sXG4gIGluaXRMYXlvdXQ6IHRydWUsXG4gIG9yaWdpbkxlZnQ6IHRydWUsXG4gIG9yaWdpblRvcDogdHJ1ZSxcbiAgcmVzaXplOiB0cnVlLFxuICByZXNpemVDb250YWluZXI6IHRydWUsXG4gIC8vIGl0ZW0gb3B0aW9uc1xuICB0cmFuc2l0aW9uRHVyYXRpb246ICcwLjRzJyxcbiAgaGlkZGVuU3R5bGU6IHtcbiAgICBvcGFjaXR5OiAwLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuMDAxKSdcbiAgfSxcbiAgdmlzaWJsZVN0eWxlOiB7XG4gICAgb3BhY2l0eTogMSxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKSdcbiAgfVxufTtcblxudmFyIHByb3RvID0gT3V0bGF5ZXIucHJvdG90eXBlO1xuLy8gaW5oZXJpdCBFdkVtaXR0ZXJcbnV0aWxzLmV4dGVuZCggcHJvdG8sIEV2RW1pdHRlci5wcm90b3R5cGUgKTtcblxuLyoqXG4gKiBzZXQgb3B0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqL1xucHJvdG8ub3B0aW9uID0gZnVuY3Rpb24oIG9wdHMgKSB7XG4gIHV0aWxzLmV4dGVuZCggdGhpcy5vcHRpb25zLCBvcHRzICk7XG59O1xuXG4vKipcbiAqIGdldCBiYWNrd2FyZHMgY29tcGF0aWJsZSBvcHRpb24gdmFsdWUsIGNoZWNrIG9sZCBuYW1lXG4gKi9cbnByb3RvLl9nZXRPcHRpb24gPSBmdW5jdGlvbiggb3B0aW9uICkge1xuICB2YXIgb2xkT3B0aW9uID0gdGhpcy5jb25zdHJ1Y3Rvci5jb21wYXRPcHRpb25zWyBvcHRpb24gXTtcbiAgcmV0dXJuIG9sZE9wdGlvbiAmJiB0aGlzLm9wdGlvbnNbIG9sZE9wdGlvbiBdICE9PSB1bmRlZmluZWQgP1xuICAgIHRoaXMub3B0aW9uc1sgb2xkT3B0aW9uIF0gOiB0aGlzLm9wdGlvbnNbIG9wdGlvbiBdO1xufTtcblxuT3V0bGF5ZXIuY29tcGF0T3B0aW9ucyA9IHtcbiAgLy8gY3VycmVudE5hbWU6IG9sZE5hbWVcbiAgaW5pdExheW91dDogJ2lzSW5pdExheW91dCcsXG4gIGhvcml6b250YWw6ICdpc0hvcml6b250YWwnLFxuICBsYXlvdXRJbnN0YW50OiAnaXNMYXlvdXRJbnN0YW50JyxcbiAgb3JpZ2luTGVmdDogJ2lzT3JpZ2luTGVmdCcsXG4gIG9yaWdpblRvcDogJ2lzT3JpZ2luVG9wJyxcbiAgcmVzaXplOiAnaXNSZXNpemVCb3VuZCcsXG4gIHJlc2l6ZUNvbnRhaW5lcjogJ2lzUmVzaXppbmdDb250YWluZXInXG59O1xuXG5wcm90by5fY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gIC8vIGdldCBpdGVtcyBmcm9tIGNoaWxkcmVuXG4gIHRoaXMucmVsb2FkSXRlbXMoKTtcbiAgLy8gZWxlbWVudHMgdGhhdCBhZmZlY3QgbGF5b3V0LCBidXQgYXJlIG5vdCBsYWlkIG91dFxuICB0aGlzLnN0YW1wcyA9IFtdO1xuICB0aGlzLnN0YW1wKCB0aGlzLm9wdGlvbnMuc3RhbXAgKTtcbiAgLy8gc2V0IGNvbnRhaW5lciBzdHlsZVxuICB1dGlscy5leHRlbmQoIHRoaXMuZWxlbWVudC5zdHlsZSwgdGhpcy5vcHRpb25zLmNvbnRhaW5lclN0eWxlICk7XG5cbiAgLy8gYmluZCByZXNpemUgbWV0aG9kXG4gIHZhciBjYW5CaW5kUmVzaXplID0gdGhpcy5fZ2V0T3B0aW9uKCdyZXNpemUnKTtcbiAgaWYgKCBjYW5CaW5kUmVzaXplICkge1xuICAgIHRoaXMuYmluZFJlc2l6ZSgpO1xuICB9XG59O1xuXG4vLyBnb2VzIHRocm91Z2ggYWxsIGNoaWxkcmVuIGFnYWluIGFuZCBnZXRzIGJyaWNrcyBpbiBwcm9wZXIgb3JkZXJcbnByb3RvLnJlbG9hZEl0ZW1zID0gZnVuY3Rpb24oKSB7XG4gIC8vIGNvbGxlY3Rpb24gb2YgaXRlbSBlbGVtZW50c1xuICB0aGlzLml0ZW1zID0gdGhpcy5faXRlbWl6ZSggdGhpcy5lbGVtZW50LmNoaWxkcmVuICk7XG59O1xuXG5cbi8qKlxuICogdHVybiBlbGVtZW50cyBpbnRvIE91dGxheWVyLkl0ZW1zIHRvIGJlIHVzZWQgaW4gbGF5b3V0XG4gKiBAcGFyYW0ge0FycmF5IG9yIE5vZGVMaXN0IG9yIEhUTUxFbGVtZW50fSBlbGVtc1xuICogQHJldHVybnMge0FycmF5fSBpdGVtcyAtIGNvbGxlY3Rpb24gb2YgbmV3IE91dGxheWVyIEl0ZW1zXG4gKi9cbnByb3RvLl9pdGVtaXplID0gZnVuY3Rpb24oIGVsZW1zICkge1xuXG4gIHZhciBpdGVtRWxlbXMgPSB0aGlzLl9maWx0ZXJGaW5kSXRlbUVsZW1lbnRzKCBlbGVtcyApO1xuICB2YXIgSXRlbSA9IHRoaXMuY29uc3RydWN0b3IuSXRlbTtcblxuICAvLyBjcmVhdGUgbmV3IE91dGxheWVyIEl0ZW1zIGZvciBjb2xsZWN0aW9uXG4gIHZhciBpdGVtcyA9IFtdO1xuICBmb3IgKCB2YXIgaT0wOyBpIDwgaXRlbUVsZW1zLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBlbGVtID0gaXRlbUVsZW1zW2ldO1xuICAgIHZhciBpdGVtID0gbmV3IEl0ZW0oIGVsZW0sIHRoaXMgKTtcbiAgICBpdGVtcy5wdXNoKCBpdGVtICk7XG4gIH1cblxuICByZXR1cm4gaXRlbXM7XG59O1xuXG4vKipcbiAqIGdldCBpdGVtIGVsZW1lbnRzIHRvIGJlIHVzZWQgaW4gbGF5b3V0XG4gKiBAcGFyYW0ge0FycmF5IG9yIE5vZGVMaXN0IG9yIEhUTUxFbGVtZW50fSBlbGVtc1xuICogQHJldHVybnMge0FycmF5fSBpdGVtcyAtIGl0ZW0gZWxlbWVudHNcbiAqL1xucHJvdG8uX2ZpbHRlckZpbmRJdGVtRWxlbWVudHMgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHJldHVybiB1dGlscy5maWx0ZXJGaW5kRWxlbWVudHMoIGVsZW1zLCB0aGlzLm9wdGlvbnMuaXRlbVNlbGVjdG9yICk7XG59O1xuXG4vKipcbiAqIGdldHRlciBtZXRob2QgZm9yIGdldHRpbmcgaXRlbSBlbGVtZW50c1xuICogQHJldHVybnMge0FycmF5fSBlbGVtcyAtIGNvbGxlY3Rpb24gb2YgaXRlbSBlbGVtZW50c1xuICovXG5wcm90by5nZXRJdGVtRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaXRlbXMubWFwKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICByZXR1cm4gaXRlbS5lbGVtZW50O1xuICB9KTtcbn07XG5cbi8vIC0tLS0tIGluaXQgJiBsYXlvdXQgLS0tLS0gLy9cblxuLyoqXG4gKiBsYXlzIG91dCBhbGwgaXRlbXNcbiAqL1xucHJvdG8ubGF5b3V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX3Jlc2V0TGF5b3V0KCk7XG4gIHRoaXMuX21hbmFnZVN0YW1wcygpO1xuXG4gIC8vIGRvbid0IGFuaW1hdGUgZmlyc3QgbGF5b3V0XG4gIHZhciBsYXlvdXRJbnN0YW50ID0gdGhpcy5fZ2V0T3B0aW9uKCdsYXlvdXRJbnN0YW50Jyk7XG4gIHZhciBpc0luc3RhbnQgPSBsYXlvdXRJbnN0YW50ICE9PSB1bmRlZmluZWQgP1xuICAgIGxheW91dEluc3RhbnQgOiAhdGhpcy5faXNMYXlvdXRJbml0ZWQ7XG4gIHRoaXMubGF5b3V0SXRlbXMoIHRoaXMuaXRlbXMsIGlzSW5zdGFudCApO1xuXG4gIC8vIGZsYWcgZm9yIGluaXRhbGl6ZWRcbiAgdGhpcy5faXNMYXlvdXRJbml0ZWQgPSB0cnVlO1xufTtcblxuLy8gX2luaXQgaXMgYWxpYXMgZm9yIGxheW91dFxucHJvdG8uX2luaXQgPSBwcm90by5sYXlvdXQ7XG5cbi8qKlxuICogbG9naWMgYmVmb3JlIGFueSBuZXcgbGF5b3V0XG4gKi9cbnByb3RvLl9yZXNldExheW91dCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmdldFNpemUoKTtcbn07XG5cblxucHJvdG8uZ2V0U2l6ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnNpemUgPSBnZXRTaXplKCB0aGlzLmVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogZ2V0IG1lYXN1cmVtZW50IGZyb20gb3B0aW9uLCBmb3IgY29sdW1uV2lkdGgsIHJvd0hlaWdodCwgZ3V0dGVyXG4gKiBpZiBvcHRpb24gaXMgU3RyaW5nIC0+IGdldCBlbGVtZW50IGZyb20gc2VsZWN0b3Igc3RyaW5nLCAmIGdldCBzaXplIG9mIGVsZW1lbnRcbiAqIGlmIG9wdGlvbiBpcyBFbGVtZW50IC0+IGdldCBzaXplIG9mIGVsZW1lbnRcbiAqIGVsc2UgdXNlIG9wdGlvbiBhcyBhIG51bWJlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZWFzdXJlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHNpemUgLSB3aWR0aCBvciBoZWlnaHRcbiAqIEBwcml2YXRlXG4gKi9cbnByb3RvLl9nZXRNZWFzdXJlbWVudCA9IGZ1bmN0aW9uKCBtZWFzdXJlbWVudCwgc2l6ZSApIHtcbiAgdmFyIG9wdGlvbiA9IHRoaXMub3B0aW9uc1sgbWVhc3VyZW1lbnQgXTtcbiAgdmFyIGVsZW07XG4gIGlmICggIW9wdGlvbiApIHtcbiAgICAvLyBkZWZhdWx0IHRvIDBcbiAgICB0aGlzWyBtZWFzdXJlbWVudCBdID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyB1c2Ugb3B0aW9uIGFzIGFuIGVsZW1lbnRcbiAgICBpZiAoIHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycgKSB7XG4gICAgICBlbGVtID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoIG9wdGlvbiApO1xuICAgIH0gZWxzZSBpZiAoIG9wdGlvbiBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICkge1xuICAgICAgZWxlbSA9IG9wdGlvbjtcbiAgICB9XG4gICAgLy8gdXNlIHNpemUgb2YgZWxlbWVudCwgaWYgZWxlbWVudFxuICAgIHRoaXNbIG1lYXN1cmVtZW50IF0gPSBlbGVtID8gZ2V0U2l6ZSggZWxlbSApWyBzaXplIF0gOiBvcHRpb247XG4gIH1cbn07XG5cbi8qKlxuICogbGF5b3V0IGEgY29sbGVjdGlvbiBvZiBpdGVtIGVsZW1lbnRzXG4gKiBAYXBpIHB1YmxpY1xuICovXG5wcm90by5sYXlvdXRJdGVtcyA9IGZ1bmN0aW9uKCBpdGVtcywgaXNJbnN0YW50ICkge1xuICBpdGVtcyA9IHRoaXMuX2dldEl0ZW1zRm9yTGF5b3V0KCBpdGVtcyApO1xuXG4gIHRoaXMuX2xheW91dEl0ZW1zKCBpdGVtcywgaXNJbnN0YW50ICk7XG5cbiAgdGhpcy5fcG9zdExheW91dCgpO1xufTtcblxuLyoqXG4gKiBnZXQgdGhlIGl0ZW1zIHRvIGJlIGxhaWQgb3V0XG4gKiB5b3UgbWF5IHdhbnQgdG8gc2tpcCBvdmVyIHNvbWUgaXRlbXNcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zXG4gKiBAcmV0dXJucyB7QXJyYXl9IGl0ZW1zXG4gKi9cbnByb3RvLl9nZXRJdGVtc0ZvckxheW91dCA9IGZ1bmN0aW9uKCBpdGVtcyApIHtcbiAgcmV0dXJuIGl0ZW1zLmZpbHRlciggZnVuY3Rpb24oIGl0ZW0gKSB7XG4gICAgcmV0dXJuICFpdGVtLmlzSWdub3JlZDtcbiAgfSk7XG59O1xuXG4vKipcbiAqIGxheW91dCBpdGVtc1xuICogQHBhcmFtIHtBcnJheX0gaXRlbXNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNJbnN0YW50XG4gKi9cbnByb3RvLl9sYXlvdXRJdGVtcyA9IGZ1bmN0aW9uKCBpdGVtcywgaXNJbnN0YW50ICkge1xuICB0aGlzLl9lbWl0Q29tcGxldGVPbkl0ZW1zKCAnbGF5b3V0JywgaXRlbXMgKTtcblxuICBpZiAoICFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoICkge1xuICAgIC8vIG5vIGl0ZW1zLCBlbWl0IGV2ZW50IHdpdGggZW1wdHkgYXJyYXlcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgcXVldWUgPSBbXTtcblxuICBpdGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICAvLyBnZXQgeC95IG9iamVjdCBmcm9tIG1ldGhvZFxuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuX2dldEl0ZW1MYXlvdXRQb3NpdGlvbiggaXRlbSApO1xuICAgIC8vIGVucXVldWVcbiAgICBwb3NpdGlvbi5pdGVtID0gaXRlbTtcbiAgICBwb3NpdGlvbi5pc0luc3RhbnQgPSBpc0luc3RhbnQgfHwgaXRlbS5pc0xheW91dEluc3RhbnQ7XG4gICAgcXVldWUucHVzaCggcG9zaXRpb24gKTtcbiAgfSwgdGhpcyApO1xuXG4gIHRoaXMuX3Byb2Nlc3NMYXlvdXRRdWV1ZSggcXVldWUgKTtcbn07XG5cbi8qKlxuICogZ2V0IGl0ZW0gbGF5b3V0IHBvc2l0aW9uXG4gKiBAcGFyYW0ge091dGxheWVyLkl0ZW19IGl0ZW1cbiAqIEByZXR1cm5zIHtPYmplY3R9IHggYW5kIHkgcG9zaXRpb25cbiAqL1xucHJvdG8uX2dldEl0ZW1MYXlvdXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCAvKiBpdGVtICovICkge1xuICByZXR1cm4ge1xuICAgIHg6IDAsXG4gICAgeTogMFxuICB9O1xufTtcblxuLyoqXG4gKiBpdGVyYXRlIG92ZXIgYXJyYXkgYW5kIHBvc2l0aW9uIGVhY2ggaXRlbVxuICogUmVhc29uIGJlaW5nIC0gc2VwYXJhdGluZyB0aGlzIGxvZ2ljIHByZXZlbnRzICdsYXlvdXQgaW52YWxpZGF0aW9uJ1xuICogdGh4IEBwYXVsX2lyaXNoXG4gKiBAcGFyYW0ge0FycmF5fSBxdWV1ZVxuICovXG5wcm90by5fcHJvY2Vzc0xheW91dFF1ZXVlID0gZnVuY3Rpb24oIHF1ZXVlICkge1xuICB0aGlzLnVwZGF0ZVN0YWdnZXIoKTtcbiAgcXVldWUuZm9yRWFjaCggZnVuY3Rpb24oIG9iaiwgaSApIHtcbiAgICB0aGlzLl9wb3NpdGlvbkl0ZW0oIG9iai5pdGVtLCBvYmoueCwgb2JqLnksIG9iai5pc0luc3RhbnQsIGkgKTtcbiAgfSwgdGhpcyApO1xufTtcblxuLy8gc2V0IHN0YWdnZXIgZnJvbSBvcHRpb24gaW4gbWlsbGlzZWNvbmRzIG51bWJlclxucHJvdG8udXBkYXRlU3RhZ2dlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhZ2dlciA9IHRoaXMub3B0aW9ucy5zdGFnZ2VyO1xuICBpZiAoIHN0YWdnZXIgPT09IG51bGwgfHwgc3RhZ2dlciA9PT0gdW5kZWZpbmVkICkge1xuICAgIHRoaXMuc3RhZ2dlciA9IDA7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMuc3RhZ2dlciA9IGdldE1pbGxpc2Vjb25kcyggc3RhZ2dlciApO1xuICByZXR1cm4gdGhpcy5zdGFnZ2VyO1xufTtcblxuLyoqXG4gKiBTZXRzIHBvc2l0aW9uIG9mIGl0ZW0gaW4gRE9NXG4gKiBAcGFyYW0ge091dGxheWVyLkl0ZW19IGl0ZW1cbiAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gaG9yaXpvbnRhbCBwb3NpdGlvblxuICogQHBhcmFtIHtOdW1iZXJ9IHkgLSB2ZXJ0aWNhbCBwb3NpdGlvblxuICogQHBhcmFtIHtCb29sZWFufSBpc0luc3RhbnQgLSBkaXNhYmxlcyB0cmFuc2l0aW9uc1xuICovXG5wcm90by5fcG9zaXRpb25JdGVtID0gZnVuY3Rpb24oIGl0ZW0sIHgsIHksIGlzSW5zdGFudCwgaSApIHtcbiAgaWYgKCBpc0luc3RhbnQgKSB7XG4gICAgLy8gaWYgbm90IHRyYW5zaXRpb24sIGp1c3Qgc2V0IENTU1xuICAgIGl0ZW0uZ29UbyggeCwgeSApO1xuICB9IGVsc2Uge1xuICAgIGl0ZW0uc3RhZ2dlciggaSAqIHRoaXMuc3RhZ2dlciApO1xuICAgIGl0ZW0ubW92ZVRvKCB4LCB5ICk7XG4gIH1cbn07XG5cbi8qKlxuICogQW55IGxvZ2ljIHlvdSB3YW50IHRvIGRvIGFmdGVyIGVhY2ggbGF5b3V0LFxuICogaS5lLiBzaXplIHRoZSBjb250YWluZXJcbiAqL1xucHJvdG8uX3Bvc3RMYXlvdXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yZXNpemVDb250YWluZXIoKTtcbn07XG5cbnByb3RvLnJlc2l6ZUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXNSZXNpemluZ0NvbnRhaW5lciA9IHRoaXMuX2dldE9wdGlvbigncmVzaXplQ29udGFpbmVyJyk7XG4gIGlmICggIWlzUmVzaXppbmdDb250YWluZXIgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBzaXplID0gdGhpcy5fZ2V0Q29udGFpbmVyU2l6ZSgpO1xuICBpZiAoIHNpemUgKSB7XG4gICAgdGhpcy5fc2V0Q29udGFpbmVyTWVhc3VyZSggc2l6ZS53aWR0aCwgdHJ1ZSApO1xuICAgIHRoaXMuX3NldENvbnRhaW5lck1lYXN1cmUoIHNpemUuaGVpZ2h0LCBmYWxzZSApO1xuICB9XG59O1xuXG4vKipcbiAqIFNldHMgd2lkdGggb3IgaGVpZ2h0IG9mIGNvbnRhaW5lciBpZiByZXR1cm5lZFxuICogQHJldHVybnMge09iamVjdH0gc2l6ZVxuICogICBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAqICAgQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxuICovXG5wcm90by5fZ2V0Q29udGFpbmVyU2l6ZSA9IG5vb3A7XG5cbi8qKlxuICogQHBhcmFtIHtOdW1iZXJ9IG1lYXN1cmUgLSBzaXplIG9mIHdpZHRoIG9yIGhlaWdodFxuICogQHBhcmFtIHtCb29sZWFufSBpc1dpZHRoXG4gKi9cbnByb3RvLl9zZXRDb250YWluZXJNZWFzdXJlID0gZnVuY3Rpb24oIG1lYXN1cmUsIGlzV2lkdGggKSB7XG4gIGlmICggbWVhc3VyZSA9PT0gdW5kZWZpbmVkICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBlbGVtU2l6ZSA9IHRoaXMuc2l6ZTtcbiAgLy8gYWRkIHBhZGRpbmcgYW5kIGJvcmRlciB3aWR0aCBpZiBib3JkZXIgYm94XG4gIGlmICggZWxlbVNpemUuaXNCb3JkZXJCb3ggKSB7XG4gICAgbWVhc3VyZSArPSBpc1dpZHRoID8gZWxlbVNpemUucGFkZGluZ0xlZnQgKyBlbGVtU2l6ZS5wYWRkaW5nUmlnaHQgK1xuICAgICAgZWxlbVNpemUuYm9yZGVyTGVmdFdpZHRoICsgZWxlbVNpemUuYm9yZGVyUmlnaHRXaWR0aCA6XG4gICAgICBlbGVtU2l6ZS5wYWRkaW5nQm90dG9tICsgZWxlbVNpemUucGFkZGluZ1RvcCArXG4gICAgICBlbGVtU2l6ZS5ib3JkZXJUb3BXaWR0aCArIGVsZW1TaXplLmJvcmRlckJvdHRvbVdpZHRoO1xuICB9XG5cbiAgbWVhc3VyZSA9IE1hdGgubWF4KCBtZWFzdXJlLCAwICk7XG4gIHRoaXMuZWxlbWVudC5zdHlsZVsgaXNXaWR0aCA/ICd3aWR0aCcgOiAnaGVpZ2h0JyBdID0gbWVhc3VyZSArICdweCc7XG59O1xuXG4vKipcbiAqIGVtaXQgZXZlbnRDb21wbGV0ZSBvbiBhIGNvbGxlY3Rpb24gb2YgaXRlbXMgZXZlbnRzXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtcyAtIE91dGxheWVyLkl0ZW1zXG4gKi9cbnByb3RvLl9lbWl0Q29tcGxldGVPbkl0ZW1zID0gZnVuY3Rpb24oIGV2ZW50TmFtZSwgaXRlbXMgKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIGZ1bmN0aW9uIG9uQ29tcGxldGUoKSB7XG4gICAgX3RoaXMuZGlzcGF0Y2hFdmVudCggZXZlbnROYW1lICsgJ0NvbXBsZXRlJywgbnVsbCwgWyBpdGVtcyBdICk7XG4gIH1cblxuICB2YXIgY291bnQgPSBpdGVtcy5sZW5ndGg7XG4gIGlmICggIWl0ZW1zIHx8ICFjb3VudCApIHtcbiAgICBvbkNvbXBsZXRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIGRvbmVDb3VudCA9IDA7XG4gIGZ1bmN0aW9uIHRpY2soKSB7XG4gICAgZG9uZUNvdW50Kys7XG4gICAgaWYgKCBkb25lQ291bnQgPT0gY291bnQgKSB7XG4gICAgICBvbkNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gYmluZCBjYWxsYmFja1xuICBpdGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICBpdGVtLm9uY2UoIGV2ZW50TmFtZSwgdGljayApO1xuICB9KTtcbn07XG5cbi8qKlxuICogZW1pdHMgZXZlbnRzIHZpYSBFdkVtaXR0ZXIgYW5kIGpRdWVyeSBldmVudHNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gbmFtZSBvZiBldmVudFxuICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBvcmlnaW5hbCBldmVudFxuICogQHBhcmFtIHtBcnJheX0gYXJncyAtIGV4dHJhIGFyZ3VtZW50c1xuICovXG5wcm90by5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oIHR5cGUsIGV2ZW50LCBhcmdzICkge1xuICAvLyBhZGQgb3JpZ2luYWwgZXZlbnQgdG8gYXJndW1lbnRzXG4gIHZhciBlbWl0QXJncyA9IGV2ZW50ID8gWyBldmVudCBdLmNvbmNhdCggYXJncyApIDogYXJncztcbiAgdGhpcy5lbWl0RXZlbnQoIHR5cGUsIGVtaXRBcmdzICk7XG5cbiAgaWYgKCBqUXVlcnkgKSB7XG4gICAgLy8gc2V0IHRoaXMuJGVsZW1lbnRcbiAgICB0aGlzLiRlbGVtZW50ID0gdGhpcy4kZWxlbWVudCB8fCBqUXVlcnkoIHRoaXMuZWxlbWVudCApO1xuICAgIGlmICggZXZlbnQgKSB7XG4gICAgICAvLyBjcmVhdGUgalF1ZXJ5IGV2ZW50XG4gICAgICB2YXIgJGV2ZW50ID0galF1ZXJ5LkV2ZW50KCBldmVudCApO1xuICAgICAgJGV2ZW50LnR5cGUgPSB0eXBlO1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCAkZXZlbnQsIGFyZ3MgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8ganVzdCB0cmlnZ2VyIHdpdGggdHlwZSBpZiBubyBldmVudCBhdmFpbGFibGVcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlciggdHlwZSwgYXJncyApO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaWdub3JlICYgc3RhbXBzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cblxuLyoqXG4gKiBrZWVwIGl0ZW0gaW4gY29sbGVjdGlvbiwgYnV0IGRvIG5vdCBsYXkgaXQgb3V0XG4gKiBpZ25vcmVkIGl0ZW1zIGRvIG5vdCBnZXQgc2tpcHBlZCBpbiBsYXlvdXRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxuICovXG5wcm90by5pZ25vcmUgPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgdmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW0oIGVsZW0gKTtcbiAgaWYgKCBpdGVtICkge1xuICAgIGl0ZW0uaXNJZ25vcmVkID0gdHJ1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiByZXR1cm4gaXRlbSB0byBsYXlvdXQgY29sbGVjdGlvblxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKi9cbnByb3RvLnVuaWdub3JlID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIHZhciBpdGVtID0gdGhpcy5nZXRJdGVtKCBlbGVtICk7XG4gIGlmICggaXRlbSApIHtcbiAgICBkZWxldGUgaXRlbS5pc0lnbm9yZWQ7XG4gIH1cbn07XG5cbi8qKlxuICogYWRkcyBlbGVtZW50cyB0byBzdGFtcHNcbiAqIEBwYXJhbSB7Tm9kZUxpc3QsIEFycmF5LCBFbGVtZW50LCBvciBTdHJpbmd9IGVsZW1zXG4gKi9cbnByb3RvLnN0YW1wID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICBlbGVtcyA9IHRoaXMuX2ZpbmQoIGVsZW1zICk7XG4gIGlmICggIWVsZW1zICkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuc3RhbXBzID0gdGhpcy5zdGFtcHMuY29uY2F0KCBlbGVtcyApO1xuICAvLyBpZ25vcmVcbiAgZWxlbXMuZm9yRWFjaCggdGhpcy5pZ25vcmUsIHRoaXMgKTtcbn07XG5cbi8qKlxuICogcmVtb3ZlcyBlbGVtZW50cyB0byBzdGFtcHNcbiAqIEBwYXJhbSB7Tm9kZUxpc3QsIEFycmF5LCBvciBFbGVtZW50fSBlbGVtc1xuICovXG5wcm90by51bnN0YW1wID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICBlbGVtcyA9IHRoaXMuX2ZpbmQoIGVsZW1zICk7XG4gIGlmICggIWVsZW1zICl7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgLy8gZmlsdGVyIG91dCByZW1vdmVkIHN0YW1wIGVsZW1lbnRzXG4gICAgdXRpbHMucmVtb3ZlRnJvbSggdGhpcy5zdGFtcHMsIGVsZW0gKTtcbiAgICB0aGlzLnVuaWdub3JlKCBlbGVtICk7XG4gIH0sIHRoaXMgKTtcbn07XG5cbi8qKlxuICogZmluZHMgY2hpbGQgZWxlbWVudHNcbiAqIEBwYXJhbSB7Tm9kZUxpc3QsIEFycmF5LCBFbGVtZW50LCBvciBTdHJpbmd9IGVsZW1zXG4gKiBAcmV0dXJucyB7QXJyYXl9IGVsZW1zXG4gKi9cbnByb3RvLl9maW5kID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICBpZiAoICFlbGVtcyApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gaWYgc3RyaW5nLCB1c2UgYXJndW1lbnQgYXMgc2VsZWN0b3Igc3RyaW5nXG4gIGlmICggdHlwZW9mIGVsZW1zID09ICdzdHJpbmcnICkge1xuICAgIGVsZW1zID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIGVsZW1zICk7XG4gIH1cbiAgZWxlbXMgPSB1dGlscy5tYWtlQXJyYXkoIGVsZW1zICk7XG4gIHJldHVybiBlbGVtcztcbn07XG5cbnByb3RvLl9tYW5hZ2VTdGFtcHMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCAhdGhpcy5zdGFtcHMgfHwgIXRoaXMuc3RhbXBzLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB0aGlzLl9nZXRCb3VuZGluZ1JlY3QoKTtcblxuICB0aGlzLnN0YW1wcy5mb3JFYWNoKCB0aGlzLl9tYW5hZ2VTdGFtcCwgdGhpcyApO1xufTtcblxuLy8gdXBkYXRlIGJvdW5kaW5nTGVmdCAvIFRvcFxucHJvdG8uX2dldEJvdW5kaW5nUmVjdCA9IGZ1bmN0aW9uKCkge1xuICAvLyBnZXQgYm91bmRpbmcgcmVjdCBmb3IgY29udGFpbmVyIGVsZW1lbnRcbiAgdmFyIGJvdW5kaW5nUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gIHRoaXMuX2JvdW5kaW5nUmVjdCA9IHtcbiAgICBsZWZ0OiBib3VuZGluZ1JlY3QubGVmdCArIHNpemUucGFkZGluZ0xlZnQgKyBzaXplLmJvcmRlckxlZnRXaWR0aCxcbiAgICB0b3A6IGJvdW5kaW5nUmVjdC50b3AgKyBzaXplLnBhZGRpbmdUb3AgKyBzaXplLmJvcmRlclRvcFdpZHRoLFxuICAgIHJpZ2h0OiBib3VuZGluZ1JlY3QucmlnaHQgLSAoIHNpemUucGFkZGluZ1JpZ2h0ICsgc2l6ZS5ib3JkZXJSaWdodFdpZHRoICksXG4gICAgYm90dG9tOiBib3VuZGluZ1JlY3QuYm90dG9tIC0gKCBzaXplLnBhZGRpbmdCb3R0b20gKyBzaXplLmJvcmRlckJvdHRvbVdpZHRoIClcbiAgfTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtFbGVtZW50fSBzdGFtcFxuKiovXG5wcm90by5fbWFuYWdlU3RhbXAgPSBub29wO1xuXG4vKipcbiAqIGdldCB4L3kgcG9zaXRpb24gb2YgZWxlbWVudCByZWxhdGl2ZSB0byBjb250YWluZXIgZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBvZmZzZXQgLSBoYXMgbGVmdCwgdG9wLCByaWdodCwgYm90dG9tXG4gKi9cbnByb3RvLl9nZXRFbGVtZW50T2Zmc2V0ID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIHZhciBib3VuZGluZ1JlY3QgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB2YXIgdGhpc1JlY3QgPSB0aGlzLl9ib3VuZGluZ1JlY3Q7XG4gIHZhciBzaXplID0gZ2V0U2l6ZSggZWxlbSApO1xuICB2YXIgb2Zmc2V0ID0ge1xuICAgIGxlZnQ6IGJvdW5kaW5nUmVjdC5sZWZ0IC0gdGhpc1JlY3QubGVmdCAtIHNpemUubWFyZ2luTGVmdCxcbiAgICB0b3A6IGJvdW5kaW5nUmVjdC50b3AgLSB0aGlzUmVjdC50b3AgLSBzaXplLm1hcmdpblRvcCxcbiAgICByaWdodDogdGhpc1JlY3QucmlnaHQgLSBib3VuZGluZ1JlY3QucmlnaHQgLSBzaXplLm1hcmdpblJpZ2h0LFxuICAgIGJvdHRvbTogdGhpc1JlY3QuYm90dG9tIC0gYm91bmRpbmdSZWN0LmJvdHRvbSAtIHNpemUubWFyZ2luQm90dG9tXG4gIH07XG4gIHJldHVybiBvZmZzZXQ7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSByZXNpemUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuLy8gZW5hYmxlIGV2ZW50IGhhbmRsZXJzIGZvciBsaXN0ZW5lcnNcbi8vIGkuZS4gcmVzaXplIC0+IG9ucmVzaXplXG5wcm90by5oYW5kbGVFdmVudCA9IHV0aWxzLmhhbmRsZUV2ZW50O1xuXG4vKipcbiAqIEJpbmQgbGF5b3V0IHRvIHdpbmRvdyByZXNpemluZ1xuICovXG5wcm90by5iaW5kUmVzaXplID0gZnVuY3Rpb24oKSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgdGhpcyApO1xuICB0aGlzLmlzUmVzaXplQm91bmQgPSB0cnVlO1xufTtcblxuLyoqXG4gKiBVbmJpbmQgbGF5b3V0IHRvIHdpbmRvdyByZXNpemluZ1xuICovXG5wcm90by51bmJpbmRSZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCB0aGlzICk7XG4gIHRoaXMuaXNSZXNpemVCb3VuZCA9IGZhbHNlO1xufTtcblxucHJvdG8ub25yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yZXNpemUoKTtcbn07XG5cbnV0aWxzLmRlYm91bmNlTWV0aG9kKCBPdXRsYXllciwgJ29ucmVzaXplJywgMTAwICk7XG5cbnByb3RvLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAvLyBkb24ndCB0cmlnZ2VyIGlmIHNpemUgZGlkIG5vdCBjaGFuZ2VcbiAgLy8gb3IgaWYgcmVzaXplIHdhcyB1bmJvdW5kLiBTZWUgIzlcbiAgaWYgKCAhdGhpcy5pc1Jlc2l6ZUJvdW5kIHx8ICF0aGlzLm5lZWRzUmVzaXplTGF5b3V0KCkgKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5sYXlvdXQoKTtcbn07XG5cbi8qKlxuICogY2hlY2sgaWYgbGF5b3V0IGlzIG5lZWRlZCBwb3N0IGxheW91dFxuICogQHJldHVybnMgQm9vbGVhblxuICovXG5wcm90by5uZWVkc1Jlc2l6ZUxheW91dCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc2l6ZSA9IGdldFNpemUoIHRoaXMuZWxlbWVudCApO1xuICAvLyBjaGVjayB0aGF0IHRoaXMuc2l6ZSBhbmQgc2l6ZSBhcmUgdGhlcmVcbiAgLy8gSUU4IHRyaWdnZXJzIHJlc2l6ZSBvbiBib2R5IHNpemUgY2hhbmdlLCBzbyB0aGV5IG1pZ2h0IG5vdCBiZVxuICB2YXIgaGFzU2l6ZXMgPSB0aGlzLnNpemUgJiYgc2l6ZTtcbiAgcmV0dXJuIGhhc1NpemVzICYmIHNpemUuaW5uZXJXaWR0aCAhPT0gdGhpcy5zaXplLmlubmVyV2lkdGg7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogYWRkIGl0ZW1zIHRvIE91dGxheWVyIGluc3RhbmNlXG4gKiBAcGFyYW0ge0FycmF5IG9yIE5vZGVMaXN0IG9yIEVsZW1lbnR9IGVsZW1zXG4gKiBAcmV0dXJucyB7QXJyYXl9IGl0ZW1zIC0gT3V0bGF5ZXIuSXRlbXNcbioqL1xucHJvdG8uYWRkSXRlbXMgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHZhciBpdGVtcyA9IHRoaXMuX2l0ZW1pemUoIGVsZW1zICk7XG4gIC8vIGFkZCBpdGVtcyB0byBjb2xsZWN0aW9uXG4gIGlmICggaXRlbXMubGVuZ3RoICkge1xuICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zLmNvbmNhdCggaXRlbXMgKTtcbiAgfVxuICByZXR1cm4gaXRlbXM7XG59O1xuXG4vKipcbiAqIExheW91dCBuZXdseS1hcHBlbmRlZCBpdGVtIGVsZW1lbnRzXG4gKiBAcGFyYW0ge0FycmF5IG9yIE5vZGVMaXN0IG9yIEVsZW1lbnR9IGVsZW1zXG4gKi9cbnByb3RvLmFwcGVuZGVkID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICB2YXIgaXRlbXMgPSB0aGlzLmFkZEl0ZW1zKCBlbGVtcyApO1xuICBpZiAoICFpdGVtcy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGxheW91dCBhbmQgcmV2ZWFsIGp1c3QgdGhlIG5ldyBpdGVtc1xuICB0aGlzLmxheW91dEl0ZW1zKCBpdGVtcywgdHJ1ZSApO1xuICB0aGlzLnJldmVhbCggaXRlbXMgKTtcbn07XG5cbi8qKlxuICogTGF5b3V0IHByZXBlbmRlZCBlbGVtZW50c1xuICogQHBhcmFtIHtBcnJheSBvciBOb2RlTGlzdCBvciBFbGVtZW50fSBlbGVtc1xuICovXG5wcm90by5wcmVwZW5kZWQgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHZhciBpdGVtcyA9IHRoaXMuX2l0ZW1pemUoIGVsZW1zICk7XG4gIGlmICggIWl0ZW1zLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gYWRkIGl0ZW1zIHRvIGJlZ2lubmluZyBvZiBjb2xsZWN0aW9uXG4gIHZhciBwcmV2aW91c0l0ZW1zID0gdGhpcy5pdGVtcy5zbGljZSgwKTtcbiAgdGhpcy5pdGVtcyA9IGl0ZW1zLmNvbmNhdCggcHJldmlvdXNJdGVtcyApO1xuICAvLyBzdGFydCBuZXcgbGF5b3V0XG4gIHRoaXMuX3Jlc2V0TGF5b3V0KCk7XG4gIHRoaXMuX21hbmFnZVN0YW1wcygpO1xuICAvLyBsYXlvdXQgbmV3IHN0dWZmIHdpdGhvdXQgdHJhbnNpdGlvblxuICB0aGlzLmxheW91dEl0ZW1zKCBpdGVtcywgdHJ1ZSApO1xuICB0aGlzLnJldmVhbCggaXRlbXMgKTtcbiAgLy8gbGF5b3V0IHByZXZpb3VzIGl0ZW1zXG4gIHRoaXMubGF5b3V0SXRlbXMoIHByZXZpb3VzSXRlbXMgKTtcbn07XG5cbi8qKlxuICogcmV2ZWFsIGEgY29sbGVjdGlvbiBvZiBpdGVtc1xuICogQHBhcmFtIHtBcnJheSBvZiBPdXRsYXllci5JdGVtc30gaXRlbXNcbiAqL1xucHJvdG8ucmV2ZWFsID0gZnVuY3Rpb24oIGl0ZW1zICkge1xuICB0aGlzLl9lbWl0Q29tcGxldGVPbkl0ZW1zKCAncmV2ZWFsJywgaXRlbXMgKTtcbiAgaWYgKCAhaXRlbXMgfHwgIWl0ZW1zLmxlbmd0aCApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHN0YWdnZXIgPSB0aGlzLnVwZGF0ZVN0YWdnZXIoKTtcbiAgaXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0sIGkgKSB7XG4gICAgaXRlbS5zdGFnZ2VyKCBpICogc3RhZ2dlciApO1xuICAgIGl0ZW0ucmV2ZWFsKCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBoaWRlIGEgY29sbGVjdGlvbiBvZiBpdGVtc1xuICogQHBhcmFtIHtBcnJheSBvZiBPdXRsYXllci5JdGVtc30gaXRlbXNcbiAqL1xucHJvdG8uaGlkZSA9IGZ1bmN0aW9uKCBpdGVtcyApIHtcbiAgdGhpcy5fZW1pdENvbXBsZXRlT25JdGVtcyggJ2hpZGUnLCBpdGVtcyApO1xuICBpZiAoICFpdGVtcyB8fCAhaXRlbXMubGVuZ3RoICkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgc3RhZ2dlciA9IHRoaXMudXBkYXRlU3RhZ2dlcigpO1xuICBpdGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggaXRlbSwgaSApIHtcbiAgICBpdGVtLnN0YWdnZXIoIGkgKiBzdGFnZ2VyICk7XG4gICAgaXRlbS5oaWRlKCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiByZXZlYWwgaXRlbSBlbGVtZW50c1xuICogQHBhcmFtIHtBcnJheX0sIHtFbGVtZW50fSwge05vZGVMaXN0fSBpdGVtc1xuICovXG5wcm90by5yZXZlYWxJdGVtRWxlbWVudHMgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIHZhciBpdGVtcyA9IHRoaXMuZ2V0SXRlbXMoIGVsZW1zICk7XG4gIHRoaXMucmV2ZWFsKCBpdGVtcyApO1xufTtcblxuLyoqXG4gKiBoaWRlIGl0ZW0gZWxlbWVudHNcbiAqIEBwYXJhbSB7QXJyYXl9LCB7RWxlbWVudH0sIHtOb2RlTGlzdH0gaXRlbXNcbiAqL1xucHJvdG8uaGlkZUl0ZW1FbGVtZW50cyA9IGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgdmFyIGl0ZW1zID0gdGhpcy5nZXRJdGVtcyggZWxlbXMgKTtcbiAgdGhpcy5oaWRlKCBpdGVtcyApO1xufTtcblxuLyoqXG4gKiBnZXQgT3V0bGF5ZXIuSXRlbSwgZ2l2ZW4gYW4gRWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge091dGxheWVyLkl0ZW19IGl0ZW1cbiAqL1xucHJvdG8uZ2V0SXRlbSA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICAvLyBsb29wIHRocm91Z2ggaXRlbXMgdG8gZ2V0IHRoZSBvbmUgdGhhdCBtYXRjaGVzXG4gIGZvciAoIHZhciBpPTA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpXTtcbiAgICBpZiAoIGl0ZW0uZWxlbWVudCA9PSBlbGVtICkge1xuICAgICAgLy8gcmV0dXJuIGl0ZW1cbiAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBnZXQgY29sbGVjdGlvbiBvZiBPdXRsYXllci5JdGVtcywgZ2l2ZW4gRWxlbWVudHNcbiAqIEBwYXJhbSB7QXJyYXl9IGVsZW1zXG4gKiBAcmV0dXJucyB7QXJyYXl9IGl0ZW1zIC0gT3V0bGF5ZXIuSXRlbXNcbiAqL1xucHJvdG8uZ2V0SXRlbXMgPSBmdW5jdGlvbiggZWxlbXMgKSB7XG4gIGVsZW1zID0gdXRpbHMubWFrZUFycmF5KCBlbGVtcyApO1xuICB2YXIgaXRlbXMgPSBbXTtcbiAgZWxlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLmdldEl0ZW0oIGVsZW0gKTtcbiAgICBpZiAoIGl0ZW0gKSB7XG4gICAgICBpdGVtcy5wdXNoKCBpdGVtICk7XG4gICAgfVxuICB9LCB0aGlzICk7XG5cbiAgcmV0dXJuIGl0ZW1zO1xufTtcblxuLyoqXG4gKiByZW1vdmUgZWxlbWVudChzKSBmcm9tIGluc3RhbmNlIGFuZCBET01cbiAqIEBwYXJhbSB7QXJyYXkgb3IgTm9kZUxpc3Qgb3IgRWxlbWVudH0gZWxlbXNcbiAqL1xucHJvdG8ucmVtb3ZlID0gZnVuY3Rpb24oIGVsZW1zICkge1xuICB2YXIgcmVtb3ZlSXRlbXMgPSB0aGlzLmdldEl0ZW1zKCBlbGVtcyApO1xuXG4gIHRoaXMuX2VtaXRDb21wbGV0ZU9uSXRlbXMoICdyZW1vdmUnLCByZW1vdmVJdGVtcyApO1xuXG4gIC8vIGJhaWwgaWYgbm8gaXRlbXMgdG8gcmVtb3ZlXG4gIGlmICggIXJlbW92ZUl0ZW1zIHx8ICFyZW1vdmVJdGVtcy5sZW5ndGggKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmVtb3ZlSXRlbXMuZm9yRWFjaCggZnVuY3Rpb24oIGl0ZW0gKSB7XG4gICAgaXRlbS5yZW1vdmUoKTtcbiAgICAvLyByZW1vdmUgaXRlbSBmcm9tIGNvbGxlY3Rpb25cbiAgICB1dGlscy5yZW1vdmVGcm9tKCB0aGlzLml0ZW1zLCBpdGVtICk7XG4gIH0sIHRoaXMgKTtcbn07XG5cbi8vIC0tLS0tIGRlc3Ryb3kgLS0tLS0gLy9cblxuLy8gcmVtb3ZlIGFuZCBkaXNhYmxlIE91dGxheWVyIGluc3RhbmNlXG5wcm90by5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIC8vIGNsZWFuIHVwIGR5bmFtaWMgc3R5bGVzXG4gIHZhciBzdHlsZSA9IHRoaXMuZWxlbWVudC5zdHlsZTtcbiAgc3R5bGUuaGVpZ2h0ID0gJyc7XG4gIHN0eWxlLnBvc2l0aW9uID0gJyc7XG4gIHN0eWxlLndpZHRoID0gJyc7XG4gIC8vIGRlc3Ryb3kgaXRlbXNcbiAgdGhpcy5pdGVtcy5mb3JFYWNoKCBmdW5jdGlvbiggaXRlbSApIHtcbiAgICBpdGVtLmRlc3Ryb3koKTtcbiAgfSk7XG5cbiAgdGhpcy51bmJpbmRSZXNpemUoKTtcblxuICB2YXIgaWQgPSB0aGlzLmVsZW1lbnQub3V0bGF5ZXJHVUlEO1xuICBkZWxldGUgaW5zdGFuY2VzWyBpZCBdOyAvLyByZW1vdmUgcmVmZXJlbmNlIHRvIGluc3RhbmNlIGJ5IGlkXG4gIGRlbGV0ZSB0aGlzLmVsZW1lbnQub3V0bGF5ZXJHVUlEO1xuICAvLyByZW1vdmUgZGF0YSBmb3IgalF1ZXJ5XG4gIGlmICggalF1ZXJ5ICkge1xuICAgIGpRdWVyeS5yZW1vdmVEYXRhKCB0aGlzLmVsZW1lbnQsIHRoaXMuY29uc3RydWN0b3IubmFtZXNwYWNlICk7XG4gIH1cblxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGF0YSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4vKipcbiAqIGdldCBPdXRsYXllciBpbnN0YW5jZSBmcm9tIGVsZW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbVxuICogQHJldHVybnMge091dGxheWVyfVxuICovXG5PdXRsYXllci5kYXRhID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gIGVsZW0gPSB1dGlscy5nZXRRdWVyeUVsZW1lbnQoIGVsZW0gKTtcbiAgdmFyIGlkID0gZWxlbSAmJiBlbGVtLm91dGxheWVyR1VJRDtcbiAgcmV0dXJuIGlkICYmIGluc3RhbmNlc1sgaWQgXTtcbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gY3JlYXRlIE91dGxheWVyIGNsYXNzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbi8qKlxuICogY3JlYXRlIGEgbGF5b3V0IGNsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKi9cbk91dGxheWVyLmNyZWF0ZSA9IGZ1bmN0aW9uKCBuYW1lc3BhY2UsIG9wdGlvbnMgKSB7XG4gIC8vIHN1Yi1jbGFzcyBPdXRsYXllclxuICB2YXIgTGF5b3V0ID0gc3ViY2xhc3MoIE91dGxheWVyICk7XG4gIC8vIGFwcGx5IG5ldyBvcHRpb25zIGFuZCBjb21wYXRPcHRpb25zXG4gIExheW91dC5kZWZhdWx0cyA9IHV0aWxzLmV4dGVuZCgge30sIE91dGxheWVyLmRlZmF1bHRzICk7XG4gIHV0aWxzLmV4dGVuZCggTGF5b3V0LmRlZmF1bHRzLCBvcHRpb25zICk7XG4gIExheW91dC5jb21wYXRPcHRpb25zID0gdXRpbHMuZXh0ZW5kKCB7fSwgT3V0bGF5ZXIuY29tcGF0T3B0aW9ucyAgKTtcblxuICBMYXlvdXQubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuXG4gIExheW91dC5kYXRhID0gT3V0bGF5ZXIuZGF0YTtcblxuICAvLyBzdWItY2xhc3MgSXRlbVxuICBMYXlvdXQuSXRlbSA9IHN1YmNsYXNzKCBJdGVtICk7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGVjbGFyYXRpdmUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICB1dGlscy5odG1sSW5pdCggTGF5b3V0LCBuYW1lc3BhY2UgKTtcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBqUXVlcnkgYnJpZGdlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLy8gbWFrZSBpbnRvIGpRdWVyeSBwbHVnaW5cbiAgaWYgKCBqUXVlcnkgJiYgalF1ZXJ5LmJyaWRnZXQgKSB7XG4gICAgalF1ZXJ5LmJyaWRnZXQoIG5hbWVzcGFjZSwgTGF5b3V0ICk7XG4gIH1cblxuICByZXR1cm4gTGF5b3V0O1xufTtcblxuZnVuY3Rpb24gc3ViY2xhc3MoIFBhcmVudCApIHtcbiAgZnVuY3Rpb24gU3ViQ2xhc3MoKSB7XG4gICAgUGFyZW50LmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgfVxuXG4gIFN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFBhcmVudC5wcm90b3R5cGUgKTtcbiAgU3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ViQ2xhc3M7XG5cbiAgcmV0dXJuIFN1YkNsYXNzO1xufVxuXG4vLyAtLS0tLSBoZWxwZXJzIC0tLS0tIC8vXG5cbi8vIGhvdyBtYW55IG1pbGxpc2Vjb25kcyBhcmUgaW4gZWFjaCB1bml0XG52YXIgbXNVbml0cyA9IHtcbiAgbXM6IDEsXG4gIHM6IDEwMDBcbn07XG5cbi8vIG11bmdlIHRpbWUtbGlrZSBwYXJhbWV0ZXIgaW50byBtaWxsaXNlY29uZCBudW1iZXJcbi8vICcwLjRzJyAtPiA0MFxuZnVuY3Rpb24gZ2V0TWlsbGlzZWNvbmRzKCB0aW1lICkge1xuICBpZiAoIHR5cGVvZiB0aW1lID09ICdudW1iZXInICkge1xuICAgIHJldHVybiB0aW1lO1xuICB9XG4gIHZhciBtYXRjaGVzID0gdGltZS5tYXRjaCggLyheXFxkKlxcLj9cXGQqKShcXHcqKS8gKTtcbiAgdmFyIG51bSA9IG1hdGNoZXMgJiYgbWF0Y2hlc1sxXTtcbiAgdmFyIHVuaXQgPSBtYXRjaGVzICYmIG1hdGNoZXNbMl07XG4gIGlmICggIW51bS5sZW5ndGggKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgbnVtID0gcGFyc2VGbG9hdCggbnVtICk7XG4gIHZhciBtdWx0ID0gbXNVbml0c1sgdW5pdCBdIHx8IDE7XG4gIHJldHVybiBudW0gKiBtdWx0O1xufVxuXG4vLyAtLS0tLSBmaW4gLS0tLS0gLy9cblxuLy8gYmFjayBpbiBnbG9iYWxcbk91dGxheWVyLkl0ZW0gPSBJdGVtO1xuXG5yZXR1cm4gT3V0bGF5ZXI7XG5cbn0pKTtcbiIsIi8qIVxuICogTWFzb25yeSB2NC4yLjJcbiAqIENhc2NhZGluZyBncmlkIGxheW91dCBsaWJyYXJ5XG4gKiBodHRwczovL21hc29ucnkuZGVzYW5kcm8uY29tXG4gKiBNSVQgTGljZW5zZVxuICogYnkgRGF2aWQgRGVTYW5kcm9cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csIGZhY3RvcnkgKSB7XG4gIC8vIHVuaXZlcnNhbCBtb2R1bGUgZGVmaW5pdGlvblxuICAvKiBqc2hpbnQgc3RyaWN0OiBmYWxzZSAqLyAvKmdsb2JhbHMgZGVmaW5lLCBtb2R1bGUsIHJlcXVpcmUgKi9cbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcbiAgICAvLyBBTURcbiAgICBkZWZpbmUoIFtcbiAgICAgICAgJ291dGxheWVyL291dGxheWVyJyxcbiAgICAgICAgJ2dldC1zaXplL2dldC1zaXplJ1xuICAgICAgXSxcbiAgICAgIGZhY3RvcnkgKTtcbiAgfSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyApIHtcbiAgICAvLyBDb21tb25KU1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShcbiAgICAgIHJlcXVpcmUoJ291dGxheWVyJyksXG4gICAgICByZXF1aXJlKCdnZXQtc2l6ZScpXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBicm93c2VyIGdsb2JhbFxuICAgIHdpbmRvdy5NYXNvbnJ5ID0gZmFjdG9yeShcbiAgICAgIHdpbmRvdy5PdXRsYXllcixcbiAgICAgIHdpbmRvdy5nZXRTaXplXG4gICAgKTtcbiAgfVxuXG59KCB3aW5kb3csIGZ1bmN0aW9uIGZhY3RvcnkoIE91dGxheWVyLCBnZXRTaXplICkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG1hc29ucnlEZWZpbml0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgLy8gY3JlYXRlIGFuIE91dGxheWVyIGxheW91dCBjbGFzc1xuICB2YXIgTWFzb25yeSA9IE91dGxheWVyLmNyZWF0ZSgnbWFzb25yeScpO1xuICAvLyBpc0ZpdFdpZHRoIC0+IGZpdFdpZHRoXG4gIE1hc29ucnkuY29tcGF0T3B0aW9ucy5maXRXaWR0aCA9ICdpc0ZpdFdpZHRoJztcblxuICB2YXIgcHJvdG8gPSBNYXNvbnJ5LnByb3RvdHlwZTtcblxuICBwcm90by5fcmVzZXRMYXlvdXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmdldFNpemUoKTtcbiAgICB0aGlzLl9nZXRNZWFzdXJlbWVudCggJ2NvbHVtbldpZHRoJywgJ291dGVyV2lkdGgnICk7XG4gICAgdGhpcy5fZ2V0TWVhc3VyZW1lbnQoICdndXR0ZXInLCAnb3V0ZXJXaWR0aCcgKTtcbiAgICB0aGlzLm1lYXN1cmVDb2x1bW5zKCk7XG5cbiAgICAvLyByZXNldCBjb2x1bW4gWVxuICAgIHRoaXMuY29sWXMgPSBbXTtcbiAgICBmb3IgKCB2YXIgaT0wOyBpIDwgdGhpcy5jb2xzOyBpKysgKSB7XG4gICAgICB0aGlzLmNvbFlzLnB1c2goIDAgKTtcbiAgICB9XG5cbiAgICB0aGlzLm1heFkgPSAwO1xuICAgIHRoaXMuaG9yaXpvbnRhbENvbEluZGV4ID0gMDtcbiAgfTtcblxuICBwcm90by5tZWFzdXJlQ29sdW1ucyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZ2V0Q29udGFpbmVyV2lkdGgoKTtcbiAgICAvLyBpZiBjb2x1bW5XaWR0aCBpcyAwLCBkZWZhdWx0IHRvIG91dGVyV2lkdGggb2YgZmlyc3QgaXRlbVxuICAgIGlmICggIXRoaXMuY29sdW1uV2lkdGggKSB7XG4gICAgICB2YXIgZmlyc3RJdGVtID0gdGhpcy5pdGVtc1swXTtcbiAgICAgIHZhciBmaXJzdEl0ZW1FbGVtID0gZmlyc3RJdGVtICYmIGZpcnN0SXRlbS5lbGVtZW50O1xuICAgICAgLy8gY29sdW1uV2lkdGggZmFsbCBiYWNrIHRvIGl0ZW0gb2YgZmlyc3QgZWxlbWVudFxuICAgICAgdGhpcy5jb2x1bW5XaWR0aCA9IGZpcnN0SXRlbUVsZW0gJiYgZ2V0U2l6ZSggZmlyc3RJdGVtRWxlbSApLm91dGVyV2lkdGggfHxcbiAgICAgICAgLy8gaWYgZmlyc3QgZWxlbSBoYXMgbm8gd2lkdGgsIGRlZmF1bHQgdG8gc2l6ZSBvZiBjb250YWluZXJcbiAgICAgICAgdGhpcy5jb250YWluZXJXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgY29sdW1uV2lkdGggPSB0aGlzLmNvbHVtbldpZHRoICs9IHRoaXMuZ3V0dGVyO1xuXG4gICAgLy8gY2FsY3VsYXRlIGNvbHVtbnNcbiAgICB2YXIgY29udGFpbmVyV2lkdGggPSB0aGlzLmNvbnRhaW5lcldpZHRoICsgdGhpcy5ndXR0ZXI7XG4gICAgdmFyIGNvbHMgPSBjb250YWluZXJXaWR0aCAvIGNvbHVtbldpZHRoO1xuICAgIC8vIGZpeCByb3VuZGluZyBlcnJvcnMsIHR5cGljYWxseSB3aXRoIGd1dHRlcnNcbiAgICB2YXIgZXhjZXNzID0gY29sdW1uV2lkdGggLSBjb250YWluZXJXaWR0aCAlIGNvbHVtbldpZHRoO1xuICAgIC8vIGlmIG92ZXJzaG9vdCBpcyBsZXNzIHRoYW4gYSBwaXhlbCwgcm91bmQgdXAsIG90aGVyd2lzZSBmbG9vciBpdFxuICAgIHZhciBtYXRoTWV0aG9kID0gZXhjZXNzICYmIGV4Y2VzcyA8IDEgPyAncm91bmQnIDogJ2Zsb29yJztcbiAgICBjb2xzID0gTWF0aFsgbWF0aE1ldGhvZCBdKCBjb2xzICk7XG4gICAgdGhpcy5jb2xzID0gTWF0aC5tYXgoIGNvbHMsIDEgKTtcbiAgfTtcblxuICBwcm90by5nZXRDb250YWluZXJXaWR0aCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNvbnRhaW5lciBpcyBwYXJlbnQgaWYgZml0IHdpZHRoXG4gICAgdmFyIGlzRml0V2lkdGggPSB0aGlzLl9nZXRPcHRpb24oJ2ZpdFdpZHRoJyk7XG4gICAgdmFyIGNvbnRhaW5lciA9IGlzRml0V2lkdGggPyB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSA6IHRoaXMuZWxlbWVudDtcbiAgICAvLyBjaGVjayB0aGF0IHRoaXMuc2l6ZSBhbmQgc2l6ZSBhcmUgdGhlcmVcbiAgICAvLyBJRTggdHJpZ2dlcnMgcmVzaXplIG9uIGJvZHkgc2l6ZSBjaGFuZ2UsIHNvIHRoZXkgbWlnaHQgbm90IGJlXG4gICAgdmFyIHNpemUgPSBnZXRTaXplKCBjb250YWluZXIgKTtcbiAgICB0aGlzLmNvbnRhaW5lcldpZHRoID0gc2l6ZSAmJiBzaXplLmlubmVyV2lkdGg7XG4gIH07XG5cbiAgcHJvdG8uX2dldEl0ZW1MYXlvdXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCBpdGVtICkge1xuICAgIGl0ZW0uZ2V0U2l6ZSgpO1xuICAgIC8vIGhvdyBtYW55IGNvbHVtbnMgZG9lcyB0aGlzIGJyaWNrIHNwYW5cbiAgICB2YXIgcmVtYWluZGVyID0gaXRlbS5zaXplLm91dGVyV2lkdGggJSB0aGlzLmNvbHVtbldpZHRoO1xuICAgIHZhciBtYXRoTWV0aG9kID0gcmVtYWluZGVyICYmIHJlbWFpbmRlciA8IDEgPyAncm91bmQnIDogJ2NlaWwnO1xuICAgIC8vIHJvdW5kIGlmIG9mZiBieSAxIHBpeGVsLCBvdGhlcndpc2UgdXNlIGNlaWxcbiAgICB2YXIgY29sU3BhbiA9IE1hdGhbIG1hdGhNZXRob2QgXSggaXRlbS5zaXplLm91dGVyV2lkdGggLyB0aGlzLmNvbHVtbldpZHRoICk7XG4gICAgY29sU3BhbiA9IE1hdGgubWluKCBjb2xTcGFuLCB0aGlzLmNvbHMgKTtcbiAgICAvLyB1c2UgaG9yaXpvbnRhbCBvciB0b3AgY29sdW1uIHBvc2l0aW9uXG4gICAgdmFyIGNvbFBvc01ldGhvZCA9IHRoaXMub3B0aW9ucy5ob3Jpem9udGFsT3JkZXIgP1xuICAgICAgJ19nZXRIb3Jpem9udGFsQ29sUG9zaXRpb24nIDogJ19nZXRUb3BDb2xQb3NpdGlvbic7XG4gICAgdmFyIGNvbFBvc2l0aW9uID0gdGhpc1sgY29sUG9zTWV0aG9kIF0oIGNvbFNwYW4sIGl0ZW0gKTtcbiAgICAvLyBwb3NpdGlvbiB0aGUgYnJpY2tcbiAgICB2YXIgcG9zaXRpb24gPSB7XG4gICAgICB4OiB0aGlzLmNvbHVtbldpZHRoICogY29sUG9zaXRpb24uY29sLFxuICAgICAgeTogY29sUG9zaXRpb24ueVxuICAgIH07XG4gICAgLy8gYXBwbHkgc2V0SGVpZ2h0IHRvIG5lY2Vzc2FyeSBjb2x1bW5zXG4gICAgdmFyIHNldEhlaWdodCA9IGNvbFBvc2l0aW9uLnkgKyBpdGVtLnNpemUub3V0ZXJIZWlnaHQ7XG4gICAgdmFyIHNldE1heCA9IGNvbFNwYW4gKyBjb2xQb3NpdGlvbi5jb2w7XG4gICAgZm9yICggdmFyIGkgPSBjb2xQb3NpdGlvbi5jb2w7IGkgPCBzZXRNYXg7IGkrKyApIHtcbiAgICAgIHRoaXMuY29sWXNbaV0gPSBzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9O1xuXG4gIHByb3RvLl9nZXRUb3BDb2xQb3NpdGlvbiA9IGZ1bmN0aW9uKCBjb2xTcGFuICkge1xuICAgIHZhciBjb2xHcm91cCA9IHRoaXMuX2dldFRvcENvbEdyb3VwKCBjb2xTcGFuICk7XG4gICAgLy8gZ2V0IHRoZSBtaW5pbXVtIFkgdmFsdWUgZnJvbSB0aGUgY29sdW1uc1xuICAgIHZhciBtaW5pbXVtWSA9IE1hdGgubWluLmFwcGx5KCBNYXRoLCBjb2xHcm91cCApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbDogY29sR3JvdXAuaW5kZXhPZiggbWluaW11bVkgKSxcbiAgICAgIHk6IG1pbmltdW1ZLFxuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjb2xTcGFuIC0gbnVtYmVyIG9mIGNvbHVtbnMgdGhlIGVsZW1lbnQgc3BhbnNcbiAgICogQHJldHVybnMge0FycmF5fSBjb2xHcm91cFxuICAgKi9cbiAgcHJvdG8uX2dldFRvcENvbEdyb3VwID0gZnVuY3Rpb24oIGNvbFNwYW4gKSB7XG4gICAgaWYgKCBjb2xTcGFuIDwgMiApIHtcbiAgICAgIC8vIGlmIGJyaWNrIHNwYW5zIG9ubHkgb25lIGNvbHVtbiwgdXNlIGFsbCB0aGUgY29sdW1uIFlzXG4gICAgICByZXR1cm4gdGhpcy5jb2xZcztcbiAgICB9XG5cbiAgICB2YXIgY29sR3JvdXAgPSBbXTtcbiAgICAvLyBob3cgbWFueSBkaWZmZXJlbnQgcGxhY2VzIGNvdWxkIHRoaXMgYnJpY2sgZml0IGhvcml6b250YWxseVxuICAgIHZhciBncm91cENvdW50ID0gdGhpcy5jb2xzICsgMSAtIGNvbFNwYW47XG4gICAgLy8gZm9yIGVhY2ggZ3JvdXAgcG90ZW50aWFsIGhvcml6b250YWwgcG9zaXRpb25cbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBncm91cENvdW50OyBpKysgKSB7XG4gICAgICBjb2xHcm91cFtpXSA9IHRoaXMuX2dldENvbEdyb3VwWSggaSwgY29sU3BhbiApO1xuICAgIH1cbiAgICByZXR1cm4gY29sR3JvdXA7XG4gIH07XG5cbiAgcHJvdG8uX2dldENvbEdyb3VwWSA9IGZ1bmN0aW9uKCBjb2wsIGNvbFNwYW4gKSB7XG4gICAgaWYgKCBjb2xTcGFuIDwgMiApIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbFlzWyBjb2wgXTtcbiAgICB9XG4gICAgLy8gbWFrZSBhbiBhcnJheSBvZiBjb2xZIHZhbHVlcyBmb3IgdGhhdCBvbmUgZ3JvdXBcbiAgICB2YXIgZ3JvdXBDb2xZcyA9IHRoaXMuY29sWXMuc2xpY2UoIGNvbCwgY29sICsgY29sU3BhbiApO1xuICAgIC8vIGFuZCBnZXQgdGhlIG1heCB2YWx1ZSBvZiB0aGUgYXJyYXlcbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoIE1hdGgsIGdyb3VwQ29sWXMgKTtcbiAgfTtcblxuICAvLyBnZXQgY29sdW1uIHBvc2l0aW9uIGJhc2VkIG9uIGhvcml6b250YWwgaW5kZXguICM4NzNcbiAgcHJvdG8uX2dldEhvcml6b250YWxDb2xQb3NpdGlvbiA9IGZ1bmN0aW9uKCBjb2xTcGFuLCBpdGVtICkge1xuICAgIHZhciBjb2wgPSB0aGlzLmhvcml6b250YWxDb2xJbmRleCAlIHRoaXMuY29scztcbiAgICB2YXIgaXNPdmVyID0gY29sU3BhbiA+IDEgJiYgY29sICsgY29sU3BhbiA+IHRoaXMuY29scztcbiAgICAvLyBzaGlmdCB0byBuZXh0IHJvdyBpZiBpdGVtIGNhbid0IGZpdCBvbiBjdXJyZW50IHJvd1xuICAgIGNvbCA9IGlzT3ZlciA/IDAgOiBjb2w7XG4gICAgLy8gZG9uJ3QgbGV0IHplcm8tc2l6ZSBpdGVtcyB0YWtlIHVwIHNwYWNlXG4gICAgdmFyIGhhc1NpemUgPSBpdGVtLnNpemUub3V0ZXJXaWR0aCAmJiBpdGVtLnNpemUub3V0ZXJIZWlnaHQ7XG4gICAgdGhpcy5ob3Jpem9udGFsQ29sSW5kZXggPSBoYXNTaXplID8gY29sICsgY29sU3BhbiA6IHRoaXMuaG9yaXpvbnRhbENvbEluZGV4O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbDogY29sLFxuICAgICAgeTogdGhpcy5fZ2V0Q29sR3JvdXBZKCBjb2wsIGNvbFNwYW4gKSxcbiAgICB9O1xuICB9O1xuXG4gIHByb3RvLl9tYW5hZ2VTdGFtcCA9IGZ1bmN0aW9uKCBzdGFtcCApIHtcbiAgICB2YXIgc3RhbXBTaXplID0gZ2V0U2l6ZSggc3RhbXAgKTtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fZ2V0RWxlbWVudE9mZnNldCggc3RhbXAgKTtcbiAgICAvLyBnZXQgdGhlIGNvbHVtbnMgdGhhdCB0aGlzIHN0YW1wIGFmZmVjdHNcbiAgICB2YXIgaXNPcmlnaW5MZWZ0ID0gdGhpcy5fZ2V0T3B0aW9uKCdvcmlnaW5MZWZ0Jyk7XG4gICAgdmFyIGZpcnN0WCA9IGlzT3JpZ2luTGVmdCA/IG9mZnNldC5sZWZ0IDogb2Zmc2V0LnJpZ2h0O1xuICAgIHZhciBsYXN0WCA9IGZpcnN0WCArIHN0YW1wU2l6ZS5vdXRlcldpZHRoO1xuICAgIHZhciBmaXJzdENvbCA9IE1hdGguZmxvb3IoIGZpcnN0WCAvIHRoaXMuY29sdW1uV2lkdGggKTtcbiAgICBmaXJzdENvbCA9IE1hdGgubWF4KCAwLCBmaXJzdENvbCApO1xuICAgIHZhciBsYXN0Q29sID0gTWF0aC5mbG9vciggbGFzdFggLyB0aGlzLmNvbHVtbldpZHRoICk7XG4gICAgLy8gbGFzdENvbCBzaG91bGQgbm90IGdvIG92ZXIgaWYgbXVsdGlwbGUgb2YgY29sdW1uV2lkdGggIzQyNVxuICAgIGxhc3RDb2wgLT0gbGFzdFggJSB0aGlzLmNvbHVtbldpZHRoID8gMCA6IDE7XG4gICAgbGFzdENvbCA9IE1hdGgubWluKCB0aGlzLmNvbHMgLSAxLCBsYXN0Q29sICk7XG4gICAgLy8gc2V0IGNvbFlzIHRvIGJvdHRvbSBvZiB0aGUgc3RhbXBcblxuICAgIHZhciBpc09yaWdpblRvcCA9IHRoaXMuX2dldE9wdGlvbignb3JpZ2luVG9wJyk7XG4gICAgdmFyIHN0YW1wTWF4WSA9ICggaXNPcmlnaW5Ub3AgPyBvZmZzZXQudG9wIDogb2Zmc2V0LmJvdHRvbSApICtcbiAgICAgIHN0YW1wU2l6ZS5vdXRlckhlaWdodDtcbiAgICBmb3IgKCB2YXIgaSA9IGZpcnN0Q29sOyBpIDw9IGxhc3RDb2w7IGkrKyApIHtcbiAgICAgIHRoaXMuY29sWXNbaV0gPSBNYXRoLm1heCggc3RhbXBNYXhZLCB0aGlzLmNvbFlzW2ldICk7XG4gICAgfVxuICB9O1xuXG4gIHByb3RvLl9nZXRDb250YWluZXJTaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tYXhZID0gTWF0aC5tYXguYXBwbHkoIE1hdGgsIHRoaXMuY29sWXMgKTtcbiAgICB2YXIgc2l6ZSA9IHtcbiAgICAgIGhlaWdodDogdGhpcy5tYXhZXG4gICAgfTtcblxuICAgIGlmICggdGhpcy5fZ2V0T3B0aW9uKCdmaXRXaWR0aCcpICkge1xuICAgICAgc2l6ZS53aWR0aCA9IHRoaXMuX2dldENvbnRhaW5lckZpdFdpZHRoKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNpemU7XG4gIH07XG5cbiAgcHJvdG8uX2dldENvbnRhaW5lckZpdFdpZHRoID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVudXNlZENvbHMgPSAwO1xuICAgIC8vIGNvdW50IHVudXNlZCBjb2x1bW5zXG4gICAgdmFyIGkgPSB0aGlzLmNvbHM7XG4gICAgd2hpbGUgKCAtLWkgKSB7XG4gICAgICBpZiAoIHRoaXMuY29sWXNbaV0gIT09IDAgKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdW51c2VkQ29scysrO1xuICAgIH1cbiAgICAvLyBmaXQgY29udGFpbmVyIHRvIGNvbHVtbnMgdGhhdCBoYXZlIGJlZW4gdXNlZFxuICAgIHJldHVybiAoIHRoaXMuY29scyAtIHVudXNlZENvbHMgKSAqIHRoaXMuY29sdW1uV2lkdGggLSB0aGlzLmd1dHRlcjtcbiAgfTtcblxuICBwcm90by5uZWVkc1Jlc2l6ZUxheW91dCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcmV2aW91c1dpZHRoID0gdGhpcy5jb250YWluZXJXaWR0aDtcbiAgICB0aGlzLmdldENvbnRhaW5lcldpZHRoKCk7XG4gICAgcmV0dXJuIHByZXZpb3VzV2lkdGggIT0gdGhpcy5jb250YWluZXJXaWR0aDtcbiAgfTtcblxuICByZXR1cm4gTWFzb25yeTtcblxufSkpO1xuIl0sIm5hbWVzIjpbImUiLCJ1bmRlZmluZWQiLCJkZWZpbmUiLCJ0aGlzIiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxLQUFLLEdB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LE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDM0UsSUFBSSxFQUFFLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDekUsSUFBSSxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLElBQUksRUFBRSxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUM5RCxJQUFJLENBQUMsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDbEUsSUFBSSxFQUFFLEVBQUUsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hFLElBQUksQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLEVBQUUsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNsRSxJQUFJLEVBQUUsRUFBRSxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUU7QUFDaEUsSUFBSSxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUU7QUFDMUIsUUFBUSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ25FLEtBQUs7QUFDTCxJQUFJLEVBQUUsRUFBRSxVQUFVLE9BQU8sRUFBRTtBQUMz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LENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsa0JBQWtCLENBQUMsR0FBRyxFQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU9BLEtBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQTgrQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxBQUF5TixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLGFBQWEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FB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LENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNsRCxDQUFDO0FBQ0QsQUFBTyxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUU7QUFDOUMsSUFBSSxJQUFJLEdBQUcsR0FBRztBQUNkLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLEtBQUssQ0FBQztBQUNOLElBQUksSUFBSSxVQUFVO0FBQ2xCLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0MsUUFBUSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLEtBQUs7QUFDTCxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBQ0QsQUFBTyxTQUFTLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFO0FBQ2xELElBQUksSUFBSSxHQUFHLEdBQUc7QUFDZCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN4QyxRQUFRLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQyxLQUFLLENBQUM7QUFDTixJQUFJLElBQUksVUFBVTtBQUNsQixRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQzdDLFFBQVEsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENB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RTtBQUNmLFFBQVEsT0FBTyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDekQsS0FBSztBQUNMLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDZixRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDdEUsS0FBSztBQUNMLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLElBQUksSUFBSSxLQUFLLEVBQUU7QUFDZixRQUFRLE9BQU8sRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ3pELEtBQUs7QUFDTCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ2YsUUFBUSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FB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Q0FBQztBQUNuQyxRQUFRLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwQyxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0FBQ25DLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ3JELFFBQVEsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEtBQUssSUFBSSxJQUFJLEVBQUUsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDM0YsUUFBUSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDOUMsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3hCLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxTQUFTO0FBQ1QsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3hCLFlBQVksSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QyxTQUFTO0FBQ1QsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxF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RyxDQUFDLENBQUM7QUFDeEMsUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDeEksS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxZQUFZO0FBQzVDLFFBQVEsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsUUFBUSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDakUsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxZQUFZO0FBQ2xELFFBQVEsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkQsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDeEMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDeEMsUUFBUSxPQUFPLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDeEksS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLFVBQVUsRUFBRTtBQUN0RCxRQUFRLElBQUksVUFBVSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFO0FBQzFELFFBQVEsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUQsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxVQUFVLFVBQVUsRUFBRTtBQUM1RCxRQUFRLElBQUksVUFBVSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsVUFBVSxHQUFHLEtBQUssQ0FBQyxFQUFFO0FBQzFELFFBQVEsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1QyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsVUFBVSxFQUFFO0FBQ3ZELFFBQVEsSUFBSSxVQUFVLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxVQUFVLEdBQUcsS0FBSyxDQUFDLEVBQUU7QUFDMUQsUUFBUSxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFF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LFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0MsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDOUIsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxPQUFPLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDckQsUUFBUSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtBQUMvQyxRQUFRLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RixRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RixRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RixRQUFRLE9BQU8sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUNuRCxRQUFRLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQy9DLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzlCLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQ2pELFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0MsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxNQUFNLEVBQUU7QUFDbEQsUUFBUSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtBQUMvQyxRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekMsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLE1BQU0sRUFBRTtBQUN2RCxRQUFRLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQy9DLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO0FBQzlCLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQ3JELFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0MsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDOUIsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsUUFBUSxPQUFPLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsWUFBWTtBQUNoRCxRQUFRLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsTUFBTSxFQUFFO0FBQ2pELFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQVEsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxHQUFHLENBQUM7QUFDekMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDMUMsUUFBUSxPQUFPLElBQUksU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ3ZELFFBQVEsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7QUFDL0MsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEMsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoRCxRQUFRLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUM7QUFDN0IsUUFBUSxJQUFJLElBQUksR0FBRztBQUNuQixZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUMvQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUMvQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUMvQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQztBQUMvQyxTQUFTLENBQUM7QUFDVixRQUFRLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxVQUFVLE9BQU8sRUFBRSxNQUFNLEVBQUU7QUFDL0QsUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRTtBQUNoRCxRQUFRLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQy9DLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFFBQVEsSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztBQUNoQyxRQUFRLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsUUFBUSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHO0FBQ2hGLFlBQVksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxJQUFJLEdBQUcsQ0FBQztBQUN6QyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN6QyxTQUFTO0FBQ1QsUUFBUSxPQUFPLEdBQUcsQ0FBQztBQUNuQixLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFlBQVk7QUFDakQsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO0FBQ3BDLFFBQVEsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxLQUFLLENBQUM7QUFDTixJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFVBQVUsT0FBTyxFQUFFO0FBQzNELFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDaEQsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBUSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QixRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDdEIsUUFBUSxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBUSxJQUFJLFlBQVksR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO0FBQ3ZDLFFBQVEsT0FBTyxPQUFPLEVBQUUsRUFBRTtBQUMxQixZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxRCxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxZQUFZLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFNBQVM7QUFDVCxRQUFRLE9BQU8sR0FBRyxDQUFDO0FBQ25CLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxlQUFl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QUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUN0RCxJQUFJLE1BQU0sR0FBRyxLQUFLLEVBQUUsWUFBWSxHQUFHLE1BQU0sR0FBRyxPQUFPLEVBQUUsQ0FBQztFQUN0RCxJQUFJLE1BQU0sR0FBRyxLQUFLLEVBQUUsV0FBVyxHQUFHLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztFQUNyRCxJQUFJLENBQUMsR0FBRyxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUM7RUFDN0IsSUFBSSxDQUFDLEdBQUcsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDOztFQUU3QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztFQUNsQyxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUc7SUFDL0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxVQUFVLENBQUMsS0FBSyxDQUFDO0dBQ3BDO0VBQ0QsS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHO0lBQy9CLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssVUFBVSxDQUFDLE1BQU0sQ0FBQztHQUNyQzs7RUFFRCxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDdkIsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztFQUV2QixDQUFDLElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztFQUNyRSxDQUFDLElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQzs7RUFFcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==
