import { Action, createReducer, on } from '@ngrx/store';
import { Arena } from '../models/arena.model';
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
    on(ArenaActions.updateArena, (state, action): Arena => action.updatedArena),
    on(ArenaActions.updateArenaFromFirebase, (state, action): Arena => action.updatedArena),
);

export function reducer(state: Arena | undefined, action: Action) {
    return arenaReducer(state, action);
}
