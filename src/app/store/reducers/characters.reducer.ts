import {Action, createReducer, on} from '@ngrx/store';
import {Character} from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';
import * as ArenaActions from '../actions/arena.actions';
import {Position} from '../models/position.model';

export const initialState: Character[] = [];

export const charactersReducer = createReducer(
    initialState,
    on(CharactersActions.addCharacter, (state, action) => [...state, action.character]),
    on(CharactersActions.moveCharacter, (state, action) => {
        // TODO: remove one action point on character
        return state
            .filter(c => c.name !== action.character.name)
            .concat({...action.character, position: action.destination});
    }),
    on(CharactersActions.updateAvailableActions, (state, action) => {
        const characterToUpdate = state.find(c => c.name === action.characterName);
        return state
            .filter(c => c.name !== action.characterName)
            .concat({...characterToUpdate, availableActions: action.availableActions});
    }),
    on(ArenaActions.collapseArena, (state, action) => {

        const collapsedPositions = action.collapsedArena.squares
            .filter(s => s.collapsed)
            .map(s => s.position);

        return state.map(character => {
            const characterIsOnCollapsedSquare = collapsedPositions.some(cp => Position.equals(character.position, cp));
            if (characterIsOnCollapsedSquare) {
                return {...character, healthPoints: 0, availableActions: []};
            }
            return character;
        });

    }),
);

export function reducer(state: Character[] | undefined, action: Action) {
    return charactersReducer(state, action);
}
