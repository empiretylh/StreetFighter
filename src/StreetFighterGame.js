import {
	registerGamepadEvents,
	registerKeyboardEvents,
	updateGamePads,
} from './engine/InputHandler.js';
import { getContext } from './utils/context.js';
import { BattleScene } from './scenes/BattleScene.js';
import { GAME_SPEED } from './constants/game.js';
import { StartScene } from './scenes/StartScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
// import { CharacterSelectScene } from "./scenes/CharacterSelectScene.js";
// import { MapSelectionScene } from "./scenes/MapSelectionScene.js";
import { ContextHandler } from './engine/ContextHandler.js';

export class StreetFighterGame {
	context = getContext();

	frameTime = {
		secondsPassed: 0,
		previous: 0,
	};

	timeStarted = 0;
	sceneStarted = false;
	nextScene = undefined;

	contextHandler = new ContextHandler(this.context);

	changeScene = (SceneClass) => {
		this.contextHandler.startDimDown();
		this.sceneStarted = false;
		this.nextScene = SceneClass;
	};

	startScene = (SceneClass) => {
		this.contextHandler.startGlowUp();
		this.scene = new SceneClass(this.changeScene);
		this.sceneStarted = true;
	};

	constructor() {
		// this.startScene(StartScene);
		this.startScene(MainMenuScene);
		// this.startScene(MapSelectionScene);
	}

	updateScenes = () => {
		this.scene.draw(this.context);
		if (this.contextHandler.dimDown) return;
		if (!this.sceneStarted) this.startScene(this.nextScene);
		this.scene.update(this.frameTime);
	};

	frame = (time) => {
		window.requestAnimationFrame(this.frame.bind(this));

		if (this.timeStarted === 0) {
			this.timeStarted = time;
		}
		time -= this.timeStarted;
		time = time * GAME_SPEED;

		this.frameTime = {
			secondsPassed: (time - this.frameTime.previous) / 1000,
			previous: time,
		};
		updateGamePads();
		this.contextHandler.update(this.frameTime);
		
		if (
			this.contextHandler.dimDown ||
			this.contextHandler.glowUp
		) {
			this.context.filter =
				`brightness(${this.contextHandler.brightness})
				contrast(${this.contextHandler.contrast})`;
		} else {
			this.context.filter = "none";
		}


		
		this.updateScenes();
	};

	start() {
		registerKeyboardEvents();
		registerGamepadEvents();
		window.requestAnimationFrame(this.frame.bind(this));
	}
}
