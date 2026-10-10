import { gameState } from "../states/gameState.js";
import { BattleScene } from "./BattleScene.js";
import { CharacterSelectScene } from "./CharacterSelectScene.js";

import { playSound } from "../engine/SoundHandler.js";
import {
    soundSelectIds,
    soundConfirmId
} from "../constants/sounds.js";
import { CharacterSelectScene1 } from "./CharacterSelectScene1.js";

export class MapSelectionScene {

    selected = 0;    
    isRandomizing = false;

    randomElapsed = 0;
    randomInterval = 0.15;
    randomLastTime = 0;
    randomSteps = 0;
    randomStepCount = 0;

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


    // ======MAP PREVIEW======
    previewBox = {
        x: 220,
        y: 75,
        width: 840,
        height: 340
    };

    mapThumbnails = [
        {
            x: 340,
            y: 480,
            width: 180,
            height: 90
        },
        {
            x: 550,
            y: 480,
            width: 180,
            height: 90
        },
        {
            x: 760,
            y: 480,
            width: 180,
            height: 90
        }
    ];

    // ======BUTTONS======
    backButton = {
        x: 200,
        y: 620,
        width: 180,
        height: 60
    };


    randomButton = {
        x: 550,
        y: 620,
        width: 180,
        height: 60
    };

    battleButton = {
        x: 880,
        y: 620,
        width: 180,
        height: 60
    };


