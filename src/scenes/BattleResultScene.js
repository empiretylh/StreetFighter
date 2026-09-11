import { MainMenuScene } from "./MainMenuScene.js";
import { CharacterSelectScene } from "./CharacterSelectScene.js";
import { BattleScene } from "./BattleScene.js";
import { FighterId } from "../constants/fighter.js";
import { gameState } from "../states/gameState.js";

export class BattleResultScene {

    canvas = document.createElement("canvas");
    context = this.canvas.getContext("2d");

    playerFighter = undefined;
    opponentFighter = undefined;

    winnerId = undefined;
    loserId = undefined;

    constructor(changeScene) {

        this.changeScene = changeScene;

        this.canvas.width = 1280;
        this.canvas.height = 720;

        /*
         * Save references to the fighters
         */
        this.playerFighter = gameState.fighters?.[0];
        this.opponentFighter = gameState.fighters?.[1];

        /*
         * Get battle result
         */
        this.winnerId = gameState.battleResult?.winnerId;
        this.loserId = gameState.battleResult?.loserId;

        /*
         * Mouse events
         */
        this.canvas.addEventListener(
            "click",
            this.handleClick
        );

        this.canvas.addEventListener(
            "mousemove",
            this.handleMouseMove
        );

        this.canvas.style.cursor = "default";

        /*
         * Hide battle controls
         */
        document
            .querySelectorAll(
                "#btn-kick, #btn-special, #btn-punch, .joystick"
            )
            .forEach((element) => {
                element.style.display = "none";
            });

        /*
         * Hide back button
         */
        const backButton = document.getElementById("btn-back");

        if (backButton) {
            backButton.style.display = "none";
        }
    }

    /*
     * --------------------------------------------------
     * CLEANUP
     * --------------------------------------------------
     */

    destroy = () => {

        this.canvas.removeEventListener(
            "click",
            this.handleClick
        );

        this.canvas.removeEventListener(
            "mousemove",
            this.handleMouseMove
        );

        this.canvas.style.cursor = "default";
    };


    /*
     * --------------------------------------------------
     * MOUSE POSITION
     * --------------------------------------------------
     */

