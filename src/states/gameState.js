import { FighterId } from '../constants/fighter.js';
import { createDefaultFighterState } from './fighterState.js';

export var gameState = {
    fighters: [
        createDefaultFighterState(FighterId.RYU),
        createDefaultFighterState(FighterId.KEN),
    ],

    battleResult: {
        winnerId: undefined,
        loserId: undefined,
    },
};


export const resetGameState = () => {
    gameState = {
        fighters: [
            createDefaultFighterState(FighterId.RYU),
            createDefaultFighterState(FighterId.KEN),
        ],

        battleResult: {
            winnerId: undefined,
            loserId: undefined,
        },
    };
};


export const resetBattleResult = () => {
    gameState.battleResult = {
        winnerId: undefined,
        loserId: undefined,
    };
};