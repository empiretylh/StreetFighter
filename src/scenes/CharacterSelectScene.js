import { MainMenuScene } from "./MainMenuScene.js";
import { FighterId } from "../constants/fighter.js";
import { gameState } from "../states/gameState.js";
// import { BattleScene } from "./BattleScene.js";
import { MapSelectionScene } from "./MapSelectionScene.js";

import { playSound } from "../engine/SoundHandler.js";
import { soundSelectIds,soundConfirmId } from "../constants/sounds.js";

export class CharacterSelectScene {

    selected = FighterId.RYU;
    arrowVisible = true;
    arrowTimer = 0;
    leftSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    rightSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);    
    randomSelectSound = document.getElementById(soundSelectIds.RANDOMCHAR);
    confirmSelectSound = document.getElementById(soundConfirmId);
    backgroundImage = new Image();

    previewBox = {
        x: 175,
        y: 135,
        width: 330,
        height: 570
    };

    characterBoxes = [
        {
            id: FighterId.RYU,
            x:570,
            y:160,
            width:142,
            height:142,
        },
        {
            id: FighterId.KEN,
            x:730,
            y:160,
            width:142,
            height:142,
        },
        {
            id: FighterId.NEWCHAR1,
            x:890,
            y:160,
            width:142,
            height:142,
        },
        {
            id: FighterId.NEWCHAR2,
            x:1050,
            y:160,
            width:142,
            height:142,
        },
        {
            id: FighterId.NEWCHAR3,
            x:570,
            y:330,
            width: 142,
            height: 142,
        },
        {
            id: FighterId.NEWCHAR4,
            x: 730,
            y: 330,
            width: 142,
            height: 142,
        },
        {
            id: FighterId.NEWCHAR5,
            x: 890,
            y: 330,
            width: 142,
            height: 142,
        },
        {
            id: FighterId.NEWCHAR6,
            x: 1050,
            y: 330,
            width: 142,
            height: 142,
        }
    ];

    characterStats = {
        [FighterId.RYU]: {
            name: "RYU",
            power: 80,
            speed: 65,
            toughness: 85
        },

        [FighterId.KEN]: {
            name: "KEN",
            power: 75,
            speed: 85,
            toughness: 70
        },

        [FighterId.NEWCHAR1]: {
            name: "NEWCHAR1",
            power: 90,
            speed: 70,
            toughness: 80
        },

        [FighterId.NEWCHAR2]: {
            name: "NEWCHAR2",
            power: 65,
            speed: 95,
            toughness: 65
        },

        [FighterId.NEWCHAR3]: {
            name: "NEWCHAR3",
            power: 80,
            speed: 70,
            toughness: 90
        },

        [FighterId.NEWCHAR4]: {
            name: "NEWCHAR4",
            power: 70,
            speed: 95,
            toughness: 65
        },

        [FighterId.NEWCHAR5]: {
            name: "NEWCHAR5",
            power: 90,
            speed: 75,
            toughness: 95
        },

        [FighterId.NEWCHAR6]: {
            name: "NEWCHAR6",
            power: 100,
            speed: 40,
            toughness: 100
        }
    };

    randomBox = {
        x:960,
        y:530,
        width:230,
        height:85
    };

    confirmBox = {
        x:650,
        y:530,
        width:270,
        height:85
    };

    constructor(changeScene) {
        this.changeScene = changeScene;
        document.getElementById("mobile-controls").style.display = "none";

        this.backgroundImage.src = "./public/images/bg1.jpg";

        this.previewImages = {
            [FighterId.RYU]: new Image(),
            [FighterId.KEN]: new Image()
        };
        
        this.previewImages[FighterId.RYU].src ="./public/images/Ryufull.png";
        this.previewImages[FighterId.KEN].src ="./public/images/Kenfull.png";

        this.faceImages = {
            [FighterId.RYU]: new Image(),
            [FighterId.KEN]: new Image(),
            [FighterId.NEWCHAR1]: new Image(),
            [FighterId.NEWCHAR2]: new Image(),
            [FighterId.NEWCHAR3]: new Image(),
            [FighterId.NEWCHAR4]: new Image(),
            [FighterId.NEWCHAR5]: new Image(),
            [FighterId.NEWCHAR6]: new Image()
        };

        this.faceImages[FighterId.RYU].src ="./public/images/Ryuface.png";
        this.faceImages[FighterId.KEN].src ="./public/images/Kenface.png";

        // Temporary images
        this.faceImages[FighterId.NEWCHAR1].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR2].src = "./public/images/Kenface.png";
        this.faceImages[FighterId.NEWCHAR3].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR4].src = "./public/images/Kenface.png";
        this.faceImages[FighterId.NEWCHAR5].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR6].src = "./public/images/Kenface.png";
       

        window.addEventListener("pointerdown", this.handlePointerDown);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("pointermove", this.handlePointerMove);

        this.backButton = document.getElementById("btn-back");
        this.backButton.style.display = "block";
        this.backButton.onclick = () => {
            this.goBackToMainMenu();
        };
    }

    
    inside = (x, y, box) => {
        return (
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height
        );
    };

    selectCharacter(id, sound) {
        if (this.selected === id) return;
        this.selected = id;
        if (sound) playSound(sound);
    }

    removeEventListeners = () => {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("pointerdown", this.handlePointerDown);
        window.removeEventListener("pointermove", this.handlePointerMove);
    };


    confirmSelection = () => {

        const availableFighters = [
            FighterId.RYU,
            FighterId.KEN
        ];

        if (this.selected === "RANDOM") {
            playSound(this.confirmSelectSound);

            gameState.fighters[0].id =
                availableFighters[
                    Math.floor(Math.random() * availableFighters.length)
                ];

            gameState.fighters[1].id =
                availableFighters[
                    Math.floor(Math.random() * availableFighters.length)
                ];

            this.removeEventListeners();
            this.changeScene(MapSelectionScene);
            return;
        }

        if (!availableFighters.includes(this.selected)) {
            alert(`${this.characterStats[this.selected]?.name ?? this.selected} is not available yet!`);
            return;
        }

        playSound(this.confirmSelectSound);

        const fighters = [
            FighterId.RYU,
            FighterId.KEN
        ];

        // gameState.fighters[0].id =
        //     this.selected === "RANDOM"
        //         ? fighters[Math.floor(Math.random() * fighters.length)]
        //         : this.selected;

        // gameState.fighters[1].id =
        //     fighters[Math.floor(Math.random() * fighters.length)];


        gameState.fighters[0].id = this.selected;

        gameState.fighters[1].id =
            availableFighters[
                Math.floor(Math.random() * availableFighters.length)
            ];

        this.removeEventListeners();
        // this.backButton.style.display = "none";
        this.changeScene(MapSelectionScene);
    };


    drawCharacterStats = (context) => {

        const stats = this.characterStats[this.selected];

        if (!stats) return;

        const x = this.previewBox.x;
        const width = this.previewBox.width;

        // ======STATS PANEL======
        const panelX = x + 10;
        const panelY = 500;
        const panelWidth = width - 5;
        const panelHeight = 195;

        // Dark transparent overlay
        context.fillStyle = "rgba(0, 0, 0, 0.75)";
        context.fillRect(
            panelX,
            panelY,
            panelWidth,
            panelHeight
        );

        // Panel border
        context.strokeStyle = "#FFD700";
        context.lineWidth = 2;
        context.strokeRect(
            panelX,
            panelY,
            panelWidth,
            panelHeight
        );


        // ======CHARACTER NAME======
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillStyle = "white";
        context.font = "bold 30px Arial";

        context.fillText(
            stats.name,
            x + width / 2,
            panelY + 30
        );


        // ======STAT BARS======
        const labelX = panelX + 15;
        const barX = panelX + 115;

        const barWidth = 175;
        const barHeight = 16;

        const rows = [
            {
                label: "POWER",
                value: stats.power,
                y: panelY + 70
            },
            {
                label: "SPEED",
                value: stats.speed,
                y: panelY + 105
            },
            {
                label: "TOUGHNESS",
                value: stats.toughness,
                y: panelY + 140
            }
        ];


        for (const stat of rows) {

            // Label
            context.fillStyle = "white";
            context.font = "bold 14px Arial";
            context.textAlign = "left";

            context.fillText(
                stat.label,
                labelX,
                stat.y
            );


            // Bar background
            context.fillStyle = "rgba(255, 255, 255, 0.2)";

            context.fillRect(
                barX,
                stat.y - barHeight / 2,
                barWidth,
                barHeight
            );


            // Filled portion
            context.fillStyle = "#D4AF37";

            context.fillRect(
                barX,
                stat.y - barHeight / 2,
                barWidth * (stat.value / 100),
                barHeight
            );


            // Border
            context.strokeStyle = "white";
            context.lineWidth = 1;

            context.strokeRect(
                barX,
                stat.y - barHeight / 2,
                barWidth,
                barHeight
            );


            // Value
            context.fillStyle = "white";
            context.font = "12px Arial";
            context.textAlign = "right";

            context.fillText(
                stat.value,
                panelX + panelWidth - 8,
                stat.y
            );
        }
    };


    goBackToMainMenu = () => {

        this.removeEventListeners();

        playSound(this.confirmSelectSound);
        this.backButton.style.display = "none";
        this.changeScene(MainMenuScene);

    }

    handleKeyDown = (event) => {
        if(event.code === "ArrowLeft"){
            this.selectCharacter(FighterId.RYU,this.leftSelectSound);
        }

        if(event.code === "ArrowRight"){
            this.selectCharacter(FighterId.KEN,this.rightSelectSound);
        }

        if(event.code === "Enter"){
            this.confirmSelection();
        }

        if (event.code === "Escape" || event.code === "Backspace"){
            this.goBackToMainMenu();
        }
    }

    handlePointerDown = (event)=>{

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();


        const scale = Math.min(
            rect.width / canvas.width,
            rect.height / canvas.height
        );

        const renderedWidth = canvas.width * scale;
        const renderedHeight = canvas.height * scale;

        const offsetX = (rect.width - renderedWidth) / 2;
        const offsetY = (rect.height - renderedHeight) / 2;

        const x = (event.clientX - rect.left - offsetX) / scale;
        const y = (event.clientY - rect.top - offsetY) / scale;


        for (const box of this.characterBoxes) {

            if (!this.inside(x, y, box)) {
                continue;
            }

            const sound = box.id === FighterId.RYU
            ? this.leftSelectSound : this.rightSelectSound;

            this.selectCharacter(box.id, sound);
            return;
        }

        
        if (this.inside(x, y, this.randomBox)) {
            this.selectCharacter("RANDOM", this.randomSelectSound);
            return;
        }

        if (this.inside(x, y, this.confirmBox)) {
            this.confirmSelection();
        }

    }

    handlePointerMove = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        
        const scale = Math.min(
            rect.width / canvas.width,
            rect.height / canvas.height
        );

        const renderedWidth = canvas.width * scale;
        const renderedHeight = canvas.height * scale;

        const offsetX = (rect.width - renderedWidth) / 2;
        const offsetY = (rect.height - renderedHeight) / 2;

        const x = (event.clientX - rect.left - offsetX) / scale;
        const y = (event.clientY - rect.top - offsetY) / scale;


        const hover =
            this.characterBoxes.some(box => this.inside(x, y, box)) ||
            this.inside(x, y, this.randomBox) ||
            this.inside(x, y, this.confirmBox);

        canvas.style.cursor = hover ? "pointer" : "default";

    }

    

    update(time) {
        if (time.previous > this.arrowTimer) {
            this.arrowVisible = !this.arrowVisible;
            this.arrowTimer = time.previous + 300;
        }
    }
    

    draw(context) {

        context.imageSmoothingEnabled = false;

        context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );

        context.drawImage(
            this.backgroundImage,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );

        // if (this.previewImages[this.selected]) {
        //     context.drawImage(
        //         this.previewImages[this.selected],
        //         this.previewBox.x,
        //         this.previewBox.y,
        //         this.previewBox.width,
        //         this.previewBox.height
        //     );
        // }
        if (this.selected === FighterId.KEN) {

            context.drawImage(
                this.previewImages[FighterId.KEN],
                this.previewBox.x + 25,      
                this.previewBox.y + 25,     
                330,                        
                470                         
            );

            //  previewBox = {
            //     x: 175,
            //     y: 135,
            //     width: 330,
            //     height: 570
            // };

        } else if (this.selected === FighterId.RYU) {

            context.drawImage(
                this.previewImages[FighterId.RYU],
                this.previewBox.x,
                this.previewBox.y,
                this.previewBox.width,
                this.previewBox.height
            );

        }

        this.drawCharacterStats(context);

        // TITLE
        context.textAlign = "center";
        context.textBaseline = "middle";

        const titleX = 640;
        const titleY = 65;

        context.font = "bold 42px Arial";
        context.fillStyle = "white";

        context.fillText(
            "SELECT FIGHTER",
            titleX,
            titleY
        );

        context.strokeStyle = "#FFD700";
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(250, titleY);
        context.lineTo(450, titleY);
        context.stroke();

        context.beginPath();
        context.moveTo(830, titleY);
        context.lineTo(1030, titleY);
        context.stroke();
        

        for (const box of this.characterBoxes) {

            context.lineWidth = this.selected === box.id ? 3 : 1;
            context.strokeStyle = this.selected === box.id ? "#FFD700" : "white";

            context.fillStyle = "black";
            context.fillRect(
                box.x,
                box.y,
                box.width,
                box.height
            );

            context.strokeRect(
                box.x,
                box.y,
                box.width,
                box.height
            );

            if (this.faceImages[box.id]) {

                context.drawImage(
                    this.faceImages[box.id],
                    box.x + 1,
                    box.y + 1,
                    box.width - 2,
                    box.height - 2 
                );

            } 

        }
        

        context.fillStyle = "black";
        context.fillRect(
            this.randomBox.x,
            this.randomBox.y,
            this.randomBox.width,
            this.randomBox.height
        );

        context.lineWidth = 1;
        context.strokeStyle = this.selected === "RANDOM" ? "#FFFF00" : "white";

        context.strokeRect(
            this.randomBox.x,
            this.randomBox.y,
            this.randomBox.width,
            this.randomBox.height
        );

        context.font = "28px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";

        context.fillText(
            "RANDOM",
            this.randomBox.x + this.randomBox.width / 2,
            this.randomBox.y + this.randomBox.height / 2
        );

        context.textAlign = "left";
        context.textBaseline = "alphabetic";

        

        context.strokeStyle="white";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillStyle = "black";
        context.fillRect(
            this.confirmBox.x,
            this.confirmBox.y,
            this.confirmBox.width,
            this.confirmBox.height
        );

        context.lineWidth = 1;
        context.strokeStyle = "white";
        context.strokeRect(
            this.confirmBox.x,
            this.confirmBox.y,
            this.confirmBox.width,
            this.confirmBox.height
        );

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";
        context.font = "28px Arial";

        context.fillText(
            "CONFIRM",
            this.confirmBox.x + this.confirmBox.width / 2,
            this.confirmBox.y + this.confirmBox.height / 2
        );


        context.fillStyle = "white";
        context.font = "22px Arial";
        context.textAlign = "left";

        context.fillText(
            "ESC - Back",
            10,
            context.canvas.height - 10
        );
    }

}