import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {switchMap} from 'rxjs/operators';
import {AppState} from '../app.state';
import {State} from '@ngrx/store';
import {Character} from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';
import * as ArenaActions from '../actions/arena.actions';
import * as GameActions from '../actions/game.actions';
import {MatDialog} from '@angular/material';
import {AudioService} from '../../services/audio.service';

@Injectable()
export class CharactersEffects {

    private refreshAllAvailableActions = (() => {
        const characters: Character[] = this.state.getValue().characters;
        return characters.map(character => CharactersActions.updateAvailableActions({
            characterName: character.name,
            availableActions: this.characterService.getAvailableActions(character),
        }));
    });

    moveCharacter$ = createEffect(() =>
        this.actions.pipe(
            ofType(CharactersActions.moveCharacter),
            switchMap(action => {
                const otherCharacters = this.state.getValue().characters.filter(c => c.name !== action.character.name);
                return [
                    CharactersActions.updateAvailableActions({
                        characterName: action.character.name,
                        availableActions: this.characterService.getAvailableActions({
                            ...action.character,
                            position: action.destination,
                            actionPoints: action.character.actionPoints - 1,
                        }),
                    }),
                    ...otherCharacters.map(oc => CharactersActions.updateAvailableActions({
                            characterName: oc.name,
                            availableActions: this.characterService.getAvailableActions(oc),
                        })
                    )
                ];
            }),
        )
    );

    collapseArena$ = createEffect(() =>
        this.actions.pipe(
            ofType(ArenaActions.updateArena),
            switchMap(this.refreshAllAvailableActions.bind(this)),
        )
    );

    attackCharacter$ = createEffect(() =>
        this.actions.pipe(
            ofType(CharactersActions.attackCharacter),
            switchMap(this.refreshAllAvailableActions.bind(this)),
        )
    );

    goToTheNextRound$ = createEffect(() =>
        this.actions.pipe(
            ofType(GameActions.updateRoundNumber),
            switchMap(this.refreshAllAvailableActions.bind(this)),
        )
    );

    constructor(private actions: Actions,
                private state: State<AppState>,
                private characterService: CharacterService,
                private dialog: MatDialog,
                private audioService: AudioService) {
    }

}
