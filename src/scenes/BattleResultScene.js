import { MainMenuScene } from "./MainMenuScene.js";
import { CharacterSelectScene } from "./CharacterSelectScene.js";
import { BattleScene } from "./BattleScene.js";
import { FighterId } from "../constants/fighter.js";
import { gameState } from "../states/gameState.js";

import { playSound } from "../engine/SoundHandler.js";
import {
    soundSelectIds,
    soundConfirmId
} from "../constants/sounds.js";
import { CharacterSelectScene1 } from "./CharacterSelectScene1.js";


export class BattleResultScene {

    canvas = document.createElement("canvas");
    context = this.canvas.getContext("2d");

    backgroundImg = new Image();

    playerFighter = undefined;
    opponentFighter = undefined;

    winnerId = undefined;
    loserId = undefined;


    // --------------------------------------------------
    // BUTTONS
    // --------------------------------------------------
    buttons = {
        rematch: {
            x: 70,
            y: 630,
            width: 330,
            height: 70
        },

        fighterSelect: {
            x: 475,
            y: 630,
            width: 330,
            height: 70
        },

        mainMenu: {
            x: 880,
            y: 630,
            width: 330,
            height: 70
        }
    };


    // --------------------------------------------------
    // BUTTON NAVIGATION
    // --------------------------------------------------

    buttonList = [
        "rematch",
        "fighterSelect",
        "mainMenu"
    ];

    selectedButtonIndex = 0;
    hoveredButtonIndex = -1;


    // --------------------------------------------------
    // BUTTON ANIMATION
    // --------------------------------------------------

    buttonHoverProgress = [
        0,
        0,
        0
    ];


    // --------------------------------------------------
    // CONSTRUCTOR
    // --------------------------------------------------
    constructor(changeScene) {

        this.changeScene = changeScene;

        this.canvas.width = 1280;
        this.canvas.height = 720;


        // Background
        this.backgroundImg.src = "./public/images/bg1.jpg";

        // Battle result data
        this.playerFighter = gameState.fighters?.[0];
        this.opponentFighter = gameState.fighters?.[1];
        this.winnerId = gameState.battleResult?.winnerId;
        this.loserId = gameState.battleResult?.loserId;

        // --------------------------------------------------
        // EVENTS
        // --------------------------------------------------
        window.addEventListener("pointerdown", this.handlePointerDown );
        window.addEventListener("pointermove", this.handlePointerMove );
        window.addEventListener("keydown", this.handleKeyDown );

        this.canvas.style.touchAction = "manipulation";
        this.canvas.style.cursor = "default";


        // --------------------------------------------------
        // HIDE MOBILE CONTROLS
        // --------------------------------------------------
        document
            .querySelectorAll(
                "#btn-kick, #btn-special, #btn-punch, .joystick"
            )
            .forEach((element) => {
                element.style.display = "none";
            });


        const backButton =
            document.getElementById("btn-back");

        if (backButton) {
            backButton.style.display = "none";
        }


        // Play selection sound for the initial button
        this.playSelectSound();
    }


    // --------------------------------------------------
    // DESTROY
    // --------------------------------------------------
    destroy = () => {

        window.removeEventListener( "pointerdown", this.handlePointerDown );
        window.removeEventListener( "pointermove", this.handlePointerMove );
        window.removeEventListener( "keydown", this.handleKeyDown );

        const canvas = document.querySelector("canvas");

        if (canvas) {
            canvas.style.cursor = "default";
        }
};


    // --------------------------------------------------
    // GET MOUSE POSITION
    // --------------------------------------------------
    getMousePosition = (event) => {

        const canvas = document.querySelector("canvas");

        if (!canvas) {
            return {
                x: -1,
                y: -1
            };
        }


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


        return {

            x:
                (event.clientX -
                    rect.left -
                    offsetX) / scale,

            y:
                (event.clientY -
                    rect.top -
                    offsetY) / scale
        };
    };


    // --------------------------------------------------
    // BUTTON HIT TEST
    // --------------------------------------------------
    isInsideButton = (x, y, button) => {

        return (
            x >= button.x &&
            x <= button.x + button.width &&
            y >= button.y &&
            y <= button.y + button.height
        );
    };


    // --------------------------------------------------
    // GET BUTTON INDEX
    // --------------------------------------------------
    getButtonIndexAtPosition = (x, y) => {

        for (
            let index = 0;
            index < this.buttonList.length;
            index++
        ) {

            const buttonName =
                this.buttonList[index];

            const button =
                this.buttons[buttonName];


            if (
                this.isInsideButton(
                    x,
                    y,
                    button
                )
            ) {
                return index;
            }
        }

        return -1;
    };


