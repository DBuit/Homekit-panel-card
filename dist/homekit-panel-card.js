var t={},e=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,n="[^\\s]+",i=/\[([^]*?)\]/gm,o=function(){};function r(t,e){for(var n=[],i=0,o=t.length;i<o;i++)n.push(t[i].substr(0,e));return n}function s(t){return function(e,n,i){var o=i[t].indexOf(n.charAt(0).toUpperCase()+n.substr(1).toLowerCase());~o&&(e.month=o)}}function a(t,e){for(t=String(t),e=e||2;t.length<e;)t="0"+t;return t}var c=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],u=["January","February","March","April","May","June","July","August","September","October","November","December"],l=r(u,3),h=r(c,3);t.i18n={dayNamesShort:h,dayNames:c,monthNamesShort:l,monthNames:u,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10)*t%10]}};var d={D:function(t){return t.getDate()},DD:function(t){return a(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return t.getDay()},dd:function(t){return a(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return t.getMonth()+1},MM:function(t){return a(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return a(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return a(t.getFullYear(),4)},h:function(t){return t.getHours()%12||12},hh:function(t){return a(t.getHours()%12||12)},H:function(t){return t.getHours()},HH:function(t){return a(t.getHours())},m:function(t){return t.getMinutes()},mm:function(t){return a(t.getMinutes())},s:function(t){return t.getSeconds()},ss:function(t){return a(t.getSeconds())},S:function(t){return Math.round(t.getMilliseconds()/100)},SS:function(t){return a(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return a(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+a(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)}},p={D:["\\d\\d?",function(t,e){t.day=e}],Do:["\\d\\d?"+n,function(t,e){t.day=parseInt(e,10)}],M:["\\d\\d?",function(t,e){t.month=e-1}],YY:["\\d\\d?",function(t,e){var n=+(""+(new Date).getFullYear()).substr(0,2);t.year=""+(e>68?n-1:n)+e}],h:["\\d\\d?",function(t,e){t.hour=e}],m:["\\d\\d?",function(t,e){t.minute=e}],s:["\\d\\d?",function(t,e){t.second=e}],YYYY:["\\d{4}",function(t,e){t.year=e}],S:["\\d",function(t,e){t.millisecond=100*e}],SS:["\\d{2}",function(t,e){t.millisecond=10*e}],SSS:["\\d{3}",function(t,e){t.millisecond=e}],d:["\\d\\d?",o],ddd:[n,o],MMM:[n,s("monthNamesShort")],MMMM:[n,s("monthNames")],a:[n,function(t,e,n){var i=e.toLowerCase();i===n.amPm[0]?t.isPm=!1:i===n.amPm[1]&&(t.isPm=!0)}],ZZ:["[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z",function(t,e){var n,i=(e+"").match(/([+-]|\d\d)/gi);i&&(n=60*i[1]+parseInt(i[2],10),t.timezoneOffset="+"===i[0]?n:-n)}]};p.dd=p.d,p.dddd=p.ddd,p.DD=p.D,p.mm=p.m,p.hh=p.H=p.HH=p.h,p.MM=p.M,p.ss=p.s,p.A=p.a,t.masks={default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},t.format=function(n,o,r){var s=r||t.i18n;if("number"==typeof n&&(n=new Date(n)),"[object Date]"!==Object.prototype.toString.call(n)||isNaN(n.getTime()))throw new Error("Invalid Date in fecha.format");o=t.masks[o]||o||t.masks.default;var a=[];return(o=(o=o.replace(i,(function(t,e){return a.push(e),"@@@"}))).replace(e,(function(t){return t in d?d[t](n,s):t.slice(1,t.length-1)}))).replace(/@@@/g,(function(){return a.shift()}))},t.parse=function(n,o,r){var s=r||t.i18n;if("string"!=typeof o)throw new Error("Invalid format in fecha.parse");if(o=t.masks[o]||o,n.length>1e3)return null;var a={},c=[],u=[];o=o.replace(i,(function(t,e){return u.push(e),"@@@"}));var l,h=(l=o,l.replace(/[|\\{()[^$+*?.-]/g,"\\$&")).replace(e,(function(t){if(p[t]){var e=p[t];return c.push(e[1]),"("+e[0]+")"}return t}));h=h.replace(/@@@/g,(function(){return u.shift()}));var d=n.match(new RegExp(h,"i"));if(!d)return null;for(var f=1;f<d.length;f++)c[f-1](a,d[f],s);var m,g=new Date;return!0===a.isPm&&null!=a.hour&&12!=+a.hour?a.hour=+a.hour+12:!1===a.isPm&&12==+a.hour&&(a.hour=0),null!=a.timezoneOffset?(a.minute=+(a.minute||0)-+a.timezoneOffset,m=new Date(Date.UTC(a.year||g.getFullYear(),a.month||0,a.day||1,a.hour||0,a.minute||0,a.second||0,a.millisecond||0))):m=new Date(a.year||g.getFullYear(),a.month||0,a.day||1,a.hour||0,a.minute||0,a.second||0,a.millisecond||0),m};var f=function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric"})}:function(e){return t.format(e,"mediumDate")},m=function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleString(e,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(e){return t.format(e,"haDateTime")},g=function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleTimeString(e,{hour:"numeric",minute:"2-digit"})}:function(e){return t.format(e,"shortTime")};function b(t){return t.substr(0,t.indexOf("."))}function v(t,e,n){var i,o=function(t){return b(t.entity_id)}(e);if("binary_sensor"===o)e.attributes.device_class&&(i=t("state."+o+"."+e.attributes.device_class+"."+e.state)),i||(i=t("state."+o+".default."+e.state));else if(e.attributes.unit_of_measurement&&!["unknown","unavailable"].includes(e.state))i=e.state+" "+e.attributes.unit_of_measurement;else if("input_datetime"===o){var r;if(e.attributes.has_time)if(e.attributes.has_date)r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),i=m(r,n);else{var s=new Date;r=new Date(s.getFullYear(),s.getMonth(),s.getDay(),e.attributes.hour,e.attributes.minute),i=g(r,n)}else r=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),i=f(r,n)}else i="zwave"===o?["initializing","dead"].includes(e.state)?t("state.zwave.query_stage."+e.state,"query_stage",e.attributes.query_stage):t("state.zwave.default."+e.state):t("state."+o+"."+e.state);return i||(i=t("state.default."+e.state)||t("component."+o+".state."+e.state)||e.state),i}var y=["closed","locked","off"],w=function(t,e,n,i){i=i||{},n=null==n?{}:n;var o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=n,t.dispatchEvent(o),o},_={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function x(t,e){if(t in _)return _[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"hass:bell-plus";case"armed_night":return"hass:bell-sleep";case"disarmed":return"hass:bell-outline";case"triggered":return"hass:bell-ring";default:return"hass:bell"}case"binary_sensor":return e&&"off"===e?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return"closed"===e?"hass:window-closed":"hass:window-open";case"lock":return e&&"unlocked"===e?"hass:lock-open":"hass:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"hass:cast-connected":"hass:cast";case"zwave":switch(e){case"dead":return"hass:emoticon-dead";case"sleeping":return"hass:sleep";case"initializing":return"hass:timer-sand";default:return"hass:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),"hass:bookmark"}}var k=function(t){w(window,"haptic",t)},S=function(t,e){return function(t,e,n){void 0===n&&(n=!0);var i,o=b(e),r="group"===o?"homeassistant":o;switch(o){case"lock":i=n?"unlock":"lock";break;case"cover":i=n?"open_cover":"close_cover";break;default:i=n?"turn_on":"turn_off"}return t.callService(r,i,{entity_id:e})}(t,e,y.includes(t.states[e].state))};function T(t,e){(function(t){return"string"==typeof t&&t.includes(".")&&1===parseFloat(t)})(t)&&(t="100%");var n=function(t){return"string"==typeof t&&t.includes("%")}(t);return t=360===e?t:Math.min(e,Math.max(0,parseFloat(t))),n&&(t=parseInt(String(t*e),10)/100),Math.abs(t-e)<1e-6?1:t=360===e?(t<0?t%e+e:t%e)/parseFloat(String(e)):t%e/parseFloat(String(e))}function $(t){return Math.min(1,Math.max(0,t))}function M(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function E(t){return t<=1?100*Number(t)+"%":t}function A(t){return 1===t.length?"0"+t:String(t)}function C(t,e,n){t=T(t,255),e=T(e,255),n=T(n,255);var i=Math.max(t,e,n),o=Math.min(t,e,n),r=0,s=0,a=(i+o)/2;if(i===o)s=0,r=0;else{var c=i-o;switch(s=a>.5?c/(2-i-o):c/(i+o),i){case t:r=(e-n)/c+(e<n?6:0);break;case e:r=(n-t)/c+2;break;case n:r=(t-e)/c+4}r/=6}return{h:r,s:s,l:a}}function P(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*n*(e-t):n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function D(t,e,n){t=T(t,255),e=T(e,255),n=T(n,255);var i=Math.max(t,e,n),o=Math.min(t,e,n),r=0,s=i,a=i-o,c=0===i?0:a/i;if(i===o)r=0;else{switch(i){case t:r=(e-n)/a+(e<n?6:0);break;case e:r=(n-t)/a+2;break;case n:r=(t-e)/a+4}r/=6}return{h:r,s:c,v:s}}function O(t,e,n,i){var o=[A(Math.round(t).toString(16)),A(Math.round(e).toString(16)),A(Math.round(n).toString(16))];return i&&o[0].startsWith(o[0].charAt(1))&&o[1].startsWith(o[1].charAt(1))&&o[2].startsWith(o[2].charAt(1))?o[0].charAt(0)+o[1].charAt(0)+o[2].charAt(0):o.join("")}function z(t){return Math.round(255*parseFloat(t)).toString(16)}function R(t){return H(t)/255}function H(t){return parseInt(t,16)}var I={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function F(t){var e={r:0,g:0,b:0},n=1,i=null,o=null,r=null,s=!1,a=!1;return"string"==typeof t&&(t=function(t){if(0===(t=t.trim().toLowerCase()).length)return!1;var e=!1;if(I[t])t=I[t],e=!0;else if("transparent"===t)return{r:0,g:0,b:0,a:0,format:"name"};var n=j.rgb.exec(t);if(n)return{r:n[1],g:n[2],b:n[3]};if(n=j.rgba.exec(t))return{r:n[1],g:n[2],b:n[3],a:n[4]};if(n=j.hsl.exec(t))return{h:n[1],s:n[2],l:n[3]};if(n=j.hsla.exec(t))return{h:n[1],s:n[2],l:n[3],a:n[4]};if(n=j.hsv.exec(t))return{h:n[1],s:n[2],v:n[3]};if(n=j.hsva.exec(t))return{h:n[1],s:n[2],v:n[3],a:n[4]};if(n=j.hex8.exec(t))return{r:H(n[1]),g:H(n[2]),b:H(n[3]),a:R(n[4]),format:e?"name":"hex8"};if(n=j.hex6.exec(t))return{r:H(n[1]),g:H(n[2]),b:H(n[3]),format:e?"name":"hex"};if(n=j.hex4.exec(t))return{r:H(n[1]+n[1]),g:H(n[2]+n[2]),b:H(n[3]+n[3]),a:R(n[4]+n[4]),format:e?"name":"hex8"};if(n=j.hex3.exec(t))return{r:H(n[1]+n[1]),g:H(n[2]+n[2]),b:H(n[3]+n[3]),format:e?"name":"hex"};return!1}(t)),"object"==typeof t&&(L(t.r)&&L(t.g)&&L(t.b)?(e=function(t,e,n){return{r:255*T(t,255),g:255*T(e,255),b:255*T(n,255)}}(t.r,t.g,t.b),s=!0,a="%"===String(t.r).substr(-1)?"prgb":"rgb"):L(t.h)&&L(t.s)&&L(t.v)?(i=E(t.s),o=E(t.v),e=function(t,e,n){t=6*T(t,360),e=T(e,100),n=T(n,100);var i=Math.floor(t),o=t-i,r=n*(1-e),s=n*(1-o*e),a=n*(1-(1-o)*e),c=i%6;return{r:255*[n,s,r,r,a,n][c],g:255*[a,n,n,s,r,r][c],b:255*[r,r,a,n,n,s][c]}}(t.h,i,o),s=!0,a="hsv"):L(t.h)&&L(t.s)&&L(t.l)&&(i=E(t.s),r=E(t.l),e=function(t,e,n){var i,o,r;if(t=T(t,360),e=T(e,100),n=T(n,100),0===e)o=n,r=n,i=n;else{var s=n<.5?n*(1+e):n+e-n*e,a=2*n-s;i=P(a,s,t+1/3),o=P(a,s,t),r=P(a,s,t-1/3)}return{r:255*i,g:255*o,b:255*r}}(t.h,i,r),s=!0,a="hsl"),Object.prototype.hasOwnProperty.call(t,"a")&&(n=t.a)),n=M(n),{ok:s,format:t.format||a,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:n}}var N="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",Y="[\\s|\\(]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")\\s*\\)?",q="[\\s|\\(]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")\\s*\\)?",j={CSS_UNIT:new RegExp(N),rgb:new RegExp("rgb"+Y),rgba:new RegExp("rgba"+q),hsl:new RegExp("hsl"+Y),hsla:new RegExp("hsla"+q),hsv:new RegExp("hsv"+Y),hsva:new RegExp("hsva"+q),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function L(t){return Boolean(j.CSS_UNIT.exec(String(t)))}var W=function(){function t(e,n){var i;if(void 0===e&&(e=""),void 0===n&&(n={}),e instanceof t)return e;this.originalInput=e;var o=F(e);this.originalInput=e,this.r=o.r,this.g=o.g,this.b=o.b,this.a=o.a,this.roundA=Math.round(100*this.a)/100,this.format=null!=(i=n.format)?i:o.format,this.gradientType=n.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=o.ok}return t.prototype.isDark=function(){return this.getBrightness()<128},t.prototype.isLight=function(){return!this.isDark()},t.prototype.getBrightness=function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},t.prototype.getLuminance=function(){var t=this.toRgb(),e=t.r/255,n=t.g/255,i=t.b/255;return.2126*(e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4))+.7152*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))+.0722*(i<=.03928?i/12.92:Math.pow((i+.055)/1.055,2.4))},t.prototype.getAlpha=function(){return this.a},t.prototype.setAlpha=function(t){return this.a=M(t),this.roundA=Math.round(100*this.a)/100,this},t.prototype.toHsv=function(){var t=D(this.r,this.g,this.b);return{h:360*t.h,s:t.s,v:t.v,a:this.a}},t.prototype.toHsvString=function(){var t=D(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),i=Math.round(100*t.v);return 1===this.a?"hsv("+e+", "+n+"%, "+i+"%)":"hsva("+e+", "+n+"%, "+i+"%, "+this.roundA+")"},t.prototype.toHsl=function(){var t=C(this.r,this.g,this.b);return{h:360*t.h,s:t.s,l:t.l,a:this.a}},t.prototype.toHslString=function(){var t=C(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),i=Math.round(100*t.l);return 1===this.a?"hsl("+e+", "+n+"%, "+i+"%)":"hsla("+e+", "+n+"%, "+i+"%, "+this.roundA+")"},t.prototype.toHex=function(t){return void 0===t&&(t=!1),O(this.r,this.g,this.b,t)},t.prototype.toHexString=function(t){return void 0===t&&(t=!1),"#"+this.toHex(t)},t.prototype.toHex8=function(t){return void 0===t&&(t=!1),function(t,e,n,i,o){var r=[A(Math.round(t).toString(16)),A(Math.round(e).toString(16)),A(Math.round(n).toString(16)),A(z(i))];return o&&r[0].startsWith(r[0].charAt(1))&&r[1].startsWith(r[1].charAt(1))&&r[2].startsWith(r[2].charAt(1))&&r[3].startsWith(r[3].charAt(1))?r[0].charAt(0)+r[1].charAt(0)+r[2].charAt(0)+r[3].charAt(0):r.join("")}(this.r,this.g,this.b,this.a,t)},t.prototype.toHex8String=function(t){return void 0===t&&(t=!1),"#"+this.toHex8(t)},t.prototype.toRgb=function(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}},t.prototype.toRgbString=function(){var t=Math.round(this.r),e=Math.round(this.g),n=Math.round(this.b);return 1===this.a?"rgb("+t+", "+e+", "+n+")":"rgba("+t+", "+e+", "+n+", "+this.roundA+")"},t.prototype.toPercentageRgb=function(){var t=function(t){return Math.round(100*T(t,255))+"%"};return{r:t(this.r),g:t(this.g),b:t(this.b),a:this.a}},t.prototype.toPercentageRgbString=function(){var t=function(t){return Math.round(100*T(t,255))};return 1===this.a?"rgb("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%)":"rgba("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%, "+this.roundA+")"},t.prototype.toName=function(){if(0===this.a)return"transparent";if(this.a<1)return!1;for(var t="#"+O(this.r,this.g,this.b,!1),e=0,n=Object.keys(I);e<n.length;e++){var i=n[e];if(I[i]===t)return i}return!1},t.prototype.toString=function(t){var e=Boolean(t);t=null!=t?t:this.format;var n=!1,i=this.a<1&&this.a>=0;return e||!i||!t.startsWith("hex")&&"name"!==t?("rgb"===t&&(n=this.toRgbString()),"prgb"===t&&(n=this.toPercentageRgbString()),"hex"!==t&&"hex6"!==t||(n=this.toHexString()),"hex3"===t&&(n=this.toHexString(!0)),"hex4"===t&&(n=this.toHex8String(!0)),"hex8"===t&&(n=this.toHex8String()),"name"===t&&(n=this.toName()),"hsl"===t&&(n=this.toHslString()),"hsv"===t&&(n=this.toHsvString()),n||this.toHexString()):"name"===t&&0===this.a?this.toName():this.toRgbString()},t.prototype.clone=function(){return new t(this.toString())},t.prototype.lighten=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l+=e/100,n.l=$(n.l),new t(n)},t.prototype.brighten=function(e){void 0===e&&(e=10);var n=this.toRgb();return n.r=Math.max(0,Math.min(255,n.r-Math.round(-e/100*255))),n.g=Math.max(0,Math.min(255,n.g-Math.round(-e/100*255))),n.b=Math.max(0,Math.min(255,n.b-Math.round(-e/100*255))),new t(n)},t.prototype.darken=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l-=e/100,n.l=$(n.l),new t(n)},t.prototype.tint=function(t){return void 0===t&&(t=10),this.mix("white",t)},t.prototype.shade=function(t){return void 0===t&&(t=10),this.mix("black",t)},t.prototype.desaturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s-=e/100,n.s=$(n.s),new t(n)},t.prototype.saturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s+=e/100,n.s=$(n.s),new t(n)},t.prototype.greyscale=function(){return this.desaturate(100)},t.prototype.spin=function(e){var n=this.toHsl(),i=(n.h+e)%360;return n.h=i<0?360+i:i,new t(n)},t.prototype.mix=function(e,n){void 0===n&&(n=50);var i=this.toRgb(),o=new t(e).toRgb(),r=n/100;return new t({r:(o.r-i.r)*r+i.r,g:(o.g-i.g)*r+i.g,b:(o.b-i.b)*r+i.b,a:(o.a-i.a)*r+i.a})},t.prototype.analogous=function(e,n){void 0===e&&(e=6),void 0===n&&(n=30);var i=this.toHsl(),o=360/n,r=[this];for(i.h=(i.h-(o*e>>1)+720)%360;--e;)i.h=(i.h+o)%360,r.push(new t(i));return r},t.prototype.complement=function(){var e=this.toHsl();return e.h=(e.h+180)%360,new t(e)},t.prototype.monochromatic=function(e){void 0===e&&(e=6);for(var n=this.toHsv(),i=n.h,o=n.s,r=n.v,s=[],a=1/e;e--;)s.push(new t({h:i,s:o,v:r})),r=(r+a)%1;return s},t.prototype.splitcomplement=function(){var e=this.toHsl(),n=e.h;return[this,new t({h:(n+72)%360,s:e.s,l:e.l}),new t({h:(n+216)%360,s:e.s,l:e.l})]},t.prototype.triad=function(){return this.polyad(3)},t.prototype.tetrad=function(){return this.polyad(4)},t.prototype.polyad=function(e){for(var n=this.toHsl(),i=n.h,o=[this],r=360/e,s=1;s<e;s++)o.push(new t({h:(i+s*r)%360,s:n.s,l:n.l}));return o},t.prototype.equals=function(e){return this.toRgbString()===new t(e).toRgbString()},t}();function X(t,e){return void 0===t&&(t=""),void 0===e&&(e={}),new W(t,e)}const J=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),V=J.prototype.html,U=J.prototype.css;function B(t,e,n=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},n)n.dispatchEvent(t);else{var i=function(){var t=document.querySelector("hc-main");return t=t?(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("hc-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-view"):(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=(t=document.querySelector("home-assistant"))&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root"))&&t.shadowRoot)&&t.querySelector("ha-app-layout #view"))&&t.firstElementChild}();i&&i.dispatchEvent(t)}}function Z(t,e){const n=document.createElement("hui-error-card");return n.setConfig({type:"error",error:t,origConfig:e}),n}function G(t,e){if(!e||"object"!=typeof e||!e.type)return Z(`No ${t} type configured`,e);let n=e.type;if(n=n.startsWith("custom:")?n.substr("custom:".length):`hui-${n}-${t}`,customElements.get(n))return function(t,e){const n=document.createElement(t);try{n.setConfig({...e})}catch(t){return Z(t,e)}return n}(n,e);const i=Z(`Custom element doesn't exist: ${n}.`,e);i.style.display="None";const o=setTimeout(()=>{i.style.display=""},2e3);return customElements.whenDefined(n).then(()=>{clearTimeout(o),B("ll-rebuild",{},i)}),i}class K extends J{static get version(){return 2}static get properties(){return{noHass:{type:Boolean}}}setConfig(t){var e;this._config=t,this.el?this.el.setConfig(t):(this.el=this.create(t),this._hass&&(this.el.hass=this._hass),this.noHass&&(e=this,document.querySelector("hc-main")?document.querySelector("hc-main").provideHass(e):document.querySelector("home-assistant")&&document.querySelector("home-assistant").provideHass(e)))}set config(t){this.setConfig(t)}set hass(t){this._hass=t,this.el&&(this.el.hass=t)}createRenderRoot(){return this}render(){return V`${this.el}`}}const Q=function(t,e){const n=Object.getOwnPropertyDescriptors(e.prototype);for(const[e,i]of Object.entries(n))"constructor"!==e&&Object.defineProperty(t.prototype,e,i);const i=Object.getOwnPropertyDescriptors(e);for(const[e,n]of Object.entries(i))"prototype"!==e&&Object.defineProperty(t,e,n);const o=Object.getPrototypeOf(e),r=Object.getOwnPropertyDescriptors(o.prototype);for(const[e,n]of Object.entries(r))"constructor"!==e&&Object.defineProperty(Object.getPrototypeOf(t).prototype,e,n);const s=Object.getOwnPropertyDescriptors(o);for(const[e,n]of Object.entries(s))"prototype"!==e&&Object.defineProperty(Object.getPrototypeOf(t),e,n)},tt=customElements.get("card-maker");if(!tt||!tt.version||tt.version<2){class t extends K{create(t){return function(t){return G("card",t)}(t)}getCardSize(){return this.firstElementChild&&this.firstElementChild.getCardSize?this.firstElementChild.getCardSize():1}}tt?Q(tt,t):customElements.define("card-maker",t)}const et=customElements.get("element-maker");if(!et||!et.version||et.version<2){class t extends K{create(t){return function(t){return G("element",t)}(t)}}et?Q(et,t):customElements.define("element-maker",t)}const nt=customElements.get("entity-row-maker");if(!nt||!nt.version||nt.version<2){class t extends K{create(t){return function(t){const e=new Set(["call-service","cast","conditional","divider","section","select","weblink"]);if(!t)return Z("Invalid configuration given.",t);if("string"==typeof t&&(t={entity:t}),"object"!=typeof t||!t.entity&&!t.type)return Z("Invalid configuration given.",t);const n=t.type||"default";return e.has(n)||n.startsWith("custom:")?G("row",t):G("entity-row",{type:{alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"}[t.entity.split(".",1)[0]]||"text",...t})}(t)}}nt?Q(nt,t):customElements.define("entity-row-maker",t)}function it(t,e=!1){const n=document.querySelector("hc-main")||document.querySelector("home-assistant");B("hass-more-info",{entityId:t},n);const i=n._moreInfoEl;return i.large=e,i}let ot=function(){if(window.fully&&"function"==typeof fully.getDeviceId)return fully.getDeviceId();if(!localStorage["lovelace-player-device-id"]){const t=()=>Math.floor(1e5*(1+Math.random())).toString(16).substring(1);localStorage["lovelace-player-device-id"]=`${t()}${t()}-${t()}${t()}`}return localStorage["lovelace-player-device-id"]}();!function(t,e){t(e={exports:{}},e.exports)}((function(t){
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(e,n,i,o){var r,s=["","webkit","Moz","MS","ms","o"],a=n.createElement("div"),c=Math.round,u=Math.abs,l=Date.now;function h(t,e,n){return setTimeout(v(t,n),e)}function d(t,e,n){return!!Array.isArray(t)&&(p(t,n[e],n),!0)}function p(t,e,n){var i;if(t)if(t.forEach)t.forEach(e,n);else if(void 0!==t.length)for(i=0;i<t.length;)e.call(n,t[i],i,t),i++;else for(i in t)t.hasOwnProperty(i)&&e.call(n,t[i],i,t)}function f(t,n,i){var o="DEPRECATED METHOD: "+n+"\n"+i+" AT \n";return function(){var n=new Error("get-stack-trace"),i=n&&n.stack?n.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",r=e.console&&(e.console.warn||e.console.log);return r&&r.call(e.console,o,i),t.apply(this,arguments)}}r="function"!=typeof Object.assign?function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var i=arguments[n];if(null!=i)for(var o in i)i.hasOwnProperty(o)&&(e[o]=i[o])}return e}:Object.assign;var m=f((function(t,e,n){for(var i=Object.keys(e),o=0;o<i.length;)(!n||n&&void 0===t[i[o]])&&(t[i[o]]=e[i[o]]),o++;return t}),"extend","Use `assign`."),g=f((function(t,e){return m(t,e,!0)}),"merge","Use `assign`.");function b(t,e,n){var i,o=e.prototype;(i=t.prototype=Object.create(o)).constructor=t,i._super=o,n&&r(i,n)}function v(t,e){return function(){return t.apply(e,arguments)}}function y(t,e){return"function"==typeof t?t.apply(e&&e[0]||void 0,e):t}function w(t,e){return void 0===t?e:t}function _(t,e,n){p(T(e),(function(e){t.addEventListener(e,n,!1)}))}function x(t,e,n){p(T(e),(function(e){t.removeEventListener(e,n,!1)}))}function k(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1}function S(t,e){return t.indexOf(e)>-1}function T(t){return t.trim().split(/\s+/g)}function $(t,e,n){if(t.indexOf&&!n)return t.indexOf(e);for(var i=0;i<t.length;){if(n&&t[i][n]==e||!n&&t[i]===e)return i;i++}return-1}function M(t){return Array.prototype.slice.call(t,0)}function E(t,e,n){for(var i=[],o=[],r=0;r<t.length;){var s=e?t[r][e]:t[r];$(o,s)<0&&i.push(t[r]),o[r]=s,r++}return n&&(i=e?i.sort((function(t,n){return t[e]>n[e]})):i.sort()),i}function A(t,e){for(var n,i,o=e[0].toUpperCase()+e.slice(1),r=0;r<s.length;){if((i=(n=s[r])?n+o:e)in t)return i;r++}}var C=1;function P(t){var n=t.ownerDocument||t;return n.defaultView||n.parentWindow||e}var D="ontouchstart"in e,O=void 0!==A(e,"PointerEvent"),z=D&&/mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent),R=["x","y"],H=["clientX","clientY"];function I(t,e){var n=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,this.domHandler=function(e){y(t.options.enable,[t])&&n.handler(e)},this.init()}function F(t,e,n){var i=n.pointers.length,o=n.changedPointers.length,r=1&e&&i-o==0,s=12&e&&i-o==0;n.isFirst=!!r,n.isFinal=!!s,r&&(t.session={}),n.eventType=e,function(t,e){var n=t.session,i=e.pointers,o=i.length;n.firstInput||(n.firstInput=N(e));o>1&&!n.firstMultiple?n.firstMultiple=N(e):1===o&&(n.firstMultiple=!1);var r=n.firstInput,s=n.firstMultiple,a=s?s.center:r.center,c=e.center=Y(i);e.timeStamp=l(),e.deltaTime=e.timeStamp-r.timeStamp,e.angle=W(a,c),e.distance=L(a,c),function(t,e){var n=e.center,i=t.offsetDelta||{},o=t.prevDelta||{},r=t.prevInput||{};1!==e.eventType&&4!==r.eventType||(o=t.prevDelta={x:r.deltaX||0,y:r.deltaY||0},i=t.offsetDelta={x:n.x,y:n.y});e.deltaX=o.x+(n.x-i.x),e.deltaY=o.y+(n.y-i.y)}(n,e),e.offsetDirection=j(e.deltaX,e.deltaY);var h=q(e.deltaTime,e.deltaX,e.deltaY);e.overallVelocityX=h.x,e.overallVelocityY=h.y,e.overallVelocity=u(h.x)>u(h.y)?h.x:h.y,e.scale=s?(d=s.pointers,p=i,L(p[0],p[1],H)/L(d[0],d[1],H)):1,e.rotation=s?function(t,e){return W(e[1],e[0],H)+W(t[1],t[0],H)}(s.pointers,i):0,e.maxPointers=n.prevInput?e.pointers.length>n.prevInput.maxPointers?e.pointers.length:n.prevInput.maxPointers:e.pointers.length,function(t,e){var n,i,o,r,s=t.lastInterval||e,a=e.timeStamp-s.timeStamp;if(8!=e.eventType&&(a>25||void 0===s.velocity)){var c=e.deltaX-s.deltaX,l=e.deltaY-s.deltaY,h=q(a,c,l);i=h.x,o=h.y,n=u(h.x)>u(h.y)?h.x:h.y,r=j(c,l),t.lastInterval=e}else n=s.velocity,i=s.velocityX,o=s.velocityY,r=s.direction;e.velocity=n,e.velocityX=i,e.velocityY=o,e.direction=r}(n,e);var d,p;var f=t.element;k(e.srcEvent.target,f)&&(f=e.srcEvent.target);e.target=f}(t,n),t.emit("hammer.input",n),t.recognize(n),t.session.prevInput=n}function N(t){for(var e=[],n=0;n<t.pointers.length;)e[n]={clientX:c(t.pointers[n].clientX),clientY:c(t.pointers[n].clientY)},n++;return{timeStamp:l(),pointers:e,center:Y(e),deltaX:t.deltaX,deltaY:t.deltaY}}function Y(t){var e=t.length;if(1===e)return{x:c(t[0].clientX),y:c(t[0].clientY)};for(var n=0,i=0,o=0;o<e;)n+=t[o].clientX,i+=t[o].clientY,o++;return{x:c(n/e),y:c(i/e)}}function q(t,e,n){return{x:e/t||0,y:n/t||0}}function j(t,e){return t===e?1:u(t)>=u(e)?t<0?2:4:e<0?8:16}function L(t,e,n){n||(n=R);var i=e[n[0]]-t[n[0]],o=e[n[1]]-t[n[1]];return Math.sqrt(i*i+o*o)}function W(t,e,n){n||(n=R);var i=e[n[0]]-t[n[0]],o=e[n[1]]-t[n[1]];return 180*Math.atan2(o,i)/Math.PI}I.prototype={handler:function(){},init:function(){this.evEl&&_(this.element,this.evEl,this.domHandler),this.evTarget&&_(this.target,this.evTarget,this.domHandler),this.evWin&&_(P(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&x(this.element,this.evEl,this.domHandler),this.evTarget&&x(this.target,this.evTarget,this.domHandler),this.evWin&&x(P(this.element),this.evWin,this.domHandler)}};var X={mousedown:1,mousemove:2,mouseup:4};function J(){this.evEl="mousedown",this.evWin="mousemove mouseup",this.pressed=!1,I.apply(this,arguments)}b(J,I,{handler:function(t){var e=X[t.type];1&e&&0===t.button&&(this.pressed=!0),2&e&&1!==t.which&&(e=4),this.pressed&&(4&e&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:"mouse",srcEvent:t}))}});var V={pointerdown:1,pointermove:2,pointerup:4,pointercancel:8,pointerout:8},U={2:"touch",3:"pen",4:"mouse",5:"kinect"},B="pointerdown",Z="pointermove pointerup pointercancel";function G(){this.evEl=B,this.evWin=Z,I.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}e.MSPointerEvent&&!e.PointerEvent&&(B="MSPointerDown",Z="MSPointerMove MSPointerUp MSPointerCancel"),b(G,I,{handler:function(t){var e=this.store,n=!1,i=t.type.toLowerCase().replace("ms",""),o=V[i],r=U[t.pointerType]||t.pointerType,s="touch"==r,a=$(e,t.pointerId,"pointerId");1&o&&(0===t.button||s)?a<0&&(e.push(t),a=e.length-1):12&o&&(n=!0),a<0||(e[a]=t,this.callback(this.manager,o,{pointers:e,changedPointers:[t],pointerType:r,srcEvent:t}),n&&e.splice(a,1))}});var K={touchstart:1,touchmove:2,touchend:4,touchcancel:8};function Q(){this.evTarget="touchstart",this.evWin="touchstart touchmove touchend touchcancel",this.started=!1,I.apply(this,arguments)}function tt(t,e){var n=M(t.touches),i=M(t.changedTouches);return 12&e&&(n=E(n.concat(i),"identifier",!0)),[n,i]}b(Q,I,{handler:function(t){var e=K[t.type];if(1===e&&(this.started=!0),this.started){var n=tt.call(this,t,e);12&e&&n[0].length-n[1].length==0&&(this.started=!1),this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t})}}});var et={touchstart:1,touchmove:2,touchend:4,touchcancel:8};function nt(){this.evTarget="touchstart touchmove touchend touchcancel",this.targetIds={},I.apply(this,arguments)}function it(t,e){var n=M(t.touches),i=this.targetIds;if(3&e&&1===n.length)return i[n[0].identifier]=!0,[n,n];var o,r,s=M(t.changedTouches),a=[],c=this.target;if(r=n.filter((function(t){return k(t.target,c)})),1===e)for(o=0;o<r.length;)i[r[o].identifier]=!0,o++;for(o=0;o<s.length;)i[s[o].identifier]&&a.push(s[o]),12&e&&delete i[s[o].identifier],o++;return a.length?[E(r.concat(a),"identifier",!0),a]:void 0}b(nt,I,{handler:function(t){var e=et[t.type],n=it.call(this,t,e);n&&this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t})}});function ot(){I.apply(this,arguments);var t=v(this.handler,this);this.touch=new nt(this.manager,t),this.mouse=new J(this.manager,t),this.primaryTouch=null,this.lastTouches=[]}function rt(t,e){1&t?(this.primaryTouch=e.changedPointers[0].identifier,st.call(this,e)):12&t&&st.call(this,e)}function st(t){var e=t.changedPointers[0];if(e.identifier===this.primaryTouch){var n={x:e.clientX,y:e.clientY};this.lastTouches.push(n);var i=this.lastTouches;setTimeout((function(){var t=i.indexOf(n);t>-1&&i.splice(t,1)}),2500)}}function at(t){for(var e=t.srcEvent.clientX,n=t.srcEvent.clientY,i=0;i<this.lastTouches.length;i++){var o=this.lastTouches[i],r=Math.abs(e-o.x),s=Math.abs(n-o.y);if(r<=25&&s<=25)return!0}return!1}b(ot,I,{handler:function(t,e,n){var i="touch"==n.pointerType,o="mouse"==n.pointerType;if(!(o&&n.sourceCapabilities&&n.sourceCapabilities.firesTouchEvents)){if(i)rt.call(this,e,n);else if(o&&at.call(this,n))return;this.callback(t,e,n)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var ct=A(a.style,"touchAction"),ut=void 0!==ct,lt=function(){if(!ut)return!1;var t={},n=e.CSS&&e.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach((function(i){t[i]=!n||e.CSS.supports("touch-action",i)})),t}();function ht(t,e){this.manager=t,this.set(e)}ht.prototype={set:function(t){"compute"==t&&(t=this.compute()),ut&&this.manager.element.style&&lt[t]&&(this.manager.element.style[ct]=t),this.actions=t.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var t=[];return p(this.manager.recognizers,(function(e){y(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))})),function(t){if(S(t,"none"))return"none";var e=S(t,"pan-x"),n=S(t,"pan-y");if(e&&n)return"none";if(e||n)return e?"pan-x":"pan-y";if(S(t,"manipulation"))return"manipulation";return"auto"}(t.join(" "))},preventDefaults:function(t){var e=t.srcEvent,n=t.offsetDirection;if(this.manager.session.prevented)e.preventDefault();else{var i=this.actions,o=S(i,"none")&&!lt.none,r=S(i,"pan-y")&&!lt["pan-y"],s=S(i,"pan-x")&&!lt["pan-x"];if(o){var a=1===t.pointers.length,c=t.distance<2,u=t.deltaTime<250;if(a&&c&&u)return}if(!s||!r)return o||r&&6&n||s&&24&n?this.preventSrc(e):void 0}},preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault()}};function dt(t){this.options=r({},this.defaults,t||{}),this.id=C++,this.manager=null,this.options.enable=w(this.options.enable,!0),this.state=1,this.simultaneous={},this.requireFail=[]}function pt(t){return 16&t?"cancel":8&t?"end":4&t?"move":2&t?"start":""}function ft(t){return 16==t?"down":8==t?"up":2==t?"left":4==t?"right":""}function mt(t,e){var n=e.manager;return n?n.get(t):t}function gt(){dt.apply(this,arguments)}function bt(){gt.apply(this,arguments),this.pX=null,this.pY=null}function vt(){gt.apply(this,arguments)}function yt(){dt.apply(this,arguments),this._timer=null,this._input=null}function wt(){gt.apply(this,arguments)}function _t(){gt.apply(this,arguments)}function xt(){dt.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function kt(t,e){return(e=e||{}).recognizers=w(e.recognizers,kt.defaults.preset),new St(t,e)}dt.prototype={defaults:{},set:function(t){return r(this.options,t),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(t){if(d(t,"recognizeWith",this))return this;var e=this.simultaneous;return e[(t=mt(t,this)).id]||(e[t.id]=t,t.recognizeWith(this)),this},dropRecognizeWith:function(t){return d(t,"dropRecognizeWith",this)?this:(t=mt(t,this),delete this.simultaneous[t.id],this)},requireFailure:function(t){if(d(t,"requireFailure",this))return this;var e=this.requireFail;return-1===$(e,t=mt(t,this))&&(e.push(t),t.requireFailure(this)),this},dropRequireFailure:function(t){if(d(t,"dropRequireFailure",this))return this;t=mt(t,this);var e=$(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(t){return!!this.simultaneous[t.id]},emit:function(t){var e=this,n=this.state;function i(n){e.manager.emit(n,t)}n<8&&i(e.options.event+pt(n)),i(e.options.event),t.additionalEvent&&i(t.additionalEvent),n>=8&&i(e.options.event+pt(n))},tryEmit:function(t){if(this.canEmit())return this.emit(t);this.state=32},canEmit:function(){for(var t=0;t<this.requireFail.length;){if(!(33&this.requireFail[t].state))return!1;t++}return!0},recognize:function(t){var e=r({},t);if(!y(this.options.enable,[this,e]))return this.reset(),void(this.state=32);56&this.state&&(this.state=1),this.state=this.process(e),30&this.state&&this.tryEmit(e)},process:function(t){},getTouchAction:function(){},reset:function(){}},b(gt,dt,{defaults:{pointers:1},attrTest:function(t){var e=this.options.pointers;return 0===e||t.pointers.length===e},process:function(t){var e=this.state,n=t.eventType,i=6&e,o=this.attrTest(t);return i&&(8&n||!o)?16|e:i||o?4&n?8|e:2&e?4|e:2:32}}),b(bt,gt,{defaults:{event:"pan",threshold:10,pointers:1,direction:30},getTouchAction:function(){var t=this.options.direction,e=[];return 6&t&&e.push("pan-y"),24&t&&e.push("pan-x"),e},directionTest:function(t){var e=this.options,n=!0,i=t.distance,o=t.direction,r=t.deltaX,s=t.deltaY;return o&e.direction||(6&e.direction?(o=0===r?1:r<0?2:4,n=r!=this.pX,i=Math.abs(t.deltaX)):(o=0===s?1:s<0?8:16,n=s!=this.pY,i=Math.abs(t.deltaY))),t.direction=o,n&&i>e.threshold&&o&e.direction},attrTest:function(t){return gt.prototype.attrTest.call(this,t)&&(2&this.state||!(2&this.state)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=ft(t.direction);e&&(t.additionalEvent=this.options.event+e),this._super.emit.call(this,t)}}),b(vt,gt,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return["none"]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||2&this.state)},emit:function(t){if(1!==t.scale){var e=t.scale<1?"in":"out";t.additionalEvent=this.options.event+e}this._super.emit.call(this,t)}}),b(yt,dt,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return["auto"]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,o=t.deltaTime>e.time;if(this._input=t,!i||!n||12&t.eventType&&!o)this.reset();else if(1&t.eventType)this.reset(),this._timer=h((function(){this.state=8,this.tryEmit()}),e.time,this);else if(4&t.eventType)return 8;return 32},reset:function(){clearTimeout(this._timer)},emit:function(t){8===this.state&&(t&&4&t.eventType?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=l(),this.manager.emit(this.options.event,this._input)))}}),b(wt,gt,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return["none"]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||2&this.state)}}),b(_t,gt,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:30,pointers:1},getTouchAction:function(){return bt.prototype.getTouchAction.call(this)},attrTest:function(t){var e,n=this.options.direction;return 30&n?e=t.overallVelocity:6&n?e=t.overallVelocityX:24&n&&(e=t.overallVelocityY),this._super.attrTest.call(this,t)&&n&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers==this.options.pointers&&u(e)>this.options.velocity&&4&t.eventType},emit:function(t){var e=ft(t.offsetDirection);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)}}),b(xt,dt,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return["manipulation"]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,i=t.distance<e.threshold,o=t.deltaTime<e.time;if(this.reset(),1&t.eventType&&0===this.count)return this.failTimeout();if(i&&o&&n){if(4!=t.eventType)return this.failTimeout();var r=!this.pTime||t.timeStamp-this.pTime<e.interval,s=!this.pCenter||L(this.pCenter,t.center)<e.posThreshold;if(this.pTime=t.timeStamp,this.pCenter=t.center,s&&r?this.count+=1:this.count=1,this._input=t,0===this.count%e.taps)return this.hasRequireFailures()?(this._timer=h((function(){this.state=8,this.tryEmit()}),e.interval,this),2):8}return 32},failTimeout:function(){return this._timer=h((function(){this.state=32}),this.options.interval,this),32},reset:function(){clearTimeout(this._timer)},emit:function(){8==this.state&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),kt.VERSION="2.0.7",kt.defaults={domEvents:!1,touchAction:"compute",enable:!0,inputTarget:null,inputClass:null,preset:[[wt,{enable:!1}],[vt,{enable:!1},["rotate"]],[_t,{direction:6}],[bt,{direction:6},["swipe"]],[xt],[xt,{event:"doubletap",taps:2},["tap"]],[yt]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};function St(t,e){var n;this.options=r({},kt.defaults,e||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=t,this.input=new((n=this).options.inputClass||(O?G:z?nt:D?ot:J))(n,F),this.touchAction=new ht(this,this.options.touchAction),Tt(this,!0),p(this.options.recognizers,(function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])}),this)}function Tt(t,e){var n,i=t.element;i.style&&(p(t.options.cssProps,(function(o,r){n=A(i.style,r),e?(t.oldCssProps[n]=i.style[n],i.style[n]=o):i.style[n]=t.oldCssProps[n]||""})),e||(t.oldCssProps={}))}St.prototype={set:function(t){return r(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this},stop:function(t){this.session.stopped=t?2:1},recognize:function(t){var e=this.session;if(!e.stopped){var n;this.touchAction.preventDefaults(t);var i=this.recognizers,o=e.curRecognizer;(!o||o&&8&o.state)&&(o=e.curRecognizer=null);for(var r=0;r<i.length;)n=i[r],2===e.stopped||o&&n!=o&&!n.canRecognizeWith(o)?n.reset():n.recognize(t),!o&&14&n.state&&(o=e.curRecognizer=n),r++}},get:function(t){if(t instanceof dt)return t;for(var e=this.recognizers,n=0;n<e.length;n++)if(e[n].options.event==t)return e[n];return null},add:function(t){if(d(t,"add",this))return this;var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},remove:function(t){if(d(t,"remove",this))return this;if(t=this.get(t)){var e=this.recognizers,n=$(e,t);-1!==n&&(e.splice(n,1),this.touchAction.update())}return this},on:function(t,e){if(void 0!==t&&void 0!==e){var n=this.handlers;return p(T(t),(function(t){n[t]=n[t]||[],n[t].push(e)})),this}},off:function(t,e){if(void 0!==t){var n=this.handlers;return p(T(t),(function(t){e?n[t]&&n[t].splice($(n[t],e),1):delete n[t]})),this}},emit:function(t,e){this.options.domEvents&&function(t,e){var i=n.createEvent("Event");i.initEvent(t,!0,!0),i.gesture=e,e.target.dispatchEvent(i)}(t,e);var i=this.handlers[t]&&this.handlers[t].slice();if(i&&i.length){e.type=t,e.preventDefault=function(){e.srcEvent.preventDefault()};for(var o=0;o<i.length;)i[o](e),o++}},destroy:function(){this.element&&Tt(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},r(kt,{INPUT_START:1,INPUT_MOVE:2,INPUT_END:4,INPUT_CANCEL:8,STATE_POSSIBLE:1,STATE_BEGAN:2,STATE_CHANGED:4,STATE_ENDED:8,STATE_RECOGNIZED:8,STATE_CANCELLED:16,STATE_FAILED:32,DIRECTION_NONE:1,DIRECTION_LEFT:2,DIRECTION_RIGHT:4,DIRECTION_UP:8,DIRECTION_DOWN:16,DIRECTION_HORIZONTAL:6,DIRECTION_VERTICAL:24,DIRECTION_ALL:30,Manager:St,Input:I,TouchAction:ht,TouchInput:nt,MouseInput:J,PointerEventInput:G,TouchMouseInput:ot,SingleTouchInput:Q,Recognizer:dt,AttrRecognizer:gt,Tap:xt,Pan:bt,Swipe:_t,Pinch:vt,Rotate:wt,Press:yt,on:_,off:x,each:p,merge:g,extend:m,assign:r,inherit:b,bindFn:v,prefixed:A}),(void 0!==e?e:"undefined"!=typeof self?self:{}).Hammer=kt,t.exports?t.exports=kt:e.Hammer=kt}(window,document)}));customElements.define("homekit-card",class extends J{constructor(){super(...arguments),this.renderedRules=[],this.doubleTapped=!1,this.tileHoldAnimation=!1}static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entities&&!t.rows)throw new Error("You need to define entities: or rows:");if(!t.entities&&t.rows&&!t.enableColumns)throw new Error("If you use rows and columns you need to set enableColumns: true");t.useTemperature||(t.useTemperature=!1),t.useBrightness||(t.useBrightness=!0),this.config=t,this.rowTitleColor=!!this.config.titleColor&&this.config.titleColor,this.horizontalScroll="horizontalScroll"in this.config&&this.config.fullscreen,this.enableColumns="enableColumns"in this.config&&this.config.enableColumns,this.statePositionTop="statePositionTop"in this.config&&this.config.statePositionTop,this.tileHoldAnimation="tileHoldAnimation"in this.config&&this.config.statePositionTop,this.rulesColor=!!this.config.rulesColor&&this.config.rulesColor}addHammer(t){var e=new Hammer(t,{}),n=this;e.on("tap doubletap pressup press panmove",(function(t){t.preventDefault();var e=t.target.dataset,i=JSON.parse(e.ent),o=JSON.parse(e.row);if(n.doubleTapped=!1,"tap"==t.type){n.doubleTapped=!1;var r=200;i.double_tap_action||(r=0),setTimeout((function(){!1===n.doubleTapped&&(t.target.classList.remove("longpress"),n._handleClick(t.type,i,e.type,o))}),r)}else{"doubletap"==t.type&&(n.doubleTapped=!0);e=t.target.dataset;"press"==t.type?t.target.classList.add("longpress"):"panmove"==t.type?t.target.classList.remove("longpress"):(t.target.classList.remove("longpress"),n._handleClick(t.type,i,e.type,o))}}))}render(){return V`
      <div class="container${this.enableColumns?" rows":""}" >
        ${this.config.home?V`
            <div class="header">
                ${this.config.title?V`<h1 style="${this.rowTitleColor?"color:"+this.rowTitleColor:""}">${this.config.title}</h1>`:V``}
                <ul style="${this.rulesColor?"color:"+this.rulesColor:""}">
                  ${this.renderedRules.map(t=>V`<li>${t}</li>`)}
                </ul>
            </div>
        `:V``}
       
        ${this.enableColumns?this._renderRows():this._renderEntities(this.config.entities)}
      </div>
    `}firstUpdated(){for(var t=this.shadowRoot.querySelectorAll("homekit-button.event"),e=0;e<t.length;e++)this.addHammer(t[e]);this.shadowRoot.querySelectorAll("card-maker").forEach(t=>{var e={type:t.dataset.card};e=Object.assign({},e,JSON.parse(t.dataset.options)),t.config=e;let n="";if(t.dataset.style?n=t.dataset.style:"custom:mini-graph-card"==t.dataset.card&&(n=":host { height: 100%; } ha-card { background: transparent; color: #000; padding: 0!important; box-shadow: none; } .header { padding: 10px 10px 0 10px; } .header .name, .header .name .ellipsis { font-size: 13px!important; font-weight: 500; color: #000; opacity: 1; } .states { padding: 0 10px; } .states .state .state__value { font-size: 1.8rem; } .header .icon { color: rgba(111, 11, 11, 0.6); }"),""!=n){let e=0,i=setInterval((function(){let o=t.children[0];if(o){window.clearInterval(i);var r=document.createElement("style");r.innerHTML=n,o.shadowRoot.appendChild(r)}else 10==++e&&window.clearInterval(i)}),100)}})}updated(){this._renderRules()}_renderRows(){return V`
      ${this.config.rows.map(t=>V`
          <div class="row">
            ${t.columns.map(t=>V`
                <div class="col${t.tileOnRow?" fixed":""}" style="${t.tileOnRow?"--tile-on-row:"+t.tileOnRow:""}">
                  ${this._renderEntities(t.entities)}
                </div>
              `)}
          </div>
        `)}
    `}_renderState(t,e,n,i){return"light"==i&&(e.attributes.brightness||t.state)?this.statePositionTop?this._renderCircleState(t,e,i):V`
          <span class=" ${n.includes(e.state)?"value":"value on"}">${this._renderStateValue(t,e,i)}</span>
        `:"sensor"!=i&&"binary_sensor"!=i||!e.last_changed?"switch"!=i&&"input_boolean"!=i||!t.state?"climate"==i&&e.attributes.temperature?this.statePositionTop?this._renderCircleState(t,e,i):V`
          <span class=" ${n.includes(e.state)?"value":"value on"}">${this._renderStateValue(t,e,i)}</span>
        `:t.state?this.statePositionTop?this._renderCircleState(t,e,i):V`
            <span class="value on">${this._renderStateValue(t,e,i)}</span>
          `:void 0:this.statePositionTop?this._renderCircleState(t,e,i):V`
          <span class="value on">${this._renderStateValue(t,e,i)}</span>
        `:this.statePositionTop?this._renderCircleState(t,e,i):V`
          <span class="previous">${this._renderStateValue(t,e,i)}</span>
        `}_renderCircleState(t,e,n){return V`
      <svg class="circle-state" viewbox="0 0 100 100" style="${e.attributes.brightness&&!t.state?"--percentage:"+e.attributes.brightness/2.55:""}">
        <path id="progress" stroke-width="3" stroke="#aaabad" fill="none"
              d="M50 10
                a 40 40 0 0 1 0 80
                a 40 40 0 0 1 0 -80">
        </path>
        <text id="count" x="50" y="50" fill="#7d7e80" text-anchor="middle" dy="7" font-size="25">${this._renderStateValue(t,e,n)}</text>
      </svg>
    `}_renderStateValue(t,e,n){return"light"==n?V`
        ${e.attributes.brightness&&!t.state?V`${Math.round(e.attributes.brightness/2.55)}%`:V``}
        ${t.state?V`${v(this.hass.localize,this.hass.states[t.state],this.hass.language)}`:V``}
      `:"sensor"==n||"binary_sensor"==n?V`
        ${e.last_changed?V`${this._calculateTime(e.last_changed)}`:V``}
      `:"switch"==n||"input_boolean"==n?V`
        ${t.state?V`${v(this.hass.localize,this.hass.states[t.state],this.hass.language)}`:V``}
      `:"climate"==n?V`
        ${e.attributes.temperature?V`${e.attributes.temperature}&#176;`:V``}
      `:V`
      ${t.state?V`${v(this.hass.localize,this.hass.states[t.state],this.hass.language)}`:V``}
      `}_renderEntities(t){return V`
      ${t.map(t=>{var e=0;return V`
            <div class="card-title" style="${this.rowTitleColor?"color:"+this.rowTitleColor:""}">${t.title}</div>
                <div class="homekit-card${!0===this.horizontalScroll?" scroll":""}">
                    ${t.entities.map(n=>{if(!n.card&&!n.custom){var i=["off","unavailable"];n.offStates&&(i=n.offStates);const a=this.hass.states[n.entity];var o="#f7d959";3==e&&(e=0),4==e&&(e=2),o=n.color?n.color:this._getColorForLightEntity(a,this.config.useTemperature,this.config.useBrightness);var r=n.entity.split(".")[0];if("light"==r)return e++,a?V`
                                <homekit-button class="event ${i.includes(a.state)?"button":"button on"}${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}" data-ent="${JSON.stringify(n)}" data-type="${r}" data-row="${JSON.stringify(t)}">
                                    <div class="button-inner${this.statePositionTop?" state-top":""}">
                                      <span class="icon${!0!==n.spin||i.includes(a.state)?"":" spin"}" style="${i.includes(a.state)?"":"color:"+o+";"}">
                                        <ha-icon icon="${n.offIcon?i.includes(a.state)?n.offIcon:n.icon:n.icon||a.attributes.icon||x(b(a.entity_id),a.state)}" class=" ${n.spin&&"on"===a.state?"spin":""}"/>
                                      </span>
                                      <span class="${i.includes(a.state)?"name":"name on"}">${n.name||a.attributes.friendly_name}</span>
                                      <span class="${i.includes(a.state)?"state":"state on"}">
                                        ${v(this.hass.localize,a,this.hass.language)}
                                        ${this.statePositionTop?"":this._renderState(n,a,i,r)}
                                      </span>
                                      ${this.statePositionTop?this._renderState(n,a,i,r):""}
                                    </div>
                                </homekit-button>
                              ${3==e?V`<div class="break"></div>`:V``}
                              `:this._notFound(n);if("sensor"==r||"binary_sensor"==r)return e++,a?V`
                              <homekit-button class="event ${i.includes(a.state)?"button":"button on"}${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}" data-ent="${JSON.stringify(n)}" data-type="${r}" data-row="${JSON.stringify(t)}">
                                  <div class="button-inner${this.statePositionTop?" state-top":""}">
                                    <span class="${i.includes(a.state)?"icon":"icon on"}${!0!==n.spin||i.includes(a.state)?"":" spin"}">
                                      <ha-icon icon="${n.offIcon?i.includes(a.state)?n.offIcon:n.icon:n.icon||a.attributes.icon||x(b(a.entity_id),a.state)}" />
                                    </span>
                                    <span class="${i.includes(a.state)?"name":"name on"}">${n.name||a.attributes.friendly_name}</span>
                                    <span class="${i.includes(a.state)?"state":"state on"}">
                                      ${v(this.hass.localize,a,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,a,i,r)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,a,i,r):""}
                                  </div>
                              </homekit-button>
                            ${3==e?V`<div class="break"></div>`:V``}
                          `:this._notFound(n);if("switch"==r||"input_boolean"==r)return e++,a?V`
                              <homekit-button class="event ${i.includes(a.state)?"button":"button on"}${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}" data-ent="${JSON.stringify(n)}" data-type="${r}" data-row="${JSON.stringify(t)}">
                                  <div class="button-inner">
                                    <span class="${i.includes(a.state)?"icon":"icon on"}${!0!==n.spin||i.includes(a.state)?"":" spin"}">
                                      <ha-icon icon="${n.offIcon?i.includes(a.state)?n.offIcon:n.icon:n.icon||a.attributes.icon||x(b(a.entity_id),a.state)}" />
                                    </span>
                                    <span class="${i.includes(a.state)?"name":"name on"}">${n.name||a.attributes.friendly_name}</span>
                                    <span class="${i.includes(a.state)?"state":"state on"}">
                                      ${v(this.hass.localize,a,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,a,i,r)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,a,i,r):""}
                                  </div>
                              </homekit-button>
                            ${3==e?V`<div class="break"></div>`:V``}
                          `:this._notFound(n);if("weather"==r)return e+=2,a?V`
                            ${4==e?V`<div class="break"></div>`:V``}
                              <homekit-button class="event button size-2 on" data-ent="${JSON.stringify(n)}" data-type="${r}" data-row="${JSON.stringify(t)}">
                                  <div class="button-inner">
                                    <span class="icon on">
                                      <ha-icon icon="${n.icon||a.attributes.icon||"mdi:weather-"+a.state}" />
                                    </span>
                                    <span class="name on">${n.name||a.attributes.friendly_name}</span>
                                    <span class="state on">${v(this.hass.localize,a,this.hass.language)}
                                      ${a.attributes.forecast[0]&&a.attributes.forecast[0].precipitation?V`
                                          <span class="value on">${a.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                      `:V``}
                                    </span>
                                  </div>
                              </homekit-button>
                            ${3==e?V`<div class="break"></div>`:V``}
                          `:this._notFound(n);if("climate"==r){e++;var s="";return s="off"==a.state?"off":"heating"==a.attributes.hvac_action?"heat":"idle"==a.attributes.hvac_action?"idle":a.state in{auto:"hass:calendar-repeat",heat_cool:"hass:autorenew",heat:"hass:fire",cool:"hass:snowflake",off:"hass:power",fan_only:"hass:fan",dry:"hass:water-percent"}?a.state:"unknown-mode",a?V`
                              <homekit-button class="event ${i.includes(a.state)?"button":"button on"}${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}" data-ent="${JSON.stringify(n)}" data-type="${r}" data-row="${JSON.stringify(t)}">
                                  <div class="button-inner">
                                    <span class="${i.includes(a.state)?"icon climate "+s:"icon climate on "+s}">
                                      ${n.state?Math.round(this.hass.states[n.state].state):Math.round(a.attributes.current_temperature)}&#176;
                                    </span>
                                    <span class="${i.includes(a.state)?"name":"name on"}">${n.name||a.attributes.friendly_name}</span>
                                    <span class="${i.includes(a.state)?"state":"state on"}">
                                      ${v(this.hass.localize,a,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,a,i,r)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,a,i,r):""}
                                  </div>
                              </homekit-button>
                            ${3==e?V`<div class="break"></div>`:V``}
                          `:this._notFound(n)}return e++,a?V`
                              <homekit-button class="event ${i.includes(a.state)?"button":"button on"}${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}" data-ent="${JSON.stringify(n)}" data-type="${r}" data-row="${JSON.stringify(t)}">
                                  <div class="button-inner">
                                    <span class="${i.includes(a.state)?"icon":"icon on"}${!0!==n.spin||i.includes(a.state)?"":" spin"}">
                                      <ha-icon icon="${n.offIcon?i.includes(a.state)?n.offIcon:n.icon:n.icon||a.attributes.icon||x(b(a.entity_id),a.state)}" />
                                    </span>
                                    <span class="${i.includes(a.state)?"name":"name on"}">${n.name||a.attributes.friendly_name}</span>
                                    <span class="${i.includes(a.state)?"state":"state on"}">
                                      ${v(this.hass.localize,a,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,a,i,r)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,a,i,r):""}
                                  </div>
                              </homekit-button>
                            ${3==e?V`<div class="break"></div>`:V``}
                          `:this._notFound(n)}return n.card&&!n.custom?(e++,n.tap_action?V`
                            <homekit-button class="button on event${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}" data-ent="${JSON.stringify(n)}" data-type="'card'" data-row="${JSON.stringify(t)}">
                                <div class="button-inner">
                                  <card-maker nohass data-card="${n.card}" data-options="${JSON.stringify(n.cardOptions)}" data-style="${n.cardStyle?n.cardStyle:""}">
                                  </card-maker>
                                </div>
                            </homekit-button>
                          ${3==e?V`<div class="break"></div>`:V``}
                        `:V`
                              <homekit-button class="button on${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}">
                                  <div class="button-inner">
                                    <card-maker nohass data-card="${n.card}" data-options="${JSON.stringify(n.cardOptions)}" data-style="${n.cardStyle?n.cardStyle:""}">
                                    </card-maker>
                                  </div>
                              </homekit-button>
                            ${3==e?V`<div class="break"></div>`:V``}
                          `):n.custom?(e++,V`
                          <homekit-button class="button on event${n.noPadding?" no-padding":""}${n.wider?" size-2":""}${n.higher?" height-2":""}${this.tileHoldAnimation?" animate":""}" data-ent="${JSON.stringify(n)}" data-type="'custom'" data-row="${JSON.stringify(t)}">
                              <div class="button-inner">
                                <span class="icon on${!0===n.spin?" spin":""}">
                                  <ha-icon icon="${n.icon}" />
                                </span>
                                <span class="name on">${n.name}</span>
                                ${n.state?V`<span class="state">${v(this.hass.localize,this.hass.states[n.state],this.hass.language)}</span>`:V``}
                              </div>
                          </homekit-button>
                        ${3==e?V`<div class="break"></div>`:V``}
                        `):void 0})}
                </div>
            </div>
        `})}
    `}_renderRules(){!0===this.config.home&&this.config.rules&&async function(t,e,n={}){for(var i in t||(t=t()),n={},n=Object.assign({user:t.user.name,browser:ot,hash:location.hash.substr(1)||" "},n)){var o=new RegExp(`\\{${i}\\}`,"g");e=e.replace(o,n[i])}return t.callApi("POST","template",{template:e})}(this.hass,this.config.rules).then(t=>{if(t){var e=t.match(/<li>(.*?)<\/li>/gs).map((function(t){return t.replace(/<\/?li>/g,"")}));this.renderedRules=e}})}_calculateTime(t){const e=new Date,n=new Date(t),i=e.getTime()-n.getTime(),o=Math.floor(i/864e5),r=Math.floor(i%864e5/36e5),s=Math.round(i%864e5%36e5/6e4),a=Math.round(i%864e5%36e5%6e4/1e3);return o>0?this.statePositionTop?o+"d":o+" days ago":r>0?this.statePositionTop?r+"h":r+" hours ago":s>0?this.statePositionTop?s+"m":s+" minutes ago":this.statePositionTop?a+"s":a+" seconds ago"}_handleClick(t,e,n,i){var o=null;e.entity&&(o=this.hass.states[e.entity]),"light"==n?"tap"==t||"doubletap"==t?e.double_tap_action&&"doubletap"==t?this._customAction(e.double_tap_action):e.tap_action?this._customAction(e.tap_action):this._toggle(o,e.service):"pressup"==t&&(e.hold_action?this._customAction(e.hold_action):this._hold(o,e,i)):"sensor"==n||"binary_sensor"==n?("tap"!=t&&"doubletap"!=t||("doubletap"==t&&e.double_tap_action?this._customAction(e.double_tap_action):e.tap_action&&this._customAction(e.tap_action)),"pressup"==t&&(e.hold_action?this._customAction(e.hold_action):this._hold(o,e,i))):"switch"==n||"input_boolean"==n?"tap"==t||"doubletap"==t?"doubletap"==t&&e.double_tap_action?this._customAction(e.double_tap_action):e.tap_action?this._customAction(e.tap_action):this._toggle(o,e.service):"pressup"==t&&(e.hold_action?this._customAction(e.hold_action):this._hold(o,e,i)):"custom"==n?"tap"==t||"doubletap"==t?"doubletap"==t&&e.double_tap_action?this._customAction(e.double_tap_action):e.tap_action&&this._customAction(e.tap_action):"pressup"==t&&e.hold_action&&this._customAction(e.hold_action):"card"==n?"tap"==t||"doubletap"==t?"doubletap"==t&&e.double_tap_action?this._customAction(e.double_tap_action):e.tap_action&&this._customAction(e.tap_action):"pressup"==t&&e.hold_action&&this._customAction(e.hold_action):"tap"==t||"doubletap"==t?"doubletap"==t&&e.double_tap_action?this._customAction(e.double_tap_action):e.tap_action&&this._customAction(e.tap_action):"pressup"==t&&(e.hold_action?this._customAction(e.hold_action):this._hold(o,e,i))}_customAction(t){switch(t.action){case"more-info":(t.entity||t.camera_image)&&it(t.entity?t.entity:t.camera_image);break;case"navigate":t.navigation_path&&function(t,e,n){void 0===n&&(n=!1),n?history.replaceState(null,"",e):history.pushState(null,"",e),w(window,"location-changed",{replace:n})}(window,t.navigation_path);break;case"url":t.url_path&&window.open(t.url_path);break;case"toggle":t.entity&&(S(this.hass,t.entity),k("success"));break;case"call-service":{if(!t.service)return void k("failure");const[e,n]=t.service.split(".",2);this.hass.callService(e,n,t.service_data),k("success")}}}getCardSize(){return this.config.entities.length+1}_toggle(t,e){this.hass.callService("homeassistant",e||"toggle",{entity_id:t.entity_id})}_hold(t,e,n){if(n&&n.popup||e.popup){if(n.popup){var i=Object.assign({},n.popup,{entity:t.entity_id});if(e.popupExtend)i=Object.assign({},i,e.popupExtend)}else i=Object.assign({},e.popup,{entity:t.entity_id});!function(t,e,n=!1,i=null,o=!1){const r=document.querySelector("hc-main")||document.querySelector("home-assistant");B("hass-more-info",{entityId:null},r);const s=r._moreInfoEl;s.close(),s.open();const a=s.shadowRoot.querySelector("more-info-controls");a&&(a.style.display="none");const c=document.createElement("div");c.innerHTML=`\n  <style>\n    app-toolbar {\n      color: var(--more-info-header-color);\n      background-color: var(--more-info-header-background);\n    }\n    .scrollable {\n      overflow: auto;\n      max-width: 100% !important;\n    }\n  </style>\n  ${o?"":`\n      <app-toolbar>\n        <paper-icon-button\n          icon="hass:close"\n          dialog-dismiss=""\n        ></paper-icon-button>\n        <div class="main-title" main-title="">\n          ${t}\n        </div>\n      </app-toolbar>\n      `}\n    <div class="scrollable">\n      <card-maker nohass>\n      </card-maker>\n    </div>\n  `;const u=c.querySelector(".scrollable");u.querySelector("card-maker").config=e,s.sizingTarget=u,s.large=n,s._page="none",s.shadowRoot.appendChild(c);let l={};if(i)for(var h in s.resetFit(),i)l[h]=s.style[h],s.style.setProperty(h,i[h]);s._dialogOpenChanged=function(t){if(!t&&(this.stateObj&&this.fire("hass-more-info",{entityId:null}),this.shadowRoot==c.parentNode)){this._page=null,this.shadowRoot.removeChild(c);const t=this.shadowRoot.querySelector("more-info-controls");if(t&&(t.style.display=""),i)for(var e in s.resetFit(),l)l[e]?s.style.setProperty(e,l[e]):s.style.removeProperty(e)}}}("",i,!1,{position:"fixed","z-index":999,top:0,left:0,height:"100%",width:"100%",display:"block","align-items":"center","justify-content":"center",background:"rgba(0, 0, 0, 0.8)","flex-direction":"column",margin:0,"--iron-icon-fill-color":"#FFF"})}else it(t.entity_id)}_getUnit(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":return"km"===e?"hPa":"inHg";case"length":return e;case"precipitation":return"km"===e?"mm":"in";default:return this.hass.config.unit_system[t]||""}}_notFound(t){return V`
        <homekit-button class="not-found">
          <div class="button-inner">
            <span class="name">${t.entity}</span>
            <span class="state">Not found</span>
          </div>
        </homekit-button>
    `}_getColorForLightEntity(t,e,n){var i=this.config.default_color?this.config.default_color:void 0;return t&&(t.attributes.rgb_color?(i=`rgb(${t.attributes.rgb_color.join(",")})`,t.attributes.brightness&&(i=this._applyBrightnessToColor(i,(t.attributes.brightness+245)/5))):e&&t.attributes.color_temp&&t.attributes.min_mireds&&t.attributes.max_mireds?(i=this._getLightColorBasedOnTemperature(t.attributes.color_temp,t.attributes.min_mireds,t.attributes.max_mireds),t.attributes.brightness&&(i=this._applyBrightnessToColor(i,(t.attributes.brightness+245)/5))):i=n&&t.attributes.brightness?this._applyBrightnessToColor(this._getDefaultColorForState(),(t.attributes.brightness+245)/5):this._getDefaultColorForState()),i}_applyBrightnessToColor(t,e){const n=new W(this._getColorFromVariable(t));if(n.isValid){const t=n.mix("black",100-e).toString();if(t)return t}return t}_getLightColorBasedOnTemperature(t,e,n){const i=new W("rgb(255, 160, 0)"),o=new W("rgb(166, 209, 255)"),r=new W("white"),s=(t-e)/(n-e)*100;return s<50?X(o).mix(r,2*s).toRgbString():X(r).mix(i,2*(s-50)).toRgbString()}_getDefaultColorForState(){return this.config.color_on?this.config.color_on:"#f7d959"}_getColorFromVariable(t){return void 0!==t&&"var"===t.substring(0,3)?window.getComputedStyle(document.documentElement).getPropertyValue(t.substring(4).slice(0,-1)).trim():t}static get styles(){return U`
      :host {
        --auto-color: #EE7600;
        --eco-color: springgreen;
        --cool-color: #2b9af9;
        --heat-color: #EE7600;
        --manual-color: #44739e;
        --off-color: lightgrey;
        --fan_only-color: #8a8a8a;
        --dry-color: #efbd07;
        --idle-color: #00CC66;
        --unknown-color: #bac;
      }
      .card-title {
          margin-bottom: 0;
          padding-left: 4px;
          font-size: 1.1rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        flex-direction:row;
        padding-top: 0;
      }
      .row:first-child {
        padding-top:0;
      }

      .row .col {
        padding:0 25px;
      }
      .row .col.fixed {
        min-width: calc(var(--tile-on-row) * 129px);
        width: calc(var(--tile-on-row) * 129px);
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
          padding: 5px 0 5px 15px;
          white-space: nowrap;
          width: 100%;
          box-sizing: border-box;
      }
      .container.rows {
        padding: 5px 0;
      }
      .container.rows .header {
        padding: 0 1rem;
      }
      .header {
          min-height: 1rem;
      }
      .header h1 {
          margin: 0.5rem;
          font-size: 1.8rem;
          font-weight: 300;
      }

      .header ul {
        margin: 0.7rem;
        padding: 0;
        list-style: none;
      }
      
      .header ul li {
        display: block;
        color: inherit;
        font-size: 1.2rem;
        font-weight: 300;
      }

      homekit-button {
        transform-origin: center center;
      }

      .button {
        vertical-align: top;
        cursor: pointer;
        display: inline-block;
        width: 100px;
        height: 100px;
        padding: 10px;
        background-color: rgba(50, 50, 50, 0.8);
        border-radius: 12px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
        margin: 3px;
        position: relative;
        overflow:hidden;
        font-weight: 300;
        touch-action: auto!important;
      }
      .button.size-2 {
        width: 230px;
      }
      .button.height-2 {
        height:230px;
      }
      .button.no-padding {
        padding: 0;
        width: 120px;
        height: 120px;
      }
      .button.no-padding.size-2 {
        width: 250px;
      }
      .button.no-padding.height-2 {
        height:250px;
      }
      
      :host:last-child .button {
        margin-right:13px;
      }
      
      .button.on {
        background-color: rgba(255, 255, 255, 0.9);
      }
      
      .button .button-inner {
        display:flex;
        flex-direction:column;
        height:100%;
      }
      .button.event .button-inner {
        pointer-events: none;
      }
      
      homekit-button .name {
        display:block;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
        width: 100%;
        margin-top: auto;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap:break-word;
        overflow: hidden;
        white-space: normal;
        pointer-events: none;
      }
      
      homekit-button .name.on {
        color: rgba(0, 0, 0, 1);
      }
      
      homekit-button .state {
        position: relative;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        text-transform: capitalize;
        float: left;
        white-space: nowrap;
        pointer-events: none;
      }

      homekit-button .state .previous {
        position: relative;
        margin-left: 5px;
        font-size: 9px;
        color: rgb(134, 134, 134);
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
        color: rgba(255, 0, 0, 1);
        text-transform: lowercase;
      }
      
      .button .button-inner .circle-state {
        stroke-dasharray: calc((251.2 / 100) * var(--percentage)), 251.2;
        position:absolute;
        margin:0;
        top:10px;
        right:10px;
        width: 40px;
        height: 40px;
        pointer-events: none;
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
        color: rgba(255, 255, 255, 0.6);
        font-size: 2rem;
        transform-origin: 50% 50%;
        line-height: 40px;
        text-align: center;
        pointer-events: none;
      }

      homekit-button .icon ha-icon {
        width: 40px;
        height: 40px;
        pointer-events: none;
      }
                
      homekit-button .icon.on {
        color: rgba(111, 11, 11, 0.6);
      }

      homekit-button .icon.climate {
        color:#FFF;
        background-color: rgba(11, 111, 11, 0.9);
        font-size: 1rem;
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
        font-size: 1rem;
        font-weight: bold;
        color: white;
        pointer-events: none;
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

      .break {
        display:none;
      }
      @media only screen and (max-width: 768px) {
        .button {
          width:90px;
          height:90px;
        }
        .button.size-2 {
          width:210px;
        }
        .button.height-2 {
          height:210px;
        }
        .button.no-padding {
          width: 110px;
          height: 110px;
        }
        .button.no-padding.size-2 {
          width: 230px;
        }
        .button.no-padding.height-2 {
          height: 230px;
        }
        .container {
          padding-left:0;
        }

        .header, .homekit-card {
          width: 358px;
          text-align: left;
          padding: 0 !important;
          margin: 0 auto;
        }

        .card-title {
          width: 358px;
          padding-left: 1rem;
          margin: 0 auto;
        }

        homekit-button .name {
          font-size: 1rem;
        }
        homekit-button .state {
          font-size: 1rem;
        }
        homekit-button .value.on {
          font-size: 1rem;
        }
        .row {
          padding:0;
          flex-direction:column;
        }
        .row .col, .row .col.fixed {
          width: auto;
          min-width: auto;
          padding: 0;
        }
      }

      card-maker {
        height: 100%;
      }

      .spin {      
        animation-name: spin;
        animation-duration: 1000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear; 
      }

      @keyframes spin {
        from {
            transform:rotate(0deg);
        }
        to {
            transform:rotate(360deg);
        }
      }

      .longpress.animate {
        animation-fill-mode: forwards; 
        -webkit-animation: 0.5s longpress forwards;
        animation: 0.5s longpress forwards;
      }
      
      @-webkit-keyframes longpress {
          0%, 20% { transform: scale(1); }
          100% { transform: scale(1.2); }
      }
      
      @keyframes longpress {
          0%, 20% { transform: scale(1); }
          100% { transform: scale(1.2); }
      }
    `}});
