import { LitElement, html, css } from 'lit-element';
import {
  computeStateDisplay,
  computeDomain,
  domainIcon
} from 'custom-card-helpers';
import tinycolor, { TinyColor, isReadable } from '@ctrl/tinycolor';
import { noChange } from 'lit-html';

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
    }

    render() {
      return cardTools.LitHtml`
      <div class="container" >
        ${this.config.home ? cardTools.LitHtml `
            <div class="header">
                ${this.config.title ? cardTools.LitHtml `<h1>${this.config.title}</h1>`: cardTools.LitHtml ``}
            </div>
        `: cardTools.LitHtml ``}
        ${this.config.entities.map(row => {
            var entityCount = 0;
            return cardTools.LitHtml`
                <div class="card-title">${row.title}</div>
                    <div class="homekit-card">
                        ${row.entities.map(ent => {
                          if(!ent.card) {
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
                              return stateObj ? cardTools.LitHtml`
                                  <homekit-card-item>
                                    <homekit-button class="${stateObj.state === "on" ? 'button on': 'button'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                        <div class="button-inner">
                                          <span class="icon" style="${stateObj.state === "on" ? 'color:'+color+';' : ''}">
                                            <ha-icon icon="${ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin': ""}"/>
                                          </span>
                                          <span class="${stateObj.state === "on" ? 'name on': 'name'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                          <span class="${stateObj.state === "on" ? 'state on': 'state'}">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}${stateObj.attributes.brightness ? cardTools.LitHtml` <span class=" ${stateObj.state === "on" ? 'value on': 'value'}"><span>${Math.round(stateObj.attributes.brightness/2.55)}%</span></span>` : cardTools.LitHtml``}</span>
                                        </div>
                                    </homekit-button>
                                  </homekit-card-item>
                                  ${entityCount == 3 && this.config.breakOnMobile ? cardTools.LitHtml`<div class="break"></div>`:cardTools.LitHtml``}
                                  `
                                : this._notFound(ent);
                            } else if(type == "sensor" || type == "binary_sensor"){
                              entityCount++;
                              return stateObj ? cardTools.LitHtml`
                                <homekit-card-item>
                                  <homekit-button class="${stateObj.state !== "unavailable" ? 'button on': 'button'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                      <div class="button-inner">
                                        <span class="${stateObj.state !== "unavailable" ? 'icon on': 'icon'}">
                                          <ha-icon icon="${ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                        </span>
                                        <span class="${stateObj.state !== "unavailable" ? 'name on': 'name'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                        <span class="${stateObj.state !== "unavailable" ? 'state on': 'state'}">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}</span>
                                      </div>
                                  </homekit-button>
                                </<homekit-card-item>
                                ${entityCount == 3 && this.config.breakOnMobile ? cardTools.LitHtml`<div class="break"></div>`:cardTools.LitHtml``}
                              `
                              : this._notFound(ent);
                            } else if(type == "weather") {
                              entityCount = entityCount + 2;
                              return stateObj ? cardTools.LitHtml`
                                ${entityCount == 4 && this.config.breakOnMobile ? cardTools.LitHtml`<div class="break"></div>`:cardTools.LitHtml``}
                                <homekit-card-item>
                                  <homekit-button class="button size-2 on" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                      <div class="button-inner">
                                        <span class="icon on">
                                          <ha-icon icon="${ent.icon || stateObj.attributes.icon || "mdi:weather-"+stateObj.state}" />
                                        </span>
                                        <span class="name on">${ent.name || stateObj.attributes.friendly_name}</span>
                                        <span class="state on">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                          ${stateObj.attributes.forecast[0] && stateObj.attributes.forecast[0].precipitation ? cardTools.LitHtml`
                                              <span class="value on">${stateObj.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                          ` : cardTools.LitHtml``}
                                        </span>
                                      </div>
                                  </homekit-button>
                                </<homekit-card-item>
                                ${entityCount == 3 && this.config.breakOnMobile ? cardTools.LitHtml`<div class="break"></div>`:cardTools.LitHtml``}
                              `
                              : this._notFound(ent);
                            } else {
                              entityCount++;
                              return stateObj ? cardTools.LitHtml`
                                <homekit-card-item>
                                  <homekit-button class="${stateObj.state === "off" || stateObj.state === "unavailable" ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                      <div class="button-inner">
                                        <span class="${stateObj.state === "off" || stateObj.state === "unavailable" ? 'icon': 'icon on'}">
                                          <ha-icon icon="${ent.icon || stateObj.attributes.icon}" />
                                        </span>
                                        <span class="${stateObj.state === "off" || stateObj.state === "unavailable" ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                        <span class="${stateObj.state === "off" || stateObj.state === "unavailable" ? 'state': 'state on'}">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}</span>
                                      </div>
                                  </homekit-button>
                                </<homekit-card-item>
                                ${entityCount == 3 && this.config.breakOnMobile ? cardTools.LitHtml`<div class="break"></div>`:cardTools.LitHtml``}
                              `
                              : this._notFound(ent);
                            }
                          } else {
                            entityCount++;
                            return cardTools.LitHtml`
                              <homekit-card-item>
                                <homekit-button class="button on${ent.noPadding ? ' no-padding': ''}">
                                    <div class="button-inner">
                                      <card-maker nohass data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                      </card-maker>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                              ${entityCount == 3 && this.config.breakOnMobile ? cardTools.LitHtml`<div class="break"></div>`:cardTools.LitHtml``}
                            `
                          }
                        })}
                    </div>
                </div>
            `
        })}
        
        `;
    }

    firstUpdated() {
      var myNodelist = this.shadowRoot.querySelectorAll('homekit-button')
      for (var i = 0; i < myNodelist.length; i++) {
        cardTools.longpress(myNodelist[i], {hasHold: true, hasDoubleClick: true});
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
            style = ":host {height:100%;} ha-card { background: transparent; color: #000; padding:0!important; box-shadow:none; } .header {padding:0;} .header icon {color:#f7d959;} .states {padding:0;} .states .state .state__value {font-size:14px;}";
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



    _handleClick(ev, state, entity, type, row) {
      if(type == "light") {
        if (ev.detail.action == "tap" || ev.detail.action == "double_tap") {
          this._toggle(state, entity.service);
        } else if (ev.detail.action == "hold") {
            if((row && row.popup) || entity.popup) {
                if(row.popup) {
                    var popUpCard = Object.assign({}, row.popup, { entity: state.entity_id });
                    if(entity.popupExtend) {
                        var popUpCard = Object.assign({}, popUpCard, entity.popupExtend);
                    }
                } else {
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
                }
                cardTools.popUp('test', popUpCard, false, popUpStyle);
            } else {
                this._hold(state);
            }
            
        }
      } else if(type == "sensor" || type == "binary_sensor") {
        if (ev.detail.action == "hold") {
          this._hold(state);
        }
      } else {
        if (ev.detail.action == "hold") {
          this._hold(state);
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

    _hold(stateObj) {
      cardTools.moreInfo(stateObj.entity_id)
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
      return cardTools.LitHtml`
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
        }

        card-maker {
          height:100%;
        }
      `;
    }
  }

  customElements.define("homekit-card", HomeKitCard);
});

setTimeout(() => {
  if(customElements.get('card-tools')) return;
  customElements.define('my-plugin', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