    // --------------------------------------------------
    // PLAY SELECT SOUND
    // --------------------------------------------------
    playSelectSound = () => {

        const sound =
            document.getElementById(
                soundSelectIds.LEFTCHAR
            );

        if (sound) {
            playSound(sound);
        }
    };


    // --------------------------------------------------
    // PLAY CONFIRM SOUND
    // --------------------------------------------------
    playConfirmSound = () => {

        const sound =
            document.getElementById(
                soundConfirmId
            );

        if (sound) {
            playSound(sound);
        }
    };


    // --------------------------------------------------
    // MOUSE MOVE
    // --------------------------------------------------
    handlePointerMove = (event) => {

        const { x, y } = this.getMousePosition(event);

        const newHoveredIndex =
            this.getButtonIndexAtPosition(
                x,
                y
            );


        if (
            newHoveredIndex !==
            this.hoveredButtonIndex
        ) {

            if (
                newHoveredIndex !== -1
            ) {

                this.selectedButtonIndex =
                    newHoveredIndex;

                this.playSelectSound();
            }


            this.hoveredButtonIndex =
                newHoveredIndex;
        }


        const canvas = document.querySelector("canvas");

        if (canvas) {

            canvas.style.cursor =
                newHoveredIndex !== -1
                    ? "pointer"
                    : "default";
        }
    };




    // --------------------------------------------------
    // KEYBOARD
    // --------------------------------------------------
    handleKeyDown = (event) => {

        switch (event.code) {

            case "ArrowLeft":
            case "ArrowUp":

                event.preventDefault();

                this.moveSelection(-1);

                break;


            case "ArrowRight":
            case "ArrowDown":

                event.preventDefault();

                this.moveSelection(1);

                break;


            case "Enter":
            case "NumpadEnter":

                event.preventDefault();

                this.activateSelectedButton();

                break;


            case "Escape":

                event.preventDefault();

                this.goToMainMenu();

                break;
        }
    };


    // --------------------------------------------------
    // MOVE BUTTON SELECTION
    // --------------------------------------------------
    moveSelection = (direction) => {

        const totalButtons =
            this.buttonList.length;


        this.selectedButtonIndex =
            (
                this.selectedButtonIndex +
                direction +
                totalButtons
            ) % totalButtons;


        // Keyboard selection takes priority
        this.hoveredButtonIndex =
            this.selectedButtonIndex;


        this.playSelectSound();
    };


    // --------------------------------------------------
    // ACTIVATE SELECTED BUTTON
    // --------------------------------------------------
    activateSelectedButton = () => {

        this.playConfirmSound();


        switch (
            this.buttonList[
                this.selectedButtonIndex
            ]
        ) {

            case "rematch":

                this.rematch();

                break;


            case "fighterSelect":

                this.goToFighterSelect();

                break;


            case "mainMenu":

                this.goToMainMenu();

                break;
        }
    };


    // --------------------------------------------------
    // MOUSE CLICK
    // --------------------------------------------------
    handlePointerDown = (event) => {

        const { x, y } = this.getMousePosition(event);

        const buttonIndex =
            this.getButtonIndexAtPosition(
                x,
                y
            );


        if (buttonIndex === -1) {
            return;
        }


        event.preventDefault();

        // Synchronize selection
        this.selectedButtonIndex = buttonIndex;

        this.playConfirmSound();


        switch (
            this.buttonList[
                buttonIndex
            ]
        ) {

            case "rematch":

                this.rematch();

                break;


            case "fighterSelect":

                this.goToFighterSelect();

                break;


            case "mainMenu":

                this.goToMainMenu();

                break;
        }
    };




    // --------------------------------------------------
    // REMATCH
    // --------------------------------------------------
    rematch = () => {

        if (
            gameState.fighters?.length >= 2
        ) {

            gameState.fighters.forEach(
                (fighter) => {

                    fighter.maxHitPoints = 200;
                    fighter.hitPoints = 200;

                    fighter.score = 0;

                    fighter.instance = undefined;
                }
            );
        }


        // Clear old result
        gameState.battleResult = {
            winnerId: undefined,
            loserId: undefined
        };


        gameState.isRematch = true;

        this.destroy();

        this.changeScene(
            BattleScene
        );
    };


