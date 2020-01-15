import {
  computeStateDisplay,
  computeDomain,
  domainIcon,
  fireEvent,
  toggleEntity,
  navigate,
  forwardHaptic
} from 'custom-card-helpers';
import tinycolor, { TinyColor, isReadable } from '@ctrl/tinycolor';
import { noChange } from 'lit-html';
import { LitElement, html, css } from "card-tools/src/lit-element";
import { cardTools } from "card-tools/src/main";
import { bindActionHandler } from "card-tools/src/action";
import { popUp } from "card-tools/src/popup";
import { moreInfo } from "card-tools/src/more-info";
import {subscribeRenderTemplate} from "card-tools/src/templates";
import {parseTemplate} from "card-tools/src/templates.js";

var longPress = document.createElement('long-press');
document.body.appendChild(longPress);

var actionHandler = document.createElement('action-handler');
document.body.appendChild(actionHandler); 

class HomeKitCard extends LitElement {
  config: any;
  hass: any;
  shadowRoot: any;
  renderedRules: any = [];
  rowTitleColor: any;
  horizontalScroll: any;
  enableColumns: any;

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
    if(!config.useTemperature) {
      config.useTemperature = false;
    }
    if(!config.useBrightness) {
      config.useBrightness = true;
    }
    if(!config.breakOnMobile) {
      config.breakOnMobile = false;
    }
    this.config = config;
    this.rowTitleColor = this.config.titleColor ? this.config.titleColor : false;
    this.horizontalScroll = "horizontalScroll" in this.config ? this.config.fullscreen : false;
    this.enableColumns = "enableColumns" in this.config ? this.config.enableColumns : false;
  }

  render() {
    console.log(this.config?.rows);
    return html`
      <div class="container" >
        ${this.config.home ? html `
            <div class="header">
                ${this.config.title ? html `<h1 style="${this.rowTitleColor ? 'color:'+this.rowTitleColor : ''}">${this.config.title}</h1>`: html ``}
                <ul>
                  ${this.renderedRules.map(rule => {
                    return html`<li>${rule}</li>`;
                  })}
                </ul>
            </div>
        `: html ``}
       
        ${this.enableColumns ? this._renderRows() : this._renderEntities(this.config.entities)}
      </div>
    `;
    
  }

  firstUpdated() {
    var myNodelist = this.shadowRoot.querySelectorAll('homekit-button')
    for (var i = 0; i < myNodelist.length; i++) {
      bindActionHandler(myNodelist[i], {hasHold: true, hasDoubleClick: true});
    }

    this.shadowRoot.querySelectorAll("card-maker").forEach(customCard => {
        var card = {
          type: customCard.dataset.card
        };
        card = Object.assign({}, card, JSON.parse(customCard.dataset.options));
        customCard.config = card;

        let style = "";
        if(customCard.dataset.style) {
          style = customCard.dataset.style;
        } else if(customCard.dataset.card == 'custom:mini-graph-card') {
          style = ":host { height: 100%; } ha-card { background: transparent; color: #000; padding: 0!important; box-shadow: none; } .header { padding: 10px 10px 0 10px; } .header .name, .header .name .ellipsis { font-size: 13px!important; font-weight: 500; color: #000; opacity: 1; } .header icon { color: #f7d959; } .states { padding: 0 10px; } .states .state .state__value { font-size: 13px; } .header .icon { color: #f7d959; }";
        }

        if(style != "") {
          let itterations = 0;
          let interval = setInterval(function () {
            let el = customCard.children[0];
            if(el) {
              window.clearInterval(interval);

              var styleElement = document.createElement('style');
              styleElement.innerHTML = style;
              el.shadowRoot.appendChild(styleElement);

            } else if (++itterations === 10 ) {
              window.clearInterval(interval);
            }
          }, 100);
        }
    });
  }

  updated() {
    this._renderRules();
  }

  _renderRows() {
    return html`
      ${this.config.rows.map(row => {
        return html`
          <div class="row">
            ${row.columns.map(column => {
              return html`
                <div class="col">
                  ${this._renderEntities(column.entities)}
                </div>
              `;
            })}
          </div>
        `;
      })}
    `;
  }
  _renderColumns() {

  }
  _renderEntities(entities) {
    return html`
      ${entities.map(row => {
        var entityCount = 0;
        return html`
            <div class="card-title" style="${this.rowTitleColor ? 'color:'+this.rowTitleColor : ''}">${row.title}</div>
                <div class="homekit-card${this.horizontalScroll === true ? ' scroll': ''}">
                    ${row.entities.map(ent => {
                      if(!ent.card && !ent.custom) {
                        var offStates = ['off', 'unavailable'];
                        if(ent.offStates) {
                          offStates = ent.offStates;
                        }
                        const stateObj = this.hass.states[ent.entity];
                        var color = '#f7d959';
                        if(entityCount == 3) {
                          entityCount = 0;
                        }
                        if(entityCount == 4) {
                          entityCount = 2;
                        }
                        
                        if(ent.color) {
                          color = ent.color
                        } else {
                          color = this._getColorForLightEntity(stateObj, this.config.useTemperature, this.config.useBrightness);
                        }
                        var type = ent.entity.split('.')[0];
                        if(type == "light"){
                          entityCount++;
                          return stateObj ? html`
                              <homekit-card-item>
                                <homekit-button class="${offStates.includes(stateObj.state) ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                    <div class="button-inner">
                                      <span class="icon" style="${!offStates.includes(stateObj.state) ? 'color:'+color+';' : ''}">
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin': ""}"/>
                                      </span>
                                      <span class="${offStates.includes(stateObj.state) ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${offStates.includes(stateObj.state) ? 'state': 'state on'}">
                                        ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                        ${stateObj.attributes.brightness && !ent.state ? html` <span class=" ${offStates.includes(stateObj.state) ? 'value': 'value on'}">${Math.round(stateObj.attributes.brightness/2.55)}%</span>` : html``}
                                        ${ent.state ? html` <span class=" ${offStates.includes(stateObj.state) ? 'value': 'value on'}">${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}</span>` : html``}
                                      </span>
                                    </div>
                                </homekit-button>
                              </homekit-card-item>
                              ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                              `
                            : this._notFound(ent);
                        } else if(type == "sensor" || type == "binary_sensor"){
                          entityCount++;
                          return stateObj ? html`
                            <homekit-card-item>
                              <homekit-button class="${offStates.includes(stateObj.state) ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon': 'icon on'}">
                                      <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state': 'state on'}">
                                      ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${stateObj.last_changed ? html`<span class="previous">${ this._calculateTime(stateObj.last_changed) }</span>`:html``}
                                    </span>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                          `
                          : this._notFound(ent);
                        } else if(type == "switch" || type =="input_boolean") {
                          entityCount++;
                          return stateObj ? html`
                            <homekit-card-item>
                              <homekit-button class="${offStates.includes(stateObj.state) ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon': 'icon on'}">
                                      <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state': 'state on'}">
                                      ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${ent.state ? html` <span class="value on">${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}</span>` : html``}
                                    </span>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                          `
                          : this._notFound(ent);
                        
                        } else if(type == "weather") {
                          entityCount = entityCount + 2;
                          return stateObj ? html`
                            ${entityCount == 4 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                            <homekit-card-item>
                              <homekit-button class="button size-2 on" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                  <div class="button-inner">
                                    <span class="icon on">
                                      <ha-icon icon="${ent.icon || stateObj.attributes.icon || "mdi:weather-"+stateObj.state}" />
                                    </span>
                                    <span class="name on">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="state on">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${stateObj.attributes.forecast[0] && stateObj.attributes.forecast[0].precipitation ? html`
                                          <span class="value on">${stateObj.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                      ` : html``}
                                    </span>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                          `
                          : this._notFound(ent);
                        } else if(type == "climate") {
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
                          var mode:any = '';
                          if(stateObj.state == 'off') {
                            mode = 'off';
                          } else if(stateObj.attributes.hvac_action == 'heating') {
                            mode = 'heat';
                          } else if(stateObj.attributes.hvac_action == 'idle') {
                            mode = 'idle';
                          } else {
                            mode = stateObj.state in modes ? stateObj.state : "unknown-mode";
                          }
                          return stateObj ? html`
                            <homekit-card-item>
                              <homekit-button class="${offStates.includes(stateObj.state) ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon climate '+mode: 'icon climate on '+mode}">
                                      ${ent.state ? Math.round(this.hass.states[ent.state]!.state) : Math.round(stateObj.attributes.current_temperature)}&#176;
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state': 'state on'}">
                                      ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${stateObj.attributes.temperature ? html` <span class=" ${offStates.includes(stateObj.state) ? 'value': 'value on'}">${stateObj.attributes.temperature}&#176;</span>` : html``}
                                    </span>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                          `
                          : this._notFound(ent);
                        } else {
                          entityCount++;
                          return stateObj ? html`
                            <homekit-card-item>
                              <homekit-button class="${offStates.includes(stateObj.state) ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon': 'icon on'}">
                                      <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state': 'state on'}">
                                      ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${ent.state ? html` <span class="value on">${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}</span>` : html``}
                                    </span>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                          `
                          : this._notFound(ent);
                        }
                      } else if(ent.card && !ent.custom) {
                        entityCount++;
                        if(ent.tap_action) {
                          return html`
                          <homekit-card-item>
                            <homekit-button class="button on${ent.noPadding ? ' no-padding': ''}" @action=${(ev) => this._handleClick(ev, null, ent, "card", row)}>
                                <div class="button-inner">
                                  <card-maker nohass data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                  </card-maker>
                                </div>
                            </homekit-button>
                          </<homekit-card-item>
                          ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                        `
                        } else {
                          return html`
                            <homekit-card-item>
                              <homekit-button class="button on${ent.noPadding ? ' no-padding': ''}">
                                  <div class="button-inner">
                                    <card-maker nohass data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                    </card-maker>
                                  </div>
                              </homekit-button>
                            </<homekit-card-item>
                            ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                          `
                        }
                      } else if(ent.custom) {
                        entityCount++;
                        return html`
                        <homekit-card-item>
                          <homekit-button class="button on" @action=${(ev) => this._handleClick(ev, null, ent, "custom", row)}>
                              <div class="button-inner">
                                <span class="icon on">
                                  <ha-icon icon="${ent.icon}" />
                                </span>
                                <span class="name on">${ent.name}</span>
                                ${ent.state ? html`<span class="state">${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}</span>`:html``}
                              </div>
                          </homekit-button>
                        </<homekit-card-item>
                        ${entityCount == 3 && this.config.breakOnMobile ? html`<div class="break"></div>`:html``}
                        `
                      }
                    })}
                </div>
            </div>
        `
      })}
    `;
  }

  _renderRules() {
    if(this.config.home === true && this.config.rules) {
      parseTemplate(this.hass, this.config.rules).then((c) => {
        var result = c.match(/<li>(.*?)<\/li>/g).map(function(val){
          return val.replace(/<\/?li>/g,'');
        });
        this.renderedRules = result;
      });
    }
  }

  _calculateTime(lastUpdated){
    const currentDate = new Date();
    const lastDate = new Date(lastUpdated);

    const diffMs = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    const diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000);

    if (diffDays > 0) {
      return diffDays + ' days ago';
    } else if (diffHrs > 0) {
      return diffHrs + ' hours ago';
    } else if (diffMins > 0) {
      return diffMins + ' minutes ago';
    } else {
      return diffSecs + ' seconds ago';
    }
  }

  _handleClick(ev, state, entity, type, row) {
    if(type == "light") {
      if (ev.detail.action == "tap" || ev.detail.action == "double_tap") {
        this._toggle(state, entity.service);
      } else if (ev.detail.action == "hold") {
          this._hold(state, entity, row);
      }
    } else if(type == "sensor" || type == "binary_sensor") {
      if ((ev.detail.action == "tap" || ev.detail.action == "double_tap") && entity.tap_action) {
        this._customAction(entity.tap_action)
      }
      if (ev.detail.action == "hold") {
        this._hold(state, entity, row);
      }
    } else if(type == "switch" || type == "input_boolean") {
      if (ev.detail.action == "tap" || ev.detail.action == "double_tap") {
        this._toggle(state, entity.service);
      } else if (ev.detail.action == "hold") {
        this._hold(state, entity, row);
      }
    } else if(type == "custom") {
      if ((ev.detail.action == "tap" || ev.detail.action == "double_tap") && entity.tap_action) {
        this._customAction(entity.tap_action)
      }
    } else if(type == "card") { 
      if ((ev.detail.action == "tap" || ev.detail.action == "double_tap") && entity.tap_action) {
        this._customAction(entity.tap_action)
      }
    } else {
      if ((ev.detail.action == "tap" || ev.detail.action == "double_tap") && entity.tap_action) {
        this._customAction(entity.tap_action)
      }
      if (ev.detail.action == "hold") {
        this._hold(state, entity, row);
      } 
    }
  }

  _customAction(tapAction) {
    switch (tapAction.action) {
      case "more-info":
        if (tapAction.entity || tapAction.camera_image) {
          moreInfo(tapAction.entity ? tapAction.entity : tapAction.camera_image!);
        }
        break;
      case "navigate":
        if (tapAction.navigation_path) {
          navigate(window, tapAction.navigation_path);
        }
        break;
      case "url":
        if (tapAction.url_path) {
          window.open(tapAction.url_path);
        }
        break;
      case "toggle":
        if (tapAction.entity) {
          toggleEntity(this.hass, tapAction.entity!);
          forwardHaptic("success");
        }
        break;
      case "call-service": {
        if (!tapAction.service) {
          forwardHaptic("failure");
          return;
        }
        const [domain, service] = tapAction.service.split(".", 2);
        this.hass.callService(domain, service, tapAction.service_data);
        forwardHaptic("success");
      }
    }
  }

  getCardSize() {
    return this.config.entities.length + 1;
  }

  _toggle(state, service ) {
    this.hass.callService("homeassistant", service || "toggle", {
      entity_id: state.entity_id
    });
  }

  _hold(stateObj, entity, row) {
    if((row && row.popup) || entity.popup) {
      if(row.popup) {
          var popUpCard = Object.assign({}, row.popup, { entity: stateObj.entity_id });
          if(entity.popupExtend) {
              var popUpCard = Object.assign({}, popUpCard, entity.popupExtend);
          }
      } else {
          var popUpCard = Object.assign({}, entity.popup, { entity: stateObj.entity_id });
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
      }
      popUp('', popUpCard, false, popUpStyle);
    } else {
      moreInfo(stateObj.entity_id)
    }
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
    return html`
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


  _getColorForLightEntity(stateObj, useTemperature, useBrightness) {
    var color = this.config.default_color ? this.config.default_color : undefined;
    if (stateObj) {
      if (stateObj.attributes.rgb_color) {
        color = `rgb(${stateObj.attributes.rgb_color.join(',')})`;
        if (stateObj.attributes.brightness) {
          color = this._applyBrightnessToColor(color, (stateObj.attributes.brightness + 245) / 5);
        }
      } else if (useTemperature && stateObj.attributes.color_temp && stateObj.attributes.min_mireds && stateObj.attributes.max_mireds) {
        color = this._getLightColorBasedOnTemperature(stateObj.attributes.color_temp, stateObj.attributes.min_mireds, stateObj.attributes.max_mireds);
        if (stateObj.attributes.brightness) {
          color = this._applyBrightnessToColor(color, (stateObj.attributes.brightness + 245) / 5);
        }
      } else if (useBrightness && stateObj.attributes.brightness) {
        color = this._applyBrightnessToColor(this._getDefaultColorForState(), (stateObj.attributes.brightness + 245) / 5);
      } else {
        color = this._getDefaultColorForState();
      }
    }
    return color;
  }

  _applyBrightnessToColor(color, brightness) {
      const colorObj = new TinyColor(this._getColorFromVariable(color));
      if (colorObj.isValid) {
        const validColor = colorObj.mix('black', 100 - brightness).toString();
        if (validColor) return validColor;
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
      } else {
        return tinycolor(middle).mix(high, (mixAmount - 50) * 2).toRgbString();
      }
  }

  _getDefaultColorForState() {
    return this.config.color_on ? this.config.color_on: '#f7d959';
  }

  _getColorFromVariable(color: string): string {
    if (typeof color !== "undefined" && color.substring(0, 3) === 'var') {
      return window.getComputedStyle(document.documentElement).getPropertyValue(color.substring(4).slice(0, -1)).trim();
    }
    return color;
  }

  static get styles() {
    return css`
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
        display:flex;
        flex-direction:row;
        padding-top:50px;
      }
      .row:first-child {
        padding-top:0;
      }

      .row .col {
        padding-left:50px;
      }
      .row .col:first-child {
        padding-left:35px;
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
      }

      card-maker {
        height:100%;
      }
    `;
  }
}

customElements.define("homekit-card", HomeKitCard);