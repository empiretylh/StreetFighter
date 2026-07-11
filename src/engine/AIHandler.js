import { FighterState } from "../constants/fighter.js";

const AI_CONFIG = {
    followDistance: 70,
	reactionDelay:15,
	stopChance:0.04,

    attackCooldown: 40,
    attackChance: 0.1,

    // crouchPunchChance: 0.05,
    // crouchKickChance: 0.03,

    retreatChance: 0.20,
    jumpChance: 0.05,
};

const AIState = {
    WALK: "walk",
    ATTACK: "attack",
    WAIT: "wait",
    BACK: "back",
    CROUCH: "crouch",
};

export const ai = {
    left: false,
    right: false,
    up: false,
	down: false,

    lightPunch: false,
    mediumPunch: false,
    heavyPunch: false,

    lightKick: false,
    mediumKick: false,
    heavyKick: false,

	state: "walk",
	stateTimer: 0,
	attackCooldown: 0,
	lastDistance:0,
	reactionTimer:0,

    update(enemy, player) {

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        const distance = player.position.x - enemy.position.x;


		const playerDirectionChanged = Math.sign(distance) !== Math.sign(this.lastDistance);
		if(playerDirectionChanged){
			this.reactionTimer = 15; 
		}
		this.lastDistance = distance;



		this.lightPunch = false;
		this.mediumPunch = false;
		this.heavyPunch = false;

		this.lightKick = false;
		this.mediumKick = false;
		this.heavyKick = false;

		const playerIsCrouching =
		player.currentState === FighterState.CROUCH ||
		player.currentState === FighterState.CROUCH_DOWN ||
		player.currentState === FighterState.CROUCH_UP;

		if (this.attackCooldown > 0) this.attackCooldown--;
		if (this.stateTimer > 0) this.stateTimer--;

		const absDistance = Math.abs(distance);


		
		if(this.reactionTimer > 0){
			this.reactionTimer--;
			return;
		}



        if (absDistance > AI_CONFIG.followDistance) {

			if(this.reactionTimer > 0){
        		this.reactionTimer--;
        		return;
    		}

			if(Math.random() < AI_CONFIG.stopChance){
				this.reactionTimer = AI_CONFIG.reactionDelay;
				return;
			}

			if (distance > 0)
				this.right = true;
			else
				this.left = true;

			return;
		}

		if (absDistance <= AI_CONFIG.followDistance) {

			if (this.stateTimer === 0) {

				const action = Math.random();

				if (action < 0.45)
					this.state = AIState.ATTACK;

				else if (action < 0.65)
					this.state = AIState.WAIT;

				else if (action < 0.85)
					this.state = AIState.BACK;

				else
					this.state =  AIState.CROUCH;

				this.stateTimer = 20 + Math.floor(Math.random() * 30);

				if (this.state === AIState.WAIT) {
					return;
				}

				if (this.state === AIState.BACK) {

					if (distance > 0)
						this.left = true;
					else
						this.right = true;

					return;
				}

				// if (this.state === AIState.CROUCH) {

				// 	this.down = true;

				// 	if (this.attackCooldown === 0) {

				// 		if (Math.random() < AI_CONFIG.crouchPunchChance)
				// 			this.lightPunch = true;

				// 		if (Math.random() < AI_CONFIG.crouchKickChance)
				// 			this.mediumKick = true;

				// 		this.attackCooldown = AI_CONFIG.attackCooldown;
				// 	}

				// 	return;
				// }
				
			} else {

				if (this.state === AIState.ATTACK && this.attackCooldown === 0 && Math.random() < AI_CONFIG.attackChance) {

					const attack = Math.floor(Math.random() * 4);

					switch (attack) {

						case 0:
							this.lightPunch = true;
							break;

						case 1:
							this.mediumPunch = true;
							break;

						case 2:
							this.lightKick = true;
							break;

						case 3:
							this.mediumKick = true;
							break;
					}

					this.attackCooldown = AI_CONFIG.attackCooldown;
				}

			}

		}

    }
};