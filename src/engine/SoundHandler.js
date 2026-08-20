import { GLOBAL_VOLUME } from '../constants/sounds.js';
import { audioSettings } from '../scenes/settings/AudioSettings.js';

//[FIXED] using https://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error TODO: Proabably there is a race condition between play() and pause() giving error 'The play() request was interrupted by a call to pause()' in the consol.
let musicVolume = 100;
let sfxVolume = 100;
let muted = false;


// export const playSound = (sound, volume = GLOBAL_VOLUME) => {
// 	sound.volume = volume;
// 	sound.currentTime = 0;

//     sound.play().catch((error) => {
//         console.warn("Sound could not be played:", error);
//     });
	
// };

export const playSound = (sound,volume = GLOBAL_VOLUME,type = "sfx") => {

    if (!sound) return;
    if (audioSettings.muted) return;

    const userVolume = type === "music"
        ? audioSettings.musicVolume
        : audioSettings.sfxVolume;

    sound.volume = volume * (userVolume / 100);
    sound.currentTime = 0;

    sound.play().catch((error) => {
        console.warn(
            "Sound could not be played:",
            error
        );
    });
};

export const playMusic = (sound,volume = GLOBAL_VOLUME) => {

    if (!sound) return;

    const finalVolume = muted ? 0 : volume * (musicVolume / 100);
    sound.volume = finalVolume;

    sound.play().catch((error) => {
        console.warn(
            "Music could not be played:",
            error
        );
    });
};


export const stopSound = (sound) => {
	if (!sound) return;

	sound.pause();
	sound.currentTime = 0;
};
