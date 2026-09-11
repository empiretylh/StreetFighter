import { playSound } from "../../engine/SoundHandler.js";
import { getLeaderboard } from "../../api/leaderboardApi.js";

import {
    soundSelectIds,
    soundConfirmId
} from "../../constants/sounds.js";

export class LeaderboardScene {

    backgroundImg = new Image();
    leaderboardRows = [];
    
    profileImages = {};

    loadLeaderboard = async () => {
        try {

            const data = await getLeaderboard();
            console.log("Leaderboard API:", data);
            this.leaderboardRows = data;

        } catch (error) {

            console.error(
                "Failed to load leaderboard:",
                error
            );
        }
    };

    loadProfileImages = () => {
        const players = [
            ...this.topPlayers,
            ...this.leaderboardRows,
            this.currentPlayer
        ];

        for (const player of players) {

            const image = new Image();
            image.src = player.profile;

            this.profileImages[player.rank] = image;
        }
    };

    upSelectSound = document.getElementById(soundSelectIds.LEFTCHAR);
    downSelectSound = document.getElementById(soundSelectIds.RIGHTCHAR);
    backSound = document.getElementById(soundConfirmId);

    // ==========================================
    // TABS
    // ==========================================
    tabs = [
        {
            text: "GLOBAL",
            x: 388,
            y: 15,
            width: 160,
            height: 35
        },
        {
            text: "FRIENDS",
            x: 555,
            y: 15,
            width: 170,
            height: 35
        },
        {
            text: "REGIONAL",
            x: 730,
            y: 15,
            width: 160,
            height: 35
        }
    ];

    selectedTab = 0;


    // ==========================================
    // TOP 3 PLAYERS
    // ==========================================
    topPlayers = [
        {
            rank: 2,
            name: "NIGHTSHADE",
            wins:1245,
            rating: 2456,
            profile: "./public/images/profile.png",
            x: 345,
            y: 105,
            width: 160,
            height: 200
        },
        {
            rank: 1,
            name: "RAGINGFIST",
            wins: 1589,
            rating: 2789,
            profile: "./public/images/profile.png",
            x: 535,
            y: 65,
            width: 180,
            height: 240
        },
        {
            rank: 3,
            name: "VENOMSTRIKE",
            wins: 1108,
            rating: 2187,
            profile: "./public/images/profile.png",
            x: 745,
            y: 105,
            width: 160,
            height: 200
        }
    ];


    // ==========================================
    // LEADERBOARD TABLE
    // ==========================================
    leaderboardRows = [
        {
            rank: 4,
            name: "SHADOWBLADE",
            wins: 842,
            rating: 2041,
            profile: "./public/images/profile.png"
        },
        {
            rank: 5,
            name: "KILLER INSTINCT",
            wins: 798,
            rating: 1987,
            profile: "./public/images/profile.png"
        },
        {
            rank: 6,
            name: "ARCTIC FURY",
            wins: 752,
            rating: 1932,
            profile: "./public/images/profile.png"
        },
        {
            rank: 7,
            name: "IRONCLAD",
            wins: 715,
            rating: 1876,
            profile: "./public/images/profile.png"
        },
        {
            rank: 8,
            name: "LUNAR KICK",
            wins: 688,
            rating: 1823,
            profile: "./public/images/profile.png"
        },
        {
            rank: 9,
            name: "VOIDWALKER",
            wins: 642,
            rating: 1769,
            profile: "./public/images/profile.png"
        },
        {
            rank: 10,
            name: "CRIMSON EDGE",
            wins: 601,
            rating: 1713,
            profile: "./public/images/profile.png"
        }
    ];


    // ==========================================
    // Your PLAYER Rank
    // ==========================================
    currentPlayer = {
        rank: 128,
        name: "STRIKE_X7",
        wins: 185,
        rating: 1426,
        profile: "./public/images/profile.png"
    };


    // ==========================================
    // BACK BUTTON
    // ==========================================
    backButton = {
        x: 18,
        y: 665,
        width: 165,
        height: 42
    };


    constructor(changeScene, previousScene) {

        this.changeScene = changeScene;
        this.previousScene = previousScene;
        
        this.backgroundImg.src = "./public/images/bg1.jpg";

        document.getElementById("mobile-controls").style.display = "none";
        document.getElementById("btn-back").style.display = "none";

        window.addEventListener("keydown",this.handleKeyDown);
        window.addEventListener("pointerdown",this.handlePointerDown);
        window.addEventListener("pointermove",this.handlePointerMove);

        this.loadProfileImages();
        this.loadLeaderboard();
    }


