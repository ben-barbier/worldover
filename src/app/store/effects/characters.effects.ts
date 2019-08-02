import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {concatMap, first, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {AppState, arenaSelector, charactersSelector} from '../app.state';
import {select, State, Store} from '@ngrx/store';
import {Character} from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';
import * as ArenaActions from '../actions/arena.actions';
import * as GameActions from '../actions/game.actions';
import {of} from 'rxjs';

@Injectable()
export class CharactersEffects {

    private refreshAllAvailableActions = ((characters: Character[]) => {
        return characters.map(character => CharactersActions.updateAvailableActions({
            characterName: character.name,
            availableActions: this.characterService.getAvailableActions(character),
        }));
    });

    moveCharacter$ = createEffect(() =>
        this.actions.pipe(
            ofType(CharactersActions.moveCharacter),
            concatMap(action => of(action).pipe(
                withLatestFrom(this.store.pipe(select(charactersSelector)))
            )),
            switchMap(([action, characters]) => {
                const otherCharacters = characters.filter(c => c.name !== action.character.name);
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
            ofType(ArenaActions.collapseArena),
            mergeMap(() => this.store.pipe(select(charactersSelector))),
            first(),
            switchMap(this.refreshAllAvailableActions.bind(this)),
        )
    );

    attackCharacter$ = createEffect(() =>
        this.actions.pipe(
            ofType(CharactersActions.attackCharacter),
            mergeMap(() => this.store.pipe(select(charactersSelector))),
            first(),
            switchMap(this.refreshAllAvailableActions.bind(this)),
        )
    );

    goToTheNextRound$ = createEffect(() =>
        this.actions.pipe(
            ofType(GameActions.updateRound),
            mergeMap(() => this.store.pipe(select(charactersSelector))),
            first(),
            switchMap(this.refreshAllAvailableActions.bind(this)),
        )
    );

    constructor(private actions: Actions,
                private store: Store<AppState>,
                private characterService: CharacterService) {
    }

}
