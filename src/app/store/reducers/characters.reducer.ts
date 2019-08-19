import { Action, createReducer, on } from '@ngrx/store';
import { Character } from '../models/character.model';
import * as CharactersActions from '../actions/characters.actions';
import * as GameActions from '../actions/game.actions';

export const initialState: Character[] = [];

export const charactersReducer = createReducer(
    initialState,
    on(CharactersActions.addCharacter, (state, action) => {
        if (state.length === 0) {
            return [{ ...action.character, selected: true }];
        }
        return [...state, action.character];
    }),
    on(CharactersActions.moveCharacter, (state, action) => {
        return state
            .filter(c => c.name !== action.character.name)
            .concat({
                ...action.character,
                position: action.destination,
                actionPoints: action.character.actionPoints - 1,
                orientation: action.orientation,
            });
    }),
    on(CharactersActions.attackCharacter, (state, action) => {
        return state
            .filter(c => c.name !== action.attacker.name)
            .concat({
                ...action.attacker,
                actionPoints: action.attacker.actionPoints - 1,
                orientation: action.orientation,
            });
    }),
    on(CharactersActions.damageCharacter, (state, action) => {
        return state
            .filter(c => c.name !== action.character.name)
            .concat({
                ...action.character,
                healthPoints: action.character.healthPoints - 1,
            });
    }),
    on(CharactersActions.killCharacter, (state, action) => {
        return state
            .filter(c => c.name !== action.character.name)
            .concat({
                ...action.character,
                healthPoints: 0,
                availableActions: [],
            });
    }),
    on(CharactersActions.updateAvailableActions, (state, action) => {
        const characterToUpdate = state.find(c => c.name === action.characterName);
        return state
            .filter(c => c.name !== action.characterName)
            .concat({ ...characterToUpdate, availableActions: action.availableActions });
    }),
    on(CharactersActions.selectCharacter, (state, action) => {
        const characterToSelect = state.find(c => c.name === action.characterName);
        return state
            .map(c => ({ ...c, selected: false }))
            .filter(c => c.name !== action.characterName)
            .concat({ ...characterToSelect, selected: true });
    }),
    on(GameActions.updateRoundNumber, (state, action) => {
        return [...state].map(c => ({ ...c, actionPoints: c.healthPoints }));
    }),
);

export function reducer(state: Character[] | undefined, action: Action) {
    return charactersReducer(state, action);
}
