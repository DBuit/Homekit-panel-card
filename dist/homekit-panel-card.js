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
String(Math.random()).slice(2);
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
 */let t=!1;try{const e={get capture(){return t=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(t){}
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
 */(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2"),
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
void 0===window.ShadyCSS||void 0===window.ShadyCSS.prepareTemplateDom&&console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.")
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
 */,window.JSCompiler_renameProperty=(t,e)=>t;
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
const e="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol();class r{constructor(t,e){if(e!==n)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(e?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const a=(t,...e)=>{const a=e.reduce((e,n,a)=>e+(t=>{if(t instanceof r)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(n)+t[a+1],t[0]);return new r(a,n)};
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
(window.litElementVersions||(window.litElementVersions=[])).push("2.2.1");var i={},o=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,s="[^\\s]+",u=/\[([^]*?)\]/gm,h=function(){};function l(t,e){for(var n=[],r=0,a=t.length;r<a;r++)n.push(t[r].substr(0,e));return n}function c(t){return function(e,n,r){var a=r[t].indexOf(n.charAt(0).toUpperCase()+n.substr(1).toLowerCase());~a&&(e.month=a)}}function d(t,e){for(t=String(t),e=e||2;t.length<e;)t="0"+t;return t}var f=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],m=["January","February","March","April","May","June","July","August","September","October","November","December"],g=l(m,3),p=l(f,3);i.i18n={dayNamesShort:p,dayNames:f,monthNamesShort:g,monthNames:m,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10)*t%10]}};var b={D:function(t){return t.getDate()},DD:function(t){return d(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return t.getDay()},dd:function(t){return d(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return t.getMonth()+1},MM:function(t){return d(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return d(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return d(t.getFullYear(),4)},h:function(t){return t.getHours()%12||12},hh:function(t){return d(t.getHours()%12||12)},H:function(t){return t.getHours()},HH:function(t){return d(t.getHours())},m:function(t){return t.getMinutes()},mm:function(t){return d(t.getMinutes())},s:function(t){return t.getSeconds()},ss:function(t){return d(t.getSeconds())},S:function(t){return Math.round(t.getMilliseconds()/100)},SS:function(t){return d(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return d(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+d(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)}},v={D:["\\d\\d?",function(t,e){t.day=e}],Do:["\\d\\d?"+s,function(t,e){t.day=parseInt(e,10)}],M:["\\d\\d?",function(t,e){t.month=e-1}],YY:["\\d\\d?",function(t,e){var n=+(""+(new Date).getFullYear()).substr(0,2);t.year=""+(e>68?n-1:n)+e}],h:["\\d\\d?",function(t,e){t.hour=e}],m:["\\d\\d?",function(t,e){t.minute=e}],s:["\\d\\d?",function(t,e){t.second=e}],YYYY:["\\d{4}",function(t,e){t.year=e}],S:["\\d",function(t,e){t.millisecond=100*e}],SS:["\\d{2}",function(t,e){t.millisecond=10*e}],SSS:["\\d{3}",function(t,e){t.millisecond=e}],d:["\\d\\d?",h],ddd:[s,h],MMM:[s,c("monthNamesShort")],MMMM:[s,c("monthNames")],a:[s,function(t,e,n){var r=e.toLowerCase();r===n.amPm[0]?t.isPm=!1:r===n.amPm[1]&&(t.isPm=!0)}],ZZ:["[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z",function(t,e){var n,r=(e+"").match(/([+-]|\d\d)/gi);r&&(n=60*r[1]+parseInt(r[2],10),t.timezoneOffset="+"===r[0]?n:-n)}]};v.dd=v.d,v.dddd=v.ddd,v.DD=v.D,v.mm=v.m,v.hh=v.H=v.HH=v.h,v.MM=v.M,v.ss=v.s,v.A=v.a,i.masks={default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},i.format=function(t,e,n){var r=n||i.i18n;if("number"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw new Error("Invalid Date in fecha.format");e=i.masks[e]||e||i.masks.default;var a=[];return(e=(e=e.replace(u,(function(t,e){return a.push(e),"@@@"}))).replace(o,(function(e){return e in b?b[e](t,r):e.slice(1,e.length-1)}))).replace(/@@@/g,(function(){return a.shift()}))},i.parse=function(t,e,n){var r=n||i.i18n;if("string"!=typeof e)throw new Error("Invalid format in fecha.parse");if(e=i.masks[e]||e,t.length>1e3)return null;var a={},s=[],h=[];e=e.replace(u,(function(t,e){return h.push(e),"@@@"}));var l,c=(l=e,l.replace(/[|\\{()[^$+*?.-]/g,"\\$&")).replace(o,(function(t){if(v[t]){var e=v[t];return s.push(e[1]),"("+e[0]+")"}return t}));c=c.replace(/@@@/g,(function(){return h.shift()}));var d=t.match(new RegExp(c,"i"));if(!d)return null;for(var f=1;f<d.length;f++)s[f-1](a,d[f],r);var m,g=new Date;return!0===a.isPm&&null!=a.hour&&12!=+a.hour?a.hour=+a.hour+12:!1===a.isPm&&12==+a.hour&&(a.hour=0),null!=a.timezoneOffset?(a.minute=+(a.minute||0)-+a.timezoneOffset,m=new Date(Date.UTC(a.year||g.getFullYear(),a.month||0,a.day||1,a.hour||0,a.minute||0,a.second||0,a.millisecond||0))):m=new Date(a.year||g.getFullYear(),a.month||0,a.day||1,a.hour||0,a.minute||0,a.second||0,a.millisecond||0),m};var y=function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric"})}:function(t){return i.format(t,"mediumDate")},w=function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleString(e,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return i.format(t,"haDateTime")},x=function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleTimeString(e,{hour:"numeric",minute:"2-digit"})}:function(t){return i.format(t,"shortTime")};function k(t){return t.substr(0,t.indexOf("."))}function S(t,e,n){var r,a=function(t){return k(t.entity_id)}(e);if("binary_sensor"===a)e.attributes.device_class&&(r=t("state."+a+"."+e.attributes.device_class+"."+e.state)),r||(r=t("state."+a+".default."+e.state));else if(e.attributes.unit_of_measurement&&!["unknown","unavailable"].includes(e.state))r=e.state+" "+e.attributes.unit_of_measurement;else if("input_datetime"===a){var i;if(e.attributes.has_time)if(e.attributes.has_date)i=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),r=w(i,n);else{var o=new Date;i=new Date(o.getFullYear(),o.getMonth(),o.getDay(),e.attributes.hour,e.attributes.minute),r=x(i,n)}else i=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),r=y(i,n)}else r="zwave"===a?["initializing","dead"].includes(e.state)?t("state.zwave.query_stage."+e.state,"query_stage",e.attributes.query_stage):t("state.zwave.default."+e.state):t("state."+a+"."+e.state);return r||(r=t("state.default."+e.state)||t("component."+a+".state."+e.state)||e.state),r}var M="hass:bookmark",_={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function H(t,e){if(t in _)return _[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"hass:bell-plus";case"armed_night":return"hass:bell-sleep";case"disarmed":return"hass:bell-outline";case"triggered":return"hass:bell-ring";default:return"hass:bell"}case"binary_sensor":return e&&"off"===e?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return"closed"===e?"hass:window-closed":"hass:window-open";case"lock":return e&&"unlocked"===e?"hass:lock-open":"hass:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"hass:cast-connected":"hass:cast";case"zwave":switch(e){case"dead":return"hass:emoticon-dead";case"sleeping":return"hass:sleep";case"initializing":return"hass:timer-sand";default:return"hass:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),M}}function D(t,e){(function(t){return"string"==typeof t&&t.includes(".")&&1===parseFloat(t)})(t)&&(t="100%");var n=function(t){return"string"==typeof t&&t.includes("%")}(t);return t=360===e?t:Math.min(e,Math.max(0,parseFloat(t))),n&&(t=parseInt(String(t*e),10)/100),Math.abs(t-e)<1e-6?1:t=360===e?(t<0?t%e+e:t%e)/parseFloat(String(e)):t%e/parseFloat(String(e))}function $(t){return Math.min(1,Math.max(0,t))}function L(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function A(t){return t<=1?100*Number(t)+"%":t}function C(t){return 1===t.length?"0"+t:String(t)}function F(t,e,n){t=D(t,255),e=D(e,255),n=D(n,255);var r=Math.max(t,e,n),a=Math.min(t,e,n),i=0,o=0,s=(r+a)/2;if(r===a)o=0,i=0;else{var u=r-a;switch(o=s>.5?u/(2-r-a):u/(r+a),r){case t:i=(e-n)/u+(e<n?6:0);break;case e:i=(n-t)/u+2;break;case n:i=(t-e)/u+4}i/=6}return{h:i,s:o,l:s}}function Y(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*n*(e-t):n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function E(t,e,n){t=D(t,255),e=D(e,255),n=D(n,255);var r=Math.max(t,e,n),a=Math.min(t,e,n),i=0,o=r,s=r-a,u=0===r?0:s/r;if(r===a)i=0;else{switch(r){case t:i=(e-n)/s+(e<n?6:0);break;case e:i=(n-t)/s+2;break;case n:i=(t-e)/s+4}i/=6}return{h:i,s:u,v:o}}function z(t,e,n,r){var a=[C(Math.round(t).toString(16)),C(Math.round(e).toString(16)),C(Math.round(n).toString(16))];return r&&a[0].startsWith(a[0].charAt(1))&&a[1].startsWith(a[1].charAt(1))&&a[2].startsWith(a[2].charAt(1))?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0):a.join("")}function T(t){return Math.round(255*parseFloat(t)).toString(16)}function R(t){return O(t)/255}function O(t){return parseInt(t,16)}var N={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function P(t){var e={r:0,g:0,b:0},n=1,r=null,a=null,i=null,o=!1,s=!1;return"string"==typeof t&&(t=function(t){if(0===(t=t.trim().toLowerCase()).length)return!1;var e=!1;if(N[t])t=N[t],e=!0;else if("transparent"===t)return{r:0,g:0,b:0,a:0,format:"name"};var n=B.rgb.exec(t);if(n)return{r:n[1],g:n[2],b:n[3]};if(n=B.rgba.exec(t))return{r:n[1],g:n[2],b:n[3],a:n[4]};if(n=B.hsl.exec(t))return{h:n[1],s:n[2],l:n[3]};if(n=B.hsla.exec(t))return{h:n[1],s:n[2],l:n[3],a:n[4]};if(n=B.hsv.exec(t))return{h:n[1],s:n[2],v:n[3]};if(n=B.hsva.exec(t))return{h:n[1],s:n[2],v:n[3],a:n[4]};if(n=B.hex8.exec(t))return{r:O(n[1]),g:O(n[2]),b:O(n[3]),a:R(n[4]),format:e?"name":"hex8"};if(n=B.hex6.exec(t))return{r:O(n[1]),g:O(n[2]),b:O(n[3]),format:e?"name":"hex"};if(n=B.hex4.exec(t))return{r:O(n[1]+n[1]),g:O(n[2]+n[2]),b:O(n[3]+n[3]),a:R(n[4]+n[4]),format:e?"name":"hex8"};if(n=B.hex3.exec(t))return{r:O(n[1]+n[1]),g:O(n[2]+n[2]),b:O(n[3]+n[3]),format:e?"name":"hex"};return!1}(t)),"object"==typeof t&&(U(t.r)&&U(t.g)&&U(t.b)?(e=function(t,e,n){return{r:255*D(t,255),g:255*D(e,255),b:255*D(n,255)}}(t.r,t.g,t.b),o=!0,s="%"===String(t.r).substr(-1)?"prgb":"rgb"):U(t.h)&&U(t.s)&&U(t.v)?(r=A(t.s),a=A(t.v),e=function(t,e,n){t=6*D(t,360),e=D(e,100),n=D(n,100);var r=Math.floor(t),a=t-r,i=n*(1-e),o=n*(1-a*e),s=n*(1-(1-a)*e),u=r%6;return{r:255*[n,o,i,i,s,n][u],g:255*[s,n,n,o,i,i][u],b:255*[i,i,s,n,n,o][u]}}(t.h,r,a),o=!0,s="hsv"):U(t.h)&&U(t.s)&&U(t.l)&&(r=A(t.s),i=A(t.l),e=function(t,e,n){var r,a,i;if(t=D(t,360),e=D(e,100),n=D(n,100),0===e)a=n,i=n,r=n;else{var o=n<.5?n*(1+e):n+e-n*e,s=2*n-o;r=Y(s,o,t+1/3),a=Y(s,o,t),i=Y(s,o,t-1/3)}return{r:255*r,g:255*a,b:255*i}}(t.h,r,i),o=!0,s="hsl"),Object.prototype.hasOwnProperty.call(t,"a")&&(n=t.a)),n=L(n),{ok:o,format:t.format||s,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:n}}var j="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",q="[\\s|\\(]+("+j+")[,|\\s]+("+j+")[,|\\s]+("+j+")\\s*\\)?",I="[\\s|\\(]+("+j+")[,|\\s]+("+j+")[,|\\s]+("+j+")[,|\\s]+("+j+")\\s*\\)?",B={CSS_UNIT:new RegExp(j),rgb:new RegExp("rgb"+q),rgba:new RegExp("rgba"+I),hsl:new RegExp("hsl"+q),hsla:new RegExp("hsla"+I),hsv:new RegExp("hsv"+q),hsva:new RegExp("hsva"+I),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function U(t){return Boolean(B.CSS_UNIT.exec(String(t)))}var V=function(){function t(e,n){var r;if(void 0===e&&(e=""),void 0===n&&(n={}),e instanceof t)return e;this.originalInput=e;var a=P(e);this.originalInput=e,this.r=a.r,this.g=a.g,this.b=a.b,this.a=a.a,this.roundA=Math.round(100*this.a)/100,this.format=null!=(r=n.format)?r:a.format,this.gradientType=n.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=a.ok}return t.prototype.isDark=function(){return this.getBrightness()<128},t.prototype.isLight=function(){return!this.isDark()},t.prototype.getBrightness=function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},t.prototype.getLuminance=function(){var t=this.toRgb(),e=t.r/255,n=t.g/255,r=t.b/255;return.2126*(e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4))+.7152*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))+.0722*(r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4))},t.prototype.getAlpha=function(){return this.a},t.prototype.setAlpha=function(t){return this.a=L(t),this.roundA=Math.round(100*this.a)/100,this},t.prototype.toHsv=function(){var t=E(this.r,this.g,this.b);return{h:360*t.h,s:t.s,v:t.v,a:this.a}},t.prototype.toHsvString=function(){var t=E(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),r=Math.round(100*t.v);return 1===this.a?"hsv("+e+", "+n+"%, "+r+"%)":"hsva("+e+", "+n+"%, "+r+"%, "+this.roundA+")"},t.prototype.toHsl=function(){var t=F(this.r,this.g,this.b);return{h:360*t.h,s:t.s,l:t.l,a:this.a}},t.prototype.toHslString=function(){var t=F(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),r=Math.round(100*t.l);return 1===this.a?"hsl("+e+", "+n+"%, "+r+"%)":"hsla("+e+", "+n+"%, "+r+"%, "+this.roundA+")"},t.prototype.toHex=function(t){return void 0===t&&(t=!1),z(this.r,this.g,this.b,t)},t.prototype.toHexString=function(t){return void 0===t&&(t=!1),"#"+this.toHex(t)},t.prototype.toHex8=function(t){return void 0===t&&(t=!1),function(t,e,n,r,a){var i=[C(Math.round(t).toString(16)),C(Math.round(e).toString(16)),C(Math.round(n).toString(16)),C(T(r))];return a&&i[0].startsWith(i[0].charAt(1))&&i[1].startsWith(i[1].charAt(1))&&i[2].startsWith(i[2].charAt(1))&&i[3].startsWith(i[3].charAt(1))?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0)+i[3].charAt(0):i.join("")}(this.r,this.g,this.b,this.a,t)},t.prototype.toHex8String=function(t){return void 0===t&&(t=!1),"#"+this.toHex8(t)},t.prototype.toRgb=function(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}},t.prototype.toRgbString=function(){var t=Math.round(this.r),e=Math.round(this.g),n=Math.round(this.b);return 1===this.a?"rgb("+t+", "+e+", "+n+")":"rgba("+t+", "+e+", "+n+", "+this.roundA+")"},t.prototype.toPercentageRgb=function(){var t=function(t){return Math.round(100*D(t,255))+"%"};return{r:t(this.r),g:t(this.g),b:t(this.b),a:this.a}},t.prototype.toPercentageRgbString=function(){var t=function(t){return Math.round(100*D(t,255))};return 1===this.a?"rgb("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%)":"rgba("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%, "+this.roundA+")"},t.prototype.toName=function(){if(0===this.a)return"transparent";if(this.a<1)return!1;for(var t="#"+z(this.r,this.g,this.b,!1),e=0,n=Object.keys(N);e<n.length;e++){var r=n[e];if(N[r]===t)return r}return!1},t.prototype.toString=function(t){var e=Boolean(t);t=null!=t?t:this.format;var n=!1,r=this.a<1&&this.a>=0;return e||!r||!t.startsWith("hex")&&"name"!==t?("rgb"===t&&(n=this.toRgbString()),"prgb"===t&&(n=this.toPercentageRgbString()),"hex"!==t&&"hex6"!==t||(n=this.toHexString()),"hex3"===t&&(n=this.toHexString(!0)),"hex4"===t&&(n=this.toHex8String(!0)),"hex8"===t&&(n=this.toHex8String()),"name"===t&&(n=this.toName()),"hsl"===t&&(n=this.toHslString()),"hsv"===t&&(n=this.toHsvString()),n||this.toHexString()):"name"===t&&0===this.a?this.toName():this.toRgbString()},t.prototype.clone=function(){return new t(this.toString())},t.prototype.lighten=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l+=e/100,n.l=$(n.l),new t(n)},t.prototype.brighten=function(e){void 0===e&&(e=10);var n=this.toRgb();return n.r=Math.max(0,Math.min(255,n.r-Math.round(-e/100*255))),n.g=Math.max(0,Math.min(255,n.g-Math.round(-e/100*255))),n.b=Math.max(0,Math.min(255,n.b-Math.round(-e/100*255))),new t(n)},t.prototype.darken=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l-=e/100,n.l=$(n.l),new t(n)},t.prototype.tint=function(t){return void 0===t&&(t=10),this.mix("white",t)},t.prototype.shade=function(t){return void 0===t&&(t=10),this.mix("black",t)},t.prototype.desaturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s-=e/100,n.s=$(n.s),new t(n)},t.prototype.saturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s+=e/100,n.s=$(n.s),new t(n)},t.prototype.greyscale=function(){return this.desaturate(100)},t.prototype.spin=function(e){var n=this.toHsl(),r=(n.h+e)%360;return n.h=r<0?360+r:r,new t(n)},t.prototype.mix=function(e,n){void 0===n&&(n=50);var r=this.toRgb(),a=new t(e).toRgb(),i=n/100;return new t({r:(a.r-r.r)*i+r.r,g:(a.g-r.g)*i+r.g,b:(a.b-r.b)*i+r.b,a:(a.a-r.a)*i+r.a})},t.prototype.analogous=function(e,n){void 0===e&&(e=6),void 0===n&&(n=30);var r=this.toHsl(),a=360/n,i=[this];for(r.h=(r.h-(a*e>>1)+720)%360;--e;)r.h=(r.h+a)%360,i.push(new t(r));return i},t.prototype.complement=function(){var e=this.toHsl();return e.h=(e.h+180)%360,new t(e)},t.prototype.monochromatic=function(e){void 0===e&&(e=6);for(var n=this.toHsv(),r=n.h,a=n.s,i=n.v,o=[],s=1/e;e--;)o.push(new t({h:r,s:a,v:i})),i=(i+s)%1;return o},t.prototype.splitcomplement=function(){var e=this.toHsl(),n=e.h;return[this,new t({h:(n+72)%360,s:e.s,l:e.l}),new t({h:(n+216)%360,s:e.s,l:e.l})]},t.prototype.triad=function(){return this.polyad(3)},t.prototype.tetrad=function(){return this.polyad(4)},t.prototype.polyad=function(e){for(var n=this.toHsl(),r=n.h,a=[this],i=360/e,o=1;o<e;o++)a.push(new t({h:(r+o*i)%360,s:n.s,l:n.l}));return a},t.prototype.equals=function(e){return this.toRgbString()===new t(e).toRgbString()},t}();function W(t,e){return void 0===t&&(t=""),void 0===e&&(e={}),new V(t,e)}var Z=document.createElement("long-press");document.body.appendChild(Z);var J=document.createElement("action-handler");document.body.appendChild(J),customElements.whenDefined("card-tools").then(()=>{var t=customElements.get("card-tools");class e extends t.LitElement{static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entities)throw new Error("You need to define entities");t.useTemperature||(t.useTemperature=!1),t.useBrightness||(t.useBrightness=!0),t.breakOnMobile||(t.breakOnMobile=!1),this.config=t}render(){return t.LitHtml`
      <div class="container" >
        ${this.config.home?t.LitHtml`
            <div class="header">
                ${this.config.title?t.LitHtml`<h1>${this.config.title}</h1>`:t.LitHtml``}
            </div>
        `:t.LitHtml``}
        ${this.config.entities.map(e=>{var n=0;return t.LitHtml`
                <div class="card-title">${e.title}</div>
                    <div class="homekit-card">
                        ${e.entities.map(r=>{if(r.card)return n++,t.LitHtml`
                              <homekit-card-item>
                                <homekit-button class="button on${r.noPadding?" no-padding":""}">
                                    <div class="button-inner">
                                      <card-maker nohass data-card="${r.card}" data-options="${JSON.stringify(r.cardOptions)}" data-style="${r.cardStyle?r.cardStyle:""}">
                                      </card-maker>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                              ${3==n&&this.config.breakOnMobile?t.LitHtml`<div class="break"></div>`:t.LitHtml``}
                            `;{var a=["off","unavailable"];r.offStates&&(a=r.offStates);const s=this.hass.states[r.entity];var i="#f7d959";3==n&&(n=0),4==n&&(n=2),i=r.color?r.color:this._getColorForLightEntity(s,this.config.useTemperature,this.config.useBrightness);var o=r.entity.split(".")[0];return"light"==o?(n++,s?t.LitHtml`
                                  <homekit-card-item>
                                    <homekit-button class="${a.includes(s.state)?"button":"button on"}" @action=${t=>this._handleClick(t,s,r,o,e)}>
                                        <div class="button-inner">
                                          <span class="icon" style="${a.includes(s.state)?"":"color:"+i+";"}">
                                            <ha-icon icon="${r.icon||s.attributes.icon||H(k(s.entity_id),s.state)}" class=" ${r.spin&&"on"===s.state?"spin":""}"/>
                                          </span>
                                          <span class="${a.includes(s.state)?"name":"name on"}">${r.name||s.attributes.friendly_name}</span>
                                          <span class="${a.includes(s.state)?"state":"state on"}">${S(this.hass.localize,s,this.hass.language)}${s.attributes.brightness?t.LitHtml` <span class=" ${a.includes(s.state)?"value":"value on"}"><span>${Math.round(s.attributes.brightness/2.55)}%</span></span>`:t.LitHtml``}</span>
                                        </div>
                                    </homekit-button>
                                  </homekit-card-item>
                                  ${3==n&&this.config.breakOnMobile?t.LitHtml`<div class="break"></div>`:t.LitHtml``}
                                  `:this._notFound(r)):"sensor"==o||"binary_sensor"==o?(n++,s?t.LitHtml`
                                <homekit-card-item>
                                  <homekit-button class="${a.includes(s.state)?"button":"button on"}" @action=${t=>this._handleClick(t,s,r,o,e)}>
                                      <div class="button-inner">
                                        <span class="${a.includes(s.state)?"icon":"icon on"}">
                                          <ha-icon icon="${r.icon||s.attributes.icon||H(k(s.entity_id),s.state)}" />
                                        </span>
                                        <span class="${a.includes(s.state)?"name":"name on"}">${r.name||s.attributes.friendly_name}</span>
                                        <span class="${a.includes(s.state)?"state":"state on"}">${S(this.hass.localize,s,this.hass.language)}</span>
                                      </div>
                                  </homekit-button>
                                </<homekit-card-item>
                                ${3==n&&this.config.breakOnMobile?t.LitHtml`<div class="break"></div>`:t.LitHtml``}
                              `:this._notFound(r)):"weather"==o?(n+=2,s?t.LitHtml`
                                ${4==n&&this.config.breakOnMobile?t.LitHtml`<div class="break"></div>`:t.LitHtml``}
                                <homekit-card-item>
                                  <homekit-button class="button size-2 on" @action=${t=>this._handleClick(t,s,r,o,e)}>
                                      <div class="button-inner">
                                        <span class="icon on">
                                          <ha-icon icon="${r.icon||s.attributes.icon||"mdi:weather-"+s.state}" />
                                        </span>
                                        <span class="name on">${r.name||s.attributes.friendly_name}</span>
                                        <span class="state on">${S(this.hass.localize,s,this.hass.language)}
                                          ${s.attributes.forecast[0]&&s.attributes.forecast[0].precipitation?t.LitHtml`
                                              <span class="value on">${s.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                          `:t.LitHtml``}
                                        </span>
                                      </div>
                                  </homekit-button>
                                </<homekit-card-item>
                                ${3==n&&this.config.breakOnMobile?t.LitHtml`<div class="break"></div>`:t.LitHtml``}
                              `:this._notFound(r)):(n++,s?t.LitHtml`
                                <homekit-card-item>
                                  <homekit-button class="${a.includes(s.state)?"button":"button on"}" @action=${t=>this._handleClick(t,s,r,o,e)}>
                                      <div class="button-inner">
                                        <span class="${a.includes(s.state)?"icon":"icon on"}">
                                          <ha-icon icon="${r.icon||s.attributes.icon}" />
                                        </span>
                                        <span class="${a.includes(s.state)?"name":"name on"}">${r.name||s.attributes.friendly_name}</span>
                                        <span class="${a.includes(s.state)?"state":"state on"}">${S(this.hass.localize,s,this.hass.language)}</span>
                                      </div>
                                  </homekit-button>
                                </<homekit-card-item>
                                ${3==n&&this.config.breakOnMobile?t.LitHtml`<div class="break"></div>`:t.LitHtml``}
                              `:this._notFound(r))}})}
                    </div>
                </div>
            `})}
        
        `}firstUpdated(){for(var e=this.shadowRoot.querySelectorAll("homekit-button"),n=0;n<e.length;n++)t.longpress(e[n],{hasHold:!0,hasDoubleClick:!0});this.shadowRoot.querySelectorAll("card-maker").forEach(t=>{var e={type:t.dataset.card};e=Object.assign({},e,JSON.parse(t.dataset.options)),t.config=e;let n="";if(t.dataset.style?n=t.dataset.style:"custom:mini-graph-card"==t.dataset.card&&(n=":host {height:100%;} ha-card { background: transparent; color: #000; padding:0!important; box-shadow:none; } .header {padding:0;} .header icon {color:#f7d959;} .states {padding:0;} .states .state .state__value {font-size:14px;}"),""!=n){let e=0,r=setInterval((function(){let a=t.children[0];if(a){window.clearInterval(r);var i=document.createElement("style");i.innerHTML=n,a.shadowRoot.appendChild(i)}else 10==++e&&window.clearInterval(r)}),100)}})}_handleClick(e,n,r,a,i){if("light"==a){if("tap"==e.detail.action||"double_tap"==e.detail.action)this._toggle(n,r.service);else if("hold"==e.detail.action)if(i&&i.popup||r.popup){if(i.popup){var o=Object.assign({},i.popup,{entity:n.entity_id});if(r.popupExtend)o=Object.assign({},o,r.popupExtend)}else o=Object.assign({},r.popup,{entity:n.entity_id});t.popUp("test",o,!1,{position:"fixed","z-index":999,top:0,left:0,height:"100%",width:"100%",display:"block","align-items":"center","justify-content":"center",background:"rgba(0, 0, 0, 0.8)","flex-direction":"column",margin:0,"--iron-icon-fill-color":"#FFF"})}else this._hold(n)}else"hold"==e.detail.action&&this._hold(n)}getCardSize(){return this.config.entities.length+1}_toggle(t,e){this.hass.callService("homeassistant",e||"toggle",{entity_id:t.entity_id})}_hold(e){t.moreInfo(e.entity_id)}_getUnit(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":return"km"===e?"hPa":"inHg";case"length":return e;case"precipitation":return"km"===e?"mm":"in";default:return this.hass.config.unit_system[t]||""}}_notFound(e){return t.LitHtml`
        <homekit-card-item>
          <homekit-button class="not-found">
            <div class="button-inner">
              <span class="name">${e.entity}</span>
              <span class="state">Not found</span>
            </div>
          </homekit-button>
        </homekit-card-item>
      `}_getColorForLightEntity(t,e,n){var r=this.config.default_color?this.config.default_color:void 0;return t&&(t.attributes.rgb_color?(r=`rgb(${t.attributes.rgb_color.join(",")})`,t.attributes.brightness&&(r=this._applyBrightnessToColor(r,(t.attributes.brightness+245)/5))):e&&t.attributes.color_temp&&t.attributes.min_mireds&&t.attributes.max_mireds?(r=this._getLightColorBasedOnTemperature(t.attributes.color_temp,t.attributes.min_mireds,t.attributes.max_mireds),t.attributes.brightness&&(r=this._applyBrightnessToColor(r,(t.attributes.brightness+245)/5))):r=n&&t.attributes.brightness?this._applyBrightnessToColor(this._getDefaultColorForState(),(t.attributes.brightness+245)/5):this._getDefaultColorForState()),r}_applyBrightnessToColor(t,e){const n=new V(this._getColorFromVariable(t));if(n.isValid){const t=n.mix("black",100-e).toString();if(t)return t}return t}_getLightColorBasedOnTemperature(t,e,n){const r=new V("rgb(255, 160, 0)"),a=new V("rgb(166, 209, 255)"),i=new V("white"),o=(t-e)/(n-e)*100;return o<50?W(a).mix(i,2*o).toRgbString():W(i).mix(r,2*(o-50)).toRgbString()}_getDefaultColorForState(){return this.config.color_on?this.config.color_on:"#f7d959"}_getColorFromVariable(t){return void 0!==t&&"var"===t.substring(0,3)?window.getComputedStyle(document.documentElement).getPropertyValue(t.substring(4).slice(0,-1)).trim():t}static get styles(){return a`
        :host {

        }
        .card-title {
            margin-bottom:-10px;
            padding-left: 4px;
            font-size: 18px;
            padding-top:18px;
            padding-bottom:10px;
        }
        .homekit-card {
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
        }

        .container {
            float: left;
            clear: left;
            margin-top: 10px;
            padding: 5px 0 5px 15px;
            white-space: nowrap;
            width: 100%;
            box-sizing: border-box;
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
          width: 100px;
          height: 100px;
          padding:10px;
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
          width: 230px;
        }
        .button.no-padding {
          padding: 0;
          width: 120px;
          height: 120px;
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
          font-size: 14px;
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
          font-size: 14px;
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
          font-size: 11px;
          color: rgba(255, 0, 0, 1);
          text-transform: lowercase;
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

        @media only screen and (min-width: 768px) {
          .break {
            display:none;
          }
        }   
        @media only screen and (max-width: 768px) {
          .button {
            width:90px;
            height:90px;
          }
          .button.size-2 {
            width:210px;
          }
          .button.no-padding {
            width: 110px;
            height: 110px;
          }
          .container {
            padding-left:0;
          }
          .header, .card-title, .homekit-card {
            width: 358px;
            text-align: left;
            margin: 0 auto;
          }
          .card-title {
            padding-bottom:0;
          }
          homekit-button .name {
            font-size:13px;
          }
          homekit-button .state {
            font-size:13px;
          }
          homekit-button .value.on {
            font-size:10px;
          }
        }

        card-maker {
          height:100%;
        }
      `}}customElements.define("homekit-card",e)}),setTimeout(()=>{customElements.get("card-tools")||customElements.define("my-plugin",class extends HTMLElement{setConfig(){throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools")}})},2e3);
