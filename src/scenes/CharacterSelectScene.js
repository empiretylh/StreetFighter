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

    ryuBox = {
        x:40,
        y:70,
        width:90,
        height:40
    };

    kenBox = {
        x:145,
        y:70,
        width:90,
        height:40
    };

    randomBox = {
        x: 250,
        y: 70,
        width: 100,
        height: 40
    };

    confirmBox = {
        x:120,
        y:180,
        width:100,
        height:35
    };

    constructor(changeScene) {
        this.changeScene = changeScene;

        window.addEventListener("pointerdown", this.handlePointerDown);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("pointermove", this.handlePointerMove);
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

        // gameState.fighters[1].id =
        //     this.selected === FighterId.RYU
        //         ? FighterId.KEN
        //         : FighterId.RYU;

        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("pointerdown", this.handlePointerDown);
        window.removeEventListener("pointermove", this.handlePointerMove);

        this.changeScene(BattleScene);

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
    }

    handlePointerDown = (event)=>{

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        if(
            x >= this.ryuBox.x &&
            x <= this.ryuBox.x + this.ryuBox.width &&
            y >= this.ryuBox.y &&
            y <= this.ryuBox.y + this.ryuBox.height
        ){
            if (this.inside(x, y, this.ryuBox)) {
                this.selectCharacter(FighterId.RYU,this.leftSelectSound);
            }
        }

        if(
            x >= this.kenBox.x &&
            x <= this.kenBox.x + this.kenBox.width &&
            y >= this.kenBox.y &&
            y <= this.kenBox.y + this.kenBox.height
        ){
            if (this.inside(x, y, this.kenBox)) {
                this.selectCharacter(FighterId.KEN,this.rightSelectSound);
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

        const hover =
            this.inside(x, y, this.ryuBox) ||
            this.inside(x, y, this.kenBox) ||
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
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.fillStyle = "white";
        context.font = "20px Arial";

        context.fillText("SELECT FIGHTER", 120, 40);

        if (this.selected === FighterId.RYU && this.arrowVisible) {
            context.fillText(">", 40, 100);
        }
        context.fillText("RYU", 60, 100);

        // if (this.selected === FighterId.RYU) {

        //     context.strokeStyle = "yellow";
        //     context.lineWidth = 1;

        //     context.strokeRect(
        //         this.ryuBox.x,
        //         this.ryuBox.y,
        //         this.ryuBox.width,
        //         this.ryuBox.height
        //     );

        // }

        if (this.selected === FighterId.KEN && this.arrowVisible) {
            context.fillText(">", 145, 100);
        }
        context.fillText("KEN", 165, 100);

        if (this.selected === "RANDOM" && this.arrowVisible) {
            context.fillText(">", 250, 100);
        }
        context.fillText("RANDOM", 270, 100);

        context.strokeStyle="white";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.strokeRect(
            this.confirmBox.x,
            this.confirmBox.y,
            this.confirmBox.width,
            this.confirmBox.height
        );

        context.fillText(
            "CONFIRM",
            this.confirmBox.x + this.confirmBox.width / 2,
            this.confirmBox.y + this.confirmBox.height / 2
        );

        context.textAlign = "left";
        context.textBaseline = "alphabetic";
    }

}