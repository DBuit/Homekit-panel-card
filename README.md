[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)

# homekit-card
Homekit style Home Assistant card

This card is best used with `panel: true` so the card fills up the whole page.
The purpose of this card is to fill a page with tiles in homekit style.
You can add entities and define multiple rows with your own title to create your homekit style page.

It is possible that an entity is not standard and is not shown as you expected.
An example of this is weather entity, for this I have therefore added a separate tile to the card so that it is displayed in the correct way. If you have an entity that is not displayed properly, create an issue.

You can also adjust the pop-up that opens when you hold down a tile.
You can have the pop-up open another lovelace card so that you can show other info in the popup, you can also just use the standard.
For lights I have developed a separate card that also has the style of homekit, which you can use well in combination with this card. You can find this card here: https://github.com/DBuit/hass-custom-light-popup-card

Do you have ideas for a custom pop-up create an issue then I can see if I can help with this :)

<a href="https://www.buymeacoffee.com/ZrUK14i" target="_blank"><img height="41px" width="167px" src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee"></a>


## Configuration

### Installation instructions

**HACS installation:**
Go to the hacs store and use the repo url `https://github.com/DBuit/Homekit-panel-card` and add this as a custom repository under settings.

Add the following to your ui-lovelace.yaml:
```yaml
resources:
  url: /hacsfiles/Homekit-panel-card/homekit-panel-card.js
  type: module
```

**Manual installation:**
Copy the .js file from the dist directory to your www directory and add the following to your ui-lovelace.yaml file:

```yaml
resources:
  url: /local/homekit-panel-card.js
  type: module
```

**Wanna use the popup functionality?**

The popups use browser mod to display any lovelace card in a popup. To use the popups install browser mod: https://github.com/thomasloven/hass-browser_mod
And also install card-mod so the custom styles can be applied to the popups: https://github.com/thomasloven/lovelace-card-mod


### Configure the card in your lovelace-ui.yaml

I will break up the configuration of the card to a few levels.
1. First some global stuff you can configure
2. The rows with tiles that can be configured
3. A specific tile/entity that can be configured


#### 1. Global configuration

First use the custom card and set the panel: true so that it fills up the whole screen.
```
views:
  - title: "Home"
    icon: mdi:home-outline
    path: "home"
    panel: true
    cards:
      - type: "custom:homekit-card"
```

in the card we can define some global configuration below you can find these options:

