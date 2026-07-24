import { FighterState } from "../constants/fighter.js";
import { HEALTH_MAX_HIT_POINTS } from "../constants/battle.js";

const AI_CONFIG = {
    followDistance: 70,
	reactionDelay:15,
	stopChance:0.04,

    attackCooldown: 20,
    attackChance: 0.5,
	
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
	special: false,

	state: "walk",
	stateTimer: 0,
	attackCooldown: 0,
	lastDistance:0,
	reactionTimer:0,

    update(enemy, player, aiHP, playerHP) {

        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
		this.special = false;
		
        const distance = player.position.x - enemy.position.x;
		const absDistance = Math.abs(distance);
		const playerLowHealth = playerHP <= HEALTH_MAX_HIT_POINTS * 0.4;
		const aiLowHealth = aiHP <= HEALTH_MAX_HIT_POINTS * 0.4;

		let attackCooldown = AI_CONFIG.attackCooldown;
		let attackChance = AI_CONFIG.attackChance;
		let followDistance = AI_CONFIG.followDistance;
		let stopChance = AI_CONFIG.stopChance;
		let specialDistance = 160;
		let specialCooldown = 60;

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


		if(this.reactionTimer > 0){
			this.reactionTimer--;
			return;
		}

		// ------- Become Aggressive When Low HP ------- 
		if (playerLowHealth || aiLowHealth) {
			attackCooldown= 10;
			attackChance = 0.8;
			followDistance = 90;
			stopChance = 0.01;
			specialDistance = 140;
    		specialCooldown = 35;
		}
		// ------- Become Aggressive When Low HP ------- 


		// ------- If player 1 far away from ai , ai uses special attack ------- 
		if (absDistance > specialDistance && this.attackCooldown === 0) {

			if (Math.random() < 0.3) {
				this.special = true;
				this.attackCooldown = specialCooldown;
				return;
			}
		}
		// ------- If player 1 far away from ai , ai uses special attack ------- 


        if (absDistance > followDistance) {

			if(this.reactionTimer > 0){
        		this.reactionTimer--;
        		return;
    		}

			if(Math.random() < stopChance){
				this.reactionTimer = AI_CONFIG.reactionDelay;
				return;
			}

			if (distance > 0)
				this.right = true;
			else
				this.left = true;

			return;
		}

		

		if (absDistance <= followDistance) {

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

				if (this.state === AIState.ATTACK && this.attackCooldown === 0 && Math.random() < attackChance) {

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
					
					this.attackCooldown = attackCooldown;
					if ((playerLowHealth || aiLowHealth) && Math.random() < 0.5) {
						this.attackCooldown = 4;
					}
				}

			}

		}

    }
};