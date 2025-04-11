import { constants } from "./constants.js";

export function settingsInit() {
  game.settings.register(constants.MODULEID, "sendWeatherReport", {
    name: "Weather Report",
    hint: "Get a chatmessage each time the weather changes",
    scope: "world",
    config: true,
    restricted: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(constants.MODULEID, "displayOnLoad", {
    name: "display on startup",
    hint: "Display the Weather tracker on start up",
    scope: "client",
    config: true,
    restricted: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(constants.MODULEID, "posTemp", {
    name: "Temperature Position",
    hint: "set the temperature manually",
    scope: "world",
    config: true,
    restricted: true,
    choices: {
      // Choices
      0: "Extreme Cold",
      1: "Cold",
      2: "Cool",
      3: "Average",
      4: "Warm",
      5: "Hot",
      6: "Extreme heat",
    },
    default: constants.MID,
    type: Number,
  });

  game.settings.register(constants.MODULEID, "posWind", {
    name: "Wind Position",
    hint: "set the wind manually",
    scope: "world",
    config: true,
    restricted: true,
    choices: {
      // Choices
      0: "Strong Wind",
      1: "Light Wind",
      2: "Calm Wind",
      3: "No Wind",
      4: "Calm Wind",
      5: "Light Wind",
      6: "Strong Wind",
    },
    default: constants.MID,
    type: Number,
  });

  game.settings.register(constants.MODULEID, "posSnow", {
    name: "Snow & Rain Position",
    hint: "set the Snow or Rain manually",
    scope: "world",
    config: true,
    restricted: true,
    choices: {
      // Choices
      0: "Heavy Snow",
      1: "Light Snow",
      2: "Cloudy",
      3: "Clear",
      4: "Cloudy",
      5: "Light Rain",
      6: "Heavy Rain",
    },
    default: constants.MID,
    type: Number,
  });
}