    // --------------------------------------------------
    // FIGHTER SELECT
    // --------------------------------------------------
    goToFighterSelect = () => {

        gameState.isRematch = false;

        this.destroy();

        this.changeScene(
            CharacterSelectScene1
        );
    };


    // --------------------------------------------------
    // MAIN MENU
    // --------------------------------------------------
    goToMainMenu = () => {

        gameState.isRematch = false;

        this.destroy();

        this.changeScene(
            MainMenuScene
        );
    };


    // --------------------------------------------------
    // FIGHTER NAME
    // --------------------------------------------------
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


    // --------------------------------------------------
    // WINNER
    // --------------------------------------------------
    getWinnerFighter = () => {

        if (
            this.winnerId === undefined ||
            !gameState.fighters?.[
                this.winnerId
            ]
        ) {
            return undefined;
        }


        return gameState.fighters[
            this.winnerId
        ];
    };


    // --------------------------------------------------
    // BACKGROUND
    // --------------------------------------------------
    drawBackground = (context) => {

        if (
            this.backgroundImg.complete &&
            this.backgroundImg.width > 0
        ) {

            const canvasWidth =
                context.canvas.width;

            const canvasHeight =
                context.canvas.height;


            const imageRatio =
                this.backgroundImg.width /
                this.backgroundImg.height;

            const canvasRatio =
                canvasWidth /
                canvasHeight;


            let drawWidth;
            let drawHeight;
            let offsetX;
            let offsetY;


            if (
                imageRatio > canvasRatio
            ) {

                drawHeight =
                    canvasHeight;

                drawWidth =
                    drawHeight *
                    imageRatio;

                offsetX =
                    (canvasWidth -
                        drawWidth) / 2;

                offsetY = 0;

            } else {

                drawWidth =
                    canvasWidth;

                drawHeight =
                    drawWidth /
                    imageRatio;

                offsetX = 0;

                offsetY =
                    (canvasHeight -
                        drawHeight) / 2;
            }


            context.drawImage(
                this.backgroundImg,
                offsetX,
                offsetY,
                drawWidth,
                drawHeight
            );

        } else {

            context.fillStyle = "#101010";

            context.fillRect(
                0,
                0,
                context.canvas.width,
                context.canvas.height
            );
        }


        // Dark overlay
        context.fillStyle = "rgba(0, 0, 0, 0.72)";

        context.fillRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );
    };


    // --------------------------------------------------
    // DRAW BUTTON
    // --------------------------------------------------

    drawButton = (
        context,
        button,
        text,
        selected = false,
        hoverProgress = 0
    ) => {

        // Small scale animation
        const scale = 1 + (hoverProgress * 0.035);

        const centerX =button.x + button.width / 2;
        const centerY = button.y + button.height / 2;

        const drawWidth = button.width * scale;
        const drawHeight = button.height * scale;


        const drawX = centerX - drawWidth / 2;
        const drawY = centerY - drawHeight / 2;


        // Button background
        context.fillStyle = selected ? "#e51b23" : "rgba(40, 40, 40, 0.92)";

        context.fillRect(
            drawX,
            drawY,
            drawWidth,
            drawHeight
        );


        // Border
        context.strokeStyle = selected ? "#ff5555" : "#777777";
        context.lineWidth = selected ? 3 : 2;

        context.strokeRect(
            drawX,
            drawY,
            drawWidth,
            drawHeight
        );


        // Text
        context.fillStyle ="#ffffff";
        context.font ="bold 24px Arial";
        context.textAlign ="center";
        context.textBaseline ="middle";

        context.fillText(
            text,
            centerX,
            centerY
        );


        context.textAlign ="left";
        context.textBaseline ="alphabetic";
    }


    // --------------------------------------------------
    // DRAW
    // --------------------------------------------------

    draw = (context) => {

        context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        this.drawBackground(context);
        const winnerFighter = this.getWinnerFighter();


        if (
            !this.playerFighter ||
            !this.opponentFighter ||
            !winnerFighter
        ) {

            context.fillStyle =
                "#ffffff";

            context.font =
                "bold 32px Arial";

            context.textAlign =
                "center";

            context.fillText(
                "BATTLE RESULT UNAVAILABLE",
                640,
                350
            );

            context.textAlign =
                "left";

            return;
        }


        const winnerName =
            this.getFighterName(
                winnerFighter.id
            );

        const playerName =
            this.getFighterName(
                this.playerFighter.id
            );

        const opponentName =
            this.getFighterName(
                this.opponentFighter.id
            );


        // ==================================================
        // TITLE
        // ==================================================
        context.textAlign = "center";
        context.font = "bold italic 64px Arial";
        context.fillStyle = "#ff2020";

        context.fillText(
            `${winnerName} WINS!`,
            640,
            85
        );


        // ==================================================
        // LEFT PANEL
        // ==================================================
        context.fillStyle = "rgba(0, 0, 0, 0.55)";

        context.fillRect(
            80,
            135,
            500,
            400
        );


        context.strokeStyle = "rgba(255,255,255,0.25)";

        context.strokeRect(
            80,
            135,
            500,
            400
        );


        context.fillStyle ="#ffffff";
        context.font = "bold 28px Arial";

        context.fillText(
            "YOUR CHARACTER",
            330,
            190
        );


        context.font = "bold 48px Arial";

        context.fillText(
            playerName,
            330,
            245
        );


        // VS
        context.font ="bold italic 32px Arial";
        context.fillStyle = "#ff2020";

        context.fillText(
            "VS",
            330,
            315
        );

        context.font ="bold 28px Arial";
        context.fillStyle ="#ffffff";

        context.fillText(
            "OPPONENT",
            330,
            375
        );

        context.font ="bold 48px Arial";

        context.fillText(
            opponentName,
            330,
            435
        );


        // ==================================================
        // RIGHT PANEL
        // ==================================================
        context.fillStyle = "rgba(0, 0, 0, 0.55)";

        context.fillRect(
            620,
            135,
            580,
            400
        );

        context.strokeStyle = "rgba(255,255,255,0.25)";

        context.strokeRect(
            620,
            135,
            580,
            400
        );


        context.fillStyle = "#ffffff";
        context.font = "bold 30px Arial";

        context.fillText(
            "MATCH RESULTS",
            910,
            190
        );


        context.textAlign = "left";
        context.font = "bold 24px Arial";

        // Your health
        context.fillStyle = "#ffffff";

        context.fillText(
            "YOUR HEALTH",
            675,
            245
        );

        context.textAlign = "right";

        context.fillText(
            `${Math.max(
                0,
                this.playerFighter.hitPoints
            )}`,
            1140,
            245
        );


        // Your score
        context.textAlign = "left";

        context.fillText(
            "YOUR SCORE",
            675,
            295
        );

        context.textAlign = "right";

        context.fillText(
            `${this.playerFighter.score}`,
            1140,
            295
        );


        // Enemy health
        context.textAlign = "left";

        context.fillText(
            "ENEMY HEALTH",
            675,
            345
        );

        context.textAlign = "right";

        context.fillText(
            `${Math.max(
                0,
                this.opponentFighter.hitPoints
            )}`,
            1140,
            345
        );


        // Enemy score
        context.textAlign = "left";

        context.fillText(
            "ENEMY SCORE",
            675,
            395
        );

        context.textAlign = "right";

        context.fillText(
            `${this.opponentFighter.score}`,
            1140,
            395
        );


        // Winner
        context.textAlign = "left";
        context.fillStyle = "#ff2020";

        context.fillText(
            "WINNER",
            675,
            465
        );

        context.textAlign = "right";

        context.fillText(
            winnerName,
            1140,
            465
        );


        // ==================================================
        // BUTTONS
        // ==================================================
        for (
            let index = 0;
            index < this.buttonList.length;
            index++
        ) {

            const buttonName = this.buttonList[index];
            const button = this.buttons[buttonName];

            const isSelected =
                this.selectedButtonIndex ===
                index;


            this.drawButton(
                context,
                button,
                buttonName === "rematch" ? "REMATCH" : buttonName === "fighterSelect" ? "FIGHTER SELECT" : "MAIN MENU",
                isSelected,
                this.buttonHoverProgress[index]
            );
        }

        context.textAlign ="left";
        context.textBaseline ="alphabetic";
    };


    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------
    update = (time) => {

        for (
            let index = 0;
            index < this.buttonList.length;
            index++
        ) {

            const target = this.selectedButtonIndex === index ? 1 : 0;

            this.buttonHoverProgress[index] +=
                (
                    target -
                    this.buttonHoverProgress[index]
                ) * 0.18;

            if (
                Math.abs(
                    this.buttonHoverProgress[index]
                ) < 0.01
            ) {

                this.buttonHoverProgress[index] =
                    0;
            }
        }
    };
}