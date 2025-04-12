import { constants } from "./constants.js";
import { RollDie, RandomChoice, between } from "./Util.js";

export function getPos() {
  return [
    game.settings.get(constants.MODULEID, "posTemp"),
    game.settings.get(constants.MODULEID, "posWind"),
    game.settings.get(constants.MODULEID, "posSnow"),
  ];
}

export let handsOfChange = {
  increaseTemp: ()=>changeTemp(1),
  reduceTemp: ()=>changeTemp(-1),
  increaseWind: ()=>changeWind(1),
  reduceWind: ()=>changeWind(-1),
  increaseRain: ()=>changeSnow(1,false),
  reduceRain: ()=>changeSnow(-1,false),
  increaseSnow: ()=>changeSnow(1, true),
  reduceSnow: ()=>changeSnow(-1, true),
}

function getMidDir(loc){
  if(loc> constants.MID){return -1}
  else if (loc<constants.MID){return 1}
  else {return 0}
}

function changeTemp(val){
  let Pos = getPos()
  Pos[0] += val
  updatePos(...Pos)
}

function changeWind(val){
  let Pos = getPos()

  //if POS is below the midpoint reverse the sign
  if(Pos[1]<constants.MID){
    val = val*-1
  }
  // if there is no wind
  else if(Pos[1]==constants.MID){
    // and if you are trying to reduce the wind, Dont
    if(val<=0){val = 0}
    // but if your trying to increase the wind, choose a random direction
    else {val = RandomChoice([-1,1])}
  }

  Pos[1] += val; 
  updatePos(...Pos)
}

function changeSnow(val,isSnow){
  let Pos = getPos()

  //if POS is below the midpoint reverse the sign
  if(Pos[2]<constants.MID){
    val = val*-1
  }
  // if there is no percipitation
  else if(Pos[2]==constants.MID){
    // and if you are trying to reduce the percipitation, Dont
    if(val<=0){val = 0}
    // but if your trying to increase the perciptiation, increase based on if you want to do snow or rain
    else {
      if(isSnow){
        val=val*-1
      }
    }
  }

  Pos[2] += val; 
  updatePos(...Pos)
}

//updates Pos
export async function updatePos(temp, wind, snow) {
  await game.settings.set(
    constants.MODULEID,
    "posTemp",
    between(temp, constants.MAX)
  );
  await game.settings.set(
    constants.MODULEID,
    "posWind",
    between(wind, constants.MAX)
  );
  await game.settings.set(
    constants.MODULEID,
    "posSnow",
    between(snow, constants.MAX)
  );

  Hooks.call(`${constants.MODULEID}-ReRender`)
}

//Updates weather by the rolltables

export class weatherTracker extends Application {
  async updateByTable() {
    let tempRoll = await RollDie("1d20");
    let windRoll = await RollDie("1d12");
    let snowRoll = await RollDie("1d8");

    let pos = getPos();

    let msgData = {
      tempRes: tempRoll,
      windRes: windRoll,
      snowRes: snowRoll,
    };

    //Modify Temperature
    for (let key of Object.keys(constants.WEATHERTABLES["Temperature"])) {
      if (tempRoll <= key) {
        let tempMod = constants.WEATHERTABLES["Temperature"][key];
        pos[0] = pos[0] + tempMod;
        msgData.temp = tempMod;
        break;
      }
    }

    //Modify Wind
    for (let key of Object.keys(constants.WEATHERTABLES["Wind"])) {
      if (windRoll <= key) {
        let windMod = constants.WEATHERTABLES["Wind"][key];

        if (pos[1] < constants.MID) {
          windMod = windMod * -1;
        }

        //if we are currently at no wind and the wind is increasing then choose a random direction to go
        else if (pos[1] == constants.MID && windMod > 0) {
          windMod = windMod * RandomChoice([-1, 1]);
        }

        pos[1] = pos[1] + windMod;
        msgData.wind = windMod;
        break;
      }
    }

    //Modify snow/rain
    for (let key of Object.keys(constants.WEATHERTABLES["Snow"])) {
      if (snowRoll <= key) {
        let snowMod = constants.WEATHERTABLES["Snow"][key];
        pos[2] = pos[2] + snowMod;

        msgData.snow = snowMod;
        break;
      }
    }

    await updatePos(...pos)

    if (game.settings.get(constants.MODULEID, "sendWeatherReport")) {
      ChatMessage.create({
        user: game.userId,
        speaker: ChatMessage.getSpeaker(),
        content: await renderTemplate(
          `modules/${constants.MODULEID}/Templates/message.hbs`,
          msgData
        ),
        whisper: ChatMessage.getWhisperRecipients("GM"),
      });
    }
  }

  async reRender(){
    let data = await this.getData()
    let newApp = await renderTemplate(`modules/${constants.MODULEID}/Templates/weatherDialog.hbs`, data)

    $(document).find(".WeatherTracker").parent().html(newApp)
    this.activateListeners($(document).find(".WeatherTracker").parent())
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".closeWeather").click(() => this.close());
    html.find(".ModifyWeather").click(() => this.updateByTable());

  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: constants.MODULEID,
      //classes: [constants.moduleName],
      template: `modules/${constants.MODULEID}/Templates/weatherDialog.hbs`,
      //width: 700,
      //height: 480,
      minimizable: true,
      resizable: false,
      title: "Weather", //game.i18n.localize('ForienQuestLog.QuestLog.Title'),
    });
  }

  get template() {
    return `modules/${constants.MODULEID}/Templates/weatherDialog.hbs`;
  }

  async getData() {
    let data = {};
    let pos = getPos();

    data.temp = constants.VERT[pos[0]];
    data.wind = constants.VERT[pos[1]];
    data.snow = constants.VERT[pos[2]];
    data.isGM = game.user.isGM;

    return data;
  }

  async _render(force = true, options = {focus: true, height: 842}) {
    await super._render(force, options);
  }
}
