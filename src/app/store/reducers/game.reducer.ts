import * as GameActions from '../actions/game.actions';
import {Action, createReducer, on} from '@ngrx/store';
import {Game} from '../models/game.model';

export const initialState: Game = {
    round: 1,
};

export const gameReducer = createReducer(
    initialState,
    on(GameActions.goToTheNextRound, (state, action): Game => ({...state, round: state.round + 1})),
);

export function reducer(state: Game | undefined, action: Action) {
    return gameReducer(state, action);
}
