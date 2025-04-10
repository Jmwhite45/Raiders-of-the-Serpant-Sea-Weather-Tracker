const MODULEID = "rotss-weather-tracker"

export class weatherTracker extends Application
{
   constructor(options = {})
   {
      super(options);
   }

   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         id: MODULEID,
         //classes: [constants.moduleName],
         template: `modules/${MODULEID}/Templates/weatherDialog.hbs`,
         //width: 700,
         //height: 480,
         minimizable: true,
         resizable: true,
         title: "Weather"//game.i18n.localize('ForienQuestLog.QuestLog.Title'),
      });
   }

   async _render(force = false, options = {})
   {
      await super._render(force, options);
   }
}