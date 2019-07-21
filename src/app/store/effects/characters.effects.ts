import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {switchMap} from 'rxjs/operators';
import * as CharactersActions from '../actions/characters.actions';
import * as ArenaActions from '../actions/arena.actions';
import {AppState} from '../app.state';
import {State} from '@ngrx/store';
import {Character} from '../models/character.model';

@Injectable()
export class CharactersEffects {

    moveCharacter$ = createEffect(() =>
        this.actions.pipe(
            ofType(CharactersActions.moveCharacter),
            switchMap(action => {
                const otherCharacters = this.state.getValue().characters.filter(c => c.name !== action.character.name);
                return [
                    CharactersActions.updateAvailableActions({
                        characterName: action.character.name,
                        availableActions: this.characterService.getAvailableActions({...action.character, position: action.destination}),
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

    $collapseArena = createEffect(() =>
        this.actions.pipe(
            ofType(ArenaActions.collapseArena),
            switchMap(action => {
                const characters: Character[] = this.state.getValue().characters;
                return characters.map(character => CharactersActions.updateAvailableActions({
                    characterName: character.name,
                    availableActions: this.characterService.getAvailableActions(character),
                }));
            })
        )
    );

    constructor(private actions: Actions,
                private state: State<AppState>,
                private characterService: CharacterService) {
    }

}
