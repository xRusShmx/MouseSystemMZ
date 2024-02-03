//-----------------------------------------------------------------------------
// Click Activation Plugin for RPG Maker MZ
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.RusShm_ClickActivation = true;

var RusShm = RusShm || {};
RusShm.CA = RusShm.CA || {};
RusShm.CA.pluginName = "MouseSystem";

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Allows events to be activated with both left and right clicks and triggers actions on mouse hover.
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
 * @param activationVariable
 * @name Activation Variable
 * @desc The variable that will be set to indicate the activation type.
 * @type variable
 * @default 1
 *
 * @param contMenu
 * @name Context menu (4 choices)
 * @desc Shows choice menu around mouse when activated by right click
 * @type boolean
 * @default false
 *
 */

RusShm.CA.params = PluginManager.parameters(RusShm.CA.pluginName);
RusShm.CA.activationVariable = Number(RusShm.CA.params["activationVariable"]);
RusShm.CA.contMenu = String(RusShm.CA.params["contMenu"]);

Scene_Map.prototype.isMenuCalled = function() {
    return; //Input.isTriggered('menu');
};


document.addEventListener("contextmenu", function (event) {
    
    handleEventActivation("right_click_activate");
});

document.addEventListener("mousedown", function (event) {
    if (event.button === 0) {
        // Left click
        handleEventActivation("left_click_activate");
    }
});

document.addEventListener("mousemove", function (event) {
    handleEventActivation("mouse_hover_activate");
});

function handleEventActivation(tag) {
	try {
    const tileX = $gameMap.canvasToMapX(TouchInput.x);
    const tileY = $gameMap.canvasToMapY(TouchInput.y);
	
    $gameMap.eventsXy(tileX, tileY).forEach(function (event) {
        if (!event || !event.page()) return;
        const tagRegex = new RegExp("<" + tag + ">", "i");
        if (event.page().list && event.page().list.some(command => command.code === 108 && command.parameters[0].match(tagRegex))) {
			if (!$gameMap.isEventRunning()) {
				
				setActivationType(tag);
				event.start();
            }
			
            
        }
		
    });
	}
	catch {
		console.log("Still loading");
	}
}

function setActivationType(type) {
	console.log(type);
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
                console.log(RusShm.CA.lastActivationType);
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