| Name | Type | Required | Default | Description |
| -------------- | ----------- | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home` | boolean | optional | false | When true this creates extra space above your tiles where you can show a title and display rules |
| `title` | string | optional | "" | When home is true you can give your page a title |
| `rules` | string | optional | 400px | When home is true you can define rules in template to display stats like how many lights are on or I use it to set a message that I need to put the trash out. |
| `rulesColor` | string | optional | "#FFF" | Default the text is white and this can be overwritten with a new color |
| `tileHoldAnimation` | boolean | optional | false | When true the tile with grow in size when holding :) |
| `title` | string | optional | "" | When home is true you can give your page a title |
| `useRGB` | boolean | optional | true | When true the lights rgb value is used to color the icon |
| `useBrightness` | boolean | optional | true | When true the lights brightness is used to color the icon |
| `useTemperature` | boolean | optional | false | When true the temperature is used to color the icon |
| `titleColor` | number | optional |  | Titles above a row of tiles is colored by them this can overwrite this color |
| `horizontalScroll` | boolean | optional | false | Default when a tile doesn't fit on the screen it goes to a next row, when you enable this it won't break to a next row but it will be scrollable |
| `enableColumns` | boolean | optional | false | When enabled you can make rows with a title and tiles but also define columns within these rows |
| `masonry` | boolean | optional | false | When enabled it will order the tiles by size and makes sure there are no blank space on a row. This is usefull when using wider and higher options on a tile so everything fits nicely, check out the website of the plugin builder to get an idea of what it does: https://masonry.desandro.com/ |
| `statePositionTop` | boolean | optional | false | Default the brightness (for lights) and last_changed (for sensors) is shown in the title next to the current state (on/off) when this is true this state if chown next to the icon in a circle (inspired by: https://community-home-assistant-assets.s3.dualstack.us-west-2.amazonaws.com/optimized/3X/d/c/dcf67fccb5fa3772b2db6d38aeef307d01ba3bc8_2_1380x862.jpeg) |
| `style` | string | optional | css | Use the style option to add extra CSS default there is a list of variables to easily overwrite colors, sizes of the tiles see the list of variables under the table |
| `haptic` | string | none | `success`, `warning`, `failure`, `light`, `medium`, `heavy`, `selection` | Haptic feedback for the <a href="https://companion.home-assistant.io/" target="_blank">iOS Companion App</a> |
| `doubleTapFallback` | string | optional | tap | double tap default fallback to a tap action, you can also change this to hold so it will fallback to hold action which default opens the more info popup |
| `doubleTapDisabledWhenNoActionSet` | boolean | optional | true | This works togheter with the `doubleTapFallback` so when this is set to false there is a little delay on tap actions to determine if it could be a double tap, by setting this to `true` double tap is not used so it will just be 2 single tap actions without any delay |


**Css variables and default values**

Example config:

```
- type: "custom:homekit-card"
  style: |
    :host {
      --tile-background: rgba(255, 255, 255, 0.8);
      --tile-border-radius: 12px;
      --tile-width: 100px;
      --tile-height: 100px;
      --tile-on-background: rgba(255, 255, 255, 1);
      
      --tile-name-text-color: rgba(0, 0, 0, 0.4);
      --tile-on-name-text-color: rgba(0, 0, 0, 1);
      
      --tile-state-text-color: rgba(0, 0, 0, 0.4);
      --tile-on-state-text-color: rgba(0, 0, 0, 1);
      
      --tile-state-changed-text-color: rgb(134, 134, 134);
      --tile-unavailable-state-text-color: rgba(255, 0, 0, 1);
      
      --tile-value-text-color: rgba(255, 0, 0, 1);
      
      
      --tile-icon-color: rgba(0, 0, 0, 0.3);
      --tile-on-icon-color: #f7d959;
      
      
      --tile-width-mobile: 90px;
      --tile-height-mobile: 90px;

      --min-header-height: 150px;

      --tile-icon-size: 30px;

      --tile-image-radius: 100%

      --slider-width: 120px;
      --slider-height: 120px;
    }
```

#### 2. Configure Rows and Tiles


At this point our configuration looks like this for example:
```
views:
  - title: "Home"
    icon: mdi:home-outline
    path: "home"
    panel: true
    cards:
      - type: "custom:homekit-card"
        home: true
        rules: |
          {% if "Vandaag" in states('sensor.blink_gft') %} <li>Vandaag groenebak aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_papier') %} <li>Vandaag oudpapier aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_pmd') %} <li>Vandaag plastic aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_restafval') %} <li>Vandaag grijzebak aan de straat</li> {% endif %}
          {% if states('sensor.current_lights_on') | float > 0 %} <li>{{states('sensor.current_lights_on')}} lampen aan</li> {% endif %}
          {% if states('sensor.current_media_players_on') | float > 0 %} <li>{{states('sensor.current_media_players_on')}} speakers aan</li> {% endif %}
        title: "Demo"
        useBrightness: false
        titleColor: "#FFF"
        enableColumns: true
        statePositionTop: true
```

Now we want to create rows and tiles to display our entities.
In my example I enabled the `enableColumns` but I will first show the configuration if `enableColumns: false`.

We start with `entities:`, every item in the entities is a row with tiles, and every row can have it's own title.
So below `statePositionTop: true` in our example we add the following:

```
        entities:
          - title: Row 1
            entities:
```

As you can see we started with entities inside the entities we defined 1 item with a title rows and an empty list of more `entities`.
These entities are the tiles we want to display in the row. let's add these tiles!
You can also get haptic feedback for iOS user, this can be enabled globally or on each row by adding `haptic`.

```
        entities:
          - title: Row 1
            haptic: success
            entities:
              - entity: light.zithoek
              - entity: binary_sensor.wasmachine_status
              - entity: media_player.keuken
          - title: Row 2
            entities: 

