import * as SelectedCharacterActions from '../actions/selected-character.actions';
import * as ArenaActions from '../actions/arena.actions';
import {Action, createReducer, on} from '@ngrx/store';
import {Character} from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';

export const initialState: Character = null;

export const selectedCharacterReducer = createReducer(
    initialState,
    on(SelectedCharacterActions.selectCharacter, (state, action) => action.character),
    on(CharactersActions.moveCharacter, (state, action) => ({...action.character, position: action.destination})),
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
