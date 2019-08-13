import {Injectable} from '@angular/core';

export enum Sound {
    ATTACK,
    KILL,
    FINISH,
}

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private readonly sounds = (() => {
        const loadAudio = (file: string): HTMLAudioElement => {
            const audio = new Audio();
            audio.src = `assets/audio/${file}`;
            audio.load();
            return audio;
        };
        return new Map([
            [Sound.ATTACK, [loadAudio('attack.mp3'), loadAudio('attack2.mp3')]],
            [Sound.KILL, [loadAudio('kill.mp3')]],
            [Sound.FINISH, [loadAudio('finish.mp3')]],
        ]);
    })();

    constructor() {
    }

    private getRandomSound(sounds: HTMLAudioElement[]): HTMLAudioElement {
        return sounds[Math.floor(Math.random() * sounds.length)];
    }

    public playAudio(sound: Sound): Promise<void> {
        const soundToPlay = this.getRandomSound(this.sounds.get(sound));
        soundToPlay.currentTime = 0;
        return soundToPlay.play();
    }

}
