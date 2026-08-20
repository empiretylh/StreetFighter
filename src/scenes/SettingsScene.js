// import { MainMenuScene } from "./MainMenuScene.js";
import { playSound } from "../engine/SoundHandler.js";
import { soundSelectIds,soundConfirmId } from "../constants/sounds.js";
// import { GameplaySettings } from "./settings/GameplaySettings.js";
// import { ControlsSettings } from "./settings/ControlsSettings.js";
import { AudioSettings } from "./settings/AudioSettings.js";
// import { VideoSettings } from "./settings/VideoSettings.js";
// import { AccessibilitySettings } from "./settings/AccessibilitySettings.js";
// import { LanguageSettings } from "./settings/LanguageSettings.js";

export class SettingsScene {

    backgroundImg = new Image();
    settingsIcon = new Image();
    roundTimePreviewImg = new Image();

    upSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    downSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);    
    backToPrevSound = document.getElementById(soundConfirmId);

    categories = [
        {
            text: "GAMEPLAY",
            x: 25,
            y: 125,
            width: 255,
            height: 70
        },
        {
            text: "CONTROLS",
            x: 25,
            y: 205,
            width: 255,
            height: 70
        },
        {
            text: "AUDIO",
            x: 25,
            y: 285,
            width: 255,
            height: 70
        },
        {
            text: "VIDEO",
            x: 25,
            y: 365,
            width: 255,
            height: 70
        },
        {
            text: "ACCESSIBILITY",
            x: 25,
            y: 445,
            width: 255,
            height: 70
        },
        {
            text: "LANGUAGE",
            x: 25,
            y: 525,
            width: 255,
            height: 70
        }
    ];

    settingsPanel = {
        x: 315,
        y: 115,
        width: 620,
        height: 465
    };

    infoPanel = {
        x: 945,
        y: 115,
        width: 310,
        height: 465
    };

    backButton = {
        x: 25,
        y: 625,
        width: 405,
        height: 65
    };

    resetButton = {
        x: 440,
        y: 625,
        width: 400,
        height: 65
    };

    applyButton = {
        x: 850,
        y: 625,
        width: 365,
        height: 65
    };

    selectedCategory = 0;
    selectedArea = "categories";
    selectedBottomButton = 0;

    difficultyOptions = [
        "EASY",
        "NORMAL",
        "HARD"
    ];

    settingControls = {

        difficulty: {
            y: 165,
            leftX: 605,
            valueX: 655,
            rightX: 865,
            width: 40,
            valueWidth: 200
        },
        roundTime: {
            y: 250,
            leftX: 605,
            valueX: 655,
            rightX: 865,
            width: 40,
            valueWidth: 200
        },
        vibration: {
            y: 335,
            offX: 685,
            onX: 790,
            width: 100
        },
        damageNumbers: {
            y: 420,
            offX: 685,
            onX: 790,
            width: 100
        },
        buttonLayout: {
            y: 505,
            leftX: 605,
            valueX: 655,
            rightX: 865,
            width: 40,
            valueWidth: 200
        },
        // backgroundMusic: {
        //     y: 200,
        //     leftX: 605,
        //     valueX: 655,
        //     rightX: 865,
        //     width: 40,
        //     valueWidth: 200
        // },
        sfxVolume: {
            y: 300,
            leftX: 605,
            valueX: 655,
            rightX: 865,
            width: 40,
            valueWidth: 200
        },

        muteAll: {
            y: 400,
            offX: 685,
            onX: 790,
            width: 100
        }
    };

    difficultyIndex = 1;

    roundTime = 99;
    minRoundTime = 30;
    maxRoundTime = 99;
    roundTimeInput = null;

    vibration = true;
    damageNumbers = true;

    buttonLayout = "DEFAULT";
    selectedSettingRow = 0;

    backgroundMusicVolume = 100;
    sfxVolume = 100;
    muteAll = false;
    
    audioSettings = new AudioSettings();

    constructor(changeScene, previousScene) {

        this.changeScene = changeScene;
        this.previousScene = previousScene;

        this.backgroundImg.src ="./public/images/bg1.jpg";
        this.settingsIcon.src ="./public/images/menu/settings1.png";
        this.roundTimePreviewImg.src = "./public/images/settings/roundtime.png";

        document.getElementById("mobile-controls").style.display = "none";
        document.getElementById("btn-back").style.display = "none";

        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("pointerdown", this.handlePointerDown);
        window.addEventListener("pointermove", this.handlePointerMove);
    }

    handleKeyDown = (event) => {

        if (this.selectedCategory === 2) {
            this.audioSettings.handleKeyDown(event);
            return;
        }

        switch (event.code) {

            case "Escape":
            case "KeyB":

                this.goBack();
                break;


            case "ArrowUp":

                if (this.selectedArea === "categories") {

                    if (this.selectedCategory > 0) {
                        this.selectedCategory--;
                        playSound(this.upSelectSound);
                    }

                } else {
                    this.selectedArea = "categories";
                    playSound(this.upSelectSound);
                }

                break;

            case "ArrowDown":

                if (this.selectedArea === "categories") {

                    if ( this.selectedCategory < this.categories.length - 1 ) {
                        this.selectedCategory++;
                        playSound(this.downSelectSound);
                    }

                } else {
                    this.selectedArea = "categories";
                    playSound(this.downSelectSound);
                }

                break;

            case "ArrowLeft":

                if (this.selectedArea === "categories") {

                    this.selectedArea = "bottom";
                    this.selectedBottomButton = 0;
                    playSound(this.upSelectSound);

                } else {

                    if (this.selectedBottomButton > 0) {
                        this.selectedBottomButton--;
                        playSound(this.upSelectSound);
                    }
                }

                break;

            case "ArrowRight":

                if (this.selectedArea === "categories") {

                    this.selectedArea = "bottom";
                    this.selectedBottomButton = 0;
                    playSound(this.downSelectSound);

                } else {

                    if ( this.selectedBottomButton < 2 ) {
                        this.selectedBottomButton++;
                        playSound(this.downSelectSound);
                    }
                }

                break;

            case "Enter":

                this.selectCurrent();
                break;
        }

    };

    changeSetting = (direction) => {

        if (this.selectedArea !== "settings") {
            return;
        }

        switch (this.selectedSettingRow) {

            // ======DIFFICULTY======
            case 0:

                this.difficultyIndex += direction;

                if (this.difficultyIndex < 0) {
                    this.difficultyIndex =
                        this.difficultyOptions.length - 1;
                }

                if (
                    this.difficultyIndex >=
                    this.difficultyOptions.length
                ) {
                    this.difficultyIndex = 0;
                }

                break;


            // ======ROUND TIME======
            case 1:
                this.roundTime += direction;

                if (this.roundTime < this.minRoundTime) {
                    this.roundTime = this.minRoundTime;
                }

                if (this.roundTime > this.maxRoundTime) {
                    this.roundTime = this.maxRoundTime;
                }
                break;


            // ======VIBRATION======
            case 2:
                this.vibration = direction > 0;
                break;

            // ======DAMAGE NUMBERS======
            case 3:
                this.damageNumbers = direction > 0;
                break;

            // ======BUTTON LAYOUT======
            case 4:
                this.buttonLayout = "DEFAULT";
                break;
        }
    };

    // changeAudioSetting = (direction) => {

    //     if (this.selectedArea !== "settings") {
    //         return;
    //     }

    //     switch (this.selectedSettingRow) {

    //         // ======BACKGROUND MUSIC======
    //         case 0:

    //             this.backgroundMusicVolume += direction * 5;

    //             this.backgroundMusicVolume = Math.max(
    //                 0,
    //                 Math.min(100, this.backgroundMusicVolume)
    //             );

    //             break;


    //         // ====== SFX VOLUME ======
    //         case 1:

    //             this.sfxVolume += direction * 5;

    //             this.sfxVolume = Math.max(
    //                 0,
    //                 Math.min(100, this.sfxVolume)
    //             );

    //             break;


    //         // ====== MUTE ALL ======
    //         case 2:

    //             this.muteAll = direction > 0;

    //             break;
    //     }
    // };

    selectCurrent = () => {

        if (this.selectedArea === "categories") {

            // console.log(
            //     "Selected category:",
            //     this.categories[this.selectedCategory].text
            // );

            return;
        }


        // Bottom buttons
        switch (this.selectedBottomButton) {

            case 0:
                playSound(this.backToPrevSound);
                this.goBack();
                break;

            case 1:
                console.log("Restore Defaults");
                break;

            case 2:
                console.log("Apply");
                break;
        }
    };

    getSettingControl = (rowIndex) => {

        if (this.selectedCategory === 0) {
            switch (rowIndex) {

                case 0:
                    return this.settingControls.difficulty;

                case 1:
                    return this.settingControls.roundTime;

                case 2:
                    return this.settingControls.vibration;

                case 3:
                    return this.settingControls.damageNumbers;

                case 4:
                    return this.settingControls.buttonLayout;
            }
        }

        if (this.selectedCategory === 2) {

            switch (rowIndex) {

                case 0:
                    return this.settingControls.backgroundMusic;

                case 1:
                    return this.settingControls.sfxVolume;

                case 2:
                    return this.settingControls.muteAll;
            }
        }

        return null;
            
    };

    handlePointerMove = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        if (
            this.selectedCategory === 0 &&
            x >= 500 &&
            x <= 925 &&
            y >= 140 &&
            y <= 530
        ) {

            const rows = [
                165,
                250,
                335,
                420,
                505
            ];

            for (const [index, rowY] of rows.entries()) {

                if (
                    y >= rowY - 25 &&
                    y <= rowY + 25
                ) {

                    this.selectedArea = "settings";
                    this.selectedSettingRow = index;

                    canvas.style.cursor = "pointer";

                    return;
                }
            }
        }

        // =========================
        // CATEGORIES
        // =========================

        for (const [index, category] of this.categories.entries()) {

            if (
                x >= category.x &&
                x <= category.x + category.width &&
                y >= category.y &&
                y <= category.y + category.height
            ) {

                if (
                    this.selectedArea !== "categories" ||
                    this.selectedCategory !== index
                ) {

                    this.selectedArea = "categories";
                    this.selectedCategory = index;
                }

                canvas.style.cursor = "pointer";

                return;
            }
        }


        // =========================
        // BOTTOM BUTTONS
        // =========================

        const buttons = [
            this.backButton,
            this.resetButton,
            this.applyButton
        ];

        for (const [index, button] of buttons.entries()) {

            if (
                x >= button.x &&
                x <= button.x + button.width &&
                y >= button.y &&
                y <= button.y + button.height
            ) {

                this.selectedArea = "bottom";
                this.selectedBottomButton = index;

                canvas.style.cursor = "pointer";

                return;
            }
        }


        canvas.style.cursor = "default";
    };

    handlePointerDown = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        if (this.selectedCategory === 2) {
            // if (this.handleAudioSettingPointer(x, y)) {
            //     return;
            // }
            if (this.audioSettings.handlePointerDown(x, y)) {
                return;
            }
        }

        if (
            this.selectedCategory === 0 &&
            x >= 500 &&
            x <= 925 &&
            y >= 140 &&
            y <= 530
        ) {

            if (this.handleGameplaySettingPointer(x, y)) {
                return;
            }
        }

        // ======CATEGORIES======
        for (const [index, category] of this.categories.entries()) {

            if (
                x >= category.x &&
                x <= category.x + category.width &&
                y >= category.y &&
                y <= category.y + category.height
            ) {

                this.selectedArea = "categories";
                this.selectedCategory = index;

                this.selectCurrent();

                return;
            }
        }


        // =====BOTTOM BUTTONS=====
        const buttons = [
            this.backButton,
            this.resetButton,
            this.applyButton
        ];

        for (const [index, button] of buttons.entries()) {

            if (
                x >= button.x &&
                x <= button.x + button.width &&
                y >= button.y &&
                y <= button.y + button.height
            ) {

                this.selectedArea = "bottom";
                this.selectedBottomButton = index;

                this.selectCurrent();

                return;
            }
        }
    };

    handleGameplaySettingPointer = (x, y) => {

        if (this.selectedCategory !== 0) {
            return false;
        }

        const rows = [
            165,
            250,
            335,
            420,
            505
        ];

        for (const [index, rowY] of rows.entries()) {

            if (
                y >= rowY - 25 &&
                y <= rowY + 25 &&
                x >= 500 &&
                x <= 925
            ) {

                this.selectedArea = "settings";
                this.selectedSettingRow = index;
                const control = this.getSettingControl(index);

                if (!control) {
                    continue;
                }

                if (index === 1) {

                    const valueHitboxPadding = 20;

                    if (x >= control.valueX + valueHitboxPadding && 
                        x <= control.valueX + control.valueWidth - valueHitboxPadding) {
                        this.startRoundTimeInput();
                        return true;
                    }
                }
                
                // ======LEFT Arrow======
                if (
                    x >= control.leftX &&
                    x <= control.leftX + control.width &&
                    y >= rowY - 20 &&
                    y <= rowY + 20
                ) {
                    this.changeSetting(-1);
                    return true;
                }

                // ======RIGHT Arrow======
                const rightHitboxOffset = -40;

                if (
                    x >= control.rightX + rightHitboxOffset &&
                    x <= control.rightX + control.width + rightHitboxOffset &&
                    y >= rowY - 20 &&
                    y <= rowY + 20
                ) {
                    this.changeSetting(1);
                    return true;
                }
                

                // ======ON / OFF======
                if ( index === 2 || index === 3 ) {

                    const control = this.getSettingControl(index);

                    // OFF button
                    if (
                        x >= control.offX &&
                        x <= control.offX + control.width &&
                        y >= rowY - 20 &&
                        y <= rowY + 20
                    ) {
                        this.changeSetting(-1);
                        return true;
                    }

                    // ON button
                    if (
                        x >= control.onX &&
                        x <= control.onX + control.width &&
                        y >= rowY - 20 &&
                        y <= rowY + 20
                    ) {
                        this.changeSetting(1);
                        return true;
                    }

                }

            }
        }

        return false;
    };

    // handleAudioSettingPointer = (x, y) => {

    //     if (this.selectedCategory !== 2) {
    //         return false;
    //     }

    //     const rows = [
    //         200,
    //         300,
    //         400
    //     ];

    //     for (const [index, rowY] of rows.entries()) {

    //         if (
    //             y >= rowY - 25 &&
    //             y <= rowY + 25 &&
    //             x >= 500 &&
    //             x <= 925
    //         ) {

    //             this.selectedArea = "settings";
    //             this.selectedSettingRow = index;

    //             const control = this.getSettingControl(index);

    //             if (!control) {
    //                 continue;
    //             }

    //             // ====== VOLUME VALUE ======

    //             if (index === 0 || index === 1) {

    //                 if (
    //                     x >= control.valueX &&
    //                     x <= control.valueX + control.valueWidth
    //                 ) {
    //                     return true;
    //                 }
    //             }


    //             // ====== LEFT ======

    //             if (
    //                 x >= control.leftX &&
    //                 x <= control.leftX + control.width &&
    //                 y >= rowY - 20 &&
    //                 y <= rowY + 20
    //             ) {

    //                 this.changeAudioSetting(-1);
    //                 return true;
    //             }


    //             // ====== RIGHT ======

    //             if (
    //                 x >= control.rightX - 40 &&
    //                 x <= control.rightX + control.width - 40 &&
    //                 y >= rowY - 20 &&
    //                 y <= rowY + 20
    //             ) {

    //                 this.changeAudioSetting(1);
    //                 return true;
    //             }


    //             // ====== MUTE OFF / ON ======

    //             if (index === 2) {

    //                 if (
    //                     x >= control.offX &&
    //                     x <= control.offX + control.width &&
    //                     y >= rowY - 20 &&
    //                     y <= rowY + 20
    //                 ) {

    //                     this.changeAudioSetting(-1);
    //                     return true;
    //                 }

    //                 if (
    //                     x >= control.onX &&
    //                     x <= control.onX + control.width &&
    //                     y >= rowY - 20 &&
    //                     y <= rowY + 20
    //                 ) {

    //                     this.changeAudioSetting(1);
    //                     return true;
    //                 }
    //             }
    //         }
    //     }

    //     return false;
    // };

    goBack = () => {

        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("pointerdown", this.handlePointerDown);
        window.removeEventListener("pointermove", this.handlePointerMove);

        this.changeScene(this.previousScene.constructor);
    };

    startRoundTimeInput = () => {

        if (this.roundTimeInput) {
            return;
        }

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();

        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;

        const input = document.createElement("input");

        input.type = "number";
        input.min = this.minRoundTime;
        input.max = this.maxRoundTime;
        input.value = this.roundTime;

        input.style.position = "absolute";
        const control = this.settingControls.roundTime;

        // input.style.left =`${rect.left + (655 * scaleX)}px`;
        // input.style.top =`${rect.top + (230 * scaleY)}px`;
        // input.style.width =`${200 * scaleX}px`;
        // input.style.height =`${40 * scaleY}px`;

        input.style.left =`${rect.left + (control.valueX * scaleX)}px`;
        input.style.top =`${rect.top + ((control.y - 20) * scaleY)}px`;
        input.style.width =`${160 * scaleX}px`;
        input.style.height =`${40 * scaleY}px`;

        input.style.boxSizing = "border-box";
        input.style.fontSize =`${18 * scaleY}px`;
        input.style.fontWeight = "bold";
        input.style.textAlign = "center";

        input.style.color = "white";
        input.style.background = "#D4AF37";

        input.style.border = "2px solid #D4AF37";
        input.style.outline = "none";

        document.body.appendChild(input);

        this.roundTimeInput = input;

        input.focus();
        input.select();


        // ======ENTER======
        input.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                let value = parseInt(input.value);

                if (Number.isNaN(value)) {
                    value = this.roundTime;
                }

                value = Math.max(
                    this.minRoundTime,
                    Math.min(this.maxRoundTime, value)
                );

                this.roundTime = value;

                this.finishRoundTimeInput();
            }

            // ======ESCAPE======
            if (event.key === "Escape") {
                this.finishRoundTimeInput();
            }
        });


        input.addEventListener("blur", () => {

            if (this.roundTimeInput) {

                let value = parseInt(input.value);

                if (!Number.isNaN(value)) {

                    value = Math.max(
                        this.minRoundTime,
                        Math.min(this.maxRoundTime, value)
                    );

                    this.roundTime = value;
                }

                this.finishRoundTimeInput();
            }
        });
    };

    finishRoundTimeInput = () => {

        if (!this.roundTimeInput) {
            return;
        }

        this.roundTimeInput.remove();
        this.roundTimeInput = null;
    };

    getCurrentPageText = () => {

        switch (this.selectedCategory) {

            case 0:
                return "GAMEPLAY";

            case 1:
                return "CONTROLS PAGE";

            case 2:
                return "AUDIO PAGE";

            case 3:
                return "VIDEO PAGE";

            case 4:
                return "ACCESSIBILITY PAGE";

            case 5:
                return "LANGUAGE PAGE";

            default:
                return "";
        }
    };

    // =======CATEGORY PANEL=======
    drawCategories = (context) => {

        for (const [index, category] of this.categories.entries()) {

            const selected = this.selectedArea === "categories" && index === this.selectedCategory;

            context.fillStyle = selected ? "#D4AF37" : "rgba(0, 0, 0, 0.85)";

            context.fillRect(
                category.x,
                category.y,
                category.width,
                category.height
            );


            // Border
            context.strokeStyle = selected ? "#D4AF37" : "rgba(255,255,255,0.7)";
            context.lineWidth = selected ? 3 : 2;

            context.strokeRect(
                category.x,
                category.y,
                category.width,
                category.height
            );


            // Text
            context.fillStyle = "white";
            context.font = "bold 20px Arial";

            context.textAlign = "left";
            context.textBaseline = "middle";

            context.fillText(
                category.text,
                category.x + 65,
                category.y + category.height / 2
            );


            // Simple selection arrow
            if (selected) {

                context.font = "bold 28px Arial";
                context.textAlign = "right";

                context.fillText(
                    ">",
                    category.x + category.width - 15,
                    category.y + category.height / 2
                );
            }
        }
    };

    // =======MAIN SETTINGS PANEL=======
    drawSettingsPanel = (context) => {

        //===== Panel =====
        context.fillStyle = "rgba(0, 0, 0, 0.85)";

        context.fillRect(
            this.settingsPanel.x,
            this.settingsPanel.y,
            this.settingsPanel.width,
            this.settingsPanel.height
        );


        //===== Border =====
        context.strokeStyle = "rgba(255,255,255,0.35)";
        context.lineWidth = 2;

        context.strokeRect(
            this.settingsPanel.x,
            this.settingsPanel.y,
            this.settingsPanel.width,
            this.settingsPanel.height
        );

        // =====GAMEPLAY PAGE======
        if (this.selectedCategory === 0) {
            this.drawGameplayPage(context);
            return;
        }
        // =====AUDIO PAGE======
        if (this.selectedCategory === 2) {
            // this.drawAudioPage(context);
            this.audioSettings.draw(context);
            return;
        }
        // =====OTHER PAGES======
        this.drawSimplePage(
            context,
            this.getCurrentPageText()
        );

    };

    drawGameplayPage = (context) =>{

        // DIFFICULTY
        this.drawSettingRow(
            context,
            "DIFFICULTY",
            165,
            this.difficultyOptions[this.difficultyIndex],
            0
        );


        // ROUND TIME
        this.drawSettingRow(
            context,
            "ROUND TIME",
            250,
            this.roundTime,
            1
        );


        // VIBRATION
        this.drawSettingRow(
            context,
            "VIBRATION",
            335,
            this.vibration ? "ON" : "OFF",
            2
        );


        // DAMAGE NUMBERS
        this.drawSettingRow(
            context,
            "DAMAGE NUMBERS",
            420,
            this.damageNumbers ? "ON" : "OFF",
            3
        );


        // BUTTON LAYOUT
        this.drawSettingRow(
            context,
            "BUTTON LAYOUT",
            505,
            this.buttonLayout,
            4
        );
    };

    drawAudioPage = (context) => {

        // BACKGROUND MUSIC
        this.drawSettingRow(
            context,
            "BACKGROUND MUSIC",
            200,
            this.backgroundMusicVolume,
            0
        );


        // SFX VOLUME
        this.drawSettingRow(
            context,
            "SFX VOLUME",
            300,
            this.sfxVolume,
            1
        );


        // MUTE ALL
        this.drawSettingRow(
            context,
            "MUTE ALL",
            400,
            this.muteAll ? "ON" : "OFF",
            2
        );
    };

    drawSimplePage = (context, text) => {

        context.fillStyle = "white";
        context.font = "bold 32px Arial";

        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            text,
            this.settingsPanel.x + this.settingsPanel.width / 2,
            this.settingsPanel.y + this.settingsPanel.height / 2
        );
    };

    
    // =======SETTING ROW=======
    drawSettingRow = (context, title, y, value, rowIndex) => {

        const selected = this.selectedArea === "settings" && this.selectedSettingRow === rowIndex;
        const control = this.getSettingControl(rowIndex);

        //===== SETTINGS NAME =====
        context.fillStyle = "white";
        context.font = "bold 18px Arial";

        context.textAlign = "left";
        context.textBaseline = "middle";

        context.fillText(
            title,
            345,
            y
        );


        // =======VIBRATION / DAMAGE=======
        if (rowIndex === 2 || rowIndex === 3) {

            const control = this.getSettingControl(rowIndex);

            // OFF
            context.fillStyle = value === "OFF" ? "#D4AF37" : "rgba(0,0,0,0.8)";
            context.fillRect(
                control.offX,
                y - 20,
                control.width,
                40
            );

            context.strokeStyle = value === "OFF" ? "#D4AF37" : "rgba(255,255,255,0.5)";
            context.lineWidth = selected ? 3 : 1;

            context.strokeRect(
                control.offX,
                y - 20,
                control.width,
                40
            );


            // ON
            context.fillStyle = value === "ON" ? "#D4AF37" : "rgba(0,0,0,0.8)";
            context.fillRect(
                control.onX,
                y - 20,
                control.width,
                40
            );

            context.strokeStyle = value === "ON" ? "#D4AF37" : "rgba(255,255,255,0.5)";
            context.strokeRect(
                control.onX,
                y - 20,
                control.width,
                40
            );


            context.fillStyle = "white";
            context.font = "bold 16px Arial";
            context.textAlign = "center";

            context.fillText(
                "OFF",
                control.offX + control.width / 2,
                y
            );

            context.fillText(
                "ON",
                control.onX + control.width / 2,
                y
            );

            return;
        }


        // Left arrow
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(
            control.leftX,
            y - 20,
            control.width,
            40
        );

        context.strokeStyle = selected ? "#D4AF37" : "rgba(255,255,255,0.5)";
        context.lineWidth = selected ? 2 : 1;
        context.strokeRect(
            control.leftX,
            y - 20,
            control.width,
            40
        );

        context.fillStyle = "white";
        context.font = "bold 24px Arial";
        context.textAlign = "center";

        context.fillText(
            "<",
            control.leftX + control.width / 2,
            y
        );


        // Current value
        context.fillStyle = selected ? "#D4AF37" : "rgba(0,0,0,0.8)";

        context.fillRect(
            control.valueX,
            y - 20,
            control.valueWidth,
            40
        );

        context.strokeStyle = selected ? "#D4AF37" : "rgba(255,255,255,0.5)";
        context.lineWidth = 2;
        context.strokeRect(
            control.valueX,
            y - 20,
            control.valueWidth,
            40
        );

        context.fillStyle = "white";
        context.font = "bold 18px Arial";

        context.fillText(
            value,
            control.valueX + control.valueWidth / 2,
            y
        );


        // Right arrow
        context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillRect(
            control.rightX,
            y - 20,
            control.width,
            40
        );

        context.strokeStyle = selected ? "#D4AF37" : "rgba(255,255,255,0.5)";

        context.strokeRect(
            control.rightX,
            y - 20,
            control.width,
            40
        );

        context.fillStyle = "white";
        context.font = "bold 24px Arial";

        context.fillText(
            ">",
            control.rightX + control.width / 2,
            y
        );
    };


    // =======RIGHT INFO PANEL=======
    drawInfoPanel = (context) => {

        context.fillStyle = "rgba(0, 0, 0, 0.85)";

        context.fillRect(
            this.infoPanel.x,
            this.infoPanel.y,
            this.infoPanel.width,
            this.infoPanel.height
        );

        if (this.selectedCategory !== 0) {

            context.fillStyle = "#5fdcff";
            context.font = "bold 20px Arial";

            context.textAlign = "left";
            context.textBaseline = "alphabetic";

            context.fillText(
                this.getCurrentPageText(),
                this.infoPanel.x + 30,
                this.infoPanel.y + 50
            );

            return;
        }

        context.strokeStyle = "rgba(255,255,255,0.35)";
        context.lineWidth = 2;

        context.strokeRect(
            this.infoPanel.x,
            this.infoPanel.y,
            this.infoPanel.width,
            this.infoPanel.height
        );


        // Title
        context.fillStyle = "#5fdcff";
        context.font = "bold 20px Arial";

        context.textAlign = "left";
        context.textBaseline = "alphabetic";

        context.fillText(
            "ROUND TIME",
            965,
            165
        );


        // Description

        context.fillStyle = "white";
        context.font = "15px Arial";

        context.fillText(
            "Set the duration of each round.",
            965,
            195
        );

        context.fillText(
            "Higher values allow more time",
            965,
            220
        );

        context.fillText(
            "for comebacks and extended",
            965,
            245
        );

        context.fillText(
            "strategies.",
            965,
            270
        );


        // =========PREVIEW BOX=========
        context.fillStyle = "rgba(0,0,0,0.7)";

        context.fillRect(
            955,
            290,
            270,
            195
        );

        context.drawImage(
            this.roundTimePreviewImg,
            970,
            290,
            270,
            195
        );

        context.strokeStyle = "rgba(255,255,255,0.3)";
        context.lineWidth = 1;
        context.strokeRect(
            965,
            290,
            270,
            195
        );


        context.fillStyle = "#5fdcff";
        context.font = "bold 15px Arial";

        context.textAlign = "left";

        context.fillText(
            "TIP:",
            965,
            525
        );

        context.fillStyle = "white";
        context.font = "14px Arial";

        context.fillText(
            "Longer round times reward",
            1000,
            525
        );

        context.fillText(
            "defensive play and resource",
            1000,
            545
        );

        context.fillText(
            "management.",
            1000,
            565
        );
    };


    // =======BOTTOM BUTTONS=======
    drawBottomButtons = (context) => {

        const buttons = [
            {
                ...this.backButton,
                text: "BACK"
            },
            {
                ...this.resetButton,
                text: "RESTORE DEFAULTS"
            },
            {
                ...this.applyButton,
                text: "APPLY"
            }
        ];


        for (const [index, button] of buttons.entries()) {

            // const selected = index === 2;
            const selected = this.selectedArea === "bottom" && index === this.selectedBottomButton;

            context.fillStyle = selected
                ? "#D4AF37"
                : "rgba(0,0,0,0.9)";

            context.fillRect(
                button.x,
                button.y,
                button.width,
                button.height
            );


            context.strokeStyle = selected
                ? "#D4AF37"
                : "rgba(255,255,255,0.5)";

            context.lineWidth = 2;

            context.strokeRect(
                button.x,
                button.y,
                button.width,
                button.height
            );


            context.fillStyle = "white";
            context.font = "bold 18px Arial";

            context.textAlign = "center";
            context.textBaseline = "middle";

            context.fillText(
                button.text,
                button.x + button.width / 2,
                button.y + button.height / 2
            );
        }
    };


    // =======TITLE=======
    drawTitle = (context) => {

        context.fillStyle = "white";
        context.font = "bold italic 54px Arial";

        context.textAlign = "left";
        context.textBaseline = "alphabetic";

        context.fillText(
            "SETTINGS",
            50,
            78
        );
    };

    update(time) {

    }

    // =======MAIN DRAW=======
    draw(context) {

        // Background

        context.drawImage(
            this.backgroundImg,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        this.drawTitle(context);
        this.drawCategories(context);
        this.drawSettingsPanel(context);
        this.drawInfoPanel(context);
        this.drawBottomButtons(context);

        context.textAlign = "left";
        context.textBaseline = "alphabetic";
    }
}