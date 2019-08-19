import * as GameActions from '../actions/game.actions';
import * as CharactersActions from '../actions/characters.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { Game } from '../models/game.model';

export const initialState: Game = {
    round: 1,
    roundTimeline: [],
    timelineCurrentStep: 1,
};

export const gameReducer = createReducer(
    initialState,
    on(GameActions.initGame, (state, action) => action.game),
    on(GameActions.gotoTimelineStep, (state, action) => ({ ...state, timelineCurrentStep: action.step })),
    on(GameActions.updateRoundNumber, (state, action): Game => {
        const firstAliveCharacterIdx = state.roundTimeline.findIndex(c => c.alive) + 1;
        return { ...state, round: state.round + 1, timelineCurrentStep: firstAliveCharacterIdx };
    }),
    on(CharactersActions.damageCharacter, (state, action) => {
        const targetHealthAfterAttack = action.character.healthPoints - action.damage;
        if (targetHealthAfterAttack <= 0) {
            return {
                ...state,
                roundTimeline: state.roundTimeline.map((character) => {
                    if (character.name === action.character.name) {
                        return { ...character, alive: false };
                    }
                    return character;
                })
            };
        }
        return state;
    }),
    on(CharactersActions.killCharacter, (state, action) => {
        return {
            ...state,
            roundTimeline: state.roundTimeline.map((character) => {
                if (character.name === action.character.name) {
                    return { ...character, alive: false };
                }
                return character;
            })
        };
    }),
);

export function reducer(state: Game | undefined, action: Action) {
    return gameReducer(state, action);
}
