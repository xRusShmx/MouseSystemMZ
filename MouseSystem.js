var Imported = Imported || {};
Imported.RusShm_ClickActivation = true;

var RusShm = RusShm || {};
RusShm.CA = RusShm.CA || {};
RusShm.CA.pluginName = "MouseSystem";

//-----------------------------------------------------------------------------
/*:
 * @plugindesc [1.1] Allows events to be activated with both left and right clicks and triggers actions on mouse hover.
 * @url https://boosty.to/russhm
 * @target MZ
 * @author RusShm
 *
 * @help
 *   This plugin enables left and right-click activation for events and triggers actions on mouse hover.
 *   To use, add the following tags in the 'comment' command of an event:
 *   <right_click_activate>
 *   <left_click_activate>
 *   <mouse_hover_activate>
 *
 * Context Menu:
 * If the setting is true, then if the player clicks right mouse button on the event with "<right_click_activate>" tag, the choices would appear on the cursor
 * 
 * Custom cursor:
 * You can change cursor default cursor. You can set Hover Icon for the event by using plugin command.
 *
 * Plugin parameters:
 * Activation Variable: variable to store the last activation type. May be useful if you want to make different things by different clicks.
 *
 * Context Menu: Shows choice menu around mouse when event activated by right click
 *
 * Use custom cursors?: Determines if you need the custom cursors in your game 
 *
 * Custom cursor Image: Set the custom image for the cursor. Image should be in /img/system/ folder.
 *
 * Plugin Commands:
 *
 * Set hover Icon: Sets the cursor image which should be used when mouse hovered over event
 *
 * @param activationVariable
 * @text Activation Variable
 * @desc The variable that will be set to indicate the activation type.
 * @type variable
 * @default 1
 *
 * @param contMenu
 * @text Context menu
 * @desc Shows choice menu around mouse when activated by right click
 * @type boolean
 * @default false
 *
 * @param useCustomCursor
 * @text Use custom cursors?
 * @type boolean
 * @desc If set to true custom cursors would be used 
 *
 * @param customCursor
 * @text Custom Cursor Image
 * @type file
 * @dir img/system/
 * @desc Set the custom image for the cursor. Image should be in /img/system/ folder
 *
 * @command setHoverIcon
 * @text Set hover Icon
 * @desc Sets the cursor image
 * @arg pictureFile
 * @text Set Hover Icon
 * @type file
 * @dir img/system/
 *
 */
 
 PluginManager.registerCommand(RusShm.CA.pluginName, "setHoverIcon", function (args) {});
 
const base_url = "./img/system/";
    const x_offset = 0;
    const y_offset = 0;
    const fallbackStyle = "pointer";
RusShm.CA.params = PluginManager.parameters(RusShm.CA.pluginName);
RusShm.CA.activationVariable = Number(RusShm.CA.params["activationVariable"]);
RusShm.CA.contMenu = String(RusShm.CA.params["contMenu"]);
RusShm.CA.uCC = String(RusShm.CA.params["useCustomCursor"]);
RusShm.CA.customCursor = String(RusShm.CA.params["customCursor"]);

var isLoaded = false;

Scene_Map.prototype.isMenuCalled = function() {
    return; 
};

document.addEventListener("contextmenu", function (event) {
    
    handleEventActivation("right_click_activate");
});

document.addEventListener("mousedown", function (event) {
    if (event.button === 0) {
        handleEventActivation("left_click_activate");
    }
});

document.addEventListener("mousemove", function (event) {
	if (cursorChanged == true){changeCursorIcon(RusShm.CA.customCursor);}
	if (RusShm.CA.uCC)cursorMove();
	
    handleEventActivation("mouse_hover_activate");
});
let cursorChanged = false;
function cursorMove(){
	
	if (isLoaded){
		
		
		
		const tileX = $gameMap.canvasToMapX(TouchInput.x);
		const tileY = $gameMap.canvasToMapY(TouchInput.y);
		$gameMap.eventsXy(tileX, tileY).forEach(function (event) {
			if (!event || !event.page()) {
				return;}
			if (RusShm.CA.uCC == "true"){
				for (let i = 0; i < event.page().list.length; i++) {
					if (event.page().list[i].code === 657 && event.page().list[i].parameters[0].match("Set Hover Icon")) {
						let thing = event.page().list[i].parameters[0];
						thing = thing.split("=");	
						thing[1] = thing[1].substring(1);
						changeCursorIcon(thing[1]);
						cursorChanged = true;
						}
						
					};
			}
		});
	}
}

function changeCursorIcon(text){
	document.body.style.cursor = RusShm.CA.customCursor == "" 
            ? "default"
            : `url("${base_url}${text}.png") ${x_offset} ${y_offset}, ${fallbackStyle}`;
	
}

RusShm.CA.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
	RusShm.CA.Game_Map_setup.call(this,mapId);
    if (RusShm.CA.uCC == "true")changeCursorIcon(RusShm.CA.customCursor);
	isLoaded = true;
};


function handleEventActivation(tag) {
	if (isLoaded) {
    const tileX = $gameMap.canvasToMapX(TouchInput.x);
    const tileY = $gameMap.canvasToMapY(TouchInput.y);
	
    $gameMap.eventsXy(tileX, tileY).forEach(function (event) {
        if (!event || !event.page()) return;
        const tagRegex = new RegExp("<" + tag + ">", "i");
		//console.log(event.page().list);
        if (event.page().list && event.page().list.some(command => command.code === 108 && command.parameters[0].match(tagRegex))) {
			if (!$gameMap.isEventRunning()) {
				//document.body.style.cursor = 'none';
				setActivationType(tag);
				event.start();
            }
		
			
            
        }
		
    });
	}
	
}

function setActivationType(type) {
    let value;
	
    switch (type) {
		default:
			if (value != 0) {value = 0;}
            break;
        case "right_click_activate":
            value = 1;
            break;
        case "left_click_activate":
            value = 2;
            break;
        case "mouse_hover_activate":
            value = 3;
            break;
		case "no_mouse":
			value = 4;
			break;
        
    }
	
    RusShm.CA.lastActivationType = value; 
    $gameVariables.setValue(RusShm.CA.activationVariable, value);
}

RusShm.CA.Window_ChoiceList_start = Window_ChoiceList.prototype.start;
RusShm.CA.Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;

Window_ChoiceList.prototype.start = function () {
    RusShm.CA.Window_ChoiceList_start.call(this);

    switch ($gameMessage.choicePositionType()) {
        case 0: //left
            if (RusShm.CA.lastActivationType === 1 && RusShm.CA.contMenu === "true") {
                if (TouchInput.y + this.contentsHeight() < 720) {
                    this.y = TouchInput.y;
                } else this.y = 720 - this.contentsHeight();

                if (TouchInput.x + this.contentsWidth() < 1280) {
                    this.x = TouchInput.x;
                } else this.x = 1280 - this.contentsWidth() - 32;
				setActivationType("no_mouse");
				
            }
		case 4: 
            break;
    }
};