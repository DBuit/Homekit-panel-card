var t={},e=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,n="[^\\s]+",o=/\[([^]*?)\]/gm,a=function(){};function i(t,e){for(var n=[],o=0,a=t.length;o<a;o++)n.push(t[o].substr(0,e));return n}function r(t){return function(e,n,o){var a=o[t].indexOf(n.charAt(0).toUpperCase()+n.substr(1).toLowerCase());~a&&(e.month=a)}}function s(t,e){for(t=String(t),e=e||2;t.length<e;)t="0"+t;return t}var c=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],l=["January","February","March","April","May","June","July","August","September","October","November","December"],u=i(l,3),h=i(c,3);t.i18n={dayNamesShort:h,dayNames:c,monthNamesShort:u,monthNames:l,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10)*t%10]}};var d={D:function(t){return t.getDate()},DD:function(t){return s(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return t.getDay()},dd:function(t){return s(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return t.getMonth()+1},MM:function(t){return s(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return s(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return s(t.getFullYear(),4)},h:function(t){return t.getHours()%12||12},hh:function(t){return s(t.getHours()%12||12)},H:function(t){return t.getHours()},HH:function(t){return s(t.getHours())},m:function(t){return t.getMinutes()},mm:function(t){return s(t.getMinutes())},s:function(t){return t.getSeconds()},ss:function(t){return s(t.getSeconds())},S:function(t){return Math.round(t.getMilliseconds()/100)},SS:function(t){return s(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return s(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+s(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)}},p={D:["\\d\\d?",function(t,e){t.day=e}],Do:["\\d\\d?"+n,function(t,e){t.day=parseInt(e,10)}],M:["\\d\\d?",function(t,e){t.month=e-1}],YY:["\\d\\d?",function(t,e){var n=+(""+(new Date).getFullYear()).substr(0,2);t.year=""+(e>68?n-1:n)+e}],h:["\\d\\d?",function(t,e){t.hour=e}],m:["\\d\\d?",function(t,e){t.minute=e}],s:["\\d\\d?",function(t,e){t.second=e}],YYYY:["\\d{4}",function(t,e){t.year=e}],S:["\\d",function(t,e){t.millisecond=100*e}],SS:["\\d{2}",function(t,e){t.millisecond=10*e}],SSS:["\\d{3}",function(t,e){t.millisecond=e}],d:["\\d\\d?",a],ddd:[n,a],MMM:[n,r("monthNamesShort")],MMMM:[n,r("monthNames")],a:[n,function(t,e,n){var o=e.toLowerCase();o===n.amPm[0]?t.isPm=!1:o===n.amPm[1]&&(t.isPm=!0)}],ZZ:["[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z",function(t,e){var n,o=(e+"").match(/([+-]|\d\d)/gi);o&&(n=60*o[1]+parseInt(o[2],10),t.timezoneOffset="+"===o[0]?n:-n)}]};p.dd=p.d,p.dddd=p.ddd,p.DD=p.D,p.mm=p.m,p.hh=p.H=p.HH=p.h,p.MM=p.M,p.ss=p.s,p.A=p.a,t.masks={default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},t.format=function(n,a,i){var r=i||t.i18n;if("number"==typeof n&&(n=new Date(n)),"[object Date]"!==Object.prototype.toString.call(n)||isNaN(n.getTime()))throw new Error("Invalid Date in fecha.format");a=t.masks[a]||a||t.masks.default;var s=[];return(a=(a=a.replace(o,(function(t,e){return s.push(e),"@@@"}))).replace(e,(function(t){return t in d?d[t](n,r):t.slice(1,t.length-1)}))).replace(/@@@/g,(function(){return s.shift()}))},t.parse=function(n,a,i){var r=i||t.i18n;if("string"!=typeof a)throw new Error("Invalid format in fecha.parse");if(a=t.masks[a]||a,n.length>1e3)return null;var s={},c=[],l=[];a=a.replace(o,(function(t,e){return l.push(e),"@@@"}));var u,h=(u=a,u.replace(/[|\\{()[^$+*?.-]/g,"\\$&")).replace(e,(function(t){if(p[t]){var e=p[t];return c.push(e[1]),"("+e[0]+")"}return t}));h=h.replace(/@@@/g,(function(){return l.shift()}));var d=n.match(new RegExp(h,"i"));if(!d)return null;for(var f=1;f<d.length;f++)c[f-1](s,d[f],r);var m,g=new Date;return!0===s.isPm&&null!=s.hour&&12!=+s.hour?s.hour=+s.hour+12:!1===s.isPm&&12==+s.hour&&(s.hour=0),null!=s.timezoneOffset?(s.minute=+(s.minute||0)-+s.timezoneOffset,m=new Date(Date.UTC(s.year||g.getFullYear(),s.month||0,s.day||1,s.hour||0,s.minute||0,s.second||0,s.millisecond||0))):m=new Date(s.year||g.getFullYear(),s.month||0,s.day||1,s.hour||0,s.minute||0,s.second||0,s.millisecond||0),m};var f=function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric"})}:function(e){return t.format(e,"mediumDate")},m=function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleString(e,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(e){return t.format(e,"haDateTime")},g=function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleTimeString(e,{hour:"numeric",minute:"2-digit"})}:function(e){return t.format(e,"shortTime")};function b(t){return t.substr(0,t.indexOf("."))}function v(t,e,n){var o,a=function(t){return b(t.entity_id)}(e);if("binary_sensor"===a)e.attributes.device_class&&(o=t("state."+a+"."+e.attributes.device_class+"."+e.state)),o||(o=t("state."+a+".default."+e.state));else if(e.attributes.unit_of_measurement&&!["unknown","unavailable"].includes(e.state))o=e.state+" "+e.attributes.unit_of_measurement;else if("input_datetime"===a){var i;if(e.attributes.has_time)if(e.attributes.has_date)i=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),o=m(i,n);else{var r=new Date;i=new Date(r.getFullYear(),r.getMonth(),r.getDay(),e.attributes.hour,e.attributes.minute),o=g(i,n)}else i=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),o=f(i,n)}else o="zwave"===a?["initializing","dead"].includes(e.state)?t("state.zwave.query_stage."+e.state,"query_stage",e.attributes.query_stage):t("state.zwave.default."+e.state):t("state."+a+"."+e.state);return o||(o=t("state.default."+e.state)||t("component."+a+".state."+e.state)||e.state),o}var y="hass:bookmark",w=["closed","locked","off"],_=function(t,e,n,o){o=o||{},n=null==n?{}:n;var a=new Event(e,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return a.detail=n,t.dispatchEvent(a),a},k={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function x(t,e){if(t in k)return k[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"hass:bell-plus";case"armed_night":return"hass:bell-sleep";case"disarmed":return"hass:bell-outline";case"triggered":return"hass:bell-ring";default:return"hass:bell"}case"binary_sensor":return e&&"off"===e?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return"closed"===e?"hass:window-closed":"hass:window-open";case"lock":return e&&"unlocked"===e?"hass:lock-open":"hass:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"hass:cast-connected":"hass:cast";case"zwave":switch(e){case"dead":return"hass:emoticon-dead";case"sleeping":return"hass:sleep";case"initializing":return"hass:timer-sand";default:return"hass:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),y}}var S=function(t){_(window,"haptic",t)},$=function(t,e,n){void 0===n&&(n=!1),n?history.replaceState(null,"",e):history.pushState(null,"",e),_(window,"location-changed",{replace:n})},M=function(t,e){return function(t,e,n){void 0===n&&(n=!0);var o,a=b(e),i="group"===a?"homeassistant":a;switch(a){case"lock":o=n?"unlock":"lock";break;case"cover":o=n?"open_cover":"close_cover";break;default:o=n?"turn_on":"turn_off"}return t.callService(i,o,{entity_id:e})}(t,e,w.includes(t.states[e].state))};function C(t,e){(function(t){return"string"==typeof t&&t.includes(".")&&1===parseFloat(t)})(t)&&(t="100%");var n=function(t){return"string"==typeof t&&t.includes("%")}(t);return t=360===e?t:Math.min(e,Math.max(0,parseFloat(t))),n&&(t=parseInt(String(t*e),10)/100),Math.abs(t-e)<1e-6?1:t=360===e?(t<0?t%e+e:t%e)/parseFloat(String(e)):t%e/parseFloat(String(e))}function D(t){return Math.min(1,Math.max(0,t))}function T(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function A(t){return t<=1?100*Number(t)+"%":t}function E(t){return 1===t.length?"0"+t:String(t)}function P(t,e,n){t=C(t,255),e=C(e,255),n=C(n,255);var o=Math.max(t,e,n),a=Math.min(t,e,n),i=0,r=0,s=(o+a)/2;if(o===a)r=0,i=0;else{var c=o-a;switch(r=s>.5?c/(2-o-a):c/(o+a),o){case t:i=(e-n)/c+(e<n?6:0);break;case e:i=(n-t)/c+2;break;case n:i=(t-e)/c+4}i/=6}return{h:i,s:r,l:s}}function H(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*n*(e-t):n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function O(t,e,n){t=C(t,255),e=C(e,255),n=C(n,255);var o=Math.max(t,e,n),a=Math.min(t,e,n),i=0,r=o,s=o-a,c=0===o?0:s/o;if(o===a)i=0;else{switch(o){case t:i=(e-n)/s+(e<n?6:0);break;case e:i=(n-t)/s+2;break;case n:i=(t-e)/s+4}i/=6}return{h:i,s:c,v:r}}function F(t,e,n,o){var a=[E(Math.round(t).toString(16)),E(Math.round(e).toString(16)),E(Math.round(n).toString(16))];return o&&a[0].startsWith(a[0].charAt(1))&&a[1].startsWith(a[1].charAt(1))&&a[2].startsWith(a[2].charAt(1))?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0):a.join("")}function z(t){return Math.round(255*parseFloat(t)).toString(16)}function R(t){return Y(t)/255}function Y(t){return parseInt(t,16)}var j={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function q(t){var e={r:0,g:0,b:0},n=1,o=null,a=null,i=null,r=!1,s=!1;return"string"==typeof t&&(t=function(t){if(0===(t=t.trim().toLowerCase()).length)return!1;var e=!1;if(j[t])t=j[t],e=!0;else if("transparent"===t)return{r:0,g:0,b:0,a:0,format:"name"};var n=B.rgb.exec(t);if(n)return{r:n[1],g:n[2],b:n[3]};if(n=B.rgba.exec(t))return{r:n[1],g:n[2],b:n[3],a:n[4]};if(n=B.hsl.exec(t))return{h:n[1],s:n[2],l:n[3]};if(n=B.hsla.exec(t))return{h:n[1],s:n[2],l:n[3],a:n[4]};if(n=B.hsv.exec(t))return{h:n[1],s:n[2],v:n[3]};if(n=B.hsva.exec(t))return{h:n[1],s:n[2],v:n[3],a:n[4]};if(n=B.hex8.exec(t))return{r:Y(n[1]),g:Y(n[2]),b:Y(n[3]),a:R(n[4]),format:e?"name":"hex8"};if(n=B.hex6.exec(t))return{r:Y(n[1]),g:Y(n[2]),b:Y(n[3]),format:e?"name":"hex"};if(n=B.hex4.exec(t))return{r:Y(n[1]+n[1]),g:Y(n[2]+n[2]),b:Y(n[3]+n[3]),a:R(n[4]+n[4]),format:e?"name":"hex8"};if(n=B.hex3.exec(t))return{r:Y(n[1]+n[1]),g:Y(n[2]+n[2]),b:Y(n[3]+n[3]),format:e?"name":"hex"};return!1}(t)),"object"==typeof t&&(V(t.r)&&V(t.g)&&V(t.b)?(e=function(t,e,n){return{r:255*C(t,255),g:255*C(e,255),b:255*C(n,255)}}(t.r,t.g,t.b),r=!0,s="%"===String(t.r).substr(-1)?"prgb":"rgb"):V(t.h)&&V(t.s)&&V(t.v)?(o=A(t.s),a=A(t.v),e=function(t,e,n){t=6*C(t,360),e=C(e,100),n=C(n,100);var o=Math.floor(t),a=t-o,i=n*(1-e),r=n*(1-a*e),s=n*(1-(1-a)*e),c=o%6;return{r:255*[n,r,i,i,s,n][c],g:255*[s,n,n,r,i,i][c],b:255*[i,i,s,n,n,r][c]}}(t.h,o,a),r=!0,s="hsv"):V(t.h)&&V(t.s)&&V(t.l)&&(o=A(t.s),i=A(t.l),e=function(t,e,n){var o,a,i;if(t=C(t,360),e=C(e,100),n=C(n,100),0===e)a=n,i=n,o=n;else{var r=n<.5?n*(1+e):n+e-n*e,s=2*n-r;o=H(s,r,t+1/3),a=H(s,r,t),i=H(s,r,t-1/3)}return{r:255*o,g:255*a,b:255*i}}(t.h,o,i),r=!0,s="hsl"),Object.prototype.hasOwnProperty.call(t,"a")&&(n=t.a)),n=T(n),{ok:r,format:t.format||s,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:n}}var I="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",N="[\\s|\\(]+("+I+")[,|\\s]+("+I+")[,|\\s]+("+I+")\\s*\\)?",L="[\\s|\\(]+("+I+")[,|\\s]+("+I+")[,|\\s]+("+I+")[,|\\s]+("+I+")\\s*\\)?",B={CSS_UNIT:new RegExp(I),rgb:new RegExp("rgb"+N),rgba:new RegExp("rgba"+L),hsl:new RegExp("hsl"+N),hsla:new RegExp("hsla"+L),hsv:new RegExp("hsv"+N),hsva:new RegExp("hsva"+L),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function V(t){return Boolean(B.CSS_UNIT.exec(String(t)))}var W=function(){function t(e,n){var o;if(void 0===e&&(e=""),void 0===n&&(n={}),e instanceof t)return e;this.originalInput=e;var a=q(e);this.originalInput=e,this.r=a.r,this.g=a.g,this.b=a.b,this.a=a.a,this.roundA=Math.round(100*this.a)/100,this.format=null!=(o=n.format)?o:a.format,this.gradientType=n.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=a.ok}return t.prototype.isDark=function(){return this.getBrightness()<128},t.prototype.isLight=function(){return!this.isDark()},t.prototype.getBrightness=function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},t.prototype.getLuminance=function(){var t=this.toRgb(),e=t.r/255,n=t.g/255,o=t.b/255;return.2126*(e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4))+.7152*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))+.0722*(o<=.03928?o/12.92:Math.pow((o+.055)/1.055,2.4))},t.prototype.getAlpha=function(){return this.a},t.prototype.setAlpha=function(t){return this.a=T(t),this.roundA=Math.round(100*this.a)/100,this},t.prototype.toHsv=function(){var t=O(this.r,this.g,this.b);return{h:360*t.h,s:t.s,v:t.v,a:this.a}},t.prototype.toHsvString=function(){var t=O(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),o=Math.round(100*t.v);return 1===this.a?"hsv("+e+", "+n+"%, "+o+"%)":"hsva("+e+", "+n+"%, "+o+"%, "+this.roundA+")"},t.prototype.toHsl=function(){var t=P(this.r,this.g,this.b);return{h:360*t.h,s:t.s,l:t.l,a:this.a}},t.prototype.toHslString=function(){var t=P(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),o=Math.round(100*t.l);return 1===this.a?"hsl("+e+", "+n+"%, "+o+"%)":"hsla("+e+", "+n+"%, "+o+"%, "+this.roundA+")"},t.prototype.toHex=function(t){return void 0===t&&(t=!1),F(this.r,this.g,this.b,t)},t.prototype.toHexString=function(t){return void 0===t&&(t=!1),"#"+this.toHex(t)},t.prototype.toHex8=function(t){return void 0===t&&(t=!1),function(t,e,n,o,a){var i=[E(Math.round(t).toString(16)),E(Math.round(e).toString(16)),E(Math.round(n).toString(16)),E(z(o))];return a&&i[0].startsWith(i[0].charAt(1))&&i[1].startsWith(i[1].charAt(1))&&i[2].startsWith(i[2].charAt(1))&&i[3].startsWith(i[3].charAt(1))?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0)+i[3].charAt(0):i.join("")}(this.r,this.g,this.b,this.a,t)},t.prototype.toHex8String=function(t){return void 0===t&&(t=!1),"#"+this.toHex8(t)},t.prototype.toRgb=function(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}},t.prototype.toRgbString=function(){var t=Math.round(this.r),e=Math.round(this.g),n=Math.round(this.b);return 1===this.a?"rgb("+t+", "+e+", "+n+")":"rgba("+t+", "+e+", "+n+", "+this.roundA+")"},t.prototype.toPercentageRgb=function(){var t=function(t){return Math.round(100*C(t,255))+"%"};return{r:t(this.r),g:t(this.g),b:t(this.b),a:this.a}},t.prototype.toPercentageRgbString=function(){var t=function(t){return Math.round(100*C(t,255))};return 1===this.a?"rgb("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%)":"rgba("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%, "+this.roundA+")"},t.prototype.toName=function(){if(0===this.a)return"transparent";if(this.a<1)return!1;for(var t="#"+F(this.r,this.g,this.b,!1),e=0,n=Object.keys(j);e<n.length;e++){var o=n[e];if(j[o]===t)return o}return!1},t.prototype.toString=function(t){var e=Boolean(t);t=null!=t?t:this.format;var n=!1,o=this.a<1&&this.a>=0;return e||!o||!t.startsWith("hex")&&"name"!==t?("rgb"===t&&(n=this.toRgbString()),"prgb"===t&&(n=this.toPercentageRgbString()),"hex"!==t&&"hex6"!==t||(n=this.toHexString()),"hex3"===t&&(n=this.toHexString(!0)),"hex4"===t&&(n=this.toHex8String(!0)),"hex8"===t&&(n=this.toHex8String()),"name"===t&&(n=this.toName()),"hsl"===t&&(n=this.toHslString()),"hsv"===t&&(n=this.toHsvString()),n||this.toHexString()):"name"===t&&0===this.a?this.toName():this.toRgbString()},t.prototype.clone=function(){return new t(this.toString())},t.prototype.lighten=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l+=e/100,n.l=D(n.l),new t(n)},t.prototype.brighten=function(e){void 0===e&&(e=10);var n=this.toRgb();return n.r=Math.max(0,Math.min(255,n.r-Math.round(-e/100*255))),n.g=Math.max(0,Math.min(255,n.g-Math.round(-e/100*255))),n.b=Math.max(0,Math.min(255,n.b-Math.round(-e/100*255))),new t(n)},t.prototype.darken=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l-=e/100,n.l=D(n.l),new t(n)},t.prototype.tint=function(t){return void 0===t&&(t=10),this.mix("white",t)},t.prototype.shade=function(t){return void 0===t&&(t=10),this.mix("black",t)},t.prototype.desaturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s-=e/100,n.s=D(n.s),new t(n)},t.prototype.saturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s+=e/100,n.s=D(n.s),new t(n)},t.prototype.greyscale=function(){return this.desaturate(100)},t.prototype.spin=function(e){var n=this.toHsl(),o=(n.h+e)%360;return n.h=o<0?360+o:o,new t(n)},t.prototype.mix=function(e,n){void 0===n&&(n=50);var o=this.toRgb(),a=new t(e).toRgb(),i=n/100;return new t({r:(a.r-o.r)*i+o.r,g:(a.g-o.g)*i+o.g,b:(a.b-o.b)*i+o.b,a:(a.a-o.a)*i+o.a})},t.prototype.analogous=function(e,n){void 0===e&&(e=6),void 0===n&&(n=30);var o=this.toHsl(),a=360/n,i=[this];for(o.h=(o.h-(a*e>>1)+720)%360;--e;)o.h=(o.h+a)%360,i.push(new t(o));return i},t.prototype.complement=function(){var e=this.toHsl();return e.h=(e.h+180)%360,new t(e)},t.prototype.monochromatic=function(e){void 0===e&&(e=6);for(var n=this.toHsv(),o=n.h,a=n.s,i=n.v,r=[],s=1/e;e--;)r.push(new t({h:o,s:a,v:i})),i=(i+s)%1;return r},t.prototype.splitcomplement=function(){var e=this.toHsl(),n=e.h;return[this,new t({h:(n+72)%360,s:e.s,l:e.l}),new t({h:(n+216)%360,s:e.s,l:e.l})]},t.prototype.triad=function(){return this.polyad(3)},t.prototype.tetrad=function(){return this.polyad(4)},t.prototype.polyad=function(e){for(var n=this.toHsl(),o=n.h,a=[this],i=360/e,r=1;r<e;r++)a.push(new t({h:(o+r*i)%360,s:n.s,l:n.l}));return a},t.prototype.equals=function(e){return this.toRgbString()===new t(e).toRgbString()},t}();function U(t,e){return void 0===t&&(t=""),void 0===e&&(e={}),new W(t,e)}const Z=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),J=Z.prototype.html,G=Z.prototype.css;function K(t,e={}){return customElements.whenDefined("long-press").then(()=>{document.body.querySelector("long-press").bind(t)}),customElements.whenDefined("action-handler").then(()=>{document.body.querySelector("action-handler").bind(t,e)}),t}function Q(t,e,n=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},n)n.dispatchEvent(t);else{var o=document.querySelector("home-assistant");(o=(o=(o=(o=(o=(o=(o=(o=(o=(o=(o=o&&o.shadowRoot)&&o.querySelector("home-assistant-main"))&&o.shadowRoot)&&o.querySelector("app-drawer-layout partial-panel-resolver"))&&o.shadowRoot||o)&&o.querySelector("ha-panel-lovelace"))&&o.shadowRoot)&&o.querySelector("hui-root"))&&o.shadowRoot)&&o.querySelector("ha-app-layout #view"))&&o.firstElementChild)&&o.dispatchEvent(t)}}const X="custom:";function tt(t,e){const n=document.createElement("hui-error-card");return n.setConfig({type:"error",error:t,origConfig:e}),n}function et(t,e){if(!e||"object"!=typeof e||!e.type)return tt(`No ${t} type configured`,e);let n=e.type;if(n=n.startsWith(X)?n.substr(X.length):`hui-${n}-${t}`,customElements.get(n))return function(t,e){const n=document.createElement(t);try{n.setConfig(e)}catch(t){return tt(t,e)}return n}(n,e);const o=tt(`Custom element doesn't exist: ${n}.`,e);o.style.display="None";const a=setTimeout(()=>{o.style.display=""},2e3);return customElements.whenDefined(n).then(()=>{clearTimeout(a),Q("ll-rebuild",{},o)}),o}function nt(t,e=!1){Q("hass-more-info",{entityId:t},document.querySelector("home-assistant"));const n=document.querySelector("home-assistant")._moreInfoEl;return n.large=e,n}const ot=2;class at extends Z{static get version(){return ot}static get properties(){return{noHass:{type:Boolean}}}setConfig(t){var e;this._config=t,this.el?this.el.setConfig(t):(this.el=this.create(t),this._hass&&(this.el.hass=this._hass),this.noHass&&(e=this,document.querySelector("home-assistant")?document.querySelector("home-assistant").provideHass(e):document.querySelector("hc-main")&&document.querySelector("hc-main").provideHass(e)))}set config(t){this.setConfig(t)}set hass(t){this._hass=t,this.el&&(this.el.hass=t)}createRenderRoot(){return this}render(){return J`${this.el}`}}const it=function(t,e){const n=Object.getOwnPropertyDescriptors(e.prototype);for(const[e,o]of Object.entries(n))"constructor"!==e&&Object.defineProperty(t.prototype,e,o);const o=Object.getOwnPropertyDescriptors(e);for(const[e,n]of Object.entries(o))"prototype"!==e&&Object.defineProperty(t,e,n);const a=Object.getPrototypeOf(e),i=Object.getOwnPropertyDescriptors(a.prototype);for(const[e,n]of Object.entries(i))"constructor"!==e&&Object.defineProperty(Object.getPrototypeOf(t).prototype,e,n);const r=Object.getOwnPropertyDescriptors(a);for(const[e,n]of Object.entries(r))"prototype"!==e&&Object.defineProperty(Object.getPrototypeOf(t),e,n)},rt=customElements.get("card-maker");if(!rt||!rt.version||rt.version<ot){class t extends at{create(t){return function(t){return et("card",t)}(t)}getCardSize(){return this.firstElementChild&&this.firstElementChild.getCardSize?this.firstElementChild.getCardSize():1}}rt?it(rt,t):customElements.define("card-maker",t)}const st=customElements.get("element-maker");if(!st||!st.version||st.version<ot){class t extends at{create(t){return function(t){return et("element",t)}(t)}}st?it(st,t):customElements.define("element-maker",t)}const ct=customElements.get("entity-row-maker");if(!ct||!ct.version||ct.version<ot){class t extends at{create(t){return function(t){const e=new Set(["call-service","divider","section","weblink"]);if(!t)return tt("Invalid configuration given.",t);if("string"==typeof t&&(t={entity:t}),"object"!=typeof t||!t.entity&&!t.type)return tt("Invalid configuration given.",t);const n=t.type||"default";if(e.has(n)||n.startsWith(X))return et("row",t);const o=t.entity.split(".",1)[0];return Object.assign(t,{type:{alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"}[o]||"text"}),et("entity-row",t)}(t)}}ct?it(ct,t):customElements.define("entity-row-maker",t)}let lt=function(){if(window.fully&&"function"==typeof fully.getDeviceId)return fully.getDeviceId();if(!localStorage["lovelace-player-device-id"]){const t=()=>Math.floor(1e5*(1+Math.random())).toString(16).substring(1);localStorage["lovelace-player-device-id"]=`${t()}${t()}-${t()}${t()}`}return localStorage["lovelace-player-device-id"]}();var ut=document.createElement("long-press");document.body.appendChild(ut);var ht=document.createElement("action-handler");document.body.appendChild(ht);customElements.define("homekit-card",class extends Z{constructor(){super(...arguments),this.renderedRules=[]}static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entities&&!t.rows)throw new Error("You need to define entities: or rows:");if(!t.entities&&t.rows&&!t.enableColumns)throw new Error("If you use rows and columns you need to set enableColumns: true");t.useTemperature||(t.useTemperature=!1),t.useBrightness||(t.useBrightness=!0),this.config=t,this.rowTitleColor=!!this.config.titleColor&&this.config.titleColor,this.horizontalScroll="horizontalScroll"in this.config&&this.config.fullscreen,this.enableColumns="enableColumns"in this.config&&this.config.enableColumns,this.statePositionTop="statePositionTop"in this.config&&this.config.statePositionTop}render(){return J`
      <div class="container${this.enableColumns?" rows":""}" >
        ${this.config.home?J`
            <div class="header">
                ${this.config.title?J`<h1 style="${this.rowTitleColor?"color:"+this.rowTitleColor:""}">${this.config.title}</h1>`:J``}
                <ul>
                  ${this.renderedRules.map(t=>J`<li>${t}</li>`)}
                </ul>
            </div>
        `:J``}
       
        ${this.enableColumns?this._renderRows():this._renderEntities(this.config.entities)}
      </div>
    `}firstUpdated(){for(var t=this.shadowRoot.querySelectorAll("homekit-button"),e=0;e<t.length;e++)K(t[e],{hasHold:!0,hasDoubleClick:!0});this.shadowRoot.querySelectorAll("card-maker").forEach(t=>{var e={type:t.dataset.card};e=Object.assign({},e,JSON.parse(t.dataset.options)),t.config=e;let n="";if(t.dataset.style?n=t.dataset.style:"custom:mini-graph-card"==t.dataset.card&&(n=":host { height: 100%; } ha-card { background: transparent; color: #000; padding: 0!important; box-shadow: none; } .header { padding: 10px 10px 0 10px; } .header .name, .header .name .ellipsis { font-size: 13px!important; font-weight: 500; color: #000; opacity: 1; } .header icon { color: #f7d959; } .states { padding: 0 10px; } .states .state .state__value { font-size: 13px; } .header .icon { color: #f7d959; }"),""!=n){let e=0,o=setInterval((function(){let a=t.children[0];if(a){window.clearInterval(o);var i=document.createElement("style");i.innerHTML=n,a.shadowRoot.appendChild(i)}else 10==++e&&window.clearInterval(o)}),100)}})}updated(){this._renderRules()}_renderRows(){return J`
      ${this.config.rows.map(t=>J`
          <div class="row">
            ${t.columns.map(t=>J`
                <div class="col${t.tileOnRow?" fixed":""}" style="${t.tileOnRow?"--tile-on-row:"+t.tileOnRow:""}">
                  ${this._renderEntities(t.entities)}
                </div>
              `)}
          </div>
        `)}
    `}_renderState(t,e,n,o){return"light"==o&&(e.attributes.brightness||t.state)?this.statePositionTop?this._renderCircleState(t,e,o):J`
          <span class=" ${n.includes(e.state)?"value":"value on"}">${this._renderStateValue(t,e,o)}</span>
        `:"sensor"!=o&&"binary_sensor"!=o||!e.last_changed?"switch"!=o&&"input_boolean"!=o||!t.state?"climate"==o&&e.attributes.temperature?this.statePositionTop?this._renderCircleState(t,e,o):J`
          <span class=" ${n.includes(e.state)?"value":"value on"}">${this._renderStateValue(t,e,o)}</span>
        `:t.state?this.statePositionTop?this._renderCircleState(t,e,o):J`
            <span class="value on">${this._renderStateValue(t,e,o)}</span>
          `:void 0:this.statePositionTop?this._renderCircleState(t,e,o):J`
          <span class="value on">${this._renderStateValue(t,e,o)}</span>
        `:this.statePositionTop?this._renderCircleState(t,e,o):J`
          <span class="previous">${this._renderStateValue(t,e,o)}</span>
        `}_renderCircleState(t,e,n){return J`
      <svg class="circle-state" viewbox="0 0 100 100" style="${e.attributes.brightness&&!t.state?"--percentage:"+e.attributes.brightness/2.55:""}">
        <path id="progress" stroke-width="3" stroke="#aaabad" fill="none"
              d="M50 10
                a 40 40 0 0 1 0 80
                a 40 40 0 0 1 0 -80">
        </path>
        <text id="count" x="50" y="50" fill="#7d7e80" text-anchor="middle" dy="7" font-size="20">${this._renderStateValue(t,e,n)}</text>
      </svg>
    `}_renderStateValue(t,e,n){return"light"==n?J`
        ${e.attributes.brightness&&!t.state?J`${Math.round(e.attributes.brightness/2.55)}%`:J``}
        ${t.state?J`${v(this.hass.localize,this.hass.states[t.state],this.hass.language)}`:J``}
      `:"sensor"==n||"binary_sensor"==n?J`
        ${e.last_changed?J`${this._calculateTime(e.last_changed)}`:J``}
      `:"switch"==n||"input_boolean"==n?J`
        ${t.state?J`${v(this.hass.localize,this.hass.states[t.state],this.hass.language)}`:J``}
      `:"climate"==n?J`
        ${e.attributes.temperature?J`${e.attributes.temperature}&#176;`:J``}
      `:J`
      ${t.state?J`${v(this.hass.localize,this.hass.states[t.state],this.hass.language)}`:J``}
      `}_renderEntities(t){return J`
      ${t.map(t=>{var e=0;return J`
            <div class="card-title" style="${this.rowTitleColor?"color:"+this.rowTitleColor:""}">${t.title}</div>
                <div class="homekit-card${!0===this.horizontalScroll?" scroll":""}">
                    ${t.entities.map(n=>{if(!n.card&&!n.custom){var o=["off","unavailable"];n.offStates&&(o=n.offStates);const s=this.hass.states[n.entity];var a="#f7d959";3==e&&(e=0),4==e&&(e=2),a=n.color?n.color:this._getColorForLightEntity(s,this.config.useTemperature,this.config.useBrightness);var i=n.entity.split(".")[0];if("light"==i)return e++,s?J`
                              <homekit-card-item>
                                <homekit-button class="${o.includes(s.state)?"button":"button on"}" @action=${e=>this._handleClick(e,s,n,i,t)}>
                                    <div class="button-inner${this.statePositionTop?" state-top":""}">
                                      <span class="icon${!0!==n.spin||o.includes(s.state)?"":" spin"}" style="${o.includes(s.state)?"":"color:"+a+";"}">
                                        <ha-icon icon="${n.offIcon?o.includes(s.state)?n.offIcon:n.icon:n.icon||s.attributes.icon||x(b(s.entity_id),s.state)}" class=" ${n.spin&&"on"===s.state?"spin":""}"/>
                                      </span>
                                      <span class="${o.includes(s.state)?"name":"name on"}">${n.name||s.attributes.friendly_name}</span>
                                      <span class="${o.includes(s.state)?"state":"state on"}">
                                        ${v(this.hass.localize,s,this.hass.language)}
                                        ${this.statePositionTop?"":this._renderState(n,s,o,i)}
                                      </span>
                                      ${this.statePositionTop?this._renderState(n,s,o,i):""}
                                    </div>
                                </homekit-button>
                              </homekit-card-item>
                              ${3==e?J`<div class="break"></div>`:J``}
                              `:this._notFound(n);if("sensor"==i||"binary_sensor"==i)return e++,s?J`
                            <homekit-card-item>
                              <homekit-button class="${o.includes(s.state)?"button":"button on"}" @action=${e=>this._handleClick(e,s,n,i,t)}>
                                  <div class="button-inner${this.statePositionTop?" state-top":""}">
                                    <span class="${o.includes(s.state)?"icon":"icon on"}${!0!==n.spin||o.includes(s.state)?"":" spin"}">
                                      <ha-icon icon="${n.offIcon?o.includes(s.state)?n.offIcon:n.icon:n.icon||s.attributes.icon||x(b(s.entity_id),s.state)}" />
                                    </span>
                                    <span class="${o.includes(s.state)?"name":"name on"}">${n.name||s.attributes.friendly_name}</span>
                                    <span class="${o.includes(s.state)?"state":"state on"}">
                                      ${v(this.hass.localize,s,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,s,o,i)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,s,o,i):""}
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${3==e?J`<div class="break"></div>`:J``}
                          `:this._notFound(n);if("switch"==i||"input_boolean"==i)return e++,s?J`
                            <homekit-card-item>
                              <homekit-button class="${o.includes(s.state)?"button":"button on"}" @action=${e=>this._handleClick(e,s,n,i,t)}>
                                  <div class="button-inner">
                                    <span class="${o.includes(s.state)?"icon":"icon on"}${!0!==n.spin||o.includes(s.state)?"":" spin"}">
                                      <ha-icon icon="${n.offIcon?o.includes(s.state)?n.offIcon:n.icon:n.icon||s.attributes.icon||x(b(s.entity_id),s.state)}" />
                                    </span>
                                    <span class="${o.includes(s.state)?"name":"name on"}">${n.name||s.attributes.friendly_name}</span>
                                    <span class="${o.includes(s.state)?"state":"state on"}">
                                      ${v(this.hass.localize,s,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,s,o,i)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,s,o,i):""}
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${3==e?J`<div class="break"></div>`:J``}
                          `:this._notFound(n);if("weather"==i)return e+=2,s?J`
                            ${4==e?J`<div class="break"></div>`:J``}
                            <homekit-card-item>
                              <homekit-button class="button size-2 on" @action=${e=>this._handleClick(e,s,n,i,t)}>
                                  <div class="button-inner">
                                    <span class="icon on">
                                      <ha-icon icon="${n.icon||s.attributes.icon||"mdi:weather-"+s.state}" />
                                    </span>
                                    <span class="name on">${n.name||s.attributes.friendly_name}</span>
                                    <span class="state on">${v(this.hass.localize,s,this.hass.language)}
                                      ${s.attributes.forecast[0]&&s.attributes.forecast[0].precipitation?J`
                                          <span class="value on">${s.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                      `:J``}
                                    </span>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${3==e?J`<div class="break"></div>`:J``}
                          `:this._notFound(n);if("climate"==i){e++;var r="";return r="off"==s.state?"off":"heating"==s.attributes.hvac_action?"heat":"idle"==s.attributes.hvac_action?"idle":s.state in{auto:"hass:calendar-repeat",heat_cool:"hass:autorenew",heat:"hass:fire",cool:"hass:snowflake",off:"hass:power",fan_only:"hass:fan",dry:"hass:water-percent"}?s.state:"unknown-mode",s?J`
                            <homekit-card-item>
                              <homekit-button class="${o.includes(s.state)?"button":"button on"}" @action=${e=>this._handleClick(e,s,n,i,t)}>
                                  <div class="button-inner">
                                    <span class="${o.includes(s.state)?"icon climate "+r:"icon climate on "+r}">
                                      ${n.state?Math.round(this.hass.states[n.state].state):Math.round(s.attributes.current_temperature)}&#176;
                                    </span>
                                    <span class="${o.includes(s.state)?"name":"name on"}">${n.name||s.attributes.friendly_name}</span>
                                    <span class="${o.includes(s.state)?"state":"state on"}">
                                      ${v(this.hass.localize,s,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,s,o,i)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,s,o,i):""}
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${3==e?J`<div class="break"></div>`:J``}
                          `:this._notFound(n)}return e++,s?J`
                            <homekit-card-item>
                              <homekit-button class="${o.includes(s.state)?"button":"button on"}" @action=${e=>this._handleClick(e,s,n,i,t)}>
                                  <div class="button-inner">
                                    <span class="${o.includes(s.state)?"icon":"icon on"}${!0!==n.spin||o.includes(s.state)?"":" spin"}">
                                      <ha-icon icon="${n.offIcon?o.includes(s.state)?n.offIcon:n.icon:n.icon||s.attributes.icon||x(b(s.entity_id),s.state)}" />
                                    </span>
                                    <span class="${o.includes(s.state)?"name":"name on"}">${n.name||s.attributes.friendly_name}</span>
                                    <span class="${o.includes(s.state)?"state":"state on"}">
                                      ${v(this.hass.localize,s,this.hass.language)}
                                      ${this.statePositionTop?"":this._renderState(n,s,o,i)}
                                    </span>
                                    ${this.statePositionTop?this._renderState(n,s,o,i):""}
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${3==e?J`<div class="break"></div>`:J``}
                          `:this._notFound(n)}return n.card&&!n.custom?(e++,n.tap_action?J`
                          <homekit-card-item>
                            <homekit-button class="button on${n.noPadding?" no-padding":""}" @action=${e=>this._handleClick(e,null,n,"card",t)}>
                                <div class="button-inner">
                                  <card-maker nohass data-card="${n.card}" data-options="${JSON.stringify(n.cardOptions)}" data-style="${n.cardStyle?n.cardStyle:""}">
                                  </card-maker>
                                </div>
                            </homekit-button>
                          </<homekit-card-item>
                          ${3==e?J`<div class="break"></div>`:J``}
                        `:J`
                            <homekit-card-item>
                              <homekit-button class="button on${n.noPadding?" no-padding":""}">
                                  <div class="button-inner">
                                    <card-maker nohass data-card="${n.card}" data-options="${JSON.stringify(n.cardOptions)}" data-style="${n.cardStyle?n.cardStyle:""}">
                                    </card-maker>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${3==e?J`<div class="break"></div>`:J``}
                          `):n.custom?(e++,J`
                        <homekit-card-item>
                          <homekit-button class="button on" @action=${e=>this._handleClick(e,null,n,"custom",t)}>
                              <div class="button-inner">
                                <span class="icon on${!0===n.spin?" spin":""}">
                                  <ha-icon icon="${n.icon}" />
                                </span>
                                <span class="name on">${n.name}</span>
                                ${n.state?J`<span class="state">${v(this.hass.localize,this.hass.states[n.state],this.hass.language)}</span>`:J``}
                              </div>
                          </homekit-button>
                        </<homekit-card-item>
                        ${3==e?J`<div class="break"></div>`:J``}
                        `):void 0})}
                </div>
            </div>
        `})}
    `}_renderRules(){!0===this.config.home&&this.config.rules&&async function(t,e,n={}){for(var o in t||(t=t()),n={},n=Object.assign({user:t.user.name,browser:lt,hash:location.hash.substr(1)||" "},n)){var a=new RegExp(`\\{${o}\\}`,"g");e=e.replace(a,n[o])}return t.callApi("POST","template",{template:e})}(this.hass,this.config.rules).then(t=>{var e=t.match(/<li>(.*?)<\/li>/g).map((function(t){return t.replace(/<\/?li>/g,"")}));this.renderedRules=e})}_calculateTime(t){const e=new Date,n=new Date(t),o=e.getTime()-n.getTime(),a=Math.floor(o/864e5),i=Math.floor(o%864e5/36e5),r=Math.round(o%864e5%36e5/6e4),s=Math.round(o%864e5%36e5%6e4/1e3);return a>0?this.statePositionTop?a+"d":a+" days ago":i>0?this.statePositionTop?i+"h":i+" hours ago":r>0?this.statePositionTop?r+"m":r+" minutes ago":this.statePositionTop?s+"s":s+" seconds ago"}_handleClick(t,e,n,o,a){console.log(t.detail.action),"light"==o?"tap"==t.detail.action||"double_tap"==t.detail.action?n.double_tap_action&&"double_tap"==t.detail.action?this._customAction(n.double_tap_action):this._toggle(e,n.service):"hold"==t.detail.action&&(n.hold_action?this._customAction(n.hold_action):this._hold(e,n,a)):"sensor"==o||"binary_sensor"==o?("tap"!=t.detail.action&&"double_tap"!=t.detail.action||("double_tap"==t.detail.action&&n.double_tap_action?this._customAction(n.double_tap_action):n.tap_action&&this._customAction(n.tap_action)),"hold"==t.detail.action&&(n.hold_action?this._customAction(n.hold_action):this._hold(e,n,a))):"switch"==o||"input_boolean"==o?"tap"==t.detail.action||"double_tap"==t.detail.action?"double_tap"==t.detail.action&&n.double_tap_action?this._customAction(n.double_tap_action):this._toggle(e,n.service):"hold"==t.detail.action&&(n.hold_action?this._customAction(n.hold_action):this._hold(e,n,a)):"custom"==o?"tap"==t.detail.action||"double_tap"==t.detail.action?"double_tap"==t.detail.action&&n.double_tap_action?this._customAction(n.double_tap_action):n.tap_action&&this._customAction(n.tap_action):"hold"==t.detail.action&&n.hold_action&&(console.log("custom hold",n.hold_action),this._customAction(n.hold_action)):"card"==o?"tap"==t.detail.action||"double_tap"==t.detail.action?"double_tap"==t.detail.action&&n.double_tap_action?this._customAction(n.double_tap_action):n.tap_action&&this._customAction(n.tap_action):"hold"==t.detail.action&&n.hold_action&&this._customAction(n.hold_action):"tap"==t.detail.action||"double_tap"==t.detail.action?"double_tap"==t.detail.action&&n.double_tap_action?this._customAction(n.double_tap_action):n.tap_action&&this._customAction(n.tap_action):"hold"==t.detail.action&&(n.hold_action?this._customAction(n.hold_action):this._hold(e,n,a))}_customAction(t){switch(t.action){case"more-info":(t.entity||t.camera_image)&&nt(t.entity?t.entity:t.camera_image);break;case"navigate":t.navigation_path&&$(window,t.navigation_path);break;case"url":t.url_path&&window.open(t.url_path);break;case"toggle":t.entity&&(M(this.hass,t.entity),S("success"));break;case"call-service":{if(!t.service)return void S("failure");const[e,n]=t.service.split(".",2);this.hass.callService(e,n,t.service_data),S("success")}}}getCardSize(){return this.config.entities.length+1}_toggle(t,e){this.hass.callService("homeassistant",e||"toggle",{entity_id:t.entity_id})}_hold(t,e,n){if(n&&n.popup||e.popup){if(n.popup){var o=Object.assign({},n.popup,{entity:t.entity_id});if(e.popupExtend)o=Object.assign({},o,e.popupExtend)}else o=Object.assign({},e.popup,{entity:t.entity_id});!function(t,e,n=!1,o=null,a=!1){Q("hass-more-info",{entityId:null},document.querySelector("home-assistant"));const i=document.querySelector("home-assistant")._moreInfoEl;i.close(),i.open();const r=document.createElement("div");r.innerHTML=`\n  <style>\n    app-toolbar {\n      color: var(--more-info-header-color);\n      background-color: var(--more-info-header-background);\n    }\n    .scrollable {\n      overflow: auto;\n      max-width: 100% !important;\n    }\n  </style>\n  ${a?"":`\n      <app-toolbar>\n        <paper-icon-button\n          icon="hass:close"\n          dialog-dismiss=""\n        ></paper-icon-button>\n        <div class="main-title" main-title="">\n          ${t}\n        </div>\n      </app-toolbar>\n      `}\n    <div class="scrollable">\n      <card-maker nohass>\n      </card-maker>\n    </div>\n  `;const s=r.querySelector(".scrollable");s.querySelector("card-maker").config=e,i.sizingTarget=s,i.large=n,i._page="none",i.shadowRoot.appendChild(r);let c={};if(o)for(var l in i.resetFit(),o)c[l]=i.style[l],i.style.setProperty(l,o[l]);i._dialogOpenChanged=function(t){if(!t&&(this.stateObj&&this.fire("hass-more-info",{entityId:null}),this.shadowRoot==r.parentNode&&(this._page=null,this.shadowRoot.removeChild(r),o)))for(var e in i.resetFit(),c)c[e]?i.style.setProperty(e,c[e]):i.style.removeProperty(e)}}("",o,!1,{position:"fixed","z-index":999,top:0,left:0,height:"100%",width:"100%",display:"block","align-items":"center","justify-content":"center",background:"rgba(0, 0, 0, 0.8)","flex-direction":"column",margin:0,"--iron-icon-fill-color":"#FFF"})}else nt(t.entity_id)}_getUnit(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":return"km"===e?"hPa":"inHg";case"length":return e;case"precipitation":return"km"===e?"mm":"in";default:return this.hass.config.unit_system[t]||""}}_notFound(t){return J`
      <homekit-card-item>
        <homekit-button class="not-found">
          <div class="button-inner">
            <span class="name">${t.entity}</span>
            <span class="state">Not found</span>
          </div>
        </homekit-button>
      </homekit-card-item>
    `}_getColorForLightEntity(t,e,n){var o=this.config.default_color?this.config.default_color:void 0;return t&&(t.attributes.rgb_color?(o=`rgb(${t.attributes.rgb_color.join(",")})`,t.attributes.brightness&&(o=this._applyBrightnessToColor(o,(t.attributes.brightness+245)/5))):e&&t.attributes.color_temp&&t.attributes.min_mireds&&t.attributes.max_mireds?(o=this._getLightColorBasedOnTemperature(t.attributes.color_temp,t.attributes.min_mireds,t.attributes.max_mireds),t.attributes.brightness&&(o=this._applyBrightnessToColor(o,(t.attributes.brightness+245)/5))):o=n&&t.attributes.brightness?this._applyBrightnessToColor(this._getDefaultColorForState(),(t.attributes.brightness+245)/5):this._getDefaultColorForState()),o}_applyBrightnessToColor(t,e){const n=new W(this._getColorFromVariable(t));if(n.isValid){const t=n.mix("black",100-e).toString();if(t)return t}return t}_getLightColorBasedOnTemperature(t,e,n){const o=new W("rgb(255, 160, 0)"),a=new W("rgb(166, 209, 255)"),i=new W("white"),r=(t-e)/(n-e)*100;return r<50?U(a).mix(i,2*r).toRgbString():U(i).mix(o,2*(r-50)).toRgbString()}_getDefaultColorForState(){return this.config.color_on?this.config.color_on:"#f7d959"}_getColorFromVariable(t){return void 0!==t&&"var"===t.substring(0,3)?window.getComputedStyle(document.documentElement).getPropertyValue(t.substring(4).slice(0,-1)).trim():t}static get styles(){return G`
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
          margin-bottom:-10px;
          padding-left: 4px;
          font-size: 18px;
          padding-top:18px;
          padding-bottom:10px;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        flex-direction:row;
        padding-top:50px;
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
        overflow:hidden;
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
        padding: 0 25px;
      }
      .header {
          min-height: 150px;
          margin-bottom: 30px;
      }
      .header h1 {
          margin-bottom: 30px;
          margin-left: 4px;
          font-size: 32px;
          font-weight: 300;
      }

      .header ul {
        margin:0 0 0 4px;
        padding: 0 16px 0 0;
        list-style:none;
      }
      
      .header ul li {
        display:block;
        color:#FFF;
        font-size:20px;
        font-weight:300;
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
        white-space: nowrap;
      }

      homekit-button .state .previous {
        position: relative;
        margin-left: 5px;
        font-size: 9px;
        color: rgb(134, 134, 134);
        text-transform: lowercase;
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
      
      .button .button-inner .circle-state {
        stroke-dasharray: calc((251.2 / 100) * var(--percentage)), 251.2;
        position:absolute;
        margin:0;
        top:10px;
        right:10px;
        width: 40px;
        height: 40px;
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
        transform-origin: 50% 50%;
        line-height: 40px;
        text-align: center;
      }

      homekit-button .icon ha-icon {
        width:30px;
        height:30px;
      }
                
      homekit-button .icon.on {
        color: #f7d959;
      }

      homekit-button .icon.climate {
        color:#FFF;
        background-color: rgba(0,255,0, 1);
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
        height:100%;
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
    `}});
