import {Action, createReducer, on} from '@ngrx/store';
import {Arena} from '../models/arena.model';
import * as ArenaActions from '../actions/arena.actions';

export const initialState: Arena = {
    height: 0,
    width: 0,
    squares: [],
    collapseCount: 0,
};

export const arenaReducer = createReducer(
    initialState,
    on(ArenaActions.initArena, (state, action): Arena => action.arena),
    on(ArenaActions.collapseArena, (state, action): Arena => action.collapsedArena),
);

export function reducer(state: Arena | undefined, action: Action) {
    return arenaReducer(state, action);
}
