import {createAction, props} from '@ngrx/store';
import {Arena} from '../models/arena.model';

export const initArena = createAction(
    '[Arena] Init',
    props<{ arena: Arena }>(),
);

export const collapseArena = createAction(
    '[Arena] Collapse',
    props<{ collapsedArena: Arena }>(),
);