    // ==========================================
    // KEYBOARD
    // ==========================================
    handleKeyDown = (event) => {

        switch (event.code) {

            case "ArrowLeft":

                if (this.selectedTab > 0) {
                    this.selectedTab--;
                    playSound(
                        this.upSelectSound
                    );
                }
                break;

            case "ArrowRight":

                if (
                    this.selectedTab <
                    this.tabs.length - 1
                ) {

                    this.selectedTab++;

                    playSound(
                        this.downSelectSound
                    );
                }break
            case "Escape":
            case "KeyB":

                this.goBack();
                break;

            case "Enter":

                // Later:
                // select current tab / button

                break;
        }
    };


    // ==========================================
    // POINTER MOVE
    // ==========================================
    handlePointerMove = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        let hover = false;

        // ===== TABS =====
        // for (
        //     const [index, tab]
        //     of this.tabs.entries()
        // ) {

        //     if (
        //         x >= tab.x &&
        //         x <= tab.x + tab.width &&
        //         y >= tab.y &&
        //         y <= tab.y + tab.height
        //     ) {

        //         if (
        //             this.selectedTab !== index
        //         ) {

        //             playSound(
        //                 index > this.selectedTab
        //                     ? this.downSelectSound
        //                     : this.upSelectSound
        //             );
        //             this.selectedTab = index;

        //         }

        //         hover = true;
        //         break;
        //     }
        // }


        // ===== BACK =====
        const hitboxPaddingLeft = 95;
        const hitboxPaddingRight = 85;

        if (
            x >= this.backButton.x + hitboxPaddingLeft &&
            x <=
                this.backButton.x +
                this.backButton.width + hitboxPaddingRight &&
            y >= this.backButton.y &&
            y <=
                this.backButton.y +
                this.backButton.height
        ) {
            hover = true;
        }

