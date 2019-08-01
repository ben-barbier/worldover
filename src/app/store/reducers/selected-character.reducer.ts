import {Action, createReducer, on} from '@ngrx/store';
import {Character} from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';
import * as SelectedCharacterActions from '../actions/selected-character.actions';
import * as GameActions from '../actions/game.actions';

export const initialState: Character = null;

export const selectedCharacterReducer = createReducer(
    initialState,
    on(SelectedCharacterActions.selectCharacter, (state, action) => action.character),
    on(GameActions.goToTheNextRound, (state, action) => null),
    on(CharactersActions.moveCharacter, (state, action) => ({
        ...action.character,
        position: action.destination,
        actionPoints: state.actionPoints - 1,
    })),
    on(CharactersActions.attackCharacter, (state, action) => ({
        ...action.attacker,
        actionPoints: state.actionPoints - 1,
    })),
    on(CharactersActions.updateAvailableActions, (state, action) => {
        if (state && action.characterName === state.name) {
            return {...state, availableActions: action.availableActions};
        }
        return state;
    }),
);

export function reducer(state: Character | undefined, action: Action) {
    return selectedCharacterReducer(state, action);
}