    // ======SOUNDS======
    leftSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    rightSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);
    confirmSelectSound = document.getElementById(soundConfirmId);

    constructor(changeScene) {

        this.changeScene = changeScene;

        // ======BACKGROUND======
        // this.backgroundImage.src = "./public/images/bg1.jpg";


        // ======MAP IMAGES======
        this.maps[0].src = "./public/images/maps/map1.jpg";
        this.maps[1].src = "./public/images/maps/map2.jpg";
        this.maps[2].src = "./public/images/maps/map3.jpg";

        this.backButtonKey = document.getElementById("btn-back");
        this.backButtonKey.style.display = "none";

        // ======EVENTS======
        window.addEventListener("keydown",this.handleKeyDown);
        window.addEventListener("pointerdown",this.handlePointerDown);
        window.addEventListener("pointermove",this.handlePointerMove);
    }


    // ======COLLISION / CLICK CHECK======
    inside = (x, y, box) => {

        return (
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height
        );

    };


    
    getCanvasPoint = (event) => {

        const canvas = document.querySelector("canvas");

        if (!canvas) {
            return null;
        }

        const rect = canvas.getBoundingClientRect();

        // Match the actual rendered canvas area
        const scale = Math.min(
            rect.width / canvas.width,
            rect.height / canvas.height
        );

        const renderedWidth = canvas.width * scale;
        const renderedHeight = canvas.height * scale;

        const offsetX = (rect.width - renderedWidth) / 2;
        const offsetY = (rect.height - renderedHeight) / 2;

        const x =
            (event.clientX - rect.left - offsetX) / scale;

        const y =
            (event.clientY - rect.top - offsetY) / scale;

        if (
            x < 0 ||
            x > canvas.width ||
            y < 0 ||
            y > canvas.height
        ) {
            return null;
        }

        return { canvas, x, y };
    };




    // ======NEXT MAP======
    nextMap = () => {

        playSound(this.rightSelectSound);

        this.selected++;

        if (this.selected >= this.maps.length) {
            this.selected = 0;
        }

    };


    // ======PREVIOUS MAP======
    previousMap = () => {

        playSound(this.leftSelectSound);

        this.selected--;

        if (this.selected < 0) {
            this.selected = this.maps.length - 1;
        }

    };

    // ======RANDOM MAP======
    randomMap = () => {

        // Prevent clicking RANDOM multiple times
        if (this.isRandomizing) {
            return;
        }


        this.isRandomizing = true;
        this.randomElapsed = 0;
        this.randomStepCount = 0;
        this.randomLastTime = performance.now();


        this.randomSteps = Math.floor(Math.random() * 5) + 5;
        this.randomInterval = 0.02;
    };


    // ======BATTLE======
    confirmSelection = () => {

        playSound(this.confirmSelectSound);
        gameState.selectedMap = this.selected;
        
        window.removeEventListener("keydown",this.handleKeyDown);
        window.removeEventListener("pointerdown",this.handlePointerDown);
        window.removeEventListener("pointermove",this.handlePointerMove);

        this.changeScene(BattleScene);

    };


    // ======BACK======
    goBack = () => {

        playSound(this.confirmSelectSound);

        window.removeEventListener("keydown",this.handleKeyDown);
        window.removeEventListener("pointerdown",this.handlePointerDown);
        window.removeEventListener("pointermove",this.handlePointerMove);

        this.changeScene(CharacterSelectScene1);

    };


    // ======KEYBOARD======
    handleKeyDown = (event) => {

        if (this.isRandomizing) return;
        
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

            case "KeyR":

                this.randomMap();
                break;

            case "Enter":

                this.confirmSelection();
                break;

        }

    };


    // ======MOUSE / TOUCH======
    handlePointerDown = (event) => {

        const point = this.getCanvasPoint(event);

        if (!point || this.isRandomizing) {
            return;
        }

        const { x, y } = point;

        // MAP THUMBNAILS
        for (let i = 0; i < this.mapThumbnails.length; i++) {

            if (this.inside(x, y, this.mapThumbnails[i])) {

                if (this.selected !== i) {
                    playSound(
                        i > this.selected
                            ? this.rightSelectSound
                            : this.leftSelectSound
                    );
                }

                this.selected = i;
                return;
            }
        }

        // RANDOM
        if (this.inside(x, y, this.randomButton)) {
            this.randomMap();
            return;
        }

        // BACK
        if (this.inside(x, y, this.backButton)) {
            this.goBack();
            return;
        }

        // FIGHT
        if (this.inside(x, y, this.battleButton)) {
            this.confirmSelection();
            return;
        }
    };



    // ======MOUSE HOVER======
    handlePointerMove = (event) => {

        const point = this.getCanvasPoint(event);

        const canvas = document.querySelector("canvas");

        if (!point) {
            if (canvas) {
                canvas.style.cursor = "default";
            }
            return;
        }

        const { x, y } = point;

        let hover = false;

        // MAP THUMBNAILS
        for (const thumbnail of this.mapThumbnails) {
            if (this.inside(x, y, thumbnail)) {
                hover = true;
                break;
            }
        }

        // BUTTONS
        if (
            this.inside(x, y, this.backButton) ||
            this.inside(x, y, this.randomButton) ||
            this.inside(x, y, this.battleButton)
        ) {
            hover = true;
        }

        canvas.style.cursor = hover ? "pointer" : "default";
    };



    // =======UPDATE=======
    update(time) {

        if (!this.isRandomizing) {
            return;
        }
        const now = performance.now();
        const delta = (now - this.randomLastTime) / 1000;
        // const delta = time > 1
        //     ? time / 1000
        //     : time;

        this.randomLastTime = now;
        this.randomElapsed += delta;

        if (this.randomElapsed < this.randomInterval) {
            return;
        }

        // Reset timer
        this.randomElapsed = 0;

        // Switch map
        this.selected++;

        if (this.selected >= this.maps.length) {
            this.selected = 0;
        }


        playSound(this.rightSelectSound);

        this.randomStepCount++; 
        this.randomInterval += 0.02;

        if (this.randomStepCount >= this.randomSteps) {
            this.isRandomizing = false;
            this.confirmSelection();
        }

    };


    draw(context) {

        context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        // ======BACKGROUND======
        context.drawImage(
            this.backgroundImage,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        // ======TITLE======
        context.fillStyle = "white";
        context.font = "bold 32px Orbitron";
        context.textAlign = "center";
        context.textBaseline = "alphabetic";

        context.fillText(
            "SELECT BATTLE MAP",
            context.canvas.width / 2,
            55
        );


        // ======MAP IMAGE======
        context.drawImage(
            this.maps[this.selected],
            this.previewBox.x,
            this.previewBox.y,
            this.previewBox.width,
            this.previewBox.height
        );


        // ======MAP NAME======
        context.fillStyle = "white";
        context.font = "bold 24px Teko";
        context.textAlign = "center";

        context.fillText(
            this.mapNames[this.selected],
            context.canvas.width / 2,
            440
        );


        // ======MAP THUMBNAILS======
        this.mapThumbnails.forEach((thumbnail, index) => {

            // Thumbnail image

            context.drawImage(
                this.maps[index],
                thumbnail.x,
                thumbnail.y,
                thumbnail.width,
                thumbnail.height
            );


            // Selected map border
            context.lineWidth = index === this.selected ? 5 : 2;

            context.strokeStyle =
                index === this.selected
                    ? "yellow"
                    : "white";

            context.strokeRect(
                thumbnail.x,
                thumbnail.y,
                thumbnail.width,
                thumbnail.height
            );


            // Map name
            context.fillStyle = "white";
            context.font = "bold 16px Teko";
            context.textAlign = "center";
            context.textBaseline = "alphabetic";

            context.fillText(
                this.mapNames[index],
                thumbnail.x + thumbnail.width / 2,
                thumbnail.y + thumbnail.height + 22
            );

        });


        // =======BACK BUTTON=======
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
        context.font ="bold 20px Rajdhani";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "BACK",
            this.backButton.x +
                this.backButton.width / 2,

            this.backButton.y +
                this.backButton.height / 2
        );


        // ======RANDOM BUTTON======
        context.fillStyle = "black";

        context.fillRect(
            this.randomButton.x,
            this.randomButton.y,
            this.randomButton.width,
            this.randomButton.height
        );


        context.strokeStyle = "white";

        context.lineWidth = 2;

        context.strokeRect(
            this.randomButton.x,
            this.randomButton.y,
            this.randomButton.width,
            this.randomButton.height
        );


        context.fillStyle = "white";
        context.font = "bold 20px Rajdhani";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "RANDOM",
            this.randomButton.x +
                this.randomButton.width / 2,

            this.randomButton.y +
                this.randomButton.height / 2
        );

        // ======BATTLE BUTTON======
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
            "FIGHT",
            this.battleButton.x +
                this.battleButton.width / 2,

            this.battleButton.y +
                this.battleButton.height / 2
        );


        context.textAlign = "left";
        context.textBaseline = "alphabetic";

    }

}