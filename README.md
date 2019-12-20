# homekit-card
Homekit style Home Assistant card

This card is best used with `panel: true` because the use case is to make one overview with homekit style tiles.

You can define multiple rows with entities which will show as a tile.
You can add any entity which will be displayed as a tile.
Not all entities will be displayed the way you want like the weather entity i made a custom tile within the card.
If you think a entity should look different let me know and i can make some customizations :)

Besides that you can use a lovelace card to replace the default pop-up. I made a custom card for light pop-up to be styled like homekit. You can find the card here: https://github.com/DBuit/hass-custom-light-popup-card
You can use any lovelace or custom lovelace card but this one i styled like homekit. If you got any good ideas for other pop-up card let me know, so i can make more :)

# Config options

Add the card
```
- type: "custom:homekit-card"
  entities:
```

Define multiple rows of tiles under entities
```
- title: Sensors
  entities:
    - entity: sensor.sensor
      name: "Optional name"
    - entity: binary_sensor.sensor
      name: "Optional name"
    - entity: light.light
- title: Lights
  entities:
    - entity: light.light2
      name: "Optional name light"
    - entity: light.light
```

Set custom pop-up card for an entire row
```
- title: Sensors
  popup:
    type: custom:custom-light-popup-card
    # IF THE CARD AS OTHER CONFIG U CAN JUST ADD THEM UNDER THE TYPE #
  entities:
    - entity: sensor.sensor
      name: "Optional name"
    - entity: binary_sensor.sensor
      name: "Optional name"
    - entity: light.light
- title: Lights
  entities:
    - entity: light.light2
      name: "Optional name light"
    - entity: light.light
```

If you want every card to have the same pop-up but some config of the pop-up card is not for every entity
you can set some extended config on the specific entity

```
- title: Sensors
  popup:
    type: custom:custom-light-popup-card
    # IF THE CARD AS OTHER CONFIG U CAN JUST ADD THEM UNDER THE TYPE #
  entities:
    - entity: sensor.sensor
      name: "Optional name"
      popupExtend: # As example the light popup card can define scenes but these are entity specific #
        scenes:
          - scene: scene.ontspannen
            color: "#FDCA64"
            name: ontspannen
    - entity: binary_sensor.sensor
      name: "Optional name"
    - entity: light.light
- title: Lights
  entities:
    - entity: light.light2
      name: "Optional name light"
    - entity: light.light
```

If you don't want to use the same pop-up card for every entity in a row you can also set the pop-up on the entity

```
- title: Sensors
  entities:
    - entity: sensor.sensor
      name: "Optional name"
    - entity: binary_sensor.sensor
      name: "Optional name"
    - entity: light.light
- title: Lights
  entities:
    - entity: light.light2
      name: "Optional name light"
    - entity: light.light
      popup:
        type: custom:custom-light-popup-card
        switchWidth: 110px
        switchHeight: 300px
```

# Example full configuration of the card with use of the custom light pop-up
```
- title: "Lights"
    panel: true
    cards:
      - type: "custom:homekit-card"
        entities:
          - title: Lights
            popup:
              type: custom:custom-light-popup-card
              scenesInARow: 2
              brightnessWidth: 130px
              brightnessHeight: 350px
              switchWidth: 110px
              switchHeight: 300px
            entities: 
              - entity: light.light1
                popupExtend:
                  scenes:
                    - scene: scene.ontspannen
                      color: "#FDCA64"
                      name: ontspannen
                    - scene: scene.helder
                      color: "#FFE7C0"
                      name: helder
                    - scene: scene.concentreren
                      color: "#BBEEF3"
                      name: concentreren
                    - scene: scene.energie
                      color: "#8BCBDD"
                      name: energie
              - entity: light.light2
              - entity: light.light3
          - title: Outside lights
            entities:
              - entity: light.light4
                name: "Frontdoor"
                popup:
                  type: custom:custom-light-popup-card
                  switchWidth: 110px
                  switchHeight: 300px
          - title: Sensors
            entities:
              - entity: sensor.sensor1
                name: "Battery"
              - entity: binary_sensor.sensor2
                name: "Frontdoor"
```
