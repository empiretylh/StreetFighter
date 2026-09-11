import {
	SCENE_WIDTH,
	STAGE_MID_POINT,
	STAGE_PADDING,
} from '../constants/Stage.js';
import {
	FighterAttackBaseData,
	FighterAttackStrength,
	FighterId,
	FighterState,
	FighterStruckDelay,
} from '../constants/fighter.js';
import { FRAME_TIME, GAME_SPEED } from '../constants/game.js';
import { Camera } from '../engine/Camera.js';
import { EntityList } from '../engine/EntityList.js';
import { Ken, Ryu } from '../entitites/fighters/index.js';
import {
	HeavyHitSplash,
	LightHitSplash,
	MediumHitSplash,
	Shadow,
} from '../entitites/fighters/shared/index.js';
import { Fireball } from '../entitites/fighters/special/Fireball.js';
import { FpsCounter } from '../entitites/overlays/FpsCounter.js';
import { StatusBar } from '../entitites/overlays/StatusBar.js';
import { KenStage } from '../entitites/stage/KenStage.js';
import { gameState, resetGameState } from '../states/gameState.js';
// import { StartScene } from './StartScene.js';
import { MainMenuScene } from './MainMenuScene.js';
import { BattleResultScene } from './BattleResultScene.js';
import { ai } from "../engine/AIHandler.js";
import { showMobileControls } from "../uicontrols/MobileControls.js";
import { playSound } from '../engine/SoundHandler.js';
import { soundResultIds } from '../constants/sounds.js';

export class BattleScene {
	battleCanvas = document.createElement("canvas");
	battleContext = this.battleCanvas.getContext("2d");
	image = document.getElementById('Winner');
	fighters = [];
	camera = undefined;
	shadows = [];
	FighterDrawOrder = [0, 1];
	hurtTimer = 0;
	battleEnded = false;
	winnerId = undefined;
	aiTimer = 0;

	constructor(changeScene) {
		this.changeScene = changeScene;

		document.getElementById("mobile-controls").style.display = "flex";
    	document.getElementById("btn-back").style.display = "none";


		this.battleCanvas.width = 382;
		this.battleCanvas.height = 224;


		this.stage = new KenStage();
		this.entities = new EntityList();

		this.overlays = [
			new StatusBar(this.fighters, this.onTimeEnd),
			new FpsCounter(),
		];
		
		showMobileControls();
		// resetGameState();
		this.startRound();
	}

	getFighterClass = (id) => {
		switch (id) {
			case FighterId.KEN:
				return Ken;
			case FighterId.RYU:
				return Ryu;
			default:
				return new Error('Invalid Fighter Id');
		}
	};

	getFighterEntitiy = (id, index) => {
		const FighterClass = this.getFighterClass(id);
		return new FighterClass(index, this.handleAttackHit, this.entities);
	};

	getFighterEntities = () => {
		const fighterEntities = gameState.fighters.map(({ id }, index) => {
			const fighterEntity = this.getFighterEntitiy(id, index);
			gameState.fighters[index].instance = fighterEntity;
			return fighterEntity;
		});

		fighterEntities[0].opponent = fighterEntities[1];
		fighterEntities[1].opponent = fighterEntities[0];

		return fighterEntities;
	};

	updateFighters = (time, context) => {
		for (const fighter of this.fighters) {
			if (this.hurtTimer > time.previous) {
				fighter.updateHurtShake(time, this.hurtTimer);
			} else fighter.update(time, this.camera);
		};
	};

	getHitSplashClass = (strength) => {
		switch (strength) {
			case FighterAttackStrength.LIGHT:
				return LightHitSplash;
			case FighterAttackStrength.MEDIUM:
				return MediumHitSplash;
			case FighterAttackStrength.HEAVY:
				return HeavyHitSplash;
			default:
				return new Error('Invalid Strength Splash requested');
		}
	};

	handleAttackHit = (time, playerId, opponentId, position, strength) => {
		this.FighterDrawOrder = [opponentId, playerId];
		gameState.fighters[playerId].score += FighterAttackBaseData[strength].score;

		gameState.fighters[opponentId].hitPoints -=
			FighterAttackBaseData[strength].damage;

		const HitSplashClass = this.getHitSplashClass(strength);

		if (gameState.fighters[opponentId].hitPoints <= 0) {
			this.fighters[opponentId].changeState(FighterState.KO, time);
		}

		this.fighters[opponentId].direction =
			this.fighters[playerId].direction * -1;

		position &&
			this.entities.add(HitSplashClass, position.x, position.y, playerId);

		this.hurtTimer = time.previous + FighterStruckDelay * FRAME_TIME;
	};

	updateShadows = (time) => {
		this.shadows.map((shadow) => shadow.update(time));
	};

	startRound = () => {
		this.fighters = this.getFighterEntities();
		this.camera = new Camera(
			STAGE_PADDING + STAGE_MID_POINT - SCENE_WIDTH / 2,
			16,
			this.fighters
		);

		this.shadows = this.fighters.map((fighter) => new Shadow(fighter));
	};

	goToStartScene = () => {
		setTimeout(() => {
			this.changeScene(MainMenuScene);
		}, 4500);
	};
	// goToResultScene = () => {
	// 	setTimeout(() => {
	// 		this.changeScene(BattleResultScene);
	// 	}, 1500);
	// };

	drawWinnerText = (context, playerIndex) => {

		const fighterId = gameState.fighters[playerIndex].id;
		let spriteRow = 0;

		if (fighterId === FighterId.KEN) {
        	spriteRow = 1;
    	}

		context.drawImage(this.image, 0, spriteRow * 11, 70, 9, 120, 60, 140, 30);

	};