```

As you can see we can set a list with entities and each one will be one tile. and then we can start a new row by adding a new `- title` with `entities`.

In the above example we only set the `entity:` for a tile that is enough to let it work but we can do more to customize this.

| Name | Type | Required | Default | Description |
| -------------- | ----------- | ------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entity` | string | **required** | `light.example` | The only required one is the entity |
| `icon` | string | optional | "" | (for alle types except climate this shows the temperature) |
| `offIcon` | boolean | optional | 'mdi:icon' | if you set an offIcon than this icon will be showed when the entity state is equal to an state in the offStates (default offStates: off or unavailable). |
| `image` | string | optional | "/path/to/image.png" | path to an image (for alle types except climate this shows the temperature) |
| `offImage` | string | optional | "/path/to/image.png" | if you set an offImage than this image will be showed when the entity state is equal to an state in the offStates (default offStates: off or unavailable). |
| `name` | string | optional | You can overwrite the name shown on the tile |
| `offStates` | array | optional | - "paused" | Default the "off" and "unavailable" state will show the tile greyed out but you can set your own list of states that should be considered as off |
| `state` | boolean | optional | false | The tile show extra state info like brightness for lights and last_changed for sensors on the tile you can also set an entity here and the state of this entity is shown on that place |
| `statePath` | boolean | optional | false | In combination with `state` you can also display other values besided the entities state. for example you can set this to `attributes.brightness` to display the brightness of the entity you have set in `state` |
| `hideState` | boolean | optional | false | When you do not wan't the last updated or brightness for lights is displayed you can hide the state by setting this to true |
| `timestampFormat` | string | optional | '[Klaar over] h [uur en ] mm [minuten]' | When you have a sensor with the device_class timestamp you can use the timestampFormat to format the timestamp to a readable date and time. Use text in [] brackets to add text |
| `timestampDiff` | boolean | optional | false | When you use a sensor with device_class timestamp and this display a timestamp in the future with the purpose to display in how many days/hours etc. the event takes place set this to true so it will calculate the different from now till the timestamp |
| `tap_action` | number | optional | See [actions](#action-options) | can be used to customize the action on tap/click (lights and switches have already a tap action) |
| `hold_action` | boolean | optional | See [actions](#action-options) | Set a custom action for hold, default it opens the more-info pop-up |
| `double_tap_action` | boolean | optional | See [actions](#action-options) | Set a custom action for double tap. If no double tap is defined this will default trigger the tap action |
| `spin` | boolean | optional | false | If true this will let the icon spin when the entity is on |
| `wider` | boolean | optional | false | If true the tile will be the size of 2 tiles |
| `widerSize` | number | optional | 1,2,3,4,5 or 6 | When wider is enable it makes the default tile width 2 tiles wide, with widerSize you can make make it up to 6 tiles wide |
| `higher` | boolean | optional | false | If true the tile will be the height of 2 tiles |
| `higherSize` | number | optional | 1,2,3,4,5 or 6 | When higher is enable it makes the default tile height 2 tiles high, with higherSize you can make make it up to 6 tiles high |
| `halfheight` | boolean | optional | false | If true the tile will be half the height of 1 tile (Best used in combination with wider to make sure the information fits the tile) |
| `slider` | boolean | optional | false | If true a slider element is added to the tile to control the lights brightness |
| `hide` | template | optional | "[[[ [template](#template-hide-or-customclass) ]]]" | With the use of JS in a template you can hide/show a tile |
| `conditionalClass` | template | optional | "[[[ [template](#template-hide-or-customclass) ]]]" | With the use of JS in a template you can add a css class to a tile and in the style part of the card you can change the style any way you want |
| `haptic` | string | none | `success`, `warning`, `failure`, `light`, `medium`, `heavy`, `selection` | Haptic feedback for the <a href="https://companion.home-assistant.io/" target="_blank">iOS Companion App</a> |

##### Template hide or customClass

JS templates can be used for 2 config option on your tile.
1. Hide
With hide you can hide/show a tile based on a confition in the template. For example hide a tile when light is on or show it when the brightness is lower than a value.
2. conditionalClass
With conditionalClass you can add a css class to a tile. that does not do anything but this class in combination with a custom css style makes it possible to make a tile red for example when your tempeture goes below a value.

The template code i borrowed from the custom button card for most part: https://github.com/custom-cards/button-card#javascript-templates

Example code:

```
  - entity: light.beganegrond
    name: Lichtstrip
    hide: >
      [[[
        var bri = states['light.beganegrond'].attributes.brightness;
        return bri > 200;
      ]]]
    conditionalClass: >
      [[[
        var bri = states['light.beganegrond'].attributes.brightness;
        if (bri < 200)
          return "redtile";
        else
          return "";
      ]]]
```

##### Custom popup

So now we can create our rows and tiles and customize it the way you want.
But because I developed this card to get a nice homekit style experience, I have also developed some pop-up cards that can be used in combination with this card.

At this moment I made the following pop-ups: (You got an idea for new ones? let me know!)
- Light pop-up (https://github.com/DBuit/light-popup-card)
- Thermostat/Climate pop-up (https://github.com/DBuit/thermostat-popup-card)

Within this card you can define custom pop-up cards that will be opened when you use the `hold` action/ long press.
You can use my cards or any other card and this will be displayed in a pop-up. 

** Follow installation on the GitHub page of the pop-up card first **

Because you don't want to set this pop-up for every tile you can also set a pop-up for an entire row
so we got this part of the configuration:

```
        entities:
          - title: Row 1
            entities:
              - entity: light.zithoek
              - entity: light.zithoek
              - entity: light.zithoek
          - title: Row 2
            entities: 
```

And in Row 1 we only got lights so it would be nice to have the light pop-up in place.
We can set a `popup` in the row, and within the popup we can set a `type` which is a reference to an lovelace card. see the example below:

```
        entities:
          - title: Row 1
            popup:
              type: custom:light-popup-card
            entities:
              - entity: light.zithoek
              - entity: light.zithoek
              - entity: light.zithoek
          - title: Row 2
            entities: 
```

Now when we use the hold/longpress action on our tiles in Row 1 it will not open the default more-info pop-up with it will open a pop-up which shows our custom lovelace card `custom:light-popup-card`. Besides type to set the card you can just set other configuration the card need for example the light popup card could be configured like this:

```
        entities:
          - title: Row 1
            popup:
              type: custom:light-popup-card
              scenesInARow: 2
              brightnessWidth: 130px
              brightnessHeight: 350px
              switchWidth: 110px
              switchHeight: 300px
            entities:
              - entity: light.zithoek
              - entity: light.zithoek
              - entity: light.zithoek
          - title: Row 2
            entities: 
```

In some situations you might want to use the same popup for every entity but configure something specific for the popup for some entities. For example, the light popup card can also show some actions below the brightness slider to change the color, but not all my lights need these actions so I can add `popupExtend:` to the specific entity to extend the popup cards configuration (** it is not to overwrite! **) check out below example:

```
        entities:
          - title: Row 1
            popup:
              type: custom:light-popup-card
              scenesInARow: 2
              brightnessWidth: 130px
              brightnessHeight: 350px
              switchWidth: 110px
              switchHeight: 300px
            entities:
              - entity: light.zithoek
                popupExtend:
                  actions:
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.ontspannen
                      color: "#FDCA64"
                      name: ontspannen
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.helder
                      color: "#FFE7C0"
                      name: helder
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.concentreren
                      color: "#BBEEF3"
                      name: concentreren
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.energie
                      color: "#8BCBDD"
                      name: energie
              - entity: light.zithoek
              - entity: light.zithoek
          - title: Row 2
            entities: 
```

That's all for the popups, but there are more possibilities.

##### Custom card as a tile
So we can now place our entities and customize the tiles and set custom popups but sometimes the default tile is not enough!
We want something special, but I am the only developer for this card - I can't make everything - so we can load other lovelace cards inside a tile to be directly displayed on our screen.

A great example of this is the custom card mini-graph-card it can display a graph of sensor data and is awesome to show this directly in a tile so you can do this. How let me show you in the example below:

```
        entities:
          - title: Row 1
            entities:
              - entity: light.zithoek
              - entity: light.zithoek
              - entity: light.zithoek
              - card: custom:mini-graph-card
                cardOptions:
                  entities:
                    - sensor.blink_restafval
                cardStyle: |
                  .header {
                    padding: 0;
                  }
                  .header .icon {
                      color: #f7d959;
                  }
                  .states {
                    padding: 0;
                  }
                  .states .state .state__value {
                    font-size:14px;
                  }
            - title: Row 2
              entities: 
```

If you want the tile to have an on/off state you can set a `entity` and `offStates` on the tile so it reacts to this entity's state to display as on or off.

In the example you see we **don't** set an entity; instead we set `card:` this sets the tile to a different type and will load the lovelace card defined in this configuration. In our example it is the mini-graph-card (of course this card must be installed on your home assistant installation). In probably all cases you want to use this feature the card won't be displayed really nice in the tile so you can use the `cardStyle` to overwrite the CSS of the loaded card an change it to look awesome!

Because I really like the mini-graph-card, I added the overwritten styles inside my card so when you also want to use the mini-graph-card you don't need to use the `cardStyle` configuration because I already did that for you!

Of course, if you have a custom card you want to use (and you think others would also want to use), let me know and I can also add the overwritten styles in the card so cardStyle is not needed!

##### Fully custom tile
Sometimes we just want a tile to do something, but it is not based on an entity we have in our home assistant installation.
For example I want a tile to navigate to my lights page; let's see how we can make custom tiles in the example below:

```
        entities:
          - title: Navigation
            entities:
              - custom: lampen
                name: Lampen
                icon: mdi:lightbulb-group
                state: sensor.current_lights_on
                tap_action:
                  action: navigate
                  navigation_path: /lovelace/lampen
                hold_action:
                  action: more-info
                  entity: group.all_lights
          - title: Row of entities
            entities: 
```

In the example you can see we **don't** set an entity or a card; use `custom:` instead. So, we can set the name, icon and the tap_action to make it do something when we click/tap on it. This way we got a nice tile that can do what ever we want.

##### enableColumns

In the beginning of the configuration there is a global configuration named `enableColumns` and when we set this to **true** we can not only make rows with tiles but we can configure columns within these rows.

The configuration gets a bit more complex because of this. Example:
```
views:
  - title: "Example"
    panel: true
    cards:
      - type: "custom:homekit-card"
        rows:
          - row: 1
            columns:
              - column: 1
                tileOnRow: 4
                entities:
                  - title: Lichtstrip
                    entities: 
                      - entity: light.beganegrond  
                      - entity: light.zithoek
                      - entity: light.eettafel
              - column: 2  
                tileOnRow: 3
                entities:
                  - title: Buiten verlichting
                    entities:
                      - entity: light.beganegrond  
                      - entity: light.zithoek
                      - entity: light.eettafel
          - row: 2
            columns:
              - column: 1
                tileOnRow: 4
                entities:
                  - title: Overig
                    entities:
                      - entity: binary_sensor.wasmachine_status
                      - entity: weather.weersverwachting
          - row: 3
            columns:
              - column: 1
                entities:
                  - title: Last row
                    entities:
                      - entity: switch.doorbell_chime_active
                      - entity: switch.doorbell_chime
                      - entity: switch.doorbell_restart
                      - entity: binary_sensor.doorbell_button
                      - entity: light.beganegrond  
                      - entity: light.zithoek
                      - entity: light.eettafel
```

It is a large example but gives an idea of how to make multiple rows with its own columns.
Before we started with `entities:` to define our rows now we start with `rows:` and within this we define our `row:`:
```
views:
  - title: "Example"
    panel: true
    cards:
      - type: "custom:homekit-card"
        rows:
          - row: 1
          - row: 2
          - row: 3
```
than within an row we set `columns:` and inside columns we can define our `column:`:
```
views:
  - title: "Example"
    panel: true
    cards:
      - type: "custom:homekit-card"
        rows:
          - row: 1
            columns:
              - column: 1
              - column: 2
          - row: 2
          - row: 3
```
Inside the `column` we have our `entities:` which creates a row of tiles with a tile like before, and inside there is another `entities:` with our tiles:
```
views:
  - title: "Example"
    panel: true
    cards:
      - type: "custom:homekit-card"
        rows:
          - row: 1
            columns:
              - column: 1
                entities:
                  - title: Row 1
                    entities: 
                      - entity: light.beganegrond  
                      - entity: light.zithoek
                      - entity: light.eettafel
                - title: Row 2
                    entities: 
                      - entity: light.beganegrond  
                      - entity: light.zithoek
                      - entity: light.eettafel
              - column: 2
          - row: 2
          - row: 3
```
That's all really easy ;)
To make this work nicely on both big screens and small screens we need to know how many tiles you want on 1 row. So, when you define more tiles on one row it will automatically break to a new line. When a column doesn't fit on the screen it also breaks to a new line. To set this you set `tileOnRow:` inside your `column:` and give this a number, for example 3, which means that it will show 3 tiles on a row.

The `tileOnRow:` is **not required** but optional. If you do not set this, the columns will not break to new lines, but the tiles will break which can give a weird look when scaling to smaller screens. It could also work for you, so just play with it!

Using `collapse:` on the column in conjunction with `hide:` on your entities will mean the column no longer appears if all of the entities are hidden - useful if you have dynamic options on your dashboard.

```
views:
  - title: "Example"
    panel: true
    cards:
      - type: "custom:homekit-card"
        rows:
          - row: 1
            columns:
              - column: 1
                tileOnRow: 2
                collapse: true
                entities:
                  - title: Notifications
                    entities: 
                      - entity: input_boolean.trash
                        name: Tap when trash has been taken out
                        wider: true
              - column: 2
```


#### Action options

| Name | Type | Default | Supported options | Description |
| ----------------- | ------ | -------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `action` | string | `toggle` | `popup`, `more-info`, `toggle`, `call-service`, `none`, `navigate`, `url` | Action to perform. `popup` falls back to `more-info` if popup type is not specified |
| `entity` | string | none | Any entity id | **Only valid for `action: more-info`, `action: popup` and `action: toggle`** to perform an action on the specified entity |
| `navigation_path` | string | none | Eg: `/lovelace/0/` | Path to navigate to (e.g. `/lovelace/0/`) when action defined as navigate |
| `url_path` | string | none | Eg: `https://www.google.fr` | URL to open on click when action is `url`. The URL will open in a new tab |
| `service` | string | none | Any service | Service to call (e.g. `media_player.media_play_pause`) when `action` defined as `call-service` |
| `service_data` | object | none | Any service data | Service data to include (e.g. `entity_id: media_player.bedroom`)|
| `haptic` | string | none | `success`, `warning`, `failure`, `light`, `medium`, `heavy`, `selection` | Haptic feedback for the <a href="https://companion.home-assistant.io/" target="_blank">iOS Companion App</a>
| `confirmation` | boolean or object | none | See [confirmation](#confirmation-options) | Present a confirmation dialog before performing the action |

#### Confirmation options

| Name | Type | Default | Supported options | Description |
| ----------------- | ------ | -------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `text` | string | `Are you sure you want to ${actionConfig.action}` | e.g. `Do you want to open the garage?` | Text to present in the confirmation dialog |


## Example full configuration without columns

Below an example of my configuration without `enableColumns`

```
views:
  - title: "Example"
    icon: mdi:home-outline
    path: "example"
    panel: true
    cards:
      - type: "custom:homekit-card"
        home: true
        rules: |
          {% if "Vandaag" in states('sensor.blink_gft') %} <li>Vandaag groenebak aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_papier') %} <li>Vandaag oudpapier aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_pmd') %} <li>Vandaag plastic aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_restafval') %} <li>Vandaag grijzebak aan de straat</li> {% endif %}
          {% if states('sensor.current_lights_on') | float > 0 %} <li>{{states('sensor.current_lights_on')}} lampen aan</li> {% endif %}
          {% if states('sensor.current_media_players_on') | float > 0 %} <li>{{states('sensor.current_media_players_on')}} speakers aan</li> {% endif %}
        title: "Home"
        useBrightness: false
        useTemperature: false
        useRGB: false
        titleColor: "#FFF"
        entities:
          - title: Navigatie
            entities:
              - custom: lampen
                name: Lampen
                icon: mdi:lightbulb-group
                spin: true
                state: sensor.current_lights_on
                tap_action:
                  action: navigate
                  navigation_path: /lovelace/lampen
                hold_action:
                  action: more-info
                  entity: group.all_lights
                double_tap_action:
                  action: navigate
                  navigation_path: /lovelace/dev
          - title: Lampen
            entities: 
              - entity: light.beganegrond
                name: Lichtstrip
                spin: true
                icon: mdi:led-strip-variant
                popup:
                  type: custom:light-popup-card
                  scenesInARow: 2
                  brightnessWidth: 130px
                  brightnessHeight: 350px
                  switchWidth: 110px
                  switchHeight: 300px
                  actions:
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.ontspannen
                      color: "#FDCA64"
                      name: ontspannen
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.helder
                      color: "#FFE7C0"
                      name: helder
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.concentreren
                      color: "#BBEEF3"
                      name: concentreren
                    - service: scene.turn_on
                      service_data:
                        entity_id: scene.energie
                      color: "#8BCBDD"
                      name: energie
                    - service: homeassistant.toggle
                      service_data:
                        entity_id: light.voordeurlicht
                      name: voordeur
                      icon: mdi:lightbulb
              - entity: light.zithoek
                name: Zithoek
                icon: mdi:floor-lamp
                popup:
                  type: custom:light-popup-card
                  scenesInARow: 2
                  brightnessWidth: 130px
                  brightnessHeight: 350px
                  switchWidth: 110px
                  switchHeight: 300px
              - entity: light.eettafel
                name: Eettafel
                icon: mdi:ceiling-light
                popup:
                  type: custom:light-popup-card
                  scenesInARow: 2
                  brightnessWidth: 130px
                  brightnessHeight: 350px
                  switchWidth: 110px
                  switchHeight: 300px
              - entity: light.kookeiland
                name: Kookeiland
                icon: mdi:ceiling-light
                popup:
                  type: custom:light-popup-card
                  scenesInARow: 2
                  brightnessWidth: 130px
                  brightnessHeight: 350px
                  switchWidth: 110px
                  switchHeight: 300px
              - entity: group.outdoor_lights
                name: Buiten verlichting
                tap_action:
                  action: toggle
                  entity: group.outdoor_lights
          - title: Luxaflex
            entities:
              - entity: weather.weersverwachting
              - card: custom:mini-graph-card
                noPadding: true
                cardOptions:
                  entities:
                    - sensor.wasmachine_energieverbruik
              - entity: climate.climatedemo
                popup:
                  type: custom:thermostat-popup-card
              - card: custom:blinds-tile-card
                tap_action:
                  action: more-info
                  entity: input_number.blindone
                cardOptions:
                  name: Luxaflex
                  entities:
                    - entity: input_number.blindone
                      positions: 
                        - 60
                        - 0
                        - -45
                    - entity: input_number.blindtwo
                      positions: 
                        - 75
                        - 0
                        - -50
                    - entity: input_number.blindthree
                      positions: 
                        - -65
                        - 0
                        - 50
          - title: Camera
            entities:
              - entity: camera.telefoon_daan
                spin: true
```

## Example full configuration with columns

Below an example of my configuration with `enableColumns: true`

```
views:
  - title: "Example"
    path: "example"
    panel: true
    cards:
      - type: "custom:homekit-card"
        home: true
        rules: |
          {% if "Vandaag" in states('sensor.blink_gft') %} <li>Vandaag groenebak aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_papier') %} <li>Vandaag oudpapier aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_pmd') %} <li>Vandaag plastic aan de straat</li> {% endif %}
          {% if "Vandaag" in states('sensor.blink_restafval') %} <li>Vandaag grijzebak aan de straat</li> {% endif %}
          {% if states('sensor.current_lights_on') | float > 0 %} <li>{{states('sensor.current_lights_on')}} lampen aan</li> {% endif %}
          {% if states('sensor.current_media_players_on') | float > 0 %} <li>{{states('sensor.current_media_players_on')}} speakers aan</li> {% endif %}
        title: "Home"
        useBrightness: false
        useTemperature: false
        useRGB: false
        titleColor: "#FFF"
        enableColumns: true
        statePositionTop: true
        rows:
          - row: 1
            columns:
              - column: 1
                tileOnRow: 4
                entities:
                  - title: Lichtstrip
                    popup:
                      type: custom:light-popup-card
                      scenesInARow: 2
                      brightnessWidth: 130px
                      brightnessHeight: 350px
                      switchWidth: 110px
                      switchHeight: 300px
                    entities: 
                      - entity: light.beganegrond
                        name: Lichtstrip
                        icon: mdi:led-strip-variant
                        popupExtend:
                          actions:
                            - service: scene.turn_on
                              service_data:
                                entity_id: scene.ontspannen
                              color: "#FDCA64"
                              name: ontspannen
                            - service: scene.turn_on
                              service_data:
                                entity_id: scene.helder
                              color: "#FFE7C0"
                              name: helder
                            - service: scene.turn_on
                              service_data:
                                entity_id: scene.concentreren
                              color: "#BBEEF3"
                              name: concentreren
                            - service: scene.turn_on
                              service_data:
                                entity_id: scene.energie
                              color: "#8BCBDD"
                              name: energie
                      - entity: light.zithoek
                        name: Zithoek
                        icon: mdi:floor-lamp
                      - entity: light.eettafel
                        name: Eettafel
                        icon: mdi:ceiling-light
                      - entity: light.kookeiland
                        name: Kookeiland
                        icon: mdi:ceiling-light
              - column: 2  
                tileOnRow: 3
                entities:
                  - title: Buiten verlichting
                    entities:
                      - entity: light.voordeurlicht
                        name: Voordeur
                      - entity: light.buitenverlichting_achter
                        name: Achter
                      - entity: light.buitenverlichting_bomen
                        spin: true
                        name: Bomen
          - row: 2
            columns:
              - column: 1
                tileOnRow: 4
                entities:
                  - title: "Overig"
                    entities:
                      - card: custom:blinds-tile-card
                        tap_action:
                          action: more-info
                          entity: input_number.blindone
                        cardOptions:
                          name: Luxaflex
                          entities:
                            - entity: input_number.blindone
                              positions: 
                                - 60
                                - 0
                                - -45
                            - entity: input_number.blindtwo
                              positions: 
                                - 75
                                - 0
                                - -50
                            - entity: input_number.blindthree
                              positions: 
                                - -65
                                - 0
                                - 50
                      - card: custom:mini-graph-card
                        noPadding: true
                        cardOptions:
                          entities:
                            - sensor.wasmachine_energieverbruik
                      - entity: binary_sensor.wasmachine_status
                      - entity: weather.weersverwachting
              - column: 2
                tileOnRow: 3
                entities:
                  - title: Muziek
                    entities:
                      - entity: media_player.keuken
                        icon: mdi:speaker-wireless
                        offIcon: 'mdi:garage'
                        offStates:
                          - "off"
                          - "unavailable"
                          - "paused"
                      - entity: media_player.woonkamer
                        icon: mdi:speaker-wireless
                        offStates:
                          - "off"
                          - "unavailable"
                          - "paused"
                      - entity: media_player.slaapkamer
                        icon: mdi:speaker-wireless
                        offStates:
                          - "off"
                          - "unavailable"
                          - "paused"
          - row: 3
            columns:
              - column: 3
                entities:
                  - title: Overig
                    entities:
                      - entity: switch.doorbell_chime_active
                        spin: true
                      - entity: switch.doorbell_chime
                      - entity: switch.doorbell_restart
                      - entity: binary_sensor.doorbell_button
```

## Screenshots

### Screenshots without columns

![desktop home screenshot](screenshot-home.png "Desktop screenshot")

![desktop screenshot](screenshot-tablet.png "Tablet screenshot")

<img src="https://github.com/DBuit/Homekit-panel-card/raw/master/screenshot-mobile.png" width="300px">

### Screenshots with columns

![desktop screenshot columns](screenshot-columns.png "Desktop columns screenshot")

![tablet screenshot columns](screenshot-tablet-columns.png "Tablet columns screenshot")

<img src="https://github.com/DBuit/Homekit-panel-card/raw/master/screenshot-mobile-columns.png" width="300px">
