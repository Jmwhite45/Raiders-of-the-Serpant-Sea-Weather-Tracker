import { settingsInit } from "./Scripts/settings.js"
import {getPos, handsOfChange, updatePos, weatherTracker } from "./Scripts/application.js"
import { constants } from "./Scripts/constants.js"

function getSceneControlButtons(controls){
  const notes = controls.find((c) => c.name === 'notes');
  if (notes) { notes.tools.push(...constants.WEATHERBTN); }
}


Hooks.once("init",function(){
  settingsInit()
})

// Setup API
Hooks.once("ready", function(){
  let app = new weatherTracker()

  game.modules.get(constants.MODULEID).API ={
    openApp: () => app._render(),
    getPos: getPos,
    updatePos: updatePos,
    handsOfChange: handsOfChange
  }

  if(game.settings.get(constants.MODULEID, "displayOnLoad")){
    app._render()
  }

  Hooks.on(`${constants.MODULEID}-ReRender`, ()=>{app.reRender()})
});

Hooks.on('getSceneControlButtons', getSceneControlButtons);