        canvas.style.cursor = hover ? "pointer" : "default";
    };


    // =======POINTER DOWN=======
    handlePointerDown = (event) => {

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;


        // ===== TABS =====
        for (
            const [index, tab]
            of this.tabs.entries()
        ) {

            if (
                x >= tab.x &&
                x <= tab.x + tab.width &&
                y >= tab.y &&
                y <= tab.y + tab.height
            ) {

                if (
                    this.selectedTab !== index
                ) {

                    playSound(
                        index > this.selectedTab
                            ? this.downSelectSound
                            : this.upSelectSound
                    );
                    this.selectedTab = index;

                }

                this.selectedTab = index;
                return;
            }
        }


        // ===== BACK =====
        const hitboxPaddingLeft = 95;
        const hitboxPaddingRight = 85;

        if (
            x >= this.backButton.x + hitboxPaddingLeft &&
            x <=
                this.backButton.x +
                this.backButton.width + hitboxPaddingRight &&
            y >= this.backButton.y &&
            y <=
                this.backButton.y +
                this.backButton.height
        ) {
            this.goBack();
            return;
        }
    };


    // =======BACK=======
    goBack = () => {
        window.removeEventListener("keydown",this.handleKeyDown);
        window.removeEventListener("pointerdown",this.handlePointerDown);
        window.removeEventListener("pointermove",this.handlePointerMove);

        playSound(this.backSound);
        this.changeScene(this.previousScene.constructor);
    };


    // =======DRAW TITLE=======
    drawTitle = (context) => {

        context.fillStyle = "white";
        context.font ="bold italic 54px Teko";
        context.textAlign = "left";
        context.textBaseline = "alphabetic";

        context.fillText(
            "LEADERBOARD",
            30,
            78
        );


        context.fillStyle = "#ff3030";

        context.font =
            "bold 26px Teko";

        context.fillText(
            "RANKED SEASON 03",
            30,
            110
        );
    };


    // =======DRAW TABS=======
    drawTabs = (context) => {

        for (
            const [index, tab]
            of this.tabs.entries()
        ) {

            const selected =
                index === this.selectedTab;


            context.fillStyle =
                selected
                    ? "rgba(150, 0, 0, 0.95)"
                    : "rgba(0, 0, 0, 0.65)";

            context.fillRect(
                tab.x,
                tab.y,
                tab.width,
                tab.height
            );


            context.strokeStyle =
                selected
                    ? "#ff3030"
                    : "rgba(255,255,255,0.4)";

            context.lineWidth =
                selected ? 2 : 1;

            context.strokeRect(
                tab.x,
                tab.y,
                tab.width,
                tab.height
            );


            context.fillStyle = "white";
            context.font ="bold 18px Teko";
            context.textAlign = "center";
            context.textBaseline = "middle";

            context.fillText(
                tab.text,
                tab.x + tab.width / 2,
                tab.y + tab.height / 2
            );
        }
    };


    // =======DRAW TOP PLAYERS=======
    drawTopPlayers = (context) => {

        for (const player of this.topPlayers) {

            const isFirst = player.rank === 1;

            // -----Card-----
            context.fillStyle = "rgba(0,0,0,1)";
            context.fillRect(
                player.x,
                player.y,
                player.width,
                player.height
            );

            // -----Card Border-----
            context.strokeStyle = isFirst
            ? "#D4AF37" : "rgba(255,255,255,0.5)";
            context.lineWidth = isFirst ? 3 : 2;
            context.strokeRect(
                player.x,
                player.y,
                player.width,
                player.height
            );


            // -----Rank-----
            context.fillStyle = isFirst
            ? "#D4AF37" : "white";
            context.font = isFirst ? "bold 38px Teko" : "bold 30px Teko";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(
                `#${player.rank}`,
                player.x + player.width / 2,
                player.y + 26
            );


            
            // -----PROFILE IMAGE-----
            const profileImage = this.profileImages[player.rank];
            const profileSize = isFirst ? 145 : 115;
            const profileX = player.x + (player.width - profileSize) / 2;
            const profileY = player.y + 50;


            if ( profileImage && profileImage.complete ) {
                context.drawImage(
                    profileImage,
                    profileX,
                    profileY,
                    profileSize,
                    profileSize
                );
            }


            // -----PROFILE BORDER-----
            context.strokeStyle = isFirst
            ? "#D4AF37" : "rgba(255,255,255,0.5)";
            context.lineWidth = 2;
            context.strokeRect(
                profileX,
                profileY,
                profileSize,
                profileSize
            );


            const infoHeight = isFirst ? 48 : 44;
            const infoY = profileY + profileSize - 20;

            context.fillStyle = "rgba(0,0,0,0.90)";
            // context.fillRect(
            //     profileX,
            //     infoY,
            //     profileSize,
            //     infoHeight
            // );
            context.fillRect(
                player.x,
                infoY,
                player.width,
                infoHeight
            );



            // -----Player name-----
            context.fillStyle = "white";
            context.font = isFirst ? "bold 21px Teko" : "bold 18px Teko";
            context.textAlign = "center";
            context.fillText(
                player.name,
                player.x + player.width / 2,
                // player.y + player.height - 40
                infoY + 15
            );


            // // -----Rating-----
            // context.fillStyle = isFirst
            // ? "#D4AF37" : "#aaaaaa";
            // context.font = isFirst ? "bold 18px Teko" : "bold 16px Teko";
            // context.fillText(
            //     `${player.rating} RP`,
            //     player.x + player.width / 2,
            //     infoY + 34
            // );

            // -----Wins + Rating-----
            context.font = isFirst
                ? "bold 18px Teko"
                : "bold 16px Teko";

            // Wins
            context.fillStyle = "white";
            context.textAlign = "right";

            context.fillText(
                `${player.wins} W`,
                player.x + player.width / 2 - 8,
                infoY + 34
            );


            // Rating
            context.fillStyle = isFirst
                ? "#D4AF37"
                : "#aaaaaa";

            context.textAlign = "left";

            context.fillText(
                `${player.rating} RP`,
                player.x + player.width / 2 + 8,
                infoY + 34
            );



        }
    };


    // =======DRAW TABLE=======
    drawLeaderboardTable = (context) => {

        const x = 195;
        const y = 325;
        const width = 890;
        const rowHeight = 30;


        // Header
        context.fillStyle ="rgba(0,0,0,1)";
        context.fillRect(
            x,
            y,
            width,
            rowHeight
        );


        context.fillStyle = "white";
        context.font ="bold 16px Teko";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "RANK",
            x + 80,
            y + rowHeight / 2
        );

        context.fillText(
            "FIGHTER",
            x + 300,
            y + rowHeight / 2
        );

        context.fillText(
            "WINS",
            x + 625,
            y + rowHeight / 2
        );

        context.fillText(
            "RATING",
            x + 775,
            y + rowHeight / 2
        );


        // Rows
        for ( const [index, player] of this.leaderboardRows.entries() ) {

            const rowY = y + rowHeight + index * rowHeight;

            context.fillStyle = index % 2 === 0
            ? "rgba(0,0,0,1)" : "rgba(20,20,20,1)";

            context.fillRect(
                x,
                rowY,
                width,
                rowHeight
            );


            context.strokeStyle ="rgba(255,255,255,0.15)";
            context.strokeRect(
                x,
                rowY,
                width,
                rowHeight
            );


            context.fillStyle = "white";
            context.font = "16px Teko";
            context.textAlign = "center";

            context.fillText(
                player.rank,
                x + 80,
                rowY + rowHeight / 2
            );


            const profileImage = this.profileImages[player.rank];
            const profileSize = 16;
            const profileX = x + 245;
            const profileY = rowY + (rowHeight - profileSize) / 2;

            if (profileImage && profileImage.complete) {

                context.drawImage(
                    profileImage,
                    profileX,
                    profileY,
                    profileSize,
                    profileSize
                );

                context.strokeStyle = "rgba(255,255,255,0.5)";
                context.lineWidth = 1;

                context.strokeRect(
                    profileX,
                    profileY,
                    profileSize,
                    profileSize
                );
            }

            context.fillStyle = "white";
            context.font = "16px Teko";
            context.textAlign = "left";
            context.fillText(
                player.name,
                profileX + profileSize + 13,
                rowY + rowHeight / 2
            );


            context.textAlign = "center";
            context.fillText(
                player.wins,
                x + 625,
                rowY + rowHeight / 2
            );


            context.fillStyle = "#ff4040";

            context.fillText(
                `${player.rating} RP`,
                x + 775,
                rowY + rowHeight / 2
            );
        }
    };


    // =======DRAW CURRENT PLAYER=======
    drawCurrentPlayer = (context) => {

        const x = 160;
        const y = 570;
        const width = 960;
        const height = 60;


        context.fillStyle ="rgba(80,0,0,1)";
        context.fillRect(
            x,
            y,
            width,
            height
        );


        context.strokeStyle ="#ff3030";
        context.lineWidth = 3;

        context.strokeRect(
            x,
            y,
            width,
            height
        );


        context.fillStyle = "#ff3030";
        context.font = "bold 16px Teko";
        context.textAlign = "left";

        context.fillText(
            "YOUR RANK",
            x + 50,
            y + 25
        );


        context.fillStyle = "white";
        context.font ="bold 30px Teko";
        context.fillText(
            `#${this.currentPlayer.rank}`,
            x + 180,
            y + 38
        );



        const profileImage = this.profileImages[this.currentPlayer.rank];
        const profileSize = 40;

        const profileX = x + 375;
        const profileY = y + (height - profileSize) / 2;

        if (profileImage && profileImage.complete) {

            context.drawImage(
                profileImage,
                profileX,
                profileY,
                profileSize,
                profileSize
            );

            // Profile border
            context.strokeStyle = "rgba(255,255,255,0.6)";
            context.lineWidth = 1;

            context.strokeRect(
                profileX,
                profileY,
                profileSize,
                profileSize
            );
        }



        context.fillStyle = "white";
        context.font = "bold 20px Teko";
        context.fillText(
            this.currentPlayer.name,
            profileX + profileSize + 15,
            y + 35
        );

        context.fillStyle = "white";
        context.font = "bold 20px Teko";
        context.fillText(
            `${this.currentPlayer.wins} WINS`,
            x + 650,
            y + 35
        );


        context.font = "bold 20px Teko";
        context.fillText(
            `${this.currentPlayer.rating} RP`,
            x + 850,
            y + 35
        );


    };


    // =======DRAW BACK BUTTON=======
    drawBackButton = (context) => {

        context.fillStyle ="rgba(0,0,0,1)";

        context.fillRect(
            this.backButton.x,
            this.backButton.y,
            this.backButton.width,
            this.backButton.height
        );


        context.strokeStyle ="rgba(255,255,255,0.6)";
        context.lineWidth = 2;

        context.strokeRect(
            this.backButton.x,
            this.backButton.y,
            this.backButton.width,
            this.backButton.height
        );


        context.fillStyle = "white";
        context.font ="bold 22px Teko";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            "BACK",
            this.backButton.x +this.backButton.width / 2,
            this.backButton.y +this.backButton.height / 1.7
        );
    };


    update(time) {

    }


    draw(context) {

        context.drawImage(
            this.backgroundImg,
            0,
            0,
            context.canvas.width,
            context.canvas.height
        );


        this.drawTitle(context);
        this.drawTabs(context);
        this.drawTopPlayers(context);
        this.drawLeaderboardTable(context);
        this.drawCurrentPlayer(context);
        this.drawBackButton(context);


        context.textAlign = "left";
        context.textBaseline = "alphabetic";
    }
}