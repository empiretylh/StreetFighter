export class AudioSettings {

    musicVolume = 100;
    sfxVolume = 100;
    muted = false;

    rows = {
        musicVolume: {
            y: 180,
            leftX: 605,
            valueX: 655,
            rightX: 865,
            width: 40,
            valueWidth: 200
        },

        sfxVolume: {
            y: 280,
            leftX: 605,
            valueX: 655,
            rightX: 865,
            width: 40,
            valueWidth: 200
        },

        muted: {
            y: 380,
            offX: 685,
            onX: 790,
            width: 100
        }
    };

    selectedRow = 0;


    update() {

    }


    handleKeyDown(event) {

        switch (event.code) {

            case "ArrowUp":

                if (this.selectedRow > 0) {
                    this.selectedRow--;
                }

                break;


            case "ArrowDown":

                if (this.selectedRow < 2) {
                    this.selectedRow++;
                }

                break;


            case "ArrowLeft":

                if (this.selectedRow === 0 || this.selectedRow === 1) {
                    if (this.muted) {
                        return;
                    }
                }
                this.changeSetting(-1);
                break;


            case "ArrowRight":
                if (this.selectedRow === 0 || this.selectedRow === 1) {
                    if (this.muted) {
                        return;
                    }
                }
                this.changeSetting(1);
                break;
        }
    }


    changeSetting = (direction) => {

        switch (this.selectedRow) {

            // ===== MUSIC VOLUME =====
            case 0:

                this.musicVolume += direction * 5;
                this.musicVolume = Math.max(
                    0,
                    Math.min(100, this.musicVolume)
                );

                break;

            // ===== SFX VOLUME =====
            case 1:

                this.sfxVolume += direction * 5;
                this.sfxVolume = Math.max(
                    0,
                    Math.min(100, this.sfxVolume)
                );

                break;


            // ===== MUTE =====
            case 2:
                this.muted = direction > 0;
                break;

        }
    };


    handlePointerDown(x, y, index) {

        // ===== VOLUME =====

        if (index === 0 || index === 1) {

            // Disable volume controls while muted
            if (this.muted) {
                return true;
            }

            // LEFT
            if (
                x >= row.leftX &&
                x <= row.leftX + row.width
            ) {

                this.changeSetting(-1);
                return true;
            }


            // RIGHT
            if (
                x >= row.rightX - 40 &&
                x <= row.rightX + row.width - 40
            ) {

                this.changeSetting(1);
                return true;
            }


            // VALUE / PROGRESS BAR
            if (
                x >= row.valueX &&
                x <= row.valueX + row.valueWidth
            ) {

                this.setVolumeFromProgressBar(x, row);
                return true;
            }
        }

        const rows = [
            this.rows.musicVolume,
            this.rows.sfxVolume,
            this.rows.muted
        ];

        for (const [index, row] of rows.entries()) {

            if (
                y >= row.y - 25 &&
                y <= row.y + 25 &&
                x >= 500 &&
                x <= 925
            ) {

                this.selectedRow = index;


                // ===== VOLUME =====

                if (index === 0 || index === 1) {

                    // LEFT
                    if (
                        x >= row.leftX &&
                        x <= row.leftX + row.width
                    ) {

                        this.changeSetting(-1);
                        return true;
                    }


                    // RIGHT
                    if (
                        x >= row.rightX - 40 &&
                        x <= row.rightX + row.width - 40
                    ) {

                        this.changeSetting(1);
                        return true;
                    }


                    // VALUE
                    if (
                        x >= row.valueX &&
                        x <= row.valueX + row.valueWidth
                    ) {
                        this.setVolumeFromProgressBar(
                            x,
                            row
                        );
                        return true;
                    }
                }


                // ===== MUTE =====

                if (index === 2) {

                    // OFF
                    if (
                        x >= row.offX &&
                        x <= row.offX + row.width
                    ) {

                        this.muted = false;
                        return true;
                    }


                    // ON
                    if (
                        x >= row.onX &&
                        x <= row.onX + row.width
                    ) {

                        this.muted = true;
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // ======SET VOLUME FROM PROGRESS BAR======
    setVolumeFromProgressBar = (x, row) => {

        const barLeft = row.valueX;
        const barRight = row.valueX + row.valueWidth;

        const clickPosition = x - barLeft;

        const percentage =
            clickPosition / row.valueWidth * 100;


        let volume;


        if (percentage < 12.5) {

            volume = 0;

        } else if (percentage < 37.5) {

            volume = 25;

        } else if (percentage < 62.5) {

            volume = 50;

        } else if (percentage < 87.5) {

            volume = 75;

        } else {

            volume = 100;
        }


        // ===== APPLY VALUE =====
        if (row === this.rows.musicVolume) {

            this.musicVolume = volume;

        } else if (row === this.rows.sfxVolume) {

            this.sfxVolume = volume;
        }
    };



    handlePointerMove(x, y) {

        const rows = [
            this.rows.musicVolume,
            this.rows.sfxVolume,
            this.rows.muted
        ];

        for (const [index, row] of rows.entries()) {

            if (
                y >= row.y - 25 &&
                y <= row.y + 25 &&
                x >= 500 &&
                x <= 925
            ) {

                if (this.muted && (index === 0 || index === 1)) {
                    return true;
                }

                this.selectedRow = index;
                return true;
            }
        }

        return false;
    }


    draw(context) {

        const displayMusicVolume = this.muted
            ? 0
            : this.musicVolume;

        const displaySfxVolume = this.muted
            ? 0
            : this.sfxVolume;

        // =========================
        // BACKGROUND MUSIC
        // =========================

        this.drawVolumeRow(
            context,
            "BACKGROUND MUSIC",
            this.rows.musicVolume,
            // this.musicVolume,
            displayMusicVolume,
            0
        );


        // =========================
        // SFX
        // =========================

        this.drawVolumeRow(
            context,
            "SFX VOLUME",
            this.rows.sfxVolume,
            // this.sfxVolume,
            displaySfxVolume,
            1
        );


        // =========================
        // MUTE
        // =========================

        this.drawMuteRow(
            context,
            "MUTE ALL",
            this.rows.muted,
            this.muted,
            2
        );
    }


    drawVolumeRow = (
        context,
        title,
        row,
        value,
        rowIndex
    ) => {

        const selected = this.selectedRow === rowIndex;
        const disabled = this.muted;

        // ===== TITLE =====

        context.fillStyle = "white";
        context.font = "bold 18px Arial";

        context.textAlign = "left";
        context.textBaseline = "middle";

        context.fillText(
            title,
            345,
            row.y
        );


        // ===== LEFT ARROW =====
        context.fillStyle = disabled ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.8)";
        context.fillRect(
            row.leftX,
            row.y - 20,
            row.width,
            40
        );

        context.strokeStyle = selected
            ? "#D4AF37"
            : "rgba(255,255,255,0.5)";

        context.lineWidth = selected ? 2 : 1;

        context.strokeRect(
            row.leftX,
            row.y - 20,
            row.width,
            40
        );


        context.fillStyle = disabled ? "rgba(255,255,255,0.35)" : "white";
        context.font = "bold 24px Arial";
        context.textAlign = "center";

        context.fillText(
            "<",
            row.leftX + row.width / 2,
            row.y
        );


        // ===== VALUE =====

        // context.fillStyle = selected
        //     ? "#D4AF37"
        //     : "rgba(0,0,0,0.8)";
        // context.fillStyle = "rgba(0,0,0,0.8)";
        context.fillStyle = disabled ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.8)";
        context.fillRect(
            row.valueX,
            row.y - 20,
            row.valueWidth,
            40
        );

        // =================================================
        // PROGRESS
        // =================================================

        const progressWidth =
            row.valueWidth * (value / 100);


        if (progressWidth > 0) {

            // context.fillStyle = "#D4AF37";
            context.fillStyle = disabled ? "rgba(212,175,55,0.25)" : "#D4AF37";

            context.fillRect(
                row.valueX,
                row.y - 20,
                progressWidth,
                40
            );
        }

        context.strokeStyle = selected
            ? "#D4AF37"
            : "rgba(255,255,255,0.5)";

        context.lineWidth = 2;

        context.strokeRect(
            row.valueX,
            row.y - 20,
            row.valueWidth,
            40
        );


        // context.fillStyle = "white";
        context.fillStyle = disabled ? "rgba(255,255,255,0.35)" : "white";
        context.font = "bold 18px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            `${value}%`,
            row.valueX + row.valueWidth / 2,
            row.y
        );


        // ===== RIGHT ARROW =====
        context.fillStyle = disabled ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.8)";

        context.fillRect(
            row.rightX,
            row.y - 20,
            row.width,
            40
        );

        context.strokeStyle = selected
            ? "#D4AF37"
            : "rgba(255,255,255,0.5)";

        context.strokeRect(
            row.rightX,
            row.y - 20,
            row.width,
            40
        );


        context.fillStyle = disabled ? "rgba(255,255,255,0.35)" : "white";
        context.font = "bold 24px Arial";

        context.fillText(
            ">",
            row.rightX + row.width / 2,
            row.y
        );
    };


    drawMuteRow = (
        context,
        title,
        row,
        muted,
        rowIndex
    ) => {

        const selected = this.selectedRow === rowIndex;


        // ===== TITLE =====

        context.fillStyle = "white";
        context.font = "bold 18px Arial";

        context.textAlign = "left";
        context.textBaseline = "middle";

        context.fillText(
            title,
            345,
            row.y
        );


        // ===== OFF =====

        context.fillStyle = !muted
            ? "#D4AF37"
            : "rgba(0,0,0,0.8)";

        context.fillRect(
            row.offX,
            row.y - 20,
            row.width,
            40
        );

        context.strokeStyle = !muted
            ? "#D4AF37"
            : "rgba(255,255,255,0.5)";

        context.lineWidth = selected ? 3 : 1;

        context.strokeRect(
            row.offX,
            row.y - 20,
            row.width,
            40
        );


        // ===== ON =====

        context.fillStyle = muted
            ? "#D4AF37"
            : "rgba(0,0,0,0.8)";

        context.fillRect(
            row.onX,
            row.y - 20,
            row.width,
            40
        );

        context.strokeStyle = muted
            ? "#D4AF37"
            : "rgba(255,255,255,0.5)";

        context.strokeRect(
            row.onX,
            row.y - 20,
            row.width,
            40
        );


        // ===== TEXT =====

        context.fillStyle = "white";
        context.font = "bold 16px Arial";
        context.textAlign = "center";

        context.fillText(
            "OFF",
            row.offX + row.width / 2,
            row.y
        );

        context.fillText(
            "ON",
            row.onX + row.width / 2,
            row.y
        );
    };
}

export const audioSettings = new AudioSettings();