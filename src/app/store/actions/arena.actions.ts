import {createAction, props} from '@ngrx/store';
import {Arena} from '../models/arena.model';

export const initArena = createAction(
    '[Arena] Init',
    props<{ arena: Arena }>(),
);

export const updateArena = createAction(
    '[Arena] Update',
    props<{ updatedArena: Arena }>(),
);
