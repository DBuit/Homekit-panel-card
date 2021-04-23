import {
    computeDomain,
    computeStateDisplay,
    domainIcon,
    forwardHaptic,
    navigate,
    toggleEntity,

} from 'custom-card-helpers';
import tinycolor, {TinyColor} from '@ctrl/tinycolor';
import { css, html, LitElement } from "card-tools/src/lit-element";
import { moreInfo } from "card-tools/src/more-info";
import { fireEvent } from "card-tools/src/event";
import { provideHass } from "card-tools/src/hass";
import { parseTemplate } from "card-tools/src/templates.js";
import { createCard } from "card-tools/src/lovelace-element.js";
import 'hammerjs';
import { HassEntity } from 'home-assistant-js-websocket';
import Masonry from 'masonry-layout'
import moment from 'moment/min/moment-with-locales';

class HomeKitCard extends LitElement {
    config: any;
    hass: any;
    shadowRoot: any;
    renderedRules: any = [];
    rowTitleColor: any;
    horizontalScroll: any;
    enableColumns: any;
    statePositionTop: any;
    doubleTapped = false;
    tileHoldAnimation = false;
    rulesColor: any;
    useTemperature = false;
    useBrightness = false;
    useRGB = false;
    CUSTOM_TYPE_PREFIX = "custom:";
    masonry = false;

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
        this.useRGB = "useRGB" in this.config ? this.config.useRGB : true;
        this.rowTitleColor = this.config.titleColor ? this.config.titleColor : false;
        this.horizontalScroll = "horizontalScroll" in this.config ? this.config.fullscreen : false;
        this.enableColumns = "enableColumns" in this.config ? this.config.enableColumns : false;
        this.statePositionTop = "statePositionTop" in this.config ? this.config.statePositionTop : false;
        this.tileHoldAnimation = "tileHoldAnimation" in this.config ? this.config.tileHoldAnimation : false;
        this.rulesColor = this.config.rulesColor ? this.config.rulesColor : false;
        this.masonry = "masonry" in this.config ? this.config.masonry : false;
    }

    addHammer(el) {
        const hammer = new Hammer(el, {});
        const $this = this;
        hammer.on("tap doubletap pressup press panmove", function (ev) {
            ev.preventDefault();
            const dataset: any = ev.target.dataset;
            const ent = JSON.parse(dataset.ent);
            const row = JSON.parse(dataset.row);
            $this.doubleTapped = false;
            if (ev.type == 'tap') {
                $this.doubleTapped = false;
                let timeoutTime = 200;
                if (!ent.double_tap_action) {
                    timeoutTime = 0;
                }
                setTimeout(function () {
                    if (!$this.doubleTapped) {
                        ev.target.classList.remove('longpress');
                        $this._handleClick(ev.type, ent, dataset.type, row)
                    }
                }, timeoutTime);
            } else {
                if (ev.type == 'doubletap') {
                    $this.doubleTapped = true;
                }
                const dataset: any = ev.target.dataset;
                if (ev.type == 'press') {
                    ev.target.classList.add('longpress');
                } else if (ev.type == 'panmove') {
                    ev.target.classList.remove('longpress');
                } else {
                    ev.target.classList.remove('longpress');
                    $this._handleClick(ev.type, ent, dataset.type, row)
                }
            }
        });
    }

    render() {
        return html`
      ${this.config.style ? html`
        <style>
          ${this.config.style}
        </style>
      ` : html``}
      <div class="container${this.enableColumns ? ' rows' : ''}" >
        ${this.config.home ? html`
            <div class="header">
                ${this.config.title ? html`<h1 style="${this.rowTitleColor ? 'color:' + this.rowTitleColor : ''}">${this.config.title}</h1>` : html``}
                <ul style="${this.rulesColor ? 'color:' + this.rulesColor : ''}">
                  ${this.renderedRules.map(rule => {
            return html`<li>${rule}</li>`;
        })}
                </ul>
            </div>
        ` : html``}
       
        ${this.enableColumns ? this._renderRows() : this._renderEntities(this.config.entities)}
      </div>
    `;
    }

    firstUpdated() {
        const myNodelist = this.shadowRoot.querySelectorAll('homekit-button.event')
        for (let i = 0; i < myNodelist.length; i++) {
            this.addHammer(myNodelist[i]);
        }
        this.shadowRoot.querySelectorAll(".card-tile").forEach(customCard => {
            let card = {
                type: customCard.dataset.card
            };
            card = Object.assign({}, card, JSON.parse(customCard.dataset.options));
            const cardElement = createCard(card);
            customCard.appendChild(cardElement);
            provideHass(cardElement);
            let style = "";
            if (customCard.dataset.style) {
                style = customCard.dataset.style;
            } else if (customCard.dataset.card == 'custom:mini-graph-card') {
                style = ":host { height: 100%; } ha-card { background: transparent; color: #000; padding: 0!important; box-shadow: none; } .header { padding: 10px 10px 0 10px; } .header .name, .header .name .ellipsis { font-size: 13px!important; font-weight: 500; color: #000; opacity: 1; } .header icon { color: #f7d959; } .states { padding: 0 10px; } .states .state .state__value { font-size: 13px; } .states .state .state__uom { font-size: 13px; margin-top: 0; line-height: normal; } .header .icon { color: #f7d959; }";
            }
            if (style != "") {
                let itterations = 0;
                const interval = setInterval(function () {
                    if (cardElement && cardElement.shadowRoot) {
                        window.clearInterval(interval);
                        const styleElement = document.createElement('style');
                        styleElement.innerHTML = style;
                        cardElement.shadowRoot.appendChild(styleElement);
                    } else if (++itterations === 10) {
                        window.clearInterval(interval);
                    }
                }, 100);
            }
        });

        if (this.masonry) {
            //console.log("MASONRY");
            const windowInnerWidth = window.innerWidth;
            //console.log(windowInnerWidth);

            let masonryColumWidth = 120;
            if (windowInnerWidth <= 768) {
                masonryColumWidth = 110;
            }
            this.shadowRoot.querySelectorAll('.homekit-card').forEach(masonryItem => {
                console.log(masonryItem);
                new Masonry(masonryItem, {
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
        return html`
      ${this.config.rows.map(row => {
            return html`
          <div class="row">
            ${row.columns.map(column => {
                if (column.collapse && this._hasAllEntitiesHidden(column)) {
                    return ``;
                }
                return html`
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

    /**
     * Returns true if all of the entities in this column are hidden
     */
    _hasAllEntitiesHidden(column) {
        return column.entities.every(
            row => row.entities.every(entity => entity.hide && this._getTemplate(this.hass.states[entity.entity], entity.hide))
        )
    }s

    _renderState(ent, stateObj, offStates, type) {
        if (!ent.hideState) {
            if (type == 'light' && (stateObj.attributes.brightness || ent.state)) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                } else {
                    return html`
            <span class=" ${offStates.includes(stateObj.state) ? 'value' : 'value on'}">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            } else if ((type == "sensor" || type == "binary_sensor") && (stateObj.last_changed || ent.state)) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                } else {
                    return html`
            <span class="previous">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            } else if ((type == "switch" || type == "input_boolean") && ent.state) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                } else {
                    return html`
            <span class="value on">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            } else if (type == "climate" && stateObj.attributes.temperature) {
                if (this.statePositionTop) {
                    return this._renderCircleState(ent, stateObj, type);
                } else {
                    return html`
            <span class=" ${offStates.includes(stateObj.state) ? 'value' : 'value on'}">${this._renderStateValue(ent, stateObj, type)}</span>
          `;
                }
            } else {
                if (ent.state) {
                    if (this.statePositionTop) {
                        return this._renderCircleState(ent, stateObj, type);
                    } else {
                        return html`
              <span class="value on">${this._renderStateValue(ent, stateObj, type)}</span>
            `;
                    }
                }
            }
        }
    }

    _renderCircleState(ent, stateObj, type) {
        return html`
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
        let stateObj = this.hass.states[state];
        const path = statePath.split('.');
        for (const pathItem of path) {
            if (stateObj[pathItem]) {
                stateObj = stateObj[pathItem];
            } else {
                stateObj = null;
            }
        }
        return stateObj;
    }

    _renderStateValue(ent, stateObj, type) {
        if (type == 'light') {
            return html`
                ${stateObj.attributes.brightness && !ent.state ? html`${Math.round(stateObj.attributes.brightness / 2.55)}%` : html``}
                ${ent.state && !ent.statePath ? html`${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html``}
                ${ent.state && ent.statePath ? html`${this._getValue(ent.state, ent.statePath)}` : html``}
              `;
        } else if (type == "sensor" || type == "binary_sensor") {
            return html`
                ${stateObj.last_changed && !ent.state ? html`${this._calculateTime(stateObj.last_changed)}` : html``}
                ${ent.state && !ent.statePath ? html`${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html``}
                ${ent.state && ent.statePath ? html`${this._getValue(ent.state, ent.statePath)}` : html``}
              `;
        } else if (type == "switch" || type == "input_boolean") {
            return html`
                ${ent.state && !ent.statePath ? html`${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html``}
                ${ent.state && ent.statePath ? html`${this._getValue(ent.state, ent.statePath)}` : html``}
              `;
        } else if (type == "climate") {
            return html`
                ${stateObj.attributes.temperature ? html`${stateObj.attributes.temperature}&#176;` : html``}
              `;
        } else {
            return html`
                ${ent.state && !ent.statePath ? html`${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}` : html``}
                ${ent.state && ent.statePath ? html`${this._getValue(ent.state, ent.statePath)}` : html``}
              `;
        }
    }

    _evalTemplate(state: HassEntity | undefined, func: any): any {
        /* eslint no-new-func: 0 */
        try {
            return new Function('states', 'entity', 'user', 'hass', 'variables', 'html', `'use strict'; ${func}`).call(
                this,
                this.hass!.states,
                state,
                this.hass!.user,
                this.hass,
                html,
            );
        } catch (e) {
            const funcTrimmed = func.length <= 100 ? func.trim() : `${func.trim().substring(0, 98)}...`;
            e.message = `${e.name}: ${e.message} in '${funcTrimmed}'`;
            e.name = 'ButtonCardJSTemplateError';
            throw e;
        }
    }

    _getTemplate(state: HassEntity | undefined, value: any | undefined): any | undefined {
        const trimmed = value.trim();
        if (trimmed.substring(0, 3) === '[[[' && trimmed.slice(-3) === ']]]') {
            return this._evalTemplate(state, trimmed.slice(3, -3));
        }
    }

    _renderEntities(entities) {
        return html`
      ${entities.map(row => {
            let entityCount = 0;
            return html`
            <div class="card-title" style="${this.rowTitleColor ? 'color:' + this.rowTitleColor : ''}">${row.title}</div>
                <div class="homekit-card${this.horizontalScroll === true ? ' scroll' : ''}${this.masonry ? ' masonry' : ''}">
                    ${row.entities.map(ent => {
                if (!ent.card && !ent.custom) {
                    let offStates = ['off', 'unavailable'];
                    if (ent.offStates) {
                        offStates = ent.offStates;
                    }
                    const stateObj = this.hass.states[ent.entity];
                    let color: string;
                    if (entityCount == 3) {
                        entityCount = 0;
                    }
                    if (entityCount == 4) {
                        entityCount = 2;
                    }

                    if (ent.color) {
                        color = ent.color
                    } else {
                        color = this._getColorForLightEntity(stateObj, this.useTemperature, this.useBrightness, this.useRGB);
                    }
                    const type = ent.entity.split('.')[0];
                    if (type == "light") {
                        entityCount++;
                        if (!ent.slider) {
                            return stateObj ? html`
                                <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                    <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                      <span class="icon${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}" style="${!offStates.includes(stateObj.state) ? 'color:' + color + ';' : ''}">

                                        ${ent.image ? html`
                                          <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" alt="${ent.name || stateObj.attributes.friendly_name}" />
                                        ` : html`
                                          <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin' : ""}"/>
                                        `}
                                      </span>
                                      <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                        ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                        ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                      </span>
                                      ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </div>
                                </homekit-button>
                              ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                              `
                                : this._notFound(ent);
                        } else {
                            return stateObj ? html`
                                <homekit-button class="event slider ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                    <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                      <span class="icon${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}" style="${!offStates.includes(stateObj.state) ? 'color:' + color + ';' : ''}">
          
                                        ${ent.image ? html`
                                          <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" alt="${ent.name || stateObj.attributes.friendly_name}" />
                                        ` : html`
                                          <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" class=" ${ent.spin && stateObj.state === "on" ? 'spin' : ""}"/>
                                        `}
                                        
                                      </span>
                                      <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                      <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                        ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                        ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                      </span>
                                      ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </div>
                                    ${offStates.includes(stateObj.state) ? html`` : html`<input type="range" .value="${stateObj.attributes.brightness / 2.55}" @change=${e => this._setBrightness(stateObj, e.target.value)}>`}
                                </homekit-button>
                              ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                              `
                                : this._notFound(ent);
                        }
                    } else if (type == "sensor" || type == "binary_sensor") {
                        entityCount++;
                        return stateObj ? html`
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" 
                                              data-ent="${JSON.stringify(ent)}" 
                                              data-type="${type}" 
                                              data-row="${JSON.stringify(row)}">
                                  <div class="button-inner${this.statePositionTop ? ' state-top' : ''}">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html`
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" alt="${ent.name || stateObj.attributes.friendly_name}" />
                                      ` : html`
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${stateObj.attributes.device_class === "timestamp" && ent.timestampFormat ? ent.timestampDiff ? html`${moment(moment().diff(moment(stateObj.state))).format(ent.timestampFormat)}` : html`${moment(stateObj.state).format(ent.timestampFormat)}` : computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                          `
                            : this._notFound(ent);
                    } else if (type == "switch" || type == "input_boolean") {
                        entityCount++;
                        return stateObj ? html`
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html`
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" alt="${ent.name || stateObj.attributes.friendly_name}" />
                                      ` : html`
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                          `
                            : this._notFound(ent);

                    } else if (type == "weather") {
                        entityCount = entityCount + 2;
                        return stateObj ? html`
                            ${entityCount == 4 ? html`<div class="break"></div>` : html``}
                              <homekit-button class="event button size-2 on${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="icon on">
                                      <ha-icon icon="${ent.icon || stateObj.attributes.icon || "mdi:weather-" + stateObj.state}" />
                                    </span>
                                    <span class="name on">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="state on">${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${stateObj.attributes.forecast[0] && stateObj.attributes.forecast[0].precipitation ? html`
                                          <span class="value on">${stateObj.attributes.forecast[0].precipitation} ${this._getUnit("precipitation")}</span>
                                      ` : html``}
                                    </span>
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                          `
                            : this._notFound(ent);
                    } else if (type == "climate") {
                        entityCount++;
                        const modes = {
                            auto: "hass:calendar-repeat",
                            heat_cool: "hass:autorenew",
                            heat: "hass:fire",
                            cool: "hass:snowflake",
                            off: "hass:power",
                            fan_only: "hass:fan",
                            dry: "hass:water-percent",
                        };
                        let mode: any;
                        if (stateObj.state == 'off') {
                            mode = 'off';
                        } else if (stateObj.attributes.hvac_action == 'heating') {
                            mode = 'heat';
                        } else if (stateObj.attributes.hvac_action == 'idle') {
                            mode = 'idle';
                        } else {
                            mode = stateObj.state in modes ? stateObj.state : "unknown-mode";
                        }
                        return stateObj ? html`
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon climate ' + mode : 'icon climate on ' + mode}">
                                      ${ent.state ? Math.round(this.hass.states[ent.state]!.state) : Math.round(stateObj.attributes.current_temperature)}&#176;
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                          `
                            : this._notFound(ent);
                    } else {
                        entityCount++;
                        return stateObj ? html`
                              <homekit-button class="event ${offStates.includes(stateObj.state) ? 'button' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(stateObj, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(stateObj, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="${type}" data-row="${JSON.stringify(row)}">
                                  <div class="button-inner">
                                    <span class="${offStates.includes(stateObj.state) ? 'icon' : 'icon on'}${ent.spin === true && !offStates.includes(stateObj.state) ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                      ${ent.image ? html`
                                        <img src="${ent.offImage ? offStates.includes(stateObj.state) ? ent.offImage : ent.image : ent.image}" />
                                      ` : html`
                                        <ha-icon icon="${ent.offIcon ? offStates.includes(stateObj.state) ? ent.offIcon : ent.icon : ent.icon || stateObj.attributes.icon || domainIcon(computeDomain(stateObj.entity_id), stateObj.state)}" />
                                      `}
                                    </span>
                                    <span class="${offStates.includes(stateObj.state) ? 'name' : 'name on'}">${ent.name || stateObj.attributes.friendly_name}</span>
                                    <span class="${offStates.includes(stateObj.state) ? 'state' : 'state on'}">
                                      ${computeStateDisplay(this.hass.localize, stateObj, this.hass.language)}
                                      ${!this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                    </span>
                                    ${this.statePositionTop ? this._renderState(ent, stateObj, offStates, type) : ''}
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                          `
                            : this._notFound(ent);
                    }
                } else if (ent.card && !ent.custom) {
                    entityCount++;
                    let stateObj = {state: ''};
                    let offStates = ['off', 'unavailable'];
                    if (ent.entity) {
                        if (ent.offStates) {
                            offStates = ent.offStates;
                        }
                        stateObj = this.hass.states[ent.entity];
                    }

                    if (ent.tap_action) {
                        return html`
                            <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'} event${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(undefined, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(undefined, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="'card'" data-row="${JSON.stringify(row)}">
                                <div class="button-inner card-tile" data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                </div>
                            </homekit-button>
                          ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                        `
                    } else {
                        return html`
                              <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'}${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(undefined, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(undefined, ent.conditionalClass) : ''}">
                                  <div class="button-inner card-tile" data-card="${ent.card}" data-options="${JSON.stringify(ent.cardOptions)}" data-style="${ent.cardStyle ? ent.cardStyle : ''}">
                                  </div>
                              </homekit-button>
                            ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                          `
                    }
                } else if (ent.custom) {
                    entityCount++;
                    let stateObj = {state: ''};
                    let offStates = ['off', 'unavailable'];
                    if (ent.entity) {
                        if (ent.offStates) {
                            offStates = ent.offStates;
                        }
                        stateObj = this.hass.states[ent.entity];
                    }
                    return html`
                          <homekit-button class="${ent.entity ? stateObj.state != '' && offStates.includes(stateObj.state) ? 'button' : ' button on' : 'button on'} event${ent.noPadding ? ' no-padding' : ''}${ent.wider ? ent.widerSize ? ' size-' + ent.widerSize : ' size-2' : ''}${ent.higher ? ent.higherSize ? ' height-' + ent.higherSize : ' height-2' : ''}${ent.halfheight ? ' height-half' : ''}${this.tileHoldAnimation ? ' animate' : ''}${ent.hide && this._getTemplate(undefined, ent.hide) ? ' hide' : ''}${ent.conditionalClass ? ' ' + this._getTemplate(undefined, ent.conditionalClass) : ''}" data-ent="${JSON.stringify(ent)}" data-type="'custom'" data-row="${JSON.stringify(row)}">
                              <div class="button-inner">
                                <span class="icon on${ent.spin === true ? ' spin' : ''}${ent.image ? ' image' : ''}">
                                  ${ent.image ? html`
                                    <img src="${ent.image}" alt="" />
                                  ` : html`
                                    <ha-icon icon="${ent.icon}" />
                                  `}
                                </span>
                                <span class="name on">${ent.name}</span>
                                ${ent.state ? html`<span class="state">${computeStateDisplay(this.hass.localize, this.hass.states[ent.state], this.hass.language)}</span>` : html``}
                              </div>
                          </homekit-button>
                        ${entityCount == 3 ? html`<div class="break"></div>` : html``}
                        `
                }
            })}
                </div>
            </div>
        `
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
                    this.renderedRules = c.match(/<li>([^]*?)<\/li>/g).map(function (val) {
                        return val.replace(/<\/?li>/g, '');
                    });
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
        } else if (diffHrs > 0) {
            return this.statePositionTop ? diffHrs + 'h' : diffHrs + ' hours ago';
        } else if (diffMins > 0) {
            return this.statePositionTop ? diffMins + 'm' : diffMins + ' minutes ago';
        } else {
            return this.statePositionTop ? diffSecs + 's' : diffSecs + ' seconds ago';
        }
    }

    _handleClick(action, entity, type, row) {
        let state = null;
        if (entity.entity) {
            state = this.hass.states[entity.entity];
        }

        if ((action == "tap" || action == "doubletap")) {
            if (action == "doubletap" && entity.double_tap_action) {
                this._customAction(entity.double_tap_action, entity, row);
            } else if (entity.tap_action) {
                this._customAction(entity.tap_action, entity, row);
            } else if (type === "light" || type === "switch" || type === "input_boolean" || type === "group") {
                this._toggle(state, entity.service);
            }
        } else if (action == "pressup") {
            if (entity.hold_action) {
                this._customAction(entity.hold_action, entity, row);
            } else {
                this._hold(state, entity, row);
            }
        }
    }

    _customAction(tapAction, entity, row) {
        if (tapAction.confirmation) {
            forwardHaptic("warning");

            if (
                !confirm(
                    tapAction.confirmation.text ||
                    `Are you sure you want to ${tapAction.action}?`
                )
            ) {
                return;
            }
        }

        switch (tapAction.action) {
            case "popup":
                this._createPopup((tapAction.entity || entity.entity), entity, row);
                if (tapAction.haptic) forwardHaptic(tapAction.haptic);
                break;
            case "more-info":
                if (tapAction.entity || tapAction.camera_image) {
                    moreInfo(tapAction.entity ? tapAction.entity : tapAction.camera_image!);
                    if (tapAction.haptic) forwardHaptic(tapAction.haptic);
                }
                break;
            case "navigate":
                if (tapAction.navigation_path) {
                    navigate(window, tapAction.navigation_path);
                    if (tapAction.haptic) forwardHaptic(tapAction.haptic);
                }
                break;
            case "url":
                if (tapAction.url_path) {
                    window.open(tapAction.url_path);
                    if (tapAction.haptic) forwardHaptic(tapAction.haptic);
                }
                break;
            case "toggle":
                if (tapAction.entity) {
                    toggleEntity(this.hass, tapAction.entity!);
                    if (tapAction.haptic) forwardHaptic(tapAction.haptic);
                }
                break;
            case "call-service": {
                if (!tapAction.service) {
                    forwardHaptic("failure");
                    return;
                }
                const [domain, service] = tapAction.service.split(".", 2);
                this.hass.callService(domain, service, tapAction.service_data);
                if (tapAction.haptic) forwardHaptic(tapAction.haptic);
                break;
            }
            case "fire-dom-event": {
                fireEvent("ll-custom", tapAction);
                if (tapAction.haptic) forwardHaptic(tapAction.haptic);
                break;
            }
        }
    }

    getCardSize() {
        return 1;
    }

    async _createPopup(entity_id, entity, row) {
        if ((row && row.popup) || entity.popup) {
            let popUpCard: object;
            if (row.popup) {
                popUpCard = Object.assign({}, row.popup, {entity: entity_id});
                if (entity.popupExtend) {
                    popUpCard = Object.assign({}, popUpCard, entity.popupExtend);
                }
            } else {
                popUpCard = Object.assign({}, entity.popup, {entity: entity_id});
            }
            const popUpStyle = {
                '$': ".mdc-dialog .mdc-dialog__container { width: 100%; } .mdc-dialog .mdc-dialog__container .mdc-dialog__surface { width:100%; box-shadow:none; }",
                '.': ":host { --mdc-theme-surface: rgba(0,0,0,0); --secondary-background-color: rgba(0,0,0,0); --ha-card-background: rgba(0,0,0,0); --mdc-dialog-scrim-color: rgba(0,0,0,0.8); --mdc-dialog-min-height: 100%; --mdc-dialog-min-width: 100%; --mdc-dialog-max-width: 100%; } mwc-icon-button { color: #FFF; }"
            }
            const action = {
                browser_mod: {
                    command: "popup",
                    title: " ",
                    style: popUpStyle,
                    card: popUpCard,
                    deviceID: ['this']
                }
            }
            fireEvent("ll-custom", action);
        } else {
            moreInfo(entity_id)
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
        return html`
        <homekit-button class="not-found">
          <div class="button-inner">
            <span class="name">${ent.entity}</span>
            <span class="state">Not found</span>
          </div>
        </homekit-button>
    `;
    }


    _getColorForLightEntity(stateObj, useTemperature, useBrightness, useRGB) {
        let color = this.config.default_color ? this.config.default_color : this._getDefaultColorForState();
        if (stateObj) {
            if (stateObj.attributes.rgb_color) {
                if(useRGB) {
                    color = `rgb(${stateObj.attributes.rgb_color.join(',')})`;
                }
                if (useBrightness && stateObj.attributes.brightness) {
                    color = this._applyBrightnessToColor(color, (stateObj.attributes.brightness + 245) / 5);
                }
            } else if (useTemperature && stateObj.attributes.color_temp && stateObj.attributes.min_mireds && stateObj.attributes.max_mireds) {
                color = this._getLightColorBasedOnTemperature(stateObj.attributes.color_temp, stateObj.attributes.min_mireds, stateObj.attributes.max_mireds);
                if (useBrightness && stateObj.attributes.brightness) {
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
        return this.config.color_on ? this.config.color_on : '#f7d959';
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

        .button.size-2 input[type="range"] {
            width: calc((var(--slider-width, 120px) * 2) + (10px * 1) - 1px);
            right: calc(50% - (((var(--slider-width, 120px) * 2) + (1 * 10px) - 1px) / 2));
        }
        
        .button.size-3 input[type="range"] {
            width: calc((var(--slider-width, 120px) * 3) + (10px * 2) - 1px);
            right: calc(50% - (((var(--slider-width, 120px) * 3) + (2 * 10px) - 1px) / 2));
        }
        
        .button.size-4 input[type="range"] {
            width: calc((var(--slider-width, 120px) * 4) + (10px * 3) - 1px);
            right: calc(50% - (((var(--slider-width, 120px) * 4) + (3 * 10px) - 1px) / 2));
        }
        
        .button.size-5 input[type="range"] {
            width: calc((var(--slider-width, 120px) * 5) + (10px * 4) - 1px);
            right: calc(50% - (((var(--slider-width, 120px) * 5) + (4 * 10px) - 1px) / 2));
        }
        
        .button.size-6 input[type="range"] {
            width: calc(
                (var(--slider-width, 120px) * 6) + (10px * 5) - 1px
            );
            right: calc(50% - (((var(--slider-width, 120px) * 6) + (5 * 10px) - 1px) / 2));
        }
        .button.size-6 input[type="range"]::-webkit-slider-thumb {
            box-shadow: -400px 0 0 410px var(--tile-on-background),
                inset 0 0 0 80px var(--tile-background);
        }

        .button.height-2 input[type="range"] {
            height: calc(
                (var(--slider-height, 120px) * 2) + (10px * 1) - 1px
            );
            top: calc(50% - (((var(--slider-height, 120px) * 2) / 2) + (5px * 1)));
        }
        
        .button.height-3 input[type="range"] {
            height: calc(
                (var(--slider-height, 120px) * 3) + (10px * 2) - 1px
            );
            top: calc(50% - (((var(--slider-height, 120px) * 3) / 2) + (5px * 2) - 0.5px));
        }
        
        .button.height-4 input[type="range"] {
            height: calc(
                (var(--slider-height, 120px) * 4) + (10px * 3) - 1px
            );
            top: calc(50% - (((var(--slider-height, 120px) * 4) / 2) + (5px * 3)));
        }
        
        .button.height-5 input[type="range"] {
            height: calc(
                (var(--slider-height, 120px) * 5) + (10px * 4) - 1px
            );
            top: calc(50% - (((var(--slider-height, 120px) * 5) / 2) + (5px * 4) - 0.5px));
        }
        
        .button.height-6 input[type="range"] {
            height: calc(
                (var(--slider-height, 120px) * 6) + (10px * 5) - 1px
            );
            top: calc(50% - (((var(--slider-height, 120px) * 6) / 2) + (5px * 5)));
        }

        .button.height-half input[type="range"] {
            height: calc((var(--slider-height, 120px) * 0.5) - 3px);
            top: calc(50% - (((var(--slider-height, 120px) * 0.5) / 2) - 1px));
        }
        
        .button.height-half input[type="range"]::-webkit-slider-runnable-track {
            height: calc((var(--slider-height, 120px) * 0.5) - 3px);
        }
        
        .button.height-half input[type="range"]::-webkit-slider-thumb {
            top: calc((((var(--slider-height, 120px) * 0.5) - 80px) / 2));
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