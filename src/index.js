import { StreetFighterGame } from './StreetFighterGame.js';
import { initializeMobileControls } from "./uicontrols/MobileControls.js";

window.onload = () => {
	new StreetFighterGame().start();
	initializeMobileControls();
};
