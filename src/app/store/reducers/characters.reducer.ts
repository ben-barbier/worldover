import {Action, createReducer, on} from '@ngrx/store';
import {Character} from '../models/character.model';
import {Position} from '../models/position.model';
import {SquareState} from '../models/square.model';
import * as CharactersActions from '../actions/characters.actions';
import * as ArenaActions from '../actions/arena.actions';
import * as GameActions from '../actions/game.actions';

export const initialState: Character[] = [];

export const charactersReducer = createReducer(
    initialState,
    on(CharactersActions.addCharacter, (state, action) => [...state, action.character]),
    on(CharactersActions.moveCharacter, (state, action) => {
        return state
            .filter(c => c.name !== action.character.name)
            .concat({
                ...action.character,
                position: action.destination,
                actionPoints: action.character.actionPoints - 1,
            });
    }),
    on(CharactersActions.attackCharacter, (state, action) => {
        return state
            .filter(c => c.name !== action.target.name)
            .concat({
                ...action.target,
                healthPoints: action.target.healthPoints - 1,
            })
            .filter(c => c.healthPoints > 0)
            .filter(c => c.name !== action.attacker.name)
            .concat({
                ...action.attacker,
                actionPoints: action.attacker.actionPoints - 1,
            });
    }),
    on(CharactersActions.updateAvailableActions, (state, action) => {
        const characterToUpdate = state.find(c => c.name === action.characterName);
        return state
            .filter(c => c.name !== action.characterName)
            .concat({...characterToUpdate, availableActions: action.availableActions});
    }),
    on(ArenaActions.updateArena, (state, action) => {

        const collapsedPositions = action.updatedArena.squares
            .filter(s => s.state === SquareState.collapsed)
            .map(s => s.position);

        return state
            .map(character => {
                const characterIsOnCollapsedSquare = collapsedPositions.some(cp => Position.equals(character.position, cp));
                if (characterIsOnCollapsedSquare) {
                    return {...character, healthPoints: 0, availableActions: []};
                }
                return character;
            })
            .filter(c => c.healthPoints > 0);

    }),
    on(GameActions.updateRound, (state, action) => {
        return [...state].map(c => ({...c, actionPoints: c.healthPoints}));
    }),
);

export function reducer(state: Character[] | undefined, action: Action) {
    return charactersReducer(state, action);
}
