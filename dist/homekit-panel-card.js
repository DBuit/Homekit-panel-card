var t={},e=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,n="[^\\s]+",a=/\[([^]*?)\]/gm,r=function(){};function i(t,e){for(var n=[],a=0,r=t.length;a<r;a++)n.push(t[a].substr(0,e));return n}function o(t){return function(e,n,a){var r=a[t].indexOf(n.charAt(0).toUpperCase()+n.substr(1).toLowerCase());~r&&(e.month=r)}}function s(t,e){for(t=String(t),e=e||2;t.length<e;)t="0"+t;return t}var c=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],u=["January","February","March","April","May","June","July","August","September","October","November","December"],l=i(u,3),h=i(c,3);t.i18n={dayNamesShort:h,dayNames:c,monthNamesShort:l,monthNames:u,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10)*t%10]}};var d={D:function(t){return t.getDate()},DD:function(t){return s(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return t.getDay()},dd:function(t){return s(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return t.getMonth()+1},MM:function(t){return s(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return s(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return s(t.getFullYear(),4)},h:function(t){return t.getHours()%12||12},hh:function(t){return s(t.getHours()%12||12)},H:function(t){return t.getHours()},HH:function(t){return s(t.getHours())},m:function(t){return t.getMinutes()},mm:function(t){return s(t.getMinutes())},s:function(t){return t.getSeconds()},ss:function(t){return s(t.getSeconds())},S:function(t){return Math.round(t.getMilliseconds()/100)},SS:function(t){return s(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return s(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+s(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)}},f={D:["\\d\\d?",function(t,e){t.day=e}],Do:["\\d\\d?"+n,function(t,e){t.day=parseInt(e,10)}],M:["\\d\\d?",function(t,e){t.month=e-1}],YY:["\\d\\d?",function(t,e){var n=+(""+(new Date).getFullYear()).substr(0,2);t.year=""+(e>68?n-1:n)+e}],h:["\\d\\d?",function(t,e){t.hour=e}],m:["\\d\\d?",function(t,e){t.minute=e}],s:["\\d\\d?",function(t,e){t.second=e}],YYYY:["\\d{4}",function(t,e){t.year=e}],S:["\\d",function(t,e){t.millisecond=100*e}],SS:["\\d{2}",function(t,e){t.millisecond=10*e}],SSS:["\\d{3}",function(t,e){t.millisecond=e}],d:["\\d\\d?",r],ddd:[n,r],MMM:[n,o("monthNamesShort")],MMMM:[n,o("monthNames")],a:[n,function(t,e,n){var a=e.toLowerCase();a===n.amPm[0]?t.isPm=!1:a===n.amPm[1]&&(t.isPm=!0)}],ZZ:["[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z",function(t,e){var n,a=(e+"").match(/([+-]|\d\d)/gi);a&&(n=60*a[1]+parseInt(a[2],10),t.timezoneOffset="+"===a[0]?n:-n)}]};f.dd=f.d,f.dddd=f.ddd,f.DD=f.D,f.mm=f.m,f.hh=f.H=f.HH=f.h,f.MM=f.M,f.ss=f.s,f.A=f.a,t.masks={default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"},t.format=function(n,r,i){var o=i||t.i18n;if("number"==typeof n&&(n=new Date(n)),"[object Date]"!==Object.prototype.toString.call(n)||isNaN(n.getTime()))throw new Error("Invalid Date in fecha.format");r=t.masks[r]||r||t.masks.default;var s=[];return(r=(r=r.replace(a,(function(t,e){return s.push(e),"@@@"}))).replace(e,(function(t){return t in d?d[t](n,o):t.slice(1,t.length-1)}))).replace(/@@@/g,(function(){return s.shift()}))},t.parse=function(n,r,i){var o=i||t.i18n;if("string"!=typeof r)throw new Error("Invalid format in fecha.parse");if(r=t.masks[r]||r,n.length>1e3)return null;var s={},c=[],u=[];r=r.replace(a,(function(t,e){return u.push(e),"@@@"}));var l,h=(l=r,l.replace(/[|\\{()[^$+*?.-]/g,"\\$&")).replace(e,(function(t){if(f[t]){var e=f[t];return c.push(e[1]),"("+e[0]+")"}return t}));h=h.replace(/@@@/g,(function(){return u.shift()}));var d=n.match(new RegExp(h,"i"));if(!d)return null;for(var m=1;m<d.length;m++)c[m-1](s,d[m],o);var p,g=new Date;return!0===s.isPm&&null!=s.hour&&12!=+s.hour?s.hour=+s.hour+12:!1===s.isPm&&12==+s.hour&&(s.hour=0),null!=s.timezoneOffset?(s.minute=+(s.minute||0)-+s.timezoneOffset,p=new Date(Date.UTC(s.year||g.getFullYear(),s.month||0,s.day||1,s.hour||0,s.minute||0,s.second||0,s.millisecond||0))):p=new Date(s.year||g.getFullYear(),s.month||0,s.day||1,s.hour||0,s.minute||0,s.second||0,s.millisecond||0),p};var m=function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleDateString(e,{year:"numeric",month:"long",day:"numeric"})}:function(e){return t.format(e,"mediumDate")},p=function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleString(e,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(e){return t.format(e,"haDateTime")},g=function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleTimeString(e,{hour:"numeric",minute:"2-digit"})}:function(e){return t.format(e,"shortTime")};function b(t){return t.substr(0,t.indexOf("."))}function y(t,e,n){var a,r=function(t){return b(t.entity_id)}(e);if("binary_sensor"===r)e.attributes.device_class&&(a=t("state."+r+"."+e.attributes.device_class+"."+e.state)),a||(a=t("state."+r+".default."+e.state));else if(e.attributes.unit_of_measurement&&!["unknown","unavailable"].includes(e.state))a=e.state+" "+e.attributes.unit_of_measurement;else if("input_datetime"===r){var i;if(e.attributes.has_time)if(e.attributes.has_date)i=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),a=p(i,n);else{var o=new Date;i=new Date(o.getFullYear(),o.getMonth(),o.getDay(),e.attributes.hour,e.attributes.minute),a=g(i,n)}else i=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),a=m(i,n)}else a="zwave"===r?["initializing","dead"].includes(e.state)?t("state.zwave.query_stage."+e.state,"query_stage",e.attributes.query_stage):t("state.zwave.default."+e.state):t("state."+r+"."+e.state);return a||(a=t("state.default."+e.state)||t("component."+r+".state."+e.state)||e.state),a}var v="hass:bookmark",w=["closed","locked","off"],k=function(t,e,n,a){a=a||{},n=null==n?{}:n;var r=new Event(e,{bubbles:void 0===a.bubbles||a.bubbles,cancelable:Boolean(a.cancelable),composed:void 0===a.composed||a.composed});return r.detail=n,t.dispatchEvent(r),r},x={alert:"hass:alert",automation:"hass:playlist-play",calendar:"hass:calendar",camera:"hass:video",climate:"hass:thermostat",configurator:"hass:settings",conversation:"hass:text-to-speech",device_tracker:"hass:account",fan:"hass:fan",group:"hass:google-circles-communities",history_graph:"hass:chart-line",homeassistant:"hass:home-assistant",homekit:"hass:home-automation",image_processing:"hass:image-filter-frames",input_boolean:"hass:drawing",input_datetime:"hass:calendar-clock",input_number:"hass:ray-vertex",input_select:"hass:format-list-bulleted",input_text:"hass:textbox",light:"hass:lightbulb",mailbox:"hass:mailbox",notify:"hass:comment-alert",person:"hass:account",plant:"hass:flower",proximity:"hass:apple-safari",remote:"hass:remote",scene:"hass:google-pages",script:"hass:file-document",sensor:"hass:eye",simple_alarm:"hass:bell",sun:"hass:white-balance-sunny",switch:"hass:flash",timer:"hass:timer",updater:"hass:cloud-upload",vacuum:"hass:robot-vacuum",water_heater:"hass:thermometer",weblink:"hass:open-in-new"};function _(t,e){if(t in x)return x[t];switch(t){case"alarm_control_panel":switch(e){case"armed_home":return"hass:bell-plus";case"armed_night":return"hass:bell-sleep";case"disarmed":return"hass:bell-outline";case"triggered":return"hass:bell-ring";default:return"hass:bell"}case"binary_sensor":return e&&"off"===e?"hass:radiobox-blank":"hass:checkbox-marked-circle";case"cover":return"closed"===e?"hass:window-closed":"hass:window-open";case"lock":return e&&"unlocked"===e?"hass:lock-open":"hass:lock";case"media_player":return e&&"off"!==e&&"idle"!==e?"hass:cast-connected":"hass:cast";case"zwave":switch(e){case"dead":return"hass:emoticon-dead";case"sleeping":return"hass:sleep";case"initializing":return"hass:timer-sand";default:return"hass:z-wave"}default:return console.warn("Unable to find icon for domain "+t+" ("+e+")"),v}}var M=function(t){k(window,"haptic",t)},S=function(t,e,n){void 0===n&&(n=!1),n?history.replaceState(null,"",e):history.pushState(null,"",e),k(window,"location-changed",{replace:n})},$=function(t,e){return function(t,e,n){void 0===n&&(n=!0);var a,r=b(e),i="group"===r?"homeassistant":r;switch(r){case"lock":a=n?"unlock":"lock";break;case"cover":a=n?"open_cover":"close_cover";break;default:a=n?"turn_on":"turn_off"}return t.callService(i,a,{entity_id:e})}(t,e,w.includes(t.states[e].state))};function D(t,e){(function(t){return"string"==typeof t&&t.includes(".")&&1===parseFloat(t)})(t)&&(t="100%");var n=function(t){return"string"==typeof t&&t.includes("%")}(t);return t=360===e?t:Math.min(e,Math.max(0,parseFloat(t))),n&&(t=parseInt(String(t*e),10)/100),Math.abs(t-e)<1e-6?1:t=360===e?(t<0?t%e+e:t%e)/parseFloat(String(e)):t%e/parseFloat(String(e))}function O(t){return Math.min(1,Math.max(0,t))}function H(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function C(t){return t<=1?100*Number(t)+"%":t}function E(t){return 1===t.length?"0"+t:String(t)}function F(t,e,n){t=D(t,255),e=D(e,255),n=D(n,255);var a=Math.max(t,e,n),r=Math.min(t,e,n),i=0,o=0,s=(a+r)/2;if(a===r)o=0,i=0;else{var c=a-r;switch(o=s>.5?c/(2-a-r):c/(a+r),a){case t:i=(e-n)/c+(e<n?6:0);break;case e:i=(n-t)/c+2;break;case n:i=(t-e)/c+4}i/=6}return{h:i,s:o,l:s}}function A(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*n*(e-t):n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function Y(t,e,n){t=D(t,255),e=D(e,255),n=D(n,255);var a=Math.max(t,e,n),r=Math.min(t,e,n),i=0,o=a,s=a-r,c=0===a?0:s/a;if(a===r)i=0;else{switch(a){case t:i=(e-n)/s+(e<n?6:0);break;case e:i=(n-t)/s+2;break;case n:i=(t-e)/s+4}i/=6}return{h:i,s:c,v:o}}function z(t,e,n,a){var r=[E(Math.round(t).toString(16)),E(Math.round(e).toString(16)),E(Math.round(n).toString(16))];return a&&r[0].startsWith(r[0].charAt(1))&&r[1].startsWith(r[1].charAt(1))&&r[2].startsWith(r[2].charAt(1))?r[0].charAt(0)+r[1].charAt(0)+r[2].charAt(0):r.join("")}function R(t){return Math.round(255*parseFloat(t)).toString(16)}function j(t){return P(t)/255}function P(t){return parseInt(t,16)}var T={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function q(t){var e={r:0,g:0,b:0},n=1,a=null,r=null,i=null,o=!1,s=!1;return"string"==typeof t&&(t=function(t){if(0===(t=t.trim().toLowerCase()).length)return!1;var e=!1;if(T[t])t=T[t],e=!0;else if("transparent"===t)return{r:0,g:0,b:0,a:0,format:"name"};var n=B.rgb.exec(t);if(n)return{r:n[1],g:n[2],b:n[3]};if(n=B.rgba.exec(t))return{r:n[1],g:n[2],b:n[3],a:n[4]};if(n=B.hsl.exec(t))return{h:n[1],s:n[2],l:n[3]};if(n=B.hsla.exec(t))return{h:n[1],s:n[2],l:n[3],a:n[4]};if(n=B.hsv.exec(t))return{h:n[1],s:n[2],v:n[3]};if(n=B.hsva.exec(t))return{h:n[1],s:n[2],v:n[3],a:n[4]};if(n=B.hex8.exec(t))return{r:P(n[1]),g:P(n[2]),b:P(n[3]),a:j(n[4]),format:e?"name":"hex8"};if(n=B.hex6.exec(t))return{r:P(n[1]),g:P(n[2]),b:P(n[3]),format:e?"name":"hex"};if(n=B.hex4.exec(t))return{r:P(n[1]+n[1]),g:P(n[2]+n[2]),b:P(n[3]+n[3]),a:j(n[4]+n[4]),format:e?"name":"hex8"};if(n=B.hex3.exec(t))return{r:P(n[1]+n[1]),g:P(n[2]+n[2]),b:P(n[3]+n[3]),format:e?"name":"hex"};return!1}(t)),"object"==typeof t&&(W(t.r)&&W(t.g)&&W(t.b)?(e=function(t,e,n){return{r:255*D(t,255),g:255*D(e,255),b:255*D(n,255)}}(t.r,t.g,t.b),o=!0,s="%"===String(t.r).substr(-1)?"prgb":"rgb"):W(t.h)&&W(t.s)&&W(t.v)?(a=C(t.s),r=C(t.v),e=function(t,e,n){t=6*D(t,360),e=D(e,100),n=D(n,100);var a=Math.floor(t),r=t-a,i=n*(1-e),o=n*(1-r*e),s=n*(1-(1-r)*e),c=a%6;return{r:255*[n,o,i,i,s,n][c],g:255*[s,n,n,o,i,i][c],b:255*[i,i,s,n,n,o][c]}}(t.h,a,r),o=!0,s="hsv"):W(t.h)&&W(t.s)&&W(t.l)&&(a=C(t.s),i=C(t.l),e=function(t,e,n){var a,r,i;if(t=D(t,360),e=D(e,100),n=D(n,100),0===e)r=n,i=n,a=n;else{var o=n<.5?n*(1+e):n+e-n*e,s=2*n-o;a=A(s,o,t+1/3),r=A(s,o,t),i=A(s,o,t-1/3)}return{r:255*a,g:255*r,b:255*i}}(t.h,a,i),o=!0,s="hsl"),Object.prototype.hasOwnProperty.call(t,"a")&&(n=t.a)),n=H(n),{ok:o,format:t.format||s,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:n}}var N="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",I="[\\s|\\(]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")\\s*\\)?",L="[\\s|\\(]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")[,|\\s]+("+N+")\\s*\\)?",B={CSS_UNIT:new RegExp(N),rgb:new RegExp("rgb"+I),rgba:new RegExp("rgba"+L),hsl:new RegExp("hsl"+I),hsla:new RegExp("hsla"+L),hsv:new RegExp("hsv"+I),hsva:new RegExp("hsva"+L),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function W(t){return Boolean(B.CSS_UNIT.exec(String(t)))}var U=function(){function t(e,n){var a;if(void 0===e&&(e=""),void 0===n&&(n={}),e instanceof t)return e;this.originalInput=e;var r=q(e);this.originalInput=e,this.r=r.r,this.g=r.g,this.b=r.b,this.a=r.a,this.roundA=Math.round(100*this.a)/100,this.format=null!=(a=n.format)?a:r.format,this.gradientType=n.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=r.ok}return t.prototype.isDark=function(){return this.getBrightness()<128},t.prototype.isLight=function(){return!this.isDark()},t.prototype.getBrightness=function(){var t=this.toRgb();return(299*t.r+587*t.g+114*t.b)/1e3},t.prototype.getLuminance=function(){var t=this.toRgb(),e=t.r/255,n=t.g/255,a=t.b/255;return.2126*(e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4))+.7152*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))+.0722*(a<=.03928?a/12.92:Math.pow((a+.055)/1.055,2.4))},t.prototype.getAlpha=function(){return this.a},t.prototype.setAlpha=function(t){return this.a=H(t),this.roundA=Math.round(100*this.a)/100,this},t.prototype.toHsv=function(){var t=Y(this.r,this.g,this.b);return{h:360*t.h,s:t.s,v:t.v,a:this.a}},t.prototype.toHsvString=function(){var t=Y(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),a=Math.round(100*t.v);return 1===this.a?"hsv("+e+", "+n+"%, "+a+"%)":"hsva("+e+", "+n+"%, "+a+"%, "+this.roundA+")"},t.prototype.toHsl=function(){var t=F(this.r,this.g,this.b);return{h:360*t.h,s:t.s,l:t.l,a:this.a}},t.prototype.toHslString=function(){var t=F(this.r,this.g,this.b),e=Math.round(360*t.h),n=Math.round(100*t.s),a=Math.round(100*t.l);return 1===this.a?"hsl("+e+", "+n+"%, "+a+"%)":"hsla("+e+", "+n+"%, "+a+"%, "+this.roundA+")"},t.prototype.toHex=function(t){return void 0===t&&(t=!1),z(this.r,this.g,this.b,t)},t.prototype.toHexString=function(t){return void 0===t&&(t=!1),"#"+this.toHex(t)},t.prototype.toHex8=function(t){return void 0===t&&(t=!1),function(t,e,n,a,r){var i=[E(Math.round(t).toString(16)),E(Math.round(e).toString(16)),E(Math.round(n).toString(16)),E(R(a))];return r&&i[0].startsWith(i[0].charAt(1))&&i[1].startsWith(i[1].charAt(1))&&i[2].startsWith(i[2].charAt(1))&&i[3].startsWith(i[3].charAt(1))?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0)+i[3].charAt(0):i.join("")}(this.r,this.g,this.b,this.a,t)},t.prototype.toHex8String=function(t){return void 0===t&&(t=!1),"#"+this.toHex8(t)},t.prototype.toRgb=function(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}},t.prototype.toRgbString=function(){var t=Math.round(this.r),e=Math.round(this.g),n=Math.round(this.b);return 1===this.a?"rgb("+t+", "+e+", "+n+")":"rgba("+t+", "+e+", "+n+", "+this.roundA+")"},t.prototype.toPercentageRgb=function(){var t=function(t){return Math.round(100*D(t,255))+"%"};return{r:t(this.r),g:t(this.g),b:t(this.b),a:this.a}},t.prototype.toPercentageRgbString=function(){var t=function(t){return Math.round(100*D(t,255))};return 1===this.a?"rgb("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%)":"rgba("+t(this.r)+"%, "+t(this.g)+"%, "+t(this.b)+"%, "+this.roundA+")"},t.prototype.toName=function(){if(0===this.a)return"transparent";if(this.a<1)return!1;for(var t="#"+z(this.r,this.g,this.b,!1),e=0,n=Object.keys(T);e<n.length;e++){var a=n[e];if(T[a]===t)return a}return!1},t.prototype.toString=function(t){var e=Boolean(t);t=null!=t?t:this.format;var n=!1,a=this.a<1&&this.a>=0;return e||!a||!t.startsWith("hex")&&"name"!==t?("rgb"===t&&(n=this.toRgbString()),"prgb"===t&&(n=this.toPercentageRgbString()),"hex"!==t&&"hex6"!==t||(n=this.toHexString()),"hex3"===t&&(n=this.toHexString(!0)),"hex4"===t&&(n=this.toHex8String(!0)),"hex8"===t&&(n=this.toHex8String()),"name"===t&&(n=this.toName()),"hsl"===t&&(n=this.toHslString()),"hsv"===t&&(n=this.toHsvString()),n||this.toHexString()):"name"===t&&0===this.a?this.toName():this.toRgbString()},t.prototype.clone=function(){return new t(this.toString())},t.prototype.lighten=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l+=e/100,n.l=O(n.l),new t(n)},t.prototype.brighten=function(e){void 0===e&&(e=10);var n=this.toRgb();return n.r=Math.max(0,Math.min(255,n.r-Math.round(-e/100*255))),n.g=Math.max(0,Math.min(255,n.g-Math.round(-e/100*255))),n.b=Math.max(0,Math.min(255,n.b-Math.round(-e/100*255))),new t(n)},t.prototype.darken=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.l-=e/100,n.l=O(n.l),new t(n)},t.prototype.tint=function(t){return void 0===t&&(t=10),this.mix("white",t)},t.prototype.shade=function(t){return void 0===t&&(t=10),this.mix("black",t)},t.prototype.desaturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s-=e/100,n.s=O(n.s),new t(n)},t.prototype.saturate=function(e){void 0===e&&(e=10);var n=this.toHsl();return n.s+=e/100,n.s=O(n.s),new t(n)},t.prototype.greyscale=function(){return this.desaturate(100)},t.prototype.spin=function(e){var n=this.toHsl(),a=(n.h+e)%360;return n.h=a<0?360+a:a,new t(n)},t.prototype.mix=function(e,n){void 0===n&&(n=50);var a=this.toRgb(),r=new t(e).toRgb(),i=n/100;return new t({r:(r.r-a.r)*i+a.r,g:(r.g-a.g)*i+a.g,b:(r.b-a.b)*i+a.b,a:(r.a-a.a)*i+a.a})},t.prototype.analogous=function(e,n){void 0===e&&(e=6),void 0===n&&(n=30);var a=this.toHsl(),r=360/n,i=[this];for(a.h=(a.h-(r*e>>1)+720)%360;--e;)a.h=(a.h+r)%360,i.push(new t(a));return i},t.prototype.complement=function(){var e=this.toHsl();return e.h=(e.h+180)%360,new t(e)},t.prototype.monochromatic=function(e){void 0===e&&(e=6);for(var n=this.toHsv(),a=n.h,r=n.s,i=n.v,o=[],s=1/e;e--;)o.push(new t({h:a,s:r,v:i})),i=(i+s)%1;return o},t.prototype.splitcomplement=function(){var e=this.toHsl(),n=e.h;return[this,new t({h:(n+72)%360,s:e.s,l:e.l}),new t({h:(n+216)%360,s:e.s,l:e.l})]},t.prototype.triad=function(){return this.polyad(3)},t.prototype.tetrad=function(){return this.polyad(4)},t.prototype.polyad=function(e){for(var n=this.toHsl(),a=n.h,r=[this],i=360/e,o=1;o<e;o++)r.push(new t({h:(a+o*i)%360,s:n.s,l:n.l}));return r},t.prototype.equals=function(e){return this.toRgbString()===new t(e).toRgbString()},t}();function Z(t,e){return void 0===t&&(t=""),void 0===e&&(e={}),new U(t,e)}const J=customElements.get("home-assistant-main")?Object.getPrototypeOf(customElements.get("home-assistant-main")):Object.getPrototypeOf(customElements.get("hui-view")),V=J.prototype.html,G=J.prototype.css;function K(t,e={}){return customElements.whenDefined("long-press").then(()=>{document.body.querySelector("long-press").bind(t)}),customElements.whenDefined("action-handler").then(()=>{document.body.querySelector("action-handler").bind(t,e)}),t}function Q(t,e,n=null){if((t=new Event(t,{bubbles:!0,cancelable:!1,composed:!0})).detail=e||{},n)n.dispatchEvent(t);else{var a=document.querySelector("home-assistant");(a=(a=(a=(a=(a=(a=(a=(a=(a=(a=(a=a&&a.shadowRoot)&&a.querySelector("home-assistant-main"))&&a.shadowRoot)&&a.querySelector("app-drawer-layout partial-panel-resolver"))&&a.shadowRoot||a)&&a.querySelector("ha-panel-lovelace"))&&a.shadowRoot)&&a.querySelector("hui-root"))&&a.shadowRoot)&&a.querySelector("ha-app-layout #view"))&&a.firstElementChild)&&a.dispatchEvent(t)}}const X="custom:";function tt(t,e){const n=document.createElement("hui-error-card");return n.setConfig({type:"error",error:t,origConfig:e}),n}function et(t,e){if(!e||"object"!=typeof e||!e.type)return tt(`No ${t} type configured`,e);let n=e.type;if(n=n.startsWith(X)?n.substr(X.length):`hui-${n}-${t}`,customElements.get(n))return function(t,e){const n=document.createElement(t);try{n.setConfig(e)}catch(t){return tt(t,e)}return n}(n,e);const a=tt(`Custom element doesn't exist: ${n}.`,e);a.style.display="None";const r=setTimeout(()=>{a.style.display=""},2e3);return customElements.whenDefined(n).then(()=>{clearTimeout(r),Q("ll-rebuild",{},a)}),a}const nt=2;class at extends J{static get version(){return nt}static get properties(){return{noHass:{type:Boolean}}}setConfig(t){var e;this._config=t,this.el?this.el.setConfig(t):(this.el=this.create(t),this._hass&&(this.el.hass=this._hass),this.noHass&&(e=this,document.querySelector("home-assistant").provideHass(e)))}set config(t){this.setConfig(t)}set hass(t){this._hass=t,this.el&&(this.el.hass=t)}createRenderRoot(){return this}render(){return V`${this.el}`}}const rt=function(t,e){const n=Object.getOwnPropertyDescriptors(e.prototype);for(const[e,a]of Object.entries(n))"constructor"!==e&&Object.defineProperty(t.prototype,e,a);const a=Object.getOwnPropertyDescriptors(e);for(const[e,n]of Object.entries(a))"prototype"!==e&&Object.defineProperty(t,e,n);const r=Object.getPrototypeOf(e),i=Object.getOwnPropertyDescriptors(r.prototype);for(const[e,n]of Object.entries(i))"constructor"!==e&&Object.defineProperty(Object.getPrototypeOf(t).prototype,e,n);const o=Object.getOwnPropertyDescriptors(r);for(const[e,n]of Object.entries(o))"prototype"!==e&&Object.defineProperty(Object.getPrototypeOf(t),e,n)},it=customElements.get("card-maker");if(!it||!it.version||it.version<nt){class t extends at{create(t){return function(t){return et("card",t)}(t)}getCardSize(){return this.firstElementChild&&this.firstElementChild.getCardSize?this.firstElementChild.getCardSize():1}}it?rt(it,t):customElements.define("card-maker",t)}const ot=customElements.get("element-maker");if(!ot||!ot.version||ot.version<nt){class t extends at{create(t){return function(t){return et("element",t)}(t)}}ot?rt(ot,t):customElements.define("element-maker",t)}const st=customElements.get("entity-row-maker");if(!st||!st.version||st.version<nt){class t extends at{create(t){return function(t){const e=new Set(["call-service","divider","section","weblink"]);if(!t)return tt("Invalid configuration given.",t);if("string"==typeof t&&(t={entity:t}),"object"!=typeof t||!t.entity&&!t.type)return tt("Invalid configuration given.",t);const n=t.type||"default";if(e.has(n)||n.startsWith(X))return et("row",t);const a=t.entity.split(".",1)[0];return Object.assign(t,{type:{alert:"toggle",automation:"toggle",climate:"climate",cover:"cover",fan:"toggle",group:"group",input_boolean:"toggle",input_number:"input-number",input_select:"input-select",input_text:"input-text",light:"toggle",lock:"lock",media_player:"media-player",remote:"toggle",scene:"scene",script:"script",sensor:"sensor",timer:"timer",switch:"toggle",vacuum:"toggle",water_heater:"climate",input_datetime:"input-datetime"}[a]||"text"}),et("entity-row",t)}(t)}}st?rt(st,t):customElements.define("entity-row-maker",t)}var ct=document.createElement("long-press");document.body.appendChild(ct);var ut=document.createElement("action-handler");document.body.appendChild(ut);customElements.define("homekit-card",class extends J{static get properties(){return{hass:{},config:{}}}setConfig(t){if(!t.entities)throw new Error("You need to define entities");t.useTemperature||(t.useTemperature=!1),t.useBrightness||(t.useBrightness=!0),t.breakOnMobile||(t.breakOnMobile=!1),this.config=t}render(){return V`
    <div class="container" >
      ${this.config.home?V`
          <div class="header">
              ${this.config.title?V`<h1>${this.config.title}</h1>`:V``}
          </div>
      `:V``}
      ${this.config.entities.map(t=>{var e=0;return V`
              <div class="card-title">${t.title}</div>
                  <div class="homekit-card">
                      ${t.entities.map(n=>{if(!n.card&&!n.custom){var a=["off","unavailable"];n.offStates&&(a=n.offStates);const o=this.hass.states[n.entity];var r="#f7d959";3==e&&(e=0),4==e&&(e=2),r=n.color?n.color:this._getColorForLightEntity(o,this.config.useTemperature,this.config.useBrightness);var i=n.entity.split(".")[0];return"light"==i?(e++,o?V`
                                <homekit-card-item>
                                  <homekit-button class="${a.includes(o.state)?"button":"button on"}" @action=${e=>this._handleClick(e,o,n,i,t)}>
                                      <div class="button-inner">
                                        <span class="icon" style="${a.includes(o.state)?"":"color:"+r+";"}">
                                          <ha-icon icon="${n.icon||o.attributes.icon||_(b(o.entity_id),o.state)}" class=" ${n.spin&&"on"===o.state?"spin":""}"/>
                                        </span>
                                        <span class="${a.includes(o.state)?"name":"name on"}">${n.name||o.attributes.friendly_name}</span>
                                        <span class="${a.includes(o.state)?"state":"state on"}">${y(this.hass.localize,o,this.hass.language)}${o.attributes.brightness?V` <span class=" ${a.includes(o.state)?"value":"value on"}"><span>${Math.round(o.attributes.brightness/2.55)}%</span></span>`:V``}</span>
                                      </div>
                                  </homekit-button>
                                </homekit-card-item>
                                ${3==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                                `:this._notFound(n)):"sensor"==i||"binary_sensor"==i?(e++,o?V`
                              <homekit-card-item>
                                <homekit-button class="${a.includes(o.state)?"button":"button on"}" @action=${e=>this._handleClick(e,o,n,i,t)}>
                                    <div class="button-inner">
                                      <span class="${a.includes(o.state)?"icon":"icon on"}">
                                        <ha-icon icon="${n.icon||o.attributes.icon||_(b(o.entity_id),o.state)}" />
                                      </span>
                                      <span class="${a.includes(o.state)?"name":"name on"}">${n.name||o.attributes.friendly_name}</span>
                                      <span class="${a.includes(o.state)?"state":"state on"}">
                                        ${y(this.hass.localize,o,this.hass.language)}
                                        ${o.last_changed?V`<span class="previous">${this._calculateTime(o.last_changed)}</span>`:V``}
                                      </span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                              ${3==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                            `:this._notFound(n)):"switch"==i||"input_boolean"==i?(e++,o?V`
                              <homekit-card-item>
                                <homekit-button class="${a.includes(o.state)?"button":"button on"}" @action=${e=>this._handleClick(e,o,n,i,t)}>
                                    <div class="button-inner">
                                      <span class="${a.includes(o.state)?"icon":"icon on"}">
                                        <ha-icon icon="${n.icon||o.attributes.icon}" />
                                      </span>
                                      <span class="${a.includes(o.state)?"name":"name on"}">${n.name||o.attributes.friendly_name}</span>
                                      <span class="${a.includes(o.state)?"state":"state on"}">${y(this.hass.localize,o,this.hass.language)}</span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                              ${3==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                            `:this._notFound(n)):"weather"==i?(e+=2,o?V`
                              ${4==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                              <homekit-card-item>
                                <homekit-button class="button size-2 on" @action=${e=>this._handleClick(e,o,n,i,t)}>
                                    <div class="button-inner">
                                      <span class="icon on">
                                        <ha-icon icon="${n.icon||o.attributes.icon||"mdi:weather-"+o.state}" />
                                      </span>
                                      <span class="name on">${n.name||o.attributes.friendly_name}</span>
                                      <span class="state on">${y(this.hass.localize,o,this.hass.language)}
                                        ${o.attributes.forecast[0]&&o.attributes.forecast[0].precipitation?V`
                                            <span class="value on">${o.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                        `:V``}
                                      </span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                              ${3==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                            `:this._notFound(n)):(e++,o?V`
                              <homekit-card-item>
                                <homekit-button class="${a.includes(o.state)?"button":"button on"}" @action=${e=>this._handleClick(e,o,n,i,t)}>
                                    <div class="button-inner">
                                      <span class="${a.includes(o.state)?"icon":"icon on"}">
                                        <ha-icon icon="${n.icon||o.attributes.icon}" />
                                      </span>
                                      <span class="${a.includes(o.state)?"name":"name on"}">${n.name||o.attributes.friendly_name}</span>
                                      <span class="${a.includes(o.state)?"state":"state on"}">${y(this.hass.localize,o,this.hass.language)}</span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                              ${3==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                            `:this._notFound(n))}return n.card&&!n.custom?(e++,V`
                            <homekit-card-item>
                              <homekit-button class="button on${n.noPadding?" no-padding":""}">
                                  <div class="button-inner">
                                    <card-maker nohass data-card="${n.card}" data-options="${JSON.stringify(n.cardOptions)}" data-style="${n.cardStyle?n.cardStyle:""}">
                                    </card-maker>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${3==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                          `):n.custom?(e++,V`
                            <homekit-card-item>
                                <homekit-button class="button on" @action=${e=>this._handleClick(e,null,n,"custom",t)}>
                                    <div class="button-inner">
                                      <span class="icon on">
                                        <ha-icon icon="${n.icon}" />
                                      </span>
                                      <span class="name on">${n.name}</span>
                                    </div>
                                </homekit-button>
                            </<homekit-card-item>
                            ${3==e&&this.config.breakOnMobile?V`<div class="break"></div>`:V``}
                          `):void 0})}
                  </div>
              </div>
          `})}
      
      `}firstUpdated(){for(var t=this.shadowRoot.querySelectorAll("homekit-button"),e=0;e<t.length;e++)K(t[e],{hasHold:!0,hasDoubleClick:!0});this.shadowRoot.querySelectorAll("card-maker").forEach(t=>{var e={type:t.dataset.card};e=Object.assign({},e,JSON.parse(t.dataset.options)),t.config=e;let n="";if(t.dataset.style?n=t.dataset.style:"custom:mini-graph-card"==t.dataset.card&&(n=":host {height:100%;} ha-card { background: transparent; color: #000; padding:0!important; box-shadow:none; } .header {padding:0;} .header icon {color:#f7d959;} .states {padding:0;} .states .state .state__value {font-size:14px;}"),""!=n){let e=0,a=setInterval((function(){let r=t.children[0];if(r){window.clearInterval(a);var i=document.createElement("style");i.innerHTML=n,r.shadowRoot.appendChild(i)}else 10==++e&&window.clearInterval(a)}),100)}})}_calculateTime(t){const e=new Date,n=new Date(t),a=e.getTime()-n.getTime(),r=Math.floor(a/864e5),i=Math.floor(a%864e5/36e5),o=Math.round(a%864e5%36e5/6e4),s=Math.round(a%864e5%36e5%6e4/1e3);return r>0?r+" days ago":i>0?i+" hours ago":o>0?o+" minutes ago":s+" seconds ago"}_handleClick(t,e,n,a,r){if("light"==a){if("tap"==t.detail.action||"double_tap"==t.detail.action)this._toggle(e,n.service);else if("hold"==t.detail.action)if(r&&r.popup||n.popup){if(r.popup){var i=Object.assign({},r.popup,{entity:e.entity_id});if(n.popupExtend)i=Object.assign({},i,n.popupExtend)}else i=Object.assign({},n.popup,{entity:e.entity_id});!function(t,e,n=!1,a=null,r=!1){Q("hass-more-info",{entityId:null},document.querySelector("home-assistant"));const i=document.querySelector("home-assistant")._moreInfoEl;i.close(),i.open();const o=document.createElement("div");o.innerHTML=`\n  <style>\n    app-toolbar {\n      color: var(--more-info-header-color);\n      background-color: var(--more-info-header-background);\n    }\n    .scrollable {\n      overflow: auto;\n      max-width: 100% !important;\n    }\n  </style>\n  ${r?"":`\n      <app-toolbar>\n        <paper-icon-button\n          icon="hass:close"\n          dialog-dismiss=""\n        ></paper-icon-button>\n        <div class="main-title" main-title="">\n          ${t}\n        </div>\n      </app-toolbar>\n      `}\n    <div class="scrollable">\n      <card-maker nohass>\n      </card-maker>\n    </div>\n  `;const s=o.querySelector(".scrollable");s.querySelector("card-maker").config=e,i.sizingTarget=s,i.large=n,i._page="none",i.shadowRoot.appendChild(o);let c={};if(a)for(var u in i.resetFit(),a)c[u]=i.style[u],i.style.setProperty(u,a[u]);i._dialogOpenChanged=function(t){if(!t&&(this.stateObj&&this.fire("hass-more-info",{entityId:null}),this.shadowRoot==o.parentNode&&(this._page=null,this.shadowRoot.removeChild(o),a)))for(var e in i.resetFit(),c)c[e]?i.style.setProperty(e,c[e]):i.style.removeProperty(e)}}("test",i,!1,{position:"fixed","z-index":999,top:0,left:0,height:"100%",width:"100%",display:"block","align-items":"center","justify-content":"center",background:"rgba(0, 0, 0, 0.8)","flex-direction":"column",margin:0,"--iron-icon-fill-color":"#FFF"})}else this._hold(e)}else"sensor"==a||"binary_sensor"==a?"hold"==t.detail.action&&this._hold(e):"switch"==a||"input_boolean"==a?"tap"==t.detail.action||"double_tap"==t.detail.action?this._toggle(e,n.service):"hold"==t.detail.action&&this._hold(e):"custom"==a?"tap"!=t.detail.action&&"double_tap"!=t.detail.action||!n.tap_action||this._customAction(n.tap_action):"hold"==t.detail.action&&this._hold(e)}_customAction(t){switch(t.action){case"more-info":(t.entity||t.camera_image)&&k(window,"hass-more-info",{entityId:t.entity?t.entity:t.camera_image});break;case"navigate":t.navigation_path&&S(window,t.navigation_path);break;case"url":t.url_path&&window.open(t.url_path);break;case"toggle":t.entity&&($(this.hass,t.entity),M("success"));break;case"call-service":{if(!t.service)return void M("failure");const[e,n]=t.service.split(".",2);this.hass.callService(e,n,t.service_data),M("success")}}}getCardSize(){return this.config.entities.length+1}_toggle(t,e){this.hass.callService("homeassistant",e||"toggle",{entity_id:t.entity_id})}_hold(t){!function(t,e=!1){Q("hass-more-info",{entityId:t},document.querySelector("home-assistant"));const n=document.querySelector("home-assistant")._moreInfoEl;n.large=e}(t.entity_id)}_getUnit(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":return"km"===e?"hPa":"inHg";case"length":return e;case"precipitation":return"km"===e?"mm":"in";default:return this.hass.config.unit_system[t]||""}}_notFound(t){return V`
      <homekit-card-item>
        <homekit-button class="not-found">
          <div class="button-inner">
            <span class="name">${t.entity}</span>
            <span class="state">Not found</span>
          </div>
        </homekit-button>
      </homekit-card-item>
    `}_getColorForLightEntity(t,e,n){var a=this.config.default_color?this.config.default_color:void 0;return t&&(t.attributes.rgb_color?(a=`rgb(${t.attributes.rgb_color.join(",")})`,t.attributes.brightness&&(a=this._applyBrightnessToColor(a,(t.attributes.brightness+245)/5))):e&&t.attributes.color_temp&&t.attributes.min_mireds&&t.attributes.max_mireds?(a=this._getLightColorBasedOnTemperature(t.attributes.color_temp,t.attributes.min_mireds,t.attributes.max_mireds),t.attributes.brightness&&(a=this._applyBrightnessToColor(a,(t.attributes.brightness+245)/5))):a=n&&t.attributes.brightness?this._applyBrightnessToColor(this._getDefaultColorForState(),(t.attributes.brightness+245)/5):this._getDefaultColorForState()),a}_applyBrightnessToColor(t,e){const n=new U(this._getColorFromVariable(t));if(n.isValid){const t=n.mix("black",100-e).toString();if(t)return t}return t}_getLightColorBasedOnTemperature(t,e,n){const a=new U("rgb(255, 160, 0)"),r=new U("rgb(166, 209, 255)"),i=new U("white"),o=(t-e)/(n-e)*100;return o<50?Z(r).mix(i,2*o).toRgbString():Z(i).mix(a,2*(o-50)).toRgbString()}_getDefaultColorForState(){return this.config.color_on?this.config.color_on:"#f7d959"}_getColorFromVariable(t){return void 0!==t&&"var"===t.substring(0,3)?window.getComputedStyle(document.documentElement).getPropertyValue(t.substring(4).slice(0,-1)).trim():t}static get styles(){return G`
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
    `}});
