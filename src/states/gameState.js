import { FighterId } from '../constants/fighter.js';
import { createDefaultFighterState } from './fighterState.js';

export var gameState = {
	fighters: [
		createDefaultFighterState(FighterId.RYU),
		createDefaultFighterState(FighterId.KEN),
	],
};

// export const resetGameState = () => {
// 	gameState = {
// 		fighters: [
// 			createDefaultFighterState(FighterId.RYU),
// 			createDefaultFighterState(FighterId.KEN),
// 		],
// 	};
// };

export const resetGameState = () => {
	const player1Id = gameState.fighters[0].id;
	const player2Id = gameState.fighters[1].id;

	gameState = {
		fighters: [
			createDefaultFighterState(player1Id),
			createDefaultFighterState(player2Id),
		],
	};
};