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

	resultSceneTimer = undefined;

	fighterSelectionActive = true;
    heroDeck = [];
    selectedHeroIndex = 0;

    confirmBox = {
        x: 490,
        y: 560,
        width: 300,
        height: 70
    };

	constructor(changeScene) {

		this.changeScene = changeScene;

		document.getElementById("mobile-controls").style.display = "none";
    	document.getElementById("btn-back").style.display = "none";


		this.battleCanvas.width = 382;
		this.battleCanvas.height = 224;


		this.stage = new KenStage();
		this.entities = new EntityList();

		const selectedMap = gameState.selectedMap ?? 0;

		this.selectedMapImage.src = this.mapBackgrounds[selectedMap] ?? this.mapBackgrounds[0];

		// ==========================================
		// LOAD HERO DECK
		// ==========================================
		this.heroDeck =
			gameState.heroDeck?.map(slot => ({
				unlocked: slot.unlocked,
				character: slot.character
			})) ?? [];

		// ==========================================
		// SAFETY FALLBACK
		// ==========================================
		if (this.heroDeck.length === 0) {

			this.heroDeck = [
				{
					unlocked: true,
					character: FighterId.RYU
				},
				{
					unlocked: true,
					character: FighterId.KEN
				},
				{
					unlocked: true,
					character: null
				},
				{
					unlocked: false,
					character: null
				},
				{
					unlocked: false,
					character: null
				}
			];
		}


		// ==========================================
		// FIND FIRST AVAILABLE HERO
		// ==========================================
		const firstHeroIndex =
			this.heroDeck.findIndex(
				slot =>
					slot.unlocked &&
					slot.character !== null
			);

		this.selectedHeroIndex = firstHeroIndex >= 0 ? firstHeroIndex : 0;

		if (gameState.isRematch) {
			this.fighterSelectionActive = false;
			gameState.isRematch = false;
		}




		// ==========================================
		// STATUS BAR / FPS
		// ==========================================
		this.overlays = [
			new StatusBar(
				this.fighters,
				this.onTimeEnd
			),
			// new FpsCounter()
		];


		// ==========================================
		// HERO SELECTION EVENTS
		// ==========================================
		window.addEventListener( "pointerdown", this.handleHeroSelectionClick );
		window.addEventListener( "pointermove", this.handleHeroSelectionMove );
		window.addEventListener( "keydown", this.handleHeroSelectionKey );

		// ==========================================
		// PREPARE BATTLE CAMERA
		// ==========================================
		this.startRound();
		document.getElementById("mobile-controls").style.display = "none";

		
		// showMobileControls();
		// // resetGameState();
		// this.startRound();
	}

	selectedMapImage = new Image();

	mapBackgrounds = [
		"./public/images/maps/map1.jpg", // CITY
		"./public/images/maps/map2.jpg", // FOREST
		"./public/images/maps/map3.jpg"  // TEMPLE
	];


	getHeroDeckBox = (index) => {

		const slotWidth = 180;
		const slotHeight = 150;
		const gap = 20;

		const totalWidth = slotWidth * 5 + gap * 4;
		const startX = (1280 - totalWidth) / 2;
		const startY = 300;

		return {
			x: startX + index * (slotWidth + gap),
			y: startY,
			width: slotWidth,
			height: slotHeight
		};
	};

	getSelectedHero = () => {

		const slot = this.heroDeck[this.selectedHeroIndex];

		if (!slot) {
			return undefined;
		}

		if (!slot.unlocked) {
			return undefined;
		}

		if (slot.character === null) {
			return undefined;
		}

		return slot.character;
	};

	selectHero = (index) => {

		const slot = this.heroDeck[index];

		if (!slot) {
			return;
		}

		if (!slot.unlocked) {
			return;
		}

		if (slot.character === null) {
			return;
		}

		this.selectedHeroIndex = index;
	};

	confirmHeroSelection = () => {

		const selectedHero =
			this.getSelectedHero();

		if (selectedHero === undefined) {
			return;
		}

		// ==========================================
		// SAVE PLAYER FIGHTER
		// ==========================================
		gameState.fighters[0].id = selectedHero;


		// ==========================================
		// RESET PLAYER BATTLE DATA
		// ==========================================
		gameState.fighters.forEach((fighter) => {
			fighter.maxHitPoints =fighter.maxHitPoints ?? 200;
			fighter.hitPoints = fighter.maxHitPoints;
			fighter.score = 0;
			fighter.instance = undefined;
		});


		// ==========================================
		// CLEAR OLD RESULT
		// ==========================================
		gameState.battleResult = {
			winnerId: undefined,
			loserId: undefined
		};

		// ==========================================
		// STOP HERO SELECTION
		// ==========================================
		this.fighterSelectionActive = false;

		window.removeEventListener("pointerdown", this.handleHeroSelectionClick );
		window.removeEventListener("pointermove", this.handleHeroSelectionMove );
		window.removeEventListener( "keydown", this.handleHeroSelectionKey );

		const canvas = document.querySelector("canvas");

		if (canvas) {
			canvas.style.cursor = "default";
		}

		// ==========================================
		// START REAL BATTLE
		// ==========================================

		showMobileControls();

		this.startRound();
	};




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

		gameState.fighters[opponentId].hitPoints -= FighterAttackBaseData[strength].damage;

		const HitSplashClass = this.getHitSplashClass(strength);

		if (gameState.fighters[opponentId].hitPoints <= 0) {
			this.fighters[opponentId].changeState(FighterState.KO, time);
		}

		this.fighters[opponentId].direction = this.fighters[playerId].direction * -1;
		position && this.entities.add(HitSplashClass, position.x, position.y, playerId);
		this.hurtTimer = time.previous + FighterStruckDelay * FRAME_TIME;
	};

	handleHeroSelectionClick = (event) => {

		if (!this.fighterSelectionActive) {
			return;
		}

		const canvas =document.querySelector("canvas");
		const rect =canvas.getBoundingClientRect();
		const scale =
			Math.min(
				rect.width / canvas.width,
				rect.height / canvas.height
			);

		const renderedWidth =canvas.width * scale;
		const renderedHeight =canvas.height * scale;
		const offsetX =(rect.width - renderedWidth) / 2;
		const offsetY =(rect.height - renderedHeight) / 2;

		const x = (event.clientX - rect.left - offsetX) / scale;
		const y = (event.clientY - rect.top - offsetY) / scale;


		// ==========================================
		// HERO BOXES
		// ==========================================
		for (
			let i = 0;
			i < this.heroDeck.length;
			i++
		) {

			const box =
				this.getHeroDeckBox(i);

			if (
				x >= box.x &&
				x <= box.x + box.width &&
				y >= box.y &&
				y <= box.y + box.height
			) {

				this.selectHero(i);

				return;
			}
		}


		// ==========================================
		// CONFIRM
		// ==========================================
		if (
			x >= this.confirmBox.x &&
			x <=
				this.confirmBox.x +
				this.confirmBox.width &&
			y >= this.confirmBox.y &&
			y <=
				this.confirmBox.y +
				this.confirmBox.height
		) {

			this.confirmHeroSelection();

			return;
		}
	};

	handleHeroSelectionMove = (event) => {

		if (!this.fighterSelectionActive) {
			return;
		}

		const canvas = document.querySelector("canvas");
		const rect = canvas.getBoundingClientRect();

		const scale =
			Math.min(
				rect.width / canvas.width,
				rect.height / canvas.height
			);

		const renderedWidth =canvas.width * scale;
		const renderedHeight =canvas.height * scale;
		const offsetX =(rect.width - renderedWidth) / 2;
		const offsetY =(rect.height - renderedHeight) / 2;

		const x = (event.clientX - rect.left - offsetX) / scale;
		const y = (event.clientY - rect.top - offsetY) / scale;


		let hover = false;


		for (
			let i = 0;
			i < this.heroDeck.length;
			i++
		) {

			const box =
				this.getHeroDeckBox(i);

			if (
				x >= box.x &&
				x <= box.x + box.width &&
				y >= box.y &&
				y <= box.y + box.height
			) {

				hover = true;
				break;
			}
		}


		if (
			x >= this.confirmBox.x &&
			x <=
				this.confirmBox.x +
				this.confirmBox.width &&
			y >= this.confirmBox.y &&
			y <=
				this.confirmBox.y +
				this.confirmBox.height
		) {

			hover = true;
		}

		canvas.style.cursor = hover ? "pointer" : "default";
	};

	handleHeroSelectionKey = (event) => {

		if (!this.fighterSelectionActive) {
			return;
		}


		// ==========================================
		// LEFT
		// ==========================================

		if (event.code === "ArrowLeft") {

			for (
				let i = this.selectedHeroIndex - 1;
				i >= 0;
				i--
			) {

				const slot =
					this.heroDeck[i];

				if (
					slot.unlocked &&
					slot.character !== null
				) {

					this.selectedHeroIndex = i;
					return;
				}
			}
		}


		// ==========================================
		// RIGHT
		// ==========================================

		if (event.code === "ArrowRight") {

			for (
				let i = this.selectedHeroIndex + 1;
				i < this.heroDeck.length;
				i++
			) {

				const slot =
					this.heroDeck[i];

				if (
					slot.unlocked &&
					slot.character !== null
				) {

					this.selectedHeroIndex = i;
					return;
				}
			}
		}


		// ==========================================
		// CONFIRM
		// ==========================================

		if (event.code === "Enter") {

			this.confirmHeroSelection();
		}
	};

	getHeroFace = (id) => {

		if (id === FighterId.RYU) {

			if (!this.ryuFace) {

				this.ryuFace = new Image();

				this.ryuFace.src =
					"./public/images/Ryuface.png";
			}

			return this.ryuFace;
		}


		if (id === FighterId.KEN) {

			if (!this.kenFace) {

				this.kenFace = new Image();

				this.kenFace.src =
					"./public/images/Kenface.png";
			}

			return this.kenFace;
		}


		return undefined;
	};

	getFighterName = (id) => {

		switch (id) {

			case FighterId.RYU:
				return "RYU";

			case FighterId.KEN:
				return "KEN";

			default:
				return "UNKNOWN";
		}
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

	// goToStartScene = () => {
	// 	setTimeout(() => {
	// 		this.changeScene(MainMenuScene);
	// 	}, 4500);
	// };
	// goToBattleResultScene = () => {
	// 	setTimeout(() => {
	// 		this.changeScene(BattleResultScene);
	// 	}, 4500);
	// };
	goToBattleResultScene = () => {
		if (this.resultSceneTimer) {
			return;
		}
		const canvas = document.querySelector("canvas");
		if (canvas) {
			canvas.style.cursor = "default";
		}
		this.resultSceneTimer = setTimeout(() => {
			this.changeScene(BattleResultScene);
		}, 4500);
	};


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
		this.goToBattleResultScene();
	};


	endBattle = (winnerId, loserId, time) => {

		if (this.battleEnded) {
			return;
		}

		this.winnerId = winnerId;
		this.battleEnded = true;

		gameState.battleResult.winnerId =
			winnerId;

		gameState.battleResult.loserId =
			loserId;

		this.fighters[winnerId].victory = true;

		this.fighters[loserId].changeState(
			FighterState.KO,
			time
		);

		this.playResultVoice();

		this.goToBattleResultScene();
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

		gameState.fighters.forEach(
			(fighter, index) => {

				if (
					fighter.hitPoints <= 0 &&
					!this.battleEnded
				) {

					this.endBattle(
						1 - index,
						index,
						time
					);
				}
			}
		);
	};




	update = (time) => {

		// ==========================================
		// HERO SELECTION
		// ==========================================
		if (this.fighterSelectionActive) {
			return;
		}

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
	}


	drawHeroSelection = (context) => {

		// ==========================================
		// DARKEN BACKGROUND
		// ==========================================
		context.fillStyle = "rgba(0, 0, 0, 0.78)";

		context.fillRect(
			0,
			0,
			context.canvas.width,
			context.canvas.height
		);


		// ==========================================
		// TITLE
		// ==========================================
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "#ffffff";
		context.font = "bold italic 58px Arial";

		context.fillText(
			"PICK YOUR FIGHTER",
			640,
			150
		);


		// ==========================================
		// SUBTITLE
		// ==========================================
		context.font ="bold 24px Arial";
		context.fillStyle ="#cccccc";

		context.fillText(
			"Choose a hero from your Hero Deck",
			640,
			205
		);


		// ==========================================
		// HERO BOXES
		// ==========================================
		for (
			let i = 0;
			i < this.heroDeck.length;
			i++
		) {

			const slot =this.heroDeck[i];
			const box =this.getHeroDeckBox(i);
			const selected =i === this.selectedHeroIndex;

			// --------------------------------------
			// BOX BACKGROUND
			// --------------------------------------

			context.fillStyle =
				slot.unlocked
					? "rgba(15,15,15,0.95)"
					: "rgba(5,5,5,0.95)";

			context.fillRect(
				box.x,
				box.y,
				box.width,
				box.height
			);


			// --------------------------------------
			// SELECTION BORDER
			// --------------------------------------
			context.strokeStyle =
			selected ? "#FFD700" : "#555555";

			context.lineWidth = selected ? 6 : 2;

			context.strokeRect(
				box.x,
				box.y,
				box.width,
				box.height
			);


			// --------------------------------------
			// LOCKED
			// --------------------------------------
			if (!slot.unlocked) {

				context.fillStyle ="#777777";
				context.font ="bold 26px Arial";

				context.fillText(
					"LOCKED",
					box.x + box.width / 2,
					box.y + box.height / 2
				);

				continue;
			}


			// --------------------------------------
			// EMPTY
			// --------------------------------------
			if (slot.character === null) {

				context.fillStyle =
					"#777777";

				context.font =
					"bold 22px Arial";

				context.fillText(
					"EMPTY",
					box.x + box.width / 2,
					box.y + box.height / 2
				);

				continue;
			}


			// --------------------------------------
			// HERO NAME
			// --------------------------------------
			context.fillStyle ="#ffffff";
			context.font ="bold 28px Arial";

			context.fillText(
				this.getFighterName(
					slot.character
				),
				box.x + box.width / 2,
				box.y + 35
			);


			// --------------------------------------
			// HERO FACE
			// --------------------------------------
			const face =
				this.getHeroFace(
					slot.character
				);

			if (face) {

				context.drawImage(
					face,
					box.x + 35,
					box.y + 50,
					110,
					85
				);
			}
		}


		// ==========================================
		// CONFIRM BUTTON
		// ==========================================
		context.fillStyle ="#b8860b";

		context.fillRect(
			this.confirmBox.x,
			this.confirmBox.y,
			this.confirmBox.width,
			this.confirmBox.height
		);


		context.strokeStyle ="#FFD700";
		context.lineWidth = 3;

		context.strokeRect(
			this.confirmBox.x,
			this.confirmBox.y,
			this.confirmBox.width,
			this.confirmBox.height
		);


		context.fillStyle ="#ffffff";
		context.font ="bold 30px Arial";

		context.fillText(
			"CONFIRM",
			this.confirmBox.x +
				this.confirmBox.width / 2,
			this.confirmBox.y +
				this.confirmBox.height / 2
		);

	};


	draw = (context) => {

		// ==========================================
		// BATTLE CANVAS
		// ==========================================
		this.battleContext.clearRect(
			0,
			0,
			this.battleCanvas.width,
			this.battleCanvas.height
		);


		if (
			this.selectedMapImage.complete &&
			this.selectedMapImage.naturalWidth > 0
		) {
			this.battleContext.drawImage(
				this.selectedMapImage,
				0,
				0,
				this.battleCanvas.width,
				this.battleCanvas.height
			);
		} else {
			this.stage.drawBackground(
				this.battleContext,
				this.camera
			);
		}


		// ==========================================
		// BATTLE ALREADY STARTED
		// ==========================================
		if (!this.fighterSelectionActive) {

			this.drawShadows(
				this.battleContext
			);

			this.drawFighters(
				this.battleContext
			);

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
		}


		// ==========================================
		// SCALE BATTLE CANVAS
		// ==========================================
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


		// ==========================================
		// HERO SELECTION
		// ==========================================
		if (this.fighterSelectionActive) {

			this.drawHeroSelection(context);
			return;
		}


		// ==========================================
		// WINNER
		// ==========================================
		if (this.winnerId !== undefined) {

			this.drawWinnerTextHD(
				context,
				this.winnerId
			);
		}


		// ==========================================
		// SELECTION SCREEN
		// ==========================================
		if (this.fighterSelectionActive) {

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

			this.drawHeroSelection(context);

			return;
		}


		// ==========================================
		// NORMAL BATTLE
		// ==========================================
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