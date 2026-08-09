import { BattleScene } from "./BattleScene.js";
import { CharacterSelectScene } from "./CharacterSelectScene.js";

import { playSound } from "../engine/SoundHandler.js";
import {
    soundSelectIds,
    soundConfirmId
} from "../constants/sounds.js";

export class MapSelectionScene {

    selected = 0;

    backgroundImage = new Image();

    maps = [
        new Image(),
        new Image(),
        new Image()
    ];

    mapNames = [
        "CITY",
        "FOREST",
        "TEMPLE"
    ];


    // =========================
    // MAP PREVIEW
    // =========================

    previewBox = {
        x: 160,
        y: 80,
        width: 960,
        height: 480
    };


    // =========================
    // ARROWS
    // =========================

    leftArrow = {
        x: 200,
        y: 290,
        width: 140,
        height: 350
    };

    rightArrow = {
        x: 1000,
        y: 290,
        width: 140,
        height: 350
    };

    rightArrowHitbox = {
        x: 940,
        y: 290,
        width: 180,
        height: 350
    };


    // =========================
    // BUTTONS
    // =========================

    backButton = {
        x: 390,
        y: 620,
        width: 200,
        height: 60
    };

    battleButton = {
        x: 690,
        y: 620,
        width: 200,
        height: 60
    };


    // =========================
    // SOUNDS
    // =========================

    leftSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    rightSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);
    confirmSelectSound = document.getElementById(soundConfirmId);

    constructor(changeScene) {

        this.changeScene = changeScene;

        // =========================
        // BACKGROUND
        // =========================
        // this.backgroundImage.src = "./public/images/bg1.jpg";


        // =========================
        // MAP IMAGES
        // =========================

        this.maps[0].src = "./public/images/maps/map1.jpg";
        this.maps[1].src = "./public/images/maps/map2.jpg";
        this.maps[2].src = "./public/images/maps/map3.jpg";


        // =========================
        // EVENTS
        // =========================

        window.addEventListener("keydown",this.handleKeyDown);
        window.addEventListener("pointerdown",this.handlePointerDown);
        window.addEventListener("pointermove",this.handlePointerMove);
    }


    // =========================
    // COLLISION / CLICK CHECK
    // =========================

    inside = (x, y, box) => {

        return (
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height
        );

    };


    // =========================
    // NEXT MAP
    // =========================

    nextMap = () => {

        playSound(this.rightSelectSound);

        this.selected++;

        if (this.selected >= this.maps.length) {
            this.selected = 0;
        }

    };


    // =========================
    // PREVIOUS MAP
    // =========================

    previousMap = () => {

        playSound(this.leftSelectSound);

        this.selected--;

        if (this.selected < 0) {
            this.selected = this.maps.length - 1;
        }

    };


    // =========================
    // BATTLE
    // =========================

    confirmSelection = () => {

        playSound(this.confirmSelectSound);


        // Remove events before changing scene

        window.removeEventListener("keydown",this.handleKeyDown);
        window.removeEventListener("pointerdown",this.handlePointerDown);
        window.removeEventListener("pointermove",this.handlePointerMove);

        this.changeScene(BattleScene);

    };


    // =========================
    // BACK
    // =========================

    goBack = () => {

        playSound(this.confirmSelectSound);


        window.removeEventListener("keydown",this.handleKeyDown);
        window.removeEventListener("pointerdown",this.handlePointerDown);
        window.removeEventListener("pointermove",this.handlePointerMove);

        this.changeScene(CharacterSelectScene);

    };


    // =========================
    // KEYBOARD
    // =========================

    handleKeyDown = (event) => {

        switch (event.code) {

            case "ArrowLeft":

                this.previousMap();
                break;

            case "ArrowRight":

                this.nextMap();
                break;

            case "Escape":

                this.goBack();
                break;

            case "Enter":

                this.confirmSelection();
                break;

        }

    };


    // =========================
    // MOUSE / TOUCH
    // =========================

    handlePointerDown = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        // LEFT ARROW

        if (this.inside(x, y, this.leftArrow)) {

            this.previousMap();
            return;
        }


        // RIGHT ARROW

        if (this.inside(x, y, this.rightArrowHitbox)) {

            this.nextMap();
            return;
        }


        // BACK

        if (this.inside(x, y, this.backButton)) {

            this.goBack();
            return;
        }


        // BATTLE

        if (this.inside(x, y, this.battleButton)) {

            this.confirmSelection();
            return;
        }

    };


    // =========================
    // MOUSE HOVER
    // =========================

    handlePointerMove = (event) => {

        const canvas =document.querySelector("canvas");
        const rect =canvas.getBoundingClientRect();

        const scaleX =canvas.width / rect.width;
        const scaleY =canvas.height / rect.height;

        const x =(event.clientX - rect.left) * scaleX;
        const y =(event.clientY - rect.top) * scaleY;

        const hover =
            this.inside(x, y, this.leftArrow) ||
            this.inside(x, y, this.rightArrowHitbox) ||
            this.inside(x, y, this.backButton) ||
            this.inside(x, y, this.battleButton);


        canvas.style.cursor = hover ? "pointer" : "default";

    };


    // =========================
    // UPDATE
    // =========================

    update(time) {

        // Nothing needed for now

    };


    // =========================
    // DRAW
    // =========================

    draw(context) {

        // Clear canvas

        context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        // =========================
        // BACKGROUND
        // =========================

        context.drawImage(
            this.backgroundImage,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        // =========================
        // TITLE
        // =========================

        context.fillStyle = "white";
        context.font = "bold 32px Arial";
        context.textAlign = "center";
        context.textBaseline = "alphabetic";

        context.fillText(
            "SELECT BATTLE MAP",
            context.canvas.width / 2,
            55
        );


        // =========================
        // MAP IMAGE
        // =========================

        context.drawImage(
            this.maps[this.selected],
            this.previewBox.x,
            this.previewBox.y,
            this.previewBox.width,
            this.previewBox.height
        );


        // =========================
        // MAP NAME
        // =========================

        context.fillStyle = "white";
        context.font = "bold 24px Arial";
        context.textAlign = "center";

        context.fillText(
            this.mapNames[this.selected],
            context.canvas.width / 2,
            600
        );


        // =========================
        // LEFT ARROW BACKGROUND
        // =========================

        context.fillStyle =
            "rgba(0,0,0,0.65)";

        context.beginPath();

        context.arc(
            this.leftArrow.x + 40,
            this.leftArrow.y + 50,
            45,
            0,
            Math.PI * 2
        );

        context.fill();


        // =========================
        // RIGHT ARROW BACKGROUND
        // =========================

        context.beginPath();

        context.arc(
            this.rightArrow.x + 40,
            this.rightArrow.y + 50,
            45,
            0,
            Math.PI * 2
        );

        context.fill();


        // =========================
        // ARROW TEXT
        // =========================

        context.fillStyle = "white";
        context.font = "bold 50px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";


        context.fillText(
            "‹",
            this.leftArrow.x + 40,
            this.leftArrow.y + 47
        );


        context.fillText(
            "›",
            this.rightArrow.x + 40,
            this.rightArrow.y + 47
        );


        // =========================
        // BACK BUTTON
        // =========================

        context.fillStyle = "black";

        context.fillRect(
            this.backButton.x,
            this.backButton.y,
            this.backButton.width,
            this.backButton.height
        );


        context.strokeStyle = "white";

        context.lineWidth = 2;

        context.strokeRect(
            this.backButton.x,
            this.backButton.y,
            this.backButton.width,
            this.backButton.height
        );


        context.fillStyle = "white";

        context.font =
            "bold 20px Arial";

        context.textAlign = "center";

        context.textBaseline = "middle";

        context.fillText(
            "BACK",
            this.backButton.x +
                this.backButton.width / 2,

            this.backButton.y +
                this.backButton.height / 2
        );


        // =========================
        // BATTLE BUTTON
        // =========================

        context.fillStyle = "black";

        context.fillRect(
            this.battleButton.x,
            this.battleButton.y,
            this.battleButton.width,
            this.battleButton.height
        );


        context.strokeStyle = "white";

        context.strokeRect(
            this.battleButton.x,
            this.battleButton.y,
            this.battleButton.width,
            this.battleButton.height
        );


        context.fillStyle = "white";

        context.fillText(
            "BATTLE",
            this.battleButton.x +
                this.battleButton.width / 2,

            this.battleButton.y +
                this.battleButton.height / 2
        );


        // Reset canvas state

        context.textAlign = "left";
        context.textBaseline = "alphabetic";

    }

}