    getMousePosition = (event) => {

        const rect = this.canvas.getBoundingClientRect();

        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY,
        };
    };


    /*
     * --------------------------------------------------
     * BUTTON HITBOXES
     * --------------------------------------------------
     */

    isRematchButton = (x, y) => {

        return (
            x >= 100 &&
            x <= 400 &&
            y >= 650 &&
            y <= 710
        );
    };


    isFighterSelectButton = (x, y) => {

        return (
            x >= 470 &&
            x <= 770 &&
            y >= 650 &&
            y <= 710
        );
    };


    isMainMenuButton = (x, y) => {

        return (
            x >= 840 &&
            x <= 1140 &&
            y >= 650 &&
            y <= 710
        );
    };


    /*
     * --------------------------------------------------
     * MOUSE MOVE
     * --------------------------------------------------
     */

    handleMouseMove = (event) => {

        const { x, y } = this.getMousePosition(event);

        const overButton =
            this.isRematchButton(x, y) ||
            this.isFighterSelectButton(x, y) ||
            this.isMainMenuButton(x, y);

        this.canvas.style.cursor =
            overButton
                ? "pointer"
                : "default";
    };


    /*
     * --------------------------------------------------
     * CLICK
     * --------------------------------------------------
     */

    handleClick = (event) => {

        const { x, y } = this.getMousePosition(event);


        /*
         * REMATCH
         */

        if (this.isRematchButton(x, y)) {

            this.rematch();

            return;
        }


        /*
         * FIGHTER SELECT
         */

        if (this.isFighterSelectButton(x, y)) {

            this.destroy();

            this.changeScene(
                CharacterSelectScene
            );

            return;
        }


        /*
         * MAIN MENU
         */

        if (this.isMainMenuButton(x, y)) {

            this.destroy();

            this.changeScene(
                MainMenuScene
            );

            return;
        }
    };


    /*
     * --------------------------------------------------
     * REMATCH
     * --------------------------------------------------
     */

    rematch = () => {

        /*
         * Keep the selected fighters,
         * but reset their battle data.
         */

        if (gameState.fighters?.length >= 2) {

            gameState.fighters.forEach((fighter) => {

                /*
                 * Reset score
                 */
                fighter.score = 0;

                /*
                 * Reset HP
                 *
                 * Change 100 if your game uses
                 * another maximum HP value.
                 */
                fighter.hitPoints =
                    fighter.maxHitPoints ?? 100;

                /*
                 * Remove old entity instance
                 */
                fighter.instance = undefined;
            });
        }


        /*
         * Clear previous battle result
         */

        gameState.battleResult = {
            winnerId: undefined,
            loserId: undefined,
        };


        /*
         * Clean this scene
         */

        this.destroy();


        /*
         * Start a completely new BattleScene
         */

        this.changeScene(BattleScene);
    };


    /*
     * --------------------------------------------------
     * FIGHTER NAME
     * --------------------------------------------------
     */

    getFighterName = (id) => {

        switch (id) {

            case FighterId.KEN:
                return "KEN";

            case FighterId.RYU:
                return "RYU";

            default:
                return "UNKNOWN";
        }
    };


    /*
     * --------------------------------------------------
     * WINNER
     * --------------------------------------------------
     */

    getWinnerFighter = () => {

        if (
            this.winnerId === undefined ||
            !gameState.fighters?.[this.winnerId]
        ) {
            return undefined;
        }

        return gameState.fighters[
            this.winnerId
        ];
    };


    /*
     * --------------------------------------------------
     * DRAW
     * --------------------------------------------------
     */

    draw = (context) => {

        context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        /*
         * Background
         */

        context.fillStyle = "#101010";

        context.fillRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        /*
         * Validate result data
         */

        const winnerFighter =
            this.getWinnerFighter();

        if (
            !this.playerFighter ||
            !this.opponentFighter ||
            !winnerFighter
        ) {

            context.fillStyle = "#ffffff";
            context.font = "bold 32px Arial";

            context.fillText(
                "BATTLE RESULT UNAVAILABLE",
                390,
                350
            );

            console.warn(
                "Battle result data is not ready.",
                gameState
            );

            return;
        }


        /*
         * --------------------------------------------------
         * WINNER TITLE
         * --------------------------------------------------
         */

        const winnerName =
            this.getFighterName(
                winnerFighter.id
            );

        context.font =
            "bold italic 70px Arial";

        context.fillStyle =
            "#ff2020";

        context.fillText(
            `${winnerName} WINS!`,
            70,
            100
        );


        /*
         * --------------------------------------------------
         * YOUR CHARACTER
         * --------------------------------------------------
         */

        const playerName =
            this.getFighterName(
                this.playerFighter.id
            );

        context.font =
            "bold 32px Arial";

        context.fillStyle =
            "#ffffff";

        context.fillText(
            "YOUR CHARACTER",
            100,
            160
        );

        context.font =
            "bold 42px Arial";

        context.fillText(
            playerName,
            100,
            220
        );


        /*
         * --------------------------------------------------
         * OPPONENT
         * --------------------------------------------------
         */

        const opponentName =
            this.getFighterName(
                this.opponentFighter.id
            );

        context.font =
            "bold 32px Arial";

        context.fillText(
            "OPPONENT",
            100,
            280
        );

        context.font =
            "bold 42px Arial";

        context.fillText(
            opponentName,
            100,
            340
        );


        /*
         * --------------------------------------------------
         * MATCH RESULTS
         * --------------------------------------------------
         */

        context.font =
            "bold 28px Arial";

        context.fillText(
            "MATCH RESULTS",
            850,
            170
        );


        /*
         * Player HP
         */

        context.font =
            "bold 26px Arial";

        context.fillText(
            `YOUR HEALTH    ${Math.max(
                0,
                this.playerFighter.hitPoints
            )}`,
            850,
            230
        );


        /*
         * Player score
         */

        context.fillText(
            `YOUR SCORE     ${this.playerFighter.score}`,
            850,
            280
        );


        /*
         * Opponent HP
         */

        context.fillText(
            `ENEMY HEALTH   ${Math.max(
                0,
                this.opponentFighter.hitPoints
            )}`,
            850,
            330
        );


        /*
         * Opponent score
         */

        context.fillText(
            `ENEMY SCORE    ${this.opponentFighter.score}`,
            850,
            380
        );


        /*
         * Winner
         */

        context.fillStyle =
            "#ff2020";

        context.fillText(
            `WINNER         ${winnerName}`,
            850,
            450
        );


        /*
         * --------------------------------------------------
         * BUTTONS
         * --------------------------------------------------
         */

        /*
         * REMATCH
         */

        context.fillStyle =
            "#d71919";

        context.fillRect(
            100,
            650,
            300,
            60
        );

        context.fillStyle =
            "#ffffff";

        context.font =
            "bold 26px Arial";

        context.fillText(
            "REMATCH",
            180,
            690
        );


        /*
         * FIGHTER SELECT
         */

        context.fillStyle =
            "#333333";

        context.fillRect(
            470,
            650,
            300,
            60
        );

        context.fillStyle =
            "#ffffff";

        context.fillText(
            "FIGHTER SELECT",
            505,
            690
        );


        /*
         * MAIN MENU
         */

        context.fillStyle =
            "#333333";

        context.fillRect(
            840,
            650,
            300,
            60
        );

        context.fillStyle =
            "#ffffff";

        context.fillText(
            "MAIN MENU",
            920,
            690
        );
    };



    update = (time) => {

    };
}