import { LitElement, html, css } from 'lit-element';
import {
  computeStateDisplay,
  computeDomain,
  domainIcon
} from 'custom-card-helpers';

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
        
      return cardTools.LitHtml`
      <div class="container" >
        ${this.config.home ? cardTools.LitHtml `
            <div class="header">
                ${this.config.title ? cardTools.LitHtml `<h1>${this.config.title}</h1>`: cardTools.LitHtml ``}
            </div>
        `: cardTools.LitHtml ``}
        ${this.config.entities.map(row => {
            return cardTools.LitHtml`
                <div class="card-title" >${row.title}</div><br>
                    <div class="homekit-card">
                        ${row.entities.map(ent => {
                          const stateObj = this.hass.states[ent.entity];
                          var type = ent.entity.split('.')[0];
                          if(type == "light"){
                            return stateObj ? cardTools.LitHtml`
                                <homekit-card-item>
                                  <homekit-button class="${stateObj.state === "off" ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                      <div class="button-inner">
                                        <span class="${stateObj.state === "off" ? 'icon': 'icon on'}">
                                          <ha-icon icon="${ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin': ""}"/>
                                        </span>
                                        <span class="${stateObj.state === "off" ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                        <span class="${stateObj.state === "off" ? 'state': 'state on'}">${stateObj.state}${stateObj.attributes.brightness ? cardTools.LitHtml` <span class=" ${stateObj.state === "off" ? 'value': 'value on'}"><span>${Math.round(stateObj.attributes.brightness/2.55)}%</span></span>` : cardTools.LitHtml``}</span>
                                      </div>
                                  </homekit-button>
                                </homekit-card-item>
                                `
                              : this._notFound(ent);
                          } else if(type == "sensor" || type == "binary_sensor"){
                            return stateObj ? cardTools.LitHtml`
                              <homekit-card-item>
                                <homekit-button class="button on" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                    <div class="button-inner">
                                      <span class="icon on">
                                        <ha-icon icon="${ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                      </span>
                                      <span class="name on">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}</span>
                                      <span class="state on">${stateObj.state}${stateObj.attributes.unit_of_measurement ? cardTools.LitHtml` ${stateObj.attributes.unit_of_measurement}`:cardTools.LitHtml``}</span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                            `
                            : this._notFound(ent);
                          } else if(type == "weather") {
                            return stateObj ? cardTools.LitHtml`
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
                            `
                            : this._notFound(ent);
                          } else {
                             return stateObj ? cardTools.LitHtml`
                              <homekit-card-item>
                                <homekit-button class="${stateObj.state === "off" ? 'button': 'button on'}" @action=${(ev) => this._handleClick(ev, stateObj, ent, type, row)}>
                                    <div class="button-inner">
                                      <span class="${stateObj.state === "off" ? 'icon': 'icon on'}">
                                        <ha-icon icon="${ent.icon || stateObj.attributes.icon}" />
                                      </span>
                                      <span class="${stateObj.state === "off" ? 'name': 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${stateObj.state === "off" ? 'state': 'state on'}">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}</span>
                                    </div>
                                </homekit-button>
                              </<homekit-card-item>
                            `
                            : this._notFound(ent);
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
    }

    _handleClick(ev, state, entity, type, row) {
      if(type == "light") {
        if (ev.detail.action == "tap") {
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

    static get styles() {
      return css`
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
  if(customElements.get('card-tools')) return;
  customElements.define('my-plugin', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
