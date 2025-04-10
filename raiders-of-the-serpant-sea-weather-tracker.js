import { settingsInit } from "./settings.js"
import { weatherTracker } from "./application.js"

const MODULEID = "rotss-weather-tracker"
const VERT = [100,217,306-2,393-2,496-5,584-5,671-5]
const MID = 3
const MAX = 6

const WEATHERTABLES = {
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
}

async function RollDie(dice){
		var r = new Roll(dice);
		await r.roll();
		return (r.total);
}

function RandomChoice(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// returns the position of each dot in an array
function getPos(){
  return [
    game.settings.get(MODULEID,"posTemp"),
    game.settings.get(MODULEID,"posWind"),
    game.settings.get(MODULEID,"posSnow"),
  ]
}

// gets the template data for the Weather Dialog box
function getTemplateData(){
  let data = {}
  let pos = getPos()

  data.temp = VERT[pos[0]]
  data.wind = VERT[pos[1]]
  data.snow = VERT[pos[2]]
  data.isGM = game.user.isGM

  return data
}

//makes sure num is between(inclusive) max and min. If no min is given min is 0
function between(num, max, min=0){
  return Math.min(Math.max(num, min), max);
}

//updates Pos
async function updatePos(temp,wind,snow){
  await game.settings.set(MODULEID,"posTemp", between(temp,MAX))
  await game.settings.set(MODULEID,"posWind", between(wind,MAX))
  await game.settings.set(MODULEID,"posSnow", between(snow,MAX))
}

//Updates weather by the rolltables
async function updateByTable(){
  let tempRoll = await RollDie("1d20")
  let windRoll = await RollDie("1d12")
  let snowRoll = await RollDie("1d8")

  let pos = getPos()

  let msgData = {
    tempRes: tempRoll,
    windRes: windRoll,
    snowRes: snowRoll
  }

  //console.log(tempRoll, WEATHERTABLES["Temperature"])

  //Modify Temperature
  for(let key of Object.keys(WEATHERTABLES["Temperature"])){
    //console.log(key, tempRoll <= key)
    if(tempRoll <= key){
      //console.log("PERFORMING TEMP")
      let tempMod = WEATHERTABLES["Temperature"][key]
      pos[0] = pos[0]+tempMod
      msgData.temp = tempMod
      break
    }
  }

  //Modify Wind
  for(let key of Object.keys(WEATHERTABLES["Wind"])){
    if(windRoll <= key){
      let windMod = WEATHERTABLES["Wind"][key]

      if(pos[1]<MID){
        windMod =windMod*-1
      }

      //if we are currently at no wind and the wind is increasing then choose a random direction to go
      else if((pos[1]==MID)&&(windMod>0)){
        windMod = windMod*RandomChoice([-1,1])
      }

      pos[1] = pos[1]+windMod
      msgData.wind = windMod
      break
    }
  }

  //Modify snow/rain
  for(let key of Object.keys(WEATHERTABLES["Snow"])){
    if(snowRoll <= key){
      let snowMod = WEATHERTABLES["Snow"][key]
      pos[2] = pos[2]+snowMod

      msgData.snow = snowMod
      break
    }
  }

  await updatePos(...pos).then(()=> openDialog())
  
  if(game.settings.get(MODULEID, "sendWeatherReport"))
  {
    ChatMessage.create({  
      user: game.userId,
      speaker: ChatMessage.getSpeaker(),
      content: await renderTemplate(`modules/${MODULEID}/Templates/message.hbs`,msgData),
      whisper: ChatMessage.getWhisperRecipients("GM")
    })
  }
}

//Opens a the weather Dialog box
async function openDialog(){
    let templateData = getTemplateData()

    let DialogBox = await renderTemplate(`modules/${MODULEID}/Templates/weatherDialog.hbs`,templateData);

    new Dialog({
        title: "Weather",
        content: DialogBox,
        width: 800,
        buttons: {
         close: {
          icon: '<i class="fas fa-x"></i>',
          label: "Close"
         },
         Modify: {
          icon: '<i class="fas fa-cloud"></i>',
          label: "Modify weather",
          restricted: true,
          callback: async () => {updateByTable()}
         },
        },
       }).render(true);   
}

Hooks.once("init",function(){
  settingsInit()
})

// Setup API
Hooks.once("ready", function(){
    game.modules.get(MODULEID).API ={
      openDialog: openDialog,
      getPos: getPos,
      updatePos: updatePos,
      testRender: new weatherTracker()._render
    }
});