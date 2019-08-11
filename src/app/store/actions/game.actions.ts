import {createAction, props} from '@ngrx/store';
import {Game} from '../models/game.model';

export const initGame = createAction(
    '[Game] Init',
    props<{ game: Game }>(),
);

export const gotoNextRound = createAction(
    '[Game] Goto next round',
);

export const gotoTimelineStep = createAction(
    '[Game] Goto timeline step',
    props<{ step: number }>(),
);
