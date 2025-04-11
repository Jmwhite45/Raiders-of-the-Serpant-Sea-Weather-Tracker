export const constants = {
    MODULEID: "rotss-weather-tracker",
    VERT: [100,217,306-2,393-2,496-5,584-5,671-5],
    MID: 3,
    MAX: 6,
    WEATHERTABLES: {
      "Temperature": {
        2: 2,
        6: 1,
        16: 0,
        19: -1,
        20: -2
      },
      "Wind":{
        1: -2,
        3: -1,
        7: 0,
        10: 1,
        12: 2
      },
      "Snow":{
        1: -2,
        3: -1,
        5: 0,
        8: 1,
        10: 2
      }
    },

    DEBUG: "[RotSS Weather Tracker] |",
    WEATHERBTN: [{
      name: "rotss-weather-tracker",
      title: 'Weather Tracker',
      icon: 'fas fa-cloud',
      visible: true,
      onClick: () => game.modules.get("rotss-weather-tracker").API.openApp(),
      button: true
   }]
}