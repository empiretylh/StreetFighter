import { MainMenuScene } from "./MainMenuScene.js";
import { playSound } from "../engine/SoundHandler.js";

export class LoadingScene {

    backgroundImg = new Image();

    progress = 0;
    targetProgress = 0;

    assets = [];
    loadedAssets = 0;

    constructor(changeScene) {

        this.changeScene = changeScene;
        this.backgroundImg.src = "./public/images/bg1.jpg";

        // ==========================================
        // ASSETS TO PRELOAD
        // ==========================================
        this.assets = [
            "./public/images/bg1.jpg",
            "./public/images/profile.png",
            "./public/images/menu/trophy.png",
            "./public/images/menu/settings1.png",
            "./public/images/menu/exit.png",
            "./public/images/menu/coin.png",
            "./public/images/menu/diamond.png",
            "./public/images/menu/greenplus.png"
        ];

        this.loadAssets();
    }


    // ==========================================
    // LOAD ASSETS
    // ==========================================
    loadAssets = () => {

        if (this.assets.length === 0) {
            this.targetProgress = 1;
            return;
        }

        for (const src of this.assets) {

            const image = new Image();

            image.onload = () => {
                this.loadedAssets++;
                this.targetProgress = this.loadedAssets / this.assets.length;
            };

            image.onerror = () => {

                console.error("Failed to load asset:",src);

                this.loadedAssets++;
                this.targetProgress = this.loadedAssets / this.assets.length;
            };

            image.src = src;
            
            image.onload = () => {
                setTimeout(() => {
                    this.loadedAssets++;
                    this.targetProgress = this.loadedAssets / this.assets.length;
                }, 1500);
            };

        }
    };
    


    // ==========================================
    // UPDATE
    // ==========================================
    update(time) {


        this.progress += (this.targetProgress - this.progress) * 0.1;

        if (
            this.progress >= 0.999 &&
            this.loadedAssets >= this.assets.length
        ) {
            this.progress = 1;
            this.changeScene(MainMenuScene);
        }
    }


    // ==========================================
    // DRAW
    // ==========================================
    draw(context) {

        const width = context.canvas.width;
        const height = context.canvas.height;


        // ==========================================
        // BACKGROUND
        // ==========================================
        context.drawImage(
            this.backgroundImg,
            0,
            0,
            width,
            height
        );


        // ==========================================
        // DARK OVERLAY
        // ==========================================
        context.fillStyle = "rgba(0,0,0,0.55)";
        context.fillRect(
            0,
            0,
            width,
            height
        );


        // ==========================================
        // TITLE
        // ==========================================
        context.fillStyle = "white";
        context.font = "bold 42px Teko";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "LOADING...",
            width / 2,
            height / 2 - 70
        );


        // ==========================================
        // PROGRESS BAR
        // ==========================================
        const barWidth = 500;
        const barHeight = 20;

        const barX = (width - barWidth) / 2;
        const barY = height / 2 - 20;

        // Background
        context.fillStyle = "rgba(255,255,255,0.15)";

        context.fillRect(
            barX,
            barY,
            barWidth,
            barHeight
        );


        // Progress
        context.fillStyle = "#D4AF37";

        context.fillRect(
            barX,
            barY,
            barWidth * this.progress,
            barHeight
        );


        // Border
        context.strokeStyle = "rgba(255,255,255,0.7)";
        context.lineWidth = 2;

        context.strokeRect(
            barX,
            barY,
            barWidth,
            barHeight
        );


        // ==========================================
        // PERCENTAGE
        // ==========================================
        context.fillStyle = "white";
        context.font = "bold 20px Rajdhani";

        context.fillText(
            `${Math.floor(this.progress * 100)}%`,
            width / 2,
            barY + 50
        );

        
        context.textAlign = "left";
        context.textBaseline = "alphabetic";
    }
}