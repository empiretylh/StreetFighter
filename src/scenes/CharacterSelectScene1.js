import { MainMenuScene } from "./MainMenuScene.js";
import { FighterId } from "../constants/fighter.js";
import { gameState } from "../states/gameState.js";
import { MapSelectionScene } from "./MapSelectionScene.js";

import { playSound } from "../engine/SoundHandler.js";
import { soundSelectIds,soundConfirmId } from "../constants/sounds.js";

export class CharacterSelectScene1 {

    arrowVisible = true;
    arrowTimer = 0;
    leftSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    rightSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);    
    randomSelectSound = document.getElementById(soundSelectIds.RANDOMCHAR);
    confirmSelectSound = document.getElementById(soundConfirmId);
    backgroundImage = new Image();


    selectedCharacter = FighterId.RYU;
    selectedGridIndex = 0;
    scrollOffset = 0;


    // =========================
    // HERO DECK
    // =========================
    heroDeck = [
        {
            unlocked: true,
            character: null
        },
        {
            unlocked: true,
            character: null
        },
        {
            unlocked: true,
            character: null
        },
        {
            unlocked: false,
            character: null
        },
        {
            unlocked: false,
            character: null
        }
    ];


    // =========================
    // LAYOUT
    // =========================
    deckBox = {
        x: 300,
        y: 100,
        width: 680,
        height: 110
    };

    previewBox = {
        x: 40,
        y: 230,
        width: 450,
        height: 470
    };

    characterGrid = {
        x: 540,
        y: 200,
        width: 700,
        height: 370
    };
    gridColumns = 4;

    characterBoxSize = 145;
    characterBoxGap = 10;

    scrollOffset = 0;
    scrollStep = 40;


    messageBox = {
        visible: false,
        message: "",
        duration: 2000,
        expiresAt: 0
    };

    buySlotBox = {
        visible: false,
        slotIndex: -1,
        price: 500
    };



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
        },

        [FighterId.NEWCHAR7]: {
            name: "NEWCHAR7",
            power: 90,
            speed: 70,
            toughness: 80
        },

        [FighterId.NEWCHAR8]: {
            name: "NEWCHAR8",
            power: 65,
            speed: 95,
            toughness: 65
        },

        [FighterId.NEWCHAR9]: {
            name: "NEWCHAR9",
            power: 80,
            speed: 70,
            toughness: 90
        },

        [FighterId.NEWCHAR10]: {
            name: "NEWCHAR10",
            power: 70,
            speed: 95,
            toughness: 65
        }
    };


    randomBox = {
        x: 540,
        y: 630,
        width: 230,
        height: 65
    };

    selectBox = {
        x: 790,
        y: 630,
        width: 230,
        height: 65
    };

    battleBox = {
        x: 1040,
        y: 630,
        width: 230,
        height: 65
    };

    characters = [
        FighterId.RYU,
        FighterId.KEN,
        FighterId.NEWCHAR1,
        FighterId.NEWCHAR2,
        FighterId.NEWCHAR3,
        FighterId.NEWCHAR4,
        FighterId.NEWCHAR5,
        FighterId.NEWCHAR6,

        FighterId.NEWCHAR7,
        FighterId.NEWCHAR8,
        FighterId.NEWCHAR9,
        FighterId.NEWCHAR10
    ];

    characterBoxes = [];
    
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
            [FighterId.NEWCHAR6]: new Image(),

            [FighterId.NEWCHAR7]: new Image(),
            [FighterId.NEWCHAR8]: new Image(),
            [FighterId.NEWCHAR9]: new Image(),
            [FighterId.NEWCHAR10]: new Image(),
            
        };

        this.faceImages[FighterId.RYU].src ="./public/images/Ryuface.png";
        this.faceImages[FighterId.KEN].src ="./public/images/Kenface.png";

        // Temp images
        this.faceImages[FighterId.NEWCHAR1].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR2].src = "./public/images/Kenface.png";
        this.faceImages[FighterId.NEWCHAR3].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR4].src = "./public/images/Kenface.png";
        this.faceImages[FighterId.NEWCHAR5].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR6].src = "./public/images/Kenface.png";

        this.faceImages[FighterId.NEWCHAR7].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR8].src = "./public/images/Kenface.png";
        this.faceImages[FighterId.NEWCHAR9].src = "./public/images/Ryuface.png";
        this.faceImages[FighterId.NEWCHAR10].src = "./public/images/Kenface.png";

        this.characterBoxes = this.createCharacterBoxes();

        window.addEventListener("pointerdown", this.handlePointerDown);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("pointermove", this.handlePointerMove);
        window.addEventListener("wheel", this.handleWheel, {passive: false});
        
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

    showMessage = (message, duration = 2000) => {
        this.messageBox.visible = true;
        this.messageBox.message = message;
        this.messageBox.expiresAt = performance.now() + duration;
    };

    showBuySlotBox = (slotIndex, price = 500) => {
        this.buySlotBox.visible = true;
        this.buySlotBox.slotIndex = slotIndex;
        this.buySlotBox.price = price;
    };

    hideBuySlotBox = () => {
        this.buySlotBox.visible = false;
        this.buySlotBox.slotIndex = -1;
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
        window.removeEventListener("wheel",this.handleWheel);
    };

    getCharacterScrollbarBoxes = () => {

        const totalRows = Math.ceil(
            this.characters.length / this.gridColumns
        );

        const rowHeight =
            this.characterBoxSize +
            this.characterBoxGap;

        const visibleRows = Math.floor(
            (this.characterGrid.height - 30) /
            rowHeight
        );

        if (totalRows <= visibleRows) {
            return null;
        }

        const trackWidth = 8;

        const trackX =
            this.characterGrid.x +
            this.characterGrid.width -
            18;

        const trackY =
            this.characterGrid.y + 15;

        const trackHeight =
            this.characterGrid.height - 30;

        // Bigger clickable areas
        const arrowSize = 40;

        return {
            up: {
                x: trackX - 16,
                y: trackY - 25,
                width: arrowSize,
                height: arrowSize
            },

            down: {
                x: trackX - 16,
                y: trackY + trackHeight - 15,
                width: arrowSize,
                height: arrowSize
            }
        };
    };

    scrollCharacterGrid = (direction) => {

        const totalRows = Math.ceil(
            this.characters.length / this.gridColumns
        );

        const contentHeight =
            totalRows *
            (this.characterBoxSize + this.characterBoxGap);

        const maxScroll = Math.max(
            0,
            contentHeight -
            this.characterGrid.height +
            20
        );

        this.scrollOffset +=
            direction === "up"
                ? -this.scrollStep
                : this.scrollStep;

        this.scrollOffset = Math.max(
            0,
            Math.min(this.scrollOffset, maxScroll)
        );
    };
    


    selectCurrentCharacter = () => {

        // Check whether this character is actually available
        const availableFighters = [
            FighterId.RYU,
            FighterId.KEN
        ];

        if (!availableFighters.includes(this.selectedCharacter)) {
            // alert(
            //     `${this.characterStats[this.selectedCharacter]?.name ?? this.selectedCharacter} is not available yet!`
            // );
            this.showMessage(
                `${this.characterStats[this.selectedCharacter]?.name ?? this.selectedCharacter} is not available yet!`
            );
            return;
        }

        // Find first empty unlocked slot
        const emptySlot = this.heroDeck.find(
            slot => slot.unlocked && slot.character === null
        );

        // if (!emptySlot) {
        //     alert("Hero Deck is full!");
        //     return;
        // }
        if (!emptySlot) {
            this.showMessage("Hero Deck is full!");
            return;
        }

        // Add character to deck
        emptySlot.character = this.selectedCharacter;
        playSound(this.confirmSelectSound);
        console.log("Hero Deck:", this.heroDeck);
    };

    selectRandomCharacter = () => {

        const availableFighters = [
            FighterId.RYU,
            FighterId.KEN
        ];

        const randomIndex = Math.floor(
            Math.random() * availableFighters.length
        );

        this.selectedCharacter = availableFighters[randomIndex];
        this.selectedGridIndex = this.characters.indexOf(this.selectedCharacter);
        this.selected = this.selectedCharacter;
        playSound(this.randomSelectSound);
    };

    battle = () => {

        const selectedCharacters = this.heroDeck
            .filter(slot => slot.unlocked && slot.character !== null)
            .map(slot => slot.character);

        // if (selectedCharacters.length === 0) {
        //     alert("Select at least one fighter!");
        //     return;
        // }
        if (selectedCharacters.length === 0) {
            this.showMessage("Select at least one fighter!");
            return;
        }

        console.log("Starting battle with deck:", selectedCharacters);

        // ==========================================
        // SAVE HERO DECK FOR BATTLE SCENE
        // ==========================================
        gameState.heroDeck = this.heroDeck.map(slot => ({
            unlocked: slot.unlocked,
            character: slot.character
        }));

        playSound(this.confirmSelectSound);

        this.removeEventListeners();
        this.backButton.style.display = "none";
        this.changeScene(MapSelectionScene);
    };

    goBackToMainMenu = () => {

        this.removeEventListeners();

        playSound(this.confirmSelectSound);
        this.backButton.style.display = "none";
        this.changeScene(MainMenuScene);

    }

    handleKeyDown = (event) => {

        switch (event.code) {

            case "ArrowLeft":

                if (
                    this.selectedGridIndex %
                    this.gridColumns !== 0
                ) {

                    this.selectedGridIndex--;

                    this.updateSelectedCharacter(
                        this.leftSelectSound
                    );
                }

                break;


            case "ArrowRight":

                if (
                    this.selectedGridIndex %
                        this.gridColumns !==
                    this.gridColumns - 1 &&

                    this.selectedGridIndex + 1 <
                        this.characters.length
                ) {

                    this.selectedGridIndex++;

                    this.updateSelectedCharacter(
                        this.rightSelectSound
                    );
                }

                break;


            case "ArrowUp":

                if (
                    this.selectedGridIndex >=
                    this.gridColumns
                ) {

                    this.selectedGridIndex -=
                        this.gridColumns;

                    this.updateSelectedCharacter(
                        this.leftSelectSound
                    );
                }

                break;


            case "ArrowDown":

                if (
                    this.selectedGridIndex +
                        this.gridColumns <
                    this.characters.length
                ) {

                    this.selectedGridIndex +=
                        this.gridColumns;

                    this.updateSelectedCharacter(
                        this.rightSelectSound
                    );
                }

                break;


            case "Enter":

                this.selectCurrentCharacter();

                break;


            case "Escape":
            case "Backspace":

                this.goBackToMainMenu();

                break;
        }
    };

    handleWheel = (event) => {

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

        const x =
            (event.clientX - rect.left - offsetX) /
            scale;

        const y =
            (event.clientY - rect.top - offsetY) /
            scale;

    
        if (!this.inside(x, y, this.characterGrid)) {
            return;
        }

        event.preventDefault();

        const totalRows = Math.ceil(
            this.characters.length / this.gridColumns
        );

        const contentHeight =
            totalRows *
            (this.characterBoxSize + this.characterBoxGap);

        const maxScroll = Math.max(
            0,
            contentHeight - this.characterGrid.height + 20
        );

        this.scrollCharacterGrid(
            event.deltaY > 0 ? "down" : "up"
        );
    };

    updateSelectedCharacter = (sound) => {

        this.selectedCharacter = this.characters[this.selectedGridIndex];
        this.selected = this.selectedCharacter;
        this.ensureSelectedCharacterVisible();

        if (sound) {
            playSound(sound);
        }
    };

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

        // =========================
        // BUY SLOT BOX
        // =========================
        if (this.buySlotBox.visible) {

            const buttons = this.getBuySlotButtons();

            // BUY
            if (this.inside(x, y, buttons.buy)) {
                this.showMessage("Buy feature coming soon!");
                this.hideBuySlotBox();
                return;
            }

            // CANCEL
            if (this.inside(x, y, buttons.cancel)) {
                this.hideBuySlotBox();
                return;
            }

            // Click outside the box
            if (!this.inside(x, y, buttons.box)) {
                this.hideBuySlotBox();
                return;
            }

            return;
        }

        // =========================
        // MESSAGE BOX
        // =========================
        if (this.messageBox.visible) {

            const messageWidth = 520;
            const messageHeight = 150;

            const messageX = (canvas.width - messageWidth) / 2;
            const messageY = (canvas.height - messageHeight) / 2;

            const messageBox = {
                x: messageX,
                y: messageY,
                width: messageWidth,
                height: messageHeight
            };

            // Only dismiss when clicking OUTSIDE
            if (!this.inside(x, y, messageBox)) {
                this.messageBox.visible = false;
            }

            return;
        }

        // =========================
        // SCROLLBAR ARROWS
        // =========================
        const scrollbarBoxes = this.getCharacterScrollbarBoxes();

        if (scrollbarBoxes) {

            if (this.inside(x, y, scrollbarBoxes.up)) {
                this.scrollCharacterGrid("up");
                return;
            }

            if (this.inside(x, y, scrollbarBoxes.down)) {
                this.scrollCharacterGrid("down");
                return;
            }
        }

        // =========================
        // HERO DECK CLICK
        // =========================
        for (let i = 0; i < this.heroDeck.length; i++) {

            const slotBox = this.getHeroDeckSlotBox(i, canvas);

            if (!this.inside(x, y, slotBox)) {
                continue;
            }

            const slot = this.heroDeck[i];

            if (!slot.unlocked) {
                this.showBuySlotBox(i, 500);
                return;
            }

            if (slot.character !== null) {
                this.removeHeroFromDeck(i);
            }

            return;
        }


        for (const box of this.characterBoxes) {

            const drawY = box.y - this.scrollOffset;

            if (!this.inside(x, y, this.characterGrid)) {
                continue;
            }

            const visualBox = {
                x: box.x,
                y: drawY,
                width: box.width,
                height: box.height
            };

            if (!this.inside(x, y, visualBox)) {
                continue;
            }

            const sound = box.id === FighterId.RYU
            ? this.leftSelectSound : this.rightSelectSound;

            this.selectedGridIndex = this.characters.indexOf(box.id);

            this.selectedCharacter = box.id;
            this.selected = box.id;

            playSound(sound);
            return;
        }

        
        if (this.inside(x, y, this.randomBox)) {
            this.selectRandomCharacter();
            return;
        }

        if (this.inside(x, y, this.selectBox)) {
            this.selectCurrentCharacter();
            return;
        }

        if (this.inside(x, y, this.battleBox)) {
            this.battle();
            return;
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


        const characterHover =
        this.characterBoxes.some(box => {

            if (!this.inside(x, y, this.characterGrid)) {
                return false;
            }

            const drawY = box.y - this.scrollOffset;

            const visualBox = {
                x: box.x,
                y: drawY,
                width: box.width,
                height: box.height
            };

            return this.inside(x, y, visualBox);
        });

        const hover =
            characterHover ||
            this.inside(x, y, this.randomBox) ||
            this.inside(x, y, this.selectBox) ||
            this.inside(x, y, this.battleBox);

        canvas.style.cursor = hover ? "pointer" : "default";

    }

    ensureSelectedCharacterVisible = () => {

        const box = this.characterBoxes[
            this.selectedGridIndex
        ];

        if (!box) return;

        const top = box.y - this.scrollOffset;
        const bottom = top + box.height;

        const gridTop = this.characterGrid.y;
        const gridBottom =
            this.characterGrid.y +
            this.characterGrid.height;

        if (top < gridTop) {

            this.scrollOffset -=
                gridTop - top;

        } else if (bottom > gridBottom) {

            this.scrollOffset +=
                bottom - gridBottom;
        }

        const totalRows = Math.ceil(
            this.characters.length /
            this.gridColumns
        );

        const contentHeight =
            totalRows *
            (this.characterBoxSize +
            this.characterBoxGap);

        const maxScroll = Math.max(
            0,
            contentHeight -
            this.characterGrid.height +
            20
        );

        this.scrollOffset = Math.max(
            0,
            Math.min(
                this.scrollOffset,
                maxScroll
            )
        );
    };

    removeHeroFromDeck = (index) => {

        const slot = this.heroDeck[index];

        // Nothing to remove
        if (!slot || slot.character === null) {
            return;
        }

        console.log(
            "Removing hero:",
            this.characterStats[slot.character]?.name
        );

        // Get currently selected heroes
        const selectedCharacters = this.heroDeck
            .filter(slot => slot.unlocked && slot.character !== null)
            .map(slot => slot.character);

        // Remove selected hero
        selectedCharacters.splice(index, 1);

        // Clear unlocked slots
        for (let i = 0; i < this.heroDeck.length; i++) {

            if (this.heroDeck[i].unlocked) {
                this.heroDeck[i].character = null;
            }
        }

        // Put heroes back into the unlocked slots
        let characterIndex = 0;

        for (let i = 0; i < this.heroDeck.length; i++) {

            if (
                this.heroDeck[i].unlocked &&
                characterIndex < selectedCharacters.length
            ) {
                this.heroDeck[i].character =
                    selectedCharacters[characterIndex];

                characterIndex++;
            }
        }

        playSound(this.confirmSelectSound);

        console.log("Hero Deck:", this.heroDeck);
    };

    createCharacterBoxes = () => {

        const boxes = [];

        const columns = this.gridColumns;
        const size = this.characterBoxSize;
        const gap = this.characterBoxGap;

        const totalWidth =
            columns * size +
            (columns - 1) * gap;

        const startX =
            this.characterGrid.x +
            (this.characterGrid.width - totalWidth) / 2;

        for (let i = 0; i < this.characters.length; i++) {

            const column = i % columns;
            const row = Math.floor(i / columns);

            boxes.push({
                id: this.characters[i],
                x: startX + column * (size + gap),
                y: this.characterGrid.y + 15 + row * (size + gap),
                width: size,
                height: size,
                row
            });
        }

        return boxes;
    };

    getHeroDeckSlotBox = (index) => {

        const slotWidth = 120;
        const slotHeight = 70;
        const gap = 15;
        const canvasWidth = 1280;

        const totalWidth =
            slotWidth * 5 +
            gap * 4;

        const startX =
            (canvasWidth - totalWidth) / 2;

        const startY = 80;

        return {
            x: startX + index * (slotWidth + gap),
            y: startY,
            width: slotWidth,
            height: slotHeight
        };
    };

    getBuySlotButtons = () => {

        const boxWidth = 520;
        const boxHeight = 260;
        const canvasWidth = 1280;
        const canvasHeight = 720;

        const boxX = (canvasWidth - boxWidth) / 2;
        const boxY = (canvasHeight - boxHeight) / 2;

        return {
            buy: {
                x: boxX + 55,
                y: boxY + 175,
                width: 180,
                height: 55
            },

            cancel: {
                x: boxX + 285,
                y: boxY + 175,
                width: 180,
                height: 55
            },

            box: {
                x: boxX,
                y: boxY,
                width: boxWidth,
                height: boxHeight
            }
        };
    };

    drawCharacterImage = (context, image, x, y, width, height) => {

        if (!image || !image.complete || image.naturalWidth === 0) {
            return;
        }

        const imageRatio =
            image.naturalWidth / image.naturalHeight;

        const boxRatio =
            width / height;

        let sourceWidth = image.naturalWidth;
        let sourceHeight = image.naturalHeight;
        let sourceX = 0;
        let sourceY = 0;

        if (imageRatio > boxRatio) {

            // Image is wider than box
            sourceWidth =
                image.naturalHeight * boxRatio;

            sourceX =
                (image.naturalWidth - sourceWidth) / 2;

        } else {

            // Image is taller than box
            sourceHeight =
                image.naturalWidth / boxRatio;

            sourceY =
                (image.naturalHeight - sourceHeight) / 2;
        }

        context.drawImage(
            image,

            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,

            x,
            y,
            width,
            height
        );
    };

    drawButtons = (context) => {

        // RANDOM Btn
        context.fillStyle = "black";
        context.fillRect(
            this.randomBox.x,
            this.randomBox.y,
            this.randomBox.width,
            this.randomBox.height
        );

        context.strokeStyle = "white";
        context.lineWidth = 2;

        context.strokeRect(
            this.randomBox.x,
            this.randomBox.y,
            this.randomBox.width,
            this.randomBox.height
        );


        context.fillStyle = "white";
        context.font = "bold 24px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "RANDOM",
            this.randomBox.x +this.randomBox.width / 2,
            this.randomBox.y + this.randomBox.height / 2
        );


        // Select Btn
        // context.fillStyle = "#D4AF37";
        context.fillStyle = "black";

        context.fillRect(
            this.selectBox.x,
            this.selectBox.y,
            this.selectBox.width,
            this.selectBox.height
        );

        // context.strokeStyle = "#FFD700";
        context.strokeStyle = "white";

        context.strokeRect(
            this.selectBox.x,
            this.selectBox.y,
            this.selectBox.width,
            this.selectBox.height
        );

        context.fillStyle = "white";

        context.fillText(
            "SELECT",
            this.selectBox.x + this.selectBox.width / 2,
            this.selectBox.y + this.selectBox.height / 2
        );


        // =========================
        // BATTLE
        // =========================
        context.fillStyle = "#D4AF37";

        context.fillRect(
            this.battleBox.x,
            this.battleBox.y,
            this.battleBox.width,
            this.battleBox.height
        );

        context.strokeStyle = "#FFD700";

        context.strokeRect(
            this.battleBox.x,
            this.battleBox.y,
            this.battleBox.width,
            this.battleBox.height
        );

        context.fillStyle = "white";

        context.fillText(
            "BATTLE",
            this.battleBox.x + this.battleBox.width / 2,
            this.battleBox.y + this.battleBox.height / 2
        );
        
    };

    drawCharacterStats = (context) => {

        const stats = this.characterStats[this.selected];

        if (!stats) return;

        const x = this.previewBox.x;
        const width = this.previewBox.width;

        // ======STATS PANEL======
        const panelX = this.previewBox.x + 15;
        const panelY = this.previewBox.y + 280;
        const panelWidth = this.previewBox.width - 90;
        const panelHeight = 170;


        context.fillStyle = "rgba(0, 0, 0, 1)";
        context.fillRect(
            panelX,
            panelY,
            panelWidth,
            panelHeight
        );

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
            x + width / 2.2,
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
                y: panelY + 80
            },
            {
                label: "SPEED",
                value: stats.speed,
                y: panelY + 110
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
                panelX + panelWidth - 28,
                stat.y
            );
        }
    };

    drawCharacterScrollbar = (context) => {

        const totalRows = Math.ceil(
            this.characters.length / this.gridColumns
        );

        const rowHeight = this.characterBoxSize + this.characterBoxGap;

        const visibleRows = Math.floor(
            (this.characterGrid.height - 30) /
            rowHeight
        );

        if (totalRows <= visibleRows) {
            return;
        }

        const trackWidth = 8;

        const trackX =
            this.characterGrid.x +
            this.characterGrid.width -
            18;

        const trackY =
            this.characterGrid.y + 15;

        const trackHeight =
            this.characterGrid.height - 30;

        // =========================
        // TRACK
        // =========================

        context.fillStyle = "rgba(255,255,255,0.2)";

        context.fillRect(
            trackX,
            trackY,
            trackWidth,
            trackHeight
        );

        // =========================
        // MAX SCROLL
        // =========================

        const contentHeight =
            totalRows * rowHeight;

        const maxScroll = Math.max(
            0,
            contentHeight -
            (this.characterGrid.height - 30)
        );


        // =========================
        // THUMB
        // =========================

        const scrollRatio =
            this.scrollOffset /
            Math.max(maxScroll, 1);

        const thumbHeight =
            Math.max(
                40,
                trackHeight *
                (visibleRows / totalRows)
            );

        const thumbY =
            trackY +
            (trackHeight - thumbHeight) *
            scrollRatio;


        context.fillStyle =
            "#D4AF37";

        context.fillRect(
            trackX,
            thumbY,
            trackWidth,
            thumbHeight
        );


        // =========================
        // UP ARROW
        // =========================
        context.fillStyle = "white";

        context.beginPath();

        context.moveTo(
            trackX + trackWidth / 2,
            // trackY - 8
            trackY - 15
        );
    
        context.lineTo(
            trackX - 8,
            trackY - 2
        );

        context.lineTo(
            trackX + trackWidth + 8,
            trackY - 2
        );

        context.closePath();

        context.fill();


        // =========================
        // DOWN ARROW
        // =========================

        context.beginPath();

        context.moveTo(
            trackX + trackWidth / 2,
            trackY + trackHeight + 15
        );

        context.lineTo(
            trackX - 8,
            trackY + trackHeight + 2
        );

        context.lineTo(
            trackX + trackWidth + 8,
            trackY + trackHeight + 2
        );

        context.closePath();
        context.fill();
    };

    drawCharacterGrid = (context) => {

        // =========================
        // PANEL
        // =========================

        context.fillStyle = "rgba(0,0,0,0.95)";

        context.fillRect(
            this.characterGrid.x,
            this.characterGrid.y,
            this.characterGrid.width,
            this.characterGrid.height
        );

        context.strokeStyle = "#FFD700";
        context.lineWidth = 2;

        context.strokeRect(
            this.characterGrid.x,
            this.characterGrid.y,
            this.characterGrid.width,
            this.characterGrid.height
        );


        // =========================
        // CLIP GRID
        // =========================

        context.save();

        context.beginPath();

        context.rect(
            this.characterGrid.x,
            this.characterGrid.y,
            this.characterGrid.width,
            this.characterGrid.height
        );

        context.clip();


        // =========================
        // CHARACTER TILES
        // =========================

        for (const box of this.characterBoxes) {

            const drawY =
                box.y - this.scrollOffset;


            // Don't render outside panel
            if (
                drawY + box.height <
                    this.characterGrid.y ||

                drawY >
                    this.characterGrid.y +
                    this.characterGrid.height
            ) {
                continue;
            }


            const isSelected =
                box.id === this.selectedCharacter;


            // =========================
            // TILE BACKGROUND
            // =========================

            context.fillStyle =
                isSelected
                    ? "#D4AF37"
                    : "rgba(10,10,10,1)";

            context.fillRect(
                box.x,
                drawY,
                box.width,
                box.height
            );


            // =========================
            // CHARACTER IMAGE
            // =========================

            const face =
                this.faceImages[box.id];

            if (face) {

                const imagePadding = 3;

                this.drawCharacterImage(
                    context,
                    face,
                    box.x + imagePadding,
                    drawY + imagePadding,
                    box.width - imagePadding * 2,
                    box.height - imagePadding * 2
                );
            }


            // =========================
            // NAME BAR
            // =========================

            const nameBarHeight = 30;

            context.fillStyle =
                isSelected
                    ? "rgba(0,0,0,0.85)"
                    : "rgba(0,0,0,0.90)";

            context.fillRect(
                box.x,
                drawY + box.height - nameBarHeight,
                box.width,
                nameBarHeight
            );


            // =========================
            // NAME
            // =========================

            context.fillStyle = "white";

            context.font =
                "bold 16px Arial";

            context.textAlign = "center";
            context.textBaseline = "middle";

            context.fillText(
                this.characterStats[box.id].name,
                box.x + box.width / 2,
                drawY +
                    box.height -
                    nameBarHeight / 2
            );


            // =========================
            // BORDER
            // =========================

            context.strokeStyle =
                isSelected
                    ? "#FFD700"
                    : "rgba(255,255,255,0.8)";

            context.lineWidth =
                isSelected
                    ? 4
                    : 1;

            context.strokeRect(
                box.x,
                drawY,
                box.width,
                box.height
            );
        }


        context.restore();


        // =========================
        // SCROLLBAR
        // =========================

        this.drawCharacterScrollbar(context);
    };

    drawHeroDeck = (context) => {

        const slotWidth = 120;
        const slotHeight = 70;

        for (let i = 0; i < this.heroDeck.length; i++) {

            const slot = this.heroDeck[i];

            const slotBox = this.getHeroDeckSlotBox(i);

            const x = slotBox.x;
            const y = slotBox.y;


            // Background
            context.fillStyle =
            slot.unlocked ? "rgba(0,0,0,1)" : "rgba(30,30,30,1)";

            context.fillRect(
                x,
                y,
                slotWidth,
                slotHeight
            );


            // Border
            context.lineWidth = 2;
            context.strokeStyle =
            slot.unlocked ? "#FFD700" : "#666";

            context.strokeRect(
                x,
                y,
                slotWidth,
                slotHeight
            );


            // Character
            if (slot.character !== null) {

                const face = this.faceImages[slot.character];

                if (face) {
                    context.drawImage(
                        face,
                        x + 5,
                        y + 5,
                        60,
                        60
                    );
                }

                context.fillStyle = "white";
                context.font = "bold 16px Arial";
                context.textAlign = "left";
                context.textBaseline = "middle";

                context.fillText(
                    this.characterStats[slot.character].name,
                    x + 70,
                    y + slotHeight / 2
                );


                // Remove indicator
                context.fillStyle = "rgba(180, 0, 0, 0.9)";

                context.fillRect(
                    x + slotWidth - 24,
                    y + 4,
                    20,
                    20
                );

                context.fillStyle = "white";
                context.font = "bold 16px Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";

                context.fillText(
                    "×",
                    x + slotWidth - 14,
                    y + 14
                );

            }
            else if (!slot.unlocked) {

                context.fillStyle = "#888";
                context.font = "bold 28px Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";

                context.fillText(
                    "🔒",
                    x + slotWidth / 2,
                    y + slotHeight / 2
                );

            }
            else {

                context.fillStyle = "#777";
                context.font = "bold 26px Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";

                context.fillText(
                    "+",
                    x + slotWidth / 2,
                    y + slotHeight / 2
                );
            }
        }
    };

    update(time) {
        if (time.previous > this.arrowTimer) {
            this.arrowVisible = !this.arrowVisible;
            this.arrowTimer = time.previous + 300;
        }

        // =========================
        // MESSAGE BOX TIMER
        // =========================
        if (
            this.messageBox.visible &&
            performance.now() >= this.messageBox.expiresAt
        ) {
            this.messageBox.visible = false;
        }
    }
    
    drawMessageBox = (context) => {

        if (!this.messageBox.visible) {
            return;
        }

        const boxWidth = 520;
        const boxHeight = 150;

        const boxX =
            (context.canvas.width - boxWidth) / 2;

        const boxY =
            (context.canvas.height - boxHeight) / 2;


        // =========================
        // DARK OVERLAY
        // =========================

        context.fillStyle =
            "rgba(0, 0, 0, 0.55)";

        context.fillRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        // =========================
        // MESSAGE BOX
        // =========================

        context.fillStyle =
            "rgba(10, 10, 10, 0.98)";

        context.fillRect(
            boxX,
            boxY,
            boxWidth,
            boxHeight
        );


        // =========================
        // GOLD BORDER
        // =========================

        context.strokeStyle = "#FFD700";
        context.lineWidth = 3;

        context.strokeRect(
            boxX,
            boxY,
            boxWidth,
            boxHeight
        );


        // =========================
        // MESSAGE
        // =========================

        context.fillStyle = "white";

        context.font =
            "bold 26px Arial";

        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            this.messageBox.message,
            boxX + boxWidth / 2,
            boxY + boxHeight / 2
        );
    };

    drawBuySlotBox = (context) => {

        if (!this.buySlotBox.visible) {
            return;
        }

        const boxWidth = 520;
        const boxHeight = 260;

        const boxX =
            (context.canvas.width - boxWidth) / 2;

        const boxY =
            (context.canvas.height - boxHeight) / 2;


        // =========================
        // DARK OVERLAY
        // =========================

        context.fillStyle =
            "rgba(0, 0, 0, 0.65)";

        context.fillRect(
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        // =========================
        // MAIN BOX
        // =========================

        context.fillStyle =
            "rgba(10, 10, 10, 0.98)";

        context.fillRect(
            boxX,
            boxY,
            boxWidth,
            boxHeight
        );


        // =========================
        // BORDER
        // =========================

        context.strokeStyle = "#FFD700";
        context.lineWidth = 3;

        context.strokeRect(
            boxX,
            boxY,
            boxWidth,
            boxHeight
        );


        // =========================
        // TITLE
        // =========================

        context.fillStyle = "#FFD700";
        context.font = "bold 30px Arial";

        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "UNLOCK HERO SLOT",
            boxX + boxWidth / 2,
            boxY + 45
        );


        // =========================
        // MESSAGE
        // =========================

        context.fillStyle = "white";
        context.font = "22px Arial";

        context.fillText(
            "Buy this hero slot?",
            boxX + boxWidth / 2,
            boxY + 90
        );


        // =========================
        // PRICE
        // =========================

        context.fillStyle = "#FFD700";
        context.font = "bold 24px Arial";

        context.fillText(
            `🪙 ${this.buySlotBox.price} COINS`,
            boxX + boxWidth / 2,
            boxY + 130
        );


        // =========================
        // BUY BUTTON
        // =========================

        const buyButton = {
            x: boxX + 55,
            y: boxY + 175,
            width: 180,
            height: 55
        };

        context.fillStyle = "#D4AF37";

        context.fillRect(
            buyButton.x,
            buyButton.y,
            buyButton.width,
            buyButton.height
        );

        context.strokeStyle = "#FFD700";
        context.lineWidth = 2;

        context.strokeRect(
            buyButton.x,
            buyButton.y,
            buyButton.width,
            buyButton.height
        );

        context.fillStyle = "white";
        context.font = "bold 20px Arial";

        context.fillText(
            "BUY",
            buyButton.x + buyButton.width / 2,
            buyButton.y + buyButton.height / 2
        );


        // =========================
        // CANCEL BUTTON
        // =========================

        const cancelButton = {
            x: boxX + 285,
            y: boxY + 175,
            width: 180,
            height: 55
        };

        context.fillStyle = "black";

        context.fillRect(
            cancelButton.x,
            cancelButton.y,
            cancelButton.width,
            cancelButton.height
        );

        context.strokeStyle = "white";
        context.lineWidth = 2;

        context.strokeRect(
            cancelButton.x,
            cancelButton.y,
            cancelButton.width,
            cancelButton.height
        );

        context.fillStyle = "white";
        context.font = "bold 20px Arial";

        context.fillText(
            "CANCEL",
            cancelButton.x + cancelButton.width / 2,
            cancelButton.y + cancelButton.height / 2
        );
    };

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

        if (this.selected === FighterId.KEN) {

            context.drawImage(
                this.previewImages[FighterId.KEN],
                this.previewBox.x + 25,      
                this.previewBox.y + 25,     
                330,                        
                470                         
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

        this.drawCharacterStats(context);

        // TITLE
        context.textAlign = "center";
        context.textBaseline = "middle";

        const titleX = 640;
        const titleY = 40;

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
        
        this.drawHeroDeck(context);
        // this.drawCharacterPreview(context);
        this.drawCharacterGrid(context);
        this.drawButtons(context);


        context.fillStyle = "white";
        context.font = "22px Arial";
        context.textAlign = "left";

        context.fillText(
            "ESC - Back",
            10,
            context.canvas.height - 10
        );

        this.drawMessageBox(context);
        this.drawBuySlotBox(context);
    }

}