	drawWinnerTextHD = (context, playerIndex) => {

		const fighterId = gameState.fighters[playerIndex].id;
		let spriteRow = fighterId === FighterId.KEN ? 1 : 0;;
		context.imageSmoothingEnabled = false;

		context.drawImage(
			this.image,

			0,
			spriteRow * 11,
			70,
			9,
			430,
			180,
			420,
			54
		);
	};

	endBattle = (winnerId, loserId, time) => {

		if (this.battleEnded) {
			return;
		}

		this.winnerId = winnerId;
		this.battleEnded = true;

		gameState.battleResult.winnerId = winnerId;
		gameState.battleResult.loserId = loserId;

		this.fighters[winnerId].victory = true;

		this.fighters[loserId].changeState(
			FighterState.KO,
			time
		);

		this.playResultVoice();

		// this.goToResultScene();
	};

	// onTimeEnd = (time) => {
	// 	if (gameState.fighters[0].hitPoints >= gameState.fighters[1].hitPoints) {
	// 		this.fighters[0].victory = true;
	// 		this.fighters[1].changeState(FighterState.KO, time);
	// 		this.winnerId = 0;
	// 	} else {
	// 		this.fighters[1].victory = true;
	// 		this.fighters[0].changeState(FighterState.KO, time);
	// 		this.winnerId = 1;
	// 	}
		
		
	// 	this.playResultVoice();
	// 	// this.goToStartScene();
	// 	this.goToResultScene();
	// };

	onTimeEnd = (time) => {

		if (this.battleEnded) {
			return;
		}

		let winnerId;
		let loserId;

		if (
			gameState.fighters[0].hitPoints >=
			gameState.fighters[1].hitPoints
		) {
			winnerId = 0;
			loserId = 1;
		} else {
			winnerId = 1;
			loserId = 0;
		}

		this.endBattle(
			winnerId,
			loserId,
			time
		);
	};


	updateOverlays = (time) => {
		this.overlays.map((overlay) => overlay.update(time));
	};

	playResultVoice = () => {

		if(this.winnerId === 0){
			const sound = document.getElementById(soundResultIds.WIN);
			playSound(sound);
		}
		else {
			const sound = document.getElementById(soundResultIds.LOSE);
			playSound(sound);
		}

	};

	updateFighterHP = (time) => {
		gameState.fighters.map((fighter, index) => {
			if (fighter.hitPoints <= 0 && !this.battleEnded) {
				this.fighters[index].opponent.victory = true;
				this.winnerId = 1 - index;

				gameState.battleResult.winnerId = this.winnerId;
            	gameState.battleResult.loserId = index;

				this.battleEnded = true;
				this.playResultVoice();
				this.goToStartScene();
				// this.goToResultScene();
			}
		});
	};
	// updateFighterHP = (time) => {

	// 	if (this.battleEnded) {
	// 		return;
	// 	}

	// 	gameState.fighters.forEach((fighter, index) => {

	// 		if (fighter.hitPoints <= 0) {

	// 			const loserId = index;
	// 			const winnerId = 1 - index;

	// 			this.endBattle(
	// 				winnerId,
	// 				loserId,
	// 				time
	// 			);
	// 		}
	// 	});
	// };	



	update = (time) => {
		this.aiTimer ??= 0;
		if(time.previous > this.aiTimer){
			ai.update(
				this.fighters[1],
				this.fighters[0],
				gameState.fighters[1].hitPoints,
    			gameState.fighters[0].hitPoints
			);
			this.aiTimer = time.previous + 80;
		}

		this.updateFighters(time);
		this.updateShadows(time);
		this.stage.update(time);
		this.entities.update(time, this.camera);
		this.camera.update(time);
		this.updateOverlays(time);
		this.updateFighterHP(time);
	};

	drawFighters(context) {
		this.FighterDrawOrder.map((id) =>
			this.fighters[id].draw(context, this.camera)
		);
	}

	drawShadows(context) {
		this.shadows.map((shadow) => shadow.draw(context, this.camera));
	}	


	drawOverlays(context) {
		this.overlays.map((overlay) => overlay.draw(context, this.camera));
		// if (this.winnerId !== undefined) {
		// 	this.drawWinnerText(context, this.winnerId);
		// }
	}


	draw = (context) => {

		// =======DRAW BATTLE AT 382 × 224=======
		this.battleContext.clearRect(
			0,
			0,
			this.battleCanvas.width,
			this.battleCanvas.height
		);

		this.stage.drawBackground(
			this.battleContext,
			this.camera
		);

		this.drawShadows(this.battleContext);
		this.drawFighters(this.battleContext);

		this.entities.draw(
			this.battleContext,
			this.camera
		);

		this.stage.drawForeground(
			this.battleContext,
			this.camera
		);

		this.drawOverlays(
			this.battleContext
		);


		// ======SCALE TO 1280 × 720======
		context.imageSmoothingEnabled = false;

		context.clearRect(
			0,
			0,
			context.canvas.width,
			context.canvas.height
		);

		context.drawImage(
			this.battleCanvas,
			0,
			0,
			this.battleCanvas.width,
			this.battleCanvas.height,
			0,
			0,
			context.canvas.width,
			context.canvas.height
		);


		if (this.winnerId !== undefined) {
			this.drawWinnerTextHD(
				context,
				this.winnerId
			);
		}
	};

}