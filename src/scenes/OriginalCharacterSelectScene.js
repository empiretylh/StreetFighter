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

    // ryuBox = {
    //     x:40,
    //     y:70,
    //     width:90,
    //     height:40
    // };

    // kenBox = {
    //     x:145,
    //     y:70,
    //     width:90,
    //     height:40
    // };

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
            y:50,
            width:40,
            height:40,
        },
        {
            id: FighterId.KEN,
            x:220,
            y:50,
            width:40,
            height:40,
        },
        {
            id:"COMING",
            x:270,
            y:50,
            width:40,
            height:40,
        },
        {
            id:"COMING",
            x:170,
            y:100,
            width:40,
            height:40,
        },
    ];

    randomBox = {
        x: 250,
        y: 70,
        width: 100,
        height: 40
    };

    confirmBox = {
        x:140,
        y:180,
        width:100,
        height:35
    };

    constructor(changeScene) {
        this.changeScene = changeScene;

        this.backgroundImage = new Image();
        // this.backgroundImage.src = "./public/images/bg1.jpg";

        // this.ryuImage = new Image();
        // this.ryuImage.src = "./public/images/Ryufullbody.png";

        // this.kenImage = new Image();
        // this.kenImage.src = "./public/images/Ryufullbody.png";

        this.previewImages = {
            [FighterId.RYU]: new Image(),
            [FighterId.KEN]: new Image()
        };

        this.previewImages[FighterId.RYU].src =
            "./public/images/Ryufull.png";

        this.previewImages[FighterId.KEN].src =
            "./public/images/Ryufullbody.png";



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
            for (const box of this.characterBoxes) {

                if (this.inside(x, y, box)) {

                    if (box.id === "COMING") return;

                    let sound =
                        box.id === FighterId.RYU
                            ? this.leftSelectSound
                            : this.rightSelectSound;

                    this.selectCharacter(box.id, sound);
                }
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

    // handlePointerMove = (event) => {

    //     const canvas = document.querySelector("canvas");
    //     const rect = canvas.getBoundingClientRect();

    //     const scaleX = canvas.width / rect.width;
    //     const scaleY = canvas.height / rect.height;

    //     const x = (event.clientX - rect.left) * scaleX;
    //     const y = (event.clientY - rect.top) * scaleY;

    //     const hover =
    //         // this.inside(x, y, this.ryuBox) ||
    //         // this.inside(x, y, this.kenBox) ||
    //         this.inside(x, y, this.randomBox) ||
    //         this.inside(x, y, this.confirmBox);

    //     canvas.style.cursor = hover ? "pointer" : "default";
    // }
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
    

    draw(context) {

        // context.fillStyle = "black";
        // context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.imageSmoothingEnabled = true;
        context.drawImage(
            this.backgroundImage,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );

        context.drawImage(
            this.previewImages[this.selected],
            this.previewBox.x,
            this.previewBox.y,
            this.previewBox.width,
            this.previewBox.height
        );



        context.fillStyle = "white";
        context.font = "20px Arial";

        context.fillText("SELECT FIGHTER", 120, 40);

        // context.drawImage(
        //     this.ryuImage,
        //     10, -15,    // source x, y
        //     150, 150,   // source width, height   
        //     this.ryuBox.x,
        //     this.ryuBox.y,
        //     this.ryuBox.width,
        //     this.ryuBox.height
        // );

        context.strokeStyle = this.selected === FighterId.RYU ? "yellow" : "white";

        // context.strokeRect(
        //     this.ryuBox.x,
        //     this.ryuBox.y,
        //     this.ryuBox.width,
        //     this.ryuBox.height
        // );

        // context.fillText(
        //     "RYU",
        //     this.ryuBox.x + 20,
        //     this.ryuBox.y + this.ryuBox.height + 20
        // );

        

        // context.drawImage(
        //     this.kenImage,
        //     10, -15,
        //     150, 150,
        //     this.kenBox.x,
        //     this.kenBox.y,
        //     this.kenBox.width,
        //     this.kenBox.height
        // );

        context.strokeStyle = this.selected === FighterId.KEN ? "yellow" : "white";

        // context.strokeRect(
        //     this.kenBox.x,
        //     this.kenBox.y,
        //     this.kenBox.width,
        //     this.kenBox.height
        // );

        // context.fillText(
        //     "KEN",
        //     this.kenBox.x + 25,
        //     this.kenBox.y + this.kenBox.height + 20
        // );

        

        for (const box of this.characterBoxes) {

            context.strokeStyle =
                this.selected === box.id ? "yellow" : "white";

            context.strokeRect(
                box.x,
                box.y,
                box.width,
                box.height
            );

            context.fillStyle = "white";
            context.font = "10px Arial";

            if (box.id === FighterId.RYU) {

                context.fillText("RYU", box.x + 5, box.y + 25);

            } else if (box.id === FighterId.KEN) {

                context.fillText("KEN", box.x + 5, box.y + 25);

            } else {

                context.fillText("?", box.x + 15, box.y + 25);

            }
        }



        context.strokeStyle = this.selected === "RANDOM" ? "yellow" : "white";

        context.strokeRect(
            this.randomBox.x,
            this.randomBox.y,
            this.randomBox.width,
            this.randomBox.height
        );

        context.fillText(
            "?",
            this.randomBox.x + 42,
            this.randomBox.y + 25
        );

        context.fillText(
            "RANDOM",
            this.randomBox.x,
            this.randomBox.y + this.randomBox.height + 20
        );

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