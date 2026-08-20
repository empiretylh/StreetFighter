import { CharacterSelectScene } from "./CharacterSelectScene.js";
import { playSound } from "../engine/SoundHandler.js";
import { soundSelectIds,soundConfirmId } from "../constants/sounds.js";
import { SettingsScene } from "./SettingsScene.js";

export class MainMenuScene {

    logoImg = document.getElementById('Logo');
    confirmSelectSound = document.getElementById(soundConfirmId);
    leftSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    rightSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);


    buttons = [
        {
            text: "PLAY",
            x: 490,
            y: 550,
            width: 300,
            height: 100
        },
        {
            text: "LEADERBOARD",
            x: 50,
            y: 300,
            width: 280,
            height: 65
        },
        {
            text: "SETTINGS",
            x: 50,
            y: 370,
            width: 280,
            height: 65
        },
        {
            text: "EXIT",
            x: 50,
            y: 440,
            width: 280,
            height: 65
        }
    ];


    arrowVisible = true;
    arrowTimer = 0;
    selected = 0;
    logoAlpha = 0;
    logoFadeSpeed = 0.009;
    logoFadeDirection = 1;

    buttonExpand = 0;
    arrowOffset = 0;
    arrowDirection = 1;

    backgroundImg = new Image();
    profileImg = new Image();
    leaderboardIcon = new Image();
    settingsIcon = new Image();
    exitIcon = new Image();
    goldCoinImg = new Image();
    diamondImg = new Image();

    profilePanel = {
        x: 890,
        y: 25,
        width: 365,
        height: 80
    };

    profileAvatar = {
        x: 905,
        y: 35,
        size: 60
    };

    profileName = "User";
    profileRank = "Rookie";

    goldCoins = 1250;
    diamonds = 85;

    plusButton = {
        x: 1205,
        y: 48,
        width: 35,
        height: 35
    };

    constructor(changeScene) {  
        this.changeScene = changeScene;
        this.backgroundImg.src = "./public/images/bg1.jpg";
        this.profileImg.src = "./public/images/profile.png";

        this.leaderboardIcon.src = "./public/images/menu/trophy.png";
        this.settingsIcon.src = "./public/images/menu/settings1.png";
        this.exitIcon.src = "./public/images/menu/exit.png";

        this.goldCoinImg.src = "./public/images/menu/coin.png";
        this.diamondImg.src = "./public/images/menu/diamond.png";

        document.getElementById("mobile-controls").style.display = "none";
        document.getElementById("btn-back").style.display = "none";
        
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("pointerdown", this.handlePointerDown);
        window.addEventListener("pointermove", this.handlePointerMove);
    }

    handleKeyDown = (event) => {

        switch (event.code) {

            case "ArrowUp":

                if (this.selected === 2) {
                    this.selected = 1;
                    playSound(this.leftSelectSound);
                }
                else if (this.selected === 3) {
                    this.selected = 2;
                    playSound(this.leftSelectSound);
                }

                break;


            case "ArrowDown":

                if (this.selected === 1) {
                    this.selected = 2;
                    playSound(this.rightSelectSound);
                }
                else if (this.selected === 2) {
                    this.selected = 3;
                    playSound(this.rightSelectSound);
                }

                break;


            case "ArrowRight":

                if (this.selected !== 0) {
                    this.selected = 0;
                    playSound(this.rightSelectSound);
                }

                break;


            case "ArrowLeft":

                if (this.selected === 0) {
                    this.selected = 1;
                    playSound(this.leftSelectSound);
                }

                break;


            case "Enter":

                this.selectButton();
                break;
        }
    };

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
                window.removeEventListener("keydown", this.handleKeyDown);
                window.removeEventListener("pointerdown", this.handlePointerDown);
                window.removeEventListener("pointermove", this.handlePointerMove);

                playSound(this.confirmSelectSound);
                this.changeScene(SettingsScene);
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

        // if (time.previous > this.arrowTimer) {
        //     this.arrowVisible = !this.arrowVisible;
        //     this.arrowTimer = time.previous + 300;
        // }

        //======= LOGO ANIMATION =======
        this.logoAlpha += this.logoFadeSpeed * this.logoFadeDirection;

        if (this.logoAlpha >= 1) {
            this.logoAlpha = 1;
            this.logoFadeDirection = -1;
        }

        if (this.logoAlpha <= 0) {
            this.logoAlpha = 0;
            this.logoFadeDirection = 1;
        }

        //======= BUTTON EXPAND ANIMATION =======
        const targetExpand = this.selected === 0 ? 0 : 20;
        this.buttonExpand += (targetExpand - this.buttonExpand) * 0.15;

        //======= ARROW ANIMATION =======
        // this.arrowOffset += 0.5 * this.arrowDirection;

        if (this.arrowOffset >= 5) {
            this.arrowOffset = 5;
            this.arrowDirection = -1;
        }

        if (this.arrowOffset <= 0) {
            this.arrowOffset = 0;
            this.arrowDirection = 1;
        }
    }



    drawProfile = (context) => {

        //======= PROFILE PANEL =======

        context.fillStyle = "rgba(0, 0, 0, 1)";

        context.fillRect(
            this.profilePanel.x,
            this.profilePanel.y,
            this.profilePanel.width,
            this.profilePanel.height
        );

        context.strokeStyle = "rgba(255,255,255,0.4)";
        context.lineWidth = 2;

        context.strokeRect(
            this.profilePanel.x,
            this.profilePanel.y,
            this.profilePanel.width,
            this.profilePanel.height
        );


        //======= PROFILE AVATAR =======

        context.drawImage(
            this.profileImg,
            this.profileAvatar.x,
            this.profileAvatar.y,
            this.profileAvatar.size,
            this.profileAvatar.size
        );

        context.strokeStyle = "#FFD700";
        context.lineWidth = 2;

        context.strokeRect(
            this.profileAvatar.x,
            this.profileAvatar.y,
            this.profileAvatar.size,
            this.profileAvatar.size
        );


        //======= NAME =======

        context.fillStyle = "white";
        context.font = "bold 18px Arial";
        context.textAlign = "left";
        context.textBaseline = "alphabetic";

        context.fillText(
            this.profileName,
            980,
            57
        );


        //======= RANK =======

        context.fillStyle = "#aaaaaa";
        context.font = "14px Arial";

        context.fillText(
            this.profileRank,
            980,
            78
        );


        //======= GOLD COINS & DIAMONDS =======

        context.drawImage(
            this.goldCoinImg,
            1065,
            43,
            20,
            20
        );

        context.drawImage(
            this.diamondImg,
            1065,
            66,
            20,
            20
        );

        context.fillStyle = "white";
        context.font = "bold 20px Arial";

        context.fillText(this.goldCoins, 1090, 60);
        context.fillText(this.diamonds, 1090, 84);


        //======= PLUS BUTTON =======

        context.fillStyle = "rgba(255,255,255,0.08)";

        context.fillRect(
            this.plusButton.x,
            this.plusButton.y,
            this.plusButton.width,
            this.plusButton.height
        );

        context.strokeStyle = "gold";
        context.lineWidth = 2;

        context.strokeRect(
            this.plusButton.x,
            this.plusButton.y,
            this.plusButton.width,
            this.plusButton.height
        );

        context.fillStyle = "gold";
        context.font = "bold 24px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "+",
            this.plusButton.x + this.plusButton.width / 2,
            this.plusButton.y + this.plusButton.height / 2
        );
    };

    drawLogo = (context) => {
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
    };

    drawButtons = (context) => {

        for (const [index, button] of this.buttons.entries()) {

            const isSelected = index === this.selected;
            const isPlay = index === 0;

             //======= BUTTON SIZE =======
            const extraWidth = isPlay ? 0 : (isSelected ? this.buttonExpand : 0);
            const buttonWidth = button.width + extraWidth;


            //======= BUTTON BACKGROUND =======
            context.fillStyle = isSelected ? "#D4AF37" : "rgba(0, 0, 0, 1)";

            context.fillRect(
                button.x,
                button.y,
                buttonWidth,
                button.height
            );


            //======= BUTTON BORDER =======
            context.strokeStyle = isSelected ? "#D4AF37" : "white";
            context.lineWidth = isSelected ? 3 : 2;

            context.strokeRect(
                button.x,
                button.y,
                buttonWidth,
                button.height
            );


            //======= BUTTON TEXT =======

            context.font = isPlay ? "bold 42px Arial" : "bold 22px Arial";
            context.fillStyle = "white";

            context.textAlign = "center";
            context.textBaseline = "middle";

            const textX = isPlay
                ? button.x + buttonWidth  / 2
                : button.x + buttonWidth  / 2 + 15;

            context.fillText(
                button.text,
                textX,
                button.y + button.height / 2
            );


            //======= BUTTON ICON =======

            if (index !== 0) {

                let icon;

                if (index === 1) {
                    icon = this.leaderboardIcon;
                }
                else if (index === 2) {
                    icon = this.settingsIcon;
                }
                else if (index === 3) {
                    icon = this.exitIcon;
                }

                context.filter = "brightness(0) invert(1)";

                context.drawImage(
                    icon,
                    button.x + 20,
                    button.y + button.height / 2 - 20,
                    40,
                    40
                );

                context.filter = "none";
            }
             
            //======= SELECT ARROW =======
            if (isSelected && !isPlay) {

                context.fillStyle = "white";
                context.font = "bold 28px Arial";

                context.textAlign = "center";
                context.textBaseline = "middle";

                context.fillText(
                    ">",
                    button.x + buttonWidth - 15 + this.arrowOffset,
                    button.y + button.height / 2
                );
            }
            
        }
    };

    draw(context) {
        
        // context.fillStyle = "black";
        // context.fillRect( 0, 0, context.canvas.width, context.canvas.height );
        context.drawImage(
            this.backgroundImg,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );

        this.drawProfile(context);
        this.drawLogo(context);
        this.drawButtons(context);

        context.textAlign = "left";
        context.textBaseline = "alphabetic";

    }

}