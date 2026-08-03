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
            x: 30,
            y: 100,
            width: 140,
            height: 45
        },
        {
            text: "LEADERBOARD",
            x: 190,
            y: 100,
            width: 140,
            height: 45
        },
        {
            text: "SETTINGS",
            x: 30,
            y: 155,
            width: 140,
            height: 45
        },
        {
            text: "EXIT",
            x: 190,
            y: 155,
            width: 140,
            height: 45
        }
    ];

    arrowVisible = true;
    arrowTimer = 0;
    selected = 0;

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

        for (const button of this.buttons) {

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
    }

    draw(context) {

        context.fillStyle = "black";
        context.fillRect( 0, 0, context.canvas.width, context.canvas.height );

        context.drawImage(
			this.logoImg,
			0,
			0,
			this.logoImg.width,
			this.logoImg.height,
			112,
			12,
			170,
			80
		);

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

            context.font = "18px Arial";
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