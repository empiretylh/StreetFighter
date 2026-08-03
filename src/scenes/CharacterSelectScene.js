import { MainMenuScene } from "./MainMenuScene.js";
import { FighterId } from "../constants/fighter.js";
import { gameState } from "../states/gameState.js";
import { BattleScene } from "./BattleScene.js";

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
        x: 15,
        y: 35,
        width: 130,
        height: 180
    };

    characterBoxes = [
        {
            id: FighterId.RYU,
            x:170,
            y:60,
            width:42,
            height:42,
        },
        {
            id: FighterId.KEN,
            x:220,
            y:60,
            width:42,
            height:42,
        },
        {
            id:"COMING",
            x:270,
            y:60,
            width:42,
            height:42,
        },
        {
            id:"COMING",
            x:170,
            y:110,
            width:42,
            height:42,
        },
        {
            id: "COMING",
            x: 220,
            y: 110,
            width: 42,
            height: 42,
        },
        {
            id: "COMING",
            x: 270,
            y: 110,
            width: 42,
            height: 42,
        },
        {
            id: "COMING",
            x: 320,
            y: 60,
            width: 42,
            height: 42,
        },
        {
            id: "COMING",
            x: 320,
            y: 110,
            width: 42,
            height: 42,
        }
    ];

    randomBox = {
        x:272,
        y:170,
        width:90,
        height:35
    };

    confirmBox = {
        x:170,
        y:170,
        width:90,
        height:35
    };

    constructor(changeScene) {
        this.changeScene = changeScene;

        document.getElementById("mobile-controls").style.display = "none";
        document.getElementById("btn-back").style.display = "block";

        this.backgroundImage = new Image();
        this.backgroundImage.src = "./public/images/bg1.jpg";

        this.previewImages = {
            [FighterId.RYU]: new Image(),
            [FighterId.KEN]: new Image()
        };

        this.faceImages = {
            [FighterId.RYU]: new Image(),
            [FighterId.KEN]: new Image()
        };

        this.faceImages[FighterId.RYU].src ="./public/images/Ryuface.png";
        this.faceImages[FighterId.KEN].src ="./public/images/Kenface.png";
        this.previewImages[FighterId.RYU].src ="./public/images/Ryufull.png";
        this.previewImages[FighterId.KEN].src ="./public/images/Kenfull.png";

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

        if (sound) {
            playSound(sound);
        }
    }

    confirmSelection = () => {

        playSound(this.confirmSelectSound);
        
        if (this.selected === "RANDOM") {

            const fighters = [
                FighterId.RYU,
                FighterId.KEN
            ];

            gameState.fighters[0].id = fighters[Math.floor(Math.random() * fighters.length)];

        } else {
            gameState.fighters[0].id = this.selected;
        }

        const fighters = [
            FighterId.RYU,
            FighterId.KEN
        ];

        gameState.fighters[1].id = fighters[Math.floor(Math.random() * fighters.length)];

        this.backButton.removeEventListener("click",this.goBackToMainMenu);


        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("pointerdown", this.handlePointerDown);
        window.removeEventListener("pointermove", this.handlePointerMove);

        this.backButton.style.display = "none";
        this.changeScene(BattleScene);

    }

    goBackToMainMenu = () => {

        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("pointerdown", this.handlePointerDown);
        window.removeEventListener("pointermove", this.handlePointerMove);
        
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

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;


        for (const box of this.characterBoxes) {

            if (this.inside(x, y, box)) {

                if (box.id === "COMING") return;
                let sound = box.id === FighterId.RYU ? this.leftSelectSound : this.rightSelectSound;
                this.selectCharacter(box.id, sound);

            }

        }

        if (this.inside(x, y, this.randomBox)) {
            this.selectCharacter("RANDOM", this.randomSelectSound);
        }

        if(
            x >= this.confirmBox.x &&
            x <= this.confirmBox.x + this.confirmBox.width &&
            y >= this.confirmBox.y &&
            y <= this.confirmBox.y + this.confirmBox.height
        ){
            if (this.inside(x, y, this.confirmBox)) {
                this.confirmSelection();
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

        for (const box of this.characterBoxes) {

            if (this.inside(x, y, box)) {
                hover = true;
            }

        }

        hover =
            hover ||
            this.inside(x, y, this.randomBox) ||
            this.inside(x, y, this.confirmBox);

        canvas.style.cursor = hover ? "pointer" : "default";

        canvas.style.cursor = hover ? "pointer" : "default";
    }

    

    update(time) {
        if (time.previous > this.arrowTimer) {
            this.arrowVisible = !this.arrowVisible;
            this.arrowTimer = time.previous + 300;
        }
    }
    
    drawSpacedText(context, text, x, y, spacing) {

        for (let i = 0; i < text.length; i++) {
            context.fillText(
                text[i],
                x + i * spacing,
                y
            );
        }

    }

    draw(context) {

        context.clearRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );

        context.imageSmoothingEnabled = true;
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
                this.previewBox.x + 8,      // move right
                this.previewBox.y + 3,      // move down
                120,                        // width
                155                         // height
            );

        } else if (this.selected === FighterId.RYU) {

            context.drawImage(
                this.previewImages[FighterId.RYU],
                this.previewBox.x,
                this.previewBox.y,
                this.previewBox.width,
                this.previewBox.height
            );

        }


        context.fillStyle = "white";
        context.font = "20px Arial";

        context.fillText("SELECT FIGHTER", 120, 40);

        context.strokeStyle = this.selected === FighterId.RYU ? "#FFD700" : "white";
        context.strokeStyle = this.selected === FighterId.KEN ? "#FFD700" : "white"; 

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

            } else {

                context.fillStyle = "white";
                context.font = "10px Arial";
                context.fillText("?", box.x + 15, box.y + 25);

            }

        }
        

        context.fillStyle = "black";
        context.fillRect(
            this.randomBox.x,
            this.randomBox.y,
            this.randomBox.width,
            this.randomBox.height
        );

        context.strokeStyle = this.selected === "RANDOM" ? "#FFFF00" : "white";

        context.strokeRect(
            this.randomBox.x,
            this.randomBox.y,
            this.randomBox.width,
            this.randomBox.height
        );


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

        context.strokeStyle = "white";
        context.strokeRect(
            this.confirmBox.x,
            this.confirmBox.y,
            this.confirmBox.width,
            this.confirmBox.height
        );

        context.textAlign = "left";
        context.textBaseline = "middle";
        context.fillStyle = "white";

        this.drawSpacedText(
            context,
            "CONFIRM",
            this.confirmBox.x + 10,
            this.confirmBox.y + this.confirmBox.height / 2,
            10
        );

        context.fillStyle = "white";
        context.font = "12px Arial";
        context.textAlign = "left";

        context.fillText(
            "ESC - Back",
            10,
            context.canvas.height - 10
        );
    }

}