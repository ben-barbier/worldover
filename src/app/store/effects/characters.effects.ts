import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {switchMap, tap} from 'rxjs/operators';
import {AppState} from '../app.state';
import {State} from '@ngrx/store';
import {Character} from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';
import * as ArenaActions from '../actions/arena.actions';
import * as GameActions from '../actions/game.actions';
import {MatDialog} from '@angular/material';
import {WinComponent} from '../../dialogs/result/win/win.component';
import {ExaequoComponent} from '../../dialogs/result/exaequo/exaequo.component';

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
            ofType(GameActions.updateRound),
            switchMap(this.refreshAllAvailableActions.bind(this)),
        )
    );

    gameFinished$ = createEffect(() =>
        this.actions.pipe(
            ofType(CharactersActions.attackCharacter, ArenaActions.updateArena),
            tap(() => {
                const characters: Character[] = this.state.getValue().characters;
                const aliveCharacters = characters.filter(c => c.healthPoints > 0);
                if (aliveCharacters.length === 1) {
                    this.dialog.open(WinComponent, {
                        data: {winner: aliveCharacters[0]}
                    });
                } else if (aliveCharacters.length === 0) {
                    this.dialog.open(ExaequoComponent);
                }
            }),
        ), {dispatch: false});

    constructor(private actions: Actions,
                private state: State<AppState>,
                private characterService: CharacterService,
                private dialog: MatDialog) {
    }

}
