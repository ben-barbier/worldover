import {createAction, props} from '@ngrx/store';

export const updateRound = createAction(
    '[Game] Update round',
    props<{ round: number }>(),
);
