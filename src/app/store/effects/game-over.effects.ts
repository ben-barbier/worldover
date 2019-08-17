import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {tap} from 'rxjs/operators';
import {AppState, charactersSelector} from '../app.state';
import {Store} from '@ngrx/store';
import {Character} from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';
import * as ArenaActions from '../actions/arena.actions';
import {MatDialog} from '@angular/material';
import {WinComponent} from '../../dialogs/result/win/win.component';
import {ExaequoComponent} from '../../dialogs/result/exaequo/exaequo.component';
import {AudioService, Sound} from '../../services/audio.service';

@Injectable()
export class GameOverEffects {

    private characters: Character[];

    gameOver$ = createEffect(() =>
        this.actions.pipe(
            ofType(
                CharactersActions.damageCharacter,
                CharactersActions.killCharacter,
                ArenaActions.updateArena
            ),
            tap(() => {
                const aliveCharacters = this.characters.filter(c => c.healthPoints > 0);
                if (aliveCharacters.length === 1) {
                    this.audioService.playAudio(Sound.FINISH);
                    this.dialog.open(WinComponent, {
                        data: {winner: aliveCharacters[0]}
                    });
                } else if (aliveCharacters.length === 0) {
                    this.dialog.open(ExaequoComponent);
                }
            }),
        ), {dispatch: false});

    constructor(private actions: Actions,
                private store: Store<AppState>,
                private characterService: CharacterService,
                private dialog: MatDialog,
                private audioService: AudioService) {
        store.select(charactersSelector).subscribe(characters => this.characters = characters);
    }

}
