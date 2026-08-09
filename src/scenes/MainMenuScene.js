import { CharacterSelectScene } from "./CharacterSelectScene.js";
import { playSound } from "../engine/SoundHandler.js";
import { soundSelectIds,soundConfirmId } from "../constants/sounds.js";

export class MainMenuScene {

    logoImg = document.getElementById('Logo');
    confirmSelectSound = document.getElementById(soundConfirmId);
    leftSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    rightSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);

    buttons = [
        {
            text: "PLAY",
            x: 370,
            y: 420,
            width: 240,
            height: 75
        },
        {
            text: "LEADERBOARD",
            x: 630,
            y: 420,
            width: 240,
            height: 75
        },
        {
            text: "SETTINGS",
            x: 370,
            y: 520,
            width: 240,
            height: 75
        },
        {
            text: "EXIT",
            x: 630,
            y: 520,
            width: 240,
            height: 75
        }
    ];

    arrowVisible = true;
    arrowTimer = 0;
    selected = 0;
    logoAlpha = 0;
    logoFadeSpeed = 0.009;
    logoFadeDirection = 1;

    constructor(changeScene) {  
        this.changeScene = changeScene;
        document.getElementById("mobile-controls").style.display = "none";
        document.getElementById("btn-back").style.display = "none";
        
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("pointerdown", this.handlePointerDown);
        window.addEventListener("pointermove", this.handlePointerMove);
    }

    handleKeyDown = (event) => {

        switch (event.code) {

            case "ArrowRight":

                if (this.selected % 2 === 0) {
                    this.selected++;
                    playSound(this.rightSelectSound);
                }
                break;

            case "ArrowLeft":

                if (this.selected % 2 === 1) {
                    this.selected--;
                    playSound(this.leftSelectSound);
                }
                break;

            case "ArrowDown":

                if (this.selected < 2) {
                    this.selected += 2;
                    playSound(this.rightSelectSound);
                }
                break;

            case "ArrowUp":

                if (this.selected >= 2) {
                    this.selected -= 2;
                    playSound(this.leftSelectSound);
                }
                break;

            case "Enter":

                this.selectButton();
                break;
        }

    }

    selectButton = () => {

        switch (this.selected) {

            case 0:

                window.removeEventListener("keydown", this.handleKeyDown);
                window.removeEventListener("pointerdown", this.handlePointerDown);
                window.removeEventListener("pointermove", this.handlePointerMove);

                playSound(this.confirmSelectSound);
                this.changeScene(CharacterSelectScene);
                break;

            case 1:
                alert("Leaderboard - Coming Soon");
                break;

            case 2:
                alert("Settings - Coming Soon");
                break;

            case 3:
                alert("Exit - Coming Soon");
                break;
        }

    }

    handlePointerDown = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        for (const [index, button] of this.buttons.entries()) {

            if (
                x >= button.x &&
                x <= button.x + button.width &&
                y >= button.y &&
                y <= button.y + button.height
            ) {
                this.selected = index;
                this.selectButton();
                break;
            }

        }

    }

    handlePointerMove = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        let hover = false;

        for (const [index, button] of this.buttons.entries()) {

            if (
                x >= button.x &&
                x <= button.x + button.width &&
                y >= button.y &&
                y <= button.y + button.height
            ) {
                hover = true;
                if (this.selected !== index) {
                    if (index > this.selected) {
                        playSound(this.rightSelectSound);
                    } else {
                        playSound(this.leftSelectSound);
                    }
                    this.selected = index;
                }
                break;
            }

        }

        canvas.style.cursor = hover ? "pointer" : "default";

    }



    update(time) {

        if (time.previous > this.arrowTimer) {
            this.arrowVisible = !this.arrowVisible;
            this.arrowTimer = time.previous + 300;
        }

        this.logoAlpha += this.logoFadeSpeed * this.logoFadeDirection;

        if (this.logoAlpha >= 1) {
            this.logoAlpha = 1;
            this.logoFadeDirection = -1;
        }

        if (this.logoAlpha <= 0) {
            this.logoAlpha = 0;
            this.logoFadeDirection = 1;
        }
    }

    draw(context) {
        
        context.fillStyle = "black";
        context.fillRect( 0, 0, context.canvas.width, context.canvas.height );
        context.globalAlpha = this.logoAlpha;

        context.drawImage(
			this.logoImg,
			0,
			0,
			this.logoImg.width,
			this.logoImg.height,
			412,
			112,
			450,
			180
		);

        context.globalAlpha = 1;

        // context.fillStyle = "white";
        // context.font = "bold 32px Arial";
        // context.textAlign = "center";

        // context.fillText(
        //     "STREET FIGHTER",
        //     context.canvas.width / 2,
        //     45
        // );

        // context.font = "14px Arial";

        // context.fillText(
        //     "The Ultimate Fighting Game",
        //     context.canvas.width / 2,
        //     68
        // );


        for (const [index, button] of this.buttons.entries()) {

            context.strokeStyle = "white";

            context.strokeStyle =
                index === this.selected ? "yellow" : "white";

            if (index === this.selected) {
                context.strokeStyle = "#FFD700";
                context.lineWidth = 4;
            } else {
                context.strokeStyle = "white";
                context.lineWidth = 2;
            }

            context.strokeRect(
                button.x,
                button.y,
                button.width,
                button.height
            );

            context.font = "28px Arial";
            context.fillStyle = index === this.selected ? "yellow" : "white";
            context.textAlign = "center";
            context.textBaseline = "middle";

            context.fillText(
                button.text,
                button.x + button.width / 2,
                button.y + button.height / 2
            );

        }

        context.textAlign = "left";
        context.textBaseline = "alphabetic";

    }

}