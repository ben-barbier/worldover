import { Injectable } from '@angular/core';
import { AppState, charactersSelector } from '../store/app.state';
import { Store } from '@ngrx/store';
import { Character } from '../store/models/character.model';
import { MatDialog } from '@angular/material';
import { WinComponent } from '../dialogs/result/win/win.component';
import { ExaequoComponent } from '../dialogs/result/exaequo/exaequo.component';
import { AudioService, Sound } from './audio.service';

@Injectable({
    providedIn: 'root'
})
export class GameOverService {

    private aliveCharacters: Character[];

    constructor(private store: Store<AppState>,
                private dialog: MatDialog,
                private audioService: AudioService) {
        store.select(charactersSelector).subscribe((characters) => {
            this.aliveCharacters = characters.filter(character => character.healthPoints > 0);
        });
    }

    public check(): void {
        if (this.aliveCharacters.length === 1) {
            this.audioService.playAudio(Sound.FINISH);
            this.dialog.open(WinComponent, {
                data: { winner: this.aliveCharacters[0] }
            });
        } else if (this.aliveCharacters.length === 0) {
            this.dialog.open(ExaequoComponent);
        }
    }